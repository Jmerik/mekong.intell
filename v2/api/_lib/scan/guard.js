// Input checks: what a visitor may ask us to look at, and which email addresses get an automatic reply.
const { domainToASCII } = require('node:url');
const net = require('node:net');

const FREE_MAIL = new Set([
    'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'gmx.de', 'web.de', 'mail.com',
    'zoho.com', 'yandex.com', 'qq.com', '163.com', '126.com'
]);
const DISPOSABLE = new Set([
    'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'maildrop.cc',
    'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'mailnesia.com', 'tempail.com', 'mohmal.com'
]);
const INTERNAL_SUFFIXES = ['.local', '.internal', '.lan', '.home', '.corp', '.intranet', '.localhost', '.test', '.example', '.invalid', '.onion'];
const LABEL = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

function validDomain(host) {
    if (!host || host.length > 253 || net.isIP(host)) return false;
    const labels = host.split('.');
    if (labels.length < 2) return false;
    if (!labels.every((l) => LABEL.test(l))) return false;
    const tld = labels[labels.length - 1];
    if (!/^([a-z]{2,24}|xn--[a-z0-9-]{2,59})$/.test(tld)) return false;
    if (host === 'localhost' || INTERNAL_SUFFIXES.some((s) => host.endsWith(s))) return false;
    return true;
}

// Public social pages that can be scanned in place of a website. The handle is the only part of the link that is kept.
const SOCIAL_HOSTS = { 'facebook.com': 'facebook', 'fb.com': 'facebook', 'fb.me': 'facebook', 'instagram.com': 'instagram', 't.me': 'telegram', 'telegram.me': 'telegram' };
const SOCIAL_NAME = { facebook: 'Facebook', instagram: 'Instagram', telegram: 'Telegram' };
const HANDLE_RE = { facebook: /^[A-Za-z0-9._-]{3,80}$/, instagram: /^[A-Za-z0-9._]{1,30}$/, telegram: /^[A-Za-z0-9_]{5,32}$/ };
// First path segments that are not a page: sharing, login, groups, posts, profiles by number and so on.
const NOT_A_PAGE = new Set([
    'share', 'sharer', 'sharer.php', 'dialog', 'login', 'login.php', 'groups', 'events', 'marketplace', 'watch', 'hashtag', 'photo', 'photo.php',
    'permalink.php', 'story.php', 'profile.php', 'people', 'public', 'policies', 'help', 'ads', 'gaming', 'stories', 'reel', 'reels', 'videos',
    'search', 'plugins', 'p', 'tv', 'explore', 'accounts', 'direct', 'joinchat', 'addstickers', 'share.php'
]);

function parseSocial(host, path) {
    const key = Object.keys(SOCIAL_HOSTS).find((h) => host === h || host.endsWith(`.${h}`));
    if (!key) return null;
    const platform = SOCIAL_HOSTS[key];
    let segments = path.split('/').filter(Boolean).map((part) => { try { return decodeURIComponent(part); } catch { return part; } });
    // /pg/<page>, /pages/<page>/<id> and t.me/s/<channel> all carry the page name in the second segment.
    if (segments.length > 1 && ['pg', 'pages', 's'].includes(segments[0].toLowerCase())) segments = segments.slice(1);
    const handle = segments[0] || '';
    if (!handle || NOT_A_PAGE.has(handle.toLowerCase()) || !HANDLE_RE[platform].test(handle)) return { error: 'social_link' };
    return { kind: 'social', platform, handle };
}

// Turn what the visitor typed into a safe target, or say why not.
//   { kind: 'domain', domain }            a website address (scheme, path, "www." and case are ignored)
//   { kind: 'social', platform, handle }  a public Facebook, Instagram or Telegram page link (only the handle is kept)
//   { kind: 'name', name }                a company name (letters, digits, marks and . & ' , - ( ) only)
//   { error }                             anything else
function normalizeTarget(input) {
    const raw = typeof input === 'string' ? input.trim() : '';
    if (!raw || raw.length > 300) return { error: 'empty_or_long' };

    if (!/\s/.test(raw)) {
        const looksLikeAddress = /[./:]/.test(raw);
        if (looksLikeAddress) {
            const text = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
            if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) return { error: 'scheme' };   // javascript:, file:, ftp: ...
            const hostPart = text.split(/[/?#]/)[0];
            if (/@/.test(hostPart)) return { error: 'credentials' };
            if (/:\d+$/.test(hostPart)) return { error: 'port' };
            const host = domainToASCII(hostPart.toLowerCase().replace(/^www\./, ''));
            if (!validDomain(host)) return { error: 'bad_domain' };
            const social = parseSocial(host, text.slice(hostPart.length).split(/[?#]/)[0]);
            if (social) return social;
            return { kind: 'domain', domain: host };
        }
    }
    const name = sanitizeName(raw);
    if (name.length < 2) return { error: 'bad_name' };
    return { kind: 'name', name };
}

// How a target is written in emails, Telegram and the report: "example.com", "Angkor Cafe, Siem Reap", "angkorcafe (Facebook)".
function targetLabel(target) {
    const base = target.kind === 'domain' ? target.domain : target.kind === 'social' ? `${target.handle} (${SOCIAL_NAME[target.platform]})` : target.name;
    return target.location ? `${base}, ${target.location}` : base;
}

// Letters, combining marks (Khmer vowel signs and subscripts are marks), digits, spaces and . & ' , - ( ) only.
// Everything else (quotes, brackets, slashes, newlines, control characters, HTML) is removed, so a company name can never carry instructions or markup.
function sanitizeName(text) {
    return String(text || '')
        .normalize('NFKC')
        .replace(/[^\p{L}\p{M}\p{N} .&',()-]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
}

const emailDomain = (email) => String(email || '').split('@').pop().toLowerCase();
const isDisposableEmail = (email) => DISPOSABLE.has(emailDomain(email));
const isFreeMail = (email) => FREE_MAIL.has(emailDomain(email));

// The address belongs to the business being scanned (same domain, or one is a subdomain of the other).
function emailMatchesTarget(email, target) {
    if (!target || target.kind !== 'domain' || isFreeMail(email) || isDisposableEmail(email)) return false;
    const a = emailDomain(email).replace(/^www\./, '');
    const b = target.domain;
    return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

module.exports = { normalizeTarget, targetLabel, sanitizeName, validDomain, emailDomain, isDisposableEmail, isFreeMail, emailMatchesTarget };

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

// Turn what the visitor typed into a safe target, or say why not.
//   { kind: 'domain', domain }   a website address (scheme, path, "www." and case are ignored)
//   { kind: 'name', name }       a company name (letters, digits and . & ' , - ( ) only)
//   { error }                    anything else
function normalizeTarget(input) {
    const raw = typeof input === 'string' ? input.trim() : '';
    if (!raw || raw.length > 300) return { error: 'empty_or_long' };

    if (!/\s/.test(raw)) {
        const looksLikeAddress = /[./:]/.test(raw);
        if (looksLikeAddress) {
            let text = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
            if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) return { error: 'scheme' };   // javascript:, file:, ftp: ...
            if (/@/.test(text.split(/[/?#]/)[0])) return { error: 'credentials' };
            text = text.split(/[/?#]/)[0];
            if (/:\d+$/.test(text)) return { error: 'port' };
            const host = domainToASCII(text.toLowerCase().replace(/^www\./, ''));
            if (!validDomain(host)) return { error: 'bad_domain' };
            return { kind: 'domain', domain: host };
        }
    }
    const name = sanitizeName(raw);
    if (name.length < 2) return { error: 'bad_name' };
    return { kind: 'name', name };
}

// Letters, digits, spaces and . & ' , - ( ) only. Everything else (quotes, brackets, slashes, newlines,
// control characters, HTML) is removed, so a company name can never carry instructions or markup.
function sanitizeName(text) {
    return String(text || '')
        .normalize('NFKC')
        .replace(/[^\p{L}\p{N} .&',()-]/gu, ' ')
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

module.exports = { normalizeTarget, sanitizeName, validDomain, emailDomain, isDisposableEmail, isFreeMail, emailMatchesTarget };

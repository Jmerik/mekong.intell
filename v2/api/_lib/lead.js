const { PACKAGES, AUDIENCES, FOCUS } = require('../../shared/packages');

const LIMITS = { name: 100, email: 254, telegram: 64, phone: 32, website: 300, message: 1500 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_RE = /^@?[A-Za-z0-9_]{5,32}$/;
const PHONE_RE = /^\+?[0-9 ()-]{6,20}$/;

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

// Returns { lead, errors }. `errors` maps field name -> message and is empty when valid.
function validateLead(body = {}) {
    const lead = {
        name: clean(body.name),
        email: clean(body.email),
        telegram: clean(body.telegram),
        phone: clean(body.phone),
        website: clean(body.website),
        message: clean(body.message),
        audience: clean(body.audience) || 'general',
        focus: clean(body.focus),
        packageType: clean(body.packageType)
    };
    const errors = {};

    for (const [field, max] of Object.entries(LIMITS)) {
        if (lead[field].length > max) errors[field] = `Please keep this under ${max} characters.`;
    }
    // The Quick Look only needs a website (or company name) and an email. Name, Telegram and phone are optional.
    // Every other request also needs a name so we know who to reply to.
    if (!lead.name && lead.packageType !== 'quicklook') errors.name = 'Please enter your name.';
    if (!EMAIL_RE.test(lead.email)) errors.email = 'Please enter a valid email address.';
    if (lead.telegram && !TELEGRAM_RE.test(lead.telegram)) errors.telegram = 'Telegram usernames are 5 to 32 letters, numbers or underscores.';
    if (lead.phone && !PHONE_RE.test(lead.phone)) errors.phone = 'Please enter a valid phone number.';
    if (!PACKAGES[lead.packageType]) errors.packageType = 'Unknown request type.';
    if (!AUDIENCES[lead.audience]) errors.audience = 'Unknown audience.';
    if (lead.focus && !FOCUS[lead.focus]) errors.focus = 'Unknown focus.';
    if (lead.packageType === 'quicklook' && !lead.website) {
        errors.website = 'Please enter your website or company name.';
    }

    return { lead, errors };
}

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Telegram "HTML" parse mode only needs &, < and > escaped, so anything a visitor types
// (underscores in usernames and emails included) arrives as typed.
function formatTelegramMessage(lead, { scannerNote } = {}) {
    const row = (label, value) => `<b>${label}:</b> ${value ? escapeHtml(value) : '-'}`;
    const lines = [
        `🚨 <b>New lead: ${escapeHtml(PACKAGES[lead.packageType].name)}</b>`,
        '',
        row('Name', lead.name),
        row('Email', lead.email),
        row('Telegram', lead.telegram),
        row('Phone', lead.phone),
        row('Website / company', lead.website),
        row('Audience', AUDIENCES[lead.audience]),
        row('Focus', FOCUS[lead.focus])
    ];
    if (lead.message) lines.push('', `<b>Message:</b>\n${escapeHtml(lead.message)}`);
    if (scannerNote) lines.push('', `<i>${escapeHtml(scannerNote)}</i>`);
    return lines.join('\n');
}

module.exports = { validateLead, formatTelegramMessage, escapeHtml };

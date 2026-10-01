const { PACKAGES, GOALS } = require('../shared/packages');

const LIMITS = { name: 100, email: 254, telegram: 64, phone: 32, website: 300 };
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
        goal: clean(body.goal),
        packageType: clean(body.packageType)
    };
    const errors = {};

    for (const [field, max] of Object.entries(LIMITS)) {
        if (lead[field].length > max) errors[field] = `Please keep this under ${max} characters.`;
    }
    if (!lead.name) errors.name = 'Please enter your name.';
    if (!EMAIL_RE.test(lead.email)) errors.email = 'Please enter a valid email address.';
    if (!lead.telegram && !lead.phone) {
        errors.contact = 'Please add a Telegram username or a phone number.';
    }
    if (lead.telegram && !TELEGRAM_RE.test(lead.telegram)) errors.telegram = 'Telegram usernames are 5–32 letters, numbers or underscores.';
    if (lead.phone && !PHONE_RE.test(lead.phone)) errors.phone = 'Please enter a valid phone number.';
    if (lead.goal && !GOALS[lead.goal]) errors.goal = 'Please choose an objective from the list.';
    if (!PACKAGES[lead.packageType]) errors.packageType = 'Unknown package.';

    return { lead, errors };
}

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Telegram "HTML" parse mode only needs &, < and > escaped, so any character a
// visitor types (underscores in usernames and emails included) is delivered as-is.
function formatTelegramMessage(lead) {
    const row = (label, value) => `<b>${label}:</b> ${value ? escapeHtml(value) : '—'}`;
    return [
        `🚨 <b>New lead: ${escapeHtml(PACKAGES[lead.packageType].name)}</b>`,
        '',
        row('Name', lead.name),
        row('Email', lead.email),
        row('Telegram', lead.telegram),
        row('Phone', lead.phone),
        row('Website', lead.website),
        row('Goal', GOALS[lead.goal])
    ].join('\n');
}

module.exports = { validateLead, formatTelegramMessage, escapeHtml };

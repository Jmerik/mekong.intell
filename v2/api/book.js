// Vercel serverless function: POST /api/book
//
// Every valid request is written to ALL configured destinations at once:
//   - Telegram  (instant notification)   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
//   - Google Sheet (durable record)      LEAD_SHEET_WEBHOOK_URL, LEAD_SHEET_SECRET
// The visitor sees success if at least one destination accepted the lead, and an error only if every
// configured destination failed. A lead is never reported as sent when nothing received it.
const { validateLead, formatTelegramMessage } = require('./_lib/lead');
const { isLimited, clientKey } = require('./_lib/rateLimit');
const sheet = require('./_lib/sheet');
const telegram = require('./_lib/telegram');
const { createScanner } = require('./_lib/scan/index');
const { PACKAGES } = require('../shared/packages');

const telegramConfigured = () => telegram.isConfigured();
const sendToTelegram = (text) => telegram.send(text);

// Why a Quick Look did not start the automatic path (shown to the team in Telegram, never to the visitor).
const MANUAL_REASONS = {
    not_configured: 'Scanner not connected yet',
    bad_target: 'the website, page link or name was not usable',
    disposable_email: 'disposable email address',
    switched_off: 'automatic scans are switched off',
    daily_budget: "today's scan budget is used up",
    monthly_budget: "this month's scan budget is used up",
    recent_scan: 'this website was scanned in the last 30 days',
    rate_ip: 'too many requests from this network',
    rate_email: 'too many requests for this email address',
    rate_global: 'too many scan requests this hour',
    email_failed: 'the confirmation email could not be sent',
    error: 'a technical problem'
};

// One shared scanner per server instance. It is inert unless SCAN_ENABLED=1 and everything it needs is set up.
const defaultScanner = () => createScanner({
    notify: (text) => (telegramConfigured() ? sendToTelegram(text) : Promise.resolve()),
    recordRow: (lead, status) => (sheet.isConfigured() ? sheet.appendToSheet(lead, { status }) : Promise.resolve())
});

function createHandler({ scanner = defaultScanner() } = {}) {
return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};

    // Honeypot: real visitors never see or fill this field, bots usually do.
    // Answer like a success so the bot has no reason to retry.
    if (body.company_fax) {
        return res.status(200).json({ success: true });
    }

    if (isLimited(clientKey(req))) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again in a few minutes, or message us on Telegram.'
        });
    }

    const { lead, errors } = validateLead(body);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    // Quick Look: start the automatic path only when the scanner is fully set up and every guard allows it
    // (see api/_lib/scan/index.js). Otherwise the team prepares it by hand, exactly as before.
    let scannerNote;
    let verify = false;
    if (lead.packageType === 'quicklook') {
        const admission = await scanner.admit({ lead, ip: clientKey(req) });
        if (admission.action === 'verify') {
            verify = true;
            scannerNote = 'Waiting for the visitor to confirm their email. The automatic scan starts after that and a draft follows here.';
        } else {
            scannerNote = `${MANUAL_REASONS[admission.reason] || 'Automatic scan not started'}: prepare this Quick Look by hand.`;
        }
    }

    const destinations = [];
    if (telegramConfigured()) {
        destinations.push({ name: 'telegram', send: () => sendToTelegram(formatTelegramMessage(lead, { scannerNote })) });
    }
    if (sheet.isConfigured()) {
        destinations.push({ name: 'sheet', send: () => sheet.appendToSheet(lead) });
    }

    if (destinations.length === 0) {
        // Nothing configured (local development or a fresh preview): keep the lead in the function logs.
        console.warn('No lead destination configured (Telegram or Google Sheet). Lead not stored:', lead);
        return res.status(200).json({ success: true, delivered: false, verify });
    }

    const results = await Promise.allSettled(destinations.map((d) => d.send()));
    const failed = results
        .map((result, i) => ({ name: destinations[i].name, result }))
        .filter(({ result }) => result.status === 'rejected');

    for (const { name, result } of failed) {
        console.error(`Lead destination "${name}" failed:`, result.reason && result.reason.message);
    }

    if (failed.length === destinations.length) {
        // Last resort: keep the full lead in the logs so it can be recovered by hand (Hobby keeps logs for 1 hour).
        console.error('All lead destinations failed; lead kept here for manual follow-up:', lead);
        return res.status(502).json({
            success: false,
            message: 'We could not send your request just now. Please try again, or message us directly on Telegram at @mekongintelligence.'
        });
    }

    console.log(`New lead stored (${PACKAGES[lead.packageType].name}) in ${destinations.length - failed.length}/${destinations.length} destinations.`);
    return res.status(200).json({ success: true, delivered: true, verify });
};
}

module.exports = createHandler();
module.exports.createHandler = createHandler;

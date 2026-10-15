// Vercel serverless function: POST /api/book
//
// Every valid request is written to ALL configured destinations at once:
//   - Telegram  (instant notification)   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
//   - Google Sheet (durable record)      LEAD_SHEET_WEBHOOK_URL, LEAD_SHEET_SECRET
// The visitor sees success if at least one destination accepted the lead, and an error only if every
// configured destination failed. A lead is never reported as sent when nothing received it.
const { validateLead, formatTelegramMessage } = require('./_lib/lead');
const { isLimited, clientKey } = require('./_lib/rateLimit');
const { runQuickLook } = require('./_lib/scanner');
const sheet = require('./_lib/sheet');
const { PACKAGES } = require('../shared/packages');

const telegramConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

async function sendToTelegram(text) {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        }),
        signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
        throw new Error(`Telegram API ${response.status}: ${await response.text()}`);
    }
}

module.exports = async function handler(req, res) {
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

    // SCANNER PLACEHOLDER: see api/_lib/scanner.js for the contract the real scanner must follow.
    let scannerNote;
    if (lead.packageType === 'quicklook') {
        const scan = await runQuickLook({ target: lead.website });
        if (scan.status === 'not_configured') {
            scannerNote = 'Scanner not connected yet: prepare this Quick Look by hand.';
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
        return res.status(200).json({ success: true, delivered: false });
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
    return res.status(200).json({ success: true, delivered: true });
};

// Vercel serverless function: POST /api/book
const { validateLead, formatTelegramMessage } = require('./_lib/lead');
const { isLimited, clientKey } = require('./_lib/rateLimit');
const { runQuickLook } = require('./_lib/scanner');
const { PACKAGES } = require('../shared/packages');

async function sendToTelegram(text) {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
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

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
        // Not configured (for example a fresh preview deployment): keep the lead in the function logs.
        console.warn('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set. Lead not delivered:', lead);
        return res.status(200).json({ success: true, delivered: false });
    }

    try {
        await sendToTelegram(formatTelegramMessage(lead, { scannerNote }));
        console.log(`New lead delivered (${PACKAGES[lead.packageType].name}).`);
        return res.status(200).json({ success: true, delivered: true });
    } catch (error) {
        // Keep the full lead in the logs so it can be recovered by hand.
        console.error('Telegram delivery failed; lead kept here for manual follow-up:', error.message, lead);
        return res.status(502).json({
            success: false,
            message: 'We could not send your request just now. Please try again, or message us directly on Telegram at @mekongintelligence.'
        });
    }
};

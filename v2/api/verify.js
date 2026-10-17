// Vercel serverless function: POST /api/verify  { "t": "<token from the email>" }
//
// The emailed link opens a static page with a button (/confirm or /bestaetigen). Only the button's POST ends up
// here, so email security scanners that merely open links cannot confirm a request or start a scan.
// The token is single use. After a valid confirmation the scan runs in the background (waitUntil), so the
// visitor gets their answer immediately.
const { createScanner } = require('./_lib/scan/index');
const sheet = require('./_lib/sheet');
const telegram = require('./_lib/telegram');
const { clientKey } = require('./_lib/rateLimit');

const defaultScanner = () => createScanner({
    notify: (text) => (telegram.isConfigured() ? telegram.send(text) : Promise.resolve()),
    recordRow: (lead, status) => (sheet.isConfigured() ? sheet.appendToSheet(lead, { status }) : Promise.resolve())
});

function defer(promise) {
    const guarded = Promise.resolve(promise).catch((error) => console.error('Background scan failed:', error && error.message));
    try { require('@vercel/functions').waitUntil(guarded); } catch { /* not on Vercel: the process stays alive anyway */ }
}

function createHandler({ scanner = defaultScanner(), run = defer } = {}) {
    return async function handler(req, res) {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Referrer-Policy', 'no-referrer');
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ status: 'error' });
        }
        const token = req.body && typeof req.body === 'object' ? req.body.t : '';
        try {
            if (scanner.store && (await scanner.rateHit(`verify:${clientKey(req)}`, 3600)) > 30) return res.status(429).json({ status: 'error' });
            const result = await scanner.confirm(token);
            if (result.status === 'ok') {
                run(scanner.execute(result.payload));
                return res.status(200).json({ status: 'ok' });
            }
            if (result.status === 'duplicate') {
                // Scanned recently: no new automatic scan. The lead was already saved, so the team handles it.
                if (telegram.isConfigured()) await telegram.send(`ℹ️ Quick Look confirmed for a website that was scanned in the last 30 days. Please handle it by hand: ${result.payload.target.domain}`).catch(() => {});
                return res.status(200).json({ status: 'ok' });
            }
            return res.status(200).json({ status: 'expired' });
        } catch (error) {
            console.error('Verify failed:', error && error.message);
            return res.status(500).json({ status: 'error' });
        }
    };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;

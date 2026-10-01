const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { validateLead, formatTelegramMessage } = require('./lib/lead');
const { PACKAGES } = require('./shared/packages');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Render sits behind one proxy; this makes req.ip the visitor's IP for rate limiting.
app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", 'https://www.googletagmanager.com'],
            connectSrc: ["'self'", 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
            imgSrc: ["'self'", 'data:', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
            styleSrc: ["'self'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            // The site is only served over HTTPS in production; leaving this on breaks local http testing.
            upgradeInsecureRequests: null
        }
    }
}));

app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Static files. Built CSS/JS are cache-busted with ?v=<hash>, so they can be cached for a long time.
app.use(express.static(PUBLIC_DIR, {
    extensions: ['html'],
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));

const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again in a few minutes, or message us on Telegram.' }
});

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

// Booking Endpoint
app.post('/api/book', bookingLimiter, async (req, res) => {
    // Honeypot: real visitors never see or fill this field, bots usually do.
    // Answer like a success so the bot has no reason to retry.
    if (req.body && req.body.company_fax) {
        return res.status(200).json({ success: true });
    }

    const { lead, errors } = validateLead(req.body);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
        // Local development: no Telegram credentials, so print the lead instead.
        console.warn('⚠️ TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set. Lead not delivered:', lead);
        return res.status(200).json({ success: true });
    }

    try {
        await sendToTelegram(formatTelegramMessage(lead));
        console.log(`🎯 New lead delivered (${PACKAGES[lead.packageType].name}).`);
        return res.status(200).json({ success: true });
    } catch (error) {
        // Keep the full lead in the logs so it can be recovered by hand.
        console.error('❌ Telegram delivery failed; lead kept here for manual follow-up:', error.message, lead);
        return res.status(502).json({
            success: false,
            message: 'We could not send your request just now. Please try again, or message us directly on Telegram at @mekongintelligence.'
        });
    }
});

// Old image URLs that social networks and search engines may still have cached.
app.get('/image/MI_Logo_NoText.png', (req, res) => res.redirect(301, '/image/og-image.png'));
app.get('/image/vosumtey.jpg', (req, res) => res.redirect(301, '/image/vosumtey.webp'));

app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'Not found' });
});

// Anything else is a real 404 (no more HTML for /robots.txt-style misses).
app.use((req, res) => {
    res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

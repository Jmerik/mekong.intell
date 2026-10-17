// Vercel serverless function: /api/scan-admin  (owner only)
//
//   GET                              today's status: switch, limit, spend
//   POST { "enabled": false }        stop all automatic scans at once (no redeploy)
//   POST { "dailyLimitUsd": 3.5 }    change today's and later days' limit (never above SCAN_DAILY_CEILING_USD)
//
// Send the header   Authorization: Bearer <SCAN_ADMIN_TOKEN>   (use a long random value, at least 24 characters).
// Without SCAN_ADMIN_TOKEN the endpoint does not exist. Failed attempts are limited per network address.
const crypto = require('node:crypto');
const { createScanner } = require('./_lib/scan/index');
const telegram = require('./_lib/telegram');
const budget = require('./_lib/scan/budget');
const { clientKey } = require('./_lib/rateLimit');

const digest = (text) => crypto.createHash('sha256').update(String(text)).digest();

function authorised(req, token) {
    const header = String(req.headers.authorization || '');
    const given = header.startsWith('Bearer ') ? header.slice(7) : '';
    return crypto.timingSafeEqual(digest(given), digest(token));   // fixed-length digests, constant-time compare
}

async function status(scanner) {
    const settings = await budget.getSettings(scanner.store, scanner.config);
    const spend = await budget.getSpend(scanner.store);
    return {
        ready: scanner.ready(),
        enabled: settings.enabled,
        dailyLimitUsd: settings.dailyLimitUsd,
        dailyCeilingUsd: scanner.config.dailyCeilingUsd,
        perScanCapUsd: scanner.config.perScanUsd,
        spentTodayUsd: budget.toUsd(spend.dayMicro),
        spentThisMonthUsd: budget.toUsd(spend.monthMicro),
        monthlyLimitUsd: scanner.config.monthlyUsd
    };
}

function createHandler({ scanner = createScanner(), env = process.env, notify = (text) => (telegram.isConfigured() ? telegram.send(text) : Promise.resolve()) } = {}) {
    return async function handler(req, res) {
        res.setHeader('Cache-Control', 'no-store');
        const token = env.SCAN_ADMIN_TOKEN;
        if (!token || token.length < 24 || !scanner.store) return res.status(404).json({ error: 'Not found' });

        const key = `admin-fail:${clientKey(req)}`;
        const failures = Number(await scanner.store.get(`scan:rl:${key}`)) || 0;
        if (failures >= scanner.config.limits.adminFailuresPerHour) return res.status(429).json({ error: 'Too many attempts' });
        if (!authorised(req, token)) {
            await scanner.rateHit(key, 3600);
            return res.status(401).json({ error: 'Unauthorised' });
        }

        if (req.method === 'GET') return res.status(200).json(await status(scanner));
        if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed' }); }

        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const changes = [];
        if (body.enabled !== undefined) {
            if (typeof body.enabled !== 'boolean') return res.status(400).json({ error: 'enabled must be true or false' });
            await scanner.store.set('scan:enabled', body.enabled ? '1' : '0');
            changes.push(`automatic scans ${body.enabled ? 'switched on' : 'switched off'}`);
        }
        if (body.dailyLimitUsd !== undefined) {
            const limit = body.dailyLimitUsd;
            if (typeof limit !== 'number' || !Number.isFinite(limit) || limit < 0) return res.status(400).json({ error: 'dailyLimitUsd must be a number of 0 or more' });
            if (limit > scanner.config.dailyCeilingUsd) return res.status(400).json({ error: `dailyLimitUsd cannot exceed the ceiling of ${scanner.config.dailyCeilingUsd}` });
            await scanner.store.set('scan:daily_limit_usd', String(limit));
            changes.push(`daily limit set to ${limit.toFixed(2)} USD`);
        }
        if (changes.length) await Promise.resolve(notify(`⚙️ Scanner settings changed: ${changes.join(', ')}.`)).catch(() => {});
        return res.status(200).json(await status(scanner));
    };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;

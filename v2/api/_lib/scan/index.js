// The scanner's front door. Three steps, each guarded:
//   admit()    a Quick Look request arrives: decide whether to start the automatic path (send a confirmation email)
//              or leave it to the manual queue. The lead itself is always saved first by api/book.js.
//   confirm()  the visitor clicks the emailed link (single use, 24 hours): claims the domain for 30 days.
//   execute()  runs the scan within the spending limits, then sends the draft to Telegram and a row to the sheet,
//              and, only when SCAN_AUTOSEND=1 and the email belongs to the scanned domain, emails the report.
// If anything required is missing, admit() says "manual" and the site behaves exactly as before.
const crypto = require('node:crypto');
const { loadConfig } = require('./config');
const { storeFromEnv } = require('./store');
const budget = require('./budget');
const guard = require('./guard');
const mail = require('./mail');
const { runScan } = require('./run');
const { reportToText, summaryLine } = require('./rules');
const { escapeHtml } = require('../lead');

const sha = (text) => crypto.createHash('sha256').update(String(text).toLowerCase()).digest('hex').slice(0, 32);
const TOKEN_RE = /^[a-f0-9]{64}$/;

function createScanner({ env = process.env, store = storeFromEnv(env), fetchImpl = fetch, deps = {}, now = () => new Date(), notify = async () => {}, recordRow = async () => {} } = {}) {
    const config = loadConfig(env);
    const ready = () => Boolean(config.enabled && store && env.ANTHROPIC_API_KEY && env.BRAVE_API_KEY && env.RESEND_API_KEY && env.MAIL_FROM);

    async function counter(key, ttl) {
        const n = await store.incrby(key, 1);
        if (n === 1) await store.expire(key, ttl);
        return n;
    }

    async function admit({ lead, ip }) {
        if (!ready()) return { action: 'manual', reason: 'not_configured' };
        try {
            const target = guard.normalizeTarget(lead.website);
            if (target.error) return { action: 'manual', reason: 'bad_target' };
            if (guard.isDisposableEmail(lead.email)) return { action: 'manual', reason: 'disposable_email' };

            const room = await budget.hasRoom(store, config, budget.toMicro(0.05), now());
            if (!room.ok) return { action: 'manual', reason: room.reason };

            if (target.kind === 'domain' && await store.get(`scan:domain:${target.domain}`)) return { action: 'manual', reason: 'recent_scan' };

            const hour = Math.floor(now().getTime() / 3600000);
            const day = budget.dayKey(now());
            if (await counter(`scan:rl:ip:${sha(ip)}:${hour}`, 3600) > config.limits.ipPerHour) return { action: 'manual', reason: 'rate_ip' };
            if (await counter(`scan:rl:email:${sha(lead.email)}:${day}`, 86400) > config.limits.emailPerDay) return { action: 'manual', reason: 'rate_email' };
            if (await counter(`scan:rl:global:${hour}`, 3600) > config.limits.globalVerificationsPerHour) return { action: 'manual', reason: 'rate_global' };

            const token = (deps.randomToken || (() => crypto.randomBytes(32).toString('hex')))();
            const payload = { lead: { email: lead.email, name: lead.name, website: lead.website, audience: lead.audience, telegram: lead.telegram, phone: lead.phone }, target, requestedAt: now().toISOString() };
            await store.set(`scan:verify:${token}`, JSON.stringify(payload), { ex: config.verifyTtlSeconds });

            const label = target.kind === 'domain' ? target.domain : target.name;
            const message = mail.verificationEmail({ lang: lead.audience === 'de' ? 'de' : 'en', link: `${config.siteUrl}${lead.audience === 'de' ? '/bestaetigen' : '/confirm'}?t=${token}`, targetLabel: label });
            try {
                await (deps.sendEmail || ((m) => mail.sendEmail(m, { env, fetchImpl })))({ to: lead.email, ...message });
            } catch (error) {
                await store.del(`scan:verify:${token}`).catch(() => {});
                return { action: 'manual', reason: 'email_failed' };
            }
            return { action: 'verify', reason: 'sent' };
        } catch (error) {
            // Store or provider trouble: never block the lead, fall back to the manual queue.
            console.error('Scanner admit failed:', error && error.message);
            return { action: 'manual', reason: 'error' };
        }
    }

    async function confirm(token) {
        if (!ready() || !TOKEN_RE.test(String(token || ''))) return { status: 'expired' };
        const raw = await store.getdel(`scan:verify:${token}`);
        if (!raw) return { status: 'expired' };
        let payload; try { payload = JSON.parse(raw); } catch { return { status: 'expired' }; }
        const lang = payload.lead && payload.lead.audience === 'de' ? 'de' : 'en';
        if (payload.target.kind === 'domain') {
            const first = await store.set(`scan:domain:${payload.target.domain}`, '1', { nx: true, ex: config.domainRepeatDays * 86400 });
            if (!first) return { status: 'duplicate', payload, lang };
        }
        return { status: 'ok', payload, lang };
    }

    async function execute(payload) {
        const { lead, target } = payload;
        try {
            const ctx = budget.createScanContext({ store, config, now, onAlert: notify });
            const result = await runScan({ target, ctx, config, deps, now });
            const costUsd = budget.toUsd(result.costMicro);
            const report = result.report;
            const anyRated = report.areas.some((a) => a.rating !== 'N/A');
            const autosend = config.autosend && result.validation.ok && anyRated && guard.emailMatchesTarget(lead.email, target);
            let status = 'needs your review';

            if (autosend) {
                try {
                    await (deps.sendEmail || ((m) => mail.sendEmail(m, { env, fetchImpl })))({ to: lead.email, ...mail.reportEmail({ lang: lead.audience === 'de' ? 'de' : 'en', reportText: reportToText(report) }) });
                    status = 'sent to the requester automatically';
                } catch (error) { status = 'automatic email failed: send it by hand'; }
            } else if (!result.validation.ok) status = 'did not pass the checks: ' + result.validation.problems.slice(0, 3).join('; ');
            else if (!anyRated) status = 'nothing could be checked: do it by hand';

            const body = reportToText(report).slice(0, 2800);
            await notify([
                `📝 <b>Quick Look draft: ${escapeHtml(report.target)}</b>`,
                `<b>Requested by:</b> ${escapeHtml(lead.email)}`,
                `<b>Status:</b> ${escapeHtml(status)}`,
                `<b>Scan cost:</b> ${costUsd.toFixed(3)} USD${result.skipped.length ? ` (skipped: ${escapeHtml(result.skipped.slice(0, 3).join('; '))})` : ''}`,
                '', `<pre>${escapeHtml(body)}</pre>`
            ].join('\n'));
            await recordRow({ ...lead, packageType: 'quicklook', message: `Scanner draft (${costUsd.toFixed(3)} USD, ${status}): ${summaryLine(report)}`, focus: '', bottleneck: '', interest: '' }, 'Scan draft ready').catch(() => {});
            return { ok: true, status, costUsd };
        } catch (error) {
            console.error('Scan failed:', error && error.message);
            await notify(`⚠️ <b>Quick Look scan failed for ${escapeHtml(target.domain || target.name)}.</b> Please prepare it by hand.`).catch(() => {});
            return { ok: false };
        }
    }

    // Count a hit on a rate-limit key (used by the endpoints). Returns the new count, or 0 when there is no store.
    async function rateHit(key, ttlSeconds) {
        return store ? counter(`scan:rl:${key}`, ttlSeconds) : 0;
    }

    return { config, ready, admit, confirm, execute, rateHit, store };
}

module.exports = { createScanner };

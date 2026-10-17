const test = require('node:test');
const assert = require('node:assert/strict');
const { createMemoryStore } = require('../api/_lib/scan/store');
const { createScanner } = require('../api/_lib/scan/index');

const mkRes = () => ({ headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(d) { this.body = d; return this; } });
const quiet = async (fn) => { const e = console.error, w = console.warn, l = console.log; console.error = console.warn = console.log = () => {}; try { return await fn(); } finally { console.error = e; console.warn = w; console.log = l; } };

// ---------- /api/book ----------
async function book(scanner, body, { telegram = true } = {}) {
    const saved = { ...process.env }; const realFetch = global.fetch; const sentToTelegram = [];
    for (const k of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'LEAD_SHEET_WEBHOOK_URL', 'LEAD_SHEET_SECRET']) delete process.env[k];
    if (telegram) Object.assign(process.env, { TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '1' });
    global.fetch = async (url, opts) => { sentToTelegram.push(JSON.parse(opts.body).text); return new Response('{"ok":true}'); };
    const res = mkRes();
    try {
        const { createHandler } = require('../api/book');
        await quiet(() => createHandler({ scanner })({ method: 'POST', body, headers: { 'x-forwarded-for': `10.9.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` } }, res));
    } finally { global.fetch = realFetch; process.env = saved; }
    return { res, sentToTelegram };
}
const quick = { email: 'dara@acme.com', website: 'acme.com', packageType: 'quicklook' };

test('book: a Quick Look with the scanner ready tells the browser to ask for email confirmation, and the team why', async () => {
    const scanner = { admit: async () => ({ action: 'verify', reason: 'sent' }) };
    const { res, sentToTelegram } = await book(scanner, quick);
    assert.equal(res.code, 200); assert.equal(res.body.verify, true);
    assert.match(sentToTelegram[0], /Waiting for the visitor to confirm their email/);
});

test('book: when the scanner declines, the lead still arrives and the note says why', async () => {
    for (const [reason, text] of [['not_configured', /Scanner not connected yet/], ['daily_budget', /today's scan budget is used up/], ['recent_scan', /scanned in the last 30 days/], ['rate_ip', /too many requests/]]) {
        const { res, sentToTelegram } = await book({ admit: async () => ({ action: 'manual', reason }) }, quick);
        assert.equal(res.code, 200); assert.equal(res.body.verify, false);
        assert.match(sentToTelegram[0], text);
        assert.match(sentToTelegram[0], /prepare this Quick Look by hand/);
    }
});

test('book: only Quick Look requests reach the scanner', async () => {
    let asked = 0;
    await book({ admit: async () => { asked++; return { action: 'manual', reason: 'x' }; } }, { name: 'A B', email: 'a@b.co', packageType: 'call' });
    assert.equal(asked, 0);
});

// ---------- /api/verify ----------
const ENV = { SCAN_ENABLED: '1', ANTHROPIC_API_KEY: 'k', BRAVE_API_KEY: 'k', RESEND_API_KEY: 'k', MAIL_FROM: 'MI <q@example.org>', SITE_URL: 'https://site.test' };
function realScanner(extra = {}) {
    const sent = [];
    const scanner = createScanner({ env: ENV, store: createMemoryStore(), now: () => new Date('2026-10-17T10:00:00Z'),
        deps: { sendEmail: async (m) => { sent.push(m); }, fetchPage: async (u) => ({ status: 200, url: u, https: true, body: '<title>x</title>', truncated: false }), search: async () => [], runProbe: async () => ({ value: { answered: true, domainCited: false, nameMentioned: false }, costMicro: 1000 }), ...extra },
        notify: async () => {}, recordRow: async () => {} });
    return { scanner, sent };
}

test('verify: only POST works; a GET (an email scanner opening the link) changes nothing', async () => {
    const { scanner, sent } = realScanner();
    await scanner.admit({ lead: { email: 'd@acme.com', website: 'acme.com', audience: 'local' }, ip: '1.1.1.1' });
    const token = sent[0].text.match(/t=([a-f0-9]{64})/)[1];
    const { createHandler } = require('../api/verify');
    const runs = [];
    const handler = createHandler({ scanner, run: (p) => runs.push(p) });
    const get = mkRes(); await handler({ method: 'GET', query: { t: token }, headers: {} }, get);
    assert.equal(get.code, 405); assert.equal(runs.length, 0);
    const post = mkRes(); await handler({ method: 'POST', body: { t: token }, headers: {} }, post);
    assert.deepEqual([post.code, post.body], [200, { status: 'ok' }]);
    assert.equal(runs.length, 1);
    const again = mkRes(); await handler({ method: 'POST', body: { t: token }, headers: {} }, again);
    assert.deepEqual(again.body, { status: 'expired' });
    assert.equal(runs.length, 1);   // the second click starts nothing
    assert.equal(post.headers['Referrer-Policy'], 'no-referrer');
});

test('verify: garbage input is answered as expired, never an error page or a scan', async () => {
    const { scanner } = realScanner();
    const { createHandler } = require('../api/verify');
    const runs = [];
    const handler = createHandler({ scanner, run: (p) => runs.push(p) });
    for (const body of [undefined, {}, { t: 12 }, { t: 'x'.repeat(10000) }, { t: { $ne: 1 } }, 'text']) {
        const res = mkRes(); await handler({ method: 'POST', body, headers: {} }, res);
        assert.equal(res.body.status, 'expired');
    }
    assert.equal(runs.length, 0);
});

test('verify: too many attempts from one address are refused', async () => {
    const { scanner } = realScanner();
    const { createHandler } = require('../api/verify');
    const handler = createHandler({ scanner, run: () => {} });
    let last;
    for (let i = 0; i < 32; i++) { last = mkRes(); await handler({ method: 'POST', body: { t: 'a'.repeat(64) }, headers: { 'x-forwarded-for': '5.5.5.5' } }, last); }
    assert.equal(last.code, 429);
});

// ---------- /api/scan-admin ----------
const TOKEN = 'a-long-random-admin-token-1234567890';
function admin() {
    const store = createMemoryStore(); const notes = [];
    const scanner = createScanner({ env: { ...ENV, SCAN_DAILY_CEILING_USD: '10' }, store });
    const { createHandler } = require('../api/scan-admin');
    const handler = createHandler({ scanner, env: { SCAN_ADMIN_TOKEN: TOKEN }, notify: async (t) => { notes.push(t); } });
    const call = async (method, body, auth = `Bearer ${TOKEN}`, ip = '4.4.4.4') => { const res = mkRes(); await handler({ method, body, headers: { authorization: auth, 'x-forwarded-for': ip } }, res); return res; };
    return { call, notes, store };
}

test('admin: no token configured means the endpoint does not exist', async () => {
    const { createHandler } = require('../api/scan-admin');
    const scanner = createScanner({ env: ENV, store: createMemoryStore() });
    for (const env of [{}, { SCAN_ADMIN_TOKEN: 'short' }]) {
        const res = mkRes(); await createHandler({ scanner, env })({ method: 'GET', headers: { authorization: 'Bearer short' } }, res);
        assert.equal(res.code, 404);
    }
});

test('admin: wrong or missing credentials are refused and, after 10 failures, locked out for the hour', async () => {
    const a = admin();
    for (const auth of [null, '', 'Bearer', `Bearer ${TOKEN}x`, 'Bearer wrong', `Basic ${TOKEN}`]) assert.equal((await a.call('GET', undefined, auth, `6.6.6.${Math.random()}`)).code, 401);
    let last; for (let i = 0; i < 11; i++) last = await a.call('GET', undefined, 'Bearer nope', '7.7.7.7');
    assert.equal(last.code, 429);
    assert.equal((await a.call('GET', undefined, `Bearer ${TOKEN}`, '7.7.7.7')).code, 429);   // even the right token, from that address
    assert.equal((await a.call('GET', undefined, `Bearer ${TOKEN}`, '8.8.8.8')).code, 200);
});

test('admin: shows the status, switches scans off and on, and sets a daily limit within the ceiling', async () => {
    const a = admin();
    let res = await a.call('GET');
    assert.equal(res.body.dailyLimitUsd, 2); assert.equal(res.body.perScanCapUsd, 0.2); assert.equal(res.body.enabled, true);
    res = await a.call('POST', { enabled: false });
    assert.equal(res.body.enabled, false);
    assert.match(a.notes.at(-1), /switched off/);
    res = await a.call('POST', { enabled: true, dailyLimitUsd: 3.5 });
    assert.equal(res.body.dailyLimitUsd, 3.5); assert.equal(res.body.enabled, true);
    for (const bad of [{ dailyLimitUsd: 11 }, { dailyLimitUsd: -1 }, { dailyLimitUsd: '5' }, { dailyLimitUsd: null }, { enabled: 'yes' }]) assert.equal((await a.call('POST', bad)).code, 400);
    assert.equal((await a.call('GET')).body.dailyLimitUsd, 3.5);   // unchanged by the refused requests
    assert.equal((await a.call('DELETE')).code, 405);
});

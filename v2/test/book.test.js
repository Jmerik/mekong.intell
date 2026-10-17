const test = require('node:test');
const assert = require('node:assert/strict');
const sheet = require('../api/_lib/sheet');

const lead = { name: 'Dara Sok', email: 'dara_sok@example.com', telegram: '@dara_sok', phone: '', website: 'example.com.kh', message: '=HYPERLINK("x")', audience: 'local', focus: 'found', bottleneck: 'funnel', interest: 'sprint', packageType: 'quicklook' };

test('sheet row follows the column order and carries the lead text untouched', () => {
    const row = sheet.toRow(lead, new Date('2026-10-15T12:00:00Z'));
    assert.equal(row.length, sheet.COLUMNS.length);
    assert.equal(row[0], '2026-10-15T12:00:00.000Z');
    assert.deepEqual(row.slice(1, 5), ['Free Quick Look', 'Local', 'Found', 'Dara Sok']);
    assert.equal(row[9], '=HYPERLINK("x")'); // stored as plain text by the Apps Script, never as a formula
    assert.deepEqual(row.slice(10), ['Funnel Leakage / Low Conversions', '7-Day Sprint', 'New']);
});

test('sheet is only configured when both the URL and the secret are set', () => {
    assert.equal(sheet.isConfigured({}), false);
    assert.equal(sheet.isConfigured({ LEAD_SHEET_WEBHOOK_URL: 'https://x' }), false);
    assert.equal(sheet.isConfigured({ LEAD_SHEET_WEBHOOK_URL: 'https://x', LEAD_SHEET_SECRET: 's' }), true);
});

test('appendToSheet succeeds on {ok:true} and sends the secret and columns', async () => {
    let sent;
    const fetchImpl = async (url, opts) => { sent = { url, body: JSON.parse(opts.body) }; return new Response('{"ok":true}', { status: 200 }); };
    await sheet.appendToSheet(lead, { env: { LEAD_SHEET_WEBHOOK_URL: 'https://script.test/exec', LEAD_SHEET_SECRET: 'abc' }, fetchImpl });
    assert.equal(sent.url, 'https://script.test/exec');
    assert.equal(sent.body.secret, 'abc');
    assert.deepEqual(sent.body.columns, sheet.COLUMNS);
});

test('appendToSheet fails on an error reply, a non-JSON reply and an HTTP error', async () => {
    const env = { LEAD_SHEET_WEBHOOK_URL: 'https://script.test/exec', LEAD_SHEET_SECRET: 'abc' };
    for (const reply of [new Response('{"ok":false,"error":"unauthorized"}', { status: 200 }), new Response('<html>login</html>', { status: 200 }), new Response('{}', { status: 500 })]) {
        await assert.rejects(sheet.appendToSheet(lead, { env, fetchImpl: async () => reply }));
    }
});

// --- the handler: which destinations are used and when the visitor sees an error ---
function run(env, fetchImpl, body = { name: 'A B', email: 'a@b.co', packageType: 'call' }) {
    return new Promise(async (resolve) => {
        const saved = { ...process.env }; const realFetch = global.fetch;
        for (const k of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'LEAD_SHEET_WEBHOOK_URL', 'LEAD_SHEET_SECRET']) delete process.env[k];
        Object.assign(process.env, env); global.fetch = fetchImpl;
        const origError = console.error, origWarn = console.warn, origLog = console.log; console.error = console.warn = console.log = () => {};
        const res = { headers: {}, setHeader() {}, status(c) { this.code = c; return this; }, json(d) { this.body = d; return this; } };
        try {
            delete require.cache[require.resolve('../api/book')];
            const handler = require('../api/book');
            await handler({ method: 'POST', body, headers: { 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}` } }, res);
        } finally { console.error = origError; console.warn = origWarn; console.log = origLog; global.fetch = realFetch; process.env = saved; }
        resolve({ code: res.code, body: res.body });
    });
}

const BOTH = { TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '1', LEAD_SHEET_WEBHOOK_URL: 'https://script.test/exec', LEAD_SHEET_SECRET: 's' };
const route = ({ telegram, sheet: sheetOk }) => async (url) => {
    const isTelegram = String(url).includes('api.telegram.org');
    const ok = isTelegram ? telegram : sheetOk;
    return new Response(isTelegram ? (ok ? '{"ok":true}' : '{"ok":false}') : (ok ? '{"ok":true}' : '{"ok":false,"error":"boom"}'), { status: isTelegram && !ok ? 400 : 200 });
};

test('handler: both destinations work -> success', async () => {
    const r = await run(BOTH, route({ telegram: true, sheet: true }));
    assert.equal(r.code, 200); assert.equal(r.body.delivered, true);
});

test('handler: Telegram fails but the sheet has the lead -> still success', async () => {
    assert.equal((await run(BOTH, route({ telegram: false, sheet: true }))).code, 200);
});

test('handler: the sheet fails but Telegram has the lead -> still success', async () => {
    assert.equal((await run(BOTH, route({ telegram: true, sheet: false }))).code, 200);
});

test('handler: every configured destination fails -> the visitor sees an error (502)', async () => {
    const r = await run(BOTH, route({ telegram: false, sheet: false }));
    assert.equal(r.code, 502); assert.equal(r.body.success, false);
});

test('handler: only one destination configured and it fails -> 502', async () => {
    const r = await run({ LEAD_SHEET_WEBHOOK_URL: 'https://script.test/exec', LEAD_SHEET_SECRET: 's' }, route({ telegram: true, sheet: false }));
    assert.equal(r.code, 502);
});

test('handler: nothing configured -> success but flagged as not delivered', async () => {
    const r = await run({}, async () => { throw new Error('should not be called'); });
    assert.equal(r.code, 200); assert.equal(r.body.delivered, false);
});

test('handler: invalid input never reaches a destination', async () => {
    const r = await run(BOTH, async () => { throw new Error('should not be called'); }, { name: 'A', email: 'nope', packageType: 'call' });
    assert.equal(r.code, 400); assert.ok(r.body.errors.email);
});

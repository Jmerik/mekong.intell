const test = require('node:test');
const assert = require('node:assert/strict');
const { createMemoryStore } = require('../api/_lib/scan/store');
const budget = require('../api/_lib/scan/budget');
const { loadConfig } = require('../api/_lib/scan/config');
const guard = require('../api/_lib/scan/guard');
const probe = require('../api/_lib/scan/aiProbe');
const rules = require('../api/_lib/scan/rules');
const { runScan, searchPlan } = require('../api/_lib/scan/run');
const { createScanner } = require('../api/_lib/scan/index');

const config = loadConfig({});
const T0 = new Date('2026-10-17T10:00:00Z');
const norm = guard.normalizeTarget;

test('social links: only the handle of a public page is kept', () => {
    assert.deepEqual(norm('https://www.facebook.com/AngkorCafe.KH/?ref=share'), { kind: 'social', platform: 'facebook', handle: 'AngkorCafe.KH' });
    assert.deepEqual(norm('m.facebook.com/pg/shopname/posts'), { kind: 'social', platform: 'facebook', handle: 'shopname' });
    assert.deepEqual(norm('facebook.com/pages/My-Shop/123456'), { kind: 'social', platform: 'facebook', handle: 'My-Shop' });
    assert.deepEqual(norm('https://instagram.com/angkor_cafe'), { kind: 'social', platform: 'instagram', handle: 'angkor_cafe' });
    assert.deepEqual(norm('t.me/s/angkorcafe'), { kind: 'social', platform: 'telegram', handle: 'angkorcafe' });
    assert.deepEqual(norm('fb.me/angkorcafe'), { kind: 'social', platform: 'facebook', handle: 'angkorcafe' });
});

test('social links: share links, logins, profiles by number, invites and bare social sites are refused', () => {
    for (const bad of ['facebook.com', 'facebook.com/sharer/sharer.php?u=1', 'facebook.com/profile.php?id=1', 'facebook.com/groups/1234', 'instagram.com/p/abc123', 't.me/+AbCdEf', 't.me/abc', 'https://u:p@facebook.com/shop']) {
        assert.ok(norm(bad).error, bad);
    }
});

test('social links: look-alike hosts are scanned as the websites they are, never as a social page', () => {
    assert.deepEqual(norm('evilfacebook.com/abcde'), { kind: 'domain', domain: 'evilfacebook.com' });
    assert.deepEqual(norm('facebook.com.evil.co/abcde'), { kind: 'domain', domain: 'facebook.com.evil.co' });
});

test('company names: Khmer script keeps its vowel signs and subscripts, markup still goes', () => {
    const khmer = 'ហាងកាហ្វេអង្គរ ភ្នំពេញ';
    assert.deepEqual(norm(khmer), { kind: 'name', name: khmer });
    assert.doesNotMatch(norm('ហាង <script>alert(1)</script>').name, /[<>]/);
});

test('labels: the same words are used in emails, Telegram and the report', () => {
    assert.equal(guard.targetLabel({ kind: 'social', platform: 'facebook', handle: 'angkorcafe', location: 'Siem Reap' }), 'angkorcafe (Facebook), Siem Reap');
    assert.equal(guard.targetLabel({ kind: 'name', name: 'Angkor Cafe' }), 'Angkor Cafe');
    assert.equal(guard.targetLabel({ kind: 'domain', domain: 'acme.com' }), 'acme.com');
});

test('searches: a social page is looked up by its handle, a city narrows the search, five searches at most', () => {
    const social = searchPlan({ kind: 'social', platform: 'facebook', handle: 'angkorcafe', location: 'Siem Reap' });
    assert.equal(social.length, 5);
    assert.equal(social[0].query, '"angkorcafe" facebook');
    assert.match(social[1].query, /Siem Reap/);
    assert.ok(social.some((s) => s.query.includes('site:instagram.com')) && !social.some((s) => s.query.includes('site:facebook.com')));
    assert.match(searchPlan({ kind: 'name', name: 'Angkor Cafe', location: 'Siem Reap' })[0].query, /"Angkor Cafe" Siem Reap/);
    assert.equal(searchPlan({ kind: 'name', name: 'Angkor Cafe' })[0].query, '"Angkor Cafe"');
});

test('assistant check: the question names the page and city, and the handle cannot carry instructions', () => {
    const q = probe.questionFor({ kind: 'social', platform: 'instagram', handle: 'angkor_cafe', location: 'Siem Reap' });
    assert.equal(q, 'What is the business behind the Instagram page "angkor_cafe" in Siem Reap? Search once and answer briefly.');
    assert.match(probe.questionFor({ kind: 'name', name: 'Acme', location: 'Phnom Penh' }), /Acme in Phnom Penh/);
    assert.equal(norm('facebook.com/ignore.previous.instructions').handle, 'ignore.previous.instructions');   // dots are the worst a handle can contain
});

function fakes(results) {
    const calls = { fetch: 0, search: 0, probe: 0 };
    return {
        calls,
        deps: {
            fetchPage: async () => { calls.fetch++; throw new Error('a social target must never fetch a page'); },
            search: async () => { calls.search++; return results; },
            runProbe: async () => { calls.probe++; return { value: { answered: true, domainCited: null, nameMentioned: true }, costMicro: 1000 }; }
        }
    };
}

test('scan of a social page: no page is fetched, found is rated from searches, the rest says why it is N/A', async () => {
    const target = { kind: 'social', platform: 'facebook', handle: 'angkorcafe', location: 'Siem Reap' };
    const f = fakes([{ host: 'facebook.com', path: '/angkorcafe/', title: 'Angkor Cafe | Facebook' }]);
    const ctx = budget.createScanContext({ store: createMemoryStore(), config, now: () => T0 });
    const out = await runScan({ target, ctx, config, deps: f.deps, now: () => T0 });
    assert.equal(f.calls.fetch, 0);
    assert.equal(out.validation.ok, true, out.validation.problems.join('; '));
    assert.equal(out.report.target, 'angkorcafe (Facebook), Siem Reap');
    assert.equal(out.report.areas[0].rating, 'Strong');
    assert.equal(out.report.areas[1].rating, 'N/A');
    assert.equal(out.report.areas[2].rating, 'N/A');
    assert.match(out.report.areas[1].notAssessed.join(' '), /social page link was given/);
    assert.ok(out.costMicro <= budget.toMicro(0.2));
});

test('scan of a social page that cannot be found suggests a business listing, not Search Console', async () => {
    const f = fakes([]);
    f.deps.runProbe = async () => ({ value: { answered: true, domainCited: null, nameMentioned: false }, costMicro: 1000 });
    const ctx = budget.createScanContext({ store: createMemoryStore(), config, now: () => T0 });
    const out = await runScan({ target: { kind: 'social', platform: 'instagram', handle: 'nobodyhere' }, ctx, config, deps: f.deps, now: () => T0 });
    assert.equal(out.report.areas[0].rating, 'Priority focus');
    assert.match(out.report.fixes[0].name, /Google Business Profile/);
    assert.ok(!rules.reportToText(out.report).includes('Search Console'));
});

// ---------- admission ----------
const ENV = { SCAN_ENABLED: '1', ANTHROPIC_API_KEY: 'k', BRAVE_API_KEY: 'k', RESEND_API_KEY: 'k', MAIL_FROM: 'MI <q@example.org>', SITE_URL: 'https://site.test' };
const scannerWith = () => {
    const sent = [];
    const scanner = createScanner({ env: ENV, store: createMemoryStore(), now: () => T0, deps: { sendEmail: async (m) => { sent.push(m); }, randomToken: () => 'a'.repeat(64) }, notify: async () => {}, recordRow: async () => {} });
    return { scanner, sent };
};

test('admission: a social page and a city start the confirmation path, and the city travels with the target', async () => {
    const { scanner, sent } = scannerWith();
    const lead = { email: 'owner@gmail.com', website: 'https://facebook.com/angkorcafe', location: 'Siem Reap', audience: 'local' };
    assert.deepEqual(await scanner.admit({ lead, ip: '1.1.1.1' }), { action: 'verify', reason: 'sent' });
    assert.equal(sent.length, 1);
    const confirmed = await scanner.confirm('a'.repeat(64));
    assert.equal(confirmed.status, 'ok');
    assert.deepEqual(confirmed.payload.target, { kind: 'social', platform: 'facebook', handle: 'angkorcafe', location: 'Siem Reap' });
});

test('admission: the same social page is scanned once per 30 days, and an unusable link goes to the manual queue', async () => {
    const { scanner } = scannerWith();
    const lead = { email: 'owner@gmail.com', website: 'instagram.com/Angkor_Cafe', audience: 'local' };
    await scanner.admit({ lead, ip: '1.1.1.1' });
    assert.equal((await scanner.confirm('a'.repeat(64))).status, 'ok');
    assert.deepEqual(await scanner.admit({ lead: { ...lead, website: 'instagram.com/angkor_cafe' }, ip: '2.2.2.2' }), { action: 'manual', reason: 'recent_scan' });
    assert.deepEqual(await scanner.admit({ lead: { ...lead, website: 'facebook.com/sharer/sharer.php?u=1' }, ip: '3.3.3.3' }), { action: 'manual', reason: 'bad_target' });
});

test('an automatic reply is never sent for a social page, even with a business email address', async () => {
    const sent = [];
    const scanner = createScanner({ env: { ...ENV, SCAN_AUTOSEND: '1' }, store: createMemoryStore(), now: () => T0,
        deps: { sendEmail: async (m) => { sent.push(m); }, ...fakes([{ host: 'facebook.com', path: '/angkorcafe', title: 'x' }]).deps }, notify: async () => {}, recordRow: async () => {} });
    const out = await scanner.execute({ lead: { email: 'owner@angkorcafe.com', audience: 'local' }, target: { kind: 'social', platform: 'facebook', handle: 'angkorcafe' } });
    assert.equal(out.ok, true);
    assert.equal(sent.length, 0);
});

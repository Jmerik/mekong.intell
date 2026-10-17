const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLead, formatTelegramMessage } = require('../api/_lib/lead');
const { isLimited, MAX_REQUESTS } = require('../api/_lib/rateLimit');
const { runQuickLook } = require('../api/_lib/scanner');

const valid = { name: 'Dara Sok', email: 'dara_sok@example.com', telegram: '@dara_sok', packageType: 'call' };
const quicklook = { ...valid, packageType: 'quicklook', website: 'example.com.kh' };

test('accepts a valid lead with Telegram only', () => {
    assert.deepEqual(validateLead(valid).errors, {});
});

test('Telegram and phone are both optional', () => {
    assert.deepEqual(validateLead({ ...valid, telegram: '' }).errors, {});
    assert.deepEqual(validateLead({ ...valid, telegram: '', phone: '+855 12 345 678' }).errors, {});
});

test('a malformed Telegram username or phone number is still rejected when given', () => {
    assert.ok(validateLead({ ...valid, telegram: 'a b' }).errors.telegram);
    assert.ok(validateLead({ ...valid, phone: 'abc' }).errors.phone);
});

test('the Quick Look needs only a website or company name and an email', () => {
    assert.deepEqual(validateLead({ email: 'a@b.co', website: 'example.com', packageType: 'quicklook' }).errors, {});
    assert.ok(validateLead({ website: 'example.com', packageType: 'quicklook' }).errors.email);
});

test('other requests still need a name and an email', () => {
    assert.ok(validateLead({ email: 'a@b.co', packageType: 'call' }).errors.name);
    assert.ok(validateLead({ name: 'A B', packageType: 'call' }).errors.email);
});

test('Quick Look needs a website or company name, other requests do not', () => {
    assert.ok(validateLead({ ...quicklook, website: '' }).errors.website);
    assert.deepEqual(validateLead(quicklook).errors, {});
    assert.deepEqual(validateLead({ ...valid, website: '' }).errors, {});
});

test('company names are accepted as well as URLs', () => {
    assert.deepEqual(validateLead({ ...quicklook, website: 'Sok Dara Accounting' }).errors, {});
});

test('rejects bad email, unknown package, audience and focus, and oversized fields', () => {
    const { errors } = validateLead({ ...valid, email: 'nope', packageType: 'free-stuff', audience: 'x', focus: 'y', name: 'a'.repeat(101) });
    for (const field of ['email', 'packageType', 'audience', 'focus', 'name']) assert.ok(errors[field], field);
});

test('audience defaults to general and known values pass', () => {
    assert.equal(validateLead(valid).lead.audience, 'general');
    assert.deepEqual(validateLead({ ...valid, audience: 'local', focus: 'found' }).errors, {});
});

test('German page leads are tagged and show in the Telegram message', () => {
    const { errors, lead } = validateLead({ ...quicklook, audience: 'de' });
    assert.deepEqual(errors, {});
    assert.match(formatTelegramMessage(lead), /Audience:<\/b> German-speaking \(DE\)/);
});

test('ignores non-string input instead of crashing', () => {
    const { errors } = validateLead({ name: { $gt: '' }, email: ['a@b.co'], packageType: 'call', telegram: '@abcde' });
    assert.ok(errors.name);
    assert.ok(errors.email);
});

test('Telegram message keeps underscores, escapes HTML and names the audience', () => {
    const lead = validateLead({ ...quicklook, audience: 'international', focus: 'trusted', message: '<b>hi</b> & bye' }).lead;
    const msg = formatTelegramMessage(lead, { scannerNote: 'Scanner not connected yet' });
    assert.match(msg, /dara_sok@example\.com/);
    assert.match(msg, /@dara_sok/);
    assert.match(msg, /Free Quick Look/);
    assert.match(msg, /International/);
    assert.match(msg, /Trusted/);
    assert.match(msg, /&lt;b&gt;hi&lt;\/b&gt; &amp; bye/);
    assert.match(msg, /Scanner not connected yet/);
});

test('rate limit blocks after the maximum and is per key', () => {
    const now = Date.now();
    for (let i = 0; i < MAX_REQUESTS; i++) assert.equal(isLimited('1.2.3.4', now), false);
    assert.equal(isLimited('1.2.3.4', now), true);
    assert.equal(isLimited('5.6.7.8', now), false);
    assert.equal(isLimited('1.2.3.4', now + 16 * 60 * 1000), false);
});

test('scanner placeholder reports not_configured', async () => {
    assert.equal((await runQuickLook({ target: 'example.com' })).status, 'not_configured');
});

test('the contact form needs a business email or a Telegram username, not both', () => {
    const base = { name: 'A B', packageType: 'contact' };
    assert.deepEqual(validateLead({ ...base, email: 'a@b.co' }).errors, {});
    assert.deepEqual(validateLead({ ...base, telegram: '@abcde' }).errors, {});
    assert.ok(validateLead(base).errors.contact);
    assert.ok(validateLead({ ...base, email: 'nope' }).errors.email);
});

test('other requests still need an email even if a Telegram username is given', () => {
    assert.ok(validateLead({ name: 'A B', telegram: '@abcde', packageType: 'call' }).errors.email);
});

test('bottleneck and interest are checked against the allowed lists', () => {
    const ok = { name: 'A B', email: 'a@b.co', packageType: 'contact' };
    assert.deepEqual(validateLead({ ...ok, bottleneck: 'funnel', interest: 'entry' }).errors, {});
    assert.ok(validateLead({ ...ok, bottleneck: 'other' }).errors.bottleneck);
    assert.ok(validateLead({ ...ok, interest: 'contact' }).errors.interest);
});

test('Telegram message names the bottleneck and the service asked about', () => {
    const lead = validateLead({ name: 'A B', email: 'a@b.co', packageType: 'contact', bottleneck: 'ai-search', interest: 'sprint' }).lead;
    const msg = formatTelegramMessage(lead);
    assert.match(msg, /AI Search Visibility \(GEO\/AEO\)/);
    assert.match(msg, /7-Day Sprint/);
});

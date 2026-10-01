const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLead, formatTelegramMessage } = require('../lib/lead');

const valid = { name: 'Dara Sok', email: 'dara_sok@example.com', telegram: '@dara_sok', packageType: 'audit' };

test('accepts a valid lead with Telegram only', () => {
    assert.deepEqual(validateLead(valid).errors, {});
});

test('accepts a valid lead with phone only', () => {
    const { errors } = validateLead({ ...valid, telegram: '', phone: '+855 12 345 678' });
    assert.deepEqual(errors, {});
});

test('requires Telegram or phone', () => {
    const { errors } = validateLead({ ...valid, telegram: '' });
    assert.ok(errors.contact);
});

test('rejects bad email, unknown package, unknown goal and oversized fields', () => {
    const { errors } = validateLead({ ...valid, email: 'nope', packageType: 'free-stuff', goal: 'x', name: 'a'.repeat(101) });
    assert.ok(errors.email);
    assert.ok(errors.packageType);
    assert.ok(errors.goal);
    assert.ok(errors.name);
});

test('ignores non-string input instead of crashing', () => {
    const { errors } = validateLead({ name: { $gt: '' }, email: ['a@b.co'], packageType: 'audit', telegram: '@abcde' });
    assert.ok(errors.name);
    assert.ok(errors.email);
});

test('Telegram message keeps underscores and escapes HTML', () => {
    const msg = formatTelegramMessage({ ...validateLead(valid).lead, website: '<script>x</script> & co', goal: 'leads' });
    assert.match(msg, /dara_sok@example\.com/);
    assert.match(msg, /@dara_sok/);
    assert.match(msg, /&lt;script&gt;x&lt;\/script&gt; &amp; co/);
    assert.match(msg, /The 72-Hour Intelligence Audit/);
    assert.match(msg, /Increase Leads/);
});

// Second destination for every lead: a Google Sheet, written through a small Google Apps Script web app
// (see docs/lead-sheet-setup.md). Unlike Vercel's logs (1 hour on the Hobby plan), a sheet keeps the lead.
//
// Environment variables:
//   LEAD_SHEET_WEBHOOK_URL   the Apps Script web app URL (ends in /exec)
//   LEAD_SHEET_SECRET        shared secret, also stored in the script's properties

const { PACKAGES, AUDIENCES, FOCUS, BOTTLENECKS } = require('../../shared/packages');

const COLUMNS = ['Received (UTC)', 'Request', 'Audience', 'Focus', 'Name', 'Email', 'Telegram', 'Phone', 'Website / company', 'Message', 'Bottleneck', 'Interested in', 'Status'];

function isConfigured(env = process.env) {
    return Boolean(env.LEAD_SHEET_WEBHOOK_URL && env.LEAD_SHEET_SECRET);
}

// One row per lead, in the same order as COLUMNS. The Apps Script writes every cell as plain text,
// so a visitor cannot plant a spreadsheet formula.
function toRow(lead, now = new Date()) {
    return [
        now.toISOString(),
        PACKAGES[lead.packageType].name,
        AUDIENCES[lead.audience],
        FOCUS[lead.focus] || '',
        lead.name,
        lead.email,
        lead.telegram,
        lead.phone,
        lead.website,
        lead.message,
        BOTTLENECKS[lead.bottleneck] || '',
        (lead.interest && PACKAGES[lead.interest] && PACKAGES[lead.interest].name) || '',
        'New'
    ];
}

async function appendToSheet(lead, { env = process.env, fetchImpl = fetch, timeoutMs = 8000 } = {}) {
    const response = await fetchImpl(env.LEAD_SHEET_WEBHOOK_URL, {
        method: 'POST',
        // Apps Script answers a POST with a redirect to the result, which fetch follows.
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.LEAD_SHEET_SECRET, columns: COLUMNS, row: toRow(lead) }),
        signal: AbortSignal.timeout(timeoutMs)
    });
    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch { /* not JSON: treated as failure below */ }
    if (!response.ok || data.ok !== true) {
        throw new Error(`Sheet webhook ${response.status}: ${(data.error || text).slice(0, 200)}`);
    }
}

module.exports = { isConfigured, toRow, appendToSheet, COLUMNS };

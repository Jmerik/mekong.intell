// Settings for the automated Quick Look scanner. Everything is OFF unless SCAN_ENABLED=1 and every
// dependency (keys, shared store, email) is configured. See docs/scanner-setup.md.
//
// Spending limits (all in US dollars):
//   per scan   hard ceiling of 0.20 in code. The environment can lower it, never raise it.
//   per day    starts at 2.00 (SCAN_DAILY_BUDGET_USD). Can be changed at any time without a deploy through
//              /api/scan-admin, but never above SCAN_DAILY_CEILING_USD (default 20, only changeable here).
//   per month  SCAN_MONTHLY_BUDGET_USD (default 40).

const PER_SCAN_CEILING_USD = 0.20;

const number = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
};

function loadConfig(env = process.env) {
    return {
        enabled: env.SCAN_ENABLED === '1',
        autosend: env.SCAN_AUTOSEND === '1',
        perScanUsd: Math.min(number(env.SCAN_MAX_COST_PER_SCAN_USD, PER_SCAN_CEILING_USD), PER_SCAN_CEILING_USD),
        dailyDefaultUsd: number(env.SCAN_DAILY_BUDGET_USD, 2),
        dailyCeilingUsd: number(env.SCAN_DAILY_CEILING_USD, 20),
        monthlyUsd: number(env.SCAN_MONTHLY_BUDGET_USD, 40),
        maxSearches: 6,
        maxProbes: 2,
        maxPages: 3,
        model: env.SCAN_MODEL || 'claude-sonnet-5-5',
        webSearchTool: env.SCAN_WEB_SEARCH_TOOL || 'web_search_20250305',
        braveQueryUsd: number(env.SCAN_SEARCH_PRICE_USD, 0.005),
        claudeSearchUsd: 0.01,
        verifyTtlSeconds: 24 * 60 * 60,
        domainRepeatDays: 30,
        limits: { ipPerHour: 3, emailPerDay: 2, globalVerificationsPerHour: 30, adminFailuresPerHour: 10 },
        siteUrl: (env.SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'https://mekongintel.live')).replace(/\/$/, '')
    };
}

module.exports = { loadConfig, PER_SCAN_CEILING_USD };

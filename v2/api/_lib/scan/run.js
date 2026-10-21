// Runs one scan inside its spending context. Order: website (free), web searches, AI assistant check.
// Every paid step goes through ctx.paid(), so the per-scan cap (0.20 USD) and the daily and monthly budgets
// are enforced before each call. A step that is skipped or fails leaves its area as N/A, never a guess.
const { safeFetch, allowedByRobots, FetchRefused } = require('./safeFetch');
const { extractSignals, pickPages, mergeSignals } = require('./extract');
const { braveSearch } = require('./search');
const probe = require('./aiProbe');
const { toMicro } = require('./budget');
const { buildReport, validateReport, brandOf } = require('./rules');

async function readSite(domain, { fetchPage, maxPages }) {
    const site = { fetched: false, https: false, reason: null, signals: null };
    const base = `https://${domain}`;
    try {
        const robots = await fetchPage(`${base}/robots.txt`).catch(() => null);
        if (robots && robots.status === 200 && !allowedByRobots(robots.body, '/')) { site.reason = 'robots'; return site; }

        const home = await fetchPage(`${base}/`);
        if (home.redirectedOffsite) { site.reason = 'offsite'; return site; }
        if (home.status !== 200 || !home.body) { site.reason = 'failed'; return site; }
        const homeSignals = extractSignals(home.body, home.url);
        const all = [homeSignals];
        for (const path of pickPages(homeSignals.internalLinks, maxPages - 1)) {
            const page = await fetchPage(new URL(path, home.url).href).catch(() => null);
            if (page && page.status === 200 && page.body) all.push(extractSignals(page.body, page.url));
        }
        site.fetched = true;
        site.https = home.https;
        site.signals = mergeSignals(all);
    } catch (error) {
        site.reason = error instanceof FetchRefused ? 'failed' : 'failed';
    }
    return site;
}

function searchPlan(target) {
    const brand = brandOf(target);
    const quoted = brand.length >= 3 ? `"${brand}"` : brand;
    const where = target.location ? ` ${target.location}` : '';
    if (target.kind === 'social') {
        const other = target.platform === 'facebook' ? 'instagram.com' : 'facebook.com';
        return [
            { area: 'found', query: `"${target.handle}" ${target.platform}` },
            { area: 'found', query: `"${target.handle}"${where || ' business'}` },
            { area: 'trusted', query: `"${target.handle}" site:linkedin.com` },
            { area: 'trusted', query: `"${target.handle}" site:${other}` },
            { area: 'trusted', query: `"${target.handle}" reviews` }
        ];
    }
    const first = target.kind === 'domain' ? target.domain : `"${target.name}"${where}`;
    return [
        { area: 'found', query: first },
        { area: 'found', query: `${quoted} company${where}` },
        { area: 'trusted', query: `${quoted} site:linkedin.com` },
        { area: 'trusted', query: `${quoted} site:facebook.com` },
        { area: 'trusted', query: `${quoted} reviews` }
    ];
}

// A domain is "found" when a result comes from it. A name is found when a result title includes it, and a social page
// when a result's title or address includes the handle (the address is how a page shows up, e.g. facebook.com/handle).
const matchesTarget = (target, results, area) => results.some((r) => {
    if (target.kind === 'domain' && area === 'found') return r.host === target.domain || r.host.endsWith(`.${target.domain}`);
    const brand = brandOf(target).toLowerCase();
    if (brand.length < 3) return false;
    const text = target.kind === 'social' ? `${r.title} ${r.path || ''}` : r.title;
    return text.toLowerCase().includes(brand);
});

async function runScan({ target, ctx, config, deps = {}, now = () => new Date() }) {
    const fetchPage = deps.fetchPage || ((url) => safeFetch(url));
    const search = deps.search || ((q) => braveSearch(q));
    const runProbe = deps.runProbe || ((t) => probe.runProbe(t, { client: deps.client || probe.createClient(), config }));
    const date = now().toISOString().slice(0, 10);

    const facts = { target, date, site: { fetched: false, https: false, reason: null, signals: null }, searches: [], probes: [] };
    if (target.kind === 'domain') facts.site = await readSite(target.domain, { fetchPage, maxPages: config.maxPages });
    else facts.site.reason = target.kind;   // 'name' or 'social': there is no website to read

    const searchWorst = toMicro(config.braveQueryUsd);
    let searchFailures = 0;
    for (const step of searchPlan(target).slice(0, config.maxSearches)) {
        if (searchFailures >= 2) break;   // provider trouble: stop spending
        const outcome = await ctx.paid(`search "${step.query}"`, searchWorst, async () => ({ value: await search(step.query), costMicro: searchWorst }));
        if (outcome.skipped) break;
        if (outcome.failed) { searchFailures += 1; continue; }
        facts.searches.push({ ...step, results: outcome.value, hit: matchesTarget(target, outcome.value, step.area) });
    }

    const probeWorst = probe.worstCaseMicro(config);
    for (let i = 0; i < config.maxProbes; i++) {
        // The second probe only runs for a business the first one could not find, to avoid a one-off miss.
        if (i === 1 && !(facts.probes[0] && facts.probes[0].answered && facts.probes[0].domainCited === false && facts.probes[0].nameMentioned === false)) break;
        const outcome = await ctx.paid('assistant check', probeWorst, async () => runProbe(target));
        if (outcome.skipped || outcome.failed) break;
        facts.probes.push(outcome.value);
    }

    const report = buildReport(facts);
    const validation = validateReport(report);
    return { report, validation, costMicro: ctx.spentMicro, skipped: ctx.skipped };
}

module.exports = { runScan, searchPlan };

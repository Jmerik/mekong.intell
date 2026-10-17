// Turns collected facts into the Quick Look report, with fixed rules. No AI model writes or rates anything here:
//   - ratings come from the rule tables below (Strong / Developing / Priority focus, or N/A when not assessed)
//   - every finding is a template filled with a checked fact, and carries its source and date
//   - validateReport() refuses a report that breaks the brand rules (so it is never sent automatically)
// Brand voice: plain short sentences, evidence only, " - " instead of dashes, no crisis language.

const RATINGS = ['Strong', 'Developing', 'Priority focus', 'N/A'];
const AREAS = ['found', 'trusted', 'reached'];

const list = (items) => items.join(', ');
const channelNames = (s) => [
    s.email && 'email', s.phone && 'phone',
    ...[...s.messaging], s.forms > 0 && 'contact form', s.chatWidget && 'chat widget'
].filter(Boolean);

function brandOf(target) {
    return target.kind === 'domain' ? target.domain.split('.')[0] : target.name;
}

function foundRating(facts) {
    const signals = [];
    for (const s of facts.searches.filter((x) => x.area === 'found' && x.results)) signals.push(s.hit);
    const hitFromSearch = signals.length ? signals.some(Boolean) : null;
    const probes = facts.probes.filter((p) => p && p.answered);
    const hitFromAi = probes.length ? probes.some((p) => p.domainCited === true || p.nameMentioned === true) : null;
    const known = [hitFromSearch, hitFromAi].filter((v) => v !== null);
    if (!known.length) return { rating: 'N/A', basis: 'Not assessed: the checks could not be completed.' };
    if (known.length === 2 && known.every(Boolean)) return { rating: 'Strong', basis: 'Both the web searches and an AI assistant found the business.' };
    if (known.some(Boolean)) return { rating: 'Developing', basis: 'The business appears in one of the two checks, not both.' };
    return { rating: 'Priority focus', basis: 'Neither the web searches nor an AI assistant returned the business.' };
}

function trustedRating(facts) {
    if (!facts.site.fetched) return { rating: 'N/A', basis: 'Not assessed: the website could not be read.' };
    const s = facts.site.signals;
    const socialFromSearch = facts.searches.some((x) => x.area === 'trusted' && x.results && x.hit);
    const points = [
        facts.site.https, s.email || s.phone, s.title && s.description || s.orgSchema, s.privacyLink, s.social.size > 0 || socialFromSearch
    ].filter(Boolean).length;
    if (points >= 4) return { rating: 'Strong', basis: `${points} of 5 trust signals found.` };
    if (points >= 2) return { rating: 'Developing', basis: `${points} of 5 trust signals found.` };
    return { rating: 'Priority focus', basis: `${points} of 5 trust signals found.` };
}

function reachedRating(facts) {
    if (!facts.site.fetched) return { rating: 'N/A', basis: 'Not assessed: the website could not be read.' };
    const n = channelNames(facts.site.signals).length;
    if (n >= 3) return { rating: 'Strong', basis: `${n} contact routes found on the pages checked.` };
    if (n >= 1) return { rating: 'Developing', basis: `${n} contact route${n === 1 ? '' : 's'} found on the pages checked.` };
    return { rating: 'Priority focus', basis: 'No contact route found on the pages checked.' };
}

function buildFindings(facts) {
    const out = [];
    const date = facts.date;
    const add = (area, text, source) => out.push({ area, text, source, date });
    const domain = facts.target.kind === 'domain' ? facts.target.domain : null;

    for (const s of facts.searches) {
        if (!s.results) continue;
        const hosts = [...new Set(s.results.map((r) => r.host))].slice(0, 3);
        const top = hosts.length ? ` The top results came from ${list(hosts)}.` : ' The search returned no results.';
        if (s.area === 'found') {
            const own = domain ? (s.hit ? `returned a page from ${domain}.` : `did not return a page from ${domain}.`) : (s.hit ? 'returned a result whose title includes the name.' : 'returned no result whose title includes the name.');
            add('found', `A web search for "${s.query}" ${own}${s.hit ? '' : top}`, 'Web search, query as quoted');
        } else {
            add('trusted', `A web search for "${s.query}" ${s.hit ? 'returned a result whose title includes the name. Check that it is the right company.' : 'did not return a result whose title includes the name.'}`, 'Web search, query as quoted');
        }
    }
    for (const p of facts.probes) {
        if (!p || !p.answered) continue;
        const own = domain ? (p.domainCited ? `cited a page from ${domain}` : `did not cite a page from ${domain}`) : (p.nameMentioned ? 'named the business' : 'did not name the business');
        add('found', `An AI assistant (Claude with one web search) was asked what the business is. Its search ${own}. This is one answer on one day, not a ranking.`, 'Claude with one web search, question as asked');
    }
    if (facts.site.fetched) {
        const s = facts.site.signals; const src = `Website: ${domain}`;
        add('trusted', facts.site.https ? 'The website is served over HTTPS.' : 'The website was reached without HTTPS.', src);
        add('trusted', s.email || s.phone ? 'Contact details are published on the pages checked.' : 'No email address or phone number was found on the pages checked.', src);
        add('trusted', s.title && s.description ? 'The homepage has a title and a description for search results.' : 'The homepage is missing a title or a description for search results.', src);
        add('trusted', s.orgSchema ? 'The homepage includes structured data that describes the organisation.' : 'The homepage has no structured data that describes the organisation.', src);
        add('trusted', s.privacyLink ? 'A privacy policy is mentioned or linked.' : 'No privacy policy was found on the pages checked.', src);
        add('trusted', s.social.size ? `The website links to: ${list([...s.social])}.` : 'The website links to no social profile.', src);
        const channels = channelNames(s);
        add('reached', channels.length ? `Contact routes found on the pages checked: ${list(channels)}.` : 'No email, phone, messaging link, contact form or chat widget was found on the pages checked.', src);
    }
    return out;
}

const NOT_ASSESSED = {
    found: ['Answers from ChatGPT and Google AI: not checked in this scan.', 'Google Business Profile and map listing: not checked in this scan.'],
    trusted: ['Customer reviews and testimonials: not checked in this scan.'],
    reached: ['Time to first reply: not measured in this scan.']
};

const FIXES = {
    notFound: { name: 'Register the website with Google Search Console and submit the sitemap', detail: 'Then repeat the same searches after four to five weeks and compare. That is the recount.', effort: 'About 30 minutes' },
    notCited: { name: 'Add a clear company description and organisation structured data to the website', detail: 'This gives search engines and AI assistants one reliable page to describe the business from.', effort: 'About 1 hour' },
    noSocial: { name: 'Create or link a LinkedIn or Facebook company page', detail: 'Link it from the website, so a search for the name has somewhere to land.', effort: 'About 1 hour' },
    noContact: { name: 'Add one-click contact buttons to the website', detail: 'For example email, WhatsApp or Telegram, so an interested buyer can reach you in one step.', effort: 'About 1 hour' },
    noHttps: { name: 'Switch the website to HTTPS', detail: 'Browsers warn visitors about sites without it. Most hosts offer it free.', effort: 'About 1 hour' },
    noPrivacy: { name: 'Add a short privacy page and link it in the footer', detail: 'It shows buyers that the business handles their details with care.', effort: 'About 30 minutes' },
    noMeta: { name: 'Add a page title and a description to the homepage', detail: 'They are what a buyer reads first in a search result.', effort: 'About 15 minutes' }
};

function chooseFixes(facts, ratings) {
    const picks = [];
    const s = facts.site.signals;
    const foundSearches = facts.searches.filter((x) => x.area === 'found' && x.results);
    if (foundSearches.length && !foundSearches.some((x) => x.hit)) picks.push(FIXES.notFound);
    if (facts.site.fetched && !facts.site.https) picks.push(FIXES.noHttps);
    if (facts.site.fetched && channelNames(s).length === 0) picks.push(FIXES.noContact);
    if (facts.site.fetched && !s.social.size && !facts.searches.some((x) => x.area === 'trusted' && x.hit)) picks.push(FIXES.noSocial);
    if (facts.probes.some((p) => p && p.answered && p.domainCited === false)) picks.push(FIXES.notCited);
    if (facts.site.fetched && !(s.title && s.description)) picks.push(FIXES.noMeta);
    if (facts.site.fetched && !s.privacyLink) picks.push(FIXES.noPrivacy);
    return picks.slice(0, 3);
}

function buildReport(facts) {
    const found = foundRating(facts); const trusted = trustedRating(facts); const reached = reachedRating(facts);
    const findings = buildFindings(facts);
    const notAssessed = { found: [...NOT_ASSESSED.found], trusted: [...NOT_ASSESSED.trusted], reached: [...NOT_ASSESSED.reached] };
    if (!facts.site.fetched && facts.target.kind === 'domain') {
        const why = { robots: 'the site asks crawlers to stay away', offsite: 'it redirects to another website', failed: 'it could not be reached' }[facts.site.reason] || 'it could not be read';
        notAssessed.trusted.unshift(`Website details: not read (${why}).`);
        notAssessed.reached.unshift(`Contact routes on the website: not read (${why}).`);
    } else if (facts.target.kind === 'name') {
        notAssessed.trusted.unshift('Website details: not read (a company name was given, not a website address).');
        notAssessed.reached.unshift('Contact routes on the website: not read (a company name was given, not a website address).');
    }
    const report = {
        target: facts.target.kind === 'domain' ? facts.target.domain : facts.target.name,
        isoDate: facts.date,
        method: 'Automated checks of public information on the date above: a web search tool, one AI assistant with web search, and the website itself. Results differ by place, tool and day, so each check is a data point, not a ranking.',
        areas: [
            { id: 'found', name: 'Found', ...found, findings: findings.filter((f) => f.area === 'found'), notAssessed: notAssessed.found },
            { id: 'trusted', name: 'Trusted', ...trusted, findings: findings.filter((f) => f.area === 'trusted'), notAssessed: notAssessed.trusted },
            { id: 'reached', name: 'Reached', ...reached, findings: findings.filter((f) => f.area === 'reached'), notAssessed: notAssessed.reached }
        ],
        fixes: chooseFixes(facts, { found, trusted, reached })
    };
    return report;
}

const DASH = /[–—]/;
function validateReport(report) {
    const problems = [];
    const check = (text, where) => {
        if (typeof text !== 'string' || !text.trim()) problems.push(`${where}: empty`);
        else if (DASH.test(text)) problems.push(`${where}: dash character`);
        else if (/https?:\/\/|<|>/.test(text)) problems.push(`${where}: link or markup`);
        else if (text.length > 600) problems.push(`${where}: too long`);
    };
    if (!report || !Array.isArray(report.areas) || report.areas.length !== 3) return { ok: false, problems: ['areas missing'] };
    check(report.target, 'target');
    for (const area of report.areas) {
        if (!AREAS.includes(area.id)) problems.push(`area ${area.id}: unknown`);
        if (!RATINGS.includes(area.rating)) problems.push(`${area.id}: bad rating`);
        check(area.basis, `${area.id} basis`);
        if (area.rating !== 'N/A' && !area.findings.length) problems.push(`${area.id}: rating without findings`);
        for (const f of area.findings) {
            check(f.text, `${area.id} finding`);
            check(f.source, `${area.id} source`);
            if (!(f.date === 'N/A' || /^\d{4}-\d{2}-\d{2}$/.test(f.date))) problems.push(`${area.id}: bad date`);
        }
        for (const line of area.notAssessed) check(line, `${area.id} not assessed`);
    }
    for (const fix of report.fixes) { check(fix.name, 'fix'); check(fix.detail, 'fix detail'); check(fix.effort, 'fix effort'); }
    return { ok: problems.length === 0, problems };
}

const summaryLine = (report) => report.areas.map((a) => `${a.name}: ${a.rating}`).join(' | ');

function reportToText(report) {
    const lines = [`Quick Look: ${report.target}`, `Checked on ${report.isoDate}. Public information only.`, '', summaryLine(report), ''];
    for (const area of report.areas) {
        lines.push(`${area.name.toUpperCase()}: ${area.rating}`, area.basis);
        for (const f of area.findings) lines.push(`- ${f.text} (${f.source}, ${f.date})`);
        for (const n of area.notAssessed) lines.push(`- N/A: ${n}`);
        lines.push('');
    }
    if (report.fixes.length) {
        lines.push('QUICK FIXES WE WOULD START WITH');
        report.fixes.forEach((fix, i) => lines.push(`${i + 1}. ${fix.name}. ${fix.detail} Effort: ${fix.effort}.`));
        lines.push('');
    }
    lines.push(report.method);
    return lines.join('\n');
}

module.exports = { buildReport, validateReport, reportToText, summaryLine, brandOf, channelNames, RATINGS };

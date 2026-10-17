// A fetch that cannot be turned against our own infrastructure (SSRF protection).
//
//   - only http/https on the default ports (80/443), never IP addresses or "localhost" in the address
//   - the name is resolved once and the connection goes to THAT address; every resolved address must be
//     public, so private, loopback, link-local (cloud metadata), carrier and reserved ranges are refused,
//     and a DNS answer that changes between check and connect cannot sneak through
//   - redirects are followed by hand (max 3), each one re-checked, and only within the same site
//   - hard limits on time and size; only HTML is read; we identify ourselves and honour robots.txt
const http = require('node:http');
const https = require('node:https');
const dns = require('node:dns');
const net = require('node:net');
const { validDomain } = require('./guard');

const USER_AGENT = 'MekongIntelligenceBot/1.0 (+https://mekongintel.live)';
const MAX_BYTES = 400 * 1024;
const TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 3;

class FetchRefused extends Error {
    constructor(code, message) { super(message || code); this.code = code; this.notBilled = true; }
}

function ipv4Blocked(a, b, c) {
    return a === 0 || a === 10 || a === 127 ||
        (a === 100 && b >= 64 && b <= 127) ||        // carrier-grade NAT
        (a === 169 && b === 254) ||                   // link-local, includes cloud metadata 169.254.169.254
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 192 && b === 0 && c === 0) ||          // IETF protocol assignments
        (a === 192 && b === 0 && c === 2) ||          // documentation
        (a === 198 && (b === 18 || b === 19)) ||      // benchmarking
        (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113) ||
        a >= 224;                                     // multicast and reserved
}

// Expand an IPv6 text address to eight 16-bit words (null if it is not valid).
function ipv6Words(text) {
    let address = text.toLowerCase().split('%')[0];
    const tail = address.match(/(\d+\.\d+\.\d+\.\d+)$/);
    if (tail) {
        const p = tail[1].split('.').map(Number);
        address = address.slice(0, -tail[1].length) + ((p[0] << 8) | p[1]).toString(16) + ':' + ((p[2] << 8) | p[3]).toString(16);
    }
    const halves = address.split('::');
    if (halves.length > 2) return null;
    const left = halves[0] ? halves[0].split(':') : [];
    const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
    const fill = halves.length === 2 ? 8 - left.length - right.length : 0;
    if (fill < 0 || (halves.length === 1 && left.length !== 8)) return null;
    const words = [...left, ...Array(fill).fill('0'), ...right].map((w) => parseInt(w || '0', 16));
    return words.length === 8 && words.every((w) => Number.isInteger(w) && w >= 0 && w <= 0xffff) ? words : null;
}

function isBlockedIp(ip) {
    if (net.isIPv4(ip)) {
        const [a, b, c] = ip.split('.').map(Number);
        return ipv4Blocked(a, b, c);
    }
    if (net.isIPv6(ip)) {
        const w = ipv6Words(ip);
        if (!w) return true;
        if (w.every((x) => x === 0) || (w.slice(0, 7).every((x) => x === 0) && w[7] === 1)) return true;   // :: and ::1
        if ((w[0] & 0xfe00) === 0xfc00 || (w[0] & 0xffc0) === 0xfe80 || (w[0] & 0xff00) === 0xff00) return true;   // unique-local, link-local, multicast
        if (w[0] === 0x2001 && w[1] === 0x0db8) return true;   // documentation
        if (w[0] === 0x2002 || (w[0] === 0x0064 && w[1] === 0xff9b)) return true;   // 6to4 and NAT64 embed IPv4 addresses
        if (w.slice(0, 5).every((x) => x === 0) && w[5] === 0xffff) return ipv4Blocked(w[6] >> 8, w[6] & 0xff, w[7] >> 8);   // IPv4-mapped
        if (w.slice(0, 6).every((x) => x === 0)) return true;   // IPv4-compatible
        return false;
    }
    return true;   // not an IP at all: refuse
}

// dns.lookup replacement used for the real connection: resolves, checks every address, returns a safe one.
function safeLookup(lookupImpl = dns.lookup) {
    return (hostname, options, callback) => {
        const cb = typeof options === 'function' ? options : callback;
        const wantAll = typeof options === 'object' && options && options.all;
        lookupImpl(hostname, { all: true, verbatim: true }, (error, addresses) => {
            if (error) return cb(error);
            if (!addresses.length || addresses.some((a) => isBlockedIp(a.address))) {
                return cb(new FetchRefused('blocked_address', `Refused: ${hostname} resolves to a non-public address`));
            }
            const first = addresses[0];
            return wantAll ? cb(null, [first]) : cb(null, first.address, first.family);
        });
    };
}

function checkUrl(url) {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new FetchRefused('scheme');
    if (url.port && url.port !== (url.protocol === 'https:' ? '443' : '80')) throw new FetchRefused('port');
    if (url.username || url.password) throw new FetchRefused('credentials');
    const host = url.hostname.toLowerCase();
    if (net.isIP(host.replace(/^\[|\]$/g, '')) || !validDomain(host)) throw new FetchRefused('bad_host');
}

const sameSite = (a, b) => a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`) || a.replace(/^www\./, '') === b.replace(/^www\./, '');

function requestOnce(url, { lookupImpl, allowLoopbackForTests }) {
    return new Promise((resolve, reject) => {
        const secure = url.protocol === 'https:';
        const lookup = allowLoopbackForTests ? undefined : safeLookup(lookupImpl);
        const request = (secure ? https : http).request({
            hostname: url.hostname, port: url.port || (secure ? 443 : 80), path: `${url.pathname}${url.search}`, method: 'GET',
            headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5', 'Accept-Encoding': 'identity' },
            lookup, servername: url.hostname, timeout: TIMEOUT_MS
        }, (response) => {
            const chunks = []; let size = 0; let truncated = false;
            response.on('data', (chunk) => {
                size += chunk.length;
                if (size > MAX_BYTES) { truncated = true; response.destroy(); return; }
                chunks.push(chunk);
            });
            const finish = () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString('utf8'), truncated });
            response.on('end', finish);
            response.on('close', finish);
            response.on('error', reject);
        });
        const deadline = setTimeout(() => request.destroy(new Error('timeout')), TIMEOUT_MS * 2);
        request.on('timeout', () => request.destroy(new Error('timeout')));
        request.on('error', (error) => { clearTimeout(deadline); reject(error); });
        request.on('close', () => clearTimeout(deadline));
        request.end();
    });
}

// Returns { status, url, https, body, truncated, redirectedOffsite }. Throws FetchRefused for refused targets.
async function safeFetch(startUrl, { lookupImpl, allowLoopbackForTests = false } = {}) {
    let url = new URL(startUrl);
    const origin = url.hostname.toLowerCase();
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
        if (!allowLoopbackForTests) checkUrl(url);
        const result = await requestOnce(url, { lookupImpl, allowLoopbackForTests });
        const location = result.headers.location;
        if ([301, 302, 303, 307, 308].includes(result.status) && location) {
            let next;
            try { next = new URL(location, url); } catch { throw new FetchRefused('bad_redirect'); }
            if (!allowLoopbackForTests && !sameSite(next.hostname.toLowerCase(), origin)) {
                return { status: result.status, url: url.href, https: url.protocol === 'https:', body: '', truncated: false, redirectedOffsite: next.hostname.toLowerCase() };
            }
            url = next;
            continue;
        }
        const type = String(result.headers['content-type'] || '').toLowerCase();
        const readable = /text\/html|application\/xhtml|text\/plain/.test(type);
        return { status: result.status, url: url.href, https: url.protocol === 'https:', body: readable ? result.body : '', truncated: result.truncated, redirectedOffsite: null };
    }
    throw new FetchRefused('too_many_redirects');
}

// robots.txt: is our crawler allowed to read `path`? Longest matching rule wins; allowed when unsure.
function allowedByRobots(robotsText, path = '/') {
    const lines = String(robotsText || '').split(/\r?\n/).map((l) => l.replace(/#.*/, '').trim()).filter(Boolean);
    const groups = []; let current = null;
    for (const line of lines) {
        const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
        if (!m) continue;
        const key = m[1].toLowerCase(); const value = m[2].trim();
        if (key === 'user-agent') {
            if (!current || current.rules.length) { current = { agents: [], rules: [] }; groups.push(current); }
            current.agents.push(value.toLowerCase());
        } else if (current && (key === 'allow' || key === 'disallow')) {
            current.rules.push({ allow: key === 'allow', path: value });
        }
    }
    const mine = groups.filter((g) => g.agents.some((a) => 'mekongintelligencebot'.includes(a) && a !== '*' && a));
    const rules = (mine.length ? mine : groups.filter((g) => g.agents.includes('*'))).flatMap((g) => g.rules);
    let best = null;
    for (const rule of rules) {
        if (!rule.path || !path.startsWith(rule.path.replace(/\*.*$/, '').replace(/\$$/, ''))) continue;
        if (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.allow)) best = rule;
    }
    return !best || best.allow;
}

module.exports = { safeFetch, safeLookup, isBlockedIp, allowedByRobots, FetchRefused, USER_AGENT, MAX_BYTES };

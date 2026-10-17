// Best-effort rate limit for the lead endpoint.
//
// Serverless instances do not share memory, so this only slows down a bot hammering one warm
// instance. It is a speed bump, not a guarantee. For real protection before launch, add Vercel's
// WAF rate limiting (or a shared store such as Upstash Redis) in front of /api/book.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map();

function isLimited(key, now = Date.now()) {
    const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
        hits.set(key, recent);
        return true;
    }
    recent.push(now);
    hits.set(key, recent);

    // Keep memory bounded on a long-lived instance.
    if (hits.size > 5000) {
        for (const [k, times] of hits) {
            if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(k);
        }
    }
    return false;
}

function clientKey(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return (first || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

module.exports = { isLimited, clientKey, MAX_REQUESTS, WINDOW_MS };

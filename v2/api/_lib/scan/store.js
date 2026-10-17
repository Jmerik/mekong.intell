// A small shared key-value store (Redis over HTTPS), used for the spending counters, rate limits and
// confirmation tokens. Serverless instances do not share memory, so these cannot live in the function.
//
// Works with Vercel's Redis integration (KV_REST_API_URL / KV_REST_API_TOKEN) or Upstash directly
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). There is deliberately NO in-memory fallback in
// production: without a shared store the spending limits cannot be enforced, so the scanner stays off.

function createRestStore({ url, token, fetchImpl = fetch, timeoutMs = 5000 }) {
    async function cmd(...args) {
        const response = await fetchImpl(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(args),
            signal: AbortSignal.timeout(timeoutMs)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.error) throw new Error(`Store error ${response.status}: ${String(data.error || '').slice(0, 120)}`);
        return data.result;
    }
    return {
        get: (key) => cmd('GET', key),
        set: async (key, value, { ex, nx } = {}) => {
            const args = ['SET', key, String(value)];
            if (ex) args.push('EX', ex);
            if (nx) args.push('NX');
            return (await cmd(...args)) === 'OK';
        },
        incrby: (key, n) => cmd('INCRBY', key, n),
        decrby: (key, n) => cmd('DECRBY', key, n),
        expire: (key, seconds) => cmd('EXPIRE', key, seconds),
        del: (key) => cmd('DEL', key),
        getdel: (key) => cmd('GETDEL', key)
    };
}

// For tests and local development only. Never selected automatically.
function createMemoryStore({ now = () => Date.now() } = {}) {
    const data = new Map();
    const live = (key) => {
        const entry = data.get(key);
        if (!entry) return undefined;
        if (entry.expires && entry.expires <= now()) { data.delete(key); return undefined; }
        return entry;
    };
    return {
        async get(key) { const e = live(key); return e ? e.value : null; },
        async set(key, value, { ex, nx } = {}) {
            if (nx && live(key)) return false;
            data.set(key, { value: String(value), expires: ex ? now() + ex * 1000 : 0 });
            return true;
        },
        async incrby(key, n) {
            const e = live(key);
            const next = (e ? Number(e.value) : 0) + n;
            data.set(key, { value: String(next), expires: e ? e.expires : 0 });
            return next;
        },
        async decrby(key, n) { return this.incrby(key, -n); },
        async expire(key, seconds) { const e = live(key); if (e) e.expires = now() + seconds * 1000; return e ? 1 : 0; },
        async del(key) { return data.delete(key) ? 1 : 0; },
        async getdel(key) { const e = live(key); data.delete(key); return e ? e.value : null; }
    };
}

function storeFromEnv(env = process.env, fetchImpl = fetch) {
    const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
    const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
    return url && token ? createRestStore({ url, token, fetchImpl }) : null;
}

module.exports = { createRestStore, createMemoryStore, storeFromEnv };

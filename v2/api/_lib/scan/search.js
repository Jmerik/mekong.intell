// Web search through the Brave Search API (BRAVE_API_KEY). Returns only what we need: title and address.
class ProviderError extends Error {
    constructor(message, { notBilled = false } = {}) { super(message); this.notBilled = notBilled; }
}

async function braveSearch(query, { env = process.env, fetchImpl = fetch, timeoutMs = 8000 } = {}) {
    const url = `https://api.search.brave.com/res/v1/web/search?${new URLSearchParams({ q: query, count: '5' })}`;
    let response;
    try {
        response = await fetchImpl(url, {
            headers: { Accept: 'application/json', 'X-Subscription-Token': env.BRAVE_API_KEY },
            signal: AbortSignal.timeout(timeoutMs)
        });
    } catch (error) {
        throw new ProviderError(`search request failed: ${error.name}`);   // unclear outcome: counted as spent
    }
    if (!response.ok) throw new ProviderError(`search returned ${response.status}`, { notBilled: true });
    const data = await response.json().catch(() => null);
    const items = data && data.web && Array.isArray(data.web.results) ? data.web.results : [];
    return items.slice(0, 5).map((item) => {
        let host = '';
        try { host = new URL(String(item.url)).hostname.toLowerCase().replace(/^www\./, ''); } catch { /* skip */ }
        return { host, path: (() => { try { return new URL(String(item.url)).pathname; } catch { return ''; } })(), title: String(item.title || '').replace(/<[^>]+>/g, '').slice(0, 160) };
    }).filter((item) => item.host);
}

module.exports = { braveSearch, ProviderError };

// Spending control. Amounts are whole micro-dollars (1,000,000 = 1 US dollar) so counters stay exact.
//
// Every paid step first RESERVES its worst-case cost against the daily and monthly counters (an atomic
// increment: if it would pass the limit, it is undone and the step is skipped). When the step finishes,
// the reservation is corrected to the real cost. The per-scan cap works the same way inside one scan.

const MICRO = 1_000_000;
const toMicro = (usd) => Math.round(usd * MICRO);
const toUsd = (micro) => Math.round(micro) / MICRO;

// US dollars per million tokens (Anthropic price list, checked 2026-10-06).
const MODEL_PRICES = {
    'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
    'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 }
};

function modelCostMicro(model, usage = {}) {
    const price = MODEL_PRICES[model];
    if (!price) return Infinity;   // unknown model: treat as unaffordable rather than free
    const tokens = (n, rate) => (Number(n) || 0) * rate;   // micro-dollars = tokens x ($/MTok)
    return Math.ceil(
        tokens(usage.input_tokens, price.input) + tokens(usage.output_tokens, price.output) +
        tokens(usage.cache_read_input_tokens, price.cacheRead) + tokens(usage.cache_creation_input_tokens, price.cacheWrite)
    );
}

const dayKey = (now = new Date()) => now.toISOString().slice(0, 10);
const monthKey = (now = new Date()) => now.toISOString().slice(0, 7);
const spendKeys = (now) => ({ day: `scan:spend:day:${dayKey(now)}`, month: `scan:spend:month:${monthKey(now)}` });

// Today's limit: the value set through the admin endpoint, else the default, never above the ceiling.
async function getSettings(store, config) {
    const [enabledRaw, limitRaw] = await Promise.all([store.get('scan:enabled'), store.get('scan:daily_limit_usd')]);
    const override = limitRaw === null || limitRaw === undefined ? null : Number(limitRaw);
    const wanted = Number.isFinite(override) && override >= 0 ? override : config.dailyDefaultUsd;
    return {
        enabled: enabledRaw !== '0',
        dailyLimitUsd: Math.min(wanted, config.dailyCeilingUsd)
    };
}

async function getSpend(store, now = new Date()) {
    const keys = spendKeys(now);
    const [day, month] = await Promise.all([store.get(keys.day), store.get(keys.month)]);
    return { dayMicro: Number(day) || 0, monthMicro: Number(month) || 0 };
}

async function reserve(store, config, micro, now = new Date()) {
    if (!Number.isFinite(micro) || micro < 0) return false;
    const settings = await getSettings(store, config);
    if (!settings.enabled) return false;
    const keys = spendKeys(now);
    const dayTotal = await store.incrby(keys.day, micro);
    if (dayTotal === micro) await store.expire(keys.day, 3 * 24 * 3600);
    if (dayTotal > toMicro(settings.dailyLimitUsd)) {
        await store.decrby(keys.day, micro);
        return false;
    }
    const monthTotal = await store.incrby(keys.month, micro);
    if (monthTotal === micro) await store.expire(keys.month, 40 * 24 * 3600);
    if (monthTotal > toMicro(config.monthlyUsd)) {
        await store.decrby(keys.month, micro);
        await store.decrby(keys.day, micro);
        return false;
    }
    return true;
}

// Correct a reservation to what was really spent (can be lower or, rarely, higher).
async function settle(store, reservedMicro, actualMicro, now = new Date()) {
    const diff = Math.round(actualMicro - reservedMicro);
    if (diff === 0) return;
    const keys = spendKeys(now);
    const apply = diff > 0 ? (k) => store.incrby(k, diff) : (k) => store.decrby(k, -diff);
    await apply(keys.day);
    await apply(keys.month);
}

// Is there room for at least one more scan? A cheap check before bothering a visitor with an email.
async function hasRoom(store, config, minimumMicro, now = new Date()) {
    const settings = await getSettings(store, config);
    if (!settings.enabled) return { ok: false, reason: 'switched_off' };
    const spend = await getSpend(store, now);
    if (spend.dayMicro + minimumMicro > toMicro(settings.dailyLimitUsd)) return { ok: false, reason: 'daily_budget' };
    if (spend.monthMicro + minimumMicro > toMicro(config.monthlyUsd)) return { ok: false, reason: 'monthly_budget' };
    return { ok: true };
}

// A spending context for ONE scan. paid() is the only way a paid step runs.
function createScanContext({ store, config, now = () => new Date(), onAlert = async () => {} }) {
    const capMicro = toMicro(config.perScanUsd);
    const ctx = {
        spentMicro: 0,
        capMicro,
        skipped: [],
        async paid(label, worstMicro, operation) {
            if (ctx.spentMicro + worstMicro > capMicro) { ctx.skipped.push(`${label}: per-scan cap`); return { skipped: 'per_scan_cap' }; }
            if (!(await reserve(store, config, worstMicro, now()))) { ctx.skipped.push(`${label}: budget`); return { skipped: 'budget' }; }
            ctx.spentMicro += worstMicro;
            let actual = worstMicro;   // if the outcome is unclear (timeout, crash), count the worst case
            try {
                const outcome = await operation();
                actual = Number.isFinite(outcome.costMicro) ? outcome.costMicro : worstMicro;
                return { value: outcome.value };
            } catch (error) {
                if (error && error.notBilled === true) actual = 0;
                ctx.skipped.push(`${label}: ${error && error.message ? String(error.message).slice(0, 80) : 'failed'}`);
                return { failed: true };
            } finally {
                ctx.spentMicro += actual - worstMicro;
                await settle(store, worstMicro, actual, now()).catch(() => {});
                await maybeAlert(store, config, now(), onAlert).catch(() => {});
            }
        }
    };
    return ctx;
}

// Tell the owner once per day when 50%, 80% and 100% of the daily budget has been used.
async function maybeAlert(store, config, now, onAlert) {
    const settings = await getSettings(store, config);
    const limit = toMicro(settings.dailyLimitUsd);
    if (limit <= 0) return;
    const { dayMicro } = await getSpend(store, now);
    for (const pct of [100, 80, 50]) {
        if (dayMicro * 100 >= limit * pct) {
            if (await store.set(`scan:alert:${dayKey(now)}:${pct}`, '1', { nx: true, ex: 3 * 24 * 3600 })) {
                await onAlert(`Scanner budget: ${pct}% of today's limit used (${toUsd(dayMicro).toFixed(2)} of ${settings.dailyLimitUsd.toFixed(2)} USD).`);
            }
            return;
        }
    }
}

module.exports = { MICRO, toMicro, toUsd, MODEL_PRICES, modelCostMicro, dayKey, getSettings, getSpend, reserve, settle, hasRoom, createScanContext };

// Telegram notifications (shared by the lead handler and the scanner).
const isConfigured = (env = process.env) => Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);

async function send(text, { env = process.env, fetchImpl = fetch } = {}) {
    const response = await fetchImpl(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`Telegram API ${response.status}: ${await response.text()}`);
}

module.exports = { isConfigured, send };

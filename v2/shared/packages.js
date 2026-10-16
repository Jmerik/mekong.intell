// Single source of truth for the names a visitor sees and the names that arrive in Telegram.
// Used by the browser bundle (src/) and the serverless function (api/).

const PACKAGES = {
    quicklook: { name: 'Free Quick Look', modalTitle: 'Request your Free Quick Look' },
    sprint: { name: '7-Day Sprint', modalTitle: 'Ask about the 7-Day Sprint' },
    blueprint: { name: '90-Day Blueprint', modalTitle: 'Ask about the 90-Day Blueprint' },
    retainer: { name: 'Market Intelligence Retainer', modalTitle: 'Ask about the Market Intelligence Retainer' },
    entry: { name: 'Market Entry Brief', modalTitle: 'Ask about the Market Entry Brief' },
    call: { name: 'Call request', modalTitle: 'Book a Strategy Call' },
    contact: { name: 'Contact form message', modalTitle: 'Send us a message' }
};

// Which landing page the visitor came from. "general" is the home page or a page without an audience.
const AUDIENCES = {
    general: 'General',
    local: 'Local',
    international: 'International',
    de: 'German-speaking (DE)'
};

// Which of the three Quick Look checks a visitor clicked.
const FOCUS = {
    found: 'Found',
    trusted: 'Trusted',
    reached: 'Reached'
};

// "What is your primary bottleneck?" on the contact form.
const BOTTLENECKS = {
    'ai-search': 'AI Search Visibility (GEO/AEO)',
    funnel: 'Funnel Leakage / Low Conversions',
    competitors: 'Competitor Tracking / Market Intelligence',
    strategy: 'General Strategy Consultation'
};

// Which service a visitor was looking at when they opened the contact form (/contact?interest=sprint).
const INTERESTS = ['quicklook', 'sprint', 'blueprint', 'retainer', 'entry'];

module.exports = { PACKAGES, AUDIENCES, FOCUS, BOTTLENECKS, INTERESTS };

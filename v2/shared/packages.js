// Single source of truth for the names a visitor sees and the names that arrive in Telegram.
// Used by the browser bundle (src/) and the serverless function (api/).

const PACKAGES = {
    quicklook: { name: 'Free Quick Look', modalTitle: 'Request your Free Quick Look' },
    sprint: { name: '7-Day Sprint', modalTitle: 'Ask about the 7-Day Sprint' },
    blueprint: { name: '90-Day Blueprint', modalTitle: 'Ask about the 90-Day Blueprint' },
    retainer: { name: 'Market Intelligence Retainer', modalTitle: 'Ask about the Market Intelligence Retainer' },
    call: { name: 'Call request', modalTitle: 'Book a Call' },
    contact: { name: 'Contact form message', modalTitle: 'Send us a message' }
};

// Which landing page the visitor came from. "general" is the home page or a page without an audience.
const AUDIENCES = {
    general: 'General',
    local: 'Local',
    international: 'International'
};

// Which of the three Quick Look checks a visitor clicked.
const FOCUS = {
    found: 'Found',
    trusted: 'Trusted',
    reached: 'Reached'
};

module.exports = { PACKAGES, AUDIENCES, FOCUS };

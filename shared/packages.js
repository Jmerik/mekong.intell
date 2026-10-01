// Single source of truth for package and goal names, used by both the
// browser bundle (src/App.jsx) and the API (lib/lead.js), so the name a
// visitor clicks is the name that arrives in Telegram.

const PACKAGES = {
    audit: { name: 'The 72-Hour Intelligence Audit', modalTitle: 'Book The 72-Hour Audit' },
    sprint: { name: 'The Strategy Sprint', modalTitle: 'Book The Strategy Sprint' },
    retainer: { name: 'The Intelligence Retainer', modalTitle: 'Start the Intelligence Retainer' },
    dashboard: { name: 'Market Intelligence Dashboard (add-on)', modalTitle: 'Add the Market Intelligence Dashboard' },
    fullbuild: { name: 'The Full Build', modalTitle: 'Discuss The Full Build' },
    call: { name: 'Strategy Call', modalTitle: 'Book a Strategy Call' }
};

const GOALS = {
    leads: 'Increase Leads',
    awareness: 'Brand Awareness',
    audit: 'Fix Broken Marketing',
    launch: 'New Product Launch'
};

module.exports = { PACKAGES, GOALS };

// The two landing pages share every section; only the wording and the mock examples change.
//
//   local          the main page (/): businesses that sell to customers in Cambodia and Vietnam
//   international  /international: businesses that sell across borders, into the region or out of it
//
// To adjust a landing page, edit its entry below. To add a third audience, add an entry here,
// a page in content/pages.js, a key in shared/packages.js (AUDIENCES), and a route in pages/index.jsx.
// Visitors on the main page (/) are tagged "Local" in lead messages.

export const AUDIENCES = {
    local: {
        id: 'local',
        path: '/',
        switchLabel: 'Local',
        line: 'Brand and market intelligence for businesses in Cambodia and Vietnam.',
        found: {
            body: 'When potential buyers search on Google or Maps, or ask AI search engines like ChatGPT and Claude, are you showing up, or is AI recommending your competitors instead?',
            prompt: 'Best accounting firm in Phnom Penh?',
            others: ['Competitor A', 'Competitor B']
        },
        trusted: {
            body: 'Customers find you, but do you look active and reliable? Unverified details, missing reviews, or incomplete profiles can make buyers look elsewhere.',
            business: 'Your Business',
            area: 'Phnom Penh',
            rating: '4.8',
            reviews: '126 reviews',
            checks: ['Google Business Profile', 'Facebook Page', 'Telegram and Messenger contact']
        },
        reached: {
            body: 'Can interested customers message you easily? We install one-click chat buttons, automated first replies, and order logs so no lead gets dropped.',
            channels: ['Telegram', 'Messenger'],
            before: '45 min',
            after: 'Instant'
        },
        sprintNote: 'Typical fixes include a complete Google Business Profile, one-click chat buttons and review prompts.'
    },

    international: {
        id: 'international',
        path: '/international',
        switchLabel: 'International',
        line: 'Brand and market intelligence for companies selling into or out of Cambodia and Vietnam.',
        found: {
            body: 'When buyers research suppliers and partners on Google or LinkedIn, or ask AI search engines like ChatGPT and Claude, are you showing up, or is AI recommending your competitors instead?',
            prompt: 'Best supplier of packaging in Vietnam?',
            others: ['Competitor A', 'Competitor B']
        },
        trusted: {
            body: 'Buyers check you out before they write. Do you look established and verifiable? Missing company details, thin profiles, or no references can end the conversation before it starts.',
            business: 'Your Company',
            area: 'Ho Chi Minh City',
            rating: '4.8',
            reviews: '38 reviews',
            checks: ['LinkedIn Company Page', 'Website with company details', 'Reviews and references']
        },
        reached: {
            body: 'Can a buyer reach you in one step? We set up clear contact routes, automated first replies, and an enquiry log so no lead gets dropped.',
            channels: ['Email', 'LinkedIn', 'WhatsApp'],
            before: '1 day',
            after: 'Instant'
        },
        sprintNote: 'Typical fixes include a complete LinkedIn page, clear contact routes and an AI-readable company profile.'
    }
};

export const AUDIENCE_LIST = [AUDIENCES.local, AUDIENCES.international];

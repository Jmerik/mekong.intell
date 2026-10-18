// Site-wide content. Edit copy here; components only lay it out.
// Brand voice: consultative, plain short sentences, evidence only, no crisis language.
// Write " - " instead of em or en dashes.

// The Quick Look is prepared by hand until the scanner is connected, so the promise is a delivery time.
// Change it here and every page, form and message follows.
export const QUICK_LOOK = {
    cta: 'Request my Free Quick Look',
    delivery: 'within 2 working days'
};

export const SITE = {
    name: 'Mekong Intelligence',
    tagline: 'Stop Guessing. Start Growing.',
    telegramUrl: 'https://t.me/mekongintelligence',
    linkedinUrl: 'https://www.linkedin.com/in/vosumtey-seng/',
    location: 'Phnom Penh, Cambodia',
    // How fast we reply to an email inquiry. Only promise what can be met, including weekends and holidays.
    replyTime: 'within 1 working day',

    // SCANNER PLACEHOLDER: set to true when the Quick Look scanner is live (see api/_lib/scanner.js).
    // While false, the Quick Look is described as a free request that the team prepares.
    scannerEnabled: false,

    // Shown at the very top of every page of the preview build. Set PREVIEW_BANNER=0 at build time to hide it.
    previewBanner: 'Preview build. The Quick Look scanner is not connected yet.'
};

// First screen. The line saying who we serve and where comes from the audience (content/audiences.js).
export const HERO = {
    tagline: 'Stop Guessing. Start Growing with Data.',
    // A no-break space keeps the "&" on the same line as "Brand".
    headline: ["Southeast Asia's Brand\u00a0&", 'Market Intelligence', 'Firm.'],
    headlineAccentLine: 1,
    subheadline: 'Look. Fix. Count.',
    placeholder: 'Your website, Facebook page or company name',
    button: QUICK_LOOK.cta,
    note: {
        live: 'Instant analysis on whether your business is Found, Trusted, and Reached. No credit card required.',
        manual: `A free first read on whether your business is Found, Trusted, and Reached. Delivered ${QUICK_LOOK.delivery}, based on public information only. No credit card required.`
    }
};

// Verifiable operational facts (replace the old stats strip).
export const FACTS = [
    { value: 'Free', label: 'Quick Look' },
    { value: '7 Days', label: '3 Fixes Live' },
    { value: 'Day 35', label: 'Numbers Recounted' }
];

// The four-step ladder, in order. Product names are the ones used everywhere: cards, forms, Telegram,
// the Services page and the structured data. `package` is the key in shared/packages.js.
export const SERVICES = [
    {
        step: 'Step 1',
        package: 'quicklook',
        name: 'Free Quick Look',
        when: 'Day 0',
        promise: 'Where you are Found, Trusted and Reached',
        description: 'A free first read of your digital footprint, and where to focus first.',
        button: QUICK_LOOK.cta,
        scope: 'No credit card required',
        depth: {
            local: 'A first read of your public footprint on Google, maps, Facebook and Telegram.',
            international: 'A first read of your public footprint on Google, LinkedIn, AI assistants and your website.'
        },
        includes: [
            'Found, Trusted and Reached check',
            'Based on public information only',
            'Anything we cannot verify is marked N/A',
            `Delivered to your email ${QUICK_LOOK.delivery}`
        ]
    },
    {
        step: 'Step 2',
        package: 'sprint',
        name: '7-Day Sprint',
        when: 'Days 1 to 7',
        promise: '3 fixes live in 7 days',
        description: 'Direct deployment of critical search visibility, trust signals, and conversion fixes.',
        cta: 'Request the 7-Day Sprint',
        timeline: '7 days',
        scope: 'Fixed scope',
        depth: {
            local: 'Fixed scope. Three fixes chosen from your Quick Look, such as one-click chat buttons, a complete Google Business Profile or review prompts.',
            international: 'Fixed scope. Three fixes chosen from your Quick Look, such as a complete LinkedIn page, clear contact routes or an AI-readable company profile.'
        },
        includes: [
            'A diagnostic of your core funnel, then 3 high-impact fixes',
            'Examples: chat funnel setup, citation correction, storefront verification',
            'Live in 7 days'
        ]
    },
    {
        step: 'Step 3',
        package: 'blueprint',
        name: '90-Day Blueprint',
        when: '90 days',
        promise: 'Roadmap, and a recount on day 35',
        milestone: 'Day 35: baseline recount',
        description: 'A complete data-led growth roadmap, with the numbers recounted on day 35 and scalable channel execution.',
        cta: 'Discuss the 90-Day Blueprint',
        timeline: '90 days',
        scope: 'Roadmap and recount',
        depth: {
            local: 'A roadmap for your local market: search visibility, trust signals and the chat funnel.',
            international: 'A roadmap for cross-border buyers: competitor benchmarks in the target market, AI search visibility and conversion paths.'
        },
        includes: [
            'Competitor benchmark audit',
            'AI search visibility strategy (GEO/AEO)',
            'Conversion funnel optimization',
            'Complete technical roadmap, 90 days',
            'Baseline recount on day 35'
        ]
    },
    {
        step: 'Step 4',
        package: 'retainer',
        name: 'Market Intelligence Retainer',
        when: 'Monthly',
        promise: 'Weekly market updates',
        description: 'Weekly market updates, competitor tracking, and AI search monitoring delivered straight to your operations.',
        cta: 'Ask about the Retainer',
        badge: 'Ongoing',
        timeline: 'Monthly',
        scope: 'Standalone subscription',
        depth: {
            local: 'Ongoing tracking of competitors and AI visibility in your local market.',
            international: 'Ongoing tracking of competitors and AI visibility in your home and target markets.'
        },
        includes: [
            'Monthly growth review',
            'Competitor movement alerts, with bi-weekly scans of your top 5',
            'AI visibility monitoring',
            'Weekly Impact Brief on shifts in algorithms, AI tools and the economy',
            'Dedicated advisory sessions',
            'Market Intelligence Dashboard'
        ]
    }
];

// Only offered to international and regional expansion clients. It is shown on /international and in the
// "International / Regional" view of /services, and never for local-only businesses.
// "Regulatory research" means public information, not legal advice (the disclaimer is shown on the card).
export const MARKET_ENTRY = {
    package: 'entry',
    name: 'Market Entry Brief',
    badge: 'International and regional expansion',
    promise: 'Cross-border expansion intelligence',
    description: 'For international brands entering regional markets, and regional players expanding abroad: tailored positioning, regulatory research and a map of the competition.',
    cta: 'Request the Market Entry Brief',
    scope: 'Tailored scope',
    availability: 'For international and regional expansion only. Not offered for local-only businesses.',
    depth: 'Tailored positioning and regulatory research for cross-border expansion, based on public information.',
    disclaimer: 'Regulatory research is general information, not legal advice.',
    includes: [
        'Regional market entry roadmap',
        'Local competitor gap analysis',
        'Cross-border digital footprint mapping'
    ]
};

export const NAV = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Resources', href: '/resources' },
    { label: 'Team', href: '/team' },
    { label: 'Contact Us', href: '/contact' }
];

// The nav's call to action. It goes to the contact page, as in the website specification.
export const STRATEGY_CALL = { label: 'Book a Strategy Call', href: '/contact' };

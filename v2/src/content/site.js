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

    // SCANNER PLACEHOLDER: set to true when the Quick Look scanner is live (see api/_lib/scanner.js).
    // While false, the Quick Look is described as a free request that the team prepares.
    scannerEnabled: false,

    // Shown at the very top of every page of the preview build. Set PREVIEW_BANNER=0 at build time to hide it.
    previewBanner: 'Preview build. The Quick Look scanner is not connected yet.'
};

// First screen. The line saying who we serve and where comes from the audience (content/audiences.js).
export const HERO = {
    label: 'DATA-LED MARKET INTELLIGENCE',
    headlineLine1: 'Stop Guessing.',
    headlineLine2: 'Start Growing',
    headlineAccent: 'with Data.',
    subheadline: 'Look. Fix. Count.',
    placeholder: 'Your website or company name',
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
        timeline: '7 days',
        scope: 'Fixed scope',
        includes: [
            '3 critical fixes, chosen from your Quick Look',
            'Search visibility, trust signals and conversion',
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
        timeline: '90 days',
        scope: 'Roadmap and recount',
        includes: [
            '90-day growth roadmap',
            'Competitor benchmarks',
            'Baseline recount on day 35',
            'Scalable channel execution'
        ]
    },
    {
        step: 'Step 4',
        package: 'retainer',
        name: 'Market Intelligence Retainer',
        when: 'Monthly',
        promise: 'Weekly market updates',
        description: 'Weekly market updates, competitor tracking, and AI search monitoring delivered straight to your operations.',
        timeline: 'Monthly',
        scope: 'Standalone subscription',
        includes: [
            'Weekly Impact Brief on shifts in algorithms, AI tools and the economy',
            'Opportunity Alerts by Telegram',
            'Bi-weekly scans of your top 5 competitors',
            'AI visibility monitoring',
            'Market Intelligence Dashboard'
        ]
    }
];

export const NAV = [
    { label: 'About Us', href: '/team' },
    { label: 'Resources', href: '/resources' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
];

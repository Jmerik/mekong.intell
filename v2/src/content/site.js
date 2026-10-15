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

export const HERO = {
    label: 'DATA-LED DIGITAL OPTIMIZATION ENGINE',
    headlineLine1: 'Stop Guessing.',
    headlineLine2: 'Start Growing',
    headlineAccent: 'with Data.',
    subheadline: 'Look. Fix. Count. Your complete digital optimization engine.',
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

export const RHYTHM = [
    { label: 'Look', text: 'Diagnostics and competitor benchmarks, based on public information.' },
    { label: 'Fix', text: '3 critical fixes live in 7 days.' },
    { label: 'Count', text: 'Baseline recount on day 35.' },
    { label: 'Blueprint', text: '90-day growth roadmap.' },
    { label: 'Retainer', text: 'Weekly market updates and competitor alerts.' }
];

// The four-step service ladder. `package` is the key in shared/packages.js.
export const SERVICES = [
    {
        step: 'Step 1',
        package: 'quicklook',
        badge: 'Free Diagnostic',
        title: 'The Free Quick Look',
        description: 'A free first read of your digital footprint: where you are Found, Trusted and Reached, and where to focus first.',
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
        badge: 'Rapid Execution',
        title: '3 Fixes Live in 7 Days',
        description: 'Direct deployment of critical search visibility, trust signals, and conversion fixes.',
        button: 'Start Sprint',
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
        badge: 'Strategic Growth',
        title: 'Full Optimization Engine',
        description: 'Complete data-led roadmap, baseline recount on day 35, and scalable channel execution.',
        button: 'Discuss the Blueprint',
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
        badge: 'Continuous Edge',
        title: 'Market Intelligence Retainer',
        description: 'Weekly market updates, competitor tracking, and AI search monitoring delivered straight to your operations.',
        button: 'Request the Retainer',
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
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
];

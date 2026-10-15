// Page registry. The build script writes one HTML file per entry, and pages/index.jsx maps
// each id to its component.

export const PAGES = [
    {
        id: 'home',
        path: '/',
        file: 'index.html',
        title: 'Mekong Intelligence | Stop Guessing. Start Growing with Data.',
        description: "Southeast Asia's brand and market intelligence firm. Get a free Quick Look at whether your business is Found, Trusted and Reached.",
        jsonLd: 'organization'
    },
    {
        id: 'local',
        path: '/local',
        file: 'local.html',
        title: 'Mekong Intelligence for local businesses | Free Quick Look',
        description: 'For businesses that sell in Cambodia and across the Mekong region. Find out if you are Found, Trusted and Reached with a free Quick Look.'
    },
    {
        id: 'international',
        path: '/international',
        file: 'international.html',
        title: 'Mekong Intelligence for international companies | Free Quick Look',
        description: 'For companies selling across borders, into the Mekong region or out of it. Find out if you are Found, Trusted and Reached with a free Quick Look.'
    },
    {
        id: 'resources',
        path: '/resources',
        file: 'resources.html',
        title: 'Resources | Practical Guides. No Fluff. | Mekong Intelligence',
        description: 'Practical guides on AI search visibility, digital footprint auditing and lead response. Checklists you can use today.'
    },
    {
        id: 'pricing',
        path: '/pricing',
        file: 'pricing.html',
        title: 'Pricing | Mekong Intelligence',
        description: 'Four steps from a free Quick Look to a monthly Market Intelligence Retainer. See what each step includes.'
    },
    {
        id: 'team',
        path: '/team',
        file: 'team.html',
        title: 'About Us | Mekong Intelligence',
        description: 'Data analysis, AI-driven workflows and market intelligence from Phnom Penh. Meet the founder of Mekong Intelligence.',
        jsonLd: 'person'
    },
    {
        id: 'contact',
        path: '/contact',
        file: 'contact.html',
        title: 'Contact | Mekong Intelligence',
        description: 'Send us a message or reach us directly on Telegram. Based in Phnom Penh, Cambodia.'
    },
    {
        id: 'privacy',
        path: '/privacy',
        file: 'privacy.html',
        title: 'Privacy Policy | Mekong Intelligence',
        description: 'How Mekong Intelligence collects and uses the information you share with us.'
    },
    {
        id: 'notfound',
        path: '/404',
        file: '404.html',
        title: 'Page not found | Mekong Intelligence',
        description: 'This page does not exist.',
        alwaysNoindex: true,
        excludeFromSitemap: true
    }
];

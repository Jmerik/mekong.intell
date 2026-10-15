// Practical guides for /resources. Each card is one checkable action.
// Rules: no statistics we cannot source, no promises of results, plain short sentences.

export const RESOURCE_GROUPS = [
    {
        id: 'ai-search',
        label: 'GEO / AEO',
        title: 'AI Search Optimization',
        intro: 'How search engines and AI assistants evaluate your brand.',
        cards: [
            {
                title: 'Ask the question your buyer would ask',
                text: 'Type it into Google, ChatGPT and Claude. Note which brands are named, which sources are cited, and the date. Repeat monthly to see movement.'
            },
            {
                title: 'Make your facts easy to quote',
                text: 'State what you do, where, and for whom in plain sentences on your own site. Search engines and AI tools quote clear, specific text, not slogans.'
            },
            {
                title: 'Keep your details identical everywhere',
                text: 'Business name, address, phone, hours and service descriptions should match across your website, Google Business Profile and social profiles.'
            },
            {
                title: 'Publish text, not images of text',
                text: 'Menus, price lists and service descriptions locked inside images cannot be read by search engines or AI tools. Put them on the page as text.'
            },
            {
                title: 'Add structured data',
                text: 'Schema.org markup tells search engines what a page is about: a business, a service, a person. Test it with a validator after you add it.'
            },
            {
                title: 'Find where competitors are cited and you are not',
                text: 'Directories, industry bodies, press and partner sites can feed AI answers. List the ones that mention your competitors and start with those.'
            }
        ]
    },
    {
        id: 'footprint',
        label: 'Found, Trusted, Reached',
        title: 'Digital Footprint Auditing',
        intro: 'A step-by-step way to check whether you are Found, Trusted and Reached.',
        cards: [
            {
                step: 'Step 1',
                title: 'Check if you are Found',
                text: 'Search your business name, your category plus city, and your top three services. Is your own site on page one? Do you appear on the map?'
            },
            {
                step: 'Step 2',
                title: 'Check if you are Trusted',
                text: 'Open your Google, Facebook and LinkedIn profiles as a stranger would. Are hours, address, photos and recent posts complete and current? Count the reviews and note the date of the latest.'
            },
            {
                step: 'Step 3',
                title: 'Check if you are Reached',
                text: 'Try to contact yourself from a phone. How many taps from search result to message? How long until a reply?'
            },
            {
                step: 'Step 4',
                title: 'Write down the evidence',
                text: 'Record each finding with the page and the date. If you cannot verify something, mark it N/A. Never guess.'
            },
            {
                step: 'Step 5',
                title: 'Rank the gaps and recount',
                text: 'Pick the three fixes that remove the most friction for the least effort. Do those first, then recount after four to five weeks.'
            }
        ]
    },
    {
        id: 'conversion',
        label: 'Response and follow-up',
        title: 'Conversion Infrastructure',
        intro: 'Fixing response times and lead loss in local markets.',
        cards: [
            {
                title: 'Put chat one tap away',
                text: 'Add Telegram, Messenger or WhatsApp buttons wherever customers already look: your website, Google profile and social bios.'
            },
            {
                title: 'Send an automatic first reply',
                text: 'A short automatic message that confirms you received the enquiry, and when a person will reply, keeps the lead warm.'
            },
            {
                title: 'Log every enquiry',
                text: 'A simple shared sheet with date, source, message and outcome shows where leads go cold. Without a log, lost leads are invisible.'
            },
            {
                title: 'Measure first response time',
                text: 'Track the minutes between a message arriving and your first reply. Set a target and check it every week.'
            },
            {
                title: 'Follow up once',
                text: 'Many enquiries stall after the first reply. One polite follow-up a day or two later recovers some of them.'
            }
        ]
    }
];

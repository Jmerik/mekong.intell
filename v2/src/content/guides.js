// Practical guides, one page each at /resources/<slug>.
// Rules: no statistics we cannot source, no promises of results, plain short sentences, one action per step.
// "Published" and "updated" use ISO dates (they feed the Article structured data).

export const GUIDE_AUTHOR = 'Mekong Intelligence';

export const GUIDES = [
    {
        slug: 'ai-search-visibility',
        label: 'GEO / AEO',
        title: 'AI search visibility: how to check whether assistants mention your business',
        short: 'AI Search Optimization',
        description: 'A practical guide to checking whether ChatGPT, Claude and Google show your business when buyers ask, and what you can change.',
        summary: 'How search engines and AI assistants evaluate your brand, and how to check it yourself in 30 minutes.',
        published: '2026-10-15',
        updated: '2026-10-15',
        intro: 'More buyers now ask an AI assistant instead of scrolling a list of links. The answer usually names only a few businesses. This guide shows you how to see whether yours is one of them, and what you can change.',
        sections: [
            {
                heading: 'Step 1: Ask the question your buyer would ask',
                paragraphs: [
                    'Write down three questions a real buyer would type. For example: "best accounting firm in Phnom Penh" or "reliable packaging supplier in Vietnam". Use plain words, not your company jargon.',
                    'Ask each question in Google, ChatGPT and Claude. Use a private window and do not log in, so the answers are not shaped by your own history.'
                ],
                checklist: [
                    'Write down each brand that is named.',
                    'Write down each source the assistant links or cites.',
                    'Write down the date. Answers change, so a date is part of the evidence.'
                ]
            },
            {
                heading: 'Step 2: Record what you find',
                paragraphs: [
                    'Keep a simple table: question, tool, date, brands named, sources cited, and whether you were mentioned. If you were not mentioned, write "not mentioned". If a tool would not answer, write N/A. Do not guess.',
                    'One result is a data point, not a ranking. Answers vary by wording, place and day, so repeat the same questions monthly and compare.'
                ]
            },
            {
                heading: 'Step 3: Make your facts easy to quote',
                paragraphs: [
                    'Search engines and AI assistants can only repeat what they can read and find in more than one place. These are the changes that usually matter most.'
                ],
                checklist: [
                    'State what you do, where, and for whom in plain sentences on your own site. Clear, specific text is easier to quote than slogans.',
                    'Keep your business name, address, phone, hours and service descriptions identical across your website, Google Business Profile and social profiles.',
                    'Publish text, not images of text. Menus, price lists and service descriptions locked inside images cannot be read by search engines or AI tools.',
                    'Add Schema.org structured data, so a page says plainly that it describes a business, a service or a person. Test it with a validator after you add it.',
                    'Find the directories, industry bodies, press and partner sites that mention your competitors but not you. These sources can feed AI answers.'
                ]
            },
            {
                heading: 'Step 4: Recount',
                paragraphs: [
                    'After four to five weeks, ask the same questions again and compare with your first table. If nothing changed, change one thing at a time so you can see what helped.'
                ]
            }
        ],
        related: ['digital-footprint-check', 'response-and-follow-up']
    },

    {
        slug: 'digital-footprint-check',
        label: 'Found, Trusted, Reached',
        title: 'How to check if your business is Found, Trusted and Reached',
        short: 'Digital Footprint Auditing',
        description: 'A five-step way to check your own digital footprint with public information only, and to write down the evidence.',
        summary: 'A step-by-step framework to check whether buyers can find you, trust you and reach you.',
        published: '2026-10-15',
        updated: '2026-10-15',
        intro: 'You can check your own digital footprint in about an hour, using only what any stranger can see. This is the same frame we use for the Quick Look: is the business Found, Trusted and Reached?',
        sections: [
            {
                heading: 'Step 1: Check if you are Found',
                paragraphs: [
                    'Search your business name, your category plus your city, and your top three services. Look past the first result.'
                ],
                checklist: [
                    'Is your own website on the first page for your business name?',
                    'Do you appear on the map for your category and city?',
                    'Does an AI assistant mention you when you ask a buyer\'s question? (See our guide on AI search visibility.)'
                ]
            },
            {
                heading: 'Step 2: Check if you are Trusted',
                paragraphs: [
                    'Open your Google, Facebook and LinkedIn profiles as a stranger would, from a browser where you are not logged in.'
                ],
                checklist: [
                    'Are hours, address, phone and photos complete and current?',
                    'When was the latest post?',
                    'How many reviews are there, and what is the date of the latest?',
                    'Do the name and details match across every profile and your website?'
                ]
            },
            {
                heading: 'Step 3: Check if you are Reached',
                paragraphs: [
                    'Try to contact your own business from a phone, as a new customer would.'
                ],
                checklist: [
                    'How many taps from a search result to a message?',
                    'Is there a chat, call or email option on every page that matters?',
                    'How long until a reply? (See our guide on response times.)'
                ]
            },
            {
                heading: 'Step 4: Write down the evidence',
                paragraphs: [
                    'For each finding, write down what you saw, the page or source, and the date. If you cannot verify something, mark it N/A. Never estimate. A finding without a source is an opinion.'
                ]
            },
            {
                heading: 'Step 5: Rank the gaps and recount',
                paragraphs: [
                    'Give each of Found, Trusted and Reached one of three words. Strong: complete and verified. Developing: present, but incomplete or only partly verified. Priority focus: missing, broken or out of date, so fix it first.',
                    'Pick the three fixes that remove the most friction for the least effort and do those first. Then recount after four to five weeks and compare.'
                ]
            }
        ],
        related: ['ai-search-visibility', 'response-and-follow-up']
    },

    {
        slug: 'response-and-follow-up',
        label: 'Response and follow-up',
        title: 'Response times and follow-up: stop losing enquiries',
        short: 'Conversion Infrastructure',
        description: 'Practical ways to answer faster and follow up better in local markets: chat buttons, automatic first replies, an enquiry log and one polite follow-up.',
        summary: 'Fixing response times and lead loss in local markets.',
        published: '2026-10-15',
        updated: '2026-10-15',
        intro: 'Many enquiries are lost after the customer has already decided to ask. The message arrives, nobody sees it for hours, and the customer asks someone else. These five changes cost little and are easy to measure.',
        sections: [
            {
                heading: '1. Put chat one tap away',
                paragraphs: [
                    'Add Telegram, Messenger or WhatsApp buttons wherever customers already look: your website, your Google profile and your social bios. Use the channel your customers actually use.'
                ]
            },
            {
                heading: '2. Send an automatic first reply',
                paragraphs: [
                    'A short automatic message that confirms you received the enquiry, and says when a person will reply, keeps the lead warm. Keep it honest: only promise a time you will meet.',
                    'Example: "Thank you for your message. We received it and will reply within [your real time]. If it is urgent, call [number]."'
                ]
            },
            {
                heading: '3. Log every enquiry',
                paragraphs: [
                    'A simple shared sheet shows where leads go cold. Without a log, lost leads are invisible.'
                ],
                checklist: [
                    'Date and time received',
                    'Channel (Telegram, Messenger, phone, email, website form)',
                    'What the customer asked for',
                    'Time of first reply',
                    'Outcome (won, lost, waiting) and the reason, if you know it'
                ]
            },
            {
                heading: '4. Measure first response time',
                paragraphs: [
                    'Track the minutes between a message arriving and your first reply. Set a target you can meet, and check it every week. The first week usually shows the biggest gaps: evenings, weekends and lunch.'
                ]
            },
            {
                heading: '5. Follow up once',
                paragraphs: [
                    'Many enquiries stall after the first reply. One polite follow-up a day or two later recovers some of them. Keep it short and make it easy to answer with a yes or no.'
                ]
            }
        ],
        related: ['digital-footprint-check', 'ai-search-visibility']
    }
];

export const guideBySlug = (slug) => GUIDES.find((g) => g.slug === slug);

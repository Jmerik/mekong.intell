// The sample Quick Look: a real snapshot of Mekong Intelligence's own business, checked on the date below.
//
// Rules for every entry (brand voice and the evidence rule):
//   - A finding is only written if it was actually checked. It names where it came from and the date.
//   - Anything not checked or not verifiable is marked N/A. Never estimate or infer.
//   - Ratings are Strong, Developing or Priority focus, or N/A when an area was not assessed.
//   - Public information only.
//
// To refresh the sample: re-run the checks, update `date`, `isoDate`, the findings and the ratings together.
// To swap in a client: replace this file with their (permitted) snapshot and keep the same shape.
// DRAFT: review every line before this goes public, in particular the founder-profile finding.

export const SAMPLE = {
    business: 'Mekong Intelligence',
    site: 'mekongintel.live',
    date: '15 October 2026',
    isoDate: '2026-10-15',
    headline: 'We ran a Quick Look on ourselves.',
    summary: 'The first result is an honest one: three searches did not return us. That is exactly the kind of finding a Quick Look is for, and it tells us where to start.',
    method: 'Web searches run on 15 October 2026 with a US-based search tool. Results differ by place, tool and day, so each search is a data point, not a ranking.',

    areas: [
        {
            id: 'found',
            name: 'Found',
            kind: 'AI & search visibility',
            rating: 'Priority focus',
            basis: 'None of the three searches returned the business.',
            findings: [
                {
                    text: 'A search for "mekongintel.live Mekong Intelligence" returned no page from mekongintel.live. The results were unrelated pages about other Mekong topics.',
                    source: 'Web search, query as quoted',
                    date: '15 Oct 2026'
                },
                {
                    text: 'A search for "Mekong Intelligence" with "brand market intelligence Phnom Penh Cambodia Vietnam" returned no organisation with that name. It listed several similarly named firms instead.',
                    source: 'Web search, query as quoted',
                    date: '15 Oct 2026'
                }
            ],
            notAssessed: [
                'Answers from AI assistants (ChatGPT, Claude, Google AI): not checked in this sample.',
                'Google Business Profile and map listing: not checked in this sample.'
            ]
        },
        {
            id: 'trusted',
            name: 'Trusted',
            kind: 'Proof & digital storefront',
            rating: 'Developing',
            basis: 'A public founder profile exists. No company profile was found.',
            findings: [
                {
                    text: 'A search restricted to LinkedIn, Facebook and Telegram for "Mekong Intelligence company page" returned other organisations. It did not return a page for Mekong Intelligence.',
                    source: 'Web search, restricted to linkedin.com, facebook.com and t.me',
                    date: '15 Oct 2026'
                },
                {
                    text: 'A public LinkedIn profile for the founder is returned when searching the founder\'s name. The search result does not mention Mekong Intelligence. Search results can be out of date.',
                    source: 'Web search, restricted to linkedin.com',
                    date: '15 Oct 2026'
                }
            ],
            notAssessed: [
                'Customer reviews and testimonials: not checked in this sample.'
            ]
        },
        {
            id: 'reached',
            name: 'Reached',
            kind: 'Messaging & conversion',
            rating: 'N/A',
            basis: 'Not assessed in this snapshot.',
            findings: [],
            notAssessed: [
                'Contact routes on the website: not checked in this sample.',
                'Time to first reply: not measured in this sample.'
            ]
        }
    ],

    fixes: [
        {
            name: 'Create a LinkedIn company page for Mekong Intelligence',
            detail: 'Link it from the website and from the founder profile, so a search for the name has somewhere to land.',
            effort: 'About 1 hour'
        },
        {
            name: 'Add Mekong Intelligence and the website address to the founder profile',
            detail: 'The public profile is the page a buyer is most likely to open first.',
            effort: 'About 15 minutes'
        },
        {
            name: 'Register the website with Google Search Console and submit the sitemap',
            detail: 'Then repeat the same three searches after four to five weeks and compare. That is the recount.',
            effort: 'About 30 minutes'
        }
    ]
};

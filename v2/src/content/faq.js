// Questions shown on the landing pages. The same text feeds the FAQPage structured data (scripts/build.mjs),
// so what search engines and AI assistants quote is exactly what visitors read. Keep answers short, plain
// and true. Plain text only (no HTML) because it is also used as structured data.

import { QUICK_LOOK } from './site.js';

export const FAQ = [
    {
        question: 'What is the Free Quick Look?',
        answer: `A free first read on whether your business is Found, Trusted and Reached. You give us a website or company name and an email address. We send you a short, sourced summary ${QUICK_LOOK.delivery}.`
    },
    {
        question: 'What do Found, Trusted and Reached mean?',
        answer: 'Found: do Google, maps and AI assistants show you when buyers ask? Trusted: do your profiles, reviews and details look active and reliable? Reached: can an interested buyer message you in one step and get a quick reply?'
    },
    {
        question: 'Do you need access to my accounts or website?',
        answer: 'No. The Quick Look uses public information only. We look at what anyone can see. Every finding names its source and date, and anything we cannot verify is marked N/A.'
    },
    {
        question: 'Is it really free?',
        answer: 'Yes. The Quick Look is free and needs no credit card. If you want to go further, the next steps are the 7-Day Sprint, the 90-Day Blueprint and the Market Intelligence Retainer. We talk through scope and price after your Quick Look.'
    },
    {
        question: 'What happens after the Quick Look?',
        answer: 'You decide. The 7-Day Sprint puts 3 critical fixes live in 7 days. The 90-Day Blueprint adds a growth roadmap and a recount of the numbers on day 35. The Market Intelligence Retainer gives you weekly market updates and competitor tracking.'
    },
    {
        question: 'Who will I work with?',
        answer: 'You work directly with the founder, Vosumtey Seng, not with a junior account manager.'
    }
];

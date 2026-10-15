import { FAQ } from '../content/faq.js';
import { SectionHeader, Container } from './ui.jsx';

// Plain <details> elements: no JavaScript needed, keyboard accessible, and the text is in the page for
// search engines and AI assistants. The same content is published as FAQPage structured data on the main page.
export default function Faq() {
    return (
        <section id="faq" className="py-14 md:py-20 bg-mi-dark2 border-t border-mi-dark1">
            <Container className="max-w-3xl">
                <SectionHeader label="Questions" title="Good to know" />
                <div className="space-y-3">
                    {FAQ.map((item) => (
                        <details key={item.question} className="group bg-mi-dark1 border border-mi-blue/20 rounded-2xl px-5 py-4 open:border-mi-cyan/50">
                            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mi-cyan rounded">
                                {item.question}
                                <span className="text-mi-cyan text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                            </summary>
                            <p className="mt-3 text-mi-light/85 leading-relaxed">{item.answer}</p>
                        </details>
                    ))}
                </div>
            </Container>
        </section>
    );
}

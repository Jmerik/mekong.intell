import { Container, Icons } from './ui.jsx';

// How we work, in three lines. These are commitments about the process, not claims about results,
// so each one can be checked. (Client proof goes here once there are permitted, sourced examples.)
const ITEMS = [
    'Public information only',
    'Every finding has a source and a date',
    'You work directly with the founder'
];

export default function TrustStrip() {
    return (
        <section aria-label="How we work" className="bg-mi-dark2 border-y border-mi-dark1">
            <Container>
                <ul className="py-5 flex flex-col md:flex-row md:justify-center gap-x-10 gap-y-2 text-sm font-semibold text-mi-light/90">
                    {ITEMS.map((item) => (
                        <li key={item} className="flex items-center gap-2"><Icons.Check size={16} className="text-mi-cyan shrink-0" />{item}</li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

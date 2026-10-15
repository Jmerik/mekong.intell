import { SectionHeader, Container } from './ui.jsx';
import { FoundMock, TrustedMock, ReachedMock } from './mocks.jsx';

// Three cards under the hero: Found, Trusted, Reached. Text on the left, example screen on the right.
function PillarCard({ id, eyebrow, kind, headline, body, children }) {
    return (
        <article id={id} className="grid md:grid-cols-2 gap-6 md:gap-12 items-center bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-5 md:p-10 shadow-xl">
            <div>
                <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">
                    {eyebrow} <span className="text-mi-light/70 normal-case tracking-normal font-medium">&middot; {kind}</span>
                </p>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">{headline}</h3>
                <p className="text-mi-light/85 text-base md:text-lg leading-relaxed">{body}</p>
            </div>
            {/* The example screens are illustrations. On phones the real sample above carries the proof, so they are hidden. */}
            <div className="hidden md:block">{children}</div>
        </article>
    );
}

export default function Pillars({ audience }) {
    return (
        <section id="quick-look" className="py-14 md:py-20 bg-mi-dark1 border-t border-mi-dark2">
            <Container>
                <SectionHeader
                    label="What the Quick Look checks"
                    title="Found. Trusted. Reached."
                    subtitle="Three checks that decide whether a buyer ever contacts you."
                />
                <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
                    <PillarCard id="found" eyebrow="Found" kind="AI & Search Visibility" headline="Get Found in the AI Era."
                        body={audience.found.body}>
                        <FoundMock data={audience.found} />
                    </PillarCard>

                    <PillarCard id="trusted" eyebrow="Trusted" kind="Proof & Digital Storefront" headline="Look Real. Build Instant Trust."
                        body={audience.trusted.body}>
                        <TrustedMock data={audience.trusted} />
                    </PillarCard>

                    <PillarCard id="reached" eyebrow="Reached" kind="Messaging & Conversion" headline="Turn Visits into Messages."
                        body={audience.reached.body}>
                        <ReachedMock data={audience.reached} />
                    </PillarCard>
                </div>
                <p className="mt-6 hidden md:block text-center text-xs text-mi-light/70">Screens marked Example are illustrations, not client data.</p>
            </Container>
        </section>
    );
}

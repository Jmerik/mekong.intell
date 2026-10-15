import { SectionHeader, Button, Container } from './ui.jsx';
import { useModal } from './Layout.jsx';
import { FoundMock, TrustedMock, ReachedMock } from './mocks.jsx';

// Three cards under the hero: Found, Trusted, Reached. Text on the left, example screen on the right.
function PillarCard({ id, eyebrow, kind, headline, body, cta, onCta, children }) {
    return (
        <article id={id} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6 md:p-10 shadow-xl">
            <div>
                <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">
                    {eyebrow} <span className="text-mi-light/70 normal-case tracking-normal font-medium">&middot; {kind}</span>
                </p>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">{headline}</h3>
                <p className="text-mi-light/85 text-lg leading-relaxed mb-8">{body}</p>
                <Button variant="outline" onClick={onCta}>{cta}</Button>
            </div>
            <div>{children}</div>
        </article>
    );
}

export default function Pillars({ audience }) {
    const { openModal } = useModal();
    const ask = (focus) => () => openModal({ packageType: 'quicklook', focus });

    return (
        <section id="quick-look" className="py-20 bg-mi-dark1 border-t border-mi-dark2">
            <Container>
                <SectionHeader
                    label="What the Quick Look checks"
                    title="Found. Trusted. Reached."
                    subtitle="Three checks that decide whether a buyer ever contacts you."
                />
                <div className="space-y-8 max-w-6xl mx-auto">
                    <PillarCard id="found" eyebrow="Found" kind="AI & Search Visibility" headline="Get Found in the AI Era."
                        body={audience.found.body} cta="Test AI Visibility" onCta={ask('found')}>
                        <FoundMock data={audience.found} />
                    </PillarCard>

                    <PillarCard id="trusted" eyebrow="Trusted" kind="Proof & Digital Storefront" headline="Look Real. Build Instant Trust."
                        body={audience.trusted.body} cta="Check Digital Health" onCta={ask('trusted')}>
                        <TrustedMock data={audience.trusted} />
                    </PillarCard>

                    <PillarCard id="reached" eyebrow="Reached" kind="Messaging & Conversion" headline="Turn Visits into Messages."
                        body={audience.reached.body} cta="Fix Chat Funnel" onCta={ask('reached')}>
                        <ReachedMock data={audience.reached} />
                    </PillarCard>
                </div>
                <p className="mt-6 text-center text-xs text-mi-light/70">Screens marked Example are illustrations, not client data.</p>
            </Container>
        </section>
    );
}

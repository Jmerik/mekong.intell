import Layout, { useModal } from '../components/Layout.jsx';
import { Container, SectionHeader, Button } from '../components/ui.jsx';
import { RESOURCE_GROUPS } from '../content/resources.js';

function QuickLookCta() {
    const { openModal } = useModal();
    return (
        <div className="max-w-3xl mx-auto text-center bg-mi-dark2 border border-mi-cyan/40 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Want this checked for your business?</h2>
            <p className="text-mi-light/85 mb-6">The Free Quick Look runs these checks for you, based on public information only.</p>
            <Button onClick={() => openModal({ packageType: 'quicklook' })} className="mx-auto">Get Free Quick Look</Button>
        </div>
    );
}

export default function Resources() {
    return (
        <Layout current="/resources">
            <header className="bg-mi-dark1 pt-16 pb-12 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Resources</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Practical Guides. No Fluff.</h1>
                    <p className="text-xl text-mi-light/85">Educational content, AI search visibility guides and practical diagnostic frameworks. Each card is one action you can check today.</p>
                </Container>
            </header>

            {RESOURCE_GROUPS.map((group, index) => (
                <section key={group.id} id={group.id} className={`py-16 border-t border-mi-dark2 ${index % 2 === 0 ? 'bg-mi-dark2' : 'bg-mi-dark1'}`}>
                    <Container className="max-w-6xl">
                        <SectionHeader as="h2" centered={false} label={group.label} title={group.title} subtitle={group.intro} />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.cards.map((card) => (
                                <article key={card.title} className="bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-6">
                                    {card.step && <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest mb-2">{card.step}</p>}
                                    <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                                    <p className="text-mi-light/85 text-sm leading-relaxed">{card.text}</p>
                                </article>
                            ))}
                        </div>
                    </Container>
                </section>
            ))}

            <section className="py-20 bg-mi-dark1 border-t border-mi-dark2">
                <Container><QuickLookCta /></Container>
            </section>
        </Layout>
    );
}

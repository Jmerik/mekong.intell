import Layout, { useModal } from '../components/Layout.jsx';
import { Container, Button, Icons } from '../components/ui.jsx';
import { GUIDES } from '../content/guides.js';
import { QUICK_LOOK } from '../content/site.js';

// Index of the guides. Each guide has its own page (src/pages/GuidePage.jsx).
export default function Resources() {
    const { openModal } = useModal();
    return (
        <Layout current="/resources">
            <header className="bg-mi-dark1 pt-16 pb-10 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Resources</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Practical Guides. No Fluff.</h1>
                    <p className="text-xl text-mi-light/85">Educational content, AI search visibility guides and practical diagnostic frameworks. Each step is one action you can check today.</p>
                </Container>
            </header>

            <section className="pb-16 bg-mi-dark1">
                <Container className="max-w-6xl">
                    <ul className="grid md:grid-cols-3 gap-6">
                        {GUIDES.map((guide) => (
                            <li key={guide.slug} className="flex">
                                <a href={`/resources/${guide.slug}`} className="flex flex-col w-full bg-mi-dark2 border border-mi-blue/20 hover:border-mi-cyan rounded-3xl p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mi-cyan">
                                    <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest mb-2">{guide.label}</p>
                                    <h2 className="text-xl font-bold text-white mb-2">{guide.short}</h2>
                                    <p className="text-mi-light/85 text-sm mb-4">{guide.summary}</p>
                                    <ul className="space-y-1 mb-6 text-sm text-mi-light/80">
                                        {guide.sections.map((s) => (
                                            <li key={s.heading} className="flex items-start gap-2"><Icons.Check size={14} className="text-mi-cyan shrink-0 mt-1" />{s.heading.replace(/^(Step )?\d+[.:]\s*/, '')}</li>
                                        ))}
                                    </ul>
                                    <span className="mt-auto inline-flex items-center gap-2 font-bold text-mi-cyan">Read the guide <Icons.ArrowRight size={16} /></span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <a href="/sample-quick-look" className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-mi-dark2 border border-mi-cyan/40 hover:border-mi-cyan rounded-3xl p-6 transition-colors">
                        <span>
                            <span className="block text-xs font-bold text-mi-cyan uppercase tracking-widest mb-1">A real example</span>
                            <span className="block text-xl font-bold text-white">Sample Quick Look: we checked our own business</span>
                            <span className="block text-sm text-mi-light/80 mt-1">Ratings, findings with sources and dates, and the fixes we would start with.</span>
                        </span>
                        <span className="inline-flex items-center gap-2 font-bold text-mi-cyan shrink-0">Read the sample <Icons.ArrowRight size={16} /></span>
                    </a>

                    <div className="mt-12 text-center">
                        <p className="text-mi-light/85 mb-4">Want these checks run for your business?</p>
                        <Button onClick={() => openModal({ packageType: 'quicklook' })} className="mx-auto">{QUICK_LOOK.cta}</Button>
                    </div>
                </Container>
            </section>
        </Layout>
    );
}

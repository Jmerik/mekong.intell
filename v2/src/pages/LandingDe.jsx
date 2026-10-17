import Layout, { useModal } from '../components/Layout.jsx';
import { QuickLookPill, Facts } from '../components/Hero.jsx';
import { SectionHeader, Container, Button, Icons } from '../components/ui.jsx';
import { FoundMock, TrustedMock, ReachedMock } from '../components/mocks.jsx';
import { AUDIENCES } from '../content/audiences.js';
import { DE } from '../content/de.js';

// German landing page (/de). Same structure as the English landing pages, with its own German wording
// (content/de.js). The three checks are laid out as cards instead of tabs, so all of them are visible at once.
const MOCKS = { found: FoundMock, trusted: TrustedMock, reached: ReachedMock };
// The example screens use the international data (LinkedIn, website, email contact); labels come from the page language.
const EXAMPLE = AUDIENCES.international;

function HeroDe() {
    const h = DE.hero;
    return (
        <header className="relative overflow-hidden bg-mi-dark1 pt-12 pb-12 md:pt-20 md:pb-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mi-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mi-cyan/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true"></div>
            <Container className="relative z-10 text-center max-w-5xl">
                <p className="block w-fit mx-auto px-4 py-1 bg-mi-dark2 border border-mi-blue/30 rounded-full text-mi-cyan text-xs sm:text-sm font-semibold tracking-wide mb-6 animate-fade-in-up">{DE.tagline}</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
                    {h.headline.map((line, i) => (
                        <span key={line} className={`block ${i === h.accentLine ? 'bg-clip-text text-transparent bg-gradient-to-r from-mi-cyan via-mi-blue to-mi-light' : ''}`}>{line}</span>
                    ))}
                </h1>
                <p className="text-xl md:text-2xl font-semibold text-white mb-3">{h.subheadline}</p>
                <p className="text-lg text-mi-light/85 mb-10 max-w-2xl mx-auto">{h.line}</p>
                <QuickLookPill />
                <Facts facts={DE.facts} />
            </Container>
        </header>
    );
}

function TrustStripDe() {
    return (
        <section aria-label="So arbeiten wir" className="bg-mi-dark2 border-y border-mi-dark1">
            <Container>
                <ul className="py-5 flex flex-col md:flex-row md:justify-center gap-x-10 gap-y-2 text-sm font-semibold text-mi-light/90">
                    {DE.trust.map((item) => (
                        <li key={item} className="flex items-center gap-2"><Icons.Check size={16} className="text-mi-cyan shrink-0" />{item}</li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

function Checks() {
    const { openModal } = useModal();
    const c = DE.checks;
    return (
        <section id="quick-look" className="py-14 md:py-20 bg-mi-dark1">
            <Container>
                <SectionHeader label={c.label} title={c.title} subtitle={c.subtitle} />
                <div className="max-w-6xl mx-auto space-y-6">
                    {c.items.map((item) => {
                        const Mock = MOCKS[item.id];
                        return (
                            <article key={item.id} id={item.id} className="grid md:grid-cols-2 gap-6 md:gap-12 items-center bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-5 md:p-10 shadow-xl">
                                <div>
                                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">
                                        {item.name} <span className="text-mi-light/70 normal-case tracking-normal font-medium">&middot; {item.kind}</span>
                                    </p>
                                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">{item.headline}</h3>
                                    <p className="text-mi-light/85 text-base md:text-lg leading-relaxed mb-6">{item.body}</p>
                                    <Button variant="outline" onClick={() => openModal({ packageType: 'quicklook', focus: item.id })}>{item.cta}</Button>
                                </div>
                                <div className="hidden md:block"><Mock data={EXAMPLE[item.id]} /></div>
                            </article>
                        );
                    })}
                    <p className="text-center text-xs text-mi-light/70">Die als Beispiel gekennzeichneten Ansichten sind Illustrationen, keine Kundendaten.</p>
                </div>
            </Container>
        </section>
    );
}

function Who() {
    const w = DE.who;
    return (
        <section className="py-14 md:py-20 bg-mi-dark2 border-t border-mi-dark1">
            <Container>
                <SectionHeader label={w.label} title={w.title} />
                <ul className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {w.items.map((item) => (
                        <li key={item.title} className="bg-mi-dark1 border border-mi-blue/20 rounded-3xl p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-mi-light/85">{item.body}</p>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

function ServicesDe() {
    const { openModal, startQuickLook } = useModal();
    const s = DE.services;
    const action = (pkg) => (pkg === 'quicklook' ? startQuickLook : () => openModal({ packageType: pkg }));
    return (
        <section id="leistungen" className="py-14 md:py-20 bg-mi-dark1 border-t border-mi-dark2">
            <Container>
                <SectionHeader label={s.label} title={s.title} subtitle={s.subtitle} />
                <ol className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {s.steps.map((step) => (
                        <li key={step.package} className="flex">
                            <article className="flex flex-col w-full bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-mi-cyan uppercase tracking-widest">{step.step} &middot; {step.when}</span>
                                    {step.badge && <span className="text-[11px] font-bold uppercase tracking-wider border border-mi-cyan/50 text-mi-cyan rounded px-2 py-0.5">{step.badge}</span>}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{step.name}</h3>
                                <p className="text-mi-cyan font-semibold mb-3">{step.promise}</p>
                                <p className="text-mi-light/85 mb-4">{step.description}</p>
                                <ul className="space-y-1 mb-6 text-sm text-mi-light/85">
                                    {step.includes.map((line) => <li key={line} className="flex items-start gap-2"><Icons.Check size={14} className="text-mi-cyan shrink-0 mt-1" />{line}</li>)}
                                </ul>
                                <Button variant={step.package === 'quicklook' ? 'primary' : 'outline'} onClick={action(step.package)} className="mt-auto">{step.cta}</Button>
                            </article>
                        </li>
                    ))}
                </ol>

                <article id="market-entry" className="max-w-6xl mx-auto mt-6 bg-mi-dark2 border border-mi-cyan/40 rounded-3xl p-6 md:p-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider border border-mi-cyan/50 text-mi-cyan rounded px-2 py-0.5">{s.entry.badge}</span>
                    <h3 className="text-2xl font-bold text-white mt-3 mb-2">{s.entry.name}</h3>
                    <p className="text-mi-light/85 mb-4 max-w-3xl">{s.entry.description}</p>
                    <ul className="space-y-1 mb-4 text-sm text-mi-light/85">
                        {s.entry.includes.map((line) => <li key={line} className="flex items-start gap-2"><Icons.Check size={14} className="text-mi-cyan shrink-0 mt-1" />{line}</li>)}
                    </ul>
                    <p className="text-xs text-mi-light/70 mb-5">{s.entry.disclaimer}</p>
                    <Button variant="outline" onClick={() => openModal({ packageType: 'entry' })}>{s.entry.cta}</Button>
                </article>
                <p className="text-center text-sm text-mi-light/70 mt-8">{s.quote}</p>
            </Container>
        </section>
    );
}

function FaqDe() {
    const f = DE.faq;
    return (
        <section id="fragen" className="py-14 md:py-20 bg-mi-dark2 border-t border-mi-dark1">
            <Container className="max-w-3xl">
                <SectionHeader label={f.label} title={f.title} />
                <div className="space-y-3">
                    {f.items.map((item) => (
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

export default function LandingDe() {
    return (
        <Layout>
            <HeroDe />
            <TrustStripDe />
            <Checks />
            <Who />
            <ServicesDe />
            <FaqDe />
        </Layout>
    );
}

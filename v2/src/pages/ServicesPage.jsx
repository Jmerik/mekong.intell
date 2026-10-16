import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { QuickLookPill } from '../components/Hero.jsx';
import { Container, Button, Icons } from '../components/ui.jsx';
import { useModal } from '../components/Layout.jsx';
import { SERVICES, MARKET_ENTRY, QUICK_LOOK } from '../content/site.js';

// Prices are not published yet (Cambodia pricing is still being tested). Each step shows what is
// included, how long it takes and how it is scoped. Replace PRICE_LABEL values when prices are agreed.
const PRICE_LABEL = {
    quicklook: 'Free',
    sprint: 'Shared after your Quick Look',
    blueprint: 'Shared after your Quick Look',
    retainer: 'Shared after your Quick Look',
    entry: 'Shared after your Quick Look'
};

const MARKETS = [
    { id: 'local', label: 'Local Market' },
    { id: 'international', label: 'International / Regional' }
];

const stepLink = 'inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-bold border-2 border-mi-cyan text-mi-cyan hover:bg-mi-cyan/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan';

function ServiceCard({ service, market, primary }) {
    const { startQuickLook } = useModal();
    const isEntry = service.package === 'entry';
    const depth = isEntry ? service.depth : service.depth[market];
    return (
        <article id={service.package} className={`flex flex-col bg-mi-dark2 rounded-2xl p-6 shadow-xl border ${primary ? 'border-mi-cyan/70' : isEntry ? 'border-2 border-dashed border-mi-cyan/50' : 'border-mi-blue/20'}`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest">{isEntry ? service.badge : `${service.step} · ${service.when}`}</p>
                {!isEntry && service.badge && <span className="text-[10px] font-bold uppercase tracking-wider text-mi-dark1 bg-mi-cyan rounded px-2 py-1">{service.badge}</span>}
            </div>
            <h2 className="text-2xl font-bold text-white mt-2 mb-1">{service.name}</h2>
            <p className="text-sm font-semibold text-mi-cyan mb-3">{service.promise}</p>
            <p className="text-mi-light/85 text-sm leading-relaxed mb-4">{service.description}</p>

            <p className="text-xs font-bold text-white uppercase mb-1">Scope depth</p>
            <p className="text-sm text-mi-light/85 mb-5">{depth}</p>

            <dl className="text-sm border-y border-mi-dark1 py-4 mb-5 space-y-2">
                {service.timeline && <div className="flex justify-between gap-4"><dt className="text-mi-light/70">Timeline</dt><dd className="text-white font-semibold text-right">{service.timeline}</dd></div>}
                <div className="flex justify-between gap-4"><dt className="text-mi-light/70">Scope</dt><dd className="text-white font-semibold text-right">{service.scope}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-mi-light/70">Price</dt><dd className="text-white font-semibold text-right">{PRICE_LABEL[service.package]}</dd></div>
            </dl>

            <p className="text-xs font-bold text-white uppercase mb-3">Deliverables</p>
            <ul className="space-y-3 mb-6 text-sm text-mi-light/90 flex-1">
                {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" />{item}</li>
                ))}
            </ul>
            {isEntry && <p className="text-xs text-mi-light/70 mb-4">{service.availability} {service.disclaimer}</p>}

            {primary ? (
                <Button className="w-full" onClick={startQuickLook}>{service.button}</Button>
            ) : (
                <a href={`/contact?interest=${service.package}`} className={stepLink}>{service.cta}</a>
            )}
        </article>
    );
}

export default function ServicesPage() {
    const [market, setMarket] = useState('local');

    // /services?market=international opens the international view (the international landing page links here).
    useEffect(() => {
        const wanted = new URLSearchParams(window.location.search).get('market');
        if (MARKETS.some((m) => m.id === wanted)) setMarket(wanted);
    }, []);

    const choose = (id) => {
        setMarket(id);
        const url = new URL(window.location.href);
        url.searchParams.set('market', id);
        window.history.replaceState(null, '', url);
    };

    const international = market === 'international';
    const cards = international ? [...SERVICES, MARKET_ENTRY] : SERVICES;

    return (
        <Layout current="/services">
            <header className="bg-mi-dark1 pt-16 pb-10 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Services</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Service tiers, with clear scopes.</h1>
                    <p className="text-xl text-mi-light/85">Start free. Each tier shows what is included, how long it takes and how it is scoped, so you can decide with evidence in hand.</p>
                </Container>
            </header>

            <section aria-labelledby="start-here" className="pb-10 bg-mi-dark1">
                <Container className="max-w-3xl text-center">
                    <h2 id="start-here" className="text-xl font-bold text-white mb-4">Start here: your Free Quick Look</h2>
                    <QuickLookPill />
                </Container>
            </section>

            <section className="pb-20 bg-mi-dark1">
                <Container className="max-w-7xl">
                    <div role="group" aria-label="Market scope" className="flex justify-center mb-8">
                        <div className="inline-flex p-1 rounded-full bg-mi-dark2 border border-mi-blue/30">
                            {MARKETS.map((m) => (
                                <button key={m.id} type="button" aria-pressed={market === m.id} onClick={() => choose(m.id)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan ${market === m.id ? 'bg-mi-cyan text-mi-dark1' : 'text-mi-light/80 hover:text-white'}`}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${international ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}>
                        {cards.map((service, index) => (
                            <ServiceCard key={service.package} service={service} market={market} primary={index === 0} />
                        ))}
                    </div>

                    {!international && (
                        <p className="mt-8 text-center text-sm text-mi-light/80">
                            Expanding across borders? Switch to <button type="button" onClick={() => choose('international')} className="text-mi-cyan underline hover:text-white">International / Regional</button> to see the Market Entry Brief.
                        </p>
                    )}

                    <p className="mt-8 max-w-3xl mx-auto text-center text-mi-light/80">
                        Prices depend on your market and scope. After your {QUICK_LOOK.cta.replace('Request my ', '')} we can talk through what the evidence supports, and what each tier would cost.{' '}
                        <a href="/contact" className="text-mi-cyan underline hover:text-white">Book a Strategy Call</a>
                    </p>
                </Container>
            </section>
        </Layout>
    );
}

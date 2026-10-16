import { useState, useEffect, useRef } from 'react';
import { SectionHeader, Container, Button } from './ui.jsx';
import { useModal } from './Layout.jsx';
import { FoundMock, TrustedMock, ReachedMock } from './mocks.jsx';

// Found | Trusted | Reached as a tab set: one card at a time, text on the left and the example screen on the right.
// All three panels are in the page HTML (the others are just hidden), so search engines read every one, and
// (visibility is set by the class, because Tailwind's `grid` would otherwise override the `hidden` attribute)
// each panel has a deep link (#found, #trusted, #reached).
const TABS = [
    {
        id: 'found', name: 'Found', kind: 'AI & Search Visibility', headline: 'Get Found in the AI Era.', cta: 'Test AI Visibility',
        Mock: FoundMock, field: 'found'
    },
    {
        id: 'trusted', name: 'Trusted', kind: 'Proof & Digital Storefront', headline: 'Look Real. Build Instant Trust.', cta: 'Check Digital Health',
        Mock: TrustedMock, field: 'trusted'
    },
    {
        id: 'reached', name: 'Reached', kind: 'Messaging & Conversion', headline: 'Turn Visits into Messages.', cta: 'Fix Chat Funnel',
        Mock: ReachedMock, field: 'reached'
    }
];

export default function Pillars({ audience }) {
    const { openModal } = useModal();
    const [active, setActive] = useState('found');
    const tabRefs = useRef({});

    // Open the tab named in the address (#trusted), and follow later changes to it.
    useEffect(() => {
        const fromHash = () => {
            const id = window.location.hash.replace('#', '');
            if (TABS.some((t) => t.id === id)) setActive(id);
        };
        fromHash();
        window.addEventListener('hashchange', fromHash);
        return () => window.removeEventListener('hashchange', fromHash);
    }, []);

    const onKeyDown = (e) => {
        const index = TABS.findIndex((t) => t.id === active);
        let next = null;
        if (e.key === 'ArrowRight') next = (index + 1) % TABS.length;
        else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = TABS.length - 1;
        if (next === null) return;
        e.preventDefault();
        const tab = TABS[next];
        setActive(tab.id);
        if (tabRefs.current[tab.id]) tabRefs.current[tab.id].focus();
    };

    return (
        <section id="quick-look" className="py-14 md:py-20 bg-mi-dark1 border-t border-mi-dark2">
            <Container>
                <SectionHeader
                    label="What the Quick Look checks"
                    title="Found. Trusted. Reached."
                    subtitle="Three checks that decide whether a buyer ever contacts you."
                />

                <div role="tablist" aria-label="Found, Trusted or Reached" onKeyDown={onKeyDown} className="flex justify-center gap-2 mb-6 md:mb-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            ref={(el) => { tabRefs.current[tab.id] = el; }}
                            role="tab"
                            id={`tab-${tab.id}`}
                            type="button"
                            aria-selected={active === tab.id}
                            aria-controls={`panel-${tab.id}`}
                            tabIndex={active === tab.id ? 0 : -1}
                            onClick={() => setActive(tab.id)}
                            className={`px-5 md:px-8 py-2.5 rounded-full text-sm md:text-base font-bold border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan ${active === tab.id ? 'bg-mi-cyan text-mi-dark1 border-mi-cyan' : 'bg-mi-dark2 text-mi-light/85 border-mi-blue/40 hover:border-mi-cyan hover:text-white'}`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="max-w-6xl mx-auto">
                    {TABS.map((tab) => (
                        <article
                            key={tab.id}
                            id={tab.id}
                            role="tabpanel"
                            aria-labelledby={`tab-${tab.id}`}
                            hidden={active !== tab.id}
                            className={`${active === tab.id ? 'grid' : 'hidden'} md:grid-cols-2 gap-6 md:gap-12 items-center bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-5 md:p-10 shadow-xl`}
                        >
                            <div>
                                <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">
                                    {tab.name} <span className="text-mi-light/70 normal-case tracking-normal font-medium">&middot; {tab.kind}</span>
                                </p>
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">{tab.headline}</h3>
                                <p className="text-mi-light/85 text-base md:text-lg leading-relaxed mb-6">{audience[tab.field].body}</p>
                                <Button variant="outline" onClick={() => openModal({ packageType: 'quicklook', focus: tab.id })}>{tab.cta}</Button>
                            </div>
                            <div><tab.Mock data={audience[tab.field]} /></div>
                        </article>
                    ))}
                    <p className="mt-6 text-center text-xs text-mi-light/70">Screens marked Example are illustrations, not client data.</p>
                </div>
            </Container>
        </section>
    );
}

import Layout, { useModal } from '../components/Layout.jsx';
import { Container, Button, Icons } from '../components/ui.jsx';
import { SITE, QUICK_LOOK } from '../content/site.js';

const PILLARS = [
    { title: 'Rigorous data analysis', text: 'Every finding traces to a page, a date or a data source. Anything we cannot verify is marked N/A.' },
    { title: 'AI-driven workflows', text: 'AI processes the noise so the diagnosis is fast. People decide what matters.' },
    { title: 'Market intelligence from Phnom Penh', text: 'Local knowledge of how buyers in Cambodia and Vietnam search, trust and message.' }
];

export default function Team() {
    const { openModal } = useModal();
    return (
        <Layout current="/team">
            <header className="bg-mi-dark1 pt-16 pb-12 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">About Us</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">A lean team. Strategic depth.</h1>
                    <p className="text-xl text-mi-light/85">Rigorous data analysis, AI-driven workflows and market intelligence expertise, based in Phnom Penh.</p>
                </Container>
            </header>

            <section className="pb-20 bg-mi-dark1">
                <Container className="max-w-6xl">
                    <div className="bg-mi-dark2 rounded-3xl p-8 md:p-12 border border-mi-blue/30 grid md:grid-cols-3 gap-10 items-center shadow-2xl">
                        <div className="md:col-span-1">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-mi-dark1 shadow-2xl">
                                <img src="/image/vosumtey.webp" alt="Vosumtey Seng, Founder of Mekong Intelligence" width="800" height="800" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <p className="inline-block px-3 py-1 bg-mi-blue/10 border border-mi-blue/30 rounded-full text-mi-cyan text-xs font-bold tracking-wider mb-4">FOUNDER</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Vosumtey Seng</h2>
                            <p className="text-xl text-mi-cyan font-medium mb-6">Founder & Chief Strategist</p>
                            <p className="text-mi-light leading-relaxed mb-6">
                                Vosumtey Seng is the founder of Mekong Intelligence. The background spans high-stakes corporate organisations and fast-moving Web3 ecosystems. The focus is turning competitor data and market signals into decisions that drive revenue.
                            </p>
                            <div className="p-5 bg-mi-dark1/80 rounded-xl border border-mi-blue/30 relative overflow-hidden mb-8">
                                <div className="absolute top-0 left-0 w-1 h-full bg-mi-cyan" aria-hidden="true"></div>
                                <h3 className="font-bold text-white mb-2">B2B market authority</h3>
                                <p className="text-sm text-mi-light/85">At <strong className="text-white">EuroCham</strong>, Vosumtey led digital authority and grew a targeted audience of 20,000+ professionals with no ad spend.</p>
                            </div>
                            <div className="flex flex-wrap gap-4 items-center">
                                <a href={SITE.linkedinUrl} target="_blank" rel="noreferrer" aria-label="Vosumtey Seng on LinkedIn" className="p-3 bg-mi-dark1 border border-mi-cyan/50 rounded-lg hover:bg-mi-cyan hover:text-mi-dark1 transition-colors text-mi-cyan"><Icons.Linkedin size={24} /></a>
                                <a href={SITE.telegramUrl} target="_blank" rel="noreferrer" aria-label="Mekong Intelligence on Telegram" className="p-3 bg-mi-dark1 border border-mi-cyan/50 rounded-lg hover:bg-mi-cyan hover:text-mi-dark1 transition-colors text-mi-cyan"><Icons.Send size={24} /></a>
                                <span className="text-sm text-mi-light/80 font-medium italic border-l border-mi-dark1 pl-4">Work directly with the founder.</span>
                            </div>
                        </div>
                    </div>

                    {/* Only facts from the MI brand guide. No photo or bio supplied yet: replace the initials with a
                        photo and add two lines about Jan's background when they are ready. */}
                    <div className="mt-6 bg-mi-dark2 rounded-3xl p-6 md:p-8 border border-mi-blue/30 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-xl">
                        <div className="w-20 h-20 shrink-0 rounded-full bg-mi-dark1 border-2 border-mi-cyan/60 text-mi-cyan text-2xl font-bold flex items-center justify-center" aria-hidden="true">JH</div>
                        <div>
                            <p className="inline-block px-3 py-1 bg-mi-blue/10 border border-mi-blue/30 rounded-full text-mi-cyan text-xs font-bold tracking-wider mb-2">PARTNER</p>
                            <h2 className="text-2xl font-bold text-white">Jan Hanken</h2>
                            <p className="text-mi-light/85 mt-1">Leads the German-speaking (DACH) segment. Material for German-speaking buyers is written in German.</p>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-20 bg-mi-dark2 border-t border-mi-dark1">
                <Container className="max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">How we work</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PILLARS.map((pillar) => (
                            <div key={pillar.title} className="bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{pillar.title}</h3>
                                <p className="text-mi-light/85">{pillar.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Button onClick={() => openModal({ packageType: 'quicklook' })} className="mx-auto">{QUICK_LOOK.cta}</Button>
                    </div>
                </Container>
            </section>
        </Layout>
    );
}

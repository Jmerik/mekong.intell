import Layout, { useModal } from '../components/Layout.jsx';
import { Container, Button, Icons } from '../components/ui.jsx';
import { SERVICES } from '../content/site.js';

// Prices are not published yet (Cambodia pricing is still being tested). Each step shows what is
// included, how long it takes and how it is scoped. Replace PRICE_LABEL values when prices are agreed,
// and rename the page's nav label if you want it to say "Pricing" again.
const PRICE_LABEL = {
    quicklook: 'Free',
    sprint: 'Shared after your Quick Look',
    blueprint: 'Shared after your Quick Look',
    retainer: 'Shared after your Quick Look'
};

export default function ServicesPage() {
    const { openModal } = useModal();
    return (
        <Layout current="/services">
            <header className="bg-mi-dark1 pt-16 pb-12 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Services</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Four steps. Know what you get.</h1>
                    <p className="text-xl text-mi-light/85">Start free. Each step shows what is included, how long it takes and how it is scoped, so you can decide with evidence in hand.</p>
                </Container>
            </header>

            <section className="pb-20 bg-mi-dark1">
                <Container className="max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {SERVICES.map((service, index) => (
                            <article key={service.package} id={service.package} className={`flex flex-col bg-mi-dark2 rounded-2xl p-6 shadow-xl border ${index === 0 ? 'border-mi-cyan/70' : 'border-mi-blue/20'}`}>
                                <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest">{service.step} &middot; {service.when}</p>
                                <h2 className="text-2xl font-bold text-white mt-2 mb-1">{service.name}</h2>
                                <p className="text-sm font-semibold text-mi-cyan mb-3">{service.promise}</p>
                                <p className="text-mi-light/85 text-sm leading-relaxed mb-5">{service.description}</p>

                                <dl className="text-sm border-y border-mi-dark1 py-4 mb-5 space-y-2">
                                    {service.timeline && <div className="flex justify-between gap-4"><dt className="text-mi-light/70">Timeline</dt><dd className="text-white font-semibold text-right">{service.timeline}</dd></div>}
                                    <div className="flex justify-between gap-4"><dt className="text-mi-light/70">Scope</dt><dd className="text-white font-semibold text-right">{service.scope}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-mi-light/70">Price</dt><dd className="text-white font-semibold text-right">{PRICE_LABEL[service.package]}</dd></div>
                                </dl>

                                <p className="text-xs font-bold text-white uppercase mb-3">What is included</p>
                                <ul className="space-y-3 mb-8 text-sm text-mi-light/90 flex-1">
                                    {service.includes.map((item) => (
                                        <li key={item} className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" />{item}</li>
                                    ))}
                                </ul>
                                {index === 0 ? (
                                    <Button className="w-full" onClick={() => openModal({ packageType: service.package })}>{service.button}</Button>
                                ) : (
                                    <Button variant="outline" className="w-full" onClick={() => openModal({ packageType: service.package })}>Ask about this step</Button>
                                )}
                            </article>
                        ))}
                    </div>

                    <p className="mt-10 max-w-3xl mx-auto text-center text-mi-light/80">
                        Prices depend on your market and scope. After your Quick Look we can talk through what the evidence supports, and what each step would cost.{' '}
                        <button type="button" onClick={() => openModal({ packageType: 'call' })} className="text-mi-cyan underline hover:text-white">Book a call</button>
                    </p>
                </Container>
            </section>
        </Layout>
    );
}

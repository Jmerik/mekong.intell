import { SERVICES, MARKET_ENTRY } from '../content/site.js';
import { SectionHeader, Button, Container, Icons } from './ui.jsx';
import { useModal } from './Layout.jsx';

const stepLink = 'inline-flex items-center gap-2 font-bold text-mi-cyan hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan rounded';

// The four steps as one timeline: Day 0, days 1 to 7, 90 days with the day-35 recount, then monthly.
// The Quick Look is the one primary button. The other steps link to the contact page with the service
// pre-selected (/contact?interest=sprint). `audience` adds one line under the 7-Day Sprint, and on the
// international page the Market Entry Brief appears below the timeline.
export default function Services({ audience }) {
    const { startQuickLook } = useModal();
    const international = audience && audience.id === 'international';

    return (
        <section id="services" className="py-14 md:py-20 bg-mi-dark1 border-t border-mi-dark2">
            <Container className="max-w-7xl">
                <SectionHeader
                    label="Services"
                    title="Four steps. Start free."
                    subtitle="Every engagement starts with the Free Quick Look. Take the next step when the evidence supports it."
                />

                <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                    {SERVICES.map((service, index) => (
                        <li key={service.package} className={`relative flex flex-col ${index < SERVICES.length - 1 ? 'xl:before:content-[\'\'] xl:before:absolute xl:before:top-[17px] xl:before:left-12 xl:before:-right-6 xl:before:h-px xl:before:bg-mi-blue/50' : ''}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="relative z-10 w-9 h-9 shrink-0 rounded-full border-2 border-mi-cyan bg-mi-dark1 text-mi-cyan font-bold flex items-center justify-center" aria-hidden="true">{index + 1}</span>
                                <span className="relative z-10 bg-mi-dark1 pr-2 text-sm font-bold text-mi-cyan uppercase tracking-wider">{service.when}</span>
                            </div>

                            <article className={`flex flex-col flex-1 bg-mi-dark2 rounded-2xl p-6 shadow-xl border ${index === 0 ? 'border-mi-cyan/70' : 'border-mi-blue/20'}`}>
                                <p className="sr-only">{service.step}</p>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-2xl font-bold text-white mb-1">{service.name}</h3>
                                    {service.badge && <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-mi-dark1 bg-mi-cyan rounded px-2 py-1">{service.badge}</span>}
                                </div>
                                <p className="text-sm font-semibold text-mi-cyan mb-3">{service.promise}</p>
                                <p className="text-mi-light/85 text-sm leading-relaxed">{service.description}</p>
                                {service.milestone && (
                                    <p className="mt-4 w-fit text-xs font-bold text-mi-cyan border border-mi-cyan/40 bg-mi-cyan/10 px-2 py-1 rounded">{service.milestone}</p>
                                )}
                                {audience && service.package === 'sprint' && (
                                    <p className="mt-4 text-xs text-mi-light/70">{audience.sprintNote}</p>
                                )}
                                <div className="mt-auto pt-6">
                                    {index === 0 ? (
                                        <Button className="w-full xl:px-3 xl:text-sm" onClick={startQuickLook}>{service.button}</Button>
                                    ) : (
                                        <a href={`/contact?interest=${service.package}`} className={stepLink}>
                                            {service.cta} <Icons.ArrowRight size={16} />
                                        </a>
                                    )}
                                </div>
                            </article>
                        </li>
                    ))}
                </ol>

                {international ? (
                    <article id="market-entry" className="mt-10 bg-mi-dark2 border-2 border-dashed border-mi-cyan/50 rounded-3xl p-6 md:p-8 grid md:grid-cols-3 gap-6 items-center">
                        <div className="md:col-span-2">
                            <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest mb-2">{MARKET_ENTRY.badge}</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{MARKET_ENTRY.name}</h3>
                            <p className="text-sm font-semibold text-mi-cyan mb-3">{MARKET_ENTRY.promise}</p>
                            <p className="text-mi-light/85">{MARKET_ENTRY.description}</p>
                            <p className="mt-3 text-xs text-mi-light/70">{MARKET_ENTRY.disclaimer}</p>
                        </div>
                        <div className="md:text-right">
                            <a href="/contact?interest=entry" className={stepLink}>{MARKET_ENTRY.cta} <Icons.ArrowRight size={16} /></a>
                        </div>
                    </article>
                ) : (
                    <p className="mt-8 text-center text-sm text-mi-light/80">
                        Expanding across borders? <a href="/international#market-entry" className="text-mi-cyan underline hover:text-white">See the Market Entry Brief</a>.
                    </p>
                )}

                <p className="mt-6 md:mt-8 text-center text-sm text-mi-light/80">
                    See what each step includes on the <a href={international ? '/services?market=international' : '/services'} className="text-mi-cyan underline hover:text-white">services page</a>.
                </p>
            </Container>
        </section>
    );
}

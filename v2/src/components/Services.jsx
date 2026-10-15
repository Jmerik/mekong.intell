import { SERVICES } from '../content/site.js';
import { SectionHeader, Button, Container, Icons } from './ui.jsx';
import { useModal } from './Layout.jsx';

// The four steps as one timeline: Day 0, days 1 to 7, 90 days with the day-35 recount, then monthly.
// One primary button (the Quick Look). The other steps have a plain link, so the page keeps a single main action.
// `audience` (optional) adds one audience-specific line under the 7-Day Sprint.
export default function Services({ audience }) {
    const { openModal } = useModal();

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
                                <h3 className="text-2xl font-bold text-white mb-1">{service.name}</h3>
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
                                        <Button className="w-full xl:px-3 xl:text-sm" onClick={() => openModal({ packageType: service.package })}>{service.button}</Button>
                                    ) : (
                                        <button type="button" onClick={() => openModal({ packageType: service.package })}
                                            className="inline-flex items-center gap-2 font-bold text-mi-cyan hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan rounded">
                                            Ask about this step <Icons.ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </article>
                        </li>
                    ))}
                </ol>

                <p className="mt-8 md:mt-10 text-center text-sm text-mi-light/80">
                    See what each step includes on the <a href="/services" className="text-mi-cyan underline hover:text-white">services page</a>.
                </p>
            </Container>
        </section>
    );
}

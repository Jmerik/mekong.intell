import { SERVICES } from '../content/site.js';
import { SectionHeader, Button, Container } from './ui.jsx';
import { useModal } from './Layout.jsx';

// Four-step ladder. `audience` (optional) adds one audience-specific line under the Sprint.
export default function Services({ audience }) {
    const { openModal } = useModal();

    return (
        <section id="services" className="py-20 bg-mi-dark1 border-t border-mi-dark2">
            <Container className="max-w-7xl">
                <SectionHeader
                    label="Services"
                    title="Four steps. Start free."
                    subtitle="Every engagement starts with the Free Quick Look. Take the next step when the evidence supports it."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {SERVICES.map((service, index) => (
                        <article key={service.package} className={`relative flex flex-col bg-mi-dark2 rounded-2xl p-6 shadow-xl border ${index === 0 ? 'border-mi-cyan/70' : 'border-mi-blue/20'} overflow-hidden`}>
                            {index === 0 && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mi-cyan to-mi-blue" aria-hidden="true"></div>}
                            <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest">{service.step}</p>
                            <p className="mt-3 w-fit text-xs font-bold text-mi-cyan border border-mi-cyan/30 bg-mi-cyan/10 px-2 py-1 rounded">{service.badge}</p>
                            <h3 className="text-2xl font-bold text-white mt-3 mb-3">{service.title}</h3>
                            <p className="text-mi-light/85 text-sm leading-relaxed mb-4">{service.description}</p>
                            {audience && service.package === 'sprint' && (
                                <p className="text-xs text-mi-light/70 mb-4">{audience.sprintNote}</p>
                            )}
                            <div className="mt-auto pt-4">
                                <Button variant={index === 0 ? 'primary' : 'outline'} className="w-full" onClick={() => openModal({ packageType: service.package })}>
                                    {service.button}
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="mt-8 text-center text-sm text-mi-light/80">
                    See what each step includes on the <a href="/pricing" className="text-mi-cyan underline hover:text-white">pricing page</a>.
                </p>
            </Container>
        </section>
    );
}

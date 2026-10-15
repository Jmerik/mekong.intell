import Layout from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import { SectionHeader, Container, Icons } from '../components/ui.jsx';
import { AUDIENCE_LIST } from '../content/audiences.js';

const CHOICES = {
    local: {
        title: 'Local',
        text: 'You sell to customers in Cambodia and across the Mekong region. Google Maps, Facebook, Telegram and Messenger decide who finds and contacts you.'
    },
    international: {
        title: 'International',
        text: 'You sell across borders, into the Mekong region or out of it. Google, AI answers and LinkedIn shape who trusts you.'
    }
};

const CHECKS = [
    { name: 'Found', text: 'Do Google, Maps and AI assistants show you when buyers ask?' },
    { name: 'Trusted', text: 'Do your profiles, reviews and details look active and reliable?' },
    { name: 'Reached', text: 'Can an interested buyer message you in one step, and get a quick reply?' }
];

// Home page: the brand headline and the Quick Look, then a clear choice between the two landing pages.
export default function Gateway() {
    return (
        <Layout current="/">
            <Hero />

            <section id="choose" className="py-20 bg-mi-dark2 border-t border-mi-dark1">
                <Container>
                    <SectionHeader label="Choose your path" title="Where do you sell?" subtitle="Pick the page that fits your business. The Quick Look is the same, the examples are not." />
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {AUDIENCE_LIST.map((audience) => (
                            <a key={audience.id} href={audience.path} className="group flex flex-col bg-mi-dark1 border border-mi-blue/30 hover:border-mi-cyan rounded-3xl p-8 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mi-cyan">
                                <h3 className="text-3xl font-bold text-white mb-3">{CHOICES[audience.id].title}</h3>
                                <p className="text-mi-light/85 text-lg leading-relaxed mb-6">{CHOICES[audience.id].text}</p>
                                <span className="mt-auto inline-flex items-center gap-2 font-bold text-mi-cyan">
                                    See the {CHOICES[audience.id].title.toLowerCase()} page <Icons.ArrowRight size={18} className="motion-safe:group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="py-20 bg-mi-dark1 border-t border-mi-dark2">
                <Container>
                    <SectionHeader label="What the Quick Look checks" title="Found. Trusted. Reached." subtitle="Three checks that decide whether a buyer ever contacts you." />
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {CHECKS.map((check) => (
                            <div key={check.name} className="bg-mi-dark2 border border-mi-blue/20 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-mi-cyan mb-2">{check.name}</h3>
                                <p className="text-mi-light/85">{check.text}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </Layout>
    );
}

import Layout, { useModal } from '../components/Layout.jsx';
import { Container, Button } from '../components/ui.jsx';
import { SampleReport } from '../components/Sample.jsx';
import { SAMPLE } from '../content/sample.js';
import { QUICK_LOOK } from '../content/site.js';

// The full sample Quick Look. All wording and findings come from content/sample.js.
export default function SamplePage() {
    const { openModal } = useModal();
    return (
        <Layout current="/resources">
            <header className="bg-mi-dark1 pt-14 pb-10 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Sample Quick Look</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">{SAMPLE.business}</h1>
                    <p className="text-mi-light/80">
                        {SAMPLE.site} &middot; <time dateTime={SAMPLE.isoDate}>{SAMPLE.date}</time> &middot; Prepared by Mekong Intelligence &middot; Public information only
                    </p>
                </Container>
            </header>

            <section className="pb-16 bg-mi-dark1">
                <Container className="max-w-3xl">
                    <SampleReport />
                    <div className="mt-12 text-center bg-mi-dark2 border border-mi-cyan/40 rounded-3xl p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Want this for your business?</h2>
                        <p className="text-mi-light/85 mb-6">Free, delivered {QUICK_LOOK.delivery}, no credit card required.</p>
                        <Button onClick={() => openModal({ packageType: 'quicklook' })} className="mx-auto">{QUICK_LOOK.cta}</Button>
                    </div>
                </Container>
            </section>
        </Layout>
    );
}

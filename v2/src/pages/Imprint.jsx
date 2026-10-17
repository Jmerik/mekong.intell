import Layout from '../components/Layout.jsx';
import { Container } from '../components/ui.jsx';
import { SITE } from '../content/site.js';

// Impressum (provider details). PLACEHOLDER: the postal address, the email address and the name of the owner
// are not known yet ("will follow"), so this page says so instead of guessing. It is excluded from search engines
// and the sitemap (content/pages.js) and must be completed before any German-language launch (README, Phase 4).
export default function Imprint() {
    return (
        <Layout>
            <Container className="py-16 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-2">Impressum</h1>
                <p className="text-sm text-mi-light/70 mb-10">Stand: 16. Oktober 2026 (Entwurf, Angaben folgen)</p>

                <div className="space-y-8 leading-relaxed text-mi-light/90">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Anbieter</h2>
                        <p>Mekong Intelligence<br />Einzelunternehmen<br />{SITE.location}</p>
                        <p className="mt-3">Vollständige Anschrift und Name der Inhaberin oder des Inhabers: folgen.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Kontakt</h2>
                        <p>Telegram: <a className="text-mi-cyan underline" href={SITE.telegramUrl}>@mekongintelligence</a><br />E-Mail: folgt.</p>
                    </section>
                </div>
            </Container>
        </Layout>
    );
}

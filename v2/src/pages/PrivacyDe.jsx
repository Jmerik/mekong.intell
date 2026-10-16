import Layout from '../components/Layout.jsx';
import { Container } from '../components/ui.jsx';
import { SITE } from '../content/site.js';

// Entwurf. German version of the privacy policy (pages/Privacy.jsx). Have it reviewed before launch,
// together with the open question whether EU data protection rules require more (see README, Phase 4).
export default function PrivacyDe() {
    return (
        <Layout>
            <Container className="py-16 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-2">Datenschutzerklärung</h1>
                <p className="text-sm text-mi-light/70 mb-10">Stand: 16. Oktober 2026 (Entwurf)</p>

                <div className="space-y-8 leading-relaxed text-mi-light/90">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Wer wir sind</h2>
                        <p>Mekong Intelligence ist ein Einzelunternehmen mit Sitz in Phnom Penh, Kambodscha. Diese Erklärung beschreibt, welche Informationen wir über diese Website erheben und wie wir sie verwenden. Die vollständigen Anbieterangaben finden Sie im <a className="text-mi-cyan underline" href="/impressum">Impressum</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Angaben, die Sie uns mitteilen</h2>
                        <p className="mb-3">Wenn Sie einen Quick Look anfordern, ein Gespräch buchen oder uns eine Nachricht senden, erheben wir:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Ihren Namen und Ihre E-Mail-Adresse;</li>
                            <li>Ihren Telegram-Benutzernamen und/oder Ihre Telefonnummer;</li>
                            <li>die Website oder den Firmennamen, die wir prüfen sollen, sofern Sie diese angeben;</li>
                            <li>Ihre Nachricht sowie die Seite oder Leistung, für die Sie sich interessiert haben, sofern Sie diese angeben.</li>
                        </ul>
                        <p className="mt-3">Wir verwenden diese Angaben ausschließlich, um Ihre Anfrage zu beantworten und eine mögliche Zusammenarbeit zu besprechen. Wir verkaufen sie nicht und nehmen Sie nicht ohne Ihre Zustimmung in Marketing-Verteiler auf.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Der Quick Look</h2>
                        <p>Der Quick Look beruht ausschließlich auf öffentlichen Informationen. Wir betrachten, was über die von Ihnen genannte Website oder das genannte Unternehmen öffentlich sichtbar ist.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Wie Ihre Anfrage verarbeitet wird</h2>
                        <p>Anfragen werden uns über Telegram zugestellt und in einer Google-Tabelle gespeichert, damit keine Anfrage verloren geht, falls einer der beiden Dienste nicht erreichbar ist. Die Website wird von einem externen Anbieter (Vercel) gehostet, der kurzzeitig Server-Protokolle speichert. Diese Anbieter verarbeiten die Angaben nur, damit Ihre Anfrage uns erreicht.</p>
                    </section>

                    <section id="analytics">
                        <h2 className="text-xl font-bold text-white mb-3">Analyse und Cookies</h2>
                        <p>Wir nutzen möglicherweise Google Analytics, um zu verstehen, wie Besucher die Website verwenden, zum Beispiel welche Seiten aufgerufen werden und ob eine Anfrage gesendet wurde. <strong className="text-white">Die Analyse ist ausgeschaltet, bis Sie im Cookie-Banner zustimmen.</strong> Vorher nimmt Ihr Browser keinen Kontakt zu Google auf, und es werden keine Analyse-Cookies gesetzt. Wenn Sie zustimmen, setzt Google Analytics Cookies und erfasst Angaben wie ungefährer Standort, Gerät und Browser. Ihre Entscheidung können Sie jederzeit über den Link &bdquo;Cookie-Einstellungen&ldquo; am Ende jeder Seite ändern.</p>
                        <p className="mt-3">Die Schriftarten dieser Website werden von der Website selbst ausgeliefert, nicht von Google.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Wie lange wir Angaben speichern</h2>
                        <p>Wir speichern Ihre Angaben nur so lange, wie wir sie benötigen, um Ihnen zu antworten und, falls wir zusammenarbeiten, diese Geschäftsbeziehung zu führen.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Ihre Rechte</h2>
                        <p>Sie können jederzeit Auskunft über die Angaben verlangen, die Sie uns gesendet haben, sie berichtigen oder löschen lassen. Schreiben Sie uns dazu auf Telegram an <a className="text-mi-cyan underline" href={SITE.telegramUrl}>@mekongintelligence</a>.</p>
                    </section>
                </div>
            </Container>
        </Layout>
    );
}

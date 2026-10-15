import Layout from '../components/Layout.jsx';
import { Container } from '../components/ui.jsx';
import { SITE } from '../content/site.js';

// Draft. Review before launch, and update once the contact email and legal details are known.
export default function Privacy() {
    return (
        <Layout>
            <Container className="py-16 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                <p className="text-sm text-mi-light/70 mb-10">Last updated: 16 October 2026</p>

                <div className="space-y-8 leading-relaxed text-mi-light/90">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Who we are</h2>
                        <p>Mekong Intelligence is an individual business based in Phnom Penh, Cambodia. This policy explains what information we collect through this website and how we use it.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Information you give us</h2>
                        <p className="mb-3">When you request a Quick Look, book a call or send a message, we collect:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>your name and email address;</li>
                            <li>your Telegram username and/or phone number;</li>
                            <li>the website or company name you ask us to look at, if you provide it;</li>
                            <li>your message and the page or service you were interested in, if you provide them.</li>
                        </ul>
                        <p className="mt-3">We use this only to reply to your request and to discuss working together. We do not sell it or add you to marketing lists without asking.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">The Quick Look</h2>
                        <p>The Quick Look is based on public information only. We look at what is publicly visible about the website or company you name.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How your request is handled</h2>
                        <p>Requests are delivered to us through Telegram and saved in a Google Sheet, so that a request is not lost if one of them is unavailable. The website is hosted by a third-party provider (Vercel) that keeps short-term server logs. These providers process the information only so that your request reaches us.</p>
                    </section>

                    <section id="analytics">
                        <h2 className="text-xl font-bold text-white mb-3">Analytics and cookies</h2>
                        <p>We may use Google Analytics to understand how visitors use the site, for example which pages are viewed and whether a request was sent. <strong className="text-white">It is switched off until you accept it</strong> in the cookie banner: before that, your browser does not contact Google and no analytics cookies are set. If you accept, Google Analytics uses cookies and collects information such as approximate location, device and browser. You can change your choice at any time with the &ldquo;Cookie settings&rdquo; link at the bottom of every page.</p>
                        <p className="mt-3">The site's fonts are served from this site itself, not from Google.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How long we keep it</h2>
                        <p>We keep your details only for as long as we need them to respond to you and, if we work together, to manage that relationship.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Your choices</h2>
                        <p>You can ask us at any time to see, correct or delete the information you have sent us. Contact us on Telegram at <a className="text-mi-cyan underline" href={SITE.telegramUrl}>@mekongintelligence</a>.</p>
                    </section>
                </div>
            </Container>
        </Layout>
    );
}

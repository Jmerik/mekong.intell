import { createContext, useContext, useState, useCallback } from 'react';
import { SITE, NAV, QUICK_LOOK } from '../content/site.js';
import { Button, Icons, Container } from './ui.jsx';
import BookingModal from './BookingModal.jsx';
import Consent, { CookieSettingsLink } from './Consent.jsx';

// Replaced at build time by scripts/build.mjs (PREVIEW_BANNER=0 hides the banner for launch).
const SHOW_BANNER = process.env.PREVIEW_BANNER === '1';

const ModalContext = createContext({ openModal: () => {}, audience: 'general' });

// Any component can open the booking form: const { openModal } = useModal(); openModal({ packageType: 'quicklook' })
export const useModal = () => useContext(ModalContext);

const navLinkClass = 'text-sm font-medium text-mi-light/80 hover:text-white transition-colors';

function Nav({ current }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { openModal } = useModal();

    const open = (request) => {
        setMenuOpen(false);
        openModal(request);
    };

    return (
        <nav aria-label="Main" className="sticky top-0 z-40 bg-mi-dark1/95 backdrop-blur-md border-b border-mi-dark2">
            <Container className="flex justify-between items-center py-2">
                <a href="/" className="flex items-center" aria-label="Mekong Intelligence, home">
                    <img src="/image/logo.webp" alt="Mekong Intelligence" width="199" height="256" className="h-14 w-auto object-contain" />
                </a>

                <div className="hidden md:flex items-center gap-8">
                    {NAV.map((link) => (
                        <a key={link.href} href={link.href} aria-current={current === link.href ? 'page' : undefined}
                            className={`${navLinkClass} ${current === link.href ? 'text-white' : ''}`}>{link.label}</a>
                    ))}
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="py-2 px-4 text-sm" onClick={() => open({ packageType: 'call' })}>Book a Call</Button>
                        <Button variant="primary" className="py-2 px-4 text-sm" onClick={() => open({ packageType: 'quicklook' })}>Get Started</Button>
                    </div>
                </div>

                <button className="md:hidden text-white p-2" aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
            </Container>

            {menuOpen && (
                <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-mi-dark1 border-b border-mi-dark2 p-6 flex flex-col gap-2 shadow-xl">
                    {NAV.map((link) => (
                        <a key={link.href} href={link.href} aria-current={current === link.href ? 'page' : undefined} className="text-mi-light py-3">{link.label}</a>
                    ))}
                    <div className="flex flex-col gap-3 pt-2">
                        <Button variant="outline" onClick={() => open({ packageType: 'call' })}>Book a Call</Button>
                        <Button variant="primary" onClick={() => open({ packageType: 'quicklook' })}>Get Started</Button>
                    </div>
                </div>
            )}
        </nav>
    );
}

function Footer() {
    const { openModal } = useModal();
    const linkClass = 'text-mi-light/80 hover:text-white transition-colors';
    return (
        <footer className="bg-mi-dark1 border-t border-mi-dark2">
            <section className="py-16 text-center">
                <Container>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Every engagement starts with the Free Quick Look.</h2>
                    <p className="text-mi-light/80 mb-8 max-w-2xl mx-auto">
                        We show you where you are Found, Trusted and Reached, and where to focus first. From there, you decide how deep you want to go.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => openModal({ packageType: 'quicklook' })} className="px-10 py-4 text-lg">{QUICK_LOOK.cta}</Button>
                        <Button variant="outline" onClick={() => openModal({ packageType: 'call' })} className="px-10 py-4 text-lg">Book a Call</Button>
                    </div>
                </Container>
            </section>

            <div className="border-t border-mi-dark2 py-12">
                <Container className="grid gap-10 md:grid-cols-4 text-sm">
                    <div className="md:col-span-2">
                        <img src="/image/logo.webp" alt="Mekong Intelligence" width="199" height="256" loading="lazy" className="h-16 w-auto mb-4" />
                        <p className="text-mi-light/80 max-w-sm">{SITE.tagline} Brand and market intelligence for Southeast Asia, based in {SITE.location}.</p>
                        <p className="mt-3 text-mi-light/70">The Quick Look uses public information only.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-3">Explore</h3>
                        <ul className="space-y-2">
                            <li><a className={linkClass} href="/local">Local businesses</a></li>
                            <li><a className={linkClass} href="/international">International</a></li>
                            <li><a className={linkClass} href="/resources">Resources</a></li>
                            <li><a className={linkClass} href="/pricing">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-3">Company</h3>
                        <ul className="space-y-2">
                            <li><a className={linkClass} href="/team">About Us</a></li>
                            <li><a className={linkClass} href="/contact">Contact</a></li>
                            <li><a className={linkClass} href={SITE.telegramUrl} target="_blank" rel="noreferrer">Telegram</a></li>
                            <li><a className={linkClass} href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </Container>
                <Container className="mt-10 text-mi-light/70 text-sm">
                    <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Mekong Intelligence. All rights reserved. {SITE.location}</p>
                    <CookieSettingsLink className="mt-2 underline hover:text-white" />
                </Container>
            </div>
        </footer>
    );
}

export default function Layout({ current, audience = 'general', children }) {
    const [request, setRequest] = useState(null);
    const openModal = useCallback((req) => setRequest(req), []);
    const close = useCallback(() => setRequest(null), []);

    return (
        <ModalContext.Provider value={{ openModal, audience }}>
            <div className="min-h-screen flex flex-col selection:bg-mi-cyan/30 selection:text-white">
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-mi-cyan focus:text-mi-dark1 focus:px-4 focus:py-2 focus:rounded">Skip to content</a>
                {SHOW_BANNER && (
                    <p className="bg-mi-cyan text-mi-dark1 text-center text-sm font-semibold px-4 py-2">{SITE.previewBanner}</p>
                )}
                <Nav current={current} />
                <main id="main" className="flex-1">{children}</main>
                <Footer />
                {request && <BookingModal request={request} audience={audience} onClose={close} />}
                <Consent />
            </div>
        </ModalContext.Provider>
    );
}

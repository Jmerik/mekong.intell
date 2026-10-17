import { createContext, useContext, useState, useCallback } from 'react';
import { SITE, NAV, QUICK_LOOK, STRATEGY_CALL } from '../content/site.js';
import { DE } from '../content/de.js';
import { Button, Icons, Container } from './ui.jsx';
import BookingModal from './BookingModal.jsx';
import Consent, { CookieSettingsLink } from './Consent.jsx';

// Replaced at build time by scripts/build.mjs (PREVIEW_BANNER=0 hides the banner for launch).
const SHOW_BANNER = process.env.PREVIEW_BANNER === '1';

const ModalContext = createContext({ openModal: () => {}, startQuickLook: () => {}, audience: 'general', lang: 'en' });

// Any component can open the booking form: const { openModal } = useModal(); openModal({ packageType: 'quicklook' })
// startQuickLook() is the usual Quick Look button action: on a page with the search bar it scrolls to the bar and
// focuses it; on any other page it opens the form.
export const useModal = () => useContext(ModalContext);

const navLinkClass = 'text-sm font-medium text-mi-light/80 hover:text-white transition-colors';

function Nav({ current }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { startQuickLook, openModal, lang } = useModal();
    const de = lang === 'de';
    const links = de ? DE.nav : NAV;
    const callLabel = de ? DE.callLabel : STRATEGY_CALL.label;
    const callAction = de ? { onClick: () => { setMenuOpen(false); openModal({ packageType: 'call' }); } } : { href: STRATEGY_CALL.href };

    const quickLook = () => {
        setMenuOpen(false);
        startQuickLook();
    };
    const active = (href) => current === href;

    return (
        <nav aria-label="Main" className="sticky top-0 z-40 bg-mi-dark1/95 backdrop-blur-md border-b border-mi-dark2">
            <Container className="flex justify-between items-center py-2">
                <a href={de ? '/de' : '/'} className="flex items-center" aria-label={de ? 'Mekong Intelligence, Startseite' : 'Mekong Intelligence, home'}>
                    <img src="/image/logo.webp" alt="Mekong Intelligence" width="199" height="256" className="h-14 w-auto object-contain" />
                </a>

                <div className="hidden lg:flex items-center gap-6">
                    {links.map((link) => (
                        <a key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined}
                            className={`${navLinkClass} ${active(link.href) ? 'text-white border-b-2 border-mi-cyan pb-0.5' : ''}`}>{link.label}</a>
                    ))}
                    {de && <a href={DE.language.href} lang="en" hrefLang="en" aria-label={DE.language.aria} className={navLinkClass}>{DE.language.label}</a>}
                    <div className="flex items-center gap-3">
                        <Button {...callAction} variant="outline" className="py-2 px-4 text-sm whitespace-nowrap">{callLabel}</Button>
                        <Button variant="primary" className="py-2 px-4 text-sm whitespace-nowrap" onClick={quickLook}>{de ? DE.quickLookNav : 'Free Quick Look'}</Button>
                    </div>
                </div>

                <button className="lg:hidden text-white p-2" aria-label={de ? 'Menü umschalten' : 'Toggle menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
            </Container>

            {menuOpen && (
                <div id="mobile-menu" className="lg:hidden absolute top-full left-0 w-full bg-mi-dark1 border-b border-mi-dark2 p-6 flex flex-col gap-2 shadow-xl">
                    {links.map((link) => (
                        <a key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined} onClick={() => setMenuOpen(false)} className={`py-3 ${active(link.href) ? 'text-white font-semibold' : 'text-mi-light'}`}>{link.label}</a>
                    ))}
                    {de && <a href={DE.language.href} lang="en" hrefLang="en" aria-label={DE.language.aria} className="py-3 text-mi-light">{DE.language.label}</a>}
                    <div className="flex flex-col gap-3 pt-2">
                        <Button {...callAction} variant="outline">{callLabel}</Button>
                        <Button variant="primary" onClick={quickLook}>{de ? DE.quickLookNav : 'Free Quick Look'}</Button>
                    </div>
                </div>
            )}
        </nav>
    );
}

function FooterDe() {
    const { startQuickLook, openModal } = useModal();
    const linkClass = 'text-mi-light/80 hover:text-white transition-colors';
    const f = DE.footer;
    return (
        <footer className="bg-mi-dark1 border-t border-mi-dark2">
            <section className="py-12 md:py-16 text-center">
                <Container>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">{f.headline}</h2>
                    <p className="text-mi-light/80 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">{f.body}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={startQuickLook} className="px-8 md:px-10 py-3 md:py-4 text-base md:text-lg">{DE.hero.button}</Button>
                        <Button variant="outline" onClick={() => openModal({ packageType: 'call' })} className="px-8 md:px-10 py-3 md:py-4 text-base md:text-lg">{DE.callLabel}</Button>
                    </div>
                </Container>
            </section>

            <div className="border-t border-mi-dark2 py-10 md:py-12">
                <Container className="grid grid-cols-2 gap-8 md:gap-10 md:grid-cols-4 text-sm">
                    <div className="col-span-2">
                        <img src="/image/logo.webp" alt="Mekong Intelligence" width="199" height="256" loading="lazy" className="h-14 md:h-16 w-auto mb-3 md:mb-4" />
                        <p className="text-mi-light/80 max-w-sm">{DE.tagline} {f.about}</p>
                        <p className="mt-3 text-mi-light/70">{f.publicOnly}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-3">{f.explore}</h3>
                        <ul className="space-y-2">
                            <li><a className={linkClass} href="/de#leistungen">{DE.nav[1].label}</a></li>
                            <li><a className={linkClass} href="/de#fragen">{DE.nav[2].label}</a></li>
                            <li><a className={linkClass} href="/international" lang="en" hrefLang="en">{f.english}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-3">{f.company}</h3>
                        <ul className="space-y-2">
                            <li><a className={linkClass} href={SITE.telegramUrl} target="_blank" rel="noreferrer">Telegram</a></li>
                            <li><a className={linkClass} href="/datenschutz">{f.privacy}</a></li>
                            <li><a className={linkClass} href="/impressum">{f.imprint}</a></li>
                        </ul>
                    </div>
                </Container>
                <Container className="mt-8 md:mt-10 text-mi-light/70 text-sm">
                    <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Mekong Intelligence. {f.rights} {SITE.location}</p>
                    <CookieSettingsLink className="mt-2 underline hover:text-white" label={f.cookies} />
                </Container>
            </div>
        </footer>
    );
}

function Footer() {
    const { startQuickLook, lang } = useModal();
    if (lang === 'de') return <FooterDe />;
    const linkClass = 'text-mi-light/80 hover:text-white transition-colors';
    return (
        <footer className="bg-mi-dark1 border-t border-mi-dark2">
            <section className="py-12 md:py-16 text-center">
                <Container>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">Every engagement starts with the Free Quick Look.</h2>
                    <p className="text-mi-light/80 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
                        We show you where you are Found, Trusted and Reached, and where to focus first. From there, you decide how deep you want to go.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={startQuickLook} className="px-8 md:px-10 py-3 md:py-4 text-base md:text-lg">{QUICK_LOOK.cta}</Button>
                        <Button href={STRATEGY_CALL.href} variant="outline" className="px-8 md:px-10 py-3 md:py-4 text-base md:text-lg">{STRATEGY_CALL.label}</Button>
                    </div>
                </Container>
            </section>

            <div className="border-t border-mi-dark2 py-10 md:py-12">
                <Container className="grid grid-cols-2 gap-8 md:gap-10 md:grid-cols-4 text-sm">
                    <div className="col-span-2">
                        <img src="/image/logo.webp" alt="Mekong Intelligence" width="199" height="256" loading="lazy" className="h-14 md:h-16 w-auto mb-3 md:mb-4" />
                        <p className="text-mi-light/80 max-w-sm">{SITE.tagline} Brand and market intelligence for businesses in Cambodia and Vietnam. Based in {SITE.location}.</p>
                        <p className="mt-3 text-mi-light/70">The Quick Look uses public information only.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-3">Explore</h3>
                        <ul className="space-y-2">
                            <li><a className={linkClass} href="/">Local businesses</a></li>
                            <li><a className={linkClass} href="/international">International</a></li>
                            <li><a className={linkClass} href="/resources">Resources</a></li>
                            <li><a className={linkClass} href="/services">Services</a></li>
                            <li><a className={linkClass} href="/sample-quick-look">Sample Quick Look</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-3">Company</h3>
                        <ul className="space-y-2">
                            <li><a className={linkClass} href="/team">Team</a></li>
                            <li><a className={linkClass} href="/contact">Contact Us</a></li>
                            <li><a className={linkClass} href={SITE.telegramUrl} target="_blank" rel="noreferrer">Telegram</a></li>
                            <li><a className={linkClass} href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </Container>
                <Container className="mt-8 md:mt-10 text-mi-light/70 text-sm">
                    <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Mekong Intelligence. All rights reserved. {SITE.location}</p>
                    <CookieSettingsLink className="mt-2 underline hover:text-white" />
                </Container>
            </div>
        </footer>
    );
}

// Holds the booking form's state. It wraps every page (see pages/index.jsx), so any component on the page,
// including the page component itself, can call useModal().openModal(...). `audience` tags the leads.
export function ModalProvider({ audience = 'general', lang = 'en', children }) {
    const [request, setRequest] = useState(null);
    const openModal = useCallback((req) => setRequest(req), []);
    const close = useCallback(() => setRequest(null), []);
    const startQuickLook = useCallback(() => {
        const input = typeof document !== 'undefined' && document.getElementById('ql-target');
        if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.focus({ preventScroll: true });
        } else {
            setRequest({ packageType: 'quicklook' });
        }
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, startQuickLook, audience, lang }}>
            {children}
            {request && <BookingModal request={request} audience={audience} onClose={close} />}
        </ModalContext.Provider>
    );
}

export default function Layout({ current, children }) {
    const { lang } = useModal();
    return (
        <div className="min-h-screen flex flex-col selection:bg-mi-cyan/30 selection:text-white">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-mi-cyan focus:text-mi-dark1 focus:px-4 focus:py-2 focus:rounded">{lang === 'de' ? 'Zum Inhalt springen' : 'Skip to content'}</a>
            {SHOW_BANNER && (
                <p className="bg-mi-cyan text-mi-dark1 text-center text-sm font-semibold px-4 py-2">{lang === 'de' ? DE.banner : SITE.previewBanner}</p>
            )}
            <Nav current={current} />
            <main id="main" className="flex-1">{children}</main>
            <Footer />
            <Consent />
        </div>
    );
}

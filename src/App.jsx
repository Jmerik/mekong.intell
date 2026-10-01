import { useState, useEffect, useRef } from 'react';
import { PACKAGES, GOALS } from '../shared/packages.js';

const TELEGRAM_URL = 'https://t.me/mekongintelligence';
const LINKEDIN_URL = 'https://www.linkedin.com/in/vosumtey-seng/';

// --- Icons ---
const Icon = ({ path, size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
        {path}
    </svg>
);

const Icons = {
    Menu: (props) => <Icon {...props} path={<><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>} />,
    X: (props) => <Icon {...props} path={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} />,
    ArrowRight: (props) => <Icon {...props} path={<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>} />,
    CheckCircle2: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>} />,
    Users: (props) => <Icon {...props} path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
    Target: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
    Database: (props) => <Icon {...props} path={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></>} />,
    TrendingUp: (props) => <Icon {...props} path={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>} />,
    Zap: (props) => <Icon {...props} path={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>} />,
    Linkedin: (props) => <Icon {...props} path={<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></>} />,
    Send: (props) => <Icon {...props} path={<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>} />,
    Radar: (props) => <Icon {...props} path={<><path d="M19.07 4.93A10 10 0 0 0 2 12h2a8 8 0 0 1 13.66-5.66l1.41-1.41Z"/><path d="M2 12a10 10 0 0 0 17.07 7.07l-1.41-1.41A8 8 0 0 1 4 12H2Z"/><path d="m12 12 5 10"/><circle cx="12" cy="12" r="1"/></>} />,
    FileText: (props) => <Icon {...props} path={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></>} />
};

// --- Components ---
const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false }) => {
    const baseStyle = 'px-6 py-3 rounded-lg font-bold transition-all duration-300 transform flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan';
    const variants = {
        primary: 'bg-gradient-to-r from-mi-blue to-mi-cyan hover:opacity-90 text-white shadow-lg shadow-mi-cyan/20',
        secondary: 'bg-mi-dark2 border border-mi-blue/40 hover:border-mi-cyan text-mi-light hover:text-white',
        outline: 'border-2 border-mi-cyan text-mi-cyan hover:bg-mi-cyan/10',
        ghost: 'text-mi-light/70 hover:text-white'
    };

    const stateStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 cursor-pointer';

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${stateStyle} ${className}`}>
            {children}
        </button>
    );
};

const SectionHeader = ({ title, subtitle, centered = true }) => (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-mi-light mb-4">
            {title}
        </h2>
        <div className={`h-1 w-24 bg-mi-cyan mb-6 ${centered ? 'mx-auto' : ''}`}></div>
        <p className="text-mi-light/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
        </p>
    </div>
);

const inputClass = 'w-full bg-mi-dark1 border border-mi-blue/30 rounded-lg p-3 text-white placeholder:text-mi-light/50 focus:border-mi-cyan focus:outline-none focus:ring-2 focus:ring-mi-cyan/40 transition-colors';
const labelClass = 'block text-mi-light/80 text-xs uppercase font-bold mb-2';

const FieldError = ({ id, message }) => (message ? <p id={id} className="mt-1 text-xs text-red-300">{message}</p> : null);

const EMPTY_FORM = { name: '', email: '', telegram: '', phone: '', website: '', goal: '', company_fax: '' };

// Mounted only while open, so every opening starts on a fresh, empty form.
const BookingModal = ({ onClose, packageType }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const title = (PACKAGES[packageType] || PACKAGES.call).modalTitle;
    const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

    // Focus management, Escape to close, keep Tab inside the dialog, lock background scroll.
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const dialog = dialogRef.current;
        const focusables = () => dialog.querySelectorAll('button, [href], input:not([tabindex="-1"]), select, textarea');
        const first = focusables()[1] || focusables()[0];
        if (first) first.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCloseRef.current();
            } else if (e.key === 'Tab') {
                const items = focusables();
                const firstItem = items[0];
                const lastItem = items[items.length - 1];
                if (e.shiftKey && document.activeElement === firstItem) {
                    e.preventDefault();
                    lastItem.focus();
                } else if (!e.shiftKey && document.activeElement === lastItem) {
                    e.preventDefault();
                    firstItem.focus();
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.telegram.trim() && !formData.phone.trim()) {
            setErrors({ contact: 'Please add a Telegram username or a phone number so we can reach you.' });
            return;
        }
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, packageType })
            });
            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                if (window.gtag) window.gtag('event', 'generate_lead', { package_type: packageType });
                setStep(2);
            } else if (data.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ form: data.message || 'There was an issue processing your request. Please try again.' });
            }
        } catch (error) {
            setErrors({ form: 'Network error. Please check your connection, or message us directly on Telegram.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mi-dark1/90 backdrop-blur-sm overflow-y-auto" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" className="bg-mi-dark2 border border-mi-blue/30 rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in-up my-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-mi-light/70 hover:text-white transition-colors" aria-label="Close booking form">
                    <Icons.X size={24} />
                </button>

                <div className="p-8">
                    {step === 1 ? (
                        <>
                            <h3 id="booking-title" className="text-2xl font-bold text-white mb-2 pr-8">{title}</h3>
                            <p className="text-mi-light/80 mb-6 text-sm">
                                Fill out the details below. We typically respond within 2 hours on Telegram, or by phone or email if you prefer.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Honeypot for bots: hidden from people and screen readers. */}
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="company_fax">Leave this field empty</label>
                                    <input id="company_fax" name="company_fax" type="text" tabIndex={-1} autoComplete="off" value={formData.company_fax} onChange={update('company_fax')} />
                                </div>

                                <div>
                                    <label htmlFor="name" className={labelClass}>Name</label>
                                    <input id="name" name="name" required maxLength={100} type="text" autoComplete="name" placeholder="Your full name"
                                        className={inputClass} aria-invalid={!!errors.name} aria-describedby={describedBy('name')}
                                        value={formData.name} onChange={update('name')} />
                                    <FieldError id="name-error" message={errors.name} />
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClass}>Email</label>
                                    <input id="email" name="email" required maxLength={254} type="email" autoComplete="email" placeholder="you@company.com"
                                        className={inputClass} aria-invalid={!!errors.email} aria-describedby={describedBy('email')}
                                        value={formData.email} onChange={update('email')} />
                                    <FieldError id="email-error" message={errors.email} />
                                </div>

                                <fieldset aria-describedby="contact-hint">
                                    <legend className="sr-only">How should we reach you?</legend>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="telegram" className={labelClass}>Telegram username</label>
                                            <input id="telegram" name="telegram" maxLength={64} type="text" autoComplete="off" placeholder="@username"
                                                className={inputClass} aria-invalid={!!(errors.telegram || errors.contact)} aria-describedby={describedBy('telegram')}
                                                value={formData.telegram} onChange={update('telegram')} />
                                            <FieldError id="telegram-error" message={errors.telegram} />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className={labelClass}>Phone / WhatsApp</label>
                                            <input id="phone" name="phone" maxLength={32} type="tel" autoComplete="tel" placeholder="+855 ..."
                                                className={inputClass} aria-invalid={!!(errors.phone || errors.contact)} aria-describedby={describedBy('phone')}
                                                value={formData.phone} onChange={update('phone')} />
                                            <FieldError id="phone-error" message={errors.phone} />
                                        </div>
                                    </div>
                                    <p id="contact-hint" className={`mt-2 text-xs ${errors.contact ? 'text-red-300' : 'text-mi-light/70'}`}>
                                        {errors.contact || 'Telegram or phone. One of the two is enough.'}
                                    </p>
                                </fieldset>

                                <div>
                                    <label htmlFor="website" className={labelClass}>Company website / Facebook page <span className="normal-case font-normal">(optional)</span></label>
                                    <input id="website" name="website" maxLength={300} type="text" autoComplete="url" placeholder="https://..."
                                        className={inputClass} aria-invalid={!!errors.website} aria-describedby={describedBy('website')}
                                        value={formData.website} onChange={update('website')} />
                                    <FieldError id="website-error" message={errors.website} />
                                </div>

                                <div>
                                    <label htmlFor="goal" className={labelClass}>Primary goal <span className="normal-case font-normal">(optional)</span></label>
                                    <select id="goal" name="goal" className={inputClass} value={formData.goal} onChange={update('goal')}>
                                        <option value="">Select an objective...</option>
                                        {Object.entries(GOALS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                </div>

                                {errors.form && (
                                    <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                        {errors.form} <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="underline">Open Telegram</a>
                                    </p>
                                )}

                                <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Confirm Booking Request'}
                                </Button>
                                <p className="text-xs text-mi-light/70 text-center">
                                    We only use these details to reply to you. See our <a href="/privacy" className="underline hover:text-white">privacy policy</a>.
                                </p>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-12" role="status">
                            <div className="w-16 h-16 bg-mi-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 text-mi-cyan">
                                <Icons.CheckCircle2 size={32} />
                            </div>
                            <h3 id="booking-title" className="text-2xl font-bold text-white mb-4">Request Received</h3>
                            <p className="text-mi-light/80 mb-8">
                                Thanks! We've received your request: <span className="text-mi-cyan font-bold">{title}</span>.
                                We'll be in touch shortly.
                            </p>
                            <Button variant="secondary" onClick={onClose} className="mx-auto">Close</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NAV_LINKS = [
    { id: 'problem', label: 'Why Us' },
    { id: 'services', label: 'Services' },
    { id: 'results', label: 'Results' }
];

const App = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openBooking = (pkg) => {
        setMobileMenuOpen(false);
        setSelectedPackage(pkg);
    };
    const closeBooking = () => setSelectedPackage(null);

    const navLinkClass = 'text-sm font-medium text-mi-light/80 hover:text-white transition-colors';

    return (
        <div className="min-h-screen selection:bg-mi-cyan/30 selection:text-white">

            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-mi-cyan focus:text-mi-dark1 focus:px-4 focus:py-2 focus:rounded">Skip to content</a>

            {/* Navigation */}
            <nav aria-label="Main" className={`fixed w-full z-40 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-mi-dark1/95 backdrop-blur-md shadow-lg border-b border-mi-dark2 py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <a href="#top" className="flex items-center" aria-label="Mekong Intelligence, back to top">
                        <img
                            src="/image/logo.webp"
                            alt="Mekong Intelligence"
                            width="199"
                            height="256"
                            className={`w-auto transition-all duration-300 object-contain ${scrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'}`}
                        />
                    </a>

                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <a key={link.id} href={`#${link.id}`} className={navLinkClass}>{link.label}</a>
                        ))}
                        <Button variant="primary" className="py-2 px-4 text-sm" onClick={() => openBooking('call')}>
                            Book Strategy Call
                        </Button>
                    </div>

                    <button className="md:hidden text-white p-2" aria-label="Toggle menu" aria-expanded={mobileMenuOpen} aria-controls="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-mi-dark1 border-b border-mi-dark2 p-6 flex flex-col gap-4 shadow-xl">
                        {NAV_LINKS.map((link) => (
                            <a key={link.id} href={`#${link.id}`} onClick={() => setMobileMenuOpen(false)} className="text-left text-mi-light py-2">{link.label}</a>
                        ))}
                        <Button variant="primary" onClick={() => openBooking('call')}>Book Strategy Call</Button>
                    </div>
                )}
            </nav>

            <main id="main">
                {/* Hero Section */}
                <header id="top" className="relative pt-36 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-mi-dark1">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mi-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mi-cyan/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-block px-4 py-1 bg-mi-dark2 border border-mi-blue/30 rounded-full text-mi-cyan text-sm font-semibold tracking-wider mb-6 animate-fade-in-up shadow-sm">
                                THE INTELLIGENCE-FIRST GROWTH SYSTEM
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-8 text-white">
                                Southeast Asia's Brand & <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-mi-cyan via-mi-blue to-mi-light">
                                    Market Intelligence
                                </span> <br />
                                Firm.
                            </h1>
                            <p className="text-xl text-mi-light/90 mb-4 max-w-3xl mx-auto">
                                We don't guess. We diagnose. Every strategy we build starts with real competitor data, AI search visibility, and a clear view of where you're bleeding money.
                            </p>
                            <p className="text-lg text-mi-light/80 mb-10 max-w-2xl mx-auto">
                                Most businesses can't say which part of their ad spend is actually working. Rooted in Phnom Penh, we find every leak in your funnel within 72 hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={() => openBooking('audit')} className="text-lg px-8 py-4">
                                    Start with The Audit <Icons.ArrowRight size={20} />
                                </Button>
                                <Button variant="secondary" onClick={() => openBooking('call')} className="text-lg px-8 py-4">
                                    Book a Strategy Call
                                </Button>
                            </div>

                            <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="flex flex-col-reverse items-center">
                                    <dt className="text-sm text-mi-light/80">Audit Delivery</dt>
                                    <dd className="text-3xl font-bold text-white">72h</dd>
                                </div>
                                <div className="flex flex-col-reverse items-center">
                                    <dt className="text-sm text-mi-light/80">Avg. ROI Uplift<a href="#results-note" className="text-mi-cyan" aria-label="See note on results">*</a></dt>
                                    <dd className="text-3xl font-bold text-white">49%</dd>
                                </div>
                                <div className="flex flex-col-reverse items-center">
                                    <dt className="text-sm text-mi-light/80">Audience Growth (EuroCham)</dt>
                                    <dd className="text-3xl font-bold text-white">20k+</dd>
                                </div>
                                <div className="flex flex-col-reverse items-center">
                                    <dt className="text-sm text-mi-light/80">Founder-Led Engagements</dt>
                                    <dd className="text-3xl font-bold text-white">1:1</dd>
                                </div>
                            </dl>
                            <p id="results-note" className="mt-6 text-xs text-mi-light/70">
                                *Average ROI uplift across past client engagements. Individual results vary.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Problem Section */}
                <section id="problem" className="py-20 bg-mi-dark2 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    The "Guesswork Tax" is <span className="text-red-400">killing your margin</span>.
                                </h2>
                                <p className="text-mi-light/90 text-lg">
                                    Agencies love to show you "Likes", "Shares", and "Reach". These numbers look good on a report, but they do not pay your staff salaries.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                                            <Icons.X size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-red-400">Vanity Metrics</h3>
                                            <p className="text-sm text-mi-light/80">Likes & Shares that don't convert to revenue.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center" aria-hidden="true">
                                        <div className="h-8 w-0.5 bg-mi-blue/30"></div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-mi-cyan/10 border border-mi-cyan/30 rounded-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-mi-cyan/5 motion-safe:animate-pulse"></div>
                                        <div className="p-2 bg-mi-cyan/20 rounded-lg text-mi-cyan relative z-10">
                                            <Icons.TrendingUp size={24} />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-mi-cyan">Growth Intelligence</h3>
                                            <p className="text-sm text-mi-light/80">Focus on CPA, LTV, and ROI. Connect content to sales.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <figure className="relative">
                                <div className="bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-6 shadow-2xl relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-white">Campaign Attribution</h3>
                                        <span className="text-xs bg-mi-blue/20 text-mi-cyan px-2 py-1 rounded border border-mi-cyan/20 whitespace-nowrap">Example report</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-mi-light/80">Telegram Leads</span>
                                                <span className="text-white font-mono">1,204</span>
                                            </div>
                                            <div className="h-2 bg-mi-dark2 rounded-full overflow-hidden">
                                                <div className="h-full bg-mi-cyan w-[75%]"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-mi-light/80">Cost Per Acquisition</span>
                                                <span className="text-white font-mono">$4.20</span>
                                            </div>
                                            <div className="h-2 bg-mi-dark2 rounded-full overflow-hidden">
                                                <div className="h-full bg-mi-blue w-[45%]"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-mi-light/80">Revenue Generated</span>
                                                <span className="text-green-400 font-mono font-bold">$42,500</span>
                                            </div>
                                            <div className="h-2 bg-mi-dark2 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-400 w-[90%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-mi-dark2 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-mi-dark2 border border-mi-blue/30 overflow-hidden flex items-center justify-center text-xs text-mi-light" aria-hidden="true">
                                                VS
                                            </div>
                                            <div className="text-xs">
                                                <div className="text-white font-bold">Weekly Strategy Update</div>
                                                <div className="text-mi-light/70">From your strategist</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-mi-cyan font-bold">
                                            +12.4% vs last week
                                        </div>
                                    </div>
                                </div>
                                <figcaption className="relative z-10 mt-3 text-xs text-mi-light/70 text-center">
                                    Illustrative example of the attribution reporting you receive. Figures are not from a real client.
                                </figcaption>
                                <div className="absolute -top-10 -right-10 w-full h-full bg-gradient-to-br from-mi-cyan/20 to-mi-blue/20 rounded-2xl blur-3xl -z-10" aria-hidden="true"></div>
                            </figure>
                        </div>
                    </div>
                </section>

                {/* What Makes Us Different */}
                <section className="py-20 bg-mi-dark1">
                    <div className="container mx-auto px-6">
                        <SectionHeader
                            title="What Makes Us Different"
                            subtitle="We're not an agency. We don't sell likes, pretty content, or vague 'brand awareness.' We sell one thing: clarity. What's broken, what your competitors are doing, and what to fix first."
                        />

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-mi-dark2 p-8 rounded-2xl border border-mi-blue/20 hover:border-mi-cyan/50 transition-all duration-300 group shadow-lg">
                                <div className="w-14 h-14 bg-mi-dark1 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-mi-blue/10">
                                    <Icons.Database className="text-mi-cyan" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Audit Before We Build</h3>
                                <p className="text-mi-light/80 text-sm leading-relaxed">
                                    We start with data, not assumptions. Before any strategy is made, we audit your digital presence, your competitors, and how AI search sees your brand.
                                </p>
                            </div>

                            <div className="bg-mi-dark2 p-8 rounded-2xl border border-mi-blue/20 hover:border-mi-cyan/50 transition-all duration-300 group shadow-lg">
                                <div className="w-14 h-14 bg-mi-dark1 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-mi-blue/10">
                                    <Icons.Users className="text-mi-cyan" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Intelligence, Not Execution</h3>
                                <p className="text-mi-light/80 text-sm leading-relaxed">
                                    We build the system. You or your team execute it. No bloated agency retainers. No junior staff doing the thinking.
                                </p>
                            </div>

                            <div className="bg-mi-dark2 p-8 rounded-2xl border border-mi-blue/20 hover:border-mi-cyan/50 transition-all duration-300 group shadow-lg">
                                <div className="w-14 h-14 bg-mi-dark1 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-mi-blue/10">
                                    <Icons.Radar className="text-mi-cyan" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">AI-Powered, Cambodia-Rooted</h3>
                                <p className="text-mi-light/80 text-sm leading-relaxed">
                                    AI processes the noise. We filter what actually matters for Cambodia and the wider Southeast Asian market.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services / Packages */}
                <section id="services" className="py-20 bg-mi-dark2">
                    <div className="w-full max-w-[1600px] mx-auto px-6">
                        <SectionHeader
                            title="Our Services"
                            subtitle="Every engagement starts with The Audit. From there, we build the system, then keep you ahead with ongoing intelligence. Choose the level that fits."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-9">

                            {/* Tier 0 */}
                            <div className="bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-6 flex flex-col hover:border-mi-cyan transition-colors relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mi-cyan to-mi-blue"></div>
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-mi-cyan uppercase tracking-widest">Phase 1</span>
                                    <h3 className="text-2xl font-bold text-white mt-1">{PACKAGES.audit.name}</h3>
                                    <div className="mt-2 h-10"></div>
                                </div>
                                <ul className="space-y-3 mb-6 flex-1 text-sm text-mi-light/90">
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> 360° Digital Presence Audit</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Analytics & Channel Health Check</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Traditional Search (SEO/SEM) Review</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> AI Search (GEO/AEO) Visibility Scan</li>
                                </ul>
                                <div className="mb-6 pt-4 border-t border-mi-dark2">
                                    <p className="text-xs font-bold text-white uppercase mb-2">Deliverables:</p>
                                    <p className="text-xs text-mi-light/80">- Expert Video Walkthrough</p>
                                    <p className="text-xs text-mi-light/80">- Comprehensive Audit Report + Tactical Action Plan</p>
                                </div>
                                <Button onClick={() => openBooking('audit')} className="w-full">Book The Audit</Button>
                            </div>

                            {/* Tier 1 */}
                            <div className="bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-6 flex flex-col hover:border-mi-cyan transition-colors relative shadow-xl">
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-mi-light/70 uppercase tracking-widest">Phase 2</span>
                                    <h3 className="text-2xl font-bold text-white mt-1">{PACKAGES.sprint.name}</h3>
                                    <div className="mt-2 h-10 flex items-start">
                                        <span className="text-xs text-mi-cyan font-bold border border-mi-cyan/30 bg-mi-cyan/10 px-2 py-1 rounded inline-block">Timeline: 3 Weeks</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-6 flex-1 text-sm text-mi-light/90">
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Competitive Intelligence & Market Positioning</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> 90-Day Authority Engine</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> The Intelligence Stack</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Strategic Growth Roadmap</li>
                                </ul>
                                <div className="mb-6 pt-4 border-t border-mi-dark2">
                                    <p className="text-xs font-bold text-white uppercase mb-2">Deliverables:</p>
                                    <p className="text-xs text-mi-light/80">- Market Gap Report & Brand Authority Playbook</p>
                                    <p className="text-xs text-mi-light/80">- Growth Roadmap & Tech Stack</p>
                                </div>
                                <Button variant="outline" onClick={() => openBooking('sprint')} className="w-full">Book The Strategy Sprint</Button>
                            </div>

                            {/* Tier 2 */}
                            <div className="bg-mi-dark1 border-2 border-mi-cyan/80 rounded-2xl p-6 flex flex-col shadow-2xl shadow-mi-cyan/20 relative xl:scale-105 z-10">
                                <div className="absolute top-0 right-0 bg-mi-cyan text-mi-dark1 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-mi-cyan uppercase tracking-widest">Phase 3</span>
                                    <h3 className="text-2xl font-bold text-white mt-1">{PACKAGES.retainer.name}</h3>
                                    <div className="mt-2 h-10"></div>
                                </div>
                                <ul className="space-y-3 mb-6 flex-1 text-sm text-mi-light">
                                    <li className="flex items-start gap-2"><Icons.Database size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Continuous Competitive Intelligence</li>
                                    <li className="flex items-start gap-2"><Icons.Database size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Monthly Strategy Optimization</li>
                                    <li className="flex items-start gap-2"><Icons.Database size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Priority Advisory & AI Updates</li>
                                    <li className="flex items-start gap-2"><Icons.Database size={16} className="text-mi-cyan shrink-0 mt-0.5" /> Performance Dashboard & Reporting</li>
                                </ul>
                                <div className="mb-6 pt-4 border-t border-mi-dark2">
                                    <p className="text-xs font-bold text-mi-cyan uppercase mb-2">Deliverables:</p>
                                    <p className="text-xs text-mi-light/80">- Monthly ROI & Growth Report</p>
                                    <p className="text-xs text-mi-light/80">- Live Performance Dashboard</p>
                                    <p className="text-xs text-mi-light/80">- Custom Content Frameworks</p>
                                    <p className="text-xs text-mi-light/80">- Monthly 1-on-1 Strategy Call</p>
                                </div>
                                <Button onClick={() => openBooking('retainer')} className="w-full">Start the Retainer</Button>
                            </div>

                            {/* Tier 3 */}
                            <div className="bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-6 flex flex-col hover:border-mi-cyan transition-colors relative shadow-xl">
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-mi-light/70 uppercase tracking-widest">Enterprise</span>
                                    <h3 className="text-2xl font-bold text-white mt-1">{PACKAGES.fullbuild.name}</h3>
                                    <p className="text-sm text-mi-light/80 mt-2 min-h-10">For new businesses or full rebrands. From visual identity to launch campaign.</p>
                                </div>
                                <p className="text-xs text-mi-cyan mb-4 font-bold">Everything in The Strategy Sprint, plus:</p>
                                <ul className="space-y-3 mb-8 flex-1 text-sm text-mi-light/90">
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-blue shrink-0 mt-0.5" /> Complete Visual Identity (logo, colors, fonts)</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-blue shrink-0 mt-0.5" /> Brand Guidelines Document & Website Strategy</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-blue shrink-0 mt-0.5" /> Launch Campaign Plan (30-60-90 days)</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-blue shrink-0 mt-0.5" /> Social Media Template Library</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-blue shrink-0 mt-0.5" /> Sales Materials & Pitch Deck</li>
                                    <li className="flex items-start gap-2"><Icons.CheckCircle2 size={16} className="text-mi-blue shrink-0 mt-0.5" /> 3-min Brand Story Video</li>
                                    <li className="flex items-start gap-2 font-bold text-white mt-4 pt-4 border-t border-mi-dark2"><Icons.Zap size={16} className="text-mi-cyan shrink-0 mt-0.5" /> 3 months Intelligence Retainer FREE</li>
                                </ul>
                                <Button variant="secondary" onClick={() => openBooking('fullbuild')} className="w-full">Schedule a Consultation</Button>
                            </div>

                        </div>

                        {/* Market Intelligence Add-on Card */}
                        <div className="mt-16 max-w-5xl mx-auto">
                            <div className="bg-[#2c394b] border-2 border-dashed border-mi-cyan/50 rounded-2xl p-8 relative shadow-2xl">
                                <div className="absolute top-4 right-4 bg-mi-cyan text-mi-dark1 text-[10px] font-black px-3 py-1 rounded tracking-tighter">ADD-ON</div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white pr-16">Market Intelligence Dashboard</h3>
                                    <p className="italic text-mi-light/80 text-sm mt-2">Know what's moving before your competitors do. Available as an add-on to your monthly subscription.</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-mi-cyan">
                                            <Icons.Radar size={20} />
                                            <h4 className="font-bold text-white text-sm">Pulse & Trends</h4>
                                        </div>
                                        <p className="text-xs text-mi-light/80 leading-relaxed"><strong className="text-white font-medium">Weekly Impact Brief:</strong> Critical shifts in algorithms, AI tools, and the economy.<br/><br/><strong className="text-white font-medium">Opportunity Alerts:</strong> Direct Telegram pings for high-growth market gaps.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-mi-cyan">
                                            <Icons.Target size={20} />
                                            <h4 className="font-bold text-white text-sm">Competitor Tracker</h4>
                                        </div>
                                        <p className="text-xs text-mi-light/80 leading-relaxed"><strong className="text-white font-medium">Bi-weekly Scans:</strong> Professional monitoring of your top 5 rivals. Spot pricing and messaging shifts before they cost you market share.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-mi-cyan">
                                            <Icons.FileText size={20} />
                                            <h4 className="font-bold text-white text-sm">AI Visibility (The Future)</h4>
                                        </div>
                                        <p className="text-xs text-mi-light/80 leading-relaxed"><strong className="text-white font-medium">Generative Engine Audit:</strong> We monitor if AI is recommending your brand as the top answer.</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-mi-dark1 flex justify-center">
                                    <Button variant="outline" onClick={() => openBooking('dashboard')} className="py-2 px-8 text-sm">
                                        Add the Dashboard
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Credibility / About */}
                <section id="results" className="py-20 bg-gradient-to-b from-mi-dark1 to-mi-dark2">
                    <div className="container mx-auto px-6">
                        <div className="bg-mi-dark2 rounded-3xl p-8 md:p-12 border border-mi-blue/30 flex flex-col md:flex-row gap-12 items-center shadow-2xl">
                            <div className="w-full md:w-1/3">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-mi-dark1">
                                    <img
                                        src="/image/vosumtey.webp"
                                        alt="Vosumtey SENG, Founder of Mekong Intelligence"
                                        width="800"
                                        height="800"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <div className="inline-block px-3 py-1 bg-mi-blue/10 border border-mi-blue/30 rounded-full text-mi-cyan text-xs font-bold tracking-wider mb-4">
                                    THE ARCHITECT
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Unfair Market Advantage</h2>
                                <p className="text-xl text-mi-cyan font-medium mb-6">Vosumtey SENG | Founder & Chief Strategist</p>

                                <p className="text-mi-light leading-relaxed mb-6">
                                    Vosumtey has built market positions for high-stakes corporate organisations and fast-moving Web3 ecosystems. She doesn't just manage campaigns; she designs the strategy behind them, turning competitor data and market signals into decisions that drive revenue. When you work with Mekong Intelligence, you aren't handed to a junior account manager. <strong className="text-white">You work with her directly.</strong>
                                </p>

                                <div className="grid grid-cols-1 gap-6 mb-8">
                                    <div className="p-5 bg-mi-dark1/80 rounded-xl border border-mi-blue/30 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-mi-cyan"></div>
                                        <h3 className="font-bold text-white mb-2">B2B Market Dominance</h3>
                                        <p className="text-sm text-mi-light/80">Led <strong className="text-white">EuroCham's</strong> digital authority, driving a targeted 20,000+ elite professional audience growth with no ad spend.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center mt-2">
                                    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="Vosumtey SENG on LinkedIn" className="p-3 bg-mi-dark1 border border-mi-cyan/50 rounded-lg hover:bg-mi-cyan hover:text-mi-dark1 transition-all text-mi-cyan shadow-[0_0_15px_rgba(80,198,233,0.2)]">
                                        <Icons.Linkedin size={24} />
                                    </a>
                                    <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Mekong Intelligence on Telegram" className="p-3 bg-mi-dark1 border border-mi-cyan/50 rounded-lg hover:bg-mi-cyan hover:text-mi-dark1 transition-all text-mi-cyan shadow-[0_0_15px_rgba(80,198,233,0.2)]">
                                        <Icons.Send size={24} />
                                    </a>
                                    <span className="text-sm text-mi-light/80 ml-2 font-medium italic border-l border-mi-dark1 pl-4">Work directly with the founder.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-mi-dark1 py-16 border-t border-mi-dark2">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Every engagement starts with The Audit.</h2>
                    <p className="text-mi-light/80 mb-8 max-w-2xl mx-auto">72 hours. We show you exactly where you're losing money and what your competitors are doing instead. From there, you decide how deep you want to go.</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button onClick={() => openBooking('audit')} className="px-10 py-4 text-lg">
                            Start with The Audit
                        </Button>
                        <Button variant="outline" onClick={() => openBooking('call')} className="px-10 py-4 text-lg">
                            Book a Strategy Call
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-mi-light/80">
                        Prefer to chat first?{' '}
                        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-mi-cyan underline hover:text-white">
                            <Icons.Send size={14} /> Message us on Telegram
                        </a>
                    </p>

                    <div className="mt-16 text-mi-light/70 text-sm">
                        <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Mekong Intelligence. All rights reserved.</p>
                        <p className="mt-2">Phnom Penh, Cambodia · Serving Southeast Asia</p>
                        <p className="mt-2"><a href="/privacy" className="underline hover:text-white">Privacy Policy</a></p>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            {selectedPackage && <BookingModal onClose={closeBooking} packageType={selectedPackage} />}

        </div>
    );
};

export default App;

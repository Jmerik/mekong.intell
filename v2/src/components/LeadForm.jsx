import { useState } from 'react';
import { PACKAGES, BOTTLENECKS } from '../../shared/packages.js';
import { SITE, QUICK_LOOK } from '../content/site.js';
import { Button } from './ui.jsx';
import { useModal } from './Layout.jsx';
import { FORM_TEXT } from '../content/de.js';

const inputClass = 'w-full bg-mi-dark1 border border-mi-blue/30 rounded-lg p-3 text-white placeholder:text-mi-light/50 focus:border-mi-cyan focus:outline-none focus:ring-2 focus:ring-mi-cyan/40 transition-colors';
const labelClass = 'block text-mi-light/80 text-xs uppercase font-bold mb-2';

const FieldError = ({ id, message }) => (message ? <p id={id} className="mt-1 text-xs text-red-300">{message}</p> : null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_RE = /^@?[A-Za-z0-9_]{5,32}$/;

// One form for every request. There are three layouts:
//   quicklook  website or company name + email. Name, Telegram and phone sit in an optional section.
//   contact    the /contact inquiry form: name, one "business email or Telegram handle" field, company or website,
//              primary bottleneck, message. `interest` carries the service the visitor came from.
//   others     name + email, with Telegram, phone and a message optional (used by the booking dialog).
export default function LeadForm({ packageType, audience = 'general', focus = '', interest = '', initialWebsite = '', onSuccess, idPrefix = 'lead' }) {
    const { lang } = useModal();
    const T = FORM_TEXT[lang] || null;   // null = English (the strings below); German strings live in content/de.js
    const optional = <span className="normal-case font-normal">{T ? T.optional : ' (optional)'}</span>;
    const isQuickLook = packageType === 'quicklook';
    const isContact = packageType === 'contact';
    const [form, setForm] = useState({
        website: initialWebsite, name: '', email: '', telegram: '', phone: '', message: '', bottleneck: '', handle: '', company_fax: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const id = (field) => `${idPrefix}-${field}`;
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
    const describedBy = (field) => (errors[field] ? `${id(field)}-error` : undefined);

    const submit = async (e) => {
        e.preventDefault();
        const payload = { ...form, audience, packageType, focus, interest };

        if (isContact) {
            // One field for "business email or Telegram handle": decide which it is.
            const value = form.handle.trim();
            if (EMAIL_RE.test(value)) { payload.email = value; payload.telegram = ''; }
            else if (TELEGRAM_RE.test(value)) { payload.telegram = value; payload.email = ''; }
            else {
                setErrors({ contact: 'Please enter a business email (name@company.com) or a Telegram username (@yourname).' });
                return;
            }
        }
        delete payload.handle;

        setErrors({});
        setSubmitting(true);
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                if (window.gtag) window.gtag('event', 'generate_lead', { package_type: packageType, audience, interest });
                onSuccess({ email: (payload.email || '').trim(), website: form.website.trim() });
            } else if (data.errors) {
                // The server's messages are English, so German visitors get the German text for each field.
                setErrors(T ? Object.fromEntries(Object.keys(data.errors).map((key) => [key, T.errors[key] || T.generic])) : data.errors);
            } else {
                setErrors({ form: T ? T.generic : (data.message || 'There was an issue processing your request. Please try again.') });
            }
        } catch (error) {
            setErrors({ form: T ? T.network : 'Network error. Please check your connection, or message us directly on Telegram.' });
        } finally {
            setSubmitting(false);
        }
    };

    const nameField = (
        <div>
            <label htmlFor={id('name')} className={labelClass}>{isContact ? 'Full Name' : (T ? T.name : 'Name')}{isQuickLook && optional}</label>
            <input id={id('name')} name="name" required={!isQuickLook} maxLength={100} type="text" autoComplete="name" placeholder={T ? T.namePlaceholder : 'Your full name'}
                className={inputClass} aria-invalid={!!errors.name} aria-describedby={describedBy('name')}
                value={form.name} onChange={update('name')} />
            <FieldError id={`${id('name')}-error`} message={errors.name} />
        </div>
    );

    const contactFields = (
        <fieldset aria-describedby={id('contact-hint')}>
            <legend className="sr-only">{T ? T.legend : 'Faster ways to reach you'}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor={id('telegram')} className={labelClass}>{T ? T.telegram : 'Telegram username'}{optional}</label>
                    <input id={id('telegram')} name="telegram" maxLength={64} type="text" autoComplete="off" placeholder="@username"
                        className={inputClass} aria-invalid={!!errors.telegram} aria-describedby={describedBy('telegram')}
                        value={form.telegram} onChange={update('telegram')} />
                    <FieldError id={`${id('telegram')}-error`} message={errors.telegram} />
                </div>
                <div>
                    <label htmlFor={id('phone')} className={labelClass}>{T ? T.phone : 'Phone / WhatsApp'}{optional}</label>
                    <input id={id('phone')} name="phone" maxLength={32} type="tel" autoComplete="tel" placeholder="+855 ..."
                        className={inputClass} aria-invalid={!!errors.phone} aria-describedby={describedBy('phone')}
                        value={form.phone} onChange={update('phone')} />
                    <FieldError id={`${id('phone')}-error`} message={errors.phone} />
                </div>
            </div>
            <p id={id('contact-hint')} className="mt-2 text-xs text-mi-light/70">{T ? T.hint : 'We reply by email. Add Telegram or a phone number if you prefer a quicker reply there.'}</p>
        </fieldset>
    );

    const websiteField = (
        <div>
            <label htmlFor={id('website')} className={labelClass}>
                {isContact ? 'Company Name / Website URL' : (T ? T.website : 'Website or company name')}{!isQuickLook && optional}
            </label>
            <input id={id('website')} name="website" required={isQuickLook} maxLength={300} type="text" autoComplete="url"
                placeholder={isContact ? 'https://... or your company name' : 'https://... or your company name'}
                className={inputClass} aria-invalid={!!errors.website} aria-describedby={describedBy('website')}
                value={form.website} onChange={update('website')} />
            <FieldError id={`${id('website')}-error`} message={errors.website} />
        </div>
    );

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* Honeypot for bots: hidden from people and screen readers. */}
            <div className="hidden" aria-hidden="true">
                <label htmlFor={id('company_fax')}>Leave this field empty</label>
                <input id={id('company_fax')} name="company_fax" type="text" tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={update('company_fax')} />
            </div>

            {isContact && interest && PACKAGES[interest] && (
                <p className="rounded-lg bg-mi-cyan/10 border border-mi-cyan/40 px-4 py-3 text-sm text-mi-light/90">
                    You are asking about: <strong className="text-white">{PACKAGES[interest].name}</strong>. <a href="/contact" className="underline hover:text-white">Clear</a>
                </p>
            )}

            {isContact ? (
                <>
                    {nameField}
                    <div>
                        <label htmlFor={id('handle')} className={labelClass}>Business Email / Telegram Handle</label>
                        <input id={id('handle')} name="handle" required maxLength={254} type="text" autoComplete="email" placeholder="you@company.com or @username"
                            className={inputClass} aria-invalid={!!errors.contact || !!errors.email || !!errors.telegram} aria-describedby={errors.contact || errors.email || errors.telegram ? `${id('handle')}-error` : undefined}
                            value={form.handle} onChange={update('handle')} />
                        <FieldError id={`${id('handle')}-error`} message={errors.contact || errors.email || errors.telegram} />
                    </div>
                    {websiteField}
                    <div>
                        <label htmlFor={id('bottleneck')} className={labelClass}>What is your primary bottleneck?{optional}</label>
                        <select id={id('bottleneck')} name="bottleneck" className={inputClass} value={form.bottleneck} onChange={update('bottleneck')}>
                            <option value="">Select one...</option>
                            {Object.entries(BOTTLENECKS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </div>
                </>
            ) : (
                <>
                    {websiteField}
                    {!isQuickLook && nameField}
                    <div>
                        <label htmlFor={id('email')} className={labelClass}>{T ? T.email : 'Email'}</label>
                        <input id={id('email')} name="email" required maxLength={254} type="email" autoComplete="email" placeholder={T ? T.emailPlaceholder : 'you@company.com'}
                            className={inputClass} aria-invalid={!!errors.email} aria-describedby={describedBy('email')}
                            value={form.email} onChange={update('email')} />
                        <FieldError id={`${id('email')}-error`} message={errors.email} />
                    </div>
                    {isQuickLook ? (
                        <details className="rounded-lg border border-mi-blue/30 px-4 py-3 group" open={!!(errors.name || errors.telegram || errors.phone)}>
                            <summary className="cursor-pointer text-sm font-semibold text-mi-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-mi-cyan rounded">
                                {T ? T.details : 'Add your name or a faster way to reach you (optional)'}
                            </summary>
                            <div className="space-y-4 mt-4">
                                {nameField}
                                {contactFields}
                            </div>
                        </details>
                    ) : contactFields}
                </>
            )}

            {!isQuickLook && (
                <div>
                    <label htmlFor={id('message')} className={labelClass}>{T ? T.message : 'Message'}{optional}</label>
                    <textarea id={id('message')} name="message" rows={4} maxLength={1500}
                        placeholder={isContact ? 'Tell us briefly about your current setup or goals...' : (T ? T.messagePlaceholder : 'Anything we should know before we reply?')}
                        className={inputClass} aria-invalid={!!errors.message} aria-describedby={describedBy('message')}
                        value={form.message} onChange={update('message')} />
                    <FieldError id={`${id('message')}-error`} message={errors.message} />
                </div>
            )}

            {errors.form && (
                <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {errors.form} <a href={SITE.telegramUrl} target="_blank" rel="noreferrer" className="underline">{T ? T.openTelegram : 'Open Telegram'}</a>
                </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={submitting}>
                {submitting ? (T ? T.sending : 'Sending...') : isQuickLook ? (T ? 'Kostenlosen Quick Look anfordern' : QUICK_LOOK.cta) : isContact ? 'Send Inquiry' : (T ? T.send : 'Send request')}
            </Button>
            <p className="text-xs text-mi-light/70 text-center">
                {T ? (
                    <>{isQuickLook && T.free}{T.privacyLead}<a href="/datenschutz" className="underline hover:text-white">{T.privacyLink}</a>.</>
                ) : (
                    <>{isQuickLook && <>Free. Delivered {QUICK_LOOK.delivery}. </>}We only use these details to reply to you. See our <a href="/privacy" className="underline hover:text-white">privacy policy</a>.</>
                )}
            </p>
        </form>
    );
}

export const requestTitle = (packageType, lang = 'en') => {
    const german = FORM_TEXT[lang];
    return german ? (german.titles[packageType] || german.titles.call) : (PACKAGES[packageType] || PACKAGES.call).modalTitle;
};

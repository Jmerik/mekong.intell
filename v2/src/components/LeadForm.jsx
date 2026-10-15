import { useState } from 'react';
import { PACKAGES, AUDIENCES } from '../../shared/packages.js';
import { SITE } from '../content/site.js';
import { Button } from './ui.jsx';

const inputClass = 'w-full bg-mi-dark1 border border-mi-blue/30 rounded-lg p-3 text-white placeholder:text-mi-light/50 focus:border-mi-cyan focus:outline-none focus:ring-2 focus:ring-mi-cyan/40 transition-colors';
const labelClass = 'block text-mi-light/80 text-xs uppercase font-bold mb-2';

const FieldError = ({ id, message }) => (message ? <p id={id} className="mt-1 text-xs text-red-300">{message}</p> : null);

// One form for every request. The Quick Look asks for the minimum; the contact page also takes a message.
export default function LeadForm({ packageType, audience = 'general', focus = '', initialWebsite = '', onSuccess, idPrefix = 'lead', showAudience = false }) {
    const isQuickLook = packageType === 'quicklook';
    const [form, setForm] = useState({
        website: initialWebsite, name: '', email: '', telegram: '', phone: '', message: '', audience, company_fax: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const id = (field) => `${idPrefix}-${field}`;
    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
    const describedBy = (field) => (errors[field] ? `${id(field)}-error` : undefined);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.telegram.trim() && !form.phone.trim()) {
            setErrors({ contact: 'Please add a Telegram username or a phone number so we can reach you.' });
            return;
        }
        setErrors({});
        setSubmitting(true);
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, packageType, focus })
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                if (window.gtag) window.gtag('event', 'generate_lead', { package_type: packageType, audience: form.audience });
                onSuccess({ email: form.email.trim(), website: form.website.trim() });
            } else if (data.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ form: data.message || 'There was an issue processing your request. Please try again.' });
            }
        } catch (error) {
            setErrors({ form: 'Network error. Please check your connection, or message us directly on Telegram.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* Honeypot for bots: hidden from people and screen readers. */}
            <div className="hidden" aria-hidden="true">
                <label htmlFor={id('company_fax')}>Leave this field empty</label>
                <input id={id('company_fax')} name="company_fax" type="text" tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={update('company_fax')} />
            </div>

            {packageType !== 'contact' && (
                <div>
                    <label htmlFor={id('website')} className={labelClass}>
                        Website or company name {!isQuickLook && <span className="normal-case font-normal">(optional)</span>}
                    </label>
                    <input id={id('website')} name="website" required={isQuickLook} maxLength={300} type="text" autoComplete="url" placeholder="https://... or your company name"
                        className={inputClass} aria-invalid={!!errors.website} aria-describedby={describedBy('website')}
                        value={form.website} onChange={update('website')} />
                    <FieldError id={`${id('website')}-error`} message={errors.website} />
                </div>
            )}

            <div>
                <label htmlFor={id('name')} className={labelClass}>Name</label>
                <input id={id('name')} name="name" required maxLength={100} type="text" autoComplete="name" placeholder="Your full name"
                    className={inputClass} aria-invalid={!!errors.name} aria-describedby={describedBy('name')}
                    value={form.name} onChange={update('name')} />
                <FieldError id={`${id('name')}-error`} message={errors.name} />
            </div>

            <div>
                <label htmlFor={id('email')} className={labelClass}>Email</label>
                <input id={id('email')} name="email" required maxLength={254} type="email" autoComplete="email" placeholder="you@company.com"
                    className={inputClass} aria-invalid={!!errors.email} aria-describedby={describedBy('email')}
                    value={form.email} onChange={update('email')} />
                <FieldError id={`${id('email')}-error`} message={errors.email} />
            </div>

            <fieldset aria-describedby={id('contact-hint')}>
                <legend className="sr-only">How should we reach you?</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={id('telegram')} className={labelClass}>Telegram username</label>
                        <input id={id('telegram')} name="telegram" maxLength={64} type="text" autoComplete="off" placeholder="@username"
                            className={inputClass} aria-invalid={!!(errors.telegram || errors.contact)} aria-describedby={describedBy('telegram')}
                            value={form.telegram} onChange={update('telegram')} />
                        <FieldError id={`${id('telegram')}-error`} message={errors.telegram} />
                    </div>
                    <div>
                        <label htmlFor={id('phone')} className={labelClass}>Phone / WhatsApp</label>
                        <input id={id('phone')} name="phone" maxLength={32} type="tel" autoComplete="tel" placeholder="+855 ..."
                            className={inputClass} aria-invalid={!!(errors.phone || errors.contact)} aria-describedby={describedBy('phone')}
                            value={form.phone} onChange={update('phone')} />
                        <FieldError id={`${id('phone')}-error`} message={errors.phone} />
                    </div>
                </div>
                <p id={id('contact-hint')} className={`mt-2 text-xs ${errors.contact ? 'text-red-300' : 'text-mi-light/70'}`}>
                    {errors.contact || 'Telegram or phone. One of the two is enough.'}
                </p>
            </fieldset>

            {showAudience && (
                <div>
                    <label htmlFor={id('audience')} className={labelClass}>I sell <span className="normal-case font-normal">(optional)</span></label>
                    <select id={id('audience')} name="audience" className={inputClass} value={form.audience} onChange={update('audience')}>
                        <option value="general">Select one...</option>
                        <option value="local">To customers in Cambodia and the Mekong region</option>
                        <option value="international">Across borders, into the region or out of it</option>
                    </select>
                </div>
            )}

            {!isQuickLook && (
                <div>
                    <label htmlFor={id('message')} className={labelClass}>Message <span className="normal-case font-normal">(optional)</span></label>
                    <textarea id={id('message')} name="message" rows={4} maxLength={1500} placeholder="Anything we should know before we reply?"
                        className={inputClass} aria-invalid={!!errors.message} aria-describedby={describedBy('message')}
                        value={form.message} onChange={update('message')} />
                    <FieldError id={`${id('message')}-error`} message={errors.message} />
                </div>
            )}

            {errors.form && (
                <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {errors.form} <a href={SITE.telegramUrl} target="_blank" rel="noreferrer" className="underline">Open Telegram</a>
                </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={submitting}>
                {submitting ? 'Sending...' : isQuickLook ? 'Get my Free Quick Look' : packageType === 'contact' ? 'Send message' : 'Send request'}
            </Button>
            <p className="text-xs text-mi-light/70 text-center">
                We only use these details to reply to you. See our <a href="/privacy" className="underline hover:text-white">privacy policy</a>.
            </p>
        </form>
    );
}

export const requestTitle = (packageType) => (PACKAGES[packageType] || PACKAGES.call).modalTitle;
export const audienceLabel = (audience) => AUDIENCES[audience] || AUDIENCES.general;

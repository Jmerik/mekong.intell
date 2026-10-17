import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { Container, Button, Icons } from '../components/ui.jsx';

// The page behind the link in the confirmation email. The link only opens this page; the button sends the
// confirmation. That way email security scanners that open links cannot start a scan by accident.
const TEXT = {
    en: {
        title: 'Confirm your Free Quick Look',
        intro: 'One more step. Confirm that the request is yours, and we start your Quick Look.',
        button: 'Start my Quick Look', working: 'Confirming ...',
        ok: 'Thanks. We have started your Quick Look. We will send it to your email address within 2 working days.',
        expired: 'This link has expired or was already used. If you still want a Quick Look, please send a new request.',
        error: 'Something went wrong. Please try again, or message us on Telegram.',
        again: 'Request a new Quick Look', againHref: '/'
    },
    de: {
        title: 'Bestätigen Sie Ihren kostenlosen Quick Look',
        intro: 'Ein Schritt noch. Bestätigen Sie, dass die Anfrage von Ihnen stammt, und wir starten Ihren Quick Look.',
        button: 'Meinen Quick Look starten', working: 'Wird bestätigt ...',
        ok: 'Danke. Wir haben Ihren Quick Look gestartet. Sie erhalten ihn innerhalb von 2 Werktagen per E-Mail.',
        expired: 'Dieser Link ist abgelaufen oder wurde schon verwendet. Wenn Sie weiterhin einen Quick Look möchten, senden Sie bitte eine neue Anfrage.',
        error: 'Etwas ist schiefgegangen. Bitte versuchen Sie es erneut oder schreiben Sie uns auf Telegram.',
        again: 'Neue Anfrage stellen', againHref: '/de'
    }
};

export default function ConfirmPage({ lang = 'en' }) {
    const t = TEXT[lang];
    const [token, setToken] = useState(null);
    const [state, setState] = useState('idle');

    useEffect(() => {
        const value = new URLSearchParams(window.location.search).get('t') || '';
        setToken(/^[a-f0-9]{64}$/.test(value) ? value : '');
    }, []);

    const confirm = async () => {
        setState('working');
        try {
            const response = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) });
            const data = await response.json().catch(() => ({}));
            setState(data.status === 'ok' ? 'ok' : data.status === 'expired' ? 'expired' : 'error');
        } catch (e) {
            setState('error');
        }
    };

    const shown = token === '' ? 'expired' : state;
    return (
        <Layout>
            <Container className="py-20 max-w-xl text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.title}</h1>
                {shown === 'ok' ? (
                    <p role="status" className="text-mi-light/90 flex items-start gap-3 text-left"><Icons.CheckCircle2 size={24} className="text-mi-cyan shrink-0" />{t.ok}</p>
                ) : shown === 'expired' ? (
                    <div role="status"><p className="text-mi-light/90 mb-6">{t.expired}</p><Button href={t.againHref} variant="outline" className="mx-auto">{t.again}</Button></div>
                ) : (
                    <>
                        <p className="text-mi-light/85 mb-8">{t.intro}</p>
                        <Button onClick={confirm} disabled={shown === 'working' || token === null} className="mx-auto">{shown === 'working' ? t.working : t.button}</Button>
                        {shown === 'error' && <p role="alert" className="mt-4 text-sm text-red-300">{t.error}</p>}
                    </>
                )}
            </Container>
        </Layout>
    );
}

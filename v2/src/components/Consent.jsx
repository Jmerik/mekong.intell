import { useEffect, useState } from 'react';
import { analyticsEnabled, getConsent, setConsent, loadAnalytics, stopAnalytics, COOKIE_SETTINGS_EVENT } from '../lib/analytics.js';
import { Button } from './ui.jsx';

// Cookie banner. Rendered only when the build has a Google Analytics ID.
// Nothing is decided on the server, so the first render is empty and the banner appears after load.
export default function Consent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!analyticsEnabled) return undefined;
        const stored = getConsent();
        if (stored === 'granted') loadAnalytics();
        else if (stored !== 'denied') setVisible(true);

        const reopen = () => setVisible(true);
        window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
        return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
    }, []);

    if (!analyticsEnabled || !visible) return null;

    const choose = (value) => () => {
        setConsent(value);
        if (value === 'granted') loadAnalytics(); else stopAnalytics();
        setVisible(false);
    };

    return (
        <section aria-label="Cookie consent" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:max-w-md z-[45] bg-mi-dark2 border border-mi-cyan/40 rounded-2xl p-5 shadow-2xl">
            <p className="text-sm text-mi-light/90 mb-4">
                We would like to use Google Analytics to see which pages are useful. It sets cookies only if you accept.
                {' '}<a href="/privacy#analytics" className="underline hover:text-white">Read more</a>
            </p>
            <div className="flex gap-3">
                <Button onClick={choose('granted')} className="flex-1 py-2 text-sm">Accept</Button>
                <Button variant="secondary" onClick={choose('denied')} className="flex-1 py-2 text-sm">Decline</Button>
            </div>
        </section>
    );
}

// Footer link that lets a visitor change their mind. Rendered only when analytics is enabled.
export function CookieSettingsLink({ className = '' }) {
    if (!analyticsEnabled) return null;
    return (
        <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}>
            Cookie settings
        </button>
    );
}

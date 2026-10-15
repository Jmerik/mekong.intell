// Google Analytics, loaded only after a visitor accepts it (see components/Consent.jsx).
// Until then nothing is requested from Google and no analytics cookies are set.
// The measurement ID is baked in at build time from the GA_ID environment variable; with no ID,
// there is no analytics code path at all and no consent banner.

const GA_ID = process.env.GA_ID || '';
const STORAGE_KEY = 'mi_consent';

export const analyticsEnabled = GA_ID !== '';

export function getConsent() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
}

export function setConsent(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private mode: choice lasts for this page only */ }
}

let loaded = false;

export function loadAnalytics() {
    if (!analyticsEnabled || loaded) return;
    loaded = true;
    window['ga-disable-' + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
}

// Stop measuring and remove the cookies Google Analytics already set on this site.
export function stopAnalytics() {
    if (!analyticsEnabled) return;
    window['ga-disable-' + GA_ID] = true;
    delete window.gtag;
    const host = window.location.hostname;
    const parts = host.split('.');
    const domains = [host, '.' + host, parts.length > 2 ? '.' + parts.slice(-2).join('.') : null].filter(Boolean);
    for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
            for (const domain of domains) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + domain;
            }
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
    }
}

export const COOKIE_SETTINGS_EVENT = 'mi:cookie-settings';

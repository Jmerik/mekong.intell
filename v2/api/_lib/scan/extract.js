// Reads facts out of a page with plain string matching. No page text is ever given to an AI model:
// only these yes/no facts are used, so a page cannot talk its way into the report.

const attr = (tag, name) => {
    const m = tag.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]{0,500})"|'([^']{0,500})'|([^\\s>]{1,500}))`, 'i'));
    return m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
};
const hostOf = (href, base) => { try { return new URL(href, base).hostname.toLowerCase().replace(/^www\./, ''); } catch { return ''; } };

function extractSignals(html, baseUrl) {
    const text = String(html || '').slice(0, 400 * 1024);
    const lower = text.toLowerCase();
    const signals = {
        title: false, description: false, orgSchema: false, privacyLink: false, forms: 0, chatWidget: false,
        email: false, phone: false, messaging: new Set(), social: new Set(), internalLinks: []
    };
    const title = text.match(/<title[^>]*>([\s\S]{0,300}?)<\/title>/i);
    signals.title = Boolean(title && title[1].trim());
    for (const tag of text.match(/<meta\s[^>]{0,600}>/gi) || []) {
        if (attr(tag, 'name').toLowerCase() === 'description' && attr(tag, 'content').trim().length >= 20) signals.description = true;
    }
    signals.orgSchema = /application\/ld\+json/i.test(text) && /"@type"\s*:\s*"?\[?\s*"?(organization|localbusiness|professionalservice|corporation|store|restaurant)/i.test(text);
    signals.forms = (lower.match(/<form[\s>]/g) || []).length;
    signals.chatWidget = /tawk\.to|crisp\.chat|intercom|tidio|livechat|zendesk|fb-customerchat|messenger-plugin|zalo\.me\/widget|zaloplugin|chatwoot|hubspot\.com\/conversations/.test(lower);

    const baseHost = hostOf(baseUrl, baseUrl);
    for (const tag of text.match(/<a\s[^>]{0,800}>/gi) || []) {
        const href = attr(tag, 'href').trim();
        if (!href || href.startsWith('#') || /^javascript:/i.test(href)) continue;
        const h = href.toLowerCase();
        if (h.startsWith('mailto:')) { signals.email = true; continue; }
        if (h.startsWith('tel:') || h.startsWith('sms:')) { signals.phone = true; continue; }
        const host = hostOf(href, baseUrl);
        if (/(^|\.)wa\.me$|whatsapp\.com$/.test(host)) signals.messaging.add('WhatsApp');
        else if (/(^|\.)t\.me$|telegram\.(me|org)$/.test(host)) signals.messaging.add('Telegram');
        else if (/(^|\.)m\.me$|messenger\.com$/.test(host)) signals.messaging.add('Messenger');
        else if (/zalo\.me$/.test(host)) signals.messaging.add('Zalo');
        else if (/viber\.com$/.test(host)) signals.messaging.add('Viber');
        else if (/linkedin\.com$/.test(host)) signals.social.add('LinkedIn');
        else if (/facebook\.com$|fb\.com$/.test(host)) signals.social.add('Facebook');
        else if (/instagram\.com$/.test(host)) signals.social.add('Instagram');
        else if (/youtube\.com$|youtu\.be$/.test(host)) signals.social.add('YouTube');
        else if (/tiktok\.com$/.test(host)) signals.social.add('TikTok');
        if (host === baseHost) {
            if (/privacy|datenschutz|chinh-sach|policy/.test(h)) signals.privacyLink = true;
            let path; try { path = new URL(href, baseUrl); } catch { continue; }
            if (signals.internalLinks.length < 40) signals.internalLinks.push(path.pathname);
        }
    }
    if (/\bprivacy (policy|notice)\b|datenschutz/i.test(text.replace(/<[^>]+>/g, ' ').slice(0, 200000))) signals.privacyLink = true;
    // Contact details written out as text count as published even when they are not links.
    const visible = text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, ' ').slice(0, 200000);
    if (/[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(visible)) signals.email = true;
    if (/(\+|00)\d{1,3}[\s().-]?\d{2,4}[\s().-]?\d{3,4}[\s().-]?\d{2,4}/.test(visible)) signals.phone = true;
    return signals;
}

// Which internal pages are worth a second look (contact, about)?
function pickPages(internalLinks, max = 2) {
    const picks = [];
    for (const pattern of [/contact|lien-he|kontakt|ติดต่อ/i, /about|gioi-thieu|ueber|team/i]) {
        const hit = internalLinks.find((p) => pattern.test(p) && p.length <= 80 && !picks.includes(p));
        if (hit) picks.push(hit);
        if (picks.length >= max) break;
    }
    return picks;
}

const mergeSignals = (list) => list.reduce((all, s) => ({
    ...all,
    title: all.title || s.title, description: all.description || s.description, orgSchema: all.orgSchema || s.orgSchema,
    privacyLink: all.privacyLink || s.privacyLink, forms: all.forms + s.forms, chatWidget: all.chatWidget || s.chatWidget,
    email: all.email || s.email, phone: all.phone || s.phone,
    messaging: new Set([...all.messaging, ...s.messaging]), social: new Set([...all.social, ...s.social])
}), { title: false, description: false, orgSchema: false, privacyLink: false, forms: 0, chatWidget: false, email: false, phone: false, messaging: new Set(), social: new Set(), internalLinks: [] });

module.exports = { extractSignals, pickPages, mergeSignals };

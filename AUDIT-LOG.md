# Website audit: fix log

**Date:** 1 October 2026
**Branch:** `claude/quirky-cerf-yjma0u`

Each item below matches the numbered finding in the original audit.

**How it was verified:**
- Automated tests (`npm test`, 6 passing).
- End-to-end runs in headless Chromium at 390px (phone) and 1440px (desktop), against the real server with the Telegram API stubbed.
- The live site was not reachable from the build environment, so everything was checked against a local copy.

**Status key:**
- ✅ Fixed
- 🟡 Partly fixed: needs your input to finish
- 📝 Needs your content

## Headline results

| Measure | Before | After |
| --- | --- | --- |
| Lead with `_` in email/Telegram (e.g. `@dara_sok`) | Dropped by Telegram, visitor still shown "success" | Delivered (verified) |
| Second booking in the same visit | Impossible, stale "Request Received" | Fresh form every time (verified) |
| JavaScript downloaded before content shows | Babel 3.1 MB + React + Tailwind Play CDN (~4 MB) | 179 KB bundle (~57 KB gzipped); HTML is pre-rendered, so content shows before JS runs |
| CSS | Generated in the browser at runtime | 24 KB static file |
| Logo | 482 KB PNG (also the favicon) | 18 KB WebP + 2 KB favicon |
| Founder photo | 77 KB JPEG, loaded immediately | 21 KB WebP, lazy-loaded |
| Mobile header height | 224px | 96px |
| Mobile horizontal scroll | 406px page on a 390px screen | None (390px) |
| `/robots.txt`, unknown URLs | Homepage HTML with 200 status | Real file / real 404 (old image URLs 301-redirect to the new files) |

## 1. Leads lost (fix first)

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 1 | Telegram Markdown broke on `_`; lead lost while visitor saw success | ✅ | Message now uses Telegram HTML mode with escaping (`lib/lead.js`). If Telegram fails, the visitor sees an error with a Telegram link (HTTP 502), and the full lead is written to the server log for manual follow-up. |
| 2 | Form stuck on "Request Received" after first use | ✅ | The modal is only mounted while open, so every opening starts on a fresh, empty form. |
| 3 | Telegram ID required | ✅ | New **Phone / WhatsApp** field. Either Telegram or phone is enough; this is checked in the browser and on the server. |
| 4 | No conversion tracking | ✅ | A successful booking fires the GA4 event `generate_lead` with `package_type`. Mark it as a key event in Google Analytics (see "Your to-do"). |
| 5 | `/api/book` unprotected | ✅ | Spam and abuse protection on the booking endpoint (`lib/lead.js`, `server.js`):<br>• Server-side validation: required fields, email/Telegram/phone format, length limits, allowed package and goal values<br>• Hidden honeypot field<br>• Rate limit: 5 requests per 15 minutes per IP<br>• 10 KB request body limit |

## 2. Performance

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 6 | Babel + Tailwind Play CDN compile the page in the visitor's browser | ✅ | New build step (`scripts/build.mjs`):<br>• esbuild bundles React and the page into `public/assets/app.js`<br>• Tailwind compiles `public/assets/styles.css`<br>• The page is pre-rendered to HTML and React then attaches to it ("hydration")<br>• The "INITIALIZING" spinner is gone<br>• Responses are gzip-compressed<br>• CSS and JS are cache-busted with a content hash and cached for a year |
| 7 | Unpinned CDN versions | ✅ | No CDN scripts left except Google Analytics. All dependencies are pinned to exact versions in `package.json` and `package-lock.json`. |
| 8 | Oversized images | ✅ | Sizes are in the table above:<br>• Logo trimmed of padding and converted to WebP<br>• Proper 32px favicon and 180px Apple touch icon<br>• Founder photo converted to WebP and lazy-loaded, with width/height set to avoid layout shift<br>• Originals moved to `assets/` and regenerated with `npm run images` |

## 3. Layout and UX

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 9 | Oversized header pushes CTAs below the fold | ✅ | Logo 64–80px (48–56px once scrolled). Hero top padding reduced from 256–288px to 144–176px. Sections have `scroll-margin-top`, so the fixed nav no longer covers headings. |
| 10 | Horizontal scroll on phones | ✅ | `overflow-hidden` on the Problem section; the page measures 390px at 390px. |
| 11 | Modal accessibility | ✅ | • `role="dialog"`, `aria-modal`, labelled title<br>• Escape closes it, and so does clicking the backdrop<br>• Tab stays inside the modal; focus returns to the button that opened it; background scroll is locked<br>• Every label is linked to its input; errors appear inline (`aria-invalid`, `role="alert"`) instead of `alert()`<br>• Also added: a "Skip to content" link, `aria-expanded` on the mobile menu, real `<a href="#...">` nav links, reduced-motion support, and brighter low-contrast text (≥70% opacity) |
| 12 | Package names didn't match | ✅ | One shared list in `shared/packages.js` feeds the cards, the modal title and the Telegram message. The Dashboard add-on is now its own option instead of reusing "partnership". |
| 13 | Footer strategy-call button inconsistent | ✅ | It now opens the booking form like everywhere else. "Message us on Telegram" sits beside it as a separate link. |

## 4. Credibility and content

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 14 | Claims that look made up | 🟡 | • Mock dashboard: "Live Data" is now "Example report", "2 mins ago" is now "Weekly Strategy Update", and a caption says the figures are illustrative.<br>• The unsourced "40% of ad spend" line is reworded so it makes no numeric claim.<br>• "100% Data Backed" is replaced with "1:1 Founder-Led Engagements".<br>• **49% ROI uplift kept**, with a footnote ("average across past client engagements; individual results vary"). **Please confirm this figure is accurate, or tell me to remove it.** |
| 15 | Bio overclaims; only one proof point | 🟡 | Bio rewritten to keep the facts (corporate + Web3 track record, founder-led) and drop "stands entirely alone" / "singular, indispensable". **Needs your content:** 2–3 more results or client logos for the Results section. |
| 16 | Southeast Asia vs Cambodia | ✅ | Consistent framing: "Cambodia-rooted, serving Southeast Asia". This covers the hero copy, pillar text, footer, meta description and structured data (`areaServed`: Cambodia + Southeast Asia). |
| 17 | No prices | 📝 | Not changed: needs your pricing decision. Tell me the "from" prices and I'll add them to the cards and the structured data. |
| 18 | No Khmer version | 📝 | Not done: needs a human translation of the copy (machine translation would hurt credibility). Once you have one, I can add a language switch. |
| 19 | No privacy policy | 🟡 | New `/privacy` page, linked from the footer and the booking form. It describes what the site actually does: form fields, Telegram delivery, hosting logs and Google Analytics. **Draft: please review it (or have it reviewed) before relying on it.** |

## 5. SEO and sharing

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 20 | No robots/sitemap; soft 404s | ✅ | Added `public/robots.txt` and `public/sitemap.xml`. Unknown URLs return a branded 404 page with status 404; unknown `/api/*` paths return JSON 404s. |
| 21 | Content invisible to crawlers; hidden `sr-only` copy | ✅ | The full page is pre-rendered into `index.html`, and the hidden duplicate text block is removed. |
| 22 | Poor share preview, structured data gaps | ✅ | New 1200×630 share card (`/image/og-image.png`) with width/height/alt tags, and the Twitter tags now use the correct `name=` attribute. Structured data gains `sameAs` (Telegram, LinkedIn), all five services, and a corrected founder title. `meta keywords` is removed. |

## 6. Housekeeping

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 23 | Node 20 past end of life | ✅ | `engines.node` is now `22.x \|\| 24.x`. |
| 24 | Server and repo hygiene | ✅ | • Added `package-lock.json`, `.gitignore` and `README.md`<br>• Removed the duplicate root `vosumtey.jpg` and the dead photo overlay `<div>`<br>• Removed `cors`; added `helmet` security headers: a Content-Security-Policy that allows only this site, Google Analytics and Google Fonts, plus HSTS, nosniff and frame-ancestors none<br>• Google Analytics moved from an inline script to `public/analytics.js` so the CSP can block inline scripts<br>• `X-Powered-By` removed<br>• Successful leads no longer write personal details to the log, only the package name |

**Bonus fix:** the close (X) icon's second stroke was drawn off-centre (`m6 6 18 18`, corrected to `m6 6 12 12`).

## Your to-do

1. **Render settings:** make sure Render runs Node 22 or 24. Because `public/` is committed, the existing start command `npm start` keeps working, and no build command change is needed.
2. **Content edits:** after editing `src/` or `shared/`, run `npm run build` and commit the regenerated `public/` files along with your edit.
3. **Google Analytics:** go to Admin → Events → mark `generate_lead` as a key event.
4. **Search Console:** submit `https://mekongintel.live/sitemap.xml`.
5. **Content I need from you:**
   - Confirm or drop the **49%** figure (#14).
   - 2–3 more proof points (#15).
   - Prices (#17).
   - Khmer translation (#18).
   - Review the privacy policy (#19).
6. **After deploying:** submit one real test booking with an underscore in the Telegram username, and check it arrives in Telegram.

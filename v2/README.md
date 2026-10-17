# Mekong Intelligence website v2 (preview build)

A new multi-page site built around the free **Quick Look**. It lives in its own folder so the current
live site (repo root, served by `server.js` on Render) is untouched. Deploy this folder to a sample
Vercel project to review it. **Do not point the public domain at it until the Quick Look scanner is built.**

## Pages

| Route | What it is |
| --- | --- |
| `/` | The main landing page, for businesses in Cambodia and Vietnam: hero with the Quick Look search, Found / Trusted / Reached, the four steps |
| `/international` | The same page for companies selling across borders, into the region or out of it |
| `/sample-quick-look` | A real Quick Look on Mekong Intelligence itself: ratings, findings with sources and dates, fixes |
| `/services` | The tiers in detail, with a Local Market / International / Regional toggle. **No prices yet** (see below) |
| `/resources` | Index of the three guides |
| `/resources/ai-search-visibility`, `/resources/digital-footprint-check`, `/resources/response-and-follow-up` | The guides, one page each, with byline, date and Article structured data |
| `/team` | Team: founder profile, partner and how we work (`/about` redirects here) |
| `/contact` | Channels and office on the left, inquiry form on the right (`/contact?interest=sprint` pre-selects a service) |
| `/privacy` | Draft privacy policy |

`/local` redirects to `/` and `/pricing` redirects to `/services` (see `vercel.json`).

### How the two audiences are split

`/` and `/international` are **one page template** (`src/pages/Landing.jsx`) fed by two entries in
`src/content/audiences.js`. The line saying who we serve, the three Found / Trusted / Reached examples and
one note under the 7-Day Sprint change per audience. Everything else is shared, so a fix lands on both pages.

- The main page is the "local" version, because Cambodia and Vietnam are the core markets. Leads from it are
  tagged **Local** in Telegram and the sheet; leads from `/international` are tagged **International**.
- A Local | International switch at the top of each page lets a visitor change their mind.
- Campaigns, QR codes and Telegram bios for cross-border buyers should link to `/international`.
- Move to three real audience pages (Local, Entering the region, Selling to Western and German-speaking buyers)
  when those offers differ in substance. See `audiences.js` for how to add one.

## Current sample deployment

- Project: `mekong-intelligence-v2` in the `jmeriks-projects` Vercel team (Hobby plan)
- Address: https://mekong-intelligence-v2.vercel.app (first deployed 15 October 2026)
- **Access:** the project uses Vercel's Standard Protection (`all_except_custom_domains`), so the `*.vercel.app`
  addresses should ask for a Vercel login. This was read from the project settings, not tested from outside:
  open the address in a private window to confirm before sharing it. A custom domain would NOT be protected.
  To let someone else in, use Project > Settings > Deployment Protection (shareable link or bypass).
- **Connected to GitHub** (`Jmerik/mekong.intell`, production branch `main`) with **Root Directory `v2`**.
  Every push builds a protected preview deployment. Merging to `main` redeploys this project's production
  address. The live Render site is not affected by any of this.
- Lead destinations (Telegram, Google Sheet) are **not set up yet**, so form submissions succeed but are only
  written to the function logs, which expire after 1 hour. Set them up before anyone submits a real request.
- To deploy by hand, run from the **repository root** (not from `v2/`), pinning the project so the CLI cannot
  create a new one:
  `VERCEL_ORG_ID=<team id> VERCEL_PROJECT_ID=prj_bWR5MoB23nkaSN6dbwriJ82ekCrz npx vercel deploy --prod --yes`
  (ids are in `v2/.vercel/project.json` after `vercel link`; that folder is not committed).

## Deploy to a sample Vercel project

1. In Vercel choose **Add New > Project**, import this repository.
2. Set **Root Directory** to `v2`. Framework preset: **Other**. Vercel reads `vercel.json`
   (build command `npm run build`, output `dist`) and deploys `api/book.js` as a serverless function.
3. Add environment variables (Settings > Environment Variables), then redeploy:
   - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`: instant notification in Telegram.
   - `LEAD_SHEET_WEBHOOK_URL` and `LEAD_SHEET_SECRET`: a durable copy of every lead in a Google Sheet.
     Setup takes about 5 minutes: see [`docs/lead-sheet-setup.md`](docs/lead-sheet-setup.md).
   - Every lead goes to **all configured destinations**. The visitor sees success if at least one has it, and an
     error only if every configured destination failed. With none configured, the form still succeeds but the
     lead is only written to the function logs, which Vercel keeps for **1 hour** on the Hobby plan.
4. Optional: `SITE_URL` to pin the address used in share tags (defaults to the Vercel URL).

The preview is kept out of search engines three ways: `X-Robots-Tag` header (`vercel.json`), a
`noindex` meta tag, and `robots.txt` that disallows everything. A cyan banner on every page says the
scanner is not connected.

### Build settings (environment variables, all optional)

| Variable | Default | Effect |
| --- | --- | --- |
| `NOINDEX` | on | Anything except `0` keeps the site out of search engines. |
| `PREVIEW_BANNER` | on while `NOINDEX` is on | `0` hides the preview banner. |
| `SITE_URL` | Vercel URL, else `https://mekongintel.live` | Canonical, share and sitemap addresses. |
| `GA_ID` | empty | Google Analytics measurement ID. Leave empty on previews so test visits do not pollute real data. When set, a cookie banner appears and Google Analytics loads **only after a visitor accepts** it; a "Cookie settings" link in the footer lets them change their mind. With no ID there is no banner and no analytics code. |

## Run locally

```bash
cd v2
npm install
npm run dev      # builds, then serves http://localhost:3000 (clean URLs, 404 page and /api/book)
npm test         # validation, Telegram formatting, rate limit, scanner stub
```

Without Telegram variables, submitted leads are printed to the terminal.

## Where to edit

| To change | Edit |
| --- | --- |
| Hero copy, facts, the services (names, timing, scope per market, what is included), the Market Entry Brief, nav, reply time | `src/content/site.js` |
| Local / International wording and examples | `src/content/audiences.js` |
| The guides (text, dates, related guides) | `src/content/guides.js` |
| The sample Quick Look (findings, ratings, fixes, date) | `src/content/sample.js` |
| FAQ on the landing pages (also published as FAQPage structured data) | `src/content/faq.js` |
| Share images (1200x630) | `scripts/og-images.mjs`, then commit `static/image/` |
| Page titles and descriptions | `src/content/pages.js` |
| Package and audience names (form, page and Telegram share them) | `shared/packages.js` |
| Team, Contact, Services page, Privacy text | `src/pages/*.jsx` |
| Colours | `tailwind.config.js` |

`dist/` is generated on every deploy and is not committed.

## Scanner placeholder (next project)

Today the Quick Look is a **free request**: the visitor leaves a website or company name plus an email,
and the lead goes to Telegram and the lead sheet marked "Scanner not connected yet: prepare this Quick Look by hand".
To connect the real scanner:

1. Implement `runQuickLook()` in `api/_lib/scanner.js`. The input/output contract and the brand rules
   (public information only, N/A for anything unverifiable, Strong / Developing / Priority focus ratings,
   no red/green scores) are written at the top of that file.
2. Call it from `api/book.js` (the `SCANNER PLACEHOLDER` block) and return the result to the browser.
3. Set `scannerEnabled: true` in `src/content/site.js`. This switches the hero note to "Instant analysis..."
   and the success message from "we will prepare" to "is being prepared".
4. Add a result view (Found / Trusted / Reached with ratings and sourced findings). The hero search
   (`QuickLookPill` in `src/components/Hero.jsx`) is where it starts.
5. Decide the wording on "scanned or tested". The brand line says nothing is scanned or tested; an
   automated scan of public pages needs that sentence revisited.

The serverless function's rate limit is in memory per instance, so it is only a speed bump. Before
launch, add Vercel WAF rate limiting (or Upstash Redis) in front of `/api/book`. The scanner will need it
anyway, because each request will cost money.

## Decisions made (change freely)

- **No prices.** The brand rules say not to quote prices while Cambodia pricing is tested. `/services`
  shows timeline, scope and inclusions, with "Shared after your Quick Look". Set real values in
  `PRICE_LABEL` in `src/pages/ServicesPage.jsx` when agreed.
- **No checkout.** Every paid step opens a request form ("Ask about this step"); there is no "Subscribe Now".
- **Full Build and the Dashboard add-on are gone.** The Dashboard is now part of the Retainer, as in the brief.
- **Day 35 recount** sits on the 90-Day Blueprint card as a highlighted milestone, as in the brief.
- **"Fix: 3 critical fixes live in 7 days"** (the brief said "menu fixes"; treated as a typo).
- **Soft wording:** "leaking", "bleeding money" and "walk away silently" became calmer phrasing to match the
  consultative voice. "Rivals" became "competitors".
- **Mock screens say Example.** The Found / Trusted / Reached illustrations use neutral cyan and slate chips,
  not red/green, and a caption states they are not client data.
- **Team page names only the founder, and uses no pronouns** because the site and earlier notes disagree.
  Add a second person in `src/pages/Team.jsx` when wanted.
- **Contact:** no public email or street address yet, so none is shown (the form replies by email). Add them in `src/pages/Contact.jsx` and the privacy policy when they exist. The business is an individual business for now.
- **Hero search placeholder** reads "Your website or company name" so it fits on a phone.
- **Quick Look form asks for two things:** website or company name, and email. Name, Telegram and phone are in an
  optional section. Other requests ask for name and email, and Telegram or phone are optional everywhere.
  The promise "delivered within 2 working days" lives in `QUICK_LOOK` in `src/content/site.js`.
- **Fonts are served from this site** (Inter, one variable file, SIL Open Font License), so visitors' browsers
  make no request to Google Fonts. The Content-Security-Policy no longer allows Google Fonts at all.
- **Resources:** the three guide grids are written as short, checkable actions with no statistics.

## Launch checklist

- [ ] Scanner connected and `scannerEnabled` set to `true` (or the manual wording kept on purpose)
- [ ] Set `NOINDEX=0`, `GA_ID`, `SITE_URL` in Vercel; remove the `X-Robots-Tag` header from `vercel.json`
- [ ] Add Vercel WAF rate limiting in front of `/api/book`
- [ ] Contact email (and street address, if wanted) added (`src/pages/Contact.jsx`, privacy policy)
- [ ] Lead Google Sheet and Telegram set up, a real test lead seen in both
- [ ] Privacy policy reviewed
- [ ] Prices decided (or confirmed as "shared on a call")
- [ ] Redirect or replace the current live site; keep the old image URLs working
- [ ] Submit `/sitemap.xml` in Google Search Console and mark `generate_lead` as a key event in Analytics

## Phase 2 decisions (structure and conversion)

- **One set of names everywhere:** Free Quick Look, 7-Day Sprint, 90-Day Blueprint, Market Intelligence Retainer.
  They are defined once (`SERVICES` in `src/content/site.js` and `PACKAGES` in `shared/packages.js`) and used on the
  cards, the Services page, the forms, Telegram, the sheet and the structured data. **Still to do outside this repo:**
  update the MI brand guide and the audit and teaser templates to the same names, and map them to Tier 1 / 2 / 3.
- **Hero wording:** label "DATA-LED MARKET INTELLIGENCE", then "Look. Fix. Count.", then one line saying who and where
  ("Brand and market intelligence for businesses in Cambodia and Vietnam."). "Optimization engine" is gone because it
  reads like software. The alternative considered: label "BRAND & MARKET INTELLIGENCE", subline "A clear path from
  diagnosis to growth." Both are one-line edits in `content/site.js` and `content/audiences.js`.
- **The orbit diagram is gone.** The four steps now run as one timeline (Day 0, days 1 to 7, 90 days, monthly).
- **One primary action:** "Request my Free Quick Look", plus "Book a Call" as the secondary. The other steps use a plain
  "Ask about this step" link. The Found / Trusted / Reached cards no longer have buttons.
- **"Pricing" is "Services"** in the nav and the page, because it shows no prices.
- Visitors on the main page are tagged Local in lead messages, so `/` and `/international` can be compared.

## Phase 3 decisions (proof and content)

- **Sample Quick Look = Mekong Intelligence itself, checked on 15 October 2026.** Every finding names its source and
  date; anything not checked is marked N/A (that is why "Reached" is N/A and each area lists what was not assessed).
  The ratings follow the brand words: Strong, Developing, Priority focus. The checks were web searches run with a
  US-based search tool; the live site and Telegram page could not be opened from the build environment, so
  nothing about their content is claimed. **To refresh or replace it:** re-run the checks, then edit
  `src/content/sample.js` (date, findings, ratings and fixes together). **It is a draft: review every line before launch.**
- **Landing page order:** hero, trust strip (process commitments only), the real sample, the three checks (their
  example screens are hidden on phones because the sample carries the proof there), the four-step timeline, FAQ.
  Main page length on a phone: about 7.7 screens.
- **FAQ:** shown on both landing pages; the FAQPage structured data is only on `/` so the same questions are not
  marked up twice.
- **Guides:** one page each, written as short checklists with no statistics. The byline is "Mekong Intelligence"
  (not a named person) until you decide who should be credited. Dates are ISO and feed the Article markup.
- **Team page:** Jan Hanken added as Partner with two facts from the brand guide (leads the German-speaking segment;
  material for that segment is written in German). Initials instead of a photo. Vosumtey Seng still has no pronouns.
- **Per-audience share images** for `/` and `/international`; the other pages use the generic one.
- **Not done on purpose: an EuroCham proof strip.** See "Open claim to confirm" below.

## Open claim to confirm before launch

The Team page says Vosumtey "led digital authority" at EuroCham and "grew a targeted audience of 20,000+ professionals
with no ad spend". Public pages found on 15 October 2026 (EuroCham's team listing and a public LinkedIn profile)
show the title Communications Officer, and nothing found supports the 20,000+ figure or "no ad spend". The wording
comes from the previous live site and is unchanged. Either add a public source (for example a LinkedIn page's
follower history or a published EuroCham report) and link it, or soften the sentence to what the public record shows.

## Bug fixed in Phase 3

Buttons on the Services, Resources and Team pages did nothing: those pages used the booking-form hook outside the
component that provided it. Every page is now wrapped once, in `src/pages/index.jsx`, so it cannot happen again, and
the browser test clicks a call-to-action button on every page that has one.

## Website specification of 16 October 2026 (applied to v2 only)

The live Render site is untouched. What changed in v2:

- **Nav:** Home, Services, Resources, Team, Contact Us, with the active page highlighted (the bar becomes a menu
  below 1024px). "Book a Strategy Call" now goes to `/contact`. "Free Quick Look" scrolls to and focuses the
  search bar when the page has one, and opens the form when it does not.
- **Hero:** the slogan is the small tagline, the headline is "Southeast Asia's Brand & Market Intelligence Firm.",
  then "Look. Fix. Count." and the line naming Cambodia and Vietnam. "Optimization engine" is not used. A strip of
  product previews peeks up under the search bar on desktop (the Similarweb reference).
- **Found | Trusted | Reached** is a tab set, one card at a time, with the three micro-buttons. Keyboard (arrows,
  Home, End) and deep links (`/#trusted`) work. All three panels are in the HTML for search engines.
- **Services:** per-step buttons link to `/contact?interest=...` ("Request the 7-Day Sprint", "Discuss the 90-Day
  Blueprint", "Ask about the Retainer"). The Retainer carries an "Ongoing" badge.
  **Market Entry Brief** is a fifth offer, shown on `/international` and in the International / Regional view of
  `/services`, never for local-only businesses. `/services` has the Local Market | International / Regional toggle,
  which changes the "Scope depth" text on each card.
- **Contact:** Telegram, office and email on the left; on the right a form with name, one "business email or Telegram
  handle" field, company or website, primary bottleneck, message and "Send Inquiry". The new fields reach Telegram
  and the lead sheet (columns "Bottleneck" and "Interested in").
  **If the lead sheet was set up before this change,** add those two columns before "Status", or delete the
  "Leads" tab so it is recreated on the next lead.
- **Footer:** the primary button focuses the search bar, the secondary goes to `/contact`.

Where the specification was changed on purpose (all easy to reverse):

- Product names stay **Free Quick Look, 7-Day Sprint, 90-Day Blueprint, Market Intelligence Retainer** (the
  specification used "7-Day Fix", "Growth Blueprint" and "Partner Retainer"), so the day-7, day-35 and 90-day
  timeline still holds together. Rename in `SERVICES` in `src/content/site.js` and `shared/packages.js`.
- The page is called **Services** (`/services`), because it shows no prices. `/pricing` redirects to it.
- Wording that conflicts with the MI voice or cannot be evidenced yet was softened: no "stop bleeding money", no
  "POPULAR" badge, no "predictable outcomes", no "guaranteed within 24 hours" (the reply time is
  `SITE.replyTime`, "within 1 working day"), no "instant automated 360 degree scan" until the scanner exists, no
  "ROI audit" or "AI search rank".
- One button label for the Quick Look ("Request my Free Quick Look"), and the footer headline stays "Every
  engagement starts with the Free Quick Look" because "The Audit" is a retired name.
- Colours are unchanged (`tailwind.config.js`). The specification names #455674 with #2bacc3 and #367b95. Confirm
  whether those are the official values before changing them: #367b95 has low contrast on #455674.

Open: the replacement team photo (needs the file), the intro text above the Found | Trusted | Reached tabs (the
specification left it blank), a real email address for the contact page, the scope and country list for the Market
Entry Brief (its regulatory research is described as public information, not legal advice), and a check that the
Telegram account behind "Connect on Telegram" is monitored.


## German landing page (`/de`)

- **Audience:** companies from Germany, Austria and Switzerland that buy, invest or expand in Cambodia and Vietnam, and regional companies that sell to German-speaking buyers. Leads are tagged "German-speaking (DE)".
- **Content:** all German wording is in `src/content/de.js` (formal "Sie", no dashes, no prices). The page is `src/pages/LandingDe.jsx`. The three checks are cards, not tabs.
- **Language plumbing:** `ModalProvider` takes `lang`; the nav, footer, search bar, example screens, booking dialog, form, field errors and cookie banner switch with it. English pages are unchanged.
- **Also added:** `/datenschutz` (German draft of the privacy policy) and `/impressum` (placeholder, never indexed). The German page is deliberately separate: no English page links to it and there are no `hreflang` pairs (`ALTERNATES` in `scripts/build.mjs`). `/de` does link to the English site, and it is in the sitemap at launch.
- **Kept in English on purpose:** the product names (7-Day Sprint, 90-Day Blueprint, ...), the Telegram and sheet messages the team reads, and the contact page.
- **Needs your decision before launch:**
  1. Whether the Quick Look can really be delivered in German (the page says "Deutsch oder Englisch, wie Sie es wünschen").
  2. The Impressum: postal address, email and the owner's name are missing. A German-language page aimed at German-speaking visitors normally needs them.
  3. Whether EU data protection rules apply (they probably do for this audience) and what that adds to `/datenschutz`. Have both texts reviewed.
  4. A German share image (the page uses the English international one).

### Audience differences (added after the German page)

- The audience switch on `/` and `/international` now says in one line who each page is for.
- Each landing page has its own FAQ (`src/content/faq.js`, `FAQ_BY_AUDIENCE`) and its own FAQPage structured data: local asks where we look (Google, Maps, Facebook, Telegram), international adds the channels for buyers abroad and the Market Entry Brief.
- Not done yet: a separate sample Quick Look per audience, and a "which direction?" question in the hero (sell in the region, into it, or out of it).

# Mekong Intelligence website v2 (preview build)

A new multi-page site built around the free **Quick Look**. It lives in its own folder so the current
live site (repo root, served by `server.js` on Render) is untouched. Deploy this folder to a sample
Vercel project to review it. **Do not point the public domain at it until the Quick Look scanner is built.**

## Pages

| Route | What it is |
| --- | --- |
| `/` | Gateway: brand headline, Quick Look search, a clear choice between the two landing pages |
| `/local` | Landing page for businesses selling in Cambodia and the Mekong region |
| `/international` | Landing page for companies selling across borders, into the region or out of it |
| `/resources` | Three practical guide grids: AI search, footprint auditing, conversion |
| `/pricing` | The four steps: what is included, timeline, scope. **No prices yet** (see below) |
| `/team` | About Us: founder profile and how we work (`/about` redirects here) |
| `/contact` | Message form, Telegram link, Phnom Penh office |
| `/privacy` | Draft privacy policy |

### How the two audiences are split

`/local` and `/international` are **one page template** (`src/pages/Landing.jsx`) fed by two entries in
`src/content/audiences.js`. Hero line, the three Found / Trusted / Reached examples, and the Sprint note
change per audience. Everything else is shared, so a fix lands on both pages at once.

- `/` is the neutral entry point for search, referrals and the nav. It never auto-redirects by IP or language.
- Campaigns, QR codes and Telegram bios should link straight to `/local` or `/international`.
- The Local | International switch at the top of each landing page lets a visitor change their mind.
- Every request carries its audience (and which card was clicked) into the Telegram message, so you can
  see which page produced a lead.
- Assumed meaning, easy to change in `audiences.js`: **local** = sells to customers in Cambodia and the
  Mekong region (Google Maps, Facebook, Telegram, Messenger); **international** = sells across borders
  (Google, AI answers, LinkedIn, email).

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
| Hero copy, facts, Rhythm steps, the four services, nav | `src/content/site.js` |
| Local / International wording and examples | `src/content/audiences.js` |
| Resources guides | `src/content/resources.js` |
| Page titles and descriptions | `src/content/pages.js` |
| Package and audience names (form, page and Telegram share them) | `shared/packages.js` |
| Team, Contact, Pricing, Privacy text | `src/pages/*.jsx` |
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

- **No prices.** The brand rules say not to quote prices while Cambodia pricing is tested. `/pricing`
  shows timeline, scope and inclusions, with "Shared after your Quick Look". Set real values in
  `PRICE_LABEL` in `src/pages/Pricing.jsx` when agreed.
- **"Subscribe Now" is "Request the Retainer".** There is no checkout; every paid step opens a request form.
- **Full Build and the Dashboard add-on are gone.** The Dashboard is now part of the Retainer, as in the brief.
- **Day 35 recount** stays under the Blueprint card and as its own "Count" node in the Rhythm, as in the brief.
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

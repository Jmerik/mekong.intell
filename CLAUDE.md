# Mekong Intelligence (MI) website: project guide for Claude

Read this first. It holds the standing rules and the map of the repository. Details live in `v2/README.md`,
`v2/docs/scanner-setup.md` and `HANDOFF.md`.

## What this repository is
- **Root** (`server.js`, `public/`, `src/`): the OLD site, an Express app. It is live on Render and was only touched for the audit fixes (`AUDIT-LOG.md`). Do not change it unless asked.
- **`v2/`**: the NEW site. A static, pre-rendered React site plus Vercel serverless functions. All current work happens here.
- Hosting: Vercel project `mekong-intelligence-v2` (Root Directory `v2`, production branch `main`). It is a sample deployment behind Vercel login protection and set to noindex until launch.

## Standing rules (brand and voice)
- Consultative voice: plain short sentences, evidence only, no crisis language, no hype ("guaranteed", "stop bleeding money").
- Write " - " instead of em or en dashes, in copy, code strings and reports.
- Ratings are exactly **Strong / Developing / Priority focus** (or N/A when not assessed). No red/green scores, no school grades.
- Anything that cannot be verified is marked **N/A**. Never estimate. Every finding names its source and date. Public information only.
- No prices in anything a prospect sees. Nothing recommends a "Tier 0". Product names: Free Quick Look, 7-Day Sprint, 90-Day Blueprint, Market Intelligence Retainer, Market Entry Brief.
- The Found / Trusted / Reached framing is the core of the offer.
- Do not state unverified claims (the EuroCham claim on the Team page is still open, see `v2/README.md`). Do not guess people's pronouns.
- Contact email, postal address and the Impressum details do not exist yet: leave them as "to follow", never invent them.

## Standing rules (how to work)
- Do not open pull requests unless asked. Do not merge to `main` without the owner's review. Never force-push.
- Never set secrets or API keys on the owner's behalf, and never run anything that spends real money (live search, Claude or email APIs) without approval.
- The scanner's per-scan cap of 0.20 USD is a hard ceiling in code (`v2/api/_lib/scan/config.js`). Do not raise it. Keep the scanner off by default.
- Deploy only to the sample Vercel project. Do not point the live domain anywhere without being asked.
- Verify before claiming: run the build and tests, and for UI changes drive the pages in a browser at phone, tablet and desktop widths.

## v2 map
- `v2/src/content/`: all copy (`site.js`, `audiences.js`, `faq.js`, `guides.js`, `sample.js`, `de.js`, `pages.js`). Edit copy here.
- `v2/src/components/`, `v2/src/pages/`: React. Pages are registered in `content/pages.js` and `pages/index.jsx`.
- `v2/scripts/build.mjs`: builds `dist/` (esbuild + Tailwind), pre-renders every page, writes sitemap and structured data. `scripts/serve.mjs`: local server (`npm run dev`).
- `v2/api/book.js`: lead form (Telegram + Google Sheet). `api/verify.js`: email confirmation. `api/scan-admin.js`: owner controls. `api/_lib/scan/`: the scanner.
- Audiences: `/` local, `/international`, and `/de` (German, deliberately not linked from the English pages). `/local` and `/pricing` redirect, `/about` redirects to `/team`.
- Build switches: `NOINDEX` (on by default; `0` at launch), `PREVIEW_BANNER`, `SITE_URL`, `GA_ID`.

## Commands (run in `v2/`)
- `npm install`, `npm run build`, `npm start` (serves `dist/` with the API on port 3000), `npm test` (all tests use simulated providers, no network).
- There is no linter. Browser checks were done with Playwright against the local server; those scripts are not in the repository.

## The automatic Quick Look scanner (built, OFF by default)
Flow: visitor requests a Quick Look, the lead is saved, a confirmation email goes out, the visitor presses a button, the scan runs
(website, up to 5 web searches, 1 to 2 assistant checks), and a draft goes to Telegram and the sheet for review.
Limits: 0.20 USD per scan, 2.00 USD per day to start (adjustable through `/api/scan-admin`, never above a ceiling set in Vercel), 40 USD per month.
No page text is ever given to a model, ratings come from fixed rules, and reports are validated before sending. It can also scan a public
Facebook, Instagram or Telegram page (only Found is rated). Setup, keys and every guard: `v2/docs/scanner-setup.md`.
It has only been tested with simulated providers.

## Current state and what is open
See `HANDOFF.md`. In short: the site is built and deployed as a sample; Phase 4 (launch readiness) is not done; the keys, legal texts and several content items need the owner.

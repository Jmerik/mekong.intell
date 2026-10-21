# Handoff: moving the project to the new MI account

Date of this note: 2026-10-21. Written so a new owner and a new Claude account can continue without the old conversation.

## 1. Where everything is
| Thing | Location | Notes |
|---|---|---|
| Code | GitHub `Jmerik/mekong.intell` | To be moved to the new owner. `main` holds the merged work; the latest branch is `claude/quirky-cerf-yjma0u` (see section 3). |
| Hosting | Vercel project `mekong-intelligence-v2` (Hobby, team `jmeriks-projects`) | Connected to the GitHub repo, Root Directory `v2`, production branch `main`. |
| Old live site | Render (repository root, Express) | Stays as is until launch. |
| Lead notifications | Telegram bot and chat | Variables `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. |
| Lead record | Google Sheet + Apps Script web app | Script in `v2/docs/lead-sheet.gs`, steps in `v2/docs/lead-sheet-setup.md`. |
| Domain | `mekongintel.live` | Not yet pointed at the new site. |

## 2. Transfer steps (repository and Vercel both move)
Do them in this order, and keep the old owner's access until the end of step 5.
1. **Merge first.** Make sure the open work is on `main` (section 3), so the new owner receives one clean state.
2. **GitHub:** the old owner transfers the repository (Settings > General > Danger zone > Transfer) to the new account or organisation. GitHub keeps issues, history and PRs. Re-check branch protection afterwards. The old URL redirects.
3. **New Claude account:** connect GitHub (claude.ai/connect-github) and install the Claude GitHub app on the moved repository. Start a session on the repository; `CLAUDE.md` loads automatically.
4. **Vercel:** either transfer the project (Project > Settings > General > Transfer Project) or create a new project from the moved repository with Root Directory `v2`, framework "Other", build command `npm run build`, output `dist`. In both cases:
   - reconnect the Git integration to the moved repository;
   - re-create the environment variables (section 4); values cannot be exported;
   - check Deployment Protection (the sample must stay private until launch);
   - create the new owner's own Vercel token if deploying from the command line. The old project and team IDs must not be reused.
5. **Telegram:** the bot belongs to whoever created it in BotFather. Either keep it and share the token and chat ID with the new owner, or create a new bot and chat and update the two variables.
6. **Google Sheet:** transfer the sheet to the new Google account, then re-deploy the Apps Script web app from that account. This gives a new `LEAD_SHEET_WEBHOOK_URL`. Keep the same `LEAD_SECRET` script property or update `LEAD_SHEET_SECRET` to match.
7. **Domain:** when it is time, the new owner holds the registrar and DNS logins.
8. **Old side clean-up:** revoke the old Vercel token, remove old collaborators and old Telegram and Google access, and delete the old Vercel team's copy of the project once the new one works.

## 3. State of the code
- `main` contains the v2 site, the German page, the scanner (off by default) and a social-page Quick Look option (merged from another session).
- Branch `claude/quirky-cerf-yjma0u` adds on top of `main`: the removal of the partner entry from the Team page and these two documents. It needs to be merged into `main` (open a pull request; none was opened because that needs the owner's say).
- Tests: `cd v2 && npm test` (all pass at the time of writing).

## 4. Environment variables (names only; set in Vercel > Settings > Environment Variables)
- **Lead pipeline:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `LEAD_SHEET_WEBHOOK_URL`, `LEAD_SHEET_SECRET`.
- **Site and launch:** `SITE_URL`, `NOINDEX` (set `0` at launch), `PREVIEW_BANNER`, `GA_ID`.
- **Scanner, required to switch it on:** `SCAN_ENABLED=1`, `ANTHROPIC_API_KEY`, `BRAVE_API_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, and a Redis store (`KV_REST_API_URL` + `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`).
- **Scanner, strongly recommended:** `SCAN_ADMIN_TOKEN` (24+ random characters).
- **Scanner, optional:** `SCAN_AUTOSEND`, `SCAN_DAILY_BUDGET_USD`, `SCAN_DAILY_CEILING_USD`, `SCAN_MONTHLY_BUDGET_USD`, `SCAN_MAX_COST_PER_SCAN_USD`, `SCAN_MODEL`, `SCAN_WEB_SEARCH_TOOL`, `SCAN_SEARCH_PRICE_USD`.
- The new owner should create these accounts under their own name so billing and spend limits are theirs: Anthropic (own workspace with a spend limit), Brave Search API, Resend (with a verified sender domain), a Redis store.

## 5. Still open (needs the owner)
- **Scanner pilot:** the keys, then about 20 real scans with every draft reviewed. It has only been tested with simulated providers.
- **Legal:** Impressum details (address, email, owner name); review of the English and German privacy texts; whether EU data protection rules apply to the German page.
- **Business answers:** can the Quick Look be delivered in German; confirm the "within 1 working day" reply time; Market Entry Brief countries and wording.
- **Content:** a real contact email; the intro text above the Found / Trusted / Reached tabs; Vosumtey Seng's pronouns; the EuroCham claim (needs a public source or softer wording); a German share image; the colour palette decision; check that the Telegram account behind "Connect on Telegram" is monitored.
- **Brand documents:** update the MI brand guide and the audit and teaser templates to the unified product names.
- **Phase 4, launch readiness:** decide the Vercel plan (Hobby is meant for non-commercial use), set `NOINDEX=0`, `GA_ID` and `SITE_URL`, remove the `X-Robots-Tag` header from `v2/vercel.json`, add Vercel WAF rate limiting in front of `/api/book`, point the domain, retire the old Render site, submit the sitemap in Search Console and mark `generate_lead` as a key event in Analytics.
- **Skills and connectors:** the MI brand and audit skills and the Gmail, Drive, Sheets and Calendar connections belong to the old account. Install or connect them again in the new one.

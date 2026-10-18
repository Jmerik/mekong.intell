# Automatic Quick Look scanner: setup and safety

The scanner is **off** until you set it up. Until then the site works exactly as before: every Quick Look request
goes to Telegram and the lead sheet and is prepared by hand.

## What happens when it is on

1. A visitor requests a Quick Look. The lead is saved to Telegram and the sheet first, as always.
2. If every guard allows it, the visitor gets a **confirmation email**. Nothing is scanned yet.
3. The email link opens a page with a button. Pressing it confirms the request (single use, 24 hours).
4. The scan runs in the background: the website itself (free), up to 5 web searches, and 1 to 2 AI assistant checks.
   Many Cambodian businesses have no website, so a visitor may give a social page link or just a name instead, plus an
   optional city or province. Nothing on the social page itself is fetched: the page is looked up by its handle in the
   web searches and the assistant check. In that case only the **Found** area is rated and the other two say N/A and why.
   The report is never sent automatically, because there is no website domain to match the requester's email against.
5. A **draft report** arrives in Telegram and the sheet. Only when `SCAN_AUTOSEND=1` and the requester's email is on
   the scanned domain is the report emailed automatically; otherwise you review and send it.

No page text is ever given to an AI model. Ratings come from fixed rules. Every finding names its source and date.

## Spending limits

| Limit | Value | Can it change? |
|---|---|---|
| Per scan | **0.20 USD**, enforced before every paid step | Lowered with `SCAN_MAX_COST_PER_SCAN_USD`. Never raised above 0.20 (fixed in code). |
| Per day | **2.00 USD** to start | `POST /api/scan-admin` at any time, no redeploy. Never above `SCAN_DAILY_CEILING_USD` (default 20, set only in Vercel). |
| Per month | 40 USD | `SCAN_MONTHLY_BUDGET_USD` |

At about 0.07 to 0.15 USD per scan, 2.00 USD a day is roughly 13 to 28 scans. When a limit is reached, new requests
fall back to the manual queue and you get a Telegram note. Alerts arrive at 50%, 80% and 100% of the day's limit.

Each paid step reserves its worst-case cost first (atomically, so parallel scans cannot overshoot) and is corrected to
the real cost afterwards. A step that fails with a clear error reply is not counted; an unclear failure (timeout) is
counted in full. Honest limit: one provider call could in theory cost more than its reservation; the reservation is
sized with margin, and the real cost is what gets recorded.

**Also set limits at the providers** (they hold even if our code has a bug): an Anthropic workspace spend limit, the
search plan's own cap, and Vercel spend management.

## Setup checklist

1. **Redis store** (shared counters, rate limits, confirmation tokens). Add the Redis integration in the Vercel
   Marketplace (it sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`), or Upstash directly (`UPSTASH_REDIS_REST_URL`,
   `UPSTASH_REDIS_REST_TOKEN`). Without a store the scanner stays off on purpose: limits cannot be enforced.
2. **Keys** (you create them, then set them in Vercel > Settings > Environment Variables):
   `ANTHROPIC_API_KEY` (own workspace with a spend limit), `BRAVE_API_KEY`, `RESEND_API_KEY`, `MAIL_FROM`
   (for example `Mekong Intelligence <quicklook@yourdomain>`, a domain verified with the email provider).
3. **Admin token:** `SCAN_ADMIN_TOKEN`, a long random value (at least 24 characters). Without it `/api/scan-admin` does not exist.
4. **Site address:** `SITE_URL` (the public address, used in the confirmation link).
5. **Switch on:** `SCAN_ENABLED=1`, redeploy. Leave `SCAN_AUTOSEND` unset for now (review every draft).
6. **Pilot:** request a Quick Look for a business you know, from a work email on that domain. Check the email, the
   button page, the Telegram draft, the sheet row and the cost line. Read the draft critically.

## Day-to-day control (no redeploy)

```bash
# status
curl -s https://YOUR-SITE/api/scan-admin -H "Authorization: Bearer $SCAN_ADMIN_TOKEN"
# stop all automatic scans now
curl -s -X POST https://YOUR-SITE/api/scan-admin -H "Authorization: Bearer $SCAN_ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"enabled":false}'
# change the daily limit
curl -s -X POST https://YOUR-SITE/api/scan-admin -H "Authorization: Bearer $SCAN_ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"dailyLimitUsd":3.5}'
```

## Guards, in the order a request meets them

- Honeypot and the existing in-memory rate limit (`/api/book`).
- Only a website address, a public Facebook, Instagram or Telegram page link, or a company name is accepted: no IP addresses, ports, other schemes, credentials or internal names. From a social link only the page handle is kept; share links, logins, groups, posts and profiles by number go to the manual queue.
- Disposable email addresses go to the manual queue.
- Budget and kill switch checked before an email is sent.
- Shared limits: 3 requests per network address per hour, 2 per email address per day, 30 confirmation emails per hour overall.
- The same website, or the same social page, is scanned once per 30 days (claimed when the visitor confirms).
- Confirmation email, single-use link, opened with a button (link scanners cannot trigger a scan).
- Website fetching cannot reach internal addresses (private, loopback, link-local and cloud-metadata ranges are refused,
  re-checked at connect time and after each redirect), only ports 80 and 443, at most 3 pages, 400 KB, 6 seconds,
  `robots.txt` respected, redirects only within the same site, identified as `MekongIntelligenceBot`.
- The AI assistant sees only a sanitised name or domain inside a fixed question. Its answer text is thrown away; only
  two yes/no facts are kept. It has one tool (one web search) and cannot send anything.
- A report that breaks the brand rules (dashes, links, markup, missing source or date) fails validation and is never sent automatically.
- Automatic sending only to an address on the scanned domain (not Gmail and similar), and only after `SCAN_AUTOSEND=1`.

## Not covered yet

- No CAPTCHA (the email confirmation and limits do that job). Cloudflare Turnstile can be added later.
- Tested with simulated providers only: the first real run against the live search, assistant and email services is the pilot.
  The assistant uses Claude's basic web search tool (`SCAN_WEB_SEARCH_TOOL`); if the API rejects it, that check shows as N/A and costs nothing.
- Reports are written in English. German visitors get German emails and pages.
- Vercel's Hobby plan is meant for non-commercial use. Check the plan before the real launch.

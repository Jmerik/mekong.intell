# Mekong Intelligence website

Marketing site and booking API for [mekongintel.live](https://mekongintel.live/).

## How it fits together

| Path | What it is |
| --- | --- |
| `src/App.jsx` | The page (React). Edit content here. |
| `src/index.html` | HTML shell: meta tags, structured data, fonts, analytics. |
| `src/privacy.html`, `src/404.html` | Privacy policy and "page not found" pages. |
| `src/styles.css`, `tailwind.config.js` | Tailwind setup and brand colours. |
| `shared/packages.js` | Package and goal names, shared by the page and the API. |
| `lib/lead.js` | Booking form validation and the Telegram message format. |
| `server.js` | Express server: static files, `/api/book`, security headers, rate limiting, 404s. |
| `scripts/build.mjs` | Builds `public/` (JS bundle, CSS, pre-rendered HTML). |
| `scripts/images.mjs` | Regenerates the web images in `public/` from the originals in `assets/`. |
| `public/` | What gets served. **Generated files are committed**, so the host only needs `npm start`. |

## Commands

```bash
npm install
npm run build    # after any change in src/, shared/ or tailwind.config.js; commit public/ too
npm test         # booking validation + Telegram formatting tests
npm start        # http://localhost:3000
npm run images   # only after replacing a file in assets/
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot that posts new leads. |
| `TELEGRAM_CHAT_ID` | Chat the leads are posted to. |
| `PORT` | Set by the host; defaults to 3000. |

Without the Telegram variables (e.g. locally), leads are printed to the server log instead.
If Telegram rejects a message in production, the visitor sees an error with a Telegram link,
and the full lead is written to the server log so it can be followed up by hand.

Change history and the audit write-up: see [AUDIT-LOG.md](AUDIT-LOG.md).

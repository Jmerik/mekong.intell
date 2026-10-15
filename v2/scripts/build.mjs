// Builds the static site into dist/:
//   1. bundles src/client.jsx (React + all pages) into dist/assets/app.js
//   2. compiles Tailwind into dist/assets/styles.css
//   3. pre-renders every page in src/content/pages.js to its own HTML file
//   4. copies static/ (images, icons) and writes robots.txt (+ sitemap.xml when indexing is allowed)
//
// Environment variables (all optional):
//   SITE_URL        Public address used in canonical and share tags. Defaults to the Vercel URL, then https://mekongintel.live
//   NOINDEX         Anything except "0" keeps the site out of search engines (default). Set NOINDEX=0 at launch.
//   PREVIEW_BANNER  "0" hides the preview banner. Defaults to hidden once NOINDEX=0, shown otherwise.
//   GA_ID           Google Analytics measurement ID. Analytics (and the cookie banner) are left out when empty.
//                   Analytics only loads in the browser after a visitor accepts the cookie banner.
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => path.join(root, 'src', p);
const out = (p) => path.join(root, 'dist', p);
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);

const env = process.env;
const noindex = env.NOINDEX !== '0';
const showBanner = (env.PREVIEW_BANNER ?? (noindex ? '1' : '0')) === '1';
const gaId = (env.GA_ID || '').trim();
const siteUrl = (env.SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'https://mekongintel.live')).replace(/\/$/, '');

fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
fs.mkdirSync(out('assets'), { recursive: true });
fs.cpSync(path.join(root, 'static'), out('.'), { recursive: true });

// Self-hosted font (SIL Open Font License): one variable file, latin subset, plus its license.
const fontDir = path.join(root, 'node_modules', '@fontsource-variable', 'inter');
fs.mkdirSync(out('fonts'), { recursive: true });
fs.copyFileSync(path.join(fontDir, 'files', 'inter-latin-wght-normal.woff2'), out('fonts/inter-latin-wght-normal.woff2'));
fs.copyFileSync(path.join(fontDir, 'LICENSE'), out('fonts/LICENSE.txt'));

const define = {
    'process.env.NODE_ENV': '"production"',
    'process.env.PREVIEW_BANNER': JSON.stringify(showBanner ? '1' : '0'),
    'process.env.GA_ID': JSON.stringify(gaId)
};

await build({
    entryPoints: [src('client.jsx')],
    outfile: out('assets/app.js'),
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2019'],
    jsx: 'automatic',
    define,
    legalComments: 'none',
    logLevel: 'warning'
});

execFileSync(path.join(root, 'node_modules', '.bin', 'tailwindcss'),
    ['-c', path.join(root, 'tailwind.config.js'), '-i', src('styles.css'), '-o', out('assets/styles.css'), '--minify'],
    { cwd: root, stdio: 'ignore', env: { ...env, BROWSERSLIST_IGNORE_OLD_DATA: '1' } });

// Server-side bundle, used only to pre-render. It lives in node_modules so require('react') resolves.
const ssrFile = path.join(root, 'node_modules', '.cache', 'mi-ssr', 'ssr.cjs');
await build({
    entryPoints: [src('ssr.jsx')],
    outfile: ssrFile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    jsx: 'automatic',
    packages: 'external',
    define,
    logLevel: 'warning'
});
const require = createRequire(path.join(root, 'package.json'));
const { PAGES, renderPage, FAQ } = require(ssrFile);

const organization = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Mekong Intelligence',
    url: `${siteUrl}/`,
    logo: `${siteUrl}/image/logo.webp`,
    image: `${siteUrl}/image/og-image.png`,
    description: "Brand and market intelligence for businesses in Cambodia and Vietnam. A free Quick Look shows whether your business is Found, Trusted and Reached.",
    sameAs: ['https://t.me/mekongintelligence', 'https://www.linkedin.com/in/vosumtey-seng/'],
    founder: { '@type': 'Person', name: 'Vosumtey Seng', jobTitle: 'Founder & Chief Strategist', url: 'https://www.linkedin.com/in/vosumtey-seng/' },
    address: { '@type': 'PostalAddress', addressLocality: 'Phnom Penh', addressCountry: 'KH' },
    areaServed: [{ '@type': 'Country', name: 'Cambodia' }, { '@type': 'Country', name: 'Vietnam' }],
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Intelligence Services',
        itemListElement: ['Free Quick Look', '7-Day Sprint', '90-Day Blueprint', 'Market Intelligence Retainer'].map((name) => ({
            '@type': 'Offer', itemOffered: { '@type': 'Service', name }
        }))
    }
};
const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vosumtey Seng',
    jobTitle: 'Founder & Chief Strategist',
    image: `${siteUrl}/image/vosumtey.webp`,
    url: 'https://www.linkedin.com/in/vosumtey-seng/',
    worksFor: { '@type': 'ProfessionalService', name: 'Mekong Intelligence', url: `${siteUrl}/` }
};
// FAQPage: built from the same text visitors read (src/content/faq.js).
const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
};
const article = (page) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.article.headline,
    description: page.description,
    datePublished: page.article.published,
    dateModified: page.article.modified,
    author: { '@type': 'Organization', name: 'Mekong Intelligence', url: `${siteUrl}/` },
    publisher: { '@type': 'Organization', name: 'Mekong Intelligence', logo: { '@type': 'ImageObject', url: `${siteUrl}/image/logo.webp` } },
    mainEntityOfPage: `${siteUrl}${page.path}`,
    image: `${siteUrl}${page.ogImage || '/image/og-image.png'}`
});
const jsonLd = (page) => {
    const kinds = [].concat(page.jsonLd || []);
    const blocks = kinds.map((kind) => (kind === 'organization' ? organization : kind === 'person' ? person : kind === 'faq' ? faqPage : kind === 'article' ? article(page) : null)).filter(Boolean);
    return blocks.map((data) => `    <script type="application/ld+json">${JSON.stringify(data)}</script>\n`).join('');
};

const template = fs.readFileSync(src('template.html'), 'utf8');
const cssHash = hash(out('assets/styles.css'));
const jsHash = hash(out('assets/app.js'));
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const page of PAGES) {
    const html = template
        .replaceAll('%%TITLE%%', escapeAttr(page.title))
        .replaceAll('%%DESCRIPTION%%', escapeAttr(page.description))
        .replaceAll('%%URL%%', `${siteUrl}${page.path === '/' ? '/' : page.path}`)
        .replaceAll('%%SITE%%', siteUrl)
        .replaceAll('%%ROBOTS%%', noindex || page.alwaysNoindex ? 'noindex, nofollow' : 'index, follow')
        .replaceAll('%%OG_IMAGE%%', `${siteUrl}${page.ogImage || '/image/og-image.png'}`)
        .replace('%%JSONLD%%', () => jsonLd(page))
        .replace('%%CSS_HASH%%', cssHash)
        .replace('%%JS_HASH%%', jsHash)
        .replace('%%PAGE%%', page.id)
        .replace('%%APP%%', () => renderPage(page.id));
    fs.mkdirSync(path.dirname(out(page.file)), { recursive: true });
    fs.writeFileSync(out(page.file), html);
}

if (noindex) {
    fs.writeFileSync(out('robots.txt'), 'User-agent: *\nDisallow: /\n');
} else {
    fs.writeFileSync(out('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
    const urls = PAGES.filter((p) => !p.excludeFromSitemap)
        .map((p) => `  <url><loc>${siteUrl}${p.path === '/' ? '/' : p.path}</loc></url>`).join('\n');
    fs.writeFileSync(out('sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

const kb = (f) => `${(fs.statSync(out(f)).size / 1024).toFixed(1)} KB`;
console.log(`Built ${PAGES.length} pages for ${siteUrl} (${noindex ? 'noindex' : 'indexable'}, banner ${showBanner ? 'on' : 'off'}, analytics ${gaId ? 'on' : 'off'})`);
console.log(`assets/app.js ${kb('assets/app.js')} | assets/styles.css ${kb('assets/styles.css')} | index.html ${kb('index.html')}`);

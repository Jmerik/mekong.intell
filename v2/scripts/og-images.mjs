// Regenerates the share images (1200x630) used when a page is shared on Facebook, LinkedIn, Telegram or X.
// Needs sharp, which is not a dependency of this project. Run once after changing the wording:
//   npm install --no-save sharp && node scripts/og-images.mjs
// Output goes to static/image/ and is committed.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DARK = '#202a3a';

const CARDS = [
    { file: 'og-local.png', kicker: 'FREE QUICK LOOK', sub1: 'Brand and market intelligence for', sub2: 'businesses in Cambodia and Vietnam.' },
    { file: 'og-international.png', kicker: 'FREE QUICK LOOK', sub1: 'Brand and market intelligence for companies', sub2: 'selling into or out of Cambodia and Vietnam.' }
];

const text = (y, size, fill, content, extra = '') =>
    `<text x="500" y="${y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${size}" fill="${fill}" ${extra}>${content}</text>`;

const logo = await sharp(path.join(root, 'static/image/logo.webp')).resize({ height: 300 }).png().toBuffer();

for (const card of CARDS) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#50c6e9"/><stop offset="1" stop-color="#4a7ea9"/></linearGradient></defs>
        <rect width="1200" height="630" fill="${DARK}"/><rect width="1200" height="8" fill="url(#g)"/>
        ${text(185, 26, '#50c6e9', card.kicker, 'font-weight="bold" letter-spacing="3"')}
        ${text(255, 54, '#ffffff', 'Stop Guessing.', 'font-weight="bold"')}
        ${text(318, 54, '#ffffff', 'Start Growing', 'font-weight="bold"')}
        ${text(381, 54, '#50c6e9', 'with Data.', 'font-weight="bold"')}
        ${text(450, 26, '#e3edf1', card.sub1)}
        ${text(488, 26, '#e3edf1', card.sub2)}
    </svg>`;
    await sharp(Buffer.from(svg)).composite([{ input: logo, left: 150, top: 165 }]).png({ compressionLevel: 9, palette: true }).toFile(path.join(root, 'static/image', card.file));
    console.log('wrote static/image/' + card.file);
}

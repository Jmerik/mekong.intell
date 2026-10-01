// Regenerates the web images in public/ from the originals in assets/.
// Run with `npm run images` after replacing assets/MI_Logo_NoText.png or assets/vosumtey.jpg.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const asset = (p) => path.join(root, 'assets', p);
const out = (p) => path.join(root, 'public', p);
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const DARK = '#202a3a';

// Logo: crop the transparent padding so it can be shown small and still be legible.
const logo = await sharp(asset('MI_Logo_NoText.png')).trim({ threshold: 10 }).toBuffer();
await sharp(logo).resize({ height: 256 }).webp({ quality: 85 }).toFile(out('image/logo.webp'));

const icon = async (size, pad, background, file) => {
    const inner = await sharp(logo).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background }).toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background } })
        .composite([{ input: inner, left: pad, top: pad }]).png().toFile(out(file));
};
await icon(32, 2, clear, 'favicon-32.png');
await icon(180, 20, DARK, 'apple-touch-icon.png');

// Founder photo.
await sharp(asset('vosumtey.jpg')).resize(800, 800).webp({ quality: 80 }).toFile(out('image/vosumtey.webp'));

// Social share card (1200x630) for Facebook, LinkedIn, Telegram, X.
const text = (y, size, fill, content, extra = '') =>
    `<text x="500" y="${y}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${size}" fill="${fill}" ${extra}>${content}</text>`;
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#50c6e9"/><stop offset="1" stop-color="#4a7ea9"/></linearGradient></defs>
    <rect width="1200" height="630" fill="${DARK}"/><rect width="1200" height="8" fill="url(#g)"/>
    ${text(230, 30, '#50c6e9', 'MEKONG INTELLIGENCE', 'font-weight="bold" letter-spacing="3"')}
    ${text(310, 56, '#ffffff', 'Stop Guessing.', 'font-weight="bold"')}
    ${text(380, 56, '#ffffff', 'Start Growing.', 'font-weight="bold"')}
    ${text(450, 26, '#e3edf1', 'Brand &amp; market intelligence for SMEs')}
    ${text(490, 26, '#e3edf1', 'in Cambodia and Southeast Asia.')}
</svg>`;
const cardLogo = await sharp(logo).resize({ height: 300 }).png().toBuffer();
await sharp(Buffer.from(card))
    .composite([{ input: cardLogo, left: 150, top: 165 }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(out('image/og-image.png'));

console.log('Images written to public/ and public/image/');

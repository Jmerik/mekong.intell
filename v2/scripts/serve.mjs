// Local server for testing: serves dist/ the way Vercel does (clean URLs, 404 page) and runs api/book.js.
// Usage: npm run build && npm start   (PORT defaults to 3000)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const require = createRequire(import.meta.url);
const apiHandlers = {
    '/api/book': require(path.join(root, 'api', 'book.js')),
    '/api/verify': require(path.join(root, 'api', 'verify.js')),
    '/api/scan-admin': require(path.join(root, 'api', 'scan-admin.js'))
};
// Same redirects as Vercel, read from vercel.json so the two cannot drift apart.
const redirects = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')).redirects || [];

const TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml', '.json': 'application/json'
};

function findFile(urlPath) {
    const clean = decodeURIComponent(urlPath).replace(/\/+$/, '') || '/index';
    const candidates = [clean, `${clean}.html`, path.join(clean, 'index.html')];
    for (const candidate of candidates) {
        const full = path.resolve(dist, `.${candidate}`);
        if (!full.startsWith(dist + path.sep)) return null; // stay inside dist/
        if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
    }
    return null;
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');

    const redirect = redirects.find((r) => r.source === url.pathname);
    if (redirect) {
        res.writeHead(redirect.permanent ? 308 : 307, { Location: redirect.destination });
        return res.end();
    }

    if (apiHandlers[url.pathname]) {
        // Same shape as the Vercel runtime: parsed req.body, res.status().json().
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        try { req.body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch { req.body = undefined; }
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
        req.query = Object.fromEntries(url.searchParams);
        res.setHeader = res.setHeader.bind(res);
        return apiHandlers[url.pathname](req, res);
    }

    const file = findFile(url.pathname);
    if (file) {
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        return fs.createReadStream(file).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(dist, '404.html')).pipe(res);
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Serving dist/ on http://localhost:${port}`));

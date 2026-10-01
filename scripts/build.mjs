// Builds the static site into public/:
//   1. bundles src/client.jsx (React + app code) into public/assets/app.js
//   2. compiles Tailwind into public/assets/styles.css
//   3. pre-renders <App /> to HTML so visitors and crawlers get real content without waiting for JavaScript
//   4. writes public/index.html, public/privacy.html and public/404.html with cache-busting hashes
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => path.join(root, 'src', p);
const out = (p) => path.join(root, 'public', p);
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);

fs.mkdirSync(out('assets'), { recursive: true });

await build({
    entryPoints: [src('client.jsx')],
    outfile: out('assets/app.js'),
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2019'],
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    legalComments: 'none',
    logLevel: 'warning'
});

execFileSync(path.join(root, 'node_modules', '.bin', 'tailwindcss'),
    ['-c', path.join(root, 'tailwind.config.js'), '-i', src('styles.css'), '-o', out('assets/styles.css'), '--minify'],
    { cwd: root, stdio: 'ignore', env: { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: '1' } });

// Inside node_modules so the bundle's require('react') resolves to this project's copy.
const ssrFile = path.join(root, 'node_modules', '.cache', 'mi-ssr', 'app.cjs');
await build({
    entryPoints: [src('App.jsx')],
    outfile: ssrFile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    jsx: 'automatic',
    packages: 'external',
    logLevel: 'warning'
});
const require = createRequire(path.join(root, 'package.json'));
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require(ssrFile).default;
const appHtml = renderToString(React.createElement(App));

const fill = (html) => html
    .replace('__CSS_HASH__', hash(out('assets/styles.css')))
    .replace('__JS_HASH__', hash(out('assets/app.js')))
    .replace('<!--app-->', appHtml);

for (const page of ['index.html', 'privacy.html', '404.html']) {
    fs.writeFileSync(out(page), fill(fs.readFileSync(src(page), 'utf8')));
}

for (const f of ['assets/app.js', 'assets/styles.css', 'index.html']) {
    console.log(`${f.padEnd(18)} ${(fs.statSync(out(f)).size / 1024).toFixed(1)} KB`);
}

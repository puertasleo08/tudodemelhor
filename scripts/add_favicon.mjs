import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const iconLine =
  '  <link rel="icon" type="image/jpeg" href="assets/ui/logo-site/logo-tudo-melhor.jpeg">\n';
const files = readdirSync(root).filter((f) => f.endsWith('.html'));

let added = 0;
let skipped = 0;

for (const file of files) {
  const fp = join(root, file);
  let html = readFileSync(fp, 'utf8');
  if (html.includes('href="assets/ui/logo-site/logo-tudo-melhor.jpeg"')) {
    skipped += 1;
    console.log('skip', file);
    continue;
  }
  if (!html.includes('<title>')) {
    console.error('NO TITLE', file);
    continue;
  }
  html = html.replace(/^[ \t]*<title>/m, `${iconLine}  <title>`);
  html = html.replace(
    /\n[ \t]*<link rel="icon" href="https:\/\/i\.imgur\.com\/8XBidtc\.png">/,
    ''
  );
  writeFileSync(fp, html, 'utf8');
  added += 1;
  console.log('ok', file);
}

console.log(`added ${added} skipped ${skipped} total ${files.length}`);

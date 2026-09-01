import { readFileSync, writeFileSync } from 'fs';

const AFFILIATE_LINKS = [
  { name: 'Oimotoo S6', link: 'https://meli.la/1eqMgcv' },
  { name: 'UCITYS', link: 'https://meli.la/1gT9Gkw' },
  { name: 'Honeywhale S6-S', link: 'https://meli.la/1MDt7cC' },
  { name: 'Bike 400W', link: 'https://meli.la/16hjFVz' },
  { name: 'V9 Max', link: 'https://meli.la/2VBFMUG' },
  { name: 'Tomate 350W', link: 'https://meli.la/17mcYdW' },
  { name: 'Nado K3', link: 'https://meli.la/1GuHCbJ' },
];

function extractImages(text) {
  const urls = [...text.matchAll(/https?:\/\/http2\.mlstatic\.com\/[^"'\\s<>]+/g)].map((m) => m[0]);
  const product = urls.filter((u) => /D_[NQ]_NP|D_Q_NP/.test(u));
  const normalized = product.map((u) =>
    u
      .replace(/-V\.webp.*/, '-O.webp')
      .replace(/-F\.webp.*/, '-O.webp')
      .replace(/-S\.webp.*/, '-O.webp')
      .replace(/-M\.webp.*/, '-O.webp')
      .replace(/-B\.webp.*/, '-O.webp')
      .replace(/-C\.webp.*/, '-O.webp')
      .replace(/-R\.webp.*/, '-O.webp')
      .replace(/-I\.webp.*/, '-O.webp')
      .replace(/-W\d+\.webp.*/, '-O.webp')
      .replace(/-N\.webp.*/, '-O.webp')
  );
  return [...new Set(normalized)].filter((u) => u.endsWith('-O.webp') || u.endsWith('.jpg'));
}

async function scrapeAffiliate(link) {
  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY || ''}`,
    },
    body: JSON.stringify({
      url: link,
      formats: ['html', 'links'],
      waitFor: 5000,
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
  return res.json();
}

async function main() {
  const dumpPath = process.argv[2];
  if (dumpPath) {
    const text = readFileSync(dumpPath, 'utf8');
    console.log(JSON.stringify(extractImages(text), null, 2));
    return;
  }
  console.log('Usage: node extract_ml_images.mjs <html-dump-file>');
}

main().catch(console.error);

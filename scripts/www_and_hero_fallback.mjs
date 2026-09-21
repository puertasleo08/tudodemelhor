import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = join(import.meta.dirname, '..');
const FROM = 'https://tudodemelhor.com.br';
const TO = 'https://www.tudodemelhor.com.br';
const FROM_ENC = 'https%3A%2F%2Ftudodemelhor.com.br';
const TO_ENC = 'https%3A%2F%2Fwww.tudodemelhor.com.br';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'agent-tools',
  'scripts'
]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const fp = join(dir, name);
    const st = statSync(fp);
    if (st.isDirectory()) walk(fp, acc);
    else acc.push(fp);
  }
  return acc;
}

function replaceDomain(text) {
  return text.split(FROM_ENC).join(TO_ENC).split(FROM).join(TO);
}

function extractGalleryCover(html) {
  const jsonMatch = html.match(/data-gallery-images='(\[[\s\S]*?\])'/);
  if (jsonMatch) {
    try {
      const arr = JSON.parse(jsonMatch[1]);
      if (arr[0]?.url) {
        return { url: arr[0].url, alt: arr[0].alt || 'Foto do produto' };
      }
    } catch {
      /* fall through */
    }
  }
  const thumb = html.match(
    /<img src="([^"]+)" alt="([^"]*)" class="product-gallery-thumb/
  );
  if (thumb) return { url: thumb[1], alt: thumb[2] || 'Foto do produto' };
  return null;
}

function injectHeroFallback(html) {
  if (!html.includes('hero-video-wrap')) return { html, injected: false, reason: 'no-wrap' };
  if (html.includes('hero-video-fallback')) return { html, injected: false, reason: 'already' };
  if (!/<video[\s\S]*?lazy-hero-video/.test(html)) {
    return { html, injected: false, reason: 'no-video' };
  }

  const cover = extractGalleryCover(html);
  if (!cover) return { html, injected: false, reason: 'no-cover' };

  const alt = cover.alt
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
  const fallback = `<img src="${cover.url}" alt="${alt}" class="hero-video-fallback absolute inset-0 w-full h-full object-cover z-0" loading="eager" decoding="async" referrerpolicy="no-referrer">\n              `;

  let next = html.replace(
    /(<div class="hero-video-wrap[^"]*">)(\s*)(<video)/,
    `$1$2${fallback}$3`
  );

  next = next.replace(
    /class="lazy-hero-video absolute inset-0 h-full w-full rounded-2xl object-cover"/g,
    'class="lazy-hero-video absolute inset-0 z-10 h-full w-full rounded-2xl object-cover bg-transparent"'
  );

  if (next === html) return { html, injected: false, reason: 'no-match' };
  return { html: next, injected: true, reason: 'ok' };
}

const files = walk(root).filter((fp) => {
  const ext = extname(fp).toLowerCase();
  const base = fp.replace(/\\/g, '/');
  if (base.includes('/PRODUTO/') && ext === '.txt') return true;
  if (['.html', '.xml', '.txt'].includes(ext) && !base.split('/').pop().startsWith('_') && !base.includes('/.')) {
    return true;
  }
  return false;
});

let domainHits = 0;
for (const fp of files) {
  const original = readFileSync(fp, 'utf8');
  const updated = replaceDomain(original);
  if (updated !== original) {
    writeFileSync(fp, updated, 'utf8');
    domainHits += 1;
    console.log('www', fp.replace(root, '').replace(/^[\\/]/, ''));
  }
}

const reviews = readdirSync(root).filter((f) => f.startsWith('review-') && f.endsWith('.html'));
for (const file of reviews) {
  const fp = join(root, file);
  const original = readFileSync(fp, 'utf8');
  const { html, injected, reason } = injectHeroFallback(original);
  if (injected) {
    writeFileSync(fp, html, 'utf8');
    console.log('hero', file, reason);
  } else {
    console.log('skip', file, reason);
  }
}

console.log(`domain files: ${domainHits}; reviews: ${reviews.length}`);

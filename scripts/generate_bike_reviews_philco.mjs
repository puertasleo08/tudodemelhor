import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTEXTO_PATH = join(ROOT, 'PRODUTO', 'BICICLETA-ELETRICA', 'contexto.seo.md.txt');

const RANK_TO_SLUG = {
  1: 'review-oimotoo-s6',
  2: 'review-xroymexroy-ucitys',
  3: 'review-honeywhale-s6-s',
  4: 'review-bike-dobravel-400w',
  5: 'review-v9-max',
  6: 'review-tomate-350w',
  7: 'review-nado-k3',
};

function escapeHtmlAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeGalleryUrl(raw) {
  if (!raw) return '';
  let url = String(raw).replace(/\r/g, '').trim();
  const mdMatch = url.match(/\((https?:\/\/[^)\s]+)\)/);
  if (mdMatch) url = mdMatch[1];
  url = url.replace(/^\[?(https?:\/\/[^\]\s]+)\]?.*$/, '$1');
  return url.replace(/\s+/g, '');
}

function cleanContextLine(line) {
  return String(line).replace(/\r/g, '');
}

function isGalleryLine(line) {
  const t = line.trimStart();
  if (!t) return true;
  if (t.startsWith('-')) return true;
  if (/^url:/i.test(t)) return true;
  if (/^alt:/i.test(t)) return true;
  return false;
}

function parseGalleryUrlFromLine(line) {
  const urlField = line.match(/url:\s*(.+)/i);
  if (urlField) return normalizeGalleryUrl(urlField[1]);
  const bare = line.match(/^\s+-\s+(https?:\/\/\S+)\s*$/i);
  if (bare) return normalizeGalleryUrl(bare[1]);
  return '';
}

/** Lê imagens_galeria da Seção 3 do contexto.seo.md.txt */
function parseContextoGalleries(filePath) {
  if (!existsSync(filePath)) return {};
  const text = readFileSync(filePath, 'utf8');
  const result = {};

  for (let rank = 1; rank <= 7; rank++) {
    const slug = RANK_TO_SLUG[rank];
    const blockStart = text.search(new RegExp(`^${rank}\\. `, 'm'));
    if (blockStart === -1) continue;

    const rest = text.slice(blockStart + 1);
    const blockEnd =
      rank < 7
        ? rest.search(new RegExp(`^${rank + 1}\\. `, 'm'))
        : rest.search(/^## 4\./m);
    const block = blockEnd === -1 ? text.slice(blockStart) : text.slice(blockStart, blockStart + 1 + blockEnd);

    const galleryIdx = block.indexOf('imagens_galeria:');
    if (galleryIdx === -1) {
      result[slug] = [];
      continue;
    }

    const lines = block.slice(galleryIdx).split('\n').slice(1);
    const images = [];
    let current = null;

    for (const rawLine of lines) {
      const line = cleanContextLine(rawLine);
      if (!isGalleryLine(line)) break;

      const url = parseGalleryUrlFromLine(line);
      const altMatch = line.match(/alt:\s*(.+)/i);

      if (url) {
        current = { url };
        images.push(current);
      } else if (altMatch && current) {
        current.alt = altMatch[1].trim();
      }
    }

    result[slug] = images.filter((img) => img.url.startsWith('http'));
  }

  return result;
}

function resolveGalleryImages(p, contextGalleries) {
  const fromContext = contextGalleries[p.slug] || [];
  const fromProduct = p.galleryImages || [];
  const source = fromContext.length ? fromContext : fromProduct;
  const seen = new Set();

  return source
    .map((item, i) => {
      const url = normalizeGalleryUrl(galleryUrl(item));
      if (!url.startsWith('http') || seen.has(url)) return null;
      seen.add(url);
      const alt = typeof item === 'object' && item.alt ? item.alt : galleryAlt(p, i, item);
      return { url, alt };
    })
    .filter(Boolean);
}

const CHECK_SVG =
  '<svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';

/** Catálogo compartilhado — cards verticais do ranking principal */
const RANKING_CATALOG = {
  'review-oimotoo-s6': {
    rank: 1,
    href: 'review-oimotoo-s6.html',
    brandTag: 'OIMOTOO',
    title: 'S6 Dobrável 450W',
    image: 'https://http2.mlstatic.com/D_NQ_NP_822384-MLB109485329446_042026-O.webp',
    imageAlt: 'Melhor bike elétrica dobrável Oimotoo S6 450W — melhores bicicletas eletricas urbana',
    paraQuem: [
      'Commute urbano dobrável: cabe no elevador e porta-malas com bateria 48V removível.',
      'Melhor custo-benefício dobrável da lista para orçamento até R$ 2.500.',
      'Trajetos planos de até 35 km sem exigir potência extrema em subidas.',
    ],
    scoreDisplay: '97',
    tags: ['Motor 450W', 'Bateria 48V', 'Autonomia 35 km', 'Dobrável'],
    price: 'R$ 2.446',
    mlLink: 'https://meli.la/1eqMgcv',
  },
  'review-xroymexroy-ucitys': {
    rank: 2,
    href: 'review-xroymexroy-ucitys.html',
    brandTag: 'XROYMEXROY',
    title: 'UCITYS 750W',
    image: 'https://http2.mlstatic.com/D_NQ_NP_809321-MLA111871083304_062026-O.webp',
    imageAlt: 'Bicicleta elétrica Xroymexroy UCITYS 750W aro 26 — bicicleta eletrica melhor custo beneficio',
    paraQuem: [
      'Deslocamento diário de 15–25 km com folga em rampas moderadas.',
      'Quem prefere visual de bike clássica aro 26 em vez de scooter.',
      'Equilíbrio entre motor 750W e preço intermediário.',
    ],
    scoreDisplay: '94',
    tags: ['Motor 750W', 'Aro 26', 'Bateria removível', 'Quadro rebaixado'],
    price: 'R$ 4.379',
    mlLink: 'https://meli.la/1gT9Gkw',
  },
  'review-honeywhale-s6-s': {
    rank: 3,
    href: 'review-honeywhale-s6-s.html',
    brandTag: 'HONEYWALE',
    title: 'S6-S 750W',
    image: 'https://http2.mlstatic.com/D_NQ_NP_801018-MLA115363054279_072026-O.webp',
    imageAlt: 'Honeywhale S6-S bike eletrica dobrável 750W fat tire — melhores bicicletas eletricas',
    paraQuem: [
      'Calçadas irregulares e vias com buracos: fat tire + motor 750W.',
      'Uso urbano com carga até 125 kg e cesto para compras.',
      'Quem quer robustez dobrável com autonomia de 40 km.',
    ],
    scoreDisplay: '93',
    tags: ['Motor 750W', 'Autonomia 40 km', 'Fat tire', 'Cesto'],
    price: 'R$ 3.799',
    mlLink: 'https://meli.la/1MDt7cC',
  },
  'review-bike-dobravel-400w': {
    rank: 4,
    href: 'review-bike-dobravel-400w.html',
    brandTag: 'DOBRÁVEL',
    title: '400W 48V 10Ah',
    image: 'https://http2.mlstatic.com/D_NQ_NP_708869-MLB97636357574_112025-O.webp',
    imageAlt: 'Bicicleta elétrica dobrável 400W 48V 10Ah suspensão urbana — melhor bike eletrica entrada',
    paraQuem: [
      'Primeira bike elétrica: entrada honesta com 48V 10Ah e suspensão.',
      'Apartamento pequeno: formato compacto e dobrável para guardar.',
      'Trajetos planos de até 20 km sem subidas íngremes.',
    ],
    scoreDisplay: '91',
    tags: ['Motor 400W', '48V 10Ah', 'Suspensão', 'Dobrável'],
    price: 'R$ 3.609',
    mlLink: 'https://meli.la/16hjFVz',
  },
  'review-v9-max': {
    rank: 5,
    href: 'review-v9-max.html',
    brandTag: 'V9 MAX',
    title: '1000W Street Go',
    image: 'https://http2.mlstatic.com/D_NQ_NP_872353-MLB115691776769_082026-O.webp',
    imageAlt: 'Bike elétrica V9 Max 1000W freio hidráulico — melhor bicicleta eletrica potente',
    paraQuem: [
      'Substituir carro ou moto em trajetos longos com subidas.',
      'Exige frenagem confiável: freio hidráulico dianteiro e traseiro.',
      'Prioriza potência (1000W) e autonomia de 48 km.',
    ],
    scoreDisplay: '89',
    tags: ['Motor 1000W', 'Autonomia 48 km', 'Freio hidráulico', 'Street Go'],
    price: 'R$ 7.890',
    mlLink: 'https://meli.la/2VBFMUG',
  },
  'review-tomate-350w': {
    rank: 6,
    href: 'review-tomate-350w.html',
    brandTag: 'TOMATE',
    title: '350W Aro 26',
    image: 'https://http2.mlstatic.com/D_NQ_NP_833188-MLB114054554339_072026-O.webp',
    imageAlt: 'Bicicleta elétrica Tomate 350W aro 26 pedal assistido — melhores marcas de bike eletrica urbana',
    paraQuem: [
      'Ciclovias e vias planas com visual discreto de bicicleta convencional.',
      'Pedal assistido para quem não quer parecer scooter elétrico.',
      'Conforto urbano com suspensão dupla aro 26.',
    ],
    scoreDisplay: '88',
    tags: ['Motor 350W', 'Aro 26', 'Pedal assistido', 'Suspensão dupla'],
    price: 'R$ 4.488',
    mlLink: 'https://meli.la/17mcYdW',
  },
  'review-nado-k3': {
    rank: 7,
    href: 'review-nado-k3.html',
    brandTag: 'NADO',
    title: 'K3 750W',
    image: 'https://http2.mlstatic.com/D_NQ_NP_898691-MLB113402906913_062026-O.webp',
    imageAlt: 'Nado K3 750W scooter aro 20 bateria lítio removível — melhores bicicletas eletricas utilitárias',
    paraQuem: [
      'Entregas leves e commute multimodal em corredores apertados.',
      'Bateria de lítio 48V removível para carregar no destino.',
      'Aro 20 ágil com motor 750W para manobras urbanas.',
    ],
    scoreDisplay: '86',
    tags: ['Motor 750W', '48V Lítio', 'Aro 20', 'Bateria removível'],
    price: 'R$ 5.791',
    mlLink: 'https://meli.la/1GuHCbJ',
  },
};

function hasGallery(p) {
  return Boolean(p.galleryImages && p.galleryImages.length);
}

function renderAltCard(slug) {
  const c = RANKING_CATALOG[slug];
  if (!c) return '';

  const paraQuemHtml = c.paraQuem
    .map(
      (text) =>
        `<li class="flex gap-2 text-sm text-brand-muted">${CHECK_SVG}<span>${text}</span></li>`
    )
    .join('\n              ');

  const tagsHtml = c.tags
    .map(
      (t) =>
        `<span class="rounded-md bg-brand-elevated/90 px-2.5 py-1 text-[11px] text-brand-muted">${t}</span>`
    )
    .join('\n              ');

  return `<article class="glass relative flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-glow">
            <span class="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-black shadow-glow" aria-label="Posição ${c.rank}">${c.rank}</span>
            <div class="mx-auto mt-8 flex h-44 w-full items-center justify-center">
              <img src="${c.image}" alt="${c.imageAlt}" class="max-h-44 w-full object-contain" width="400" height="400" loading="lazy">
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="rounded border border-brand-yellow/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-yellow">${c.brandTag}</span>
              <h3 class="text-lg font-bold text-white">${c.title}</h3>
            </div>
            <div class="mt-3 flex-1">
              <div class="mb-3 flex items-center gap-2"><span class="text-violet-400">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-2">
              ${paraQuemHtml}
              </ul>
            </div>
            <div class="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Nota Tudo de Melhor</span>
              <div class="leading-none"><span class="text-3xl font-bold text-brand-yellow">${c.scoreDisplay}</span><span class="text-sm text-brand-dim">/100</span></div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              ${tagsHtml}
            </div>
            <div class="mt-5 border-t border-white/10 pt-4">
              <p class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Melhor preço</p>
              <p class="text-xl font-bold text-white">${c.price}</p>
              <div class="mt-3 flex flex-col gap-2">
                <a class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-yellow px-4 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" href="${c.mlLink}">Comprar no Mercado Livre</a>
                <a class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-yellow bg-transparent px-4 text-sm font-bold text-brand-yellow transition hover:bg-brand-yellow/10" href="${c.href}">Ver Análise Completa</a>
              </div>
            </div>
          </article>`;
}

/** Caminho do MP4 local a partir do slug da página (ex: review-oimotoo-s6 → videos/oimotoo-s6.mp4) */
function heroVideoPath(p) {
  if (p.videoFile) return p.videoFile;
  return `videos/${p.slug.replace(/^review-/, '')}.mp4`;
}

function hasHeroVideo(p) {
  return Boolean(p.videoFile || p.videoUrl || p.videoId);
}

function galleryUrl(item) {
  return typeof item === 'string' ? item : item.url;
}

function galleryAlt(p, index, item) {
  if (typeof item === 'object' && item.alt) return item.alt;
  return `Foto ${index + 1} — ${p.brand} ${p.modelShort || p.model}`;
}

function renderGallery(p) {
  const images = p.galleryImages;
  if (!images?.length) return '';

  const payload = images
    .map((item, i) => ({
      url: normalizeGalleryUrl(typeof item === 'string' ? item : item.url),
      alt: typeof item === 'object' && item.alt ? item.alt : galleryAlt(p, i, item),
    }))
    .filter((item) => item.url.startsWith('http'));

  if (!payload.length) return '';

  const dataJson = JSON.stringify(payload).replace(/'/g, '&#39;');

  const thumbs = payload
    .map(
      (item, i) =>
        `<img src="${escapeHtmlAttr(item.url)}" alt="${escapeHtmlAttr(item.alt)}" class="product-gallery-thumb h-16 w-16 shrink-0 cursor-pointer rounded-lg border border-white/10 object-cover transition hover:border-brand-yellow/40 hover:ring-1 hover:ring-brand-yellow/30" data-index="${i}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer" width="64" height="64">`
    )
    .join('\n            ');

  return `<div class="product-gallery mt-4" aria-label="Galeria de fotos do produto" data-gallery-images='${dataJson}'>
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Fotos do produto</p>
            <div class="flex flex-wrap gap-2">${thumbs}</div>
          </div>`;
}

function renderStickyBar(p) {
  const productLabel = `${p.brand} ${p.modelShort || p.model}`;
  return `<div class="fixed bottom-0 z-50 w-full border-t border-slate-800 bg-slate-900/95 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div class="min-w-0 w-full text-center sm:w-auto sm:text-left">
        <strong class="block truncate text-base text-white sm:text-lg">${productLabel}</strong>
        <div class="text-base font-bold text-brand-yellow">Nota ${p.score} · a partir de ${p.priceDisplay}</div>
      </div>
      <a class="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg transition-all hover:bg-yellow-500 sm:w-auto" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Comprar no Mercado Livre</a>
    </div>
  </div>`;
}

function renderHeroVideo(p) {
  const videoTitle = `Review ${p.brand} ${p.modelShort || p.model}`;
  const src = heroVideoPath(p);
  return `<div class="hero-video-wrap relative mx-auto aspect-[9/16] h-full w-full max-h-full max-w-[min(100%,315px)] overflow-hidden rounded-2xl bg-black/20 shadow-lg">
              <video
                class="lazy-hero-video absolute inset-0 h-full w-full rounded-2xl object-cover"
                data-src="${src}"
                preload="none"
                muted
                playsinline
                loop
                aria-label="${videoTitle}"
              ></video>
            </div>`;
}

function renderHeroMedia(p) {
  const caption = p.heroCaption || `${p.brand} ${p.model}`;

  if (hasHeroVideo(p)) {
    return `<div class="glass relative order-1 flex h-full min-h-[420px] flex-col overflow-hidden p-5 shadow-glow-emerald md:order-2 md:min-h-0 md:p-6">
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-brand-yellow/5"></div>
          <div class="relative flex min-h-0 flex-1 items-center justify-center">
            ${renderHeroVideo(p)}
          </div>
          <p class="relative mt-4 text-center text-xs text-brand-dim">${caption}</p>
        </div>`;
  }

  return `<div class="glass relative order-1 flex flex-col overflow-hidden p-5 shadow-glow-emerald md:order-2 md:p-6">
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-brand-yellow/5"></div>
          <div class="relative flex flex-1 items-center justify-center rounded-2xl bg-white p-6">
            <img src="${p.image}" alt="${p.imageAlt}" class="max-h-[280px] w-full object-contain drop-shadow-2xl" width="480" height="480">
          </div>
          <p class="relative mt-4 text-center text-xs text-brand-dim">${caption}</p>
        </div>`;
}

const products = [
  {
    slug: 'review-xroymexroy-ucitys',
    rank: 2,
    brand: 'Xroymexroy',
    model: 'UCITYS 750W',
    modelShort: 'UCITYS',
    breadcrumbName: 'UCITYS 750W',
    videoUrl: '',
    videoFile: 'videos/Bicicleta-xroymexroy-UCITYS-Aro-26-750W.mov',
    heroCaption: 'UCITYS · 750W · aro 26 · bateria removível',
    badge: 'Melhor Custo-Benefício Aro 26',
    h1: 'Xroymexroy UCITYS vale a pena? Análise da bike elétrica aro 26 750W',
    title: 'Review Xroymexroy UCITYS 750W Vale a Pena? Bike Elétrica Aro 26 | Tudo de Melhor',
    description: 'Xroymexroy UCITYS vale a pena? Review da bike elétrica aro 26 750W: bateria removível, quadro rebaixado, nota 9.4 e onde comprar no Mercado Livre.',
    score: '9.4',
    priceDisplay: 'R$ 4.379',
    priceSchema: '4379.00',
    mlLink: 'https://meli.la/1gT9Gkw',
    image: 'https://http2.mlstatic.com/D_NQ_NP_809321-MLA111871083304_062026-O.webp',
    imageAlt: 'Bicicleta elétrica Xroymexroy UCITYS 750W aro 26 com bateria removível',
    galleryImages: [
      {
        url: 'https://http2.mlstatic.com/D_NQ_NP_809321-MLA111871083304_062026-O.webp',
        alt: 'Xroymexroy UCITYS 750W aro 26 — bicicleta elétrica com bateria removível',
      },
    ],
    heroIntro: 'Se você quer uma <strong>bike elétrica</strong> com visual de bicicleta clássica — não scooter — e motor forte o suficiente para rampas moderadas, a Xroymexroy UCITYS é a #2 do ranking: <strong>750W</strong>, bateria removível, aro 26 e quadro rebaixado por cerca de <strong>R$ 4.379</strong> no Mercado Livre.',
    verdictText: 'A UCITYS vale a pena para commute de 15–25 km com subidas moderadas, sem pagar o premium de marcas premium ou modelos de 1000W.',
    paraQuem: 'Quem prefere postura de bike urbana aro 26 e tem espaço para guardar sem dobrar.',
    diferencial: 'Melhor custo-benefício aro 26 com 750W',
    promessa: 'Potência real em rampas com visual clássico e bateria que carrega dentro de casa.',
    pros: [
      'Motor 750W com torque consistente em rampas moderadas',
      'Visual de bicicleta clássica aro 26 — não parece scooter',
      'Bateria removível para carregar no apartamento',
      'Quadro rebaixado facilita embarque e desembarque',
      'Melhor custo-benefício aro 26 do ranking de bikes elétricas',
      'Rodas 26" absorvem melhor irregularidades que aros 14'
    ],
    cons: [
      'Não dobra — exige garagem, varanda ou bicicletário com espaço',
      'Peso maior que dobráveis compactas (~25–28 kg)',
      'Marca Xroymexroy pouco conhecida no Brasil',
      'Preço acima de R$ 4.000 — não é entrada de mercado',
      'Sem suspensão dianteira em todos os anúncios'
    ],
    specs: [
      ['Marca', 'Xroymexroy'],
      ['Modelo', 'UCITYS · bicicleta elétrica aro 26'],
      ['Motor', '750W brushless (roda traseira)'],
      ['Bateria', '48V lítio removível'],
      ['Autonomia', '30–40 km (uso urbano misto)'],
      ['Velocidade máxima', '~32 km/h (assistida)'],
      ['Freios', 'Disco mecânico dianteiro e traseiro'],
      ['Peso suportado', 'Até 120 kg'],
      ['Aro', '26"'],
      ['Quadro', 'Aço rebaixado'],
      ['Tempo de carga', '6 a 7 horas (carregador bivolt)'],
      ['Preço observado', 'A partir de R$ 4.379 (confira o dia)']
    ],
    analysis: {
      title: 'Análise detalhada: avaliação da <span class="text-brand-yellow">bike elétrica Xroymexroy UCITYS</span>',
      intro: 'A pergunta "UCITYS vale a pena?" faz sentido para quem rejeita o formato scooter e quer uma <strong>bicicleta elétrica urbana</strong> com postura familiar de pedal. O motor 750W entrega folga em aclives que um 450W não sustenta — e o aro 26 traz estabilidade que dobráveis de 14" não oferecem. Nesta avaliação, analisamos potência, autonomia, conforto e o trade-off de não dobrar.',
      sections: [
        {
          h3: 'Uso diário e autonomia real',
          body: 'No commute de 15 a 25 km, a UCITYS cobre o trajeto com assistência consistente. O pedal assistido economiza bateria em retas; o acelerador ajuda em semáforos e arrancadas. Autonomia prática: 30–40 km conforme modo, peso e terreno. Em turbo constante com subidas, espere a faixa inferior. Para ida e volta dentro de 18 km, uma carga basta na maioria dos dias.'
        },
        {
          h3: 'Quadro aro 26 e conforto urbano',
          body: 'O aro 26 é o diferencial de postura: você senta como numa bike convencional, não numa scooter elétrica. O quadro rebaixado facilita montar com calça social ou saia — relevante para quem vai ao escritório. Rodas maiores rolam melhor em paralelepípedo e valetas que aros 14 finos. O preço é não dobrar: planeje garagem, varanda ou bicicletário coberto.'
        },
        {
          h3: 'Motor 750W em ladeiras e carga',
          body: 'Com 750W, a UCITYS sobe ladeiras de 8–12% com assistência e pedal moderado — bem acima do que um 450W entrega. Mochila pesada ou cesta não derrubam a performance como em motores de entrada. Para subidas muito íngremes ou off-road agressivo, a V9 Max 1000W ainda tem vantagem de torque — mas custa quase o dobro.'
        },
        {
          h3: 'Compra, entrega e manutenção',
          body: 'Antes de comprar, confira reputação do vendedor no Mercado Livre, frete, garantia e se o carregador bivolt vem incluso. A Xroymexroy é marca importada com presença crescente no ML — peças de desgaste (pastilhas, pneus) são acessíveis, mas assistência técnica pode ser limitada vs. Caloi ou Groove. Mantenha pneus calibrados e bateria entre 20% e 80% quando possível. Evite chuva forte na bateria removível.'
        }
      ]
    },
    faq: [
      ['A Xroymexroy UCITYS vale a pena?', 'Sim, se você quer <strong>bike elétrica aro 26</strong> com motor 750W e bateria removível sem pagar R$ 7.000+. É a melhor custo-benefício aro 26 do ranking.'],
      ['A UCITYS dobra?', 'Não. Se portabilidade é prioridade, veja a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> ou a <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline">Honeywhale S6-S</a>.'],
      ['UCITYS ou Tomate 350W?', 'A Tomate é mais discreta e barata para ciclovias planas. A UCITYS tem mais potência (750W) para rampas e trajetos longos de 20+ km.'],
      ['Qual a autonomia real da UCITYS?', 'Entre <strong>30 e 40 km</strong> em uso urbano misto. Turbo constante e subidas reduzem para ~28 km.'],
      ['A bateria da UCITYS é removível?', 'Sim. O pack sai do quadro para carregar no apartamento — essencial em condomínios sem tomada na garagem.'],
      ['UCITYS ou Honeywhale S6-S?', 'UCITYS: visual clássico aro 26, não dobra, R$ 4.379. Honeywhale: dobrável fat tire 750W, mais conforto em piso ruim, R$ 3.799.']
    ],
    altLinks: ['review-oimotoo-s6', 'review-honeywhale-s6-s'],
    productSchemaName: 'Xroymexroy UCITYS 750W Bicicleta Elétrica Aro 26',
    productDesc: 'Bicicleta elétrica Xroymexroy UCITYS 750W aro 26 com bateria removível. #2 do ranking Tudo de Melhor.'
  },
  {
    slug: 'review-honeywhale-s6-s',
    rank: 3,
    brand: 'Honeywhale',
    model: 'S6-S 750W',
    modelShort: 'S6-S',
    breadcrumbName: 'Honeywhale S6-S',
    videoUrl: 'https://www.youtube.com/shorts/jKyfRbpGSLo',
    videoFile: 'videos/HONEYWHALE-S6-S-Bicicleta-Eletrica.mp4',
    heroCaption: 'S6-S · 750W · fat tire · dobrável · cesto',
    badge: 'Top Choice Dobrável Robusta',
    h1: 'Honeywhale S6-S vale a pena? Análise da bike elétrica dobrável 750W fat tire',
    title: 'Review Honeywhale S6-S 750W Vale a Pena? Bike Elétrica Dobrável Fat Tire | Tudo de Melhor',
    description: 'Honeywhale S6-S vale a pena? Review da bike elétrica dobrável 750W fat tire: autonomia 40 km, cesto, nota 9.3 e onde comprar no Mercado Livre.',
    score: '9.3',
    priceDisplay: 'R$ 3.799',
    priceSchema: '3799.00',
    mlLink: 'https://meli.la/1MDt7cC',
    image: 'https://http2.mlstatic.com/D_NQ_NP_801018-MLA115363054279_072026-O.webp',
    imageAlt: 'Honeywhale S6-S bicicleta elétrica dobrável 750W fat tire com cesto',
    galleryImages: [
      {
        url: 'https://http2.mlstatic.com/D_NQ_NP_801018-MLA115363054279_072026-O.webp',
        alt: 'Honeywhale S6-S 750W dobrável — bike elétrica fat tire vista principal',
      },
    ],
    heroIntro: 'Se suas ruas têm buracos, paralelepípedo e calçadas irregulares, a <strong>Honeywhale S6-S</strong> é a dobrável mais completa do ranking: motor <strong>750W</strong>, <strong>pneus largos (fat tire)</strong>, autonomia de até <strong>40 km</strong>, cesto incluso e quadro dobrável — por cerca de <strong>R$ 3.799</strong> no Mercado Livre.',
    verdictText: 'A Honeywhale S6-S vale a pena quando conforto e torque importam mais que o menor preço. É a dobrável mais robusta para cidade brasileira com piso ruim.',
    paraQuem: 'Commute urbano com buracos, compras no cesto e necessidade de dobrar para guardar.',
    diferencial: 'Dobrável 750W com fat tire e 40 km de autonomia',
    promessa: 'Potência de 750W com estabilidade de pneu largo — dobra para o elevador, aguenta o asfalto ruim.',
    pros: [
      'Motor 750W com torque para subidas e carga no cesto',
      'Fat tire absorve buracos, paralelepípedo e valetas',
      'Autonomia de até 40 km — maior entre as dobráveis do ranking',
      'Cesto incluso para compras e entregas leves',
      'Quadro dobrável com suporte até 125 kg',
      'Freios a disco dianteiro e traseiro'
    ],
    cons: [
      'Mais pesada que dobráveis compactas de 450W (~28–30 kg)',
      'Preço ~R$ 1.350 acima da Oimotoo S6',
      'Formato scooter — não parece bike clássica aro 26',
      'Dobrada ainda ocupa volume considerável no elevador',
      'Bateria removível em alguns lotes — confira o anúncio'
    ],
    specs: [
      ['Marca', 'Honeywhale'],
      ['Modelo', 'S6-S · bicicleta elétrica dobrável fat tire'],
      ['Motor', '750W brushless'],
      ['Bateria', '48V lítio'],
      ['Autonomia', 'Até 40 km (uso urbano misto)'],
      ['Velocidade máxima', '~35 km/h (assistida)'],
      ['Pneus', 'Fat tire largos'],
      ['Freios', 'Disco dianteiro e traseiro'],
      ['Peso suportado', 'Até 125 kg'],
      ['Extras', 'Cesto traseiro · farol LED'],
      ['Quadro', 'Aço dobrável'],
      ['Preço observado', 'A partir de R$ 3.799 (confira o dia)']
    ],
    analysis: {
      title: 'Análise detalhada: avaliação da <strong>bicicleta elétrica Honeywhale S6-S</strong>',
      intro: 'A Honeywhale S6-S ocupa o meio-termo inteligente do ranking: mais potência e conforto que a Oimotoo S6, sem o preço e o volume de uma aro 26 fixa como a UCITYS. Para quem pergunta "Honeywhale S6-S vale a pena?", a resposta depende do piso: em cidade com asfalto irregular, os pneus largos e o motor 750W fazem diferença perceptível no dia a dia.',
      sections: [
        {
          h3: 'Uso diário, cesto e autonomia',
          body: 'O conjunto 750W + 48V entrega até 40 km de autonomia — a maior entre as dobráveis do ranking. Em modo turbo constante e subidas, espere 28–35 km. O cesto traseiro elimina mochila pesada nas costas para mercado e entregas leves. Para trajetos de até 18 km ida e volta, uma carga cobre a semana com folga.'
        },
        {
          h3: 'Fat tire e conforto em piso ruim',
          body: 'Pneus largos reduzem o impacto em buracos e paralelepípedo — diferença clara vs. aro 14 fino da Oimotoo S6. A rodagem é mais estável e previsível em velocidade. O trade-off é peso: espere ~28–30 kg, levantável com esforço moderado. Dobrada, passa em elevadores residenciais, mas ocupa mais volume que uma S6 compacta.'
        },
        {
          h3: 'Motor 750W em subidas e carga',
          body: 'O 750W mantém velocidade em aclives de 8–12% mesmo com peso e cesto carregado — onde um 450W desacelera e drena bateria. Para entregas leves ou commute com mochila, a S6-S entrega torque consistente. Uso profissional intenso (iFood o dia todo) pede Nado K3 ou V9 Max com mais autonomia e robustez.'
        },
        {
          h3: 'Compra, entrega e manutenção',
          body: 'A Honeywhale é uma das marcas mais vendidas de bike elétrica no Mercado Livre — peças e anúncios são abundantes. Confira se o anúncio inclui cesto, carregador bivolt e manual. Evite chuva forte no conector da bateria. Calibre pneus regularmente — fat tire descalibrado aumenta consumo. Lubrifique dobradiças a cada 3 meses se usar dobragem diária.'
        }
      ]
    },
    faq: [
      ['Honeywhale S6-S vale a pena?', 'Sim, para <strong>cidade com piso irregular</strong> e quem precisa dobrar. Entrega 750W, fat tire e 40 km por menos que a UCITYS aro 26.'],
      ['Honeywhale S6-S ou Oimotoo S6?', 'Oimotoo: mais barata (R$ 2.446) e leve, motor 450W. Honeywhale: mais potência, autonomia e conforto em piso ruim por R$ 3.799.'],
      ['A S6-S aguenta entregas?', 'Sim, para entregas leves com cesto. Para uso profissional intenso, considere <a href="review-nado-k3.html" class="text-brand-yellow underline">Nado K3</a> ou <a href="review-v9-max.html" class="text-brand-yellow underline">V9 Max</a>.'],
      ['Qual a autonomia real da Honeywhale S6-S?', 'Entre <strong>28 e 40 km</strong> conforme modo, peso e terreno. Turbo constante reduz para a faixa inferior.'],
      ['A Honeywhale S6-S dobra?', 'Sim. O quadro dobrável reduz volume para elevador e porta-malas — mais volumosa que a Oimotoo S6, mas ainda portátil.'],
      ['Por que a S6-S tem fat tire?', 'Pneus largos absorvem impacto em buracos e paralelepípedo — essencial em cidades brasileiras com asfalto irregular.']
    ],
    altLinks: ['review-oimotoo-s6', 'review-xroymexroy-ucitys'],
    productSchemaName: 'Honeywhale S6-S 750W Bicicleta Elétrica Dobrável',
    productDesc: 'Bicicleta elétrica dobrável Honeywhale S6-S 750W fat tire com autonomia de 40 km. #3 do ranking Tudo de Melhor.'
  }
];

const lote3Products = [
  {
    slug: 'review-bike-dobravel-400w',
    rank: 4,
    brand: 'Dobrável',
    model: '400W 48V 10Ah',
    modelShort: '400W',
    breadcrumbName: 'Bike Dobrável 400W',
    videoUrl: 'https://www.youtube.com/shorts/HRlxg4DXfek',
    videoFile: 'videos/Bicicleta-Eletrica-400w-48v-10ah.mp4',
    heroCaption: '400W · 48V 10Ah · suspensão · dobrável',
    badge: 'Entrada Honesta com Suspensão',
    h1: 'Bike dobrável 400W vale a pena? Análise da bicicleta elétrica 48V 10Ah',
    title: 'Review Bike Elétrica Dobrável 400W 48V 10Ah Vale a Pena? | Tudo de Melhor',
    description: 'Bike dobrável 400W vale a pena? Review da bicicleta elétrica 48V 10Ah com suspensão, nota 9.1 e preço R$ 3.609. Primeira bike elétrica?',
    score: '9.1',
    priceDisplay: 'R$ 3.609',
    priceSchema: '3609.00',
    mlLink: 'https://meli.la/16hjFVz',
    image: 'https://http2.mlstatic.com/D_NQ_NP_708869-MLB97636357574_112025-O.webp',
    imageAlt: 'Bicicleta elétrica dobrável 400W 48V 10Ah com suspensão urbana',
    galleryImages: [
      {
        url: 'https://http2.mlstatic.com/D_NQ_NP_708869-MLB97636357574_112025-O.webp',
        alt: 'Bike elétrica dobrável 400W 48V 10Ah — vista principal do anúncio',
      },
    ],
    heroIntro: 'Esta <strong>bike elétrica dobrável 400W</strong> com bateria <strong>48V 10Ah</strong> e <strong>suspensão dianteira</strong> é a porta de entrada honesta do ranking — nota <strong>9.1</strong> por cerca de <strong>R$ 3.609</strong> no Mercado Livre. Ideal para quem quer testar mobilidade elétrica sem investir em 750W.',
    verdictText: 'Vale a pena como primeira bike elétrica para trajetos planos de até 20 km, com suspensão que ajuda em buracos leves. Não compete em potência com 750W.',
    paraQuem: 'Primeira bike elétrica, apartamento pequeno e trajetos curtos em terreno plano.',
    diferencial: 'Dobrável com suspensão e 48V 10Ah',
    promessa: 'Formato compacto para guardar em casa, com amortecimento básico para o asfalto urbano.',
    pros: [
      'Entrada honesta com 48V 10Ah e suspensão dianteira',
      'Formato dobrável para apartamento e corredor estreito',
      'Suspensão absorve impactos leves em valetas e buracos',
      'Preço intermediário sem exigir motor 750W',
      'Adequada para commute de bairro até 20 km',
      'Freios a disco dianteiro e traseiro'
    ],
    cons: [
      'Motor 400W limitado em subidas íngremes prolongadas',
      'Autonomia de 18–25 km — menor que modelos de 35–40 km',
      'Marca genérica sem rede ampla de assistência',
      'Preço próximo da Oimotoo S6 (450W, mais barata e melhor nota)',
      'Pack 10Ah não é removível em todos os anúncios'
    ],
    specs: [
      ['Marca', 'Genérica / Dobrável'],
      ['Modelo', '400W · bicicleta elétrica dobrável'],
      ['Motor', '400W brushless'],
      ['Bateria', '48V 10Ah lítio'],
      ['Autonomia', '18–25 km (uso urbano misto)'],
      ['Suspensão', 'Dianteira'],
      ['Freios', 'Disco D/T'],
      ['Velocidade máxima', '~25 km/h'],
      ['Peso suportado', 'Até 120 kg'],
      ['Formato', 'Dobrável compacto'],
      ['Tempo de carga', '5 a 6 horas'],
      ['Preço observado', 'A partir de R$ 3.609 (confira o dia)']
    ],
    analysis: {
      title: 'Análise detalhada: avaliação da <span class="text-brand-yellow">bike elétrica dobrável 400W</span>',
      intro: 'A pergunta "vale a pena uma bike 400W?" depende do trajeto. Para bairro plano, mercado e academia num raio de 10 km, o motor de entrada cumpre. A suspensão dianteira diferencia este modelo de dobráveis básicas sem amortecimento — mas compare sempre com a Oimotoo S6, que custa menos e entrega 450W com bateria removível.',
      sections: [
        { h3: 'Uso diário e autonomia real', body: 'Trajetos de 8 a 15 km em terreno plano são o habitat natural. O pack 48V 10Ah entrega 18–25 km conforme modo e peso — suficiente para ida ao trabalho curto, não para commute longo. Uma carga por dia cobre a maioria dos usos de bairro.' },
        { h3: 'Suspensão e conforto urbano', body: 'A suspensão dianteira reduz impacto em valetas e buracos leves — não substitui fat tire, mas melhora o conforto vs. quadros rígidos. O formato dobrável permite guardar em closet ou atrás da porta em apartamentos sem garagem.' },
        { h3: 'Motor 400W: limites reais', body: '400W é motor de entrada. Funciona em plano e aclives muito leves. Ladeiras moderadas exigem pedal forte; íngremes podem ser inviáveis só no motor. Se subidas fazem parte do trajeto diário, a Oimotoo S6 (450W, R$ 2.446) ou Honeywhale S6-S (750W) são upgrades lógicos.' },
        { h3: 'Compra e manutenção', body: 'Confira reputação do vendedor, frete e garantia no Mercado Livre. Peças de desgaste (pastilhas, pneus) são acessíveis. Evite chuva forte no conector da bateria. Calibre pneus regularmente para preservar autonomia.' }
      ]
    },
    faq: [
      ['A bike dobrável 400W vale como primeira bike elétrica?', 'Sim, para trajetos planos curtos. Antes de comprar, compare com a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> — mais barata e com nota superior.'],
      ['Qual a autonomia real?', 'Entre <strong>18 e 25 km</strong> em uso urbano misto. Não espere 35–40 km de modelos superiores.'],
      ['Tem suspensão?', 'Sim, dianteira — ajuda em buracos leves e valetas.'],
      ['400W ou Oimotoo S6 450W?', 'A Oimotoo custa menos (R$ 2.446), tem motor mais forte e bateria 48V removível. Esta 400W só faz sentido se a suspensão for decisiva para você.'],
      ['A bike 400W dobra?', 'Sim. Formato compacto para elevador e porta-malas de hatchback.'],
      ['Quanto tempo para carregar?', 'Carga completa em <strong>5 a 6 horas</strong> com carregador bivolt incluso.']
    ],
    altLinks: ['review-oimotoo-s6', 'review-honeywhale-s6-s'],
    productSchemaName: 'Bicicleta Elétrica Dobrável 400W 48V 10Ah',
    productDesc: 'Bike elétrica dobrável 400W 48V 10Ah com suspensão. #4 do ranking Tudo de Melhor.'
  },
  {
    slug: 'review-v9-max',
    rank: 5,
    brand: 'V9 Max',
    model: '1000W Street Go',
    modelShort: '1000W',
    breadcrumbName: 'V9 Max 1000W',
    videoUrl: 'https://www.youtube.com/shorts/GbcXStDMHjA',
    videoFile: 'videos/Bicicleta-Bike-Eletrica-V9-Max-1000w-48km.mp4',
    heroCaption: 'V9 Max · 1000W · freio hidráulico · 48 km',
    badge: 'Mais Potente do Ranking',
    h1: 'V9 Max vale a pena? Análise da bike elétrica 1000W com freio hidráulico',
    title: 'Review V9 Max 1000W Vale a Pena? Bike Elétrica Street Go | Tudo de Melhor',
    description: 'V9 Max vale a pena? Review da bike elétrica 1000W street go: freio hidráulico, autonomia 48 km, nota 8.9 e preço R$ 7.890 no Mercado Livre.',
    score: '8.9',
    priceDisplay: 'R$ 7.890',
    priceSchema: '7890.00',
    mlLink: 'https://meli.la/2VBFMUG',
    image: 'https://http2.mlstatic.com/D_NQ_NP_872353-MLB115691776769_082026-O.webp',
    imageAlt: 'Bike elétrica V9 Max 1000W street go com freio hidráulico',
    galleryImages: [
      {
        url: 'https://http2.mlstatic.com/D_NQ_NP_872353-MLB115691776769_082026-O.webp',
        alt: 'V9 Max 1000W — bike elétrica potente com freio hidráulico',
      },
    ],
    heroIntro: 'A <strong>V9 Max 1000W</strong> é a <strong>bike elétrica mais potente</strong> do ranking: motor de <strong>1000W</strong>, <strong>freio hidráulico</strong> dianteiro e traseiro, autonomia de até <strong>48 km</strong> — por cerca de <strong>R$ 7.890</strong>. Para quem quer substituir carro ou moto em trajetos longos com subidas.',
    verdictText: 'A V9 Max vale a pena para quem precisa de potência real — subidas, distância e velocidade — e aceita investir no topo da faixa. Não é bike de apartamento.',
    paraQuem: 'Trajetos de 15–30 km com subidas, entregas e quem prioriza torque sobre portabilidade.',
    diferencial: '1000W + freio hidráulico + 48 km',
    promessa: 'A potência máxima do ranking com frenagem confiável para uso intenso.',
    pros: [
      'Motor 1000W — maior torque do ranking',
      'Freio hidráulico D/T para frenagem segura em alta velocidade',
      'Autonomia de até 48 km para commute estendido',
      'Ideal para trajetos longos com subidas íngremes',
      'Street Go robusto para uso intenso e carga',
      'Performance superior a qualquer dobrável 450W'
    ],
    cons: [
      'Preço alto: R$ 7.890 — quase 3× a Oimotoo S6',
      'Não dobra — exige garagem ou espaço amplo',
      'Peso elevado — difícil de carregar em escadas',
      '1000W pode exigir atenção à legislação local',
      'Overkill para commute curto e plano'
    ],
    specs: [
      ['Marca', 'V9 Max'],
      ['Modelo', 'Street Go · bicicleta elétrica 1000W'],
      ['Motor', '1000W brushless'],
      ['Bateria', '48V alta capacidade'],
      ['Autonomia', 'Até 48 km'],
      ['Freios', 'Hidráulico dianteiro e traseiro'],
      ['Velocidade máxima', '~45 km/h (assistida)'],
      ['Peso suportado', 'Até 130 kg'],
      ['Formato', 'Street Go (não dobrável)'],
      ['Aro', '20"'],
      ['Diferencial', 'Mais potente do ranking'],
      ['Preço observado', 'A partir de R$ 7.890 (confira o dia)']
    ],
    analysis: {
      title: 'Análise detalhada: avaliação da <span class="text-brand-yellow">bike elétrica V9 Max 1000W</span>',
      intro: 'A V9 Max ocupa o topo de performance do ranking — e o topo de preço. Se seu trajeto inclui 15–30 km com subidas, carga pesada ou uso profissional leve, o 1000W faz diferença mensurável. Para 5 km planos no bairro, é exagero caro. Nesta análise, avaliamos torque, frenagem, autonomia e o custo-benefício real.',
      sections: [
        { h3: 'Uso diário e autonomia de 48 km', body: 'Com 48 km de autonomia, a V9 Max cobre commute estendido sem recarga no meio do dia. Em turbo constante e subidas, espere 35–42 km. Para entregadores e trajetos longos, é a única do ranking com autonomia e potência nessa faixa.' },
        { h3: 'Freio hidráulico e segurança', body: 'Com 1000W, frenagem é crítica. O freio hidráulico D/T oferece modulação e potência de parada superiores ao disco mecânico — diferencial raro nesta categoria. Em descidas e trânsito denso, a diferença é perceptível. Requer sangria periódica — custo de manutenção maior que freio a cabo.' },
        { h3: 'Motor 1000W em subidas e carga', body: 'A V9 Max sobe ladeiras de 12–15% mantendo velocidade — onde 450W e 750W desaceleram. Entregadores, mochila pesada e terrenos variados são o habitat natural. Verifique normas locais: potências acima de 750W podem ter restrições em algumas cidades.' },
        { h3: 'Compra e manutenção', body: 'Investimento alto exige vendedor confiável no ML, garantia clara e revisão de freios hidráulicos nos primeiros meses. Lubrifique corrente, calibre pneus e evite descarga total da bateria. Para uso profissional intenso, considere segundo pack de bateria.' }
      ]
    },
    faq: [
      ['A V9 Max vale R$ 7.890?', 'Se você precisa de <strong>1000W</strong>, freio hidráulico e 48 km — sim. Para cidade plana e curta, a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> resolve por 1/3 do preço.'],
      ['A V9 Max dobra?', 'Não. Precisa de garagem, varanda ampla ou bicicletário com espaço.'],
      ['V9 Max ou Honeywhale S6-S?', 'Honeywhale: dobrável 750W por R$ 3.799. V9 Max: 1000W, 48 km e freio hidráulico para uso intenso.'],
      ['Qual a autonomia real da V9 Max?', 'Entre <strong>35 e 48 km</strong> conforme modo e terreno. Turbo constante reduz para a faixa inferior.'],
      ['Precisa de CNH para a V9 Max?', 'Depende da classificação local do veículo. Consulte legislação da sua cidade para bikes acima de 750W.'],
      ['V9 Max ou Nado K3?', 'Nado K3: ágil, aro 20, R$ 5.791. V9 Max: mais potência, mais autonomia, freio hidráulico — para uso mais intenso.']
    ],
    altLinks: ['review-honeywhale-s6-s', 'review-nado-k3'],
    productSchemaName: 'V9 Max 1000W Bicicleta Elétrica Street Go',
    productDesc: 'Bike elétrica V9 Max 1000W com freio hidráulico e autonomia de 48 km. #5 do ranking Tudo de Melhor.'
  },
  {
    slug: 'review-tomate-350w',
    rank: 6,
    brand: 'Tomate',
    model: '350W Aro 26',
    modelShort: '350W',
    breadcrumbName: 'Tomate 350W',
    videoUrl: '',
    heroCaption: 'Tomate · 350W · aro 26 · pedal assistido',
    badge: 'Visual Discreto de Bike Clássica',
    h1: 'Tomate 350W vale a pena? Análise da bike elétrica urbana aro 26',
    title: 'Review Tomate 350W Vale a Pena? Bike Elétrica Aro 26 | Tudo de Melhor',
    description: 'Tomate 350W vale a pena? Review da bike elétrica urbana aro 26 com pedal assistido, suspensão dupla, nota 8.8 e preço R$ 4.488.',
    score: '8.8',
    priceDisplay: 'R$ 4.488',
    priceSchema: '4488.00',
    mlLink: 'https://meli.la/17mcYdW',
    image: 'https://http2.mlstatic.com/D_NQ_NP_833188-MLB114054554339_072026-O.webp',
    imageAlt: 'Bicicleta elétrica Tomate 350W aro 26 pedal assistido com suspensão dupla',
    galleryImages: [
      {
        url: 'https://http2.mlstatic.com/D_NQ_NP_833188-MLB114054554339_072026-O.webp',
        alt: 'Tomate 350W aro 26 — bicicleta elétrica pedal assistido urbana',
      },
    ],
    heroIntro: 'A <strong>Tomate 350W aro 26</strong> é a <strong>bike elétrica urbana</strong> mais discreta do ranking: visual de bicicleta convencional, <strong>pedal assistido</strong> e <strong>suspensão dupla</strong> por cerca de <strong>R$ 4.488</strong>. Para ciclovias e vias planas sem parecer scooter elétrico.',
    verdictText: 'A Tomate entrega a experiência mais "bike de verdade" do ranking — pedal assistido discreto e conforto de aro 26. O 350W limita em subidas; é bike de ciclovia, não de morro.',
    paraQuem: 'Ciclovias planas, visual discreto e quem prefere pedal assistido a acelerador de scooter.',
    diferencial: 'Pedal assistido com postura clássica aro 26',
    promessa: 'Mobilidade elétrica sem chamar atenção — parece bicicleta normal na ciclovia.',
    pros: [
      'Visual discreto de bicicleta convencional',
      'Pedal assistido — experiência próxima da bike tradicional',
      'Suspensão dupla aro 26 para conforto urbano',
      'Adequada a ciclovias e vias planas',
      'Postura clássica familiar para quem vem do pedal',
      'Rodas 26" com rolamento suave em asfalto'
    ],
    cons: [
      'Motor 350W — menor potência do ranking',
      'Bateria fixa no quadro (não removível)',
      'Preço R$ 4.488 sem vantagem de 750W',
      'Fraca em subidas e trajetos longos de 20+ km',
      'Autonomia limitada vs. concorrentes do ranking'
    ],
    specs: [
      ['Marca', 'Tomate'],
      ['Modelo', '350W · bicicleta elétrica urbana'],
      ['Motor', '350W pedal assistido'],
      ['Bateria', 'Fixa no quadro'],
      ['Aro', '26"'],
      ['Suspensão', 'Dupla dianteira e traseira'],
      ['Freios', 'V-Brake ou disco (conforme lote)'],
      ['Velocidade máxima', '~25 km/h (assistida)'],
      ['Peso suportado', 'Até 120 kg'],
      ['Formato', 'Urbano aro 26 (não dobrável)'],
      ['Diferencial', 'Visual discreto de bike clássica'],
      ['Preço observado', 'A partir de R$ 4.488 (confira o dia)']
    ],
    analysis: {
      title: 'Análise detalhada: avaliação da <span class="text-brand-yellow">bicicleta elétrica Tomate 350W</span>',
      intro: 'A Tomate 350W é para quem quer mobilidade elétrica sem parecer que anda de scooter. O pedal assistido de 350W complementa seu esforço em ciclovias e vias planas — mas sofre em qualquer aclive moderado. Por R$ 4.488, a concorrência interna do ranking é dura: a UCITYS 750W custa menos e entrega o dobro de potência.',
      sections: [
        { h3: 'Pedal assistido e experiência de uso', body: 'Você pedala; o motor ajuda até ~25 km/h. É a experiência mais próxima de uma bike convencional com superpoder discreto. Diferente de scooters onde o acelerador domina. Ideal para quem já pedala e quer assistência, não substituição total do esforço.' },
        { h3: 'Suspensão dupla e conforto aro 26', body: 'A suspensão dupla no aro 26 absorve irregularidades com mais conforto que quadros rígidos de scooter. Rodas grandes rolam suave em asfalto e ciclovia. O trade-off é a bateria fixa: precisa de tomada na garagem ou área de guarda — não carrega no apartamento como a Oimotoo S6.' },
        { h3: '350W em subidas e distância', body: 'Sejamos diretos: 350W é o motor mais fraco do ranking. Funciona em plano; sofre em aclives moderados. Trajetos de 20+ km com subidas pedem UCITYS 750W ou superior. A Tomate brilha em ciclovia reta de 5–12 km.' },
        { h3: 'Tomate vs. concorrentes do ranking', body: 'Por R$ 4.488, a Xroymexroy UCITYS (R$ 4.379) tem 750W e bateria removível. A Oimotoo S6 (R$ 2.446) dobra e tem 450W. Escolha a Tomate quando discreção visual e pedal assistido pesam mais que watts — não quando performance é prioridade.' }
      ]
    },
    faq: [
      ['A Tomate 350W vale a pena?', 'Para <strong>ciclovias planas</strong> e quem quer visual discreto. Para potência, olhe a <a href="review-xroymexroy-ucitys.html" class="text-brand-yellow underline">UCITYS 750W</a>.'],
      ['A bateria da Tomate é removível?', 'Não — carrega no local de guarda. Precisa de tomada na garagem ou bicicletário.'],
      ['Tomate ou UCITYS?', 'Tomate: discreta, 350W, pedal assistido. UCITYS: 750W, bateria removível, mais barata e mais potente.'],
      ['A Tomate dobra?', 'Não. Exige espaço de guarda como bike convencional aro 26.'],
      ['Qual a autonomia da Tomate 350W?', 'Varia conforme lote — espere <strong>20–30 km</strong> em uso urbano moderado com pedal assistido.'],
      ['Tomate ou Oimotoo S6?', 'Oimotoo: dobrável, mais barata, 450W, bateria removível. Tomate: visual clássico aro 26, pedal assistido discreto.']
    ],
    altLinks: ['review-xroymexroy-ucitys', 'review-oimotoo-s6'],
    productSchemaName: 'Tomate 350W Bicicleta Elétrica Aro 26',
    productDesc: 'Bicicleta elétrica urbana Tomate 350W aro 26 com pedal assistido. #6 do ranking Tudo de Melhor.'
  },
  {
    slug: 'review-nado-k3',
    rank: 7,
    brand: 'Nado',
    model: 'K3 750W',
    modelShort: 'K3',
    breadcrumbName: 'Nado K3',
    videoUrl: 'https://www.youtube.com/shorts/_Zwl_6D32BQ',
    videoFile: 'videos/Nado-K3-Bicicleta-Eletrica.mp4',
    heroCaption: 'Nado K3 · 750W · aro 20 · bateria removível',
    badge: 'Utilitária Ágil Aro 20',
    h1: 'Nado K3 vale a pena? Análise da bike elétrica scooter 750W aro 20',
    title: 'Review Nado K3 750W Vale a Pena? Bike Elétrica Utilitária | Tudo de Melhor',
    description: 'Nado K3 vale a pena? Review da bike elétrica scooter 750W aro 20: bateria 48V removível, nota 8.6 e preço R$ 5.791. Ideal para entregas?',
    score: '8.6',
    priceDisplay: 'R$ 5.791',
    priceSchema: '5791.00',
    mlLink: 'https://meli.la/1GuHCbJ',
    image: 'https://http2.mlstatic.com/D_NQ_NP_898691-MLB113402906913_062026-O.webp',
    imageAlt: 'Nado K3 750W scooter elétrico aro 20 com bateria 48V removível',
    galleryImages: [
      {
        url: 'https://http2.mlstatic.com/D_NQ_NP_898691-MLB113402906913_062026-O.webp',
        alt: 'Nado K3 750W aro 20 — scooter elétrico utilitário vista principal',
      },
    ],
    heroIntro: 'O <strong>Nado K3 750W</strong> é a <strong>bike elétrica utilitária</strong> do ranking: motor <strong>750W</strong>, <strong>aro 20</strong> ágil, <strong>bateria 48V removível</strong> — por cerca de <strong>R$ 5.791</strong>. Pensado para entregas leves, commute multimodal e manobras em corredores apertados.',
    verdictText: 'O K3 é ágil e prático para uso utilitário urbano — entregas, última milha e trajetos com muitas paradas. A nota 8.6 reflete preço alto para o pacote.',
    paraQuem: 'Entregas leves, commute multimodal e quem precisa de agilidade em espaços apertados.',
    diferencial: '750W + bateria removível + aro 20 ágil',
    promessa: 'Manobrabilidade de scooter com potência de 750W e bateria que carrega fora da bike.',
    pros: [
      'Motor 750W para manobras e subidas urbanas moderadas',
      'Bateria 48V lítio removível — carrega no destino',
      'Aro 20 ágil em corredores e calçadas estreitas',
      'Formato compacto para entregas leves',
      'Boa para commute multimodal (metrô + bike)',
      'Segundo pack de bateria dobra autonomia operacional'
    ],
    cons: [
      'Preço R$ 5.791 sem freio hidráulico',
      'Aro 20 menos estável que aro 26 em alta velocidade',
      'Formato scooter — não é bike clássica',
      'Nota mais baixa do ranking (8.6)',
      'Honeywhale S6-S oferece dobrável + cesto por R$ 3.799'
    ],
    specs: [
      ['Marca', 'Nado'],
      ['Modelo', 'K3 · scooter elétrico utilitário'],
      ['Motor', '750W brushless'],
      ['Bateria', '48V 15Ah lítio removível'],
      ['Aro', '20"'],
      ['Autonomia', '25–35 km'],
      ['Freios', 'Disco D/T'],
      ['Peso suportado', 'Até 120 kg'],
      ['Formato', 'Scooter utilitário'],
      ['Tempo de carga', '5 a 7 horas'],
      ['Diferencial', 'Agilidade urbana + bateria removível'],
      ['Preço observado', 'A partir de R$ 5.791 (confira o dia)']
    ],
    analysis: {
      title: 'Análise detalhada: avaliação da <span class="text-brand-yellow">bike elétrica Nado K3</span>',
      intro: 'O Nado K3 ocupa o nicho utilitário do ranking: ágil como scooter, potente como 750W, com bateria que sai do quadro. Para entregas leves e commute com muitas paradas, o aro 20 permite manobras que uma aro 26 não faz. O preço de R$ 5.791 é o ponto fraco — concorrentes dobráveis custam menos.',
      sections: [
        { h3: 'Uso utilitário e entregas leves', body: 'O K3 foi pensado para quem para e sai 20 vezes por turno — entregas de comida, encomendas pequenas, última milha após metrô. O formato compacto passa em corredores estreitos e vias compartilhadas. Para entregas intensas o dia todo, a V9 Max 1000W ou um segundo pack de bateria são upgrades lógicos.' },
        { h3: 'Bateria 48V removível', body: 'A bateria de lítio 48V removível permite carregar no destino — útil para entregadores que fazem pausa em ponto de apoio. Com segundo pack, dobra a autonomia operacional sem parar para carga de 6 horas. Carga completa em 5–7 horas com carregador bivolt.' },
        { h3: 'Aro 20 e agilidade urbana', body: 'O aro 20 troca estabilidade em velocidade por manobrabilidade em curvas fechadas. Passa onde bike grande não entra. Em velocidades acima de 30 km/h, é menos estável que aro 26 — mantenha ritmo urbano. Ideal para centro com trânsito denso e muitas paradas.' },
        { h3: 'Custo-benefício e alternativas', body: 'Por R$ 5.791, a Honeywhale S6-S (R$ 3.799) oferece dobrável, fat tire, cesto e 40 km de autonomia. O K3 faz sentido quando agilidade do aro 20 e bateria removível para troca rápida são prioridade operacional — não quando custo-benefício domina a decisão.' }
      ]
    },
    faq: [
      ['O Nado K3 vale a pena?', 'Para <strong>entregas leves e agilidade urbana</strong>. Para custo-benefício, a <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline">Honeywhale S6-S</a> é mais barata.'],
      ['A bateria do Nado K3 é removível?', 'Sim, <strong>48V lítio</strong> — carrega fora da bike. Segundo pack dobra autonomia do dia.'],
      ['Nado K3 ou V9 Max?', 'K3: ágil, aro 20, R$ 5.791. V9 Max: 1000W, 48 km, freio hidráulico — para uso mais intenso.'],
      ['O Nado K3 dobra?', 'Não. Formato scooter fixo — mais compacto que aro 26, mas não dobrável como Oimotoo S6.'],
      ['Qual a autonomia real do K3?', 'Entre <strong>25 e 35 km</strong> conforme modo, peso e terreno.'],
      ['Nado K3 ou Honeywhale S6-S?', 'Honeywhale: R$ 3.799, dobrável, fat tire, cesto. Nado K3: aro 20 mais ágil, bateria removível, preço maior.']
    ],
    altLinks: ['review-v9-max', 'review-honeywhale-s6-s'],
    productSchemaName: 'Nado K3 750W Bicicleta Elétrica Scooter',
    productDesc: 'Bike elétrica utilitária Nado K3 750W aro 20 com bateria 48V removível. #7 do ranking Tudo de Melhor.'
  }
];

function renderPhilcoPage(p) {
  const faqSchema = p.faq.map(([q]) => ({ '@type': 'Question', name: q.replace(/<[^>]+>/g, ''), acceptedAnswer: { '@type': 'Answer', text: '' } }));
  p.faq.forEach(([q, a], i) => { faqSchema[i].acceptedAnswer.text = a.replace(/<[^>]+>/g, ''); });

  const specsRows = p.specs.map(([k, v], i) => {
    const cls = i < p.specs.length - 1 ? 'border-b border-white/10 even:bg-white/5' : 'even:bg-white/5';
    return `<tr class="${cls}"><th scope="row" class="px-4 py-3 font-semibold text-white">${k}</th><td class="px-4 py-3 text-brand-muted">${v}</td></tr>`;
  }).join('\n              ');

  const analysisSections = p.analysis.sections.map(s => `
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">${s.h3}</h3>
          <p class="mb-5 text-brand-muted">${s.body}</p>`).join('');

  const faqHtml = p.faq.map(([q, a], i) => `
          <details class="glass p-5"${i === 0 ? ' open' : ''}>
            <summary class="cursor-pointer list-none font-bold">${q}</summary>
            <p class="mt-3 text-sm text-brand-muted">${a}</p>
          </details>`).join('');

  const altLinksHtml = p.altLinks.map((slug) => renderAltCard(slug)).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJRGBSSWQG"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KJRGBSSWQG');</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${p.description}">
  <title>${p.title}</title>
  <link rel="canonical" href="https://tudodemelhor.com.br/${p.slug}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{bg:'#232F3E',yellow:'#FFE600',orange:'#FF9900',card:'rgba(27, 37, 48, 0.7)',elevated:'#1B2530',border:'#37475A',muted:'#D5D9D9',dim:'#AAB3BD'}},fontFamily:{sans:['Inter','system-ui','sans-serif']},boxShadow:{glow:'0 0 15px rgba(255, 230, 0, 0.4)','glow-lg':'0 0 28px rgba(255, 230, 0, 0.45)','glow-orange':'0 0 20px rgba(255, 153, 0, 0.35)','glow-emerald':'0 0 24px rgba(16, 185, 129, 0.3)'},backgroundImage:{'brand-gradient':'linear-gradient(135deg, #FFE600 0%, #FF9900 100%)'}}}};</script>
  <style type="text/tailwindcss">@layer utilities{.glass{@apply bg-brand-card backdrop-blur-md border border-white/10 rounded-2xl;}}</style>
  <style>body{background-image:radial-gradient(ellipse 70% 45% at 85% 10%,rgba(255,153,0,.14),transparent 55%),radial-gradient(ellipse 50% 40% at 10% 85%,rgba(255,230,0,.07),transparent 50%),radial-gradient(rgba(255,255,255,.045) 1px,transparent 1px);background-size:auto,auto,18px 18px;background-attachment:fixed}</style>
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Início","item":"https://tudodemelhor.com.br/"},
      {"@type":"ListItem","position":2,"name":"Melhores Bicicletas Elétricas","item":"https://tudodemelhor.com.br/melhores-bicicletas-eletricas.html"},
      {"@type":"ListItem","position":3,"name":p.breadcrumbName}
    ]},
    {"@type":"Product","name":p.productSchemaName,"brand":{"@type":"Brand","name":p.brand},"image":p.image,"description":p.productDesc,
      "review":{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":p.score,"bestRating":"10"},"author":{"@type":"Organization","name":"Tudo de Melhor"}},
      "offers":{"@type":"Offer","url":p.mlLink,"priceCurrency":"BRL","price":p.priceSchema,"availability":"https://schema.org/InStock"}},
    {"@type":"FAQPage","mainEntity":faqSchema}
  ]})}</script>
</head>
<body class="bg-brand-bg text-white font-sans antialiased min-h-screen pb-32">
  <header id="site-header" class="sticky top-0 z-50 border-b border-white/10 bg-brand-elevated/90 backdrop-blur-md">
    <div class="mx-auto flex h-[100px] max-w-7xl items-center gap-4 px-4 lg:gap-8">
      <a href="index.html" class="flex shrink-0 items-center gap-4 transition hover:opacity-90" aria-label="Tudo de Melhor — início">
        <div class="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-brand-bg shadow-glow-orange lg:h-20 lg:w-20">
          <img src="assets/ui/logo-site/logo-tudo-melhor.jpeg" alt="Logo Tudo de Melhor" class="h-full w-full object-cover">
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-xl font-black uppercase leading-tight tracking-wider text-white lg:text-2xl">Tudo De</span>
          <span class="text-xl font-black uppercase leading-tight tracking-wider text-brand-yellow lg:text-2xl">Melhor</span>
        </div>
      </a>
      <button id="nav-toggle" type="button" class="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand-border bg-brand-elevated md:hidden" aria-label="Abrir menu" aria-expanded="false">
        <span class="flex flex-col gap-1.5"><span class="block h-0.5 w-6 bg-white"></span><span class="block h-0.5 w-6 bg-white"></span><span class="block h-0.5 w-6 bg-white"></span></span>
      </button>
      <nav id="site-nav" class="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-brand-muted md:flex">
        <a href="index.html#categorias" class="transition hover:text-white">Categorias</a>
        <a href="categorias.html" class="transition hover:text-white">Rankings</a>
        <a href="reviews.html" class="transition hover:text-white">Reviews</a>
        <a href="index.html#ofertas" class="font-bold text-brand-yellow shadow-glow transition hover:text-white">Melhores Ofertas</a>
      </nav>
    </div>
    <div id="mobile-nav" class="hidden border-t border-white/10 bg-brand-elevated/98 px-4 py-4 md:hidden">
      <nav class="flex flex-col gap-1 text-sm">
        <a href="categorias.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Rankings</a>
        <a href="reviews.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Reviews</a>
      </nav>
    </div>
  </header>

  <main class="px-4 pt-8">
    <div class="mx-auto max-w-6xl">
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-brand-dim" aria-label="Breadcrumb">
        <a href="index.html" class="hover:text-brand-yellow">Início</a>
        <span aria-hidden="true">/</span>
        <a href="melhores-bicicletas-eletricas.html" class="hover:text-brand-yellow">Melhores Bicicletas Elétricas</a>
        <span aria-hidden="true">/</span>
        <span class="text-white" aria-current="page">${p.breadcrumbName}</span>
      </nav>

      <header class="mb-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="glass relative order-2 overflow-hidden p-6 md:order-1 md:p-10">
          <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-yellow/10 blur-3xl"></div>
          <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Review · #${p.rank} do ranking 2026</p>
          <h1 class="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">${p.h1}</h1>
          <p class="mb-6 hidden max-w-2xl text-lg text-brand-muted md:block">${p.heroIntro}</p>
          <div class="mb-6 flex flex-wrap gap-2">
            <span class="rounded-md bg-brand-yellow px-3 py-1 text-[10px] font-extrabold uppercase text-black shadow-glow">${p.badge}</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Nota editorial ${p.score}</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">A partir de ${p.priceDisplay}</span>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a class="inline-flex h-12 items-center justify-center rounded-xl bg-brand-yellow px-6 font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Comprar no Mercado Livre</a>
          </div>
          ${renderGallery(p)}
        </div>
        ${renderHeroMedia(p)}
      </header>

      <section class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="Veredito rápido">
        <article class="glass col-span-2 p-6 md:row-span-2">
          <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-brand-dim">Veredito rápido</h2>
          <div class="flex items-end gap-4">
            <span class="text-6xl font-black leading-none text-brand-yellow drop-shadow-[0_0_15px_rgba(255,230,0,0.4)]">${p.score}</span>
            <div class="pb-1">
              <div class="text-xl text-brand-yellow" aria-label="Nota do ranking">★★★★★</div>
              <p class="m-0 text-sm text-brand-dim">Escala 0–10 · ranking Tudo de Melhor</p>
            </div>
          </div>
          <p class="mt-4 text-brand-muted">${p.verdictText}</p>
        </article>
        <article class="glass p-5">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Para quem é</h3>
          <p class="m-0 text-sm text-brand-muted">${p.paraQuem}</p>
        </article>
        <article class="glass p-5">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Diferencial</h3>
          <p class="m-0 text-sm font-bold text-brand-yellow">${p.diferencial}</p>
        </article>
        <article class="glass col-span-2 p-5 md:col-span-2">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Promessa</h3>
          <p class="m-0 text-sm text-brand-muted">${p.promessa}</p>
        </article>
      </section>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Prós e <span class="text-brand-yellow">contras</span> da ${p.brand} ${p.modelShort || p.model}</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="glass border-emerald-500/30 p-6 shadow-glow-emerald">
            <h3 class="mb-4 text-lg font-bold text-emerald-300">Pontos fortes</h3>
            <ul class="list-disc space-y-2 pl-5 text-sm text-brand-muted">${p.pros.map(t => `<li>${t}</li>`).join('\n              ')}</ul>
          </div>
          <div class="glass border-orange-500/30 p-6">
            <h3 class="mb-4 text-lg font-bold text-orange-300">Limitações</h3>
            <ul class="list-disc space-y-2 pl-5 text-sm text-brand-muted">${p.cons.map(t => `<li>${t}</li>`).join('\n              ')}</ul>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Especificações <span class="text-brand-yellow">técnicas</span></h2>
        <div class="glass overflow-hidden">
          <table class="w-full text-left text-sm"><tbody>
              ${specsRows}
          </tbody></table>
        </div>
      </section>

      <section class="mb-10">
        <article class="glass p-6 md:p-10">
          <h2 class="mb-4 text-2xl font-extrabold md:text-3xl">${p.analysis.title}</h2>
          <p class="mb-5 text-brand-muted">${p.analysis.intro}</p>
          ${analysisSections}
        </article>
      </section>

      <section class="mb-10" id="ofertas">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Onde <span class="text-brand-yellow">comprar</span></h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article class="glass p-6">
            <div class="mb-3 flex flex-wrap gap-2">
              <span class="rounded-md bg-brand-yellow px-2 py-1 text-[10px] font-extrabold uppercase text-black shadow-glow">Mercado Livre</span>
              <span class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-brand-muted">Link de oferta</span>
            </div>
            <p class="mb-5 text-sm text-brand-muted">Anúncio rastreado: ${p.brand} ${p.model}. Confira seller, frete, garantia e o preço do dia.</p>
            <a class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Ir para o Mercado Livre</a>
          </article>
          <article class="glass p-6">
            <div class="mb-3 flex flex-wrap gap-2">
              <span class="rounded-md border border-white/25 bg-white/10 px-2 py-1 text-[10px] font-extrabold uppercase text-white">Amazon</span>
              <span class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-brand-muted">Em breve</span>
            </div>
            <p class="mb-5 text-sm text-brand-muted">Link de afiliado Amazon entra aqui quando a oferta estiver ativa. Use o Mercado Livre enquanto isso.</p>
            <span class="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl border border-white/25 bg-white/5 font-bold text-brand-dim">Em breve</span>
          </article>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Alternativas no <span class="text-brand-yellow">ranking</span></h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">${altLinksHtml}
          <a class="glass flex flex-col justify-center p-5 transition hover:-translate-y-1 hover:shadow-glow" href="melhores-bicicletas-eletricas.html">
            <p class="mb-2 text-xs font-bold uppercase text-brand-yellow">Lista completa</p>
            <h3 class="mb-2 text-lg font-bold text-white">Voltar ao ranking</h3>
            <p class="text-sm text-brand-dim">Ver as 7 bicicletas elétricas comparadas lado a lado.</p>
          </a>
        </div>
      </section>

      <section class="mb-10" id="faq">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Perguntas frequentes sobre a <span class="text-brand-yellow">${p.brand} ${p.modelShort || p.model}</span></h2>
        <div class="space-y-3">${faqHtml}</div>
      </section>

      <section class="mb-10" aria-label="Autor">
        <div class="glass flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-black shadow-glow">Equipe</div>
          <div>
            <h3 class="mb-1 text-lg font-bold">Equipe Tudo de Melhor</h3>
            <p class="text-sm text-brand-muted">Review do #${p.rank} do ranking de bicicletas elétricas. Nome, imagem e preço extraídos do anúncio do Mercado Livre. Links de afiliados podem gerar comissão, sem custo extra para você.</p>
          </div>
        </div>
      </section>
    </div>
  </main>

  ${renderStickyBar(p)}

  <footer class="mt-8 border-t border-brand-border bg-[#1a222d] px-4 py-10">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4">
      <div><a href="index.html" class="mb-3 flex items-center gap-3"><img src="assets/ui/logo-site/logo-tudo-melhor.jpeg" width="42" height="42" alt="" class="h-10 w-10 object-contain"><span class="text-sm font-extrabold uppercase tracking-wider">Tudo de Melhor</span></a><p class="text-sm text-brand-dim">Rankings e reviews para decidir com segurança. Links de afiliados podem gerar comissão.</p></div>
      <div><h4 class="mb-3 text-sm font-bold">Navegação</h4><div class="flex flex-col gap-2 text-sm text-brand-dim"><a href="index.html" class="hover:text-brand-yellow">Home</a><a href="categorias.html" class="hover:text-brand-yellow">Rankings</a><a href="reviews.html" class="hover:text-brand-yellow">Reviews</a></div></div>
      <div><h4 class="mb-3 text-sm font-bold">Categorias</h4><div class="flex flex-col gap-2 text-sm text-brand-dim"><a href="melhores-bicicletas-eletricas.html" class="hover:text-brand-yellow">Bicicletas Elétricas</a></div></div>
      <div><h4 class="mb-3 text-sm font-bold">Legal</h4><div class="flex flex-col gap-2 text-sm text-brand-dim"><a href="sobre.html" class="hover:text-brand-yellow">Sobre</a><a href="privacidade.html" class="hover:text-brand-yellow">Privacidade</a><a href="contato.html" class="hover:text-brand-yellow">Contato</a></div></div>
    </div>
    <div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-4 text-xs text-brand-dim">© <span id="y"></span> tudodemelhor.com.br — Conteúdo editorial independente.</div>
  </footer>
  <script>
    document.getElementById('y').textContent=new Date().getFullYear();
    const toggle=document.getElementById('nav-toggle'),mobile=document.getElementById('mobile-nav');
    toggle?.addEventListener('click',()=>{const open=mobile.classList.toggle('hidden')===false;toggle.setAttribute('aria-expanded',open?'true':'false');});
    mobile?.querySelectorAll('a').forEach((a)=>{a.addEventListener('click',()=>{mobile.classList.add('hidden');toggle.setAttribute('aria-expanded','false');});});
  </script>
  <script src="assets/js/lazy-hero-video.js" defer></script>
  ${hasGallery(p) ? '<script src="assets/js/product-gallery-lightbox.js" defer></script>' : ''}
</body>
</html>`;
}

const lotArg = process.argv[2];
const toGenerate = lotArg === '3' ? lote3Products
  : lotArg === '2' ? products
  : [...products, ...lote3Products];

const contextGalleries = parseContextoGalleries(CONTEXTO_PATH);

for (const p of toGenerate) {
  const withGallery = {
    ...p,
    galleryImages: resolveGalleryImages(p, contextGalleries),
  };
  writeFileSync(join(ROOT, `${p.slug}.html`), renderPhilcoPage(withGallery), 'utf8');
  const vid = hasHeroVideo(p) ? heroVideoPath(p) : null;
  console.log(`✓ ${p.slug}.html (${vid ? `vídeo: ${vid}` : 'imagem fallback'}) · galeria: ${withGallery.galleryImages.length} foto(s)`);
}

function patchManualOimotooGallery() {
  const filePath = join(ROOT, 'review-oimotoo-s6.html');
  if (!existsSync(filePath)) return;

  const stub = {
    slug: 'review-oimotoo-s6',
    brand: 'Oimotoo',
    modelShort: 'S6',
    score: '9.7',
    priceDisplay: 'R$ 2.446',
    mlLink: 'https://meli.la/1eqMgcv',
    galleryImages: resolveGalleryImages(
      { slug: 'review-oimotoo-s6', brand: 'Oimotoo', modelShort: 'S6' },
      contextGalleries
    ),
  };
  const newGallery = renderGallery(stub);
  if (!newGallery) return;

  let html = readFileSync(filePath, 'utf8');
  const galleryBlock =
    /<div class="product-gallery mt-4"[\s\S]*?<div class="flex flex-wrap gap-2">[\s\S]*?<\/div>\s*<\/div>/;
  let replaced = html.replace(galleryBlock, newGallery.trimEnd());

  // Garante exatamente um fechamento da coluna esquerda antes da coluna de vídeo
  replaced = replaced.replace(
    /(<div class="product-gallery mt-4"[\s\S]*?<\/div>\s*<\/div>)\s*(?:<\/div>\s*)*(<div class="glass relative flex[\s\S]*?shadow-glow-emerald)/,
    '$1\n        </div>\n\n        $2'
  );

  const stickyBlock =
    /<div class="fixed bottom-0 z-50 w-full border-t border-[\w-]+[\s\S]*?<\/div>\s*<\/div>\s*\n\s*\n\s*<footer/;
  replaced = replaced.replace(stickyBlock, `${renderStickyBar(stub)}\n\n  <footer`);
  replaced = replaced.replace(/\bpb-28\b/, 'pb-32');

  if (replaced !== html) {
    writeFileSync(filePath, replaced, 'utf8');
    console.log(
      `✓ review-oimotoo-s6.html (galeria · ${stub.galleryImages.length} foto(s) · sticky bar mobile)`
    );
  }
}

if (!lotArg || lotArg === '2') patchManualOimotooGallery();

const label = lotArg === '3' ? 'Lote 3' : lotArg === '2' ? 'Lote 2' : 'Todos os lotes';
console.log(`\n${label} Philco: ${toGenerate.length} reviews gerados.`);

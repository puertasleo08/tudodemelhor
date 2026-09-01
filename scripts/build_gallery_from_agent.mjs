/**
 * Batch-scrape meli.la affiliate links via Firecrawl MCP output files
 * and normalize gallery URLs to -O.webp high-res format.
 */
import { writeFileSync } from 'fs';

const PRODUCTS = [
  {
    rank: 1,
    name: 'Oimotoo S6',
    brand: 'Oimotoo',
    model: 'S6',
    slug: 'review-oimotoo-s6',
    affiliate: 'https://meli.la/1eqMgcv',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_822384-MLB109485329446_042026-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/oimotoo-s6-bicicleta-eletrica-dobravel-450w35km40kmh/up/MLBU3903560662?pdp_filters=item_id%3AMLB6608022580',
    agentImages: [
      'https://http2.mlstatic.com/D_Q_NP_2X_822384-MLB109485329446_042026-V.webp',
      'https://http2.mlstatic.com/D_Q_NP_2X_822384-MLB109485329446_042026-T.webp',
    ],
  },
  {
    rank: 2,
    name: 'Xroymexroy UCITYS',
    brand: 'Xroymexroy',
    model: 'UCITYS',
    slug: 'review-xroymexroy-ucitys',
    affiliate: 'https://meli.la/1gT9Gkw',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_809321-MLA111871083304_062026-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/bicicleta-eletrica-xroymexroy-ucitys-aro-26-de-750w-e-bateria-removivel/p/MLB72999627',
    agentImages: [
      'https://http2.mlstatic.com/D_Q_NP_2X_809321-MLA111871083304_062026-V.webp',
      'https://http2.mlstatic.com/D_Q_NP_2X_809321-MLA111871083304_062026-T.webp',
    ],
  },
  {
    rank: 3,
    name: 'Honeywhale S6-S',
    brand: 'Honeywhale',
    model: 'S6-S',
    slug: 'review-honeywhale-s6-s',
    affiliate: 'https://meli.la/1MDt7cC',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_801018-MLA115363054279_072026-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/honeywhale-s6-s-bicicleta-eletrica-750w-40km-35kmh-125kg-scooter-ebike-adulto-velocidade-autonomia-carga-fat-de-dobravel-sistema-de-freios-a-disco-farois-dianteiros-cesto-traseiro-honey-whale/p/MLB53004645',
    agentImages: [
      'https://http2.mlstatic.com/D_Q_NP_2X_801018-MLA115363054279_072026-V.webp',
      'https://http2.mlstatic.com/D_Q_NP_2X_801018-MLA115363054279_072026-T.webp',
    ],
  },
  {
    rank: 4,
    name: 'Bike Dobrável 400W',
    brand: 'Dobrável',
    model: '400W',
    slug: 'review-bike-dobravel-400w',
    affiliate: 'https://meli.la/16hjFVz',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_708869-MLB97636357574_112025-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/bicicleta-eletrica-400w-48v-10ah-scooter-dobravel-potente/up/MLBU3560655870?pdp_filters=item_id%3AMLB5929591984',
    agentImages: ['https://http2.mlstatic.com/D_Q_NP_2X_708869-MLB97636357574_112025-V.webp'],
  },
  {
    rank: 5,
    name: 'V9 Max',
    brand: 'V9 Max',
    model: '1000W',
    slug: 'review-v9-max',
    affiliate: 'https://meli.la/2VBFMUG',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_872353-MLB115691776769_082026-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/bicicleta-bike-eletrica-v9-max-1000w-48km-freio-hidraulico/up/MLBU3840440426?pdp_filters=item_id%3AMLB4518926339',
    agentImages: [
      'https://http2.mlstatic.com/D_Q_NP_2X_872353-MLB115691776769_082026-V.webp',
      'https://http2.mlstatic.com/D_Q_NP_2X_872353-MLB115691776769_082026-T.webp',
    ],
  },
  {
    rank: 6,
    name: 'Tomate 350W',
    brand: 'Tomate',
    model: '350W',
    slug: 'review-tomate-350w',
    affiliate: 'https://meli.la/17mcYdW',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_833188-MLB114054554339_072026-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/bicicleta-eletrica-tomate-350w-aro-26-com-pedal-assistido/up/MLBU3856311252?pdp_filters=item_id%3AMLB6478026316',
    agentImages: ['https://http2.mlstatic.com/D_Q_NP_2X_833188-MLB114054554339_072026-V.webp'],
  },
  {
    rank: 7,
    name: 'Nado K3',
    brand: 'Nado',
    model: 'K3',
    slug: 'review-nado-k3',
    affiliate: 'https://meli.la/1GuHCbJ',
    mainImage: 'https://http2.mlstatic.com/D_NQ_NP_898691-MLB113402906913_062026-O.webp',
    productUrl:
      'https://www.mercadolivre.com.br/nado-k3-bicicleta-eletrica-scooter-750w-bike-aro20-litio-48v/up/MLBU3386345348?pdp_filters=item_id%3AMLB5633752882',
    agentImages: ['https://http2.mlstatic.com/D_Q_NP_2X_898691-MLB113402906913_062026-V.webp'],
  },
];

const ALT = [
  (b, m) => `${b} ${m} — bike elétrica vista principal`,
  (b, m) => `${b} ${m} — detalhe lateral da bicicleta elétrica`,
  (b, m) => `${b} ${m} — motor e quadro`,
  (b, m) => `${b} ${m} — bateria e componentes`,
  (b, m) => `${b} ${m} — foto adicional do anúncio Mercado Livre`,
];

function toHighRes(url) {
  if (!url) return null;
  let u = url.replace('D_Q_NP_2X_', 'D_NQ_NP_');
  u = u.replace(/-(V|T|F|S|M|B|C|R|I|N|W\d+)\.webp.*$/i, '-O.webp');
  if (!u.endsWith('-O.webp') && !u.endsWith('.jpg')) return null;
  return u;
}

function uniqueImages(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const raw of list) {
      const url = toHighRes(raw);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      out.push(url);
    }
  }
  return out.slice(0, 5);
}

function buildGallery(p) {
  const urls = uniqueImages([p.mainImage], p.agentImages);
  return urls.map((url, i) => ({
    url,
    alt: ALT[i]?.(p.brand, p.model) || `Foto ${i + 1} — ${p.brand} ${p.model}`,
  }));
}

const galleryBySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, buildGallery(p)]));
console.log(JSON.stringify(galleryBySlug, null, 2));

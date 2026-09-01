/**
 * Resolve meli.la affiliate links via Firecrawl-style flow:
 * 1) fetch affiliate page links (simulated here with known item IDs from wid=)
 * 2) fetch pictures from Mercado Libre public API
 */
const products = [
  { rank: 1, name: 'Oimotoo S6', slug: 'review-oimotoo-s6', itemId: 'MLB6608022580', brand: 'Oimotoo', model: 'S6' },
  { rank: 2, name: 'Xroymexroy UCITYS', slug: 'review-xroymexroy-ucitys', itemId: 'MLB6935814734', brand: 'Xroymexroy', model: 'UCITYS' },
  { rank: 3, name: 'Honeywhale S6-S', slug: 'review-honeywhale-s6-s', itemId: 'MLB6805564926', brand: 'Honeywhale', model: 'S6-S' },
  { rank: 4, name: 'Bike Dobrável 400W', slug: 'review-bike-dobravel-400w', itemId: 'MLB5929591984', brand: 'Dobrável', model: '400W' },
  { rank: 5, name: 'V9 Max', slug: 'review-v9-max', itemId: 'MLB4518926339', brand: 'V9 Max', model: '1000W' },
  { rank: 6, name: 'Tomate 350W', slug: 'review-tomate-350w', itemId: 'MLB6478026316', brand: 'Tomate', model: '350W' },
  { rank: 7, name: 'Nado K3', slug: 'review-nado-k3', itemId: 'MLB5633752882', brand: 'Nado', model: 'K3' },
];

const ALT_TEMPLATES = [
  (b, m) => `${b} ${m} — bike elétrica vista principal`,
  (b, m) => `${b} ${m} — detalhe lateral da bicicleta elétrica`,
  (b, m) => `${b} ${m} — motor e quadro`,
  (b, m) => `${b} ${m} — bateria e componentes`,
  (b, m) => `${b} ${m} — foto adicional do anúncio`,
];

async function fetchItem(itemId) {
  const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'TudoDeMelhorGalleryBot/1.0 (contact: tudodemelhor.com.br)',
    },
  });
  if (!res.ok) throw new Error(`${itemId}: ${res.status}`);
  return res.json();
}

function toGallery(item, brand, model, limit = 5) {
  const pics = (item.pictures || []).slice(0, limit);
  return pics.map((p, i) => ({
    url: p.secure_url || p.url,
    alt: ALT_TEMPLATES[i]?.(brand, model) || `Foto ${i + 1} — ${brand} ${model}`,
  }));
}

const results = {};
for (const p of products) {
  const item = await fetchItem(p.itemId);
  results[p.slug] = {
    ...p,
    title: item.title,
    galleryImages: toGallery(item, p.brand, p.model),
  };
  console.log(`✓ ${p.name}: ${results[p.slug].galleryImages.length} imagens`);
}

console.log('\n--- JSON ---\n');
console.log(JSON.stringify(results, null, 2));

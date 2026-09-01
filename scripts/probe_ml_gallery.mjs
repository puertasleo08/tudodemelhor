/**
 * Probe Mercado Libre CDN for additional gallery images
 * by testing nearby picture IDs derived from the main image.
 */
const MAIN = {
  oimotoo: {
    prefix: '822384',
    id: 'MLB109485329446',
    date: '042026',
  },
  ucitys: {
    prefix: '809321',
    id: 'MLA111871083304',
    date: '062026',
  },
  honeywhale: {
    prefix: '801018',
    id: 'MLA115363054279',
    date: '072026',
  },
  bike400: {
    prefix: '708869',
    id: 'MLB97636357574',
    date: '112025',
  },
  v9max: {
    prefix: '872353',
    id: 'MLB115691776769',
    date: '082026',
  },
  tomate: {
    prefix: '833188',
    id: 'MLB114054554339',
    date: '072026',
  },
  nadok3: {
    prefix: '898691',
    id: 'MLB113402906913',
    date: '062026',
  },
};

async function exists(url) {
  const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  return res.ok;
}

async function probe(name, cfg) {
  const num = BigInt(cfg.id.replace(/^[A-Z]+/, ''));
  const prefix = cfg.prefix;
  const letters = cfg.id.match(/^[A-Z]+/)[0];
  const date = cfg.date;
  const found = [];

  for (let delta = -15n; delta <= 15n; delta++) {
    if (delta === 0n) continue;
    const idNum = num + delta;
    const id = `${letters}${idNum}`;
    const url = `https://http2.mlstatic.com/D_NQ_NP_${prefix}-${id}_${date}-O.webp`;
    if (await exists(url)) found.push(url);
  }

  const main = `https://http2.mlstatic.com/D_NQ_NP_${prefix}-${cfg.id}_${date}-O.webp`;
  console.log(`\n${name}: main=${main}`);
  console.log(`extra (${found.length}):`);
  found.forEach((u) => console.log(' ', u));
}

for (const [name, cfg] of Object.entries(MAIN)) {
  await probe(name, cfg);
}

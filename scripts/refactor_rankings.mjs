import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const CONFIG = {
  "melhores-umidificadores-de-ar-2026.html": {
    image: "assets/produtos/RANKING/UMIDIFICADOR-DE-AR/capa.jpeg",
    image_alt: "Umidificadores de ar — capa da categoria no ranking Tudo de Melhor",
    category_link: "https://meli.la/33sAS7H",
    ranking_h2: "As 6 melhores umidificadores de ar",
  },
  "melhores-purificadores-de-agua-2026.html": {
    image: "assets/produtos/RANKING/PURIFICADOR-DE-AGUA/capa.jpeg",
    image_alt: "Purificadores de água — capa da categoria no ranking Tudo de Melhor",
    category_link: "https://meli.la/1HErSZt",
    ranking_h2: "As 6 melhores purificadores de água",
  },
  "melhores-marcas-de-ar-condicionado-2026.html": {
    image: "assets/produtos/RANKING/AR-CONDICIONADO/capa.jpeg",
    image_alt: "Ar-condicionado — capa da categoria no ranking Tudo de Melhor",
    category_link: "https://meli.la/31n7tqs",
    ranking_h2: "As 5 melhores marcas de ar-condicionado",
  },
  "melhores-ar-condicionado-portatil.html": {
    image: "assets/produtos/RANKING/AR-CONDICIONADO-PORTATIL/capa.jpeg",
    image_alt: "Ar-condicionado portátil — capa da categoria no ranking Tudo de Melhor",
    category_link: "https://meli.la/2G7Vyn6",
    ranking_h2: "Os 5 melhores ar-condicionados portáteis",
  },
  "qual-e-o-melhor-travesseiro-para-dormir.html": {
    image: "assets/produtos/RANKING/TRAVESSEIRO/capa.jpeg",
    image_alt: "Travesseiros — capa da categoria no ranking Tudo de Melhor",
    category_link: "https://meli.la/2KN6Kze",
    ranking_h2: "Os 6 melhores travesseiros para dormir",
  },
};

const ARTICLE_RE =
  /<article class="glass[^"]*" id="produto-(\d+)">([\s\S]*?)<\/article>/g;

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").trim();
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstSentences(text, maxChars = 380) {
  let t = stripTags(text).replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars);
  const lastPeriod = cut.lastIndexOf(". ");
  if (lastPeriod > 120) return cut.slice(0, lastPeriod + 1);
  return cut.trimEnd() + "…";
}

function scoreTo100(scoreStr) {
  const val = parseFloat(scoreStr);
  return val <= 10 ? Math.round(val * 10) : Math.round(val);
}

function parseProducts(content) {
  const products = [];
  let m;
  const re = new RegExp(ARTICLE_RE.source, ARTICLE_RE.flags);
  while ((m = re.exec(content)) !== null) {
    const pos = parseInt(m[1], 10);
    const block = m[2];

    const scoreM = block.match(/bg-brand-gradient[^>]*>([\d.]+)<\/span>/);
    const score = scoreM ? scoreTo100(scoreM[1]) : 0;

    let brand = "";
    let specs = [];
    const metaM = block.match(/class="text-xs text-brand-dim">([^<]+)<\/span>/);
    if (metaM) {
      const parts = metaM[1].split("·").map((p) => p.trim());
      brand = parts[0];
      specs = parts.slice(1);
    }

    let price = "";
    const priceLineM = block.match(
      /<p class="mb-3 text-sm text-brand-dim">([^<]+)<\/p>/
    );
    if (priceLineM) {
      const line = priceLineM[1];
      if (!brand && line.includes("·")) brand = line.split("·")[0].trim();
      const priceM = line.match(/(R\$ [\d.,]+(?: \([^)]+\))?)/);
      price = priceM ? priceM[1] : "";
    }

    const imgM = block.match(/<img src="([^"]+)" alt="([^"]*)"/);
    const imgSrc = imgM ? imgM[1] : "";
    const imgAlt = imgM ? imgM[2] : "";

    const h2M = block.match(/<h2[^>]*>([^<]+)<\/h2>/);
    let h2Raw = h2M ? stripTags(h2M[1]) : "";
    let h2Clean = h2Raw.replace(/^\d+\.\s*/, "");
    let shortName = h2Clean.includes(" — ")
      ? h2Clean.split(" — ")[0].trim()
      : h2Clean;
    if (brand && shortName.toLowerCase().startsWith(brand.toLowerCase())) {
      shortName = shortName.slice(brand.length).trim();
    }

    const meliM = block.match(/href="(https:\/\/meli\.la\/[^"]+)"/);
    const meliLink = meliM ? meliM[1] : "";

    const analiseM = block.match(
      /<a href="([^"]+\.html)"[^>]*>[^<]*(?:análise|Análise)/i
    );
    const analiseLink = analiseM ? analiseM[1] : `#analise-${pos}`;

    const summaryM = block.match(
      /<p class="mb-4 text-brand-muted">\s*([\s\S]*?)\s*<\/p>/
    );
    const summary = summaryM ? firstSentences(summaryM[1]) : "";

    if (specs.length < 2) {
      const pros = block.match(
        /<ul class="[^"]*text-sm[^"]*text-brand-muted[^"]*">\s*([\s\S]*?)<\/ul>/
      );
      if (pros) {
        const items = [...pros[1].matchAll(/<li>([^<]+)<\/li>/g)].map((x) =>
          x[1].trim()
        );
        specs = items.slice(0, 4);
      }
    }

    products.push({
      pos,
      score,
      brand: brand.toUpperCase(),
      short_name: shortName,
      summary,
      specs: specs.slice(0, 4),
      price,
      meli_link: meliLink,
      analise_link: analiseLink,
      img_src: imgSrc,
      img_alt: imgAlt,
      sr_label: `Análise ${shortName}`,
    });
  }
  return products;
}

function refactorHeader(content, cfg) {
  const headerM = content.match(
    /(<header class="glass mb-8 p-6 md:p-10">)([\s\S]*?)(<\/header>)/
  );
  if (!headerM) throw new Error("Header not found");

  const inner = headerM[2];
  const eyebrowM = inner.match(
    /<p class="mb-3 text-xs font-extrabold[^"]*">([^<]+)<\/p>/
  );
  const h1M = inner.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const eyebrow = eyebrowM ? eyebrowM[1] : "";
  const h1 = h1M ? h1M[1] : "";

  const paras = [
    ...inner.matchAll(
      /<p class="mb-4 (?:max-w-3xl )?(?:text-brand-muted|text-sm text-brand-dim)">\s*([\s\S]*?)\s*<\/p>/g
    ),
  ].map((x) => x[1]);

  const badgesM = inner.match(
    /(<div class="flex flex-wrap gap-2">[\s\S]*?<\/div>)/
  );
  const badges = badgesM ? badgesM[1] : "";
  const p1 = paras[0] || "";
  const p2 = paras[1] || "";

  const newHeader = `${headerM[1]}
        <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">${eyebrow}</p>
        <h1 class="mb-8 text-3xl font-extrabold leading-tight md:text-5xl">${h1}</h1>
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <p class="mb-4 text-brand-muted">
              ${p1.trim()}
            </p>
            <p class="mb-4 text-sm text-brand-dim">
              ${p2.trim()}
            </p>
            ${badges}
          </div>
          <div class="glass rounded-2xl border border-white/10 p-5 md:p-6">
            <img src="${cfg.image}" alt="${cfg.image_alt}" class="w-full h-auto object-cover rounded-xl" width="640" height="480" loading="eager">
            <a class="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow px-6 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" href="${cfg.category_link}">Ver categoria completa no Mercado Livre</a>
          </div>
        </div>
      ${headerM[3]}`;

  return content.slice(0, headerM.index) + newHeader + content.slice(headerM.index + headerM[0].length);
}

function buildCard(p) {
  const specHtml = p.specs
    .map(
      (s) =>
        `              <span class="rounded-md bg-brand-elevated/90 px-2.5 py-1 text-[11px] text-brand-muted">${escapeHtml(s)}</span>`
    )
    .join("\n");
  const loading = p.pos > 1 ? ' loading="lazy"' : "";
  return `
          <article class="glass relative flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-glow" id="produto-${p.pos}">
            <span id="analise-${p.pos}" class="sr-only">${escapeHtml(p.sr_label)}</span>
            <span class="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-black shadow-glow" aria-label="Posição ${p.pos}">${p.pos}</span>
            <div class="mx-auto mt-8 flex h-44 w-full items-center justify-center">
              <img src="${escapeHtml(p.img_src)}" alt="${escapeHtml(p.img_alt)}" class="max-h-44 w-full object-contain" width="400" height="400"${loading}>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="rounded border border-brand-yellow/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-yellow">${escapeHtml(p.brand)}</span>
              <h2 class="text-lg font-bold text-white">${escapeHtml(p.short_name)}</h2>
            </div>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">${escapeHtml(p.summary)}</p>
            <div class="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Nota Tudo de Melhor</span>
              <div class="leading-none"><span class="text-3xl font-bold text-brand-yellow">${p.score}</span><span class="text-sm text-brand-dim">/100</span></div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
${specHtml}
            </div>
            <div class="mt-5 border-t border-white/10 pt-4">
              <p class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Melhor preço</p>
              <p class="text-xl font-bold text-white">${escapeHtml(p.price)}</p>
              <div class="mt-3 flex flex-col gap-2">
                <a class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-yellow px-4 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" href="${escapeHtml(p.meli_link)}">Comprar no Mercado Livre</a>
                <a class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-yellow bg-transparent px-4 text-sm font-bold text-brand-yellow transition hover:bg-brand-yellow/10" href="${escapeHtml(p.analise_link)}">Ver Análise Completa</a>
              </div>
            </div>
          </article>`;
}

function buildRankingSection(products, cfg) {
  const cards = products.map(buildCard).join("");
  return `
    <section id="ranking-topo" class="py-10" aria-label="${escapeHtml(cfg.ranking_h2)}">
      <div class="w-full">
        <p class="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Ranking 2026</p>
        <h2 class="mb-8 text-center text-2xl font-extrabold text-white md:text-3xl">${cfg.ranking_h2}</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
${cards}
        </div>
      </div>
    </section>
`;
}

function removeOldArticles(content) {
  content = content.replace(
    /\s*<div class="mx-auto max-w-6xl space-y-6 px-4 pb-12">\s*(?:<article class="glass[^"]*" id="produto-\d+">[\s\S]*?<\/article>\s*)+<\/div>\s*/,
    "\n"
  );
  content = content.replace(
    /\n\s*<article class="glass mb-\d+ p-5 md:p-6" id="produto-\d+">[\s\S]*?<\/article>/g,
    ""
  );
  return content;
}

function processFile(filename) {
  const filePath = path.join(ROOT, filename);
  const cfg = CONFIG[filename];
  let content = fs.readFileSync(filePath, "utf8");

  const products = parseProducts(content);
  if (!products.length) throw new Error(`No products in ${filename}`);

  content = refactorHeader(content, cfg);
  content = content.replace(
    /<aside class="mb-10" id="ranking-topo"[^>]*>[\s\S]*?<\/aside>\s*/,
    ""
  );
  content = removeOldArticles(content);

  const rankingSection = buildRankingSection(products, cfg);
  const mobileNavM = content.match(
    /(<nav class="mb-8 lg:hidden"[^>]*>[\s\S]*?<\/nav>)/
  );
  if (!mobileNavM) throw new Error(`Mobile nav not found in ${filename}`);

  const insertAt = mobileNavM.index + mobileNavM[0].length;
  content = content.slice(0, insertAt) + rankingSection + content.slice(insertAt);

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`OK ${filename}: ${products.length} products`);
}

for (const filename of Object.keys(CONFIG)) {
  processFile(filename);
}

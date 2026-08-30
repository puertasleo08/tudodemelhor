import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK =
  '<svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';

const SECTIONS = [
  {
    category: "casa-e-sono",
    title: "Casa e Sono",
    subtitle: "Travesseiros",
    file: "qual-e-o-melhor-travesseiro-para-dormir.html",
    badges: ["NASA", "Cervical", "Extra firme", "Hotel", "Kit 4", "Barato"],
    shortTitles: [
      "Travesseiro Hug Nasa Alto",
      "Travesseiro Cervical D40",
      "Travesseiro Extra Firme",
      "Travesseiro Toque de Pluma",
      "Kit 4 Impermeável",
      "Travesseiro Regulável ICRESA",
    ],
  },
  {
    category: "mobilidade",
    title: "Mobilidade",
    subtitle: "Bicicletas elétricas",
    file: "melhores-bicicletas-eletricas.html",
    bikeLinks: [
      "review-oimotoo-s6.html",
      "review-xroymexroy-ucitys.html",
      "review-honeywhale-s6-s.html",
      "review-bike-dobravel-400w.html",
      "review-v9-max.html",
      "review-tomate-350w.html",
      "review-nado-k3.html",
    ],
    shortTitles: [
      "Oimotoo S6 Dobrável 450W",
      "Xroymexroy UCITYS 750W",
      "Honeywhale S6-S 750W",
      "Bike Dobrável 400W 48V",
      "V9 Max 1000W Street Go",
      "Tomate 350W Aro 26",
      "Nado K3 750W",
    ],
    badges: ["Dobrável", "Aro 26", "Fat tire", "Entrada", "Potência", "Urbana", "Utilitária"],
  },
  {
    category: "climatizacao",
    title: "Climatização",
    subtitle: "Ar-condicionado split",
    file: "melhores-marcas-de-ar-condicionado-2026.html",
  },
  {
    category: "climatizacao",
    title: "Climatização",
    subtitle: "Ar-condicionado portátil",
    file: "melhores-ar-condicionado-portatil.html",
    skipSectionHeader: true,
  },
  {
    category: "climatizacao",
    title: "Climatização",
    subtitle: "Umidificadores de ar",
    file: "melhores-umidificadores-de-ar-2026.html",
    skipSectionHeader: true,
  },
  {
    category: "agua",
    title: "Água",
    subtitle: "Purificadores",
    file: "melhores-purificadores-de-agua-2026.html",
  },
];

function parseProducts(file) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const articles = [
    ...html.matchAll(/<article[^>]*id="produto-(\d+)"[\s\S]*?<\/article>/g),
  ];
  return articles.map((m) => {
    const block = m[0];
    const pos = parseInt(m[1], 10);
    const scoreM = block.match(/text-3xl font-bold text-brand-yellow">(\d+)/);
    const score = scoreM ? (parseInt(scoreM[1], 10) / 10).toFixed(1) : "8.0";
    const imgM = block.match(/<img src="([^"]+)" alt="([^"]*)"/);
    const brandM = block.match(/tracking-widest text-brand-yellow">([^<]+)<\/span>/);
    const h2M = block.match(/<h2 class="text-lg font-bold text-white">([^<]+)<\/h2>/);
    const reviewM = block.match(/href="([^"]+)">Ver Análise Completa<\/a>/);
    const pq = block.split("Para quem é?")[1] || "";
    const bullets = [...pq.matchAll(/<span>([^<]+)<\/span><\/li>/g)]
      .map((b) => b[1])
      .slice(0, 3);
    return {
      pos,
      score,
      img: imgM?.[1],
      alt: imgM?.[2],
      brand: brandM?.[1],
      title: h2M?.[1],
      review: reviewM?.[1],
      bullets,
    };
  });
}

function paraQuemBlock(bullets) {
  const items = bullets
    .map(
      (t) =>
        `                <li class="flex gap-2 text-sm text-brand-muted">${CHECK}<span>${t}</span></li>`
    )
    .join("\n");
  return `            <div class="mb-6 flex-1">
              <div class="flex items-center gap-2 mb-3"><span class="text-blue-500">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-2">
${items}
              </ul>
            </div>`;
}

function card(product, category, opts = {}) {
  const badge =
    opts.badge ||
    `#${product.pos}${product.brand && product.brand.length < 14 ? ` · ${product.brand}` : ""}`;
  const title = opts.shortTitle || product.title;
  const link = opts.review || product.review;
  const btn = link?.startsWith("review-")
    ? "Ler Review Completo"
    : "Ler Análise Completa";
  const lazy = product.pos > 1 ? ' loading="lazy"' : "";
  return `          <article class="glass group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-glow" data-category="${category}">
            <div class="mb-4 flex items-center justify-between gap-3">
              <span class="rounded-md bg-brand-yellow px-2 py-1 text-[10px] font-extrabold uppercase text-black shadow-glow">${product.score}</span>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-brand-dim">${badge}</span>
            </div>
            <div class="mb-4 flex h-36 items-center justify-center rounded-xl bg-white p-4">
              <img src="${product.img}" alt="${opts.alt || product.alt || title}" class="max-h-full w-full object-contain" width="240" height="240"${lazy}>
            </div>
            <h3 class="mb-2 text-xl font-bold">${title}</h3>
${paraQuemBlock(product.bullets)}
            <a href="${link}" class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow">${btn}</a>
          </article>`;
}

let grid = "";
const seenMainSections = new Set();

for (const sec of SECTIONS) {
  const products = parseProducts(sec.file);
  const sectionKey = `${sec.category}-${sec.subtitle}`;

  if (!sec.skipSectionHeader && !seenMainSections.has(sectionKey)) {
    grid += `          <div class="col-span-full border-t border-white/10 pt-8 first:border-0 first:pt-0" data-category="${sec.category}">
            <p class="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">${sec.title}</p>
            <h3 class="text-xl font-extrabold text-white md:text-2xl">${sec.subtitle}</h3>
          </div>\n`;
    seenMainSections.add(sectionKey);
  } else if (sec.skipSectionHeader) {
    grid += `          <div class="col-span-full mt-2" data-category="${sec.category}">
            <h4 class="text-lg font-bold text-brand-muted">${sec.subtitle}</h4>
          </div>\n`;
  }

  products.forEach((product, i) => {
    const opts = {};
    if (sec.badges?.[i]) opts.badge = `#${product.pos} · ${sec.badges[i]}`;
    if (sec.shortTitles?.[i]) opts.shortTitle = sec.shortTitles[i];
    if (sec.bikeLinks?.[i]) opts.review = sec.bikeLinks[i];
    grid += `${card(product, sec.category, opts)}\n`;
  });
}

const reviewsPath = path.join(ROOT, "reviews.html");
let reviews = fs.readFileSync(reviewsPath, "utf8");

reviews = reviews.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Análises detalhadas da Tudo de Melhor: travesseiros, climatização, purificadores e bicicletas elétricas com fichas técnicas e vereditos.">'
);

reviews = reviews.replace(
  /"description": "Fichas técnicas[^"]*"/,
  '"description": "Fichas técnicas, testes e vereditos completos de travesseiros, ar-condicionado, umidificadores, purificadores e bicicletas elétricas."'
);

reviews = reviews.replace(
  /<nav id="category-filter"[\s\S]*?<\/nav>/,
  `<nav id="category-filter" class="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0" aria-label="Categorias">
              <a href="#todos" data-filter="todos" class="filter-link whitespace-nowrap rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-2 text-sm font-bold text-brand-yellow lg:w-full lg:rounded-xl">Todos</a>
              <a href="#casa-e-sono" data-filter="casa-e-sono" class="filter-link whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-brand-muted transition hover:border-white/25 hover:text-white lg:w-full lg:rounded-xl">Casa e Sono</a>
              <a href="#mobilidade" data-filter="mobilidade" class="filter-link whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-brand-muted transition hover:border-white/25 hover:text-white lg:w-full lg:rounded-xl">Mobilidade</a>
              <a href="#climatizacao" data-filter="climatizacao" class="filter-link whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-brand-muted transition hover:border-white/25 hover:text-white lg:w-full lg:rounded-xl">Climatização</a>
              <a href="#agua" data-filter="agua" class="filter-link whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-brand-muted transition hover:border-white/25 hover:text-white lg:w-full lg:rounded-xl">Água</a>
            </nav>`
);

reviews = reviews.replace(
  /<div class="flex flex-wrap gap-4 text-sm font-semibold">[\s\S]*?<\/div>/,
  `<div class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
              <a href="qual-e-o-melhor-travesseiro-para-dormir.html" class="text-brand-yellow hover:underline">Travesseiros →</a>
              <a href="melhores-marcas-de-ar-condicionado-2026.html" class="text-brand-yellow hover:underline">Ar split →</a>
              <a href="melhores-ar-condicionado-portatil.html" class="text-brand-yellow hover:underline">Ar portátil →</a>
              <a href="melhores-umidificadores-de-ar-2026.html" class="text-brand-yellow hover:underline">Umidificadores →</a>
              <a href="melhores-purificadores-de-agua-2026.html" class="text-brand-yellow hover:underline">Purificadores →</a>
              <a href="melhores-bicicletas-eletricas.html" class="text-brand-yellow hover:underline">Bicicletas →</a>
            </div>`
);

reviews = reviews.replace(
  /<div id="reviews-grid"[\s\S]*?<\/div>\s*\n\s*<p id="filter-empty"/,
  `<div id="reviews-grid" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">\n${grid}          </div>\n\n          <p id="filter-empty"`
);

fs.writeFileSync(reviewsPath, reviews);
const count = (grid.match(/<article/g) || []).length;
console.log(`Generated ${count} review cards in reviews.html`);

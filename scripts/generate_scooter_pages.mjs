import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CHECK, PRODUCTS } from "./scooter-products.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RANKING = "melhores-patinetes-eletricos.html";
const CAT_AFF = "https://meli.la/1nJv5Ed";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function galleryItems(p) {
  return p.gallery.map((url, i) => ({
    url,
    alt:
      i === 0
        ? `${p.fullName} — melhor patinete eletrico adulto`
        : `${p.name} — foto ${i + 1} da galeria do melhor patinete eletrico`,
  }));
}

function depoimentos(p) {
  const urls = p.gallery.length > 1 ? p.gallery.slice(1) : p.gallery;
  return urls.map((url, i) => ({
    url,
    alt: `${p.name} — foto real de comprador no Mercado Livre ${i + 1}`,
  }));
}

function thumbsHtml(items) {
  const cls =
    "product-gallery-thumb h-16 w-16 shrink-0 cursor-pointer rounded-lg border border-white/10 object-cover transition hover:border-brand-yellow/40 hover:ring-1 hover:ring-brand-yellow/30";
  return items
    .map(
      (item, i) =>
        `<img src="${item.url}" alt="${esc(item.alt)}" class="${cls}" data-index="${i}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async" referrerpolicy="no-referrer" width="64" height="64">`
    )
    .join("\n            ");
}

function marqueeHtml(items) {
  const card = (item, hide) => `            <div class="glass shrink-0 w-48 h-48 sm:w-60 sm:h-60 relative rounded-xl overflow-hidden border border-white/10 hover:border-brand-yellow/50 hover:shadow-glow transition-all">
              <img src="${item.url}" alt="${hide ? "" : esc(item.alt)}" class="w-full h-full object-cover" loading="lazy" decoding="async"${hide ? ' aria-hidden="true"' : ""}>
            </div>`;
  return `          <div class="overflow-hidden w-full relative">
            <div class="flex gap-4 animate-marquee">
${items.map((it) => card(it, false)).join("\n")}
${items.map((it) => card(it, true)).join("\n")}
            </div>
          </div>`;
}

function rankingCard(p) {
  const lazy = p.pos > 1 ? ' loading="lazy"' : "";
  const bullets = p.bullets
    .map((t) => `<li class="flex gap-2 text-sm text-brand-muted">${CHECK}<span>${t}</span></li>`)
    .join("\n              ");
  const pills = p.pills
    .map(
      (t) =>
        `<span class="inline-flex items-center rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">${t}</span>`
    )
    .join("\n              ");
  return `          <article class="glass relative flex flex-col p-4 transition hover:-translate-y-1 hover:shadow-glow" id="produto-${p.pos}">
            <span id="analise-${p.pos}" class="sr-only">Análise ${esc(p.name)}</span>
            <div class="flex items-start justify-between gap-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-black shadow-glow" aria-label="Posição ${p.pos}">${p.pos}</span>
              <div class="text-right leading-none">
                <span class="block text-[10px] font-bold uppercase tracking-wider text-brand-dim">Nota Tudo de Melhor</span>
                <div class="mt-0.5"><span class="text-2xl font-bold text-emerald-400">${p.score100}</span><span class="text-sm text-brand-dim">/100</span></div>
              </div>
            </div>
            <div class="mx-auto mt-3 flex h-36 w-full items-center justify-center">
              <img src="${p.hero}" alt="${esc(p.fullName)} — melhores patinetes eletricos" class="max-h-36 w-full object-contain" width="400" height="400"${lazy}>
            </div>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="rounded border border-brand-yellow/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-yellow">${p.brand}</span>
              <h2 class="text-lg font-bold text-white">${p.shortTitle}</h2>
            </div>
            <div class="mt-2 flex-1">
              <div class="mb-2 flex items-center gap-2"><span class="text-blue-500">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-1.5">
              ${bullets}
              </ul>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              ${pills}
            </div>
            <div class="mt-3 border-t border-white/10 pt-3">
              <p class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Melhor preço</p>
              <p class="text-lg font-bold text-white">${p.price}</p>
              <div class="mt-2 flex flex-col gap-2">
                <a class="inline-flex h-10 items-center justify-center rounded-xl bg-brand-yellow px-4 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.affiliate}">Comprar no Mercado Livre</a>
                <a class="inline-flex h-10 items-center justify-center rounded-xl border border-brand-yellow bg-transparent px-4 text-sm font-bold text-brand-yellow transition hover:bg-brand-yellow/10" href="${p.file}">Ver Análise Completa</a>
              </div>
            </div>
          </article>`;
}

function altCard(p) {
  const bullets = p.bullets
    .map((t) => `<li class="flex gap-2 text-sm text-brand-muted">${CHECK}<span>${t}</span></li>`)
    .join("\n              ");
  const pills = p.pills
    .map((t) => `<span class="rounded-md bg-brand-elevated/90 px-2.5 py-1 text-[11px] text-brand-muted">${t}</span>`)
    .join("\n              ");
  return `<article class="glass relative flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-glow">
            <span class="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-black shadow-glow" aria-label="Posição ${p.pos}">${p.pos}</span>
            <div class="mx-auto mt-8 flex h-44 w-full items-center justify-center">
              <img src="${p.hero}" alt="${esc(p.fullName)} — melhor scooter eletrica" class="max-h-44 w-full object-contain" width="400" height="400" loading="lazy">
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="rounded border border-brand-yellow/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-yellow">${p.brand}</span>
              <h3 class="text-lg font-bold text-white">${p.shortTitle}</h3>
            </div>
            <div class="mt-3 flex-1">
              <div class="mb-3 flex items-center gap-2"><span class="text-violet-400">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-2">
              ${bullets}
              </ul>
            </div>
            <div class="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Nota Tudo de Melhor</span>
              <div class="leading-none"><span class="text-3xl font-bold text-brand-yellow">${p.score100}</span><span class="text-sm text-brand-dim">/100</span></div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              ${pills}
            </div>
            <div class="mt-5 border-t border-white/10 pt-4">
              <p class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Melhor preço</p>
              <p class="text-xl font-bold text-white">${p.price}</p>
              <div class="mt-3 flex flex-col gap-2">
                <a class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-yellow px-4 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.affiliate}">Comprar no Mercado Livre</a>
                <a class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-yellow bg-transparent px-4 text-sm font-bold text-brand-yellow transition hover:bg-brand-yellow/10" href="${p.file}">Ver Análise Completa</a>
              </div>
            </div>
          </article>`;
}

function analysisBlock(p) {
  const others = PRODUCTS.filter((x) => x.file !== p.file);
  const linkA = others[0];
  const linkB = others[1];
  return {
    h2: `Análise detalhada: avaliação do <span class="text-brand-yellow">patinete elétrico ${esc(p.name)}</span>`,
    intro: `${p.verdict} Nesta avaliação da ${esc(p.fullName)}, cruzamos motor, bateria, autonomia e preço rastreado no Mercado Livre — o mesmo método do ranking das <a href="${RANKING}" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">melhores patinetes elétricos</a> da Tudo de Melhor. A pergunta "${esc(p.name)} vale a pena?" só fecha quando o seu trajeto real (km, ladeiras, guarda) casa com o recorte do modelo.`,
    sections: [
      {
        h: "Uso diário e autonomia real",
        p: `No commute, autonomia de fábrica quase nunca se confirma no turbo. Peso do piloto, modo de aceleração e piso irregular cortam os km. A ${esc(p.name)} entra neste ranking como <strong>melhor patinete elétrico</strong> no recorte dela — não como solução universal. Mapeie ida e volta reais antes de comprar; se o ciclo passa do declarado, considere a <a href="${linkA.file}" class="text-brand-yellow underline">${esc(linkA.name)}</a> ou a <a href="${linkB.file}" class="text-brand-yellow underline">${esc(linkB.name)}</a>.`,
      },
      {
        h: "Motor, velocidade e legislação",
        p: `Patinete elétrico 350W cobre bairro plano; 500W ajuda em rampa curta; <strong>patinete elétrico 1000W</strong> e 1640W mudam o recorte para scooter elétrica de alto desempenho. Velocidades de 50–60 km/h exigem checar normas locais (CONTRAN e regras municipais): o que o anúncio chama de melhor scooter elétrica adulto pode ser tratado como ciclomotor em algumas cidades. Use capacete, luz e faça teste em local aberto.`,
      },
      {
        h: "Portabilidade: dobrar, elevador e metrô",
        p: `Quem mora em apartamento precisa de patinete elétrico dobrável de verdade — não só de foto. Modelos leves (Foston 15 kg, Oimotoo de entrada) sobem de elevador; a G3 Pro e o H18 1000W priorizam torque e pesam mais no colo. Se a rotina é metrô + última milha, peso ganha da potência. Se a rotina é 20 km de asfalto, a melhor scooter elétrica é a que chega inteira, não a que cabe na mochila.`,
      },
      {
        h: "Compra, carga e manutenção",
        p: `Compre no Mercado Livre conferindo seller, garantia e se o carregador bivolt vem incluso. Como carregar patinete elétrico: tomada seca, ciclo completo na primeira carga e evite deixar zerado. Desconecte ao 100%. Peças de desgaste (pneu, pastilha, dobradiça) importadas dependem do vendedor. Links de afiliado podem gerar comissão, sem custo extra para você.`,
      },
    ],
  };
}

function faqsFor(p) {
  const rival = PRODUCTS.find((x) => x.file !== p.file);
  return [
    {
      q: `${p.name} vale a pena?`,
      a: p.verdict,
    },
    {
      q: "Quanto custa patinete elétrico?",
      a: `Nesta seleção de setembro de 2026, a Oimotoo 350W parte de <strong>R$ 1.079</strong>; a Foston S09 Pro de <strong>R$ 1.989</strong>; a Honeywhale M2 MAX-B de <strong>R$ 2.321</strong>; o Hitway H18 1000W de <strong>R$ 4.900</strong>; e a Honeywhale G3 Pro de <strong>R$ 6.725</strong>. O ${esc(p.name)} está em <strong>${p.price}</strong> no anúncio rastreado.`,
    },
    {
      q: "Como carregar patinete elétrico?",
      a: `Conecte o carregador bivolt na tomada e na porta da bateria. A primeira carga deve ser completa. Evite umidade no conector e não deixe dias no 100% depois de cheio. Tempo típico: 4 a 8 horas conforme Ah.`,
    },
    {
      q: "Qual a autonomia real?",
      a: p.specs.find((s) => s[0] === "Autonomia")
        ? `${p.specs.find((s) => s[0] === "Autonomia")[1]} na prática cai com subida, peso e modo turbo. Planeje margem de 20–30%.`
        : "Confira o anúncio do dia e desconte 20–30% do km de fábrica em uso real.",
    },
    {
      q: "Onde comprar patinete elétrico?",
      a: `Onde comprar patinete elétrico com rastreio desta review: Mercado Livre no link de afiliado da ${esc(p.name)}. Compare seller, frete e garantia antes de fechar.`,
    },
    {
      q: `${p.name} ou ${rival.name}?`,
      a: `A ${esc(p.name)} (${p.score}/10, ${p.price}) atende ${p.forWho.toLowerCase()} A ${esc(rival.name)} (${rival.score}/10, ${rival.price}) é a alternativa se o recorte mudar. Veja o ranking completo dos <a href="${RANKING}" class="text-brand-yellow underline">melhores patinetes elétricos</a>.`,
    },
  ];
}

function siteHeader() {
  return `  <header id="site-header" class="sticky top-0 z-50 border-b border-white/10 bg-brand-elevated/90 backdrop-blur-md">
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
      <div class="hidden items-center gap-4 md:flex">
        <label class="relative">
          <span class="sr-only">Buscar</span>
          <svg class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
          <input type="search" placeholder="Buscar" class="h-11 w-44 rounded-full border border-white/15 bg-white/5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-sm placeholder:text-brand-dim focus:border-brand-yellow/50 focus:bg-white/10 lg:w-52">
        </label>
        <a href="#login" class="inline-flex h-11 items-center rounded-full border border-white/25 px-6 text-sm font-semibold transition hover:bg-white/10">Login</a>
      </div>
    </div>
    <div id="mobile-nav" class="hidden border-t border-white/10 bg-brand-elevated/98 px-4 py-4 md:hidden">
      <nav class="flex flex-col gap-1 text-sm">
        <a href="index.html#categorias" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Categorias</a>
        <a href="categorias.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Rankings</a>
        <a href="reviews.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Reviews</a>
        <a href="index.html#ofertas" class="rounded-lg px-3 py-3 font-bold text-brand-yellow">Melhores Ofertas</a>
      </nav>
    </div>
  </header>`;
}

function siteFooter() {
  return `  <footer class="mt-8 border-t border-brand-border bg-[#1a222d] px-4 py-10">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4">
      <div>
        <a href="index.html" class="mb-3 flex items-center gap-3">
          <img src="assets/ui/logo-site/logo-tudo-melhor.jpeg" width="42" height="42" alt="" class="h-10 w-10 object-contain">
          <span class="text-sm font-extrabold uppercase tracking-wider">Tudo de Melhor</span>
        </a>
        <p class="text-sm text-brand-dim">Rankings e reviews para decidir com segurança. Links de afiliados podem gerar comissão.</p>
      </div>
      <div>
        <h4 class="mb-3 text-sm font-bold">Navegação</h4>
        <div class="flex flex-col gap-2 text-sm text-brand-dim">
          <a href="index.html" class="hover:text-brand-yellow">Home</a>
          <a href="categorias.html" class="hover:text-brand-yellow">Rankings</a>
          <a href="reviews.html" class="hover:text-brand-yellow">Reviews</a>
          <a href="index.html#metodologia" class="hover:text-brand-yellow">Metodologia</a>
        </div>
      </div>
      <div>
        <h4 class="mb-3 text-sm font-bold">Categorias</h4>
        <div class="flex flex-col gap-2 text-sm text-brand-dim">
          <a href="melhores-bicicletas-eletricas.html" class="hover:text-brand-yellow">Bicicletas Elétricas</a>
          <a href="${RANKING}" class="hover:text-brand-yellow">Patinetes Elétricos</a>
        </div>
      </div>
      <div>
        <h4 class="mb-3 text-sm font-bold">Legal</h4>
        <div class="flex flex-col gap-2 text-sm text-brand-dim">
          <a href="sobre.html" class="hover:text-brand-yellow">Sobre</a>
          <a href="privacidade.html" class="hover:text-brand-yellow">Privacidade</a>
          <a href="trocas.html" class="hover:text-brand-yellow">Trocas e Devoluções</a>
          <a href="contato.html" class="hover:text-brand-yellow">Contato</a>
        </div>
      </div>
    </div>
    <div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-4 text-xs text-brand-dim">
      © <span id="y"></span> tudodemelhor.com.br — Conteúdo editorial independente.
    </div>
  </footer>`;
}

function navScript() {
  return `  <script>
    document.getElementById('y').textContent = new Date().getFullYear();
    const toggle = document.getElementById('nav-toggle');
    const mobile = document.getElementById('mobile-nav');
    toggle?.addEventListener('click', () => {
      const open = mobile.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile?.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobile.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  </script>`;
}

function gtagBlock() {
  return `  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJRGBSSWQG"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-KJRGBSSWQG');
  </script>`;
}

function tailwindBlock() {
  return `  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { brand: { bg: '#232F3E', yellow: '#FFE600', orange: '#FF9900', card: 'rgba(27, 37, 48, 0.7)', elevated: '#1B2530', border: '#37475A', muted: '#D5D9D9', dim: '#AAB3BD' } },
          fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
          boxShadow: { glow: '0 0 15px rgba(255, 230, 0, 0.4)', 'glow-lg': '0 0 28px rgba(255, 230, 0, 0.45)', 'glow-orange': '0 0 20px rgba(255, 153, 0, 0.35)', 'glow-emerald': '0 0 24px rgba(16, 185, 129, 0.3)' },
          backgroundImage: { 'brand-gradient': 'linear-gradient(135deg, #FFE600 0%, #FF9900 100%)' }
        }
      }
    }
  </script>
  <style type="text/tailwindcss">
    @layer utilities { .glass { @apply bg-brand-card backdrop-blur-md border border-white/10 rounded-2xl; } }
  </style>`;
}

function buildRanking() {
  const asideLinks = PRODUCTS.map((p) => `          <a href="#produto-${p.pos}" class="text-brand-muted transition-all hover:translate-x-1 hover:text-white">${p.pos}. ${p.name.replace("Honeywhale ", "").replace("Foston ", "").replace("Hitway ", "").replace("Oimotoo ", "Oimotoo")}</a>`).join("\n");
  const mobileOpts = PRODUCTS.map((p) => `          <option class="bg-slate-900 text-white" value="#produto-${p.pos}">${p.pos}. ${esc(p.shortTitle)}</option>`).join("\n");
  const jsonItems = PRODUCTS.map((p) => `          { "@type": "ListItem", "position": ${p.pos}, "name": ${JSON.stringify(p.fullName)}, "url": "${p.affiliate}" }`).join(",\n");
  const tableRows = PRODUCTS.map((p, i) => {
    const motor = p.pills[0];
    const last = i === PRODUCTS.length - 1;
    return `              <tr${last ? "" : ' class="border-b border-white/5"'}><th scope="row" class="px-4 py-3 font-semibold text-white">${esc(p.name)}</th><td class="px-4 py-3">${esc(motor)}</td><td class="px-4 py-3">${esc(p.pills[1] || "—")}</td><td class="px-4 py-3">${esc(p.badge)}</td><td class="px-4 py-3 font-bold text-brand-yellow">${p.score}</td></tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
${gtagBlock()}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Melhor scooter elétrica 2026: ranking dos melhores patinetes elétricos (Honeywhale G3 Pro, Foston S09 Pro, Hitway H18 1000W). Compare preço, autonomia e o melhor patinete elétrico adulto.">
  <title>Melhores Patinetes Elétricos 2026: Melhor Scooter Elétrica | Tudo de Melhor</title>
  <link rel="canonical" href="https://tudodemelhor.com.br/${RANKING}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
${tailwindBlock()}
  <style>
    body {
      background-image:
        radial-gradient(ellipse 70% 45% at 85% 10%, rgba(255, 153, 0, 0.14), transparent 55%),
        radial-gradient(ellipse 50% 40% at 10% 85%, rgba(255, 230, 0, 0.07), transparent 50%),
        radial-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px);
      background-size: auto, auto, 18px 18px;
      background-attachment: fixed;
    }
    .timeline-line {
      background: linear-gradient(90deg, #FFE600, #FF9900, rgba(255, 255, 255, 0.35));
      box-shadow: 0 0 18px rgba(255, 230, 0, 0.45);
    }
    @media (max-width: 767px) {
      .timeline-line { width: 3px; height: 100%; left: 1.35rem; top: 0; right: auto; background: linear-gradient(180deg, #FFE600, #FF9900, rgba(255, 255, 255, 0.35)); }
    }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://tudodemelhor.com.br/" },
          { "@type": "ListItem", "position": 2, "name": "Rankings", "item": "https://tudodemelhor.com.br/categorias.html" },
          { "@type": "ListItem", "position": 3, "name": "Melhores Patinetes Elétricos" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Melhores patinetes elétricos 2026",
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "numberOfItems": ${PRODUCTS.length},
        "itemListElement": [
${jsonItems}
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Quanto custa patinete elétrico?", "acceptedAnswer": { "@type": "Answer", "text": "Nesta seleção de setembro de 2026, o patinete elétrico Oimotoo 350W parte de R$ 1.079; a Foston S09 Pro fica por R$ 1.989; a Honeywhale M2 MAX-B por R$ 2.321; o Hitway H18 1000W por R$ 4.900; e a melhor scooter elétrica da lista, Honeywhale G3 Pro 1640W, por cerca de R$ 6.725 no Mercado Livre." } },
          { "@type": "Question", "name": "Qual o melhor patinete elétrico?", "acceptedAnswer": { "@type": "Answer", "text": "Para performance, a Honeywhale G3 Pro lidera como melhor scooter elétrica adulto (1640W, 56 km). Para custo-benefício, a Foston S09 Pro 350W. Para patinete elétrico 1000W off-road, o Hitway H18. Para assento, a M2 MAX-B." } },
          { "@type": "Question", "name": "Como carregar patinete elétrico?", "acceptedAnswer": { "@type": "Answer", "text": "Conecte o carregador bivolt na tomada e na porta da bateria, em local seco. A primeira carga deve ser completa. Tempo típico: 4 a 8 horas. Evite deixar zerado e desconecte ao atingir 100%." } },
          { "@type": "Question", "name": "Onde comprar patinete elétrico?", "acceptedAnswer": { "@type": "Answer", "text": "Onde comprar patinete elétrico com os anúncios rastreados deste ranking: Mercado Livre, conferindo seller, frete e garantia. Use os links de cada modelo ou a categoria de mobilidade elétrica." } },
          { "@type": "Question", "name": "Como funciona o patinete elétrico?", "acceptedAnswer": { "@type": "Answer", "text": "A scooter elétrica usa motor no cubo da roda, alimentado por bateria de lítio via controlador. O acelerador no guidão define a potência; o freio a disco (e o eletrofreio) reduz a velocidade. O display mostra carga, modo e km/h." } }
        ]
      }
    ]
  }
  </script>
</head>
<body class="bg-brand-bg text-white font-sans antialiased min-h-screen">
${siteHeader()}
  <main class="mx-auto max-w-7xl px-4 pt-8">
    <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-brand-dim" aria-label="Breadcrumb">
      <a href="index.html" class="hover:text-brand-yellow">Início</a>
      <span aria-hidden="true">/</span>
      <a href="categorias.html" class="hover:text-brand-yellow">Rankings</a>
      <span aria-hidden="true">/</span>
      <span class="text-white" aria-current="page">Patinetes Elétricos</span>
    </nav>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr]">
      <aside class="sticky top-28 hidden h-fit lg:block" aria-label="Índice da página">
        <nav class="flex flex-col gap-3 text-sm">
          <a href="#ranking-topo" class="text-brand-muted transition-all hover:translate-x-1 hover:text-white">Ranking</a>
          <a href="#criterios" class="text-brand-muted transition-all hover:translate-x-1 hover:text-white">Critérios</a>
${asideLinks}
          <a href="#como-escolher" class="text-brand-muted transition-all hover:translate-x-1 hover:text-white">Como escolher</a>
          <a href="#tabela" class="text-brand-muted transition-all hover:translate-x-1 hover:text-white">Tabela</a>
          <a href="#faq" class="text-brand-muted transition-all hover:translate-x-1 hover:text-white">FAQ</a>
        </nav>
      </aside>

      <div class="min-w-0">
      <header class="glass mb-8 p-6 md:p-10">
        <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Mobilidade · Ranking 2026</p>
        <h1 class="mb-4 text-3xl font-extrabold leading-tight md:mb-8 md:text-5xl">Melhor scooter elétrica 2026: ranking dos melhores patinetes elétricos para adulto e custo-benefício</h1>
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <div class="hidden md:block">
            <p class="mb-4 text-brand-muted">
              Procurar a <strong>melhor scooter elétrica</strong> e o <strong>melhor patinete elétrico</strong> no Brasil virou labirinto de watts, km/h e autonomia de fábrica. Neste ranking comparamos seis <strong>melhores patinetes elétricos</strong> rastreados no Mercado Livre — da Honeywhale G3 Pro 1640W à Oimotoo 350W — cruzando motor, bateria, peso, freio e preço para apontar o <strong>melhor patinete elétrico adulto</strong> em cada faixa.
            </p>
            <p class="mb-4 text-sm text-brand-dim">
              Se busca <strong>melhor marca de patinete elétrico</strong> para cidade, Honeywhale e Foston lideram volume nesta lista. Para <strong>patinete elétrico 1000W</strong> off-road, o Hitway H18 é a referência. Confira seller, legislação local e se o modelo dobra antes de comprar.
            </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Atualizado em setembro de 2026</span>
              <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Dados extraídos do Mercado Livre</span>
              <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Metodologia própria</span>
            </div>
          </div>
          <div class="hidden md:block glass rounded-2xl border border-white/10 p-5 md:p-6">
            <img src="${PRODUCTS[0].hero}" alt="Melhor scooter eletrica Honeywhale G3 Pro — capa do ranking de melhores patinetes eletricos" class="w-full h-auto object-cover rounded-xl" width="640" height="480" loading="eager">
            <a class="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow px-6 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${CAT_AFF}">Ver categoria completa no Mercado Livre</a>
          </div>
        </div>
      </header>

      <nav class="mb-8 lg:hidden" aria-label="Índice da página (mobile)">
        <label for="page-index-mobile" class="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-dim">Ir para seção</label>
        <select id="page-index-mobile" class="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-brand-yellow/50 [color-scheme:dark]">
          <option class="bg-slate-900 text-white" value="">Selecione uma seção…</option>
          <option class="bg-slate-900 text-white" value="#ranking-topo">Ranking</option>
          <option class="bg-slate-900 text-white" value="#criterios">Critérios</option>
${mobileOpts}
          <option class="bg-slate-900 text-white" value="#como-escolher">Como escolher</option>
          <option class="bg-slate-900 text-white" value="#tabela">Tabela</option>
          <option class="bg-slate-900 text-white" value="#faq">FAQ</option>
        </select>
      </nav>

    <section id="ranking-topo" class="py-10" aria-label="Ranking de patinetes elétricos">
      <div class="w-full">
        <p class="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Ranking 2026</p>
        <h2 class="mb-8 text-center text-2xl font-extrabold text-white md:text-3xl">Os 6 melhores patinetes elétricos</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
${PRODUCTS.map(rankingCard).join("\n\n")}
        </div>
      </div>
    </section>

    <section id="criterios" class="py-14">
      <div class="w-full">
        <p class="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Metodologia</p>
        <h2 class="mx-auto mb-12 max-w-3xl text-center text-3xl font-extrabold md:text-4xl">Como escolhemos os melhores patinetes elétricos?</h2>
        <p class="mx-auto mb-8 max-w-3xl text-center text-sm text-brand-dim">Cruzamos potência do motor, capacidade da bateria, autonomia prática, tipo de freio, peso dobrado e preço no Mercado Livre — sem copiar notas de fabricantes.</p>
        <div class="relative">
          <div class="timeline-line absolute left-[8%] right-[8%] top-7 hidden h-[3px] rounded-full md:block"></div>
          <div class="timeline-line absolute md:hidden"></div>
          <div class="relative grid grid-cols-1 gap-6 md:grid-cols-5">
            <div class="relative pl-12 md:pl-0 md:pt-10 md:text-center">
              <span class="absolute left-4 top-6 h-4 w-4 rounded-full border-[3px] border-brand-yellow bg-white shadow-glow md:left-1/2 md:top-[22px] md:-translate-x-1/2"></span>
              <article class="glass p-5 md:min-h-[240px]">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">⚡</div>
                <h3 class="mb-2 text-base font-bold">1. Motor e bateria</h3>
                <p class="text-xs leading-relaxed text-brand-dim">Avaliamos 350W, 500W, 1000W e 1640W junto da voltagem. Patinete elétrico 1000W com bateria pequena descarrega rápido — equilíbrio pesa na nota da melhor scooter elétrica.</p>
              </article>
            </div>
            <div class="relative pl-12 md:pl-0 md:pt-10 md:text-center">
              <span class="absolute left-4 top-6 h-4 w-4 rounded-full border-[3px] border-brand-yellow bg-white shadow-glow md:left-1/2 md:top-[22px] md:-translate-x-1/2"></span>
              <article class="glass p-5 md:min-h-[240px]">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">🔋</div>
                <h3 class="mb-2 text-base font-bold">2. Autonomia real</h3>
                <p class="text-xs leading-relaxed text-brand-dim">Descontamos promessas de fábrica: peso do piloto, turbo e ladeiras cortam os km. Priorizamos pack em Ah coerente com o motor.</p>
              </article>
            </div>
            <div class="relative pl-12 md:pl-0 md:pt-10 md:text-center">
              <span class="absolute left-4 top-6 h-4 w-4 rounded-full border-[3px] border-brand-yellow bg-white shadow-glow md:left-1/2 md:top-[22px] md:-translate-x-1/2"></span>
              <article class="glass p-5 md:min-h-[240px]">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">🛑</div>
                <h3 class="mb-2 text-base font-bold">3. Freios e segurança</h3>
                <p class="text-xs leading-relaxed text-brand-dim">Scooter elétrica adulta para em disco + eletrofreio. Farol, suspensão e carga máxima entram na nota do melhor patinete elétrico adulto.</p>
              </article>
            </div>
            <div class="relative pl-12 md:pl-0 md:pt-10 md:text-center">
              <span class="absolute left-4 top-6 h-4 w-4 rounded-full border-[3px] border-brand-yellow bg-white shadow-glow md:left-1/2 md:top-[22px] md:-translate-x-1/2"></span>
              <article class="glass p-5 md:min-h-[240px]">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">🛴</div>
                <h3 class="mb-2 text-base font-bold">4. Tipo de uso</h3>
                <p class="text-xs leading-relaxed text-brand-dim">Entrada 350W, assento 500W, off-road 1000W e performance 1640W. Cada recorte tem baseline próprio entre as melhores marcas de patinete elétrico.</p>
              </article>
            </div>
            <div class="relative pl-12 md:pl-0 md:pt-10 md:text-center">
              <span class="absolute left-4 top-6 h-4 w-4 rounded-full border-[3px] border-brand-yellow bg-white shadow-glow md:left-1/2 md:top-[22px] md:-translate-x-1/2"></span>
              <article class="glass p-5 md:min-h-[240px]">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">💰</div>
                <h3 class="mb-2 text-base font-bold">5. Custo-benefício</h3>
                <p class="text-xs leading-relaxed text-brand-dim">Preço no ML, peso, app Bluetooth e relatos de compradores definem quem entrega a melhor scooter elétrica por real investido.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12" id="como-escolher">
      <div class="glass w-full p-6 md:p-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Como escolher o <span class="text-brand-yellow">melhor patinete elétrico</span></h2>
        <p class="mb-6 text-brand-muted">
          Escolher entre os <strong>melhores patinetes elétricos</strong> começa pelo trajeto: km por dia, ladeiras, se você precisa dobrar para o metrô e se quer ir em pé ou com assento.
          A <strong>melhor scooter elétrica</strong> para um adulto de 70 kg em asfalto liso não é a mesma do piloto de 100 kg em rua esburacada. Foston e Oimotoo cobrem entrada; Honeywhale M2 MAX-B traz banco; Hitway H18 é o <strong>patinete elétrico 1000W</strong> off-road; G3 Pro fecha performance.
        </p>
        <h3 class="mb-2 text-lg font-bold text-brand-yellow">Motor: 350W, 500W, 1000W ou 1640W?</h3>
        <p class="mb-6 text-brand-muted">
          Para ciclovia plana até 12 km, 350W bastam e pesam menos. Rampas curtas pedem 500W. Subida e terra compactada pedem <strong>patinete elétrico 1000W</strong> com bateria 48V 20Ah (H18). 1640W (G3 Pro) é recorte de melhor scooter elétrica de alto desempenho — e de preço. Não compre watts sem Ah proporcional.
        </p>
        <h3 class="mb-2 text-lg font-bold text-brand-yellow">Como carregar e guardar</h3>
        <p class="mb-6 text-brand-muted">
          Como carregar patinete elétrico: tomada seca, primeira carga completa, evite 0% crônico. Dobrável leve sobe no elevador; off-road 1000W pede hall ou garagem. Em condomínio sem tomada, priorize pack que desconecta com facilidade.
        </p>
        <h3 class="mb-2 text-lg font-bold text-brand-yellow">Legislação e melhor marca de patinete elétrico</h3>
        <p class="text-brand-muted">
          No Brasil, o uso urbano de patinete elétrico e scooter elétrica depende de regras locais e do CONTRAN. Modelos até cerca de 32 km/h se aproximam do recorte de mobilidade leve; 50–60 km/h exigem atenção. Entre as <strong>melhores marcas de patinete elétrico</strong> desta lista, Honeywhale e Foston concentram volume no ML; Hitway e Oimotoo aparecem em off-road e entrada. Verifique capacete, iluminação e via permitida antes de circular.
        </p>
      </div>
    </section>

    <section class="py-12" id="tabela">
      <div class="w-full">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Tabela comparativa: <span class="text-brand-yellow">melhores patinetes elétricos</span></h2>
        <div class="glass overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="border-b border-white/10 bg-white/5 text-brand-yellow">
              <tr>
                <th class="px-4 py-3 font-bold">Modelo</th>
                <th class="px-4 py-3 font-bold">Motor</th>
                <th class="px-4 py-3 font-bold">Destaque</th>
                <th class="px-4 py-3 font-bold">Melhor para</th>
                <th class="px-4 py-3 font-bold">Nota</th>
              </tr>
            </thead>
            <tbody class="text-brand-muted">
${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="py-12" id="faq">
      <div class="w-full">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Perguntas frequentes sobre <span class="text-brand-yellow">patinete elétrico</span></h2>
        <div class="space-y-3">
          <details class="glass group p-5" open>
            <summary class="cursor-pointer list-none font-bold marker:content-none">Quanto custa patinete elétrico?</summary>
            <p class="mt-3 text-sm text-brand-muted">Nesta seleção de setembro de 2026, o patinete elétrico Oimotoo 350W parte de <strong>R$ 1.079</strong>; a Foston S09 Pro de <strong>R$ 1.989</strong>; a Honeywhale M2 MAX-B de <strong>R$ 2.321</strong>; o Hitway H18 1000W de <strong>R$ 4.900</strong>; e a melhor scooter elétrica da lista, G3 Pro, de <strong>R$ 6.725</strong>. Preços variam no Mercado Livre.</p>
          </details>
          <details class="glass p-5">
            <summary class="cursor-pointer list-none font-bold marker:content-none">Qual o melhor patinete elétrico?</summary>
            <p class="mt-3 text-sm text-brand-muted">Depende do uso: a <strong>melhor scooter elétrica</strong> de performance é a Honeywhale G3 Pro (nota 9.6). O <strong>melhor patinete elétrico</strong> custo-benefício é a Foston S09 Pro. O <strong>patinete elétrico 1000W</strong> da lista é o Hitway H18. Para adulto com assento, a M2 MAX-B. Não existe um único vencedor — existe o certo para o trajeto.</p>
          </details>
          <details class="glass p-5">
            <summary class="cursor-pointer list-none font-bold marker:content-none">Como carregar patinete elétrico?</summary>
            <p class="mt-3 text-sm text-brand-muted">Como carregar patinete elétrico: conecte o carregador bivolt na tomada e na porta da bateria, em local seco. Primeira carga completa. Tempo típico 4 a 8 horas. Evite 0% crônico e não deixe no 100% por dias.</p>
          </details>
          <details class="glass p-5">
            <summary class="cursor-pointer list-none font-bold marker:content-none">Onde comprar patinete elétrico?</summary>
            <p class="mt-3 text-sm text-brand-muted">Onde comprar patinete elétrico com os anúncios deste ranking: Mercado Livre, conferindo reputação do seller, frete, garantia e se o carregador vem incluso. Use os botões de cada card ou a categoria de mobilidade elétrica.</p>
          </details>
          <details class="glass p-5">
            <summary class="cursor-pointer list-none font-bold marker:content-none">Como funciona o patinete elétrico?</summary>
            <p class="mt-3 text-sm text-brand-muted">Como funciona o patinete elétrico: a scooter elétrica usa motor no cubo, bateria de lítio e controlador. O acelerador no guidão define a potência; o freio a disco (e o eletrofreio) reduz a velocidade. O display mostra carga, modo e km/h. Capacete e luz não são opcionais no uso adulto.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="pb-14" aria-label="Autor">
      <div class="glass flex w-full flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-black shadow-glow">Equipe</div>
        <div>
          <h3 class="mb-1 text-lg font-bold">Equipe Tudo de Melhor</h3>
          <p class="mb-3 text-sm text-brand-muted">Conteúdo editorial independente sobre a melhor scooter elétrica e os melhores patinetes elétricos. Nomes, imagens e preços extraídos das páginas do Mercado Livre em setembro de 2026; notas de 0 a 10 são editoriais. Links de afiliados podem gerar comissão, sem custo extra para você.</p>
          <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Atualizado em setembro de 2026</span>
        </div>
      </div>
    </section>
      </div>
    </div>
  </main>
${siteFooter()}
  <script>
    document.getElementById('y').textContent = new Date().getFullYear();
    const toggle = document.getElementById('nav-toggle');
    const mobile = document.getElementById('mobile-nav');
    toggle?.addEventListener('click', () => {
      const open = mobile.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile?.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobile.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.getElementById('page-index-mobile')?.addEventListener('change', (e) => {
      const value = e.target.value;
      if (value) { location.href = value; e.target.value = ''; }
    });
  </script>
</body>
</html>
`;
}

function buildReview(p) {
  const items = galleryItems(p);
  const jsonAttr = JSON.stringify(items).replace(/'/g, "&#39;");
  const deps = depoimentos(p);
  const alts = PRODUCTS.filter((x) => x.file !== p.file).slice(0, 2);
  const analysis = analysisBlock(p);
  const faqs = faqsFor(p);
  const specRows = p.specs
    .map(
      ([k, v], i) =>
        `<tr class="${i === p.specs.length - 1 ? "even:bg-white/5" : "border-b border-white/10 even:bg-white/5"}"><th scope="row" class="px-4 py-3 font-semibold text-white">${esc(k)}</th><td class="px-4 py-3 text-brand-muted">${esc(v)}</td></tr>`
    )
    .join("\n              ");
  const faqJson = faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") },
  }));
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://tudodemelhor.com.br/" },
          { "@type": "ListItem", position: 2, name: "Melhores Patinetes Elétricos", item: `https://tudodemelhor.com.br/${RANKING}` },
          { "@type": "ListItem", position: 3, name: p.name },
        ],
      },
      {
        "@type": "Product",
        name: p.fullName,
        brand: { "@type": "Brand", name: p.brand },
        image: p.hero,
        description: `${p.fullName}. #${p.pos} do ranking Tudo de Melhor de melhores patinetes elétricos.`,
        review: {
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: p.score, bestRating: "10" },
          author: { "@type": "Organization", name: "Tudo de Melhor" },
        },
        offers: {
          "@type": "Offer",
          url: p.affiliate,
          priceCurrency: "BRL",
          price: p.priceNum,
          availability: "https://schema.org/InStock",
        },
      },
      { "@type": "FAQPage", mainEntity: faqJson },
    ],
  };

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
${gtagBlock()}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(p.name)} vale a pena? Review do patinete elétrico ${esc(p.shortTitle)}: nota ${p.score}, ${p.price} no Mercado Livre. Compare com os melhores patinetes elétricos de 2026.">
  <title>Review ${esc(p.name)} Vale a Pena? Patinete Elétrico ${esc(p.shortTitle)} | Tudo de Melhor</title>
  <link rel="canonical" href="https://tudodemelhor.com.br/${p.file}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
${tailwindBlock()}
  <style>
    body {
      background-image:
        radial-gradient(ellipse 70% 45% at 85% 10%, rgba(255, 153, 0, 0.14), transparent 55%),
        radial-gradient(ellipse 50% 40% at 10% 85%, rgba(255, 230, 0, 0.07), transparent 50%),
        radial-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px);
      background-size: auto, auto, 18px 18px;
      background-attachment: fixed;
    }
    @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
    .animate-marquee { animation: marquee 25s linear infinite; width: max-content; }
    .animate-marquee:hover, .animate-marquee:active { animation-play-state: paused; }
  </style>
  <script type="application/ld+json">
  ${JSON.stringify(ld)}
  </script>
</head>
<body class="bg-brand-bg text-white font-sans antialiased min-h-screen pb-32">
${siteHeader()}
  <main class="px-4 pt-8">
    <div class="mx-auto max-w-6xl">
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-brand-dim" aria-label="Breadcrumb">
        <a href="index.html" class="hover:text-brand-yellow">Início</a>
        <span aria-hidden="true">/</span>
        <a href="${RANKING}" class="hover:text-brand-yellow">Melhores Patinetes Elétricos</a>
        <span aria-hidden="true">/</span>
        <span class="text-white" aria-current="page">${esc(p.name)}</span>
      </nav>

      <header class="mb-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="glass relative order-2 overflow-hidden p-6 md:order-1 md:p-10">
          <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-yellow/10 blur-3xl"></div>
          <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Review · #${p.pos} do ranking 2026</p>
          <h1 class="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">${esc(p.name)} vale a pena? Análise do patinete elétrico ${esc(p.shortTitle)}</h1>
          <p class="mb-6 hidden max-w-2xl text-lg text-brand-muted md:block">${p.promise}</p>
          <div class="mb-6 flex flex-wrap gap-2">
            <span class="rounded-md bg-brand-yellow px-3 py-1 text-[10px] font-extrabold uppercase text-black shadow-glow">${esc(p.badge)}</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Nota editorial ${p.score}</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">A partir de ${p.price}</span>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a class="inline-flex h-12 items-center justify-center rounded-xl bg-brand-yellow px-6 font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.affiliate}">Comprar no Mercado Livre</a>
          </div>
          <div class="product-gallery mt-4" aria-label="Galeria de fotos do produto" data-gallery-images='${jsonAttr}'>
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Fotos do produto</p>
            <div class="flex flex-wrap gap-2">${thumbsHtml(items)}</div>
          </div>
        </div>
        <div class="glass relative order-1 flex h-full min-h-[420px] flex-col overflow-hidden p-5 shadow-glow-emerald md:order-2 md:min-h-0 md:p-6">
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-brand-yellow/5"></div>
          <div class="relative flex min-h-0 flex-1 items-center justify-center">
            <div class="hero-video-wrap relative mx-auto aspect-[9/16] h-full w-full max-h-full max-w-[min(100%,315px)] overflow-hidden rounded-2xl bg-black/20 shadow-lg">
              <video class="lazy-hero-video absolute inset-0 h-full w-full rounded-2xl object-cover" data-src="${p.video}" preload="none" muted playsinline loop aria-label="Review ${esc(p.name)}"></video>
            </div>
          </div>
          <p class="relative mt-4 text-center text-xs text-brand-dim">${esc(p.videoCaption)}</p>
        </div>
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
          <p class="mt-4 text-brand-muted">${p.verdict}</p>
        </article>
        <article class="glass p-5">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Para quem é</h3>
          <p class="m-0 text-sm text-brand-muted">${p.forWho}</p>
        </article>
        <article class="glass p-5">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Diferencial</h3>
          <p class="m-0 text-sm font-bold text-brand-yellow">${p.diferencial}</p>
        </article>
        <article class="glass col-span-2 p-5 md:col-span-2">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Promessa</h3>
          <p class="m-0 text-sm text-brand-muted">${p.promise}</p>
        </article>
      </section>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Prós e <span class="text-brand-yellow">contras</span> da ${esc(p.name)}</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="glass border-emerald-500/30 p-6 shadow-glow-emerald">
            <h3 class="mb-4 text-lg font-bold text-emerald-300">Pontos fortes</h3>
            <ul class="list-disc space-y-2 pl-5 text-sm text-brand-muted">
              ${p.pros.map((t) => `<li>${t}</li>`).join("\n              ")}
            </ul>
          </div>
          <div class="glass border-orange-500/30 p-6">
            <h3 class="mb-4 text-lg font-bold text-orange-300">Limitações</h3>
            <ul class="list-disc space-y-2 pl-5 text-sm text-brand-muted">
              ${p.cons.map((t) => `<li>${t}</li>`).join("\n              ")}
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Especificações <span class="text-brand-yellow">técnicas</span></h2>
        <div class="glass overflow-hidden">
          <table class="w-full text-left text-sm">
            <tbody>
              ${specRows}
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-10" aria-label="Fotos de quem comprou">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Fotos de <span class="text-brand-yellow">quem comprou</span></h2>
        <div class="glass p-5 md:p-6">
          <p class="mb-4 text-sm text-brand-muted">Imagens reais enviadas por clientes que compraram o produto no Mercado Livre.</p>
${marqueeHtml(deps)}
        </div>
      </section>

      <section class="mb-10">
        <article class="glass p-6 md:p-10">
          <h2 class="mb-4 text-2xl font-extrabold md:text-3xl">${analysis.h2}</h2>
          <p class="mb-5 text-brand-muted">${analysis.intro}</p>
          ${analysis.sections
            .map(
              (s) => `<h3 class="mb-2 text-lg font-bold text-brand-yellow">${s.h}</h3>
          <p class="mb-5 text-brand-muted">${s.p}</p>`
            )
            .join("\n          ")}
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
            <p class="mb-5 text-sm text-brand-muted">Anúncio rastreado: ${esc(p.fullName)}. Confira seller, frete, garantia e o preço do dia.</p>
            <a class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.affiliate}">Ir para o Mercado Livre</a>
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
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          ${alts.map(altCard).join("")}
          <a class="glass flex flex-col justify-center p-5 transition hover:-translate-y-1 hover:shadow-glow" href="${RANKING}">
            <p class="mb-2 text-xs font-bold uppercase text-brand-yellow">Lista completa</p>
            <h3 class="mb-2 text-lg font-bold text-white">Voltar ao ranking</h3>
            <p class="text-sm text-brand-dim">Ver os 6 patinetes elétricos comparados lado a lado.</p>
          </a>
        </div>
      </section>

      <section class="mb-10" id="faq">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Perguntas frequentes sobre o <span class="text-brand-yellow">${esc(p.name)}</span></h2>
        <div class="space-y-3">
          ${faqs
            .map(
              (f, i) => `<details class="glass p-5"${i === 0 ? " open" : ""}>
            <summary class="cursor-pointer list-none font-bold">${esc(f.q)}</summary>
            <p class="mt-3 text-sm text-brand-muted">${f.a}</p>
          </details>`
            )
            .join("\n          ")}
        </div>
      </section>

      <section class="mb-10" aria-label="Autor">
        <div class="glass flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-black shadow-glow">Equipe</div>
          <div>
            <h3 class="mb-1 text-lg font-bold">Equipe Tudo de Melhor</h3>
            <p class="text-sm text-brand-muted">Review do #${p.pos} do ranking de patinetes elétricos. Nome, imagem e preço extraídos do anúncio do Mercado Livre. Links de afiliados podem gerar comissão, sem custo extra para você.</p>
          </div>
        </div>
      </section>
    </div>
  </main>

  <div class="fixed bottom-0 z-50 w-full border-t border-slate-800 bg-slate-900/95 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div class="min-w-0 w-full text-center sm:w-auto sm:text-left">
        <strong class="block truncate text-base text-white sm:text-lg">${esc(p.name)}</strong>
        <div class="text-base font-bold text-brand-yellow">Nota ${p.score} · a partir de ${p.price}</div>
      </div>
      <a class="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg transition-all hover:bg-yellow-500 sm:w-auto" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.affiliate}">Comprar no Mercado Livre</a>
    </div>
  </div>
${siteFooter()}
${navScript()}
  <script src="assets/js/lazy-hero-video.js" defer></script>
  <script src="assets/js/product-gallery-lightbox.js" defer></script>
</body>
</html>
`;
}

fs.writeFileSync(path.join(ROOT, RANKING), buildRanking());
for (const p of PRODUCTS) {
  fs.writeFileSync(path.join(ROOT, p.file), buildReview(p));
  console.log("wrote", p.file);
}

function patch(file, replacements) {
  const fp = path.join(ROOT, file);
  let html = fs.readFileSync(fp, "utf8");
  for (const [from, to] of replacements) {
    if (!html.includes(from)) {
      console.warn("skip missing in", file, from.slice(0, 80));
      continue;
    }
    html = html.replaceAll(from, to);
  }
  fs.writeFileSync(fp, html);
}

patch("categorias.html", [
  [
    `<p class="mb-6 flex-1 text-sm text-brand-muted">Análises de scooters urbanos e utilitários, como a Nado K3 750W, com ficha técnica, autonomia e veredito editorial.</p>
            <a href="reviews.html" class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow">Ver Análises</a>`,
    `<p class="mb-6 flex-1 text-sm text-brand-muted">Ranking da melhor scooter elétrica e dos melhores patinetes elétricos 2026: G3 Pro, Foston S09 Pro, Hitway H18 1000W e mais.</p>
            <a href="${RANKING}" class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow">Ver Ranking</a>`,
  ],
  [`<a href="reviews.html" class="hover:text-brand-yellow">Patinetes Elétricos</a>`, `<a href="${RANKING}" class="hover:text-brand-yellow">Patinetes Elétricos</a>`],
]);

patch("index.html", [
  [
    `<a href="reviews.html" class="glass group flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-glow-orange">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">🛴</div>
            <h3 class="text-lg font-bold">Patinetes Elétricos</h3>
            <p class="text-sm text-brand-dim">Scooters urbanos e utilitários com ficha técnica e veredito de compra.</p>
          </a>`,
    `<a href="${RANKING}" class="glass group flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-glow-orange">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl text-black shadow-glow">🛴</div>
            <h3 class="text-lg font-bold">Patinetes Elétricos</h3>
            <p class="text-sm text-brand-dim">Scooters urbanos, 1000W e dobráveis com nota editorial e ofertas no Mercado Livre.</p>
          </a>`,
  ],
  [`<a href="reviews.html" class="hover:text-brand-yellow">Patinetes Elétricos</a>`, `<a href="${RANKING}" class="hover:text-brand-yellow">Patinetes Elétricos</a>`],
]);

patch("reviews.html", [
  [`<a href="review-nado-k3.html" class="text-brand-yellow hover:underline">Patinetes →</a>`, `<a href="${RANKING}" class="text-brand-yellow hover:underline">Patinetes →</a>`],
  [`<a href="reviews.html" class="hover:text-brand-yellow">Patinetes Elétricos</a>`, `<a href="${RANKING}" class="hover:text-brand-yellow">Patinetes Elétricos</a>`],
]);

const reviewsPath = path.join(ROOT, "reviews.html");
let reviews = fs.readFileSync(reviewsPath, "utf8");
if (!reviews.includes("Patinetes elétricos")) {
  const scooterHeader = `          <div class="col-span-full border-t border-white/10 pt-8" data-category="mobilidade">
            <p class="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Mobilidade</p>
            <h3 class="text-xl font-extrabold text-white md:text-2xl">Patinetes elétricos</h3>
          </div>
`;
  const scooterCards = PRODUCTS.map((p) => {
    const bullets = p.bullets
      .map((t) => `                <li class="flex gap-2 text-sm text-brand-muted">${CHECK}<span>${t}</span></li>`)
      .join("\n");
    return `          <article class="glass group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-glow" data-category="mobilidade">
            <div class="mb-4 flex items-center justify-between gap-3">
              <span class="rounded-md bg-brand-yellow px-2 py-1 text-[10px] font-extrabold uppercase text-black shadow-glow">${p.score}</span>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-brand-dim">#${p.pos} · ${esc(p.badge)}</span>
            </div>
            <div class="mb-4 flex h-36 items-center justify-center rounded-xl bg-white p-4">
              <img src="${p.hero}" alt="${esc(p.fullName)} — melhores patinetes eletricos" class="max-h-full w-full object-contain" width="240" height="240" loading="lazy">
            </div>
            <h3 class="mb-2 text-xl font-bold">${esc(p.name)}</h3>
            <div class="mb-6 flex-1">
              <div class="flex items-center gap-2 mb-3"><span class="text-blue-500">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-2">
${bullets}
              </ul>
            </div>
            <a href="${p.file}" class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow">Ler Review Completo</a>
          </article>`;
  }).join("\n");
  reviews = reviews.replace(
    /<div id="reviews-grid" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">/,
    `<div id="reviews-grid" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">\n${scooterHeader}${scooterCards}`
  );
  fs.writeFileSync(reviewsPath, reviews);
}

let sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
if (!sitemap.includes(RANKING)) {
  const extra = [
    RANKING,
    ...PRODUCTS.map((p) => p.file),
  ]
    .map(
      (f) => `  <url>
    <loc>https://tudodemelhor.com.br/${f}</loc>
    <lastmod>2026-09-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");
  sitemap = sitemap.replace("</urlset>", `${extra}\n</urlset>`);
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
}

console.log("wrote", RANKING);

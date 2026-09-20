import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const thumb = (url, alt, i) =>
  `<img src="${url}" alt="${esc(alt)}" class="product-gallery-thumb h-16 w-16 shrink-0 cursor-pointer rounded-lg border border-white/10 object-cover transition hover:border-brand-yellow/40 hover:ring-1 hover:ring-brand-yellow/30" data-index="${i}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer" width="64" height="64">`;

const marqueeCard = (url, alt, hidden) => `
            <div class="glass shrink-0 w-48 h-48 sm:w-60 sm:h-60 relative rounded-xl overflow-hidden border border-white/10 hover:border-brand-yellow/50 hover:shadow-glow transition-all">
              <img src="${url}" alt="${hidden ? '' : esc(alt)}" class="w-full h-full object-cover" loading="lazy" decoding="async"${hidden ? ' aria-hidden="true"' : ''}>
            </div>`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function jsonLdFaq(faqs) {
  return faqs.map((f) => `{
            "@type": "Question",
            "name": ${JSON.stringify(f.q)},
            "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a.replace(/<[^>]+>/g, ''))} }
          }`).join(',\n          ');
}

function specsRows(specs) {
  return specs.map((row, i) => {
    const last = i === specs.length - 1;
    return `<tr class="${last ? 'even:bg-white/5' : 'border-b border-white/10 even:bg-white/5'}"><th scope="row" class="px-4 py-3 font-semibold text-white">${row[0]}</th><td class="px-4 py-3 text-brand-muted">${row[1]}</td></tr>`;
  }).join('\n              ');
}

function altCard(a) {
  return `<article class="glass relative flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-glow">
            <span class="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-black shadow-glow" aria-label="Posição ${a.pos}">${a.pos}</span>
            <div class="mx-auto mt-8 flex h-44 w-full items-center justify-center">
              <img src="${a.img}" alt="${esc(a.imgAlt)}" class="max-h-44 w-full object-contain" width="400" height="400" loading="lazy">
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="rounded border border-brand-yellow/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-yellow">${a.brand}</span>
              <h3 class="text-lg font-bold text-white">${a.name}</h3>
            </div>
            <div class="mt-3 flex-1">
              <div class="mb-3 flex items-center gap-2"><span class="text-violet-400">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-2">
              ${a.bullets.map((b) => `<li class="flex gap-2 text-sm text-brand-muted"><svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg><span>${b}</span></li>`).join('\n              ')}
              </ul>
            </div>
            <div class="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Nota Tudo de Melhor</span>
              <div class="leading-none"><span class="text-3xl font-bold text-brand-yellow">${a.score}</span><span class="text-sm text-brand-dim">/100</span></div>
            </div>
            <div class="mt-5 border-t border-white/10 pt-4">
              <p class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Melhor preço</p>
              <p class="text-xl font-bold text-white">${a.price}</p>
              <div class="mt-3 flex flex-col gap-2">
                <a class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-yellow px-4 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${a.meli}">Comprar no Mercado Livre</a>
                <a class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-yellow bg-transparent px-4 text-sm font-bold text-brand-yellow transition hover:bg-brand-yellow/10" href="${a.href}">Ver Análise Completa</a>
              </div>
            </div>
          </article>`;
}

function render(p) {
  const galleryJson = JSON.stringify(p.gallery);
  const thumbs = p.gallery.map((g, i) => thumb(g.url, g.alt, i)).join('\n            ');
  const social = (p.depoimentos.length ? p.depoimentos : p.gallery).map((g, i) => ({
    url: g.url,
    alt: g.alt || `${p.short} — foto ${i + 1}`
  }));
  const marquee = [...social, ...social].map((g, i) => marqueeCard(g.url, g.alt, i >= social.length)).join('');
  const socialCaption = p.depoimentos.length
    ? 'Imagens reais enviadas por clientes que compraram o produto no Mercado Livre.'
    : 'O anúncio não listou fotos de compradores neste lote — abaixo estão ângulos oficiais da bicicleta elétrica dobrável no Mercado Livre.';
  const heroMedia = p.video
    ? `<video
                class="lazy-hero-video absolute inset-0 h-full w-full rounded-2xl object-cover"
                data-src="${p.video}"
                preload="none"
                muted
                playsinline
                loop
                aria-label="Review ${p.short}"
              ></video>`
    : `<img src="${p.gallery[0].url}" alt="${esc(p.gallery[0].alt)}" class="h-full w-full object-contain" referrerpolicy="no-referrer">`;

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJRGBSSWQG"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-KJRGBSSWQG');
  </script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(p.description)}">
  <title>${esc(p.title)}</title>
  <link rel="canonical" href="https://tudodemelhor.com.br/${p.file}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              bg: '#232F3E',
              yellow: '#FFE600',
              orange: '#FF9900',
              card: 'rgba(27, 37, 48, 0.7)',
              elevated: '#1B2530',
              border: '#37475A',
              muted: '#D5D9D9',
              dim: '#AAB3BD'
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif']
          },
          boxShadow: {
            glow: '0 0 15px rgba(255, 230, 0, 0.4)',
            'glow-lg': '0 0 28px rgba(255, 230, 0, 0.45)',
            'glow-orange': '0 0 20px rgba(255, 153, 0, 0.35)',
            'glow-emerald': '0 0 24px rgba(16, 185, 129, 0.3)'
          },
          backgroundImage: {
            'brand-gradient': 'linear-gradient(135deg, #FFE600 0%, #FF9900 100%)'
          }
        }
      }
    }
  </script>
  <style type="text/tailwindcss">
    @layer utilities {
      .glass {
        @apply bg-brand-card backdrop-blur-md border border-white/10 rounded-2xl;
      }
    }
  </style>
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
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://tudodemelhor.com.br/" },
          { "@type": "ListItem", "position": 2, "name": "Melhores Bicicletas Elétricas Dobráveis", "item": "https://tudodemelhor.com.br/melhores-bicicletas-eletricas-dobraveis.html" },
          { "@type": "ListItem", "position": 3, "name": "${p.crumb}" }
        ]
      },
      {
        "@type": "Product",
        "name": ${JSON.stringify(p.productName)},
        "brand": { "@type": "Brand", "name": ${JSON.stringify(p.brand)} },
        "image": ${JSON.stringify(p.gallery[0].url)},
        "description": ${JSON.stringify(p.schemaDesc)},
        "review": {
          "@type": "Review",
          "reviewRating": { "@type": "Rating", "ratingValue": "${p.note}", "bestRating": "10" },
          "author": { "@type": "Organization", "name": "Tudo de Melhor" }
        },
        "offers": {
          "@type": "Offer",
          "url": "${p.meli}",
          "priceCurrency": "BRL",
          "price": "${p.priceSchema}",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ${jsonLdFaq(p.faqs)}
        ]
      }
    ]
  }
  </script>
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
        <span class="flex flex-col gap-1.5">
          <span class="block h-0.5 w-6 bg-white"></span>
          <span class="block h-0.5 w-6 bg-white"></span>
          <span class="block h-0.5 w-6 bg-white"></span>
        </span>
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
          <svg class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="M20 20l-3.5-3.5"></path>
          </svg>
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
      <label class="relative mt-3 block">
        <span class="sr-only">Buscar</span>
        <svg class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="M20 20l-3.5-3.5"></path>
        </svg>
        <input type="search" placeholder="Buscar" class="h-11 w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-sm placeholder:text-brand-dim">
      </label>
      <a href="#login" class="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/25 font-semibold">Login</a>
    </div>
  </header>

  <main class="px-4 pt-8">
    <div class="mx-auto max-w-6xl">
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-brand-dim" aria-label="Breadcrumb">
        <a href="index.html" class="hover:text-brand-yellow">Início</a>
        <span aria-hidden="true">/</span>
        <a href="melhores-bicicletas-eletricas-dobraveis.html" class="hover:text-brand-yellow">Melhores Bicicletas Elétricas Dobráveis</a>
        <span aria-hidden="true">/</span>
        <span class="text-white" aria-current="page">${p.crumb}</span>
      </nav>

      <header class="mb-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="glass relative order-2 overflow-hidden p-6 md:order-1 md:p-10">
          <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-yellow/10 blur-3xl"></div>
          <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Review · #${p.rank} do ranking dobrável 2026</p>
          <h1 class="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">${p.h1}</h1>
          <p class="mb-6 hidden max-w-2xl text-lg text-brand-muted md:block">
            ${p.lead}
          </p>
          <div class="mb-6 flex flex-wrap gap-2">
            <span class="rounded-md bg-brand-yellow px-3 py-1 text-[10px] font-extrabold uppercase text-black shadow-glow">${p.badge}</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">Nota editorial ${p.note}</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">A partir de ${p.priceLabel}</span>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a class="inline-flex h-12 items-center justify-center rounded-xl bg-brand-yellow px-6 font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.meli}">Comprar no Mercado Livre</a>
          </div>
          <div class="product-gallery mt-4" aria-label="Galeria de fotos do produto" data-gallery-images='${galleryJson}'>
            <p class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Fotos do produto</p>
            <div class="flex flex-wrap gap-2">${thumbs}</div>
          </div>
        </div>

        <div class="glass relative order-1 flex h-full min-h-[420px] flex-col overflow-hidden p-5 shadow-glow-emerald md:order-2 md:min-h-0 md:p-6">
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-brand-yellow/5"></div>
          <div class="relative flex min-h-0 flex-1 items-center justify-center">
            <div class="hero-video-wrap relative mx-auto aspect-[9/16] h-full w-full max-h-full max-w-[min(100%,315px)] overflow-hidden rounded-2xl bg-black/20 shadow-lg">
              ${heroMedia}
            </div>
          </div>
          <p class="relative mt-4 text-center text-xs text-brand-dim">${p.heroCaption}</p>
        </div>
      </header>

      <nav class="glass mb-8 flex flex-wrap gap-2 p-3 sm:p-4" aria-label="Índice da review">
        <p class="w-full text-[10px] font-bold uppercase tracking-wider text-brand-dim">Índice</p>
        <a href="#veredito" class="rounded-lg border border-white/10 px-3 py-2 text-sm text-brand-muted transition hover:border-brand-yellow/40 hover:text-brand-yellow">Veredito</a>
        <a href="#compradores" class="rounded-lg border border-white/10 px-3 py-2 text-sm text-brand-muted transition hover:border-brand-yellow/40 hover:text-brand-yellow">Compradores</a>
        <a href="#pros-contras" class="rounded-lg border border-white/10 px-3 py-2 text-sm text-brand-muted transition hover:border-brand-yellow/40 hover:text-brand-yellow">Prós e Contras</a>
        <a href="#especificacoes" class="rounded-lg border border-white/10 px-3 py-2 text-sm text-brand-muted transition hover:border-brand-yellow/40 hover:text-brand-yellow">Especificações</a>
        <a href="#analise" class="rounded-lg border border-white/10 px-3 py-2 text-sm text-brand-muted transition hover:border-brand-yellow/40 hover:text-brand-yellow">Análise</a>
        <a href="#faq" class="rounded-lg border border-white/10 px-3 py-2 text-sm text-brand-muted transition hover:border-brand-yellow/40 hover:text-brand-yellow">FAQ</a>
      </nav>

      <section id="veredito" class="mb-10 scroll-mt-28 grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="Veredito rápido">
        <article class="glass col-span-2 p-6 md:row-span-2">
          <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-brand-dim">Veredito rápido</h2>
          <div class="flex items-end gap-4">
            <span class="text-6xl font-black leading-none text-brand-yellow drop-shadow-[0_0_15px_rgba(255,230,0,0.4)]">${p.note}</span>
            <div class="pb-1">
              <div class="text-xl text-brand-yellow" aria-label="Nota máxima do ranking">★★★★★</div>
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
          <p class="m-0 text-sm font-bold text-brand-yellow">${p.diff}</p>
        </article>
        <article class="glass col-span-2 p-5 md:col-span-2">
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-dim">Promessa</h3>
          <p class="m-0 text-sm text-brand-muted">${p.promise}</p>
        </article>
      </section>

      <section id="pros-contras" class="mb-10 scroll-mt-28">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Prós e <span class="text-brand-yellow">contras</span> da ${p.short}</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="glass border-emerald-500/30 p-6 shadow-glow-emerald">
            <h3 class="mb-4 text-lg font-bold text-emerald-300">Pontos fortes</h3>
            <ul class="list-disc space-y-2 pl-5 text-sm text-brand-muted">
              ${p.pros.map((x) => `<li>${x}</li>`).join('\n              ')}
            </ul>
          </div>
          <div class="glass border-orange-500/30 p-6">
            <h3 class="mb-4 text-lg font-bold text-orange-300">Limitações</h3>
            <ul class="list-disc space-y-2 pl-5 text-sm text-brand-muted">
              ${p.cons.map((x) => `<li>${x}</li>`).join('\n              ')}
            </ul>
          </div>
        </div>
      </section>

      <section id="especificacoes" class="mb-10 scroll-mt-28">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Especificações <span class="text-brand-yellow">técnicas</span></h2>
        <div class="glass overflow-hidden">
          <table class="w-full text-left text-sm">
            <tbody>
              ${specsRows(p.specs)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="compradores" class="mb-10 scroll-mt-28" aria-label="Fotos de quem comprou">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Fotos de <span class="text-brand-yellow">quem comprou</span></h2>
        <div class="glass p-5 md:p-6">
          <p class="mb-4 text-sm text-brand-muted">${socialCaption}</p>
          <div class="overflow-hidden w-full relative">
            <div class="flex gap-4 animate-marquee">${marquee}
            </div>
          </div>
        </div>
      </section>

      <section id="analise" class="mb-10 scroll-mt-28">
        <article class="glass p-6 md:p-10">
          ${p.analysis}
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
            <p class="mb-5 text-sm text-brand-muted">Anúncio rastreado: ${p.productName}. Confira seller, frete, garantia e o preço do dia.</p>
            <a class="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.meli}">Ir para o Mercado Livre</a>
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
          ${p.alts.map(altCard).join('')}
          <a class="glass flex flex-col justify-center p-5 transition hover:-translate-y-1 hover:shadow-glow" href="melhores-bicicletas-eletricas-dobraveis.html">
            <p class="mb-2 text-xs font-bold uppercase text-brand-yellow">Lista completa</p>
            <h3 class="mb-2 text-lg font-bold text-white">Voltar ao ranking</h3>
            <p class="text-sm text-brand-dim">Ver as 5 bicicletas elétricas dobráveis comparadas lado a lado.</p>
          </a>
        </div>
      </section>

      <section class="mb-10" id="faq">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Perguntas frequentes sobre a <span class="text-brand-yellow">${p.short}</span></h2>
        <div class="space-y-3">
          ${p.faqs.map((f, i) => `<details class="glass p-5"${i === 0 ? ' open' : ''}>
            <summary class="cursor-pointer list-none font-bold">${f.q}</summary>
            <p class="mt-3 text-sm text-brand-muted">${f.a}</p>
          </details>`).join('\n          ')}
        </div>
      </section>

      <section class="mb-10" aria-label="Autor">
        <div class="glass flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-black shadow-glow">Equipe</div>
          <div>
            <h3 class="mb-1 text-lg font-bold">Equipe Tudo de Melhor</h3>
            <p class="text-sm text-brand-muted">Review do #${p.rank} do ranking de bicicletas elétricas dobráveis. Nome, imagem e preço extraídos do anúncio do Mercado Livre. Links de afiliados podem gerar comissão, sem custo extra para você.</p>
          </div>
        </div>
      </section>
    </div>
  </main>

  <div class="fixed bottom-0 z-50 w-full border-t border-slate-800 bg-slate-900/95 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div class="min-w-0 w-full text-center sm:w-auto sm:text-left">
        <strong class="block truncate text-base text-white sm:text-lg">${p.short}</strong>
        <div class="text-base font-bold text-brand-yellow">Nota ${p.note} · a partir de ${p.priceLabel}</div>
      </div>
      <a class="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-lg transition-all hover:bg-yellow-500 sm:w-auto" rel="sponsored noopener" target="_blank" onclick="gtag('event', 'clique_afiliado_ml');" href="${p.meli}">Comprar no Mercado Livre</a>
    </div>
  </div>

  <footer class="mt-8 border-t border-brand-border bg-[#1a222d] px-4 py-10">
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
          <a href="melhores-bicicletas-eletricas-dobraveis.html" class="hover:text-brand-yellow">Bikes Dobráveis</a>
          <a href="melhores-patinetes-eletricos.html" class="hover:text-brand-yellow">Patinetes Elétricos</a>
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
  </footer>

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
  </script>
  <script src="assets/js/lazy-hero-video.js" defer></script>
  <script src="assets/js/product-gallery-lightbox.js" defer></script>
</body>
</html>
`;
}

const altS6 = {
  pos: 2,
  img: 'https://http2.mlstatic.com/D_NQ_NP_2X_822384-MLB109485329446_042026-F.webp',
  imgAlt: 'Oimotoo S6 bicicleta elétrica dobrável 450W — bike elétrica urbana',
  brand: 'OIMOTOO',
  name: 'S6 450W',
  bullets: [
    'Commute urbano dobrável com bateria 48V removível.',
    'Melhor custo-benefício dobrável até R$ 2.500.',
    'Trajetos planos de até 35 km.'
  ],
  score: '97',
  price: 'R$ 2.446',
  meli: 'https://meli.la/1eqMgcv',
  href: 'review-oimotoo-s6.html'
};

const altS6S = {
  pos: 4,
  img: 'https://http2.mlstatic.com/D_NQ_NP_2X_827132-MLA115362824023_072026-F.webp',
  imgAlt: 'Honeywhale S6-S bicicleta elétrica dobrável 750W fat tire',
  brand: 'HONEYWHALE',
  name: 'S6-S 750W',
  bullets: [
    'Fat tire + motor 750W para piso irregular.',
    'Carga até 125 kg e autonomia de 40 km.',
    'Dobrável mais robusta do ranking.'
  ],
  score: '93',
  price: 'R$ 3.799',
  meli: 'https://meli.la/2joNhs5',
  href: 'review-honeywhale-s6-s.html'
};

const altB20 = {
  pos: 1,
  img: 'https://http2.mlstatic.com/D_NQ_NP_2X_603508-MLA113190607451_062026-F.webp',
  imgAlt: 'Honeywhale B20 bicicleta elétrica dobrável 440W — melhor bike elétrica urbana aro 14',
  brand: 'HONEYWHALE',
  name: 'B20 440W',
  bullets: [
    'Equilíbrio 440W + 35 km + freios a disco.',
    'Peso ~20 kg para elevador e apartamento.',
    'Melhor custo-benefício do ranking dobrável.'
  ],
  score: '94',
  price: 'R$ 2.399',
  meli: 'https://meli.la/2i6rBNV',
  href: 'review-honeywhale-b20.html'
};

const products = [
  {
    file: 'review-honeywhale-b20.html',
    crumb: 'Honeywhale B20',
    brand: 'Honeywhale',
    short: 'Honeywhale B20',
    productName: 'Honeywhale B20 Bicicleta Elétrica Dobrável 440W',
    title: 'Review Honeywhale B20 Vale a Pena? Bicicleta Elétrica Dobrável 440W | Tudo de Melhor',
    description: 'Honeywhale B20 vale a pena? Review da bicicleta elétrica dobrável 440W: autonomia 35 km, 25 km/h, aro 14, freios a disco, nota 9.4 e preço no Mercado Livre.',
    schemaDesc: 'Bicicleta elétrica dobrável Honeywhale B20 440W com autonomia de 35 km, 25 km/h, aro 14 e freios a disco. Número 1 do ranking dobrável Tudo de Melhor.',
    h1: 'Honeywhale B20 vale a pena? Análise da bicicleta elétrica dobrável 440W',
    lead: 'Se você busca uma <strong>bicicleta elétrica dobrável</strong> equilibrada — potência suficiente para o dia a dia, autonomia de até 35 km e freios a disco nas duas rodas — a Honeywhale B20 lidera este ranking: motor 440W, carga de 120 kg e aro 14, a partir de R$ 2.399 no Mercado Livre.',
    badge: 'Custo-benefício',
    note: '9.4',
    rank: 1,
    priceLabel: 'R$ 2.399',
    priceSchema: '2399.00',
    meli: 'https://meli.la/2i6rBNV',
    heroCaption: 'Honeywhale B20 · 440W · 35 km · aro 14 · dobrável',
    video: 'https://video-static-clips.mms.mlstatic.com/62c82f1f923a3f082b72612d/019f8721909e7feabea7b448d369e82f/preview/preview_019f877505417f02bcf4cf2772e7d2ed_019f872192ea7288b7580f60d1e0594c.mp4',
    gallery: [
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_603508-MLA113190607451_062026-F.webp', alt: 'Honeywhale B20 bicicleta elétrica dobrável 440W — melhor bike elétrica urbana aro 14' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_754037-MLA89719898443_082025-F.webp', alt: 'Honeywhale B20 bicicleta elétrica dobrável 440W — foto 2 da galeria no Mercado Livre' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_635827-MLA89352913696_082025-F.webp', alt: 'Honeywhale B20 bike elétrica dobrável — foto 3 da galeria, ângulo do quadro' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_910827-MLA89353187538_082025-F.webp', alt: 'Honeywhale B20 bicicleta elétrica dobrável — foto 4 da galeria, detalhes do guidão' }
    ],
    depoimentos: [
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_601910-MLA103233382400_012026-F.webp', alt: 'Honeywhale B20 bicicleta elétrica dobrável — foto real de comprador no Mercado Livre 1' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_994867-MLA103233657942_012026-F.webp', alt: 'Honeywhale B20 bike elétrica — foto real de comprador no Mercado Livre 2' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_925883-MLA91329469295_082025-F.webp', alt: 'Honeywhale B20 bicicleta elétrica dobrável — foto de comprador 3' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_990532-MLA114834565276_082026-F.webp', alt: 'Honeywhale B20 melhor bicicleta elétrica dobrável custo-benefício — foto de comprador 4' }
    ],
    verdict: 'A Honeywhale B20 vale a pena quando você quer a <strong>melhor bicicleta elétrica dobrável</strong> de equilíbrio: motor 440W, autonomia de 35 km e freios a disco sem pagar o preço de um 750W. É a escolha #1 deste ranking para commute urbano.',
    forWho: 'Quem mora em apartamento e precisa dobrar a bike no elevador, com trajetos planos de até 35 km.',
    diff: 'Equilíbrio 440W + 35 km + disco',
    promise: 'Mobilidade urbana com autonomia prática — dobra, guarda em casa e roda até 35 km por carga com frenagem a disco.',
    pros: [
      'Excelente autonomia de até 35 km para trajetos urbanos ida e volta',
      'Sistema de freios a disco dianteiro e traseiro',
      'Design robusto com carga de até 120 kg',
      'Aro 14 e quadro dobrável facilitam armazenamento',
      'Melhor equilíbrio custo-benefício do ranking dobrável (a partir de R$ 2.399)',
      'Peso declarado em torno de 20 kg — levantável para o elevador'
    ],
    cons: [
      'Velocidade máxima de 25 km/h pode parecer baixa para quem quer 40 km/h',
      'Motor 440W sofre em subidas longas e íngremes',
      'Marca importada com assistência mais limitada que Caloi ou Groove',
      'Aro 14 é menos confortável em paralelepípedo do que fat tire'
    ],
    specs: [
      ['Marca', 'Honeywhale'],
      ['Modelo', 'B20 · bicicleta elétrica dobrável'],
      ['Motor', '440W'],
      ['Autonomia', 'Até 35 km (uso urbano misto)'],
      ['Velocidade máxima', '25 km/h'],
      ['Aro', '14 polegadas'],
      ['Freios', 'Disco dianteiro e traseiro'],
      ['Peso suportado', 'Até 120 kg'],
      ['Peso da bike', '~20 kg (confira o anúncio)'],
      ['Dobrável', 'Sim'],
      ['Preço observado', 'A partir de R$ 2.399 (confira o dia)']
    ],
    analysis: `<h2 class="mb-4 text-2xl font-extrabold md:text-3xl">Análise detalhada: avaliação da <span class="text-brand-yellow">bicicleta elétrica Honeywhale B20</span></h2>
          <p class="mb-5 text-brand-muted">
            A pergunta "Honeywhale B20 vale a pena?" faz sentido se o seu contrato é o da <strong>bicicleta elétrica dobrável</strong> de equilíbrio: não é a mais potente da lista, mas é a mais redonda. Motor 440W, autonomia de 35 km, 25 km/h e freios a disco nas duas pontas — o pacote que o ranking elegeu como #1 para quem quer uma <strong>bike elétrica</strong> urbana sem gastar o ticket de um 750W.
            Nesta avaliação cruzamos ficha do Mercado Livre (ago–set/2026), o comparativo do ranking dobrável e o uso real de commute: elevador, porta-malas e recarga em apartamento.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Uso diário e autonomia real</h3>
          <p class="mb-5 text-brand-muted">
            No dia a dia, a B20 cobre 8 a 15 km por trecho com folga. A autonomia declarada de 35 km é o teto em terreno plano e assistência moderada; turbo constante e ladeiras puxam para 25–30 km. Para ida e volta ao trabalho dentro de 15 km, uma carga basta.
            A velocidade máxima de 25 km/h é um limite consciente: cabe no fluxo urbano e evita a zona cinzenta de 40 km/h. Se você prioriza velocidade, a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Oimotoo S6</a> (40 km/h) ou a <a href="review-oimotoo-a9.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Oimotoo A9</a> (600W) entregam mais punch.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Design dobrável: elevador e porta-malas</h3>
          <p class="mb-5 text-brand-muted">
            O aro 14 e o quadro dobrável reduzem o volume para transporte. Dobrada, a Honeywhale B20 passa em elevadores residenciais e entra no porta-malas de hatchbacks. Com ~20 kg, é uma das mais leves desta lista — diferença perceptível na hora de subir escada ou guardar atrás da porta.
            Em condomínios que restringem bike no hall, o formato compacto sobe discreto e guarda no quarto sem ocupar a sala.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Motor 440W e freios a disco</h3>
          <p class="mb-5 text-brand-muted">
            440W sobe rampas leves a moderadas com pedal assistido. Aclives longos acima de 10% pedem perna e drenam bateria — física de motor intermediário, não defeito. O sistema de discos dianteiro e traseiro é o diferencial de segurança frente a modelos de entrada só com freio no cubo.
            Se o seu asfalto é buraco e paralelepípedo, a <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Honeywhale S6-S 750W</a> com fat tire é o upgrade natural.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Compra, entrega e manutenção</h3>
          <p class="text-brand-muted">
            Confira reputação do seller no Mercado Livre, se o carregador vem incluso e a política de 7 dias. A Honeywhale tem volume alto de anúncios — peças de desgaste (pastilhas, pneus aro 14) aparecem com facilidade. Calibre pneus, evite chuva forte no conector e não lave com jato. Como carregar a bicicleta elétrica: use tomada 110/220V bivolt, desconecte ao completar a carga e não deixe a bateria zerada por semanas.
          </p>`,
    faqs: [
      { q: 'Honeywhale B20 vale a pena?', a: 'Sim, para commute urbano até 35 km com orçamento na casa de R$ 2.400. É a <strong>melhor bicicleta elétrica dobrável</strong> de equilíbrio deste ranking: 440W, discos e aro 14.' },
      { q: 'Quanto custa bicicleta elétrica dobrável?', a: 'Nesta seleção, a Honeywhale B20 parte de <strong>R$ 2.399</strong>; a Oimotoo S6 cerca de R$ 2.446; a Dobrável 350W cerca de R$ 2.509; a Oimotoo A9 cerca de R$ 2.999; a Honeywhale S6-S cerca de R$ 3.799. Preços variam no Mercado Livre.' },
      { q: 'Qual a melhor bicicleta elétrica dobrável?', a: 'Depende do uso: equilíbrio e disco, a <strong>Honeywhale B20</strong>; velocidade 40 km/h, a Oimotoo S6 ou A9; piso ruim e 750W, a Honeywhale S6-S; orçamento de entrada, a 350W.' },
      { q: 'Como carregar a bicicleta elétrica?', a: 'Conecte o carregador na tomada e na bateria. Tempo típico: 4 a 8 horas. Evite descarga total e não deixe carregando dias após a carga completa.' },
      { q: 'Onde comprar bicicleta elétrica dobrável?', a: 'No Mercado Livre, com o link rastreado desta review. Confira seller, frete grátis, garantia e o preço do dia antes de fechar.' },
      { q: 'Como funciona a bicicleta elétrica dobrável?', a: 'O motor no cubo recebe energia da bateria via controlador. Pedal assistido ou acelerador disparam a potência; o quadro dobra no miolo para caber em elevador e porta-malas. Freios a disco param a <strong>bike elétrica</strong> com segurança.' }
    ],
    alts: [altS6, altS6S]
  },
  {
    file: 'review-oimotoo-a9.html',
    crumb: 'Oimotoo A9',
    brand: 'Oimotoo',
    short: 'Oimotoo A9',
    productName: 'Oimotoo A9 Bicicleta Elétrica Dobrável 600W',
    title: 'Review Oimotoo A9 Vale a Pena? Bicicleta Elétrica Dobrável 600W | Tudo de Melhor',
    description: 'Oimotoo A9 vale a pena? Review da bicicleta elétrica dobrável 600W: 40 km/h, autonomia 40 km, bateria 48V 12Ah, nota 9.1 e preço no Mercado Livre.',
    schemaDesc: 'Bicicleta elétrica dobrável Oimotoo A9 600W com 40 km/h, autonomia de 40 km e bateria 48V 12Ah. Número 3 do ranking dobrável Tudo de Melhor.',
    h1: 'Oimotoo A9 vale a pena? Análise da bicicleta elétrica dobrável 600W',
    lead: 'Se a prioridade é performance numa <strong>bicicleta elétrica dobrável</strong> — 600W, 40 km/h e até 40 km por carga — a Oimotoo A9 é a mais potente desta lista compacta: aro 14, bateria 48V 12Ah e preço a partir de R$ 2.999 no Mercado Livre.',
    badge: 'Maior desempenho',
    note: '9.1',
    rank: 3,
    priceLabel: 'R$ 2.999',
    priceSchema: '2999.00',
    meli: 'https://meli.la/28brFBe',
    heroCaption: 'Oimotoo A9 · 600W · 40 km/h · 40 km · dobrável',
    video: null,
    gallery: [
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_844827-MLB117511102955_092026-F.webp', alt: 'Oimotoo A9 bicicleta elétrica dobrável 600W 40 km/h — bike elétrica preta aro 14' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_959196-MLB116033697350_092026-F-oimotoo-a9-bicicleta-eletrica-600w-dobravel-40kmh40km.webp', alt: 'Oimotoo A9 bicicleta elétrica 600W dobrável — foto 2 da galeria no Mercado Livre' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_781495-MLB116033756808_092026-F-oimotoo-a9-bicicleta-eletrica-600w-dobravel-40kmh40km.webp', alt: 'Oimotoo A9 bike elétrica 600W — foto 3 da galeria, detalhes do quadro' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_734295-MLB116033756806_092026-F-oimotoo-a9-bicicleta-eletrica-600w-dobravel-40kmh40km.webp', alt: 'Oimotoo A9 bicicleta elétrica dobrável 40 km — foto 4 da galeria' }
    ],
    depoimentos: [],
    verdict: 'A Oimotoo A9 vale a pena quando potência e velocidade pesam mais que o menor preço. É a <strong>bicicleta elétrica dobrável</strong> mais forte desta lista compacta: 600W, 40 km/h e 40 km de autonomia.',
    forWho: 'Quem quer 40 km/h em commute urbano e aceita um pouco mais de peso (~25 kg) para ter 600W.',
    diff: '600W · 40 km/h · 40 km',
    promise: 'Alta performance dobrável — arranca mais forte que um 440W, cobre até 40 km e ainda cabe no elevador.',
    pros: [
      'Potência de 600W acima da média das dobráveis compactas',
      'Velocidade máxima de 40 km/h',
      'Autonomia de até 40 km com bateria 48V 12Ah',
      'Design moderno e quadro dobrável aro 14',
      'Freios a disco',
      'Carga típica de até 120 kg'
    ],
    cons: [
      'Peso significativamente maior (~25 kg) que a B20 ou a S6',
      'Preço elevado frente às dobráveis de 350–450W (a partir de R$ 2.999)',
      '40 km/h exige atenção à legislação local de micromobilidade',
      'Marca importada com rede de assistência limitada'
    ],
    specs: [
      ['Marca', 'Oimotoo'],
      ['Modelo', 'A9 · bicicleta elétrica dobrável'],
      ['Motor', '600W'],
      ['Bateria', '48V 12Ah lítio'],
      ['Autonomia', 'Até 40 km'],
      ['Velocidade máxima', '40 km/h'],
      ['Aro', '14 polegadas'],
      ['Freios', 'Disco'],
      ['Peso suportado', 'Até 120 kg'],
      ['Peso da bike', '~25 kg (confira o anúncio)'],
      ['Preço observado', 'A partir de R$ 2.999 (confira o dia)']
    ],
    analysis: `<h2 class="mb-4 text-2xl font-extrabold md:text-3xl">Análise detalhada: avaliação da <span class="text-brand-yellow">bicicleta elétrica Oimotoo A9</span></h2>
          <p class="mb-5 text-brand-muted">
            A Oimotoo A9 é a resposta para quem acha 440W pouco e 750W caro demais. Motor 600W, 40 km/h e 40 km de autonomia numa <strong>bicicleta elétrica dobrável</strong> aro 14 — o meio-termo de performance desta lista. O preço observado de R$ 2.999 coloca a A9 acima da <a href="review-oimotoo-s6.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Oimotoo S6</a> e da <a href="review-honeywhale-b20.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Honeywhale B20</a>, cobrando o extra em torque e velocidade.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Uso diário e autonomia real</h3>
          <p class="mb-5 text-brand-muted">
            Com 48V 12Ah, a A9 tem pack maior que a 350W (7.8Ah). Em uso urbano misto, 35 a 40 km é o teto; turbo em subidas reduz para a casa dos 30 km. A velocidade de 40 km/h muda o commute: você acompanha o fluxo de vias rápidas, mas precisa de freio e atenção — não é o mesmo contrato da B20 a 25 km/h.
            Mapeie o trajeto: se há avenida larga e pouca ladeira, a A9 brilha. Se o trecho é calçada e condomínio, 40 km/h sobra e o peso extra incomoda.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Design dobrável e peso</h3>
          <p class="mb-5 text-brand-muted">
            Continua dobrável e aro 14, mas ~25 kg pesam na hora de levantar no elevador. Remova a bateria se o pack for destacável no seu lote — confira o anúncio. Em porta-malas de hatch entra; em escada sem elevador, pense duas vezes.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Motor 600W em ladeiras</h3>
          <p class="mb-5 text-brand-muted">
            600W sobe o que 350–440W recusam. Rampas de 8–12% mantêm velocidade com pedal. Ainda não é a <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Honeywhale S6-S 750W</a> com fat tire, mas para asfalto razoável é o ponto doce de potência nesta faixa de preço.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Compra, entrega e manutenção</h3>
          <p class="text-brand-muted">
            Onde comprar bicicleta elétrica dobrável: Mercado Livre, com o link desta review. Confira se o lote inclui carregador bivolt e se a bateria é 48V 12Ah de fato. Como carregar a bicicleta elétrica: 5 a 7 horas típicas num pack 12Ah; não deixe zerada. Peças Oimotoo circulam no ML; assistência oficial é limitada.
          </p>`,
    faqs: [
      { q: 'Oimotoo A9 vale a pena?', a: 'Sim, se você quer a <strong>bicicleta elétrica dobrável</strong> mais potente desta lista compacta (600W, 40 km/h, 40 km) e aceita pagar cerca de R$ 2.999 e carregar ~25 kg.' },
      { q: 'Quanto custa bicicleta elétrica dobrável?', a: 'A Oimotoo A9 parte de <strong>R$ 2.999</strong>. Abaixo dela: B20 ~R$ 2.399, S6 ~R$ 2.446, 350W ~R$ 2.509. Acima: S6-S ~R$ 3.799.' },
      { q: 'Qual a melhor bicicleta elétrica dobrável?', a: 'Para performance compacta, a A9. Para equilíbrio e disco a 25 km/h, a Honeywhale B20. Para fat tire 750W, a S6-S. Para o menor ticket de 450W, a S6.' },
      { q: 'Como carregar a bicicleta elétrica?', a: 'Conecte o carregador bivolt na bateria 48V 12Ah. Tempo típico de 5 a 7 horas. Evite descarga total e umidade no conector.' },
      { q: 'Onde comprar bicicleta elétrica dobrável?', a: 'No Mercado Livre, pelo link de afiliado desta página. Confira seller, frete e garantia do dia.' },
      { q: 'Como funciona a bicicleta elétrica dobrável?', a: 'Motor 600W no cubo, bateria 48V e controlador. Acelerador ou pedal assistido enviam potência; o quadro dobra para transporte. Freios a disco fazem a parada da <strong>bike elétrica</strong>.' }
    ],
    alts: [altS6, altB20]
  },
  {
    file: 'review-bike-dobravel-350w.html',
    crumb: 'Dobrável 350W',
    brand: 'Genérica',
    short: 'Dobrável 350W',
    productName: 'Bicicleta Elétrica Dobrável 350W Bateria 48V 7.8Ah',
    title: 'Review Bicicleta Elétrica Dobrável 350W Vale a Pena? 48V 7.8Ah | Tudo de Melhor',
    description: 'Bicicleta elétrica dobrável 350W vale a pena? Review da bike 48V 7.8Ah aro 14: autonomia ~30 km, nota 8.6, brinde e preço no Mercado Livre.',
    schemaDesc: 'Bicicleta elétrica dobrável 350W com bateria 48V 7.8Ah, aro 14 e autonomia de até 30 km. Número 5 do ranking dobrável Tudo de Melhor.',
    h1: 'Bicicleta elétrica dobrável 350W vale a pena? Análise da 48V 7.8Ah',
    lead: 'Se o orçamento manda e o trajeto é curto, esta <strong>bicicleta elétrica dobrável</strong> 350W com bateria 48V 7.8Ah é a porta de entrada da lista: aro 14, autonomia de cerca de 30 km e anúncio a partir de R$ 2.509 no Mercado Livre — com brinde no lote rastreado.',
    badge: 'Entrada',
    note: '8.6',
    rank: 5,
    priceLabel: 'R$ 2.509',
    priceSchema: '2509.00',
    meli: 'https://meli.la/334S41E',
    heroCaption: 'Dobrável 350W · 48V 7.8Ah · aro 14',
    video: null,
    gallery: [
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_996242-MLB112164339248_062026-F-bicicleta-eletrica-dobravel-350w-bateria-48v-78ah--brinde.webp', alt: 'Bicicleta elétrica dobrável 350W bateria 48V 7.8Ah — bike elétrica urbana aro 14' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_836887-MLB112166181280_062026-F-bicicleta-eletrica-dobravel-350w-bateria-48v-78ah--brinde.webp', alt: 'Bicicleta elétrica dobrável 350W — foto 2 da galeria no Mercado Livre' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_791749-MLB112165145290_062026-F-bicicleta-eletrica-dobravel-350w-bateria-48v-78ah--brinde.webp', alt: 'Bike elétrica dobrável 350W 48V — foto 3 da galeria, quadro compacto' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_724141-MLB112166506058_062026-F-bicicleta-eletrica-dobravel-350w-bateria-48v-78ah--brinde.webp', alt: 'Bicicleta elétrica dobrável 350W com brinde — foto 4 da galeria' }
    ],
    depoimentos: [
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_787099-MLA117332041647_092026-F.webp', alt: 'Bicicleta elétrica dobrável 350W — foto real de comprador no Mercado Livre 1' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_751029-MLA115253775384_082026-F.webp', alt: 'Bike elétrica dobrável 350W 48V — foto de comprador 2' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_900779-MLA115253540972_082026-F.webp', alt: 'Bicicleta elétrica dobrável 350W — foto de comprador 3' },
      { url: 'https://http2.mlstatic.com/D_NQ_NP_2X_914494-MLA115482005006_082026-F.webp', alt: 'Bicicleta elétrica dobrável 350W bateria 7.8Ah — foto de comprador 4' }
    ],
    verdict: 'A dobrável 350W vale a pena quando o trajeto é curto e o preço é o critério #1. Não é a <strong>melhor bicicleta elétrica dobrável</strong> da lista em potência, mas é a mais acessível para bairro e última milha.',
    forWho: 'Trajetos curtos de bairro, estudante ou quem quer testar bike elétrica sem motor 600W+.',
    diff: '48V 7.8Ah · ticket de entrada',
    promise: 'Mobilidade urbana compacta — dobra, guarda em apartamento e cobre cerca de 30 km em ritmo calmo.',
    pros: [
      'Preço acessível na faixa de R$ 2.509 (confira o dia)',
      'Design compacto e prático, aro 14',
      'Facilidade de armazenamento em apartamento',
      'Bateria 48V 7.8Ah com recarga em tomada residencial',
      'Lote rastreado inclui brinde — confira o anúncio',
      'Freios a disco no anúncio'
    ],
    cons: [
      'Velocidade máxima baixa frente a 40 km/h da S6 e da A9',
      'Autonomia limitada (~30 km) pelo pack 7.8Ah',
      'Motor 350W sofre em qualquer ladeira relevante',
      'Peso declarado alto (~30 kg) para a potência oferecida'
    ],
    specs: [
      ['Marca', 'Confira o anúncio (lote 350W genérico / Oimotoo)'],
      ['Modelo', 'Bicicleta elétrica dobrável 350W'],
      ['Motor', '350W'],
      ['Bateria', '48V 7.8Ah lítio'],
      ['Autonomia', 'Até ~30–32 km (uso urbano leve)'],
      ['Aro', '14 polegadas'],
      ['Freios', 'Disco (confira o anúncio)'],
      ['Peso suportado', 'Até 120 kg'],
      ['Peso da bike', '~30 kg (confira o anúncio)'],
      ['Preço observado', 'A partir de R$ 2.509 (confira o dia)']
    ],
    analysis: `<h2 class="mb-4 text-2xl font-extrabold md:text-3xl">Análise detalhada: avaliação da <span class="text-brand-yellow">bicicleta elétrica dobrável 350W</span></h2>
          <p class="mb-5 text-brand-muted">
            Esta é a porta de entrada do ranking. Motor 350W e bateria 48V 7.8Ah não competem com 600W ou 750W — e não precisam, se o seu recorte é bairro, campus ou última milha até o metrô. A pergunta "vale a pena?" só fecha se você aceita autonomia curta e velocidade baixa em troca do ticket e do quadro dobrável.
            O anúncio rastreado traz brinde e fotos de compradores; a marca no título é genérica (alguns lotes aparecem como Oimotoo). Sempre leia o seller do dia.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Uso diário e autonomia real</h3>
          <p class="mb-5 text-brand-muted">
            7.8Ah é pack pequeno. Em ritmo calmo, 25 a 32 km; com peso e rampa, 20 km. Trajetos de 5 a 8 km ida funcionam. Acima de 12 km por trecho, a <a href="review-honeywhale-b20.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Honeywhale B20</a> (35 km) ou a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">Oimotoo S6</a> (35 km, 450W) fazem mais sentido.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Design dobrável</h3>
          <p class="mb-5 text-brand-muted">
            Compacta e fácil de guardar — o melhor argumento deste modelo. O porém é o peso (~30 kg): dobrar ajuda o volume, não o levantamento. Remova a bateria se for destacável antes de subir escada.
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Motor 350W</h3>
          <p class="mb-5 text-brand-muted">
            Em plano, leva. Em ladeira, você pedala de verdade. Não compre 350W sonhando com serra. Para subida, pule para 600W (A9) ou 750W (S6-S).
          </p>
          <h3 class="mb-2 text-lg font-bold text-brand-yellow">Compra, entrega e manutenção</h3>
          <p class="text-brand-muted">
            Onde comprar bicicleta elétrica dobrável: Mercado Livre, link desta review. Confira o brinde do lote, o Ah real da bateria e a reputação. Como carregar a bicicleta elétrica: pack 7.8Ah enche mais rápido (cerca de 4 a 6 horas). Como funciona a bicicleta elétrica dobrável: mesmo esquema de motor + bateria + quadro que dobra; aqui o motor é o mais manso da lista.
          </p>`,
    faqs: [
      { q: 'Bicicleta elétrica dobrável 350W vale a pena?', a: 'Sim, para trajetos curtos e orçamento apertado. Não é a <strong>melhor bicicleta elétrica dobrável</strong> em potência — é a mais acessível para bairro e última milha.' },
      { q: 'Quanto custa bicicleta elétrica dobrável?', a: 'Este modelo 350W parte de <strong>R$ 2.509</strong>. A B20 ~R$ 2.399, a S6 ~R$ 2.446, a A9 ~R$ 2.999 e a S6-S ~R$ 3.799. Confira o preço do dia no Mercado Livre.' },
      { q: 'Qual a melhor bicicleta elétrica dobrável?', a: 'Para entrada, esta 350W. Para equilíbrio, Honeywhale B20. Para velocidade, Oimotoo S6 ou A9. Para piso ruim, Honeywhale S6-S.' },
      { q: 'Como carregar a bicicleta elétrica?', a: 'Use o carregador incluso na bateria 48V 7.8Ah. Tempo típico: 4 a 6 horas. Evite deixar zerada por longos períodos.' },
      { q: 'Onde comprar bicicleta elétrica dobrável?', a: 'No Mercado Livre, com o link rastreado desta review. Confira brinde, seller e garantia.' },
      { q: 'Como funciona a bicicleta elétrica dobrável?', a: 'Motor 350W, bateria 48V e quadro que dobra. A assistência é leve: em plano anda bem; em ladeira você pedala. Freios a disco no anúncio — confirme o lote.' }
    ],
    alts: [altS6, altB20]
  }
];

for (const p of products) {
  writeFileSync(join(root, p.file), render(p), 'utf8');
  console.log('wrote', p.file);
}

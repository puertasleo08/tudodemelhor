#!/usr/bin/env python3
"""Refactor ranking HTML pages to match melhores-bicicletas-eletricas.html template."""

import re
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CONFIG = {
    "melhores-umidificadores-de-ar-2026.html": {
        "image": "assets/produtos/RANKING/UMIDIFICADOR-DE-AR/capa.jpeg",
        "image_alt": "Umidificadores de ar — capa da categoria no ranking Tudo de Melhor",
        "category_link": "https://meli.la/33sAS7H",
        "ranking_h2": "As 6 melhores umidificadores de ar",
    },
    "melhores-purificadores-de-agua-2026.html": {
        "image": "assets/produtos/RANKING/PURIFICADOR-DE-AGUA/capa.jpeg",
        "image_alt": "Purificadores de água — capa da categoria no ranking Tudo de Melhor",
        "category_link": "https://meli.la/1HErSZt",
        "ranking_h2": "As 6 melhores purificadores de água",
    },
    "melhores-marcas-de-ar-condicionado-2026.html": {
        "image": "assets/produtos/RANKING/AR-CONDICIONADO/capa.jpeg",
        "image_alt": "Ar-condicionado — capa da categoria no ranking Tudo de Melhor",
        "category_link": "https://meli.la/31n7tqs",
        "ranking_h2": "As 5 melhores marcas de ar-condicionado",
    },
    "melhores-ar-condicionado-portatil.html": {
        "image": "assets/produtos/RANKING/AR-CONDICIONADO-PORTATIL/capa.jpeg",
        "image_alt": "Ar-condicionado portátil — capa da categoria no ranking Tudo de Melhor",
        "category_link": "https://meli.la/2G7Vyn6",
        "ranking_h2": "Os 5 melhores ar-condicionados portáteis",
    },
    "qual-e-o-melhor-travesseiro-para-dormir.html": {
        "image": "assets/produtos/RANKING/TRAVESSEIRO/capa.jpeg",
        "image_alt": "Travesseiros — capa da categoria no ranking Tudo de Melhor",
        "category_link": "https://meli.la/2KN6Kze",
        "ranking_h2": "Os 6 melhores travesseiros para dormir",
    },
}

ARTICLE_RE = re.compile(
    r'<article class="glass[^"]*" id="produto-(\d+)">(.*?)</article>',
    re.DOTALL,
)


def strip_tags(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s).strip()


def first_sentences(text: str, max_chars: int = 380) -> str:
    text = re.sub(r"\s+", " ", html.unescape(strip_tags(text))).strip()
    if len(text) <= max_chars:
        return text
    cut = text[:max_chars]
    last_period = cut.rfind(". ")
    if last_period > 120:
        return cut[: last_period + 1]
    return cut.rstrip() + "…"


def score_to_100(score_str: str) -> int:
    val = float(score_str)
    if val <= 10:
        return int(round(val * 10))
    return int(round(val))


def parse_products(content: str) -> list[dict]:
    products = []
    for m in ARTICLE_RE.finditer(content):
        pos = int(m.group(1))
        block = m.group(2)

        score_m = re.search(r"bg-brand-gradient[^>]*>([\d.]+)</span>", block)
        score = score_to_100(score_m.group(1)) if score_m else 0

        brand = ""
        specs: list[str] = []
        meta_m = re.search(r'class="text-xs text-brand-dim">([^<]+)</span>', block)
        if meta_m:
            meta_parts = [p.strip() for p in meta_m.group(1).split("·")]
            brand = meta_parts[0]
            specs = meta_parts[1:]

        price_line_m = re.search(
            r'<p class="mb-3 text-sm text-brand-dim">([^<]+)</p>', block
        )
        price = ""
        if price_line_m:
            line = price_line_m.group(1)
            if not brand and "·" in line:
                brand = line.split("·", 1)[0].strip()
            price_m = re.search(r"(R\$ [\d.,]+(?: \([^)]+\))?)", line)
            price = price_m.group(1) if price_m else ""

        img_m = re.search(r'<img src="([^"]+)" alt="([^"]*)"', block)
        img_src = img_m.group(1) if img_m else ""
        img_alt = img_m.group(2) if img_m else ""

        h2_m = re.search(r"<h2[^>]*>([^<]+)</h2>", block)
        h2_raw = strip_tags(h2_m.group(1)) if h2_m else ""
        h2_clean = re.sub(r"^\d+\.\s*", "", h2_raw)
        if " — " in h2_clean:
            short_name = h2_clean.split(" — ", 1)[0].strip()
        else:
            short_name = h2_clean
        if brand and short_name.lower().startswith(brand.lower()):
            short_name = short_name[len(brand) :].strip()

        meli_m = re.search(r'href="(https://meli\.la/[^"]+)"', block)
        meli_link = meli_m.group(1) if meli_m else ""

        analise_m = re.search(
            r'<a href="([^"]+\.html)"[^>]*>[^<]*(?:análise|Análise)',
            block,
            re.IGNORECASE,
        )
        analise_link = analise_m.group(1) if analise_m else f"#analise-{pos}"

        summary_m = re.search(
            r'<p class="mb-4 text-brand-muted">\s*(.*?)\s*</p>', block, re.DOTALL
        )
        summary = first_sentences(summary_m.group(1)) if summary_m else ""

        if len(specs) < 2:
            pros = re.findall(
                r'<ul class="[^"]*text-sm[^"]*text-brand-muted[^"]*">\s*(.*?)</ul>',
                block,
                re.DOTALL,
            )
            if pros:
                items = re.findall(r"<li>([^<]+)</li>", pros[0])
                specs = [i.strip() for i in items[:4]]

        products.append(
            {
                "pos": pos,
                "score": score,
                "brand": brand.upper(),
                "short_name": short_name,
                "summary": summary,
                "specs": specs[:4],
                "price": price,
                "meli_link": meli_link,
                "analise_link": analise_link,
                "img_src": img_src,
                "img_alt": img_alt,
                "sr_label": f"Análise {short_name}",
            }
        )
    return products


def refactor_header(content: str, cfg: dict) -> str:
    header_m = re.search(
        r'(<header class="glass mb-8 p-6 md:p-10">)(.*?)(</header>)',
        content,
        re.DOTALL,
    )
    if not header_m:
        raise ValueError("Header not found")

    inner = header_m.group(2)
    eyebrow_m = re.search(
        r'<p class="mb-3 text-xs font-extrabold[^"]*">([^<]+)</p>', inner
    )
    h1_m = re.search(r"<h1[^>]*>([^<]+)</h1>", inner)
    eyebrow = eyebrow_m.group(1) if eyebrow_m else ""
    h1 = h1_m.group(1) if h1_m else ""

    paras = re.findall(
        r'<p class="mb-4 (?:max-w-3xl )?(?:text-brand-muted|text-sm text-brand-dim)">\s*(.*?)\s*</p>',
        inner,
        re.DOTALL,
    )
    badges_m = re.search(
        r'(<div class="flex flex-wrap gap-2">.*?</div>)', inner, re.DOTALL
    )
    badges = badges_m.group(1) if badges_m else ""

    p1 = paras[0] if len(paras) > 0 else ""
    p2 = paras[1] if len(paras) > 1 else ""

    new_header = (
        f"{header_m.group(1)}\n"
        f'        <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">{eyebrow}</p>\n'
        f'        <h1 class="mb-8 text-3xl font-extrabold leading-tight md:text-5xl">{h1}</h1>\n'
        f'        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">\n'
        f"          <div>\n"
        f'            <p class="mb-4 text-brand-muted">\n'
        f"              {p1.strip()}\n"
        f"            </p>\n"
        f'            <p class="mb-4 text-sm text-brand-dim">\n'
        f"              {p2.strip()}\n"
        f"            </p>\n"
        f"            {badges}\n"
        f"          </div>\n"
        f'          <div class="glass rounded-2xl border border-white/10 p-5 md:p-6">\n'
        f'            <img src="{cfg["image"]}" alt="{cfg["image_alt"]}" class="w-full h-auto object-cover rounded-xl" width="640" height="480" loading="eager">\n'
        f'            <a class="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-yellow px-6 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" href="{cfg["category_link"]}">Ver categoria completa no Mercado Livre</a>\n'
        f"          </div>\n"
        f"        </div>\n"
        f"      {header_m.group(3)}"
    )

    return content[: header_m.start()] + new_header + content[header_m.end() :]


def build_card(p: dict) -> str:
    spec_html = "\n".join(
        f'              <span class="rounded-md bg-brand-elevated/90 px-2.5 py-1 text-[11px] text-brand-muted">{html.escape(s)}</span>'
        for s in p["specs"]
    )
    loading = ' loading="lazy"' if p["pos"] > 1 else ""
    analise_href = html.escape(p["analise_link"])
    return f"""
          <article class="glass relative flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-glow" id="produto-{p["pos"]}">
            <span id="analise-{p["pos"]}" class="sr-only">{html.escape(p["sr_label"])}</span>
            <span class="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-black shadow-glow" aria-label="Posição {p["pos"]}">{p["pos"]}</span>
            <div class="mx-auto mt-8 flex h-44 w-full items-center justify-center">
              <img src="{html.escape(p["img_src"])}" alt="{html.escape(p["img_alt"])}" class="max-h-44 w-full object-contain" width="400" height="400"{loading}>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="rounded border border-brand-yellow/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-yellow">{html.escape(p["brand"])}</span>
              <h2 class="text-lg font-bold text-white">{html.escape(p["short_name"])}</h2>
            </div>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">{html.escape(p["summary"])}</p>
            <div class="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Nota Tudo de Melhor</span>
              <div class="leading-none"><span class="text-3xl font-bold text-brand-yellow">{p["score"]}</span><span class="text-sm text-brand-dim">/100</span></div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
{spec_html}
            </div>
            <div class="mt-5 border-t border-white/10 pt-4">
              <p class="text-[10px] font-bold uppercase tracking-wider text-brand-dim">Melhor preço</p>
              <p class="text-xl font-bold text-white">{html.escape(p["price"])}</p>
              <div class="mt-3 flex flex-col gap-2">
                <a class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-yellow px-4 text-sm font-bold text-black shadow-glow transition hover:brightness-110" rel="sponsored noopener" target="_blank" href="{html.escape(p["meli_link"])}">Comprar no Mercado Livre</a>
                <a class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-yellow bg-transparent px-4 text-sm font-bold text-brand-yellow transition hover:bg-brand-yellow/10" href="{analise_href}">Ver Análise Completa</a>
              </div>
            </div>
          </article>"""


def build_ranking_section(products: list[dict], cfg: dict) -> str:
    cards = "".join(build_card(p) for p in products)
    aria = cfg.get("ranking_h2", "Ranking de produtos")
    return f"""
    <section id="ranking-topo" class="py-10" aria-label="{html.escape(aria)}">
      <div class="w-full">
        <p class="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Ranking 2026</p>
        <h2 class="mb-8 text-center text-2xl font-extrabold text-white md:text-3xl">{cfg["ranking_h2"]}</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
{cards}
        </div>
      </div>
    </section>
"""


def remove_old_articles(content: str) -> str:
    content = re.sub(
        r'\s*<div class="mx-auto max-w-6xl space-y-6 px-4 pb-12">\s*'
        r'(?:<article class="glass[^"]*" id="produto-\d+">.*?</article>\s*)+'
        r"</div>\s*",
        "\n",
        content,
        count=1,
        flags=re.DOTALL,
    )
    # Standalone horizontal articles (e.g. ar-condicionado-portatil)
    content = re.sub(
        r'\n\s*<article class="glass mb-\d+ p-5 md:p-6" id="produto-\d+">.*?</article>',
        "",
        content,
        flags=re.DOTALL,
    )
    return content


def process_file(filename: str) -> None:
    path = ROOT / filename
    cfg = CONFIG[filename]
    content = path.read_text(encoding="utf-8")

    products = parse_products(content)
    if not products:
        raise ValueError(f"No products found in {filename}")

    content = refactor_header(content, cfg)

    content = re.sub(
        r'<aside class="mb-10" id="ranking-topo"[^>]*>.*?</aside>\s*',
        "",
        content,
        count=1,
        flags=re.DOTALL,
    )

    content = remove_old_articles(content)

    ranking_section = build_ranking_section(products, cfg)

    mobile_nav_end = re.search(
        r'(<nav class="mb-8 lg:hidden"[^>]*>.*?</nav>)',
        content,
        re.DOTALL,
    )
    if not mobile_nav_end:
        raise ValueError(f"Mobile nav not found in {filename}")

    insert_at = mobile_nav_end.end()
    content = content[:insert_at] + ranking_section + content[insert_at:]

    path.write_text(content, encoding="utf-8")
    print(f"OK {filename}: {len(products)} products")


def main() -> None:
    for filename in CONFIG:
        process_file(filename)


if __name__ == "__main__":
    main()

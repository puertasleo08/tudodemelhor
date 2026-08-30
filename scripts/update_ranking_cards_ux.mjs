import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const RANKING_FILES = [
  "melhores-bicicletas-eletricas.html",
  "melhores-umidificadores-de-ar-2026.html",
  "melhores-purificadores-de-agua-2026.html",
  "melhores-marcas-de-ar-condicionado-2026.html",
  "melhores-ar-condicionado-portatil.html",
  "qual-e-o-melhor-travesseiro-para-dormir.html",
];

const OLD_GRID =
  "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const NEW_GRID =
  "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3";

const CHECK_SVG = `<svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`;

function paraQuemE(bullets) {
  const items = bullets
    .map(
      (t) =>
        `              <li class="flex gap-2 text-sm text-brand-muted">${CHECK_SVG}<span>${t}</span></li>`
    )
    .join("\n");
  return `            <div class="mt-3 flex-1">
              <div class="flex items-center gap-2 mb-3"><span class="text-blue-500">👤</span> <strong class="text-sm uppercase tracking-wide text-white">Para quem é?</strong></div>
              <ul class="space-y-2">
${items}
              </ul>
            </div>`;
}

/** bullets per file, in product order (produto-1, produto-2, ...) */
const BULLETS = {
  "melhores-bicicletas-eletricas.html": [
    [
      "Commute urbano dobrável: cabe no elevador e porta-malas com bateria 48V removível.",
      "Melhor custo-benefício dobrável da lista para orçamento até R$ 2.500.",
      "Trajetos planos de até 35 km sem exigir potência extrema em subidas.",
    ],
    [
      "Deslocamento diário de 15–25 km com folga em rampas moderadas.",
      "Quem prefere visual de bike clássica aro 26 em vez de scooter.",
      "Equilíbrio entre motor 750W e preço intermediário.",
    ],
    [
      "Calçadas irregulares e vias com buracos: fat tire + motor 750W.",
      "Uso urbano com carga até 125 kg e cesto para compras.",
      "Quem quer robustez dobrável com autonomia de 40 km.",
    ],
    [
      "Primeira bike elétrica: entrada honesta com 48V 10Ah e suspensão.",
      "Apartamento pequeno: formato compacto e dobrável para guardar.",
      "Trajetos planos de até 20 km sem subidas íngremes.",
    ],
    [
      "Substituir carro ou moto em trajetos longos com subidas.",
      "Exige frenagem confiável: freio hidráulico dianteiro e traseiro.",
      "Prioriza potência (1000W) e autonomia de 48 km.",
    ],
    [
      "Ciclovias e vias planas com visual discreto de bicicleta convencional.",
      "Pedal assistido para quem não quer parecer scooter elétrico.",
      "Conforto urbano com suspensão dupla aro 26.",
    ],
    [
      "Entregas leves e commute multimodal em corredores apertados.",
      "Bateria de lítio 48V removível para carregar no destino.",
      "Aro 20 ágil com motor 750W para manobras urbanas.",
    ],
  ],
  "melhores-umidificadores-de-ar-2026.html": [
    [
      "Salas e ambientes amplos com ar seco prolongado.",
      "Quem quer o maior reservatório (6 L) e menos reabastecimento.",
      "Uso contínuo com funções smart e névoa ultrassônica estável.",
    ],
    [
      "Quarto médio com equilíbrio entre marca Black+Decker e preço.",
      "Orçamento agressivo com tanque de 2,5 L bivolt.",
      "Primeiro umidificador sem investir em modelo grande.",
    ],
    [
      "Quartos e salas médias que pedem 5 L sem pagar o Midea 6 L.",
      "Uso noturno: autonomia que reduz idas ao tanque de madrugada.",
      "Quem valoriza névoa constante e operação silenciosa.",
    ],
    [
      "Quarto com aromaterapia: aceita óleo essencial e tem LED integrado.",
      "4 litros de autonomia com marca WAP consolidada no varejo.",
      "Uso noturno com névoa regulável e luminária ambiente.",
    ],
    [
      "Testar umidificador sem gastar muito: entrada abaixo de R$ 110.",
      "Quarto pequeno ou infantil com design compacto branco.",
      "Quem busca operação ultrassônica simples e direta.",
    ],
    [
      "Mesa de home office ou cabeceira: mini 500 ml portátil.",
      "Complemento de viagem ou escritório — não substitui tanque grande.",
      "Orçamento mínimo com névoa imediata e controle remoto.",
    ],
  ],
  "melhores-purificadores-de-agua-2026.html": [
    [
      "Quem prioriza água gelada estável com compressor IBBL.",
      "Famílias que consomem muito volume de água fria no dia a dia.",
      "Investimento premium em refrigeração robusta e marca consolidada.",
    ],
    [
      "Melhor custo-benefício para água gelada e natural sem compressor.",
      "Quem quer marca Electrolux com refrigeração eletrônica.",
      "Uso residencial com saída prática e consumo moderado.",
    ],
    [
      "Design moderno Electrolux com gelada fria e natural.",
      "Quem quer subir de faixa em acabamento e fluxo estável.",
      "Cozinha que valoriza tratamento de água da linha premium da marca.",
    ],
    [
      "Apartamento com orçamento acessível e tensão bivolt.",
      "Entrada forte em água refrigerada com marca Consul conhecida.",
      "Quem quer água natural ou gelada sem pagar compressor.",
    ],
    [
      "Parede sem refrigeração: só filtragem com selo Inmetro.",
      "Orçamento econômico para água mais pura na torneira.",
      "Quem não precisa de água gelada, só tratamento diário.",
    ],
    [
      "Menor custo para água natural filtrada no ponto de uso.",
      "Apartamento compacto que precisa só de água limpa, não gelada.",
      "Primeiro purificador barato antes de investir em refrigeração.",
    ],
  ],
  "melhores-marcas-de-ar-condicionado-2026.html": [
    [
      "Sala ou quarto médio: melhor 12.000 BTUs inverter desta lista.",
      "Quem valoriza Midea com rede de assistência e consumo estável.",
      "Instalação split frio 220V com equilíbrio preço e durabilidade.",
    ],
    [
      "Apartamento pequeno: melhor 9.000 BTUs com gás R-32.",
      "Orçamento apertado com desconto forte no Mercado Livre.",
      "Quem quer inverter silencioso sem pagar ticket premium.",
    ],
    [
      "Linha AI mais recente que EcoMaster com operação silenciosa.",
      "Quem prioriza eficiência no ciclo frio e design atual.",
      "Sala média com instalação feita por técnico credenciado.",
    ],
    [
      "Ambientes maiores ou necessidade de quente e frio no inverno.",
      "18.000 BTU com Wi-Fi para controle pelo celular.",
      "Quem aceita ticket maior por ciclo reverso e mais potência.",
    ],
    [
      "Quarto econômico: inverter 9.000 BTUs sem premium da TCL.",
      "Orçamento de entrada com ruído contido e baixo consumo.",
      "Primeiro split inverter quando assistência local importa menos.",
    ],
  ],
  "melhores-ar-condicionado-portatil.html": [
    [
      "Quarto ou escritório pequeno: 10.000 BTUs sem obra.",
      "Melhor custo-benefício portátil com marca Philco e rodízios.",
      "Aluguel ou imóvel onde split de parede não é opção.",
    ],
    [
      "Sala média com 12.000 BTUs e controle pelo app Wi-Fi.",
      "Melhor ticket para capacidade 12k com conectividade.",
      "Quem aceita ruído de portátil em troca de mobilidade.",
    ],
    [
      "12.000 BTUs frio 220V com marca Electrolux reconhecida.",
      "Umidade alta: ventilação e desumidificação no mesmo aparelho.",
      "Quem paga mais pela marca e assistência local.",
    ],
    [
      "Cômodos maiores: único inverter portátil com 14.000 BTUs.",
      "Ticket premium para máximo resfriamento sem obra.",
      "Rede 127V confirmada e tubo de exaustão instalado.",
    ],
    [
      "12.000 BTUs com preço intermediário frente ao Electrolux.",
      "Economia sem abrir mão da capacidade de sala média.",
      "Mesmas regras de portátil: tubo, dreno e ruído esperados.",
    ],
  ],
  "qual-e-o-melhor-travesseiro-para-dormir.html": [
    [
      "Dormir de lado: altura de 17 cm preenche ombro e cabeça.",
      "Melhor travesseiro NASA em viscoelástica com suporte alto.",
      "Quem busca alívio de pressão com molde ao pescoço.",
    ],
    [
      "Dor cervical: formato ortopédico com suporte firme na curva.",
      "Quem precisa de travesseiro cervical após orientação médica.",
      "Adaptação a altura média-alta — não é para quem gosta de baixo e macio.",
    ],
    [
      "Quem rejeita travesseiros que afundam: enchimento extra firme 50x70.",
      "Sustentação sem pagar ticket de viscoelástica NASA.",
      "Antialérgico com firmeza real, não só maciez.",
    ],
    [
      "Sensação de hotel: pluma sintética macia e aconchegante.",
      "Quem prioriza conforto aconchegante, não suporte ortopédico.",
      "Dormir de barriga para cima ou de lado leve.",
    ],
    [
      "Kit família: 4 peças impermeáveis e antialérgicas 50x70.",
      "Hóspedes, casal com filhos ou troca completa de uma vez.",
      "Praticidade com capa contra líquidos a preço por unidade.",
    ],
    [
      "Travesseiro bom e barato: regulável, lavável e de fibra.",
      "Quem ainda descobre a altura ideal sem gastar em premium.",
      "Primeira compra antes de investir em látex ou NASA caro.",
    ],
  ],
};

function replaceCardSummaries(content, filename) {
  const bullets = BULLETS[filename];
  if (!bullets) return content;

  let i = 0;
  return content.replace(
    /<p class="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">[\s\S]*?<\/p>/g,
    () => {
      if (i >= bullets.length) return "";
      return paraQuemE(bullets[i++]);
    }
  );
}

const BICICLETAS_FOOTER = `<a href="melhores-bicicletas-eletricas.html" class="hover:text-brand-yellow">Bicicletas Elétricas</a>`;

const BICICLETAS_HEADER_DESKTOP = `<a href="melhores-bicicletas-eletricas.html" class="transition hover:text-white">Bicicletas Elétricas</a>`;
const BICICLETAS_HEADER_MOBILE = `<a href="melhores-bicicletas-eletricas.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Bicicletas Elétricas</a>`;

function addBicicletasMenu(content) {
  if (!content.includes("melhores-bicicletas-eletricas.html")) {
    // Footer: after Ar-condicionado variants or before closing categorias div
    if (content.includes('href="melhores-marcas-de-ar-condicionado-2026.html"')) {
      content = content.replace(
        /(<a href="melhores-marcas-de-ar-condicionado-2026\.html"[^>]*>Ar-condicionado[^<]*<\/a>)/,
        `$1\n          ${BICICLETAS_FOOTER}`
      );
    } else if (content.includes('href="melhores-ar-condicionado-portatil.html"')) {
      content = content.replace(
        /(<a href="melhores-ar-condicionado-portatil\.html"[^>]*>[^<]*<\/a>)/,
        `$1\n          ${BICICLETAS_FOOTER}`
      );
    } else if (content.includes("<h4 class=\"mb-3 text-sm font-bold\">Categorias</h4>")) {
      content = content.replace(
        /(<h4 class="mb-3 text-sm font-bold">Categorias<\/h4>\s*<div class="flex flex-col gap-2 text-sm text-brand-dim">)/,
        `$1\n          ${BICICLETAS_FOOTER}`
      );
    }

    // Header desktop: after Rankings link
    content = content.replace(
      /(<a href="categorias\.html" class="transition hover:text-white">Rankings<\/a>)/,
      `$1\n        ${BICICLETAS_HEADER_DESKTOP}`
    );

    // Header mobile: after Rankings link
    content = content.replace(
      /(<a href="categorias\.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white\/5 hover:text-white">Rankings<\/a>)/,
      `$1\n        ${BICICLETAS_HEADER_MOBILE}`
    );
  }
  return content;
}

function processRankingFile(filename) {
  const filePath = path.join(ROOT, filename);
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replaceAll(OLD_GRID, NEW_GRID);
  content = replaceCardSummaries(content, filename);
  content = addBicicletasMenu(content);
  fs.writeFileSync(filePath, content);
  console.log(`OK ranking: ${filename}`);
}

for (const f of RANKING_FILES) {
  processRankingFile(f);
}

// Global footer/header update for all other HTML files
const allHtml = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html") && !RANKING_FILES.includes(f));

let menuUpdated = 0;
for (const f of allHtml) {
  const filePath = path.join(ROOT, f);
  let content = fs.readFileSync(filePath, "utf8");
  if (
    content.includes("melhores-bicicletas-eletricas.html") ||
    !content.includes("<h4 class=\"mb-3 text-sm font-bold\">Categorias</h4>")
  ) {
    continue;
  }
  const updated = addBicicletasMenu(content);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    menuUpdated++;
  }
}
console.log(`OK menu: ${menuUpdated} other HTML files`);

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const CHECK = '<svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
const CROSS = '<svg class="mt-0.5 h-4 w-4 shrink-0 text-orange-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';

// Import renderPage from lote1 by eval - simpler: duplicate minimal render
const products = [
  {
    slug: 'review-bike-dobravel-400w',
    rank: 4, brand: 'Dobrável', model: '400W 48V 10Ah',
    shortName: 'Bike Dobrável · 400W 48V 10Ah',
    h1: 'Review Completo: Bicicleta Elétrica Dobrável 400W 48V 10Ah com Suspensão',
    title: 'Review Bike Elétrica Dobrável 400W 48V 10Ah | Tudo de Melhor',
    description: 'Review da bike elétrica dobrável 400W 48V 10Ah: entrada honesta com suspensão, nota 9.1 e preço R$ 3.609. Vale como primeira bike elétrica?',
    score: '9.1', price: '3609.00', priceDisplay: 'R$ 3.609',
    mlLink: 'https://meli.la/16hjFVz',
    image: 'https://http2.mlstatic.com/D_NQ_NP_708869-MLB97636357574_112025-O.webp',
    intro1: 'Esta <strong>bike elétrica dobrável 400W</strong> com <strong>48V 10Ah</strong> e <strong>suspensão</strong> é a porta de entrada honesta do ranking — nota <strong>9.1</strong> por <strong>R$ 3.609</strong>.',
    intro2: 'Ideal para quem quer testar o mundo das bikes elétricas sem investir em 750W ou 1000W, com formato compacto para apartamento pequeno.',
    verdict1: 'Boa primeira bike elétrica para trajetos planos de até 20 km, com suspensão que ajuda em buracos leves.',
    verdict2: 'Não compete em potência com 750W — mas entrega o básico bem feito para bairro e commute curto.',
    pros: ['Entrada honesta com 48V 10Ah e suspensão', 'Formato dobrável para apartamento pequeno', 'Suspensão dianteira absorve impactos leves', 'Preço intermediário sem exigir 750W', 'Adequada para trajetos planos até 20 km'],
    cons: ['Motor 400W limitado em subidas', 'Autonomia menor que modelos de 35–40 km', 'Marca genérica sem rede ampla de assistência', 'Preço próximo da Oimotoo S6 (450W, mais barata)'],
    sections: [
      { h2: 'A bike 400W é boa para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Sim, para <strong>primeira bike elétrica</strong> e trajetos curtos em terreno plano. O motor 400W cobre commute de bairro sem exigir potência extrema.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Perfil ideal</h3><p class="mb-4 text-brand-muted">Apartamento pequeno, mercado, academia — deslocamentos de até 20 km ida.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Quando subir de categoria</h3><p class="text-brand-muted">Subidas diárias? Veja <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> (450W, mais barata) ou <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline">Honeywhale S6-S</a> (750W).</p>' },
      { h2: 'Bateria <span class="text-brand-yellow">48V 10Ah</span> e Autonomia', body: '<p class="mb-4 text-brand-muted">O pack <strong>48V 10Ah</strong> entrega autonomia prática de <strong>18–25 km</strong> conforme modo e terreno.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Capacidade</h3><p class="mb-4 text-brand-muted">10Ah é suficiente para commute curto; não espere 35–40 km de modelos superiores.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Carga</h3><p class="text-brand-muted">5–6 horas para carga completa com carregador bivolt.</p>' },
      { h2: 'Suspensão e <span class="text-brand-yellow">Conforto Urbano</span>', body: '<p class="mb-4 text-brand-muted">A <strong>suspensão dianteira</strong> diferencia este modelo de dobráveis básicas sem amortecimento.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Piso irregular</h3><p class="mb-4 text-brand-muted">Ajuda em buracos e valetas leves — não substitui fat tire, mas melhora o conforto.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Portabilidade</h3><p class="text-brand-muted">Dobra para guardar em corredor ou closet — formato compacto para apartamento.</p>' },
      { h2: 'Motor 400W: <span class="text-brand-yellow">Limites Reais</span>', body: '<p class="mb-4 text-brand-muted">Sejamos diretos: 400W é motor de entrada. Funciona em plano e aclives muito leves.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Subidas</h3><p class="mb-4 text-brand-muted">Ladeiras moderadas exigem pedal forte; íngremes podem ser inviáveis só no motor.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Comparativo de preço</h3><p class="text-brand-muted">Curiosamente, a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> custa menos e tem 450W + bateria removível — compare antes de comprar.</p>' }
    ],
    specs: [['Motor','400W brushless'],['Bateria','48V 10Ah lítio'],['Autonomia','18–25 km'],['Suspensão','Dianteira'],['Freios','Disco D/T'],['Velocidade máx.','~25 km/h'],['Peso suportado','Até 120 kg'],['Formato','Dobrável compacto'],['Diferencial','Entrada com suspensão']],
    faq: [['Vale como primeira bike elétrica?','Sim, para trajetos planos curtos. Confira se não vale mais a Oimotoo S6 pelo preço.'],['Qual a autonomia real?','18–25 km em uso urbano misto.'],['Tem suspensão?','Sim, dianteira — ajuda em buracos leves.']]
  },
  {
    slug: 'review-v9-max',
    rank: 5, brand: 'V9 Max', model: '1000W Street Go',
    shortName: 'V9 Max · 1000W Street Go',
    h1: 'Review Completo: Bicicleta Elétrica V9 Max 1000W Street Go',
    title: 'Review V9 Max 1000W: Bike Elétrica Potente com Freio Hidráulico | Tudo de Melhor',
    description: 'Review da V9 Max 1000W: bike elétrica street go com freio hidráulico, autonomia 48 km e nota 8.9. A mais potente do ranking vale R$ 7.890?',
    score: '8.9', price: '7890.00', priceDisplay: 'R$ 7.890',
    mlLink: 'https://meli.la/2VBFMUG',
    image: 'https://http2.mlstatic.com/D_NQ_NP_872353-MLB115691776769_082026-O.webp',
    intro1: 'A <strong>V9 Max 1000W</strong> é a <strong>bike elétrica mais potente</strong> do ranking: motor de <strong>1000W</strong>, <strong>freio hidráulico</strong> dianteiro e traseiro, autonomia de <strong>48 km</strong> — por <strong>R$ 7.890</strong>.',
    intro2: 'Para quem quer substituir carro ou moto em trajetos longos com subidas, a V9 Max prioriza torque e frenagem confiável acima de portabilidade.',
    verdict1: 'A V9 Max é para quem precisa de potência real — subidas, distância e velocidade — e aceita investir no topo da faixa.',
    verdict2: 'Não dobra, pesa e custa quase 3× a Oimotoo S6. Mas entrega performance que nenhuma dobrável de 450W alcança.',
    pros: ['Motor 1000W — maior torque do ranking', 'Freio hidráulico D/T para frenagem segura', 'Autonomia de até 48 km', 'Ideal para trajetos longos com subidas', 'Street Go robusto para uso intenso'],
    cons: ['Preço alto: R$ 7.890', 'Não dobra — exige garagem ou espaço amplo', 'Peso elevado — difícil de carregar', '1000W pode exigir atenção à legislação local', 'Overkill para commute curto e plano'],
    sections: [
      { h2: 'A V9 Max 1000W é boa para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Sim, se seu "dia a dia" inclui <strong>15–30 km com subidas</strong> e você quer substituir carro ou moto. Para 5 km planos, é exagero.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Trajeto longo</h3><p class="mb-4 text-brand-muted">48 km de autonomia cobre commute estendido sem recarga no meio do dia.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Quem não precisa</h3><p class="text-brand-muted">Commute curto e plano? A <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> resolve por 1/3 do preço.</p>' },
      { h2: 'Motor 1000W e <span class="text-brand-yellow">Autonomia 48 km</span>', body: '<p class="mb-4 text-brand-muted">O <strong>1000W</strong> entrega torque para aclives íngremes e aceleração rápida em sinal aberto.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Bateria</h3><p class="mb-4 text-brand-muted">Pack 48V de alta capacidade sustenta os 48 km em uso moderado — turbo constante reduz a autonomia.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Legislação</h3><p class="text-brand-muted">Verifique normas locais: potências acima de 750W podem ter restrições em vias públicas.</p>' },
      { h2: 'Freio Hidráulico e <span class="text-brand-yellow">Segurança</span>', body: '<p class="mb-4 text-brand-muted">Com 1000W, frenagem é crítica. A V9 Max traz <strong>freio hidráulico dianteiro e traseiro</strong> — diferencial raro nesta faixa.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Descidas</h3><p class="mb-4 text-brand-muted">Hidráulico oferece modulação e potência de parada superiores ao disco mecânico.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Manutenção</h3><p class="text-brand-muted">Requer sangria periódica — custo de manutenção maior que freio a cabo.</p>' },
      { h2: 'Street Go: <span class="text-brand-yellow">Potência em Subidas</span>', body: '<p class="mb-4 text-brand-muted">A V9 Max sobe ladeiras de 12–15% mantendo velocidade — onde 450W e até 750W desaceleram.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Uso intenso</h3><p class="mb-4 text-brand-muted">Entregadores, trajetos com carga pesada e terrenos variados são o habitat natural.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Custo-benefício</h3><p class="text-brand-muted">Nota 8.9 reflete o preço alto. Performance é top; o ticket não é para todos.</p>' }
    ],
    specs: [['Motor','1000W brushless'],['Bateria','48V alta capacidade'],['Autonomia','Até 48 km'],['Freios','Hidráulico D/T'],['Velocidade máx.','~45 km/h'],['Peso suportado','Até 130 kg'],['Formato','Street Go (não dobrável)'],['Diferencial','Mais potente do ranking']],
    faq: [['A V9 Max vale R$ 7.890?','Se você precisa de 1000W, freio hidráulico e 48 km — sim. Para cidade plana, não.'],['A V9 Max dobra?','Não. Precisa de espaço de guarda.'],['V9 Max ou Honeywhale S6-S?','Honeywhale: dobrável 750W por R$ 3.799. V9 Max: 1000W e 48 km para uso intenso.']]
  },
  {
    slug: 'review-tomate-350w',
    rank: 6, brand: 'Tomate', model: '350W Aro 26',
    shortName: 'Tomate · 350W aro 26',
    h1: 'Review Completo: Bicicleta Elétrica Tomate 350W Aro 26 Pedal Assistido',
    title: 'Review Tomate 350W: Bike Elétrica Urbana Aro 26 | Tudo de Melhor',
    description: 'Review da Tomate 350W aro 26: bike elétrica urbana com pedal assistido, suspensão dupla e nota 8.8. Discreta para ciclovias?',
    score: '8.8', price: '4488.00', priceDisplay: 'R$ 4.488',
    mlLink: 'https://meli.la/17mcYdW',
    image: 'https://http2.mlstatic.com/D_NQ_NP_833188-MLB114054554339_072026-O.webp',
    intro1: 'A <strong>Tomate 350W aro 26</strong> é a <strong>bike elétrica urbana</strong> mais discreta do ranking: visual de bicicleta convencional, <strong>pedal assistido</strong> e <strong>suspensão dupla</strong> por <strong>R$ 4.488</strong>.',
    intro2: 'Para ciclovias e vias planas, quem não quer parecer scooter elétrico e valoriza postura clássica de bike.',
    verdict1: 'A Tomate entrega a experiência mais "bike de verdade" do ranking — pedal assistido discreto e conforto de aro 26.',
    verdict2: '350W limita em subidas e autonomia. É bike de ciclovia, não de morro.',
    pros: ['Visual discreto de bicicleta convencional', 'Pedal assistido — não parece scooter', 'Suspensão dupla aro 26 para conforto', 'Adequada a ciclovias e vias planas', 'Postura clássica familiar'],
    cons: ['Motor 350W — menor potência do ranking', 'Bateria fixa no quadro (não removível)', 'Preço R$ 4.488 sem vantagem de 750W', 'Fraca em subidas e trajetos longos', 'Autonomia limitada vs. concorrentes'],
    sections: [
      { h2: 'A Tomate 350W é boa para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Excelente para <strong>ciclovias e vias planas</strong> onde o pedal assistido de 350W complementa seu esforço sem parecer veículo motorizado.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Perfil discreto</h3><p class="mb-4 text-brand-muted">Ideal para quem quer mobilidade elétrica sem chamar atenção — parece bike normal.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Limitação</h3><p class="text-brand-muted">Morros e trajetos de 20+ km pedem <a href="review-xroymexroy-ucitys.html" class="text-brand-yellow underline">UCITYS 750W</a>.</p>' },
      { h2: 'Pedal Assistido <span class="text-brand-yellow">350W</span>', body: '<p class="mb-4 text-brand-muted">O <strong>pedal assistido 350W</strong> é o mais próximo da legislação de bike convencional — até 25 km/h em ciclovias.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Experiência</h3><p class="mb-4 text-brand-muted">Você pedala; o motor ajuda. Diferente de scooter com acelerador dominante.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Potência</h3><p class="text-brand-muted">350W é suficiente em plano; sofre em qualquer aclive moderado.</p>' },
      { h2: 'Suspensão Dupla e <span class="text-brand-yellow">Conforto Aro 26</span>', body: '<p class="mb-4 text-brand-muted"><strong>Suspensão dupla</strong> no aro 26 absorve irregularidades com mais conforto que scooters rígidas.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Estabilidade</h3><p class="mb-4 text-brand-muted">Rodas 26" oferecem rolamento suave em asfalto e ciclovia.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Bateria fixa</h3><p class="text-brand-muted">Carrega no local de guarda — precisa de tomada na garagem ou área de bike.</p>' },
      { h2: 'Tomate vs. <span class="text-brand-yellow">Concorrentes do Ranking</span>', body: '<p class="mb-4 text-brand-muted">Por R$ 4.488, a <a href="review-xroymexroy-ucitys.html" class="text-brand-yellow underline">UCITYS 750W</a> custa menos e entrega o dobro de potência com bateria removível.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Quando escolher Tomate</h3><p class="mb-4 text-brand-muted">Quando discreção visual e pedal assistido pesam mais que watts.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Quando não</h3><p class="text-brand-muted">Subidas, distância ou carga — qualquer outro modelo do ranking supera em performance.</p>' }
    ],
    specs: [['Motor','350W pedal assistido'],['Bateria','Fixa no quadro'],['Aro','26"'],['Suspensão','Dupla D/T'],['Freios','V-Brake ou disco'],['Velocidade máx.','~25 km/h'],['Peso suportado','Até 120 kg'],['Diferencial','Visual discreto de bike clássica']],
    faq: [['A Tomate 350W vale a pena?','Para ciclovias planas e quem quer visual discreto. Para potência, olhe UCITYS.'],['A bateria é removível?','Não — carrega no local de guarda.'],['Tomate ou UCITYS?','Tomate: discreta, 350W. UCITYS: 750W, bateria removível, mais barata.']]
  },
  {
    slug: 'review-nado-k3',
    rank: 7, brand: 'Nado', model: 'K3 750W',
    shortName: 'Nado K3 · 750W aro 20',
    h1: 'Review Completo: Nado K3 750W Bicicleta Elétrica Scooter Aro 20',
    title: 'Review Nado K3 750W: Bike Elétrica Utilitária Aro 20 | Tudo de Melhor',
    description: 'Review do Nado K3 750W: scooter elétrico aro 20 com bateria 48V removível, nota 8.6. Vale para entregas e commute multimodal?',
    score: '8.6', price: '5791.00', priceDisplay: 'R$ 5.791',
    mlLink: 'https://meli.la/1GuHCbJ',
    image: 'https://http2.mlstatic.com/D_NQ_NP_898691-MLB113402906913_062026-O.webp',
    intro1: 'O <strong>Nado K3 750W</strong> é a <strong>bike elétrica utilitária</strong> do ranking: motor <strong>750W</strong>, <strong>aro 20</strong> ágil, <strong>bateria 48V removível</strong> — por <strong>R$ 5.791</strong>.',
    intro2: 'Pensado para entregas leves, commute multimodal e manobras em corredores apertados onde bike grande não passa.',
    verdict1: 'O K3 é ágil e prático para uso utilitário urbano — entregas, última milha e trajetos com muitas paradas.',
    verdict2: 'Nota 8.6 reflete preço alto para o pacote e formato scooter que não agrada a todos.',
    pros: ['Motor 750W para manobras e subidas urbanas', 'Bateria 48V lítio removível', 'Aro 20 ágil em corredores apertados', 'Formato compacto para entregas leves', 'Boa para commute multimodal'],
    cons: ['Preço R$ 5.791 sem freio hidráulico', 'Aro 20 menos estável que aro 26 em velocidade', 'Formato scooter — não é bike clássica', 'Nota mais baixa do ranking (8.6)', 'Concorrentes dobráveis custam menos'],
    sections: [
      { h2: 'O Nado K3 é bom para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Sim, para <strong>entregas leves</strong> e commute com muitas paradas. O aro 20 e motor 750W permitem manobras rápidas em trânsito urbano.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Utilitário</h3><p class="mb-4 text-brand-muted">Ideal para quem carrega pequenas cargas e precisa de agilidade, não de autonomia extrema.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Alternativa</h3><p class="text-brand-muted">Entregas com mais carga? <a href="review-v9-max.html" class="text-brand-yellow underline">V9 Max 1000W</a>. Orçamento menor? <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline">Honeywhale S6-S</a>.</p>' },
      { h2: 'Bateria <span class="text-brand-yellow">48V Removível</span>', body: '<p class="mb-4 text-brand-muted">A <strong>bateria de lítio 48V removível</strong> permite carregar no destino — útil para entregadores e commute multimodal.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Troca de pack</h3><p class="mb-4 text-brand-muted">Com segundo pack, dobra a autonomia operacional do dia.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Carga</h3><p class="text-brand-muted">5–7 horas para carga completa.</p>' },
      { h2: 'Aro 20 e <span class="text-brand-yellow">Agilidade Urbana</span>', body: '<p class="mb-4 text-brand-muted">O <strong>aro 20</strong> é mais ágil que aro 26 em curvas fechadas e corredores — troca estabilidade por manobrabilidade.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Corredores</h3><p class="mb-4 text-brand-muted">Passa onde bike grande não entra — calçadas estreitas e vias compartilhadas.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Velocidade</h3><p class="text-brand-muted">Em velocidades altas, aro 20 é menos estável que aro 26 — mantenha ritmo urbano.</p>' },
      { h2: 'Motor 750W para <span class="text-brand-yellow">Entregas e Subidas</span>', body: '<p class="mb-4 text-brand-muted">750W cobre subidas urbanas moderadas com carga leve — suficiente para entregas de comida e encomendas pequenas.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Uso profissional</h3><p class="mb-4 text-brand-muted">Para entregas intensas o dia todo, considere investir na V9 Max ou segundo pack de bateria.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Custo-benefício</h3><p class="text-brand-muted">Por R$ 5.791, a Honeywhale S6-S oferece dobrável + fat tire + cesto por R$ 3.799 — compare antes.</p>' }
    ],
    specs: [['Motor','750W brushless'],['Bateria','48V lítio removível'],['Aro','20"'],['Autonomia','25–35 km'],['Freios','Disco D/T'],['Peso suportado','Até 120 kg'],['Formato','Scooter utilitário'],['Diferencial','Agilidade urbana + bateria removível']],
    faq: [['O Nado K3 vale a pena?','Para entregas leves e agilidade urbana. Para custo-benefício, Honeywhale S6-S é mais barata.'],['A bateria é removível?','Sim, 48V lítio — carrega fora da bike.'],['Nado K3 ou V9 Max?','K3: ágil, aro 20. V9 Max: 1000W, 48 km, uso intenso.']]
  }
];

function li(icon, text) { return `<li class="flex gap-2">${icon}<span>${text}</span></li>`; }

function renderPage2(p) {
  const prosHtml = p.pros.map(t => li(CHECK, t)).join('\n                ');
  const consHtml = p.cons.map(t => li(CROSS, t)).join('\n                ');
  const sectionsHtml = p.sections.map(s => `\n        <section><h2 class="mb-4 text-2xl font-extrabold md:text-3xl">${s.h2}</h2>${s.body}</section>`).join('');
  const specsHtml = p.specs.map(([k,v], i) => {
    const cls = i < p.specs.length - 1 ? 'border-b border-white/10 even:bg-white/5' : 'even:bg-white/5';
    return `<tr class="${cls}"><th scope="row" class="px-4 py-3 font-semibold text-white">${k}</th><td class="px-4 py-3 text-brand-muted">${v}</td></tr>`;
  }).join('\n              ');
  const faqHtml = p.faq.map(([q,a], i) => `\n          <details class="glass p-5"${i===0?' open':''}><summary class="cursor-pointer list-none font-bold">${q}</summary><p class="mt-3 text-sm text-brand-muted">${a}</p></details>`).join('');
  const faqSchema = p.faq.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJRGBSSWQG"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KJRGBSSWQG');</script>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${p.description}">
  <title>${p.title}</title>
  <link rel="canonical" href="https://tudodemelhor.com.br/${p.slug}.html">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.2/lite-yt-embed.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.2/lite-yt-embed.min.js" async></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{bg:'#232F3E',yellow:'#FFE600',card:'rgba(27, 37, 48, 0.7)',elevated:'#1B2530',border:'#37475A',muted:'#D5D9D9',dim:'#AAB3BD'}},fontFamily:{sans:['Inter','system-ui','sans-serif']},boxShadow:{glow:'0 0 15px rgba(255, 230, 0, 0.4)'},backgroundImage:{'brand-gradient':'linear-gradient(135deg, #FFE600 0%, #FF9900 100%)'}}}};</script>
  <style type="text/tailwindcss">@layer utilities{.glass{@apply bg-brand-card backdrop-blur-md border border-white/10 rounded-2xl;}}</style>
  <style>body{background-image:radial-gradient(ellipse 70% 45% at 85% 10%,rgba(255,153,0,.14),transparent 55%),radial-gradient(rgba(255,255,255,.045) 1px,transparent 1px);background-size:auto,18px 18px;background-attachment:fixed}lite-youtube{display:block;width:100%;aspect-ratio:16/9;border-radius:1rem;overflow:hidden}</style>
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Início","item":"https://tudodemelhor.com.br/"},{"@type":"ListItem","position":2,"name":"Reviews","item":"https://tudodemelhor.com.br/reviews.html"},{"@type":"ListItem","position":3,"name":"Mobilidade"},{"@type":"ListItem","position":4,"name":p.model}]},
    {"@type":"Product","name":`${p.brand} ${p.model}`,"brand":{"@type":"Brand","name":p.brand},"image":p.image,"review":{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":p.score,"bestRating":"10"},"author":{"@type":"Organization","name":"Tudo de Melhor"}},"offers":{"@type":"Offer","url":p.mlLink,"priceCurrency":"BRL","price":p.price,"availability":"https://schema.org/InStock"}},
    {"@type":"FAQPage","mainEntity":faqSchema}
  ]})}</script>
</head>
<body class="bg-brand-bg text-white font-sans antialiased min-h-screen pb-28">
  <header class="sticky top-0 z-50 border-b border-white/10 bg-brand-elevated/90 backdrop-blur-md">
    <div class="mx-auto flex h-[100px] max-w-7xl items-center gap-4 px-4">
      <a href="index.html" class="flex shrink-0 items-center gap-4"><div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-brand-bg lg:h-20 lg:w-20"><img src="assets/ui/logo-site/logo-tudo-melhor.jpeg" alt="Logo" class="h-full w-full object-cover"></div><div><span class="text-xl font-black uppercase text-white lg:text-2xl">Tudo De</span><br><span class="text-xl font-black uppercase text-brand-yellow lg:text-2xl">Melhor</span></div></a>
      <nav class="ml-auto hidden gap-8 text-sm text-brand-muted md:flex"><a href="categorias.html" class="hover:text-white">Rankings</a><a href="reviews.html" class="hover:text-white">Reviews</a></nav>
    </div>
  </header>
  <main class="px-4 pt-8"><div class="mx-auto max-w-6xl">
    <nav class="mb-6 flex flex-wrap gap-2 text-sm text-brand-dim" aria-label="Breadcrumb">
      <a href="index.html" class="hover:text-brand-yellow">Início</a><span>/</span>
      <a href="reviews.html" class="hover:text-brand-yellow">Reviews</a><span>/</span>
      <a href="reviews.html#mobilidade" class="hover:text-brand-yellow">Mobilidade</a><span>/</span>
      <span class="text-white">${p.brand}</span>
    </nav>
    <header class="mb-10">
      <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-brand-yellow">Review · #${p.rank} do ranking 2026</p>
      <h1 class="mb-8 text-3xl font-extrabold md:text-5xl">${p.h1}</h1>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="glass p-6 md:p-8"><p class="mb-4 text-lg text-brand-muted">${p.intro1}</p><p class="text-brand-muted">${p.intro2}</p></div>
        <div class="glass p-4"><lite-youtube videoid="ID_DO_SEU_VIDEO" playlabel="Review ${p.brand}"></lite-youtube></div>
      </div>
    </header>
    <section class="glass mb-10 p-6 md:p-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 class="mb-4 text-sm font-bold uppercase text-brand-dim">Veredito</h2>
          <div class="mb-4 flex items-end gap-3"><span class="text-6xl font-black text-brand-yellow">${p.score}</span><span class="pb-2 text-2xl text-brand-dim">/10</span></div>
          <p class="mb-2 text-brand-muted">${p.verdict1}</p><p class="text-brand-muted">${p.verdict2}</p>
          <a class="mt-6 inline-flex h-14 items-center justify-center rounded-xl bg-brand-yellow px-8 font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Ver Preço no Mercado Livre</a>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5"><h3 class="mb-4 text-sm font-bold uppercase text-emerald-300">Prós</h3><ul class="space-y-2.5 text-sm text-brand-muted">${prosHtml}</ul></div>
          <div class="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5"><h3 class="mb-4 text-sm font-bold uppercase text-orange-300">Contras</h3><ul class="space-y-2.5 text-sm text-brand-muted">${consHtml}</ul></div>
        </div>
      </div>
    </section>
    <article class="mb-10 space-y-10">${sectionsHtml}</article>
    <section class="mb-10"><h2 class="mb-6 text-2xl font-extrabold">Ficha técnica</h2>
      <div class="glass overflow-hidden"><table class="w-full text-sm"><tbody>${specsHtml}
        <tr class="even:bg-white/5"><th class="px-4 py-3 font-semibold text-white">Preço</th><td class="px-4 py-3 font-bold text-brand-yellow">${p.priceDisplay}</td></tr>
        <tr class="even:bg-white/5"><th class="px-4 py-3 font-semibold text-white">Nota</th><td class="px-4 py-3 font-bold text-brand-yellow">${p.score}/10 · #${p.rank}</td></tr>
      </tbody></table></div>
    </section>
    <section class="mb-10"><h2 class="mb-6 text-2xl font-extrabold">FAQ</h2><div class="space-y-3">${faqHtml}</div></section>
    <section class="mb-10"><div class="glass flex gap-4 p-6"><div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient font-black text-black">Equipe</div><div><h3 class="font-bold">Equipe Tudo de Melhor</h3><p class="text-sm text-brand-muted">Review #${p.rank} do ranking de bicicletas elétricas.</p></div></div></section>
  </div></main>
  <div class="fixed bottom-0 z-50 w-full border-t border-white/10 bg-brand-elevated/95 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
      <div><strong>${p.shortName}</strong><div class="text-sm font-bold text-brand-yellow">Nota ${p.score} · ${p.priceDisplay}</div></div>
      <a class="inline-flex h-11 items-center rounded-xl bg-brand-yellow px-6 font-extrabold text-black" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Ver Preço no Mercado Livre</a>
    </div>
  </div>
  <footer class="mt-8 border-t border-brand-border bg-[#1a222d] px-4 py-10"><div class="mx-auto max-w-6xl text-sm text-brand-dim">© ${new Date().getFullYear()} tudodemelhor.com.br</div></footer>
</body></html>`;
}

for (const p of products) {
  writeFileSync(join(ROOT, `${p.slug}.html`), renderPage2(p), 'utf8');
  console.log('✓', p.slug + '.html');
}
console.log(`\nLote 2: ${products.length} reviews gerados.`);

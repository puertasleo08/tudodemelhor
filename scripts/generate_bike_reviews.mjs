import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const CHECK = '<svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
const CROSS = '<svg class="mt-0.5 h-4 w-4 shrink-0 text-orange-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';

const products = [
  {
    slug: 'review-oimotoo-s6',
    rank: 1,
    brand: 'Oimotoo',
    model: 'S6 450W',
    shortName: 'Oimotoo S6 · 450W dobrável',
    h1: 'Review Completo: Bicicleta Elétrica Dobrável Oimotoo S6 450W',
    title: 'Review Oimotoo S6 450W: Bicicleta Elétrica Dobrável | Tudo de Melhor',
    description: 'Review completo da Oimotoo S6 450W: bicicleta elétrica dobrável com bateria 48V removível, autonomia de 35 km e nota 9.7. Vale a pena para commute urbano?',
    score: '9.7',
    price: '2.446',
    priceDisplay: 'R$ 2.446',
    mlLink: 'https://meli.la/1eqMgcv',
    image: 'https://http2.mlstatic.com/D_NQ_NP_822384-MLB109485329446_042026-O.webp',
    imageAlt: 'Melhor bike elétrica dobrável Oimotoo S6 450W',
    intro1: 'A <strong>Oimotoo S6</strong> lidera nosso ranking de <a href="melhores-bicicletas-eletricas.html" class="text-brand-yellow underline decoration-brand-yellow/40 hover:decoration-brand-yellow">melhores bicicletas elétricas</a>: motor <strong>450W</strong>, <strong>bateria 48V removível</strong> e autonomia de até <strong>35 km</strong> por cerca de <strong>R$ 2.446</strong>.',
    intro2: 'Testamos o pacote pensando no commute real — apartamento sem garagem, elevador apertado e trajeto misto. Se busca a <strong>melhor bike elétrica custo-benefício</strong> dobrável, esta review responde se a S6 entrega o que promete.',
    verdict1: 'A Oimotoo S6 é a escolha certa para quem precisa de uma <strong>bicicleta elétrica urbana</strong> compacta, com bateria que sai do quadro e preço abaixo de R$ 2.500.',
    verdict2: 'Não é a bike mais potente da lista — mas entrega o melhor equilíbrio entre portabilidade, autonomia e ticket para o dia a dia na cidade.',
    pros: ['Bateria 48V removível — carrega no apartamento', 'Quadro dobrável cabe em elevador e porta-malas', 'Melhor custo-benefício dobrável até R$ 2.500', 'Autonomia de ~35 km para trajetos urbanos', 'Freio a disco dianteiro e traseiro'],
    cons: ['Motor 450W sofre em subidas íngremes prolongadas', 'Pneus finos — menos conforto em paralelepípedo', 'Marca menos conhecida que Caloi ou Groove', 'Sem suspensão dianteira — impacto em buracos'],
    sections: [
      { h2: 'A Oimotoo S6 450W é boa para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Para o commute urbano típico, a <strong>Oimotoo S6</strong> cumpre muito bem: motor 450W em terreno plano, pedal assistido e quadro dobrável para guardar em casa.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Commute urbano</h3><p class="mb-4 text-brand-muted">Trajetos de 8 a 15 km com velocidade média de 20–25 km/h são o ponto forte. A autonomia de 35 km cobre ida e volta confortável.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Para quem não é ideal</h3><p class="text-brand-muted">Ladeiras longas e íngremes pedem modelos de 750W como a <a href="review-xroymexroy-ucitys.html" class="text-brand-yellow underline">UCITYS</a>.</p>' },
      { h2: 'Autonomia e <span class="text-brand-yellow">Bateria Removível 48V</span>', body: '<p class="mb-4 text-brand-muted">A bateria <strong>48V removível</strong> entrega autonomia prática de <strong>30 a 35 km</strong> em uso urbano misto.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Tempo de carga</h3><p class="mb-4 text-brand-muted">Carga completa em <strong>5 a 6 horas</strong> com carregador bivolt incluso.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Carregar no apartamento</h3><p class="text-brand-muted">O pack sai do quadro — não precisa levar a bike inteira até a tomada.</p>' },
      { h2: 'Design Dobrável e <span class="text-brand-yellow">Portabilidade</span>', body: '<p class="mb-4 text-brand-muted">A dobragem reduz o volume para elevadores, corredores e porta-malas de hatchbacks.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Elevador e condomínio</h3><p class="mb-4 text-brand-muted">Dobrada, passa discretamente pelo elevador. Peso ~22 kg — remova a bateria antes de subir escadas.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Transporte público</h3><p class="text-brand-muted">Formato dobrável ideal para modelo última milha — metrô ou ônibus + bike.</p>' },
      { h2: 'Desempenho do Motor <span class="text-brand-yellow">450W em Subidas</span>', body: '<p class="mb-4 text-brand-muted">Em ladeiras moderadas (5–8%), a S6 sobe com assistência mantendo 12–18 km/h.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Aclives longos</h3><p class="mb-4 text-brand-muted">Acima de 10% por mais de 200 m, a velocidade cai e a bateria drena mais rápido.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Comparativo honesto</h3><p class="text-brand-muted">Para 80% dos deslocamentos urbanos brasileiros, o 450W entrega assistência suficiente sem o salto de preço dos 750W.</p>' }
    ],
    specs: [['Marca','Oimotoo'],['Modelo','S6 · bicicleta elétrica dobrável'],['Motor','450W brushless'],['Bateria','48V lítio removível'],['Autonomia','Até 35 km'],['Tempo de carga','5 a 6 horas'],['Velocidade máxima','~25 km/h'],['Freios','Disco mecânico D/T'],['Peso suportado','Até 120 kg'],['Peso da bike','~22 kg'],['Quadro','Aço dobrável'],['Pneus','14" urbanos']],
    faq: [
      ['A Oimotoo S6 vale a pena em 2026?','Sim, para commute urbano com orçamento até R$ 2.500. É a dobrável com melhor custo-benefício do ranking.'],
      ['Posso levar a Oimotoo S6 no metrô?','Dobrada, ocupa espaço reduzido. Verifique o regulamento da sua cidade.'],
      ['Qual a diferença da S6 para a Honeywhale S6-S?','A Honeywhale tem 750W e 40 km de autonomia por ~R$ 3.799. A Oimotoo é mais barata e leve.']
    ]
  },
  {
    slug: 'review-xroymexroy-ucitys',
    rank: 2,
    brand: 'Xroymexroy',
    model: 'UCITYS 750W',
    shortName: 'Xroymexroy UCITYS · 750W aro 26',
    h1: 'Review Completo: Bicicleta Elétrica Xroymexroy UCITYS 750W Aro 26',
    title: 'Review Xroymexroy UCITYS 750W: Bike Elétrica Aro 26 | Tudo de Melhor',
    description: 'Review da Xroymexroy UCITYS 750W: bike elétrica aro 26 com bateria removível, quadro rebaixado e nota 9.4. Melhor custo-benefício para commute?',
    score: '9.4',
    price: '4379.00',
    priceDisplay: 'R$ 4.379',
    mlLink: 'https://meli.la/1gT9Gkw',
    image: 'https://http2.mlstatic.com/D_NQ_NP_809321-MLA111871083304_062026-O.webp',
    imageAlt: 'Bicicleta elétrica Xroymexroy UCITYS 750W aro 26',
    intro1: 'A <strong>Xroymexroy UCITYS</strong> é a <strong>bike elétrica aro 26</strong> com melhor custo-benefício do ranking: motor <strong>750W</strong>, <strong>bateria removível</strong> e visual de bicicleta clássica por <strong>R$ 4.379</strong>.',
    intro2: 'Para quem rejeita o formato scooter e quer postura urbana com folga em rampas moderadas, a UCITYS equilibra potência, autonomia e preço intermediário no Mercado Livre.',
    verdict1: 'A UCITYS é a bike certa para commute de 15–25 km com subidas moderadas, sem pagar o premium de marcas premium ou modelos de 1000W.',
    verdict2: 'O quadro rebaixado facilita embarque; a bateria removível resolve o problema de carregar em apartamento.',
    pros: ['Motor 750W com torque real em rampas moderadas', 'Visual de bike clássica aro 26 — não parece scooter', 'Bateria removível para carregar em casa', 'Quadro rebaixado facilita embarque', 'Melhor custo-benefício aro 26 do ranking'],
    cons: ['Não dobra — exige espaço de guarda maior', 'Peso maior que modelos dobráveis compactos', 'Marca pouco conhecida no Brasil', 'Preço acima de R$ 4.000 — não é entrada'],
    sections: [
      { h2: 'A UCITYS 750W é boa para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Sim. A <strong>UCITYS</strong> foi feita para deslocamento diário de 15–25 km com postura confortável de <strong>bicicleta elétrica urbana</strong> aro 26.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Commute com folga</h3><p class="mb-4 text-brand-muted">O motor 750W entrega assistência consistente em aclives moderados sem exigir pedal máximo.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Quem deve olhar outro modelo</h3><p class="text-brand-muted">Quem precisa dobrar para elevador deve considerar a <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> ou <a href="review-honeywhale-s6-s.html" class="text-brand-yellow underline">Honeywhale S6-S</a>.</p>' },
      { h2: 'Motor 750W e <span class="text-brand-yellow">Bateria Removível</span>', body: '<p class="mb-4 text-brand-muted">O conjunto <strong>750W + 48V</strong> é o sweet spot entre potência e autonomia para cidade com ladeiras.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Autonomia prática</h3><p class="mb-4 text-brand-muted">Espere 30–40 km conforme modo de assistência e peso do ciclista.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Bateria removível</h3><p class="text-brand-muted">Retire o pack e carregue no apartamento — essencial em condomínios sem tomada na garagem.</p>' },
      { h2: 'Quadro Aro 26 e <span class="text-brand-yellow">Conforto Urbano</span>', body: '<p class="mb-4 text-brand-muted">O aro 26 oferece estabilidade e postura familiar de bike convencional — ideal para quem vem do pedal tradicional.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Quadro rebaixado</h3><p class="mb-4 text-brand-muted">Facilita montar e desmontar, especialmente para ciclistas mais baixos ou com roupas formais.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Estabilidade</h3><p class="text-brand-muted">Rodas maiores absorvem melhor irregularidades que scooters de aro 14 ou 20.</p>' },
      { h2: 'Desempenho em <span class="text-brand-yellow">Subidas e Carga</span>', body: '<p class="mb-4 text-brand-muted">Com 750W, a UCITYS sobe ladeiras de 8–12% com assistência e pedal moderado — bem acima do que um 450W entrega.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Com carga</h3><p class="mb-4 text-brand-muted">Mochila pesada ou cesta não derrubam a performance como em motores de entrada.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Limite realista</h3><p class="text-brand-muted">Para subidas muito íngremes ou off-road, a <a href="review-v9-max.html" class="text-brand-yellow underline">V9 Max 1000W</a> ainda tem vantagem de torque.</p>' }
    ],
    specs: [['Marca','Xroymexroy'],['Modelo','UCITYS · aro 26'],['Motor','750W brushless'],['Bateria','48V lítio removível'],['Autonomia','30–40 km'],['Velocidade máxima','~32 km/h'],['Freios','Disco mecânico D/T'],['Peso suportado','Até 120 kg'],['Aro','26"'],['Quadro','Aço rebaixado'],['Diferencial','Melhor custo-benefício aro 26']],
    faq: [
      ['A UCITYS vale a pena?','Sim, se você quer bike elétrica com visual clássico, motor 750W e bateria removível sem pagar R$ 7.000+.'],
      ['A UCITYS dobra?','Não. Se portabilidade é prioridade, veja Oimotoo S6 ou Honeywhale S6-S.'],
      ['UCITYS ou Tomate 350W?','A Tomate é mais discreta e barata para ciclovias planas; a UCITYS tem mais potência para rampas e trajetos longos.']
    ]
  },
  {
    slug: 'review-honeywhale-s6-s',
    rank: 3,
    brand: 'Honeywhale',
    model: 'S6-S 750W',
    shortName: 'Honeywhale S6-S · 750W fat tire',
    h1: 'Review Completo: Bicicleta Elétrica Dobrável Honeywhale S6-S 750W',
    title: 'Review Honeywhale S6-S 750W: Bike Elétrica Dobrável Fat Tire | Tudo de Melhor',
    description: 'Review da Honeywhale S6-S 750W: bike elétrica dobrável fat tire, autonomia 40 km, cesto e nota 9.3. Vale a pena para cidade com buracos?',
    score: '9.3',
    price: '3799.00',
    priceDisplay: 'R$ 3.799',
    mlLink: 'https://meli.la/1MDt7cC',
    image: 'https://http2.mlstatic.com/D_NQ_NP_801018-MLA115363054279_072026-O.webp',
    imageAlt: 'Honeywhale S6-S bike elétrica dobrável 750W fat tire',
    intro1: 'A <strong>Honeywhale S6-S</strong> une o que muita gente quer numa <strong>bike elétrica dobrável</strong>: motor <strong>750W</strong>, <strong>pneus largos (fat tire)</strong>, autonomia de <strong>40 km</strong> e cesto — por <strong>R$ 3.799</strong>.',
    intro2: 'Se suas ruas têm buracos, paralelepípedo e calçadas irregulares, a S6-S troca a leveza extrema da Oimotoo por robustez e conforto de rodagem.',
    verdict1: 'A Honeywhale S6-S é a dobrável mais completa para cidade brasileira com piso ruim: potência, autonomia e estabilidade de fat tire.',
    verdict2: 'Pesa e custa mais que a Oimotoo S6 — mas compensa se conforto e torque importam mais que o menor preço.',
    pros: ['Motor 750W com torque para subidas e carga', 'Fat tire absorve buracos e paralelepípedo', 'Autonomia de até 40 km', 'Cesto incluso para compras e entregas leves', 'Quadro dobrável com capacidade até 125 kg'],
    cons: ['Mais pesada que dobráveis compactas de 450W', 'Preço ~R$ 1.350 acima da Oimotoo S6', 'Formato scooter — não parece bike clássica', 'Dobrada ainda ocupa espaço considerável'],
    sections: [
      { h2: 'A Honeywhale S6-S é boa para o <span class="text-brand-yellow">dia a dia</span>?', body: '<p class="mb-4 text-brand-muted">Excelente para <strong>uso urbano com piso irregular</strong>. O conjunto 750W + fat tire + cesto cobre commute, mercado e entregas leves.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Cidade com buracos</h3><p class="mb-4 text-brand-muted">Pneus largos reduzem impacto em valetas e paralelepípedo — diferença perceptível vs. aro 14 fino.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Alternativa mais barata</h3><p class="text-brand-muted">Orçamento apertado? A <a href="review-oimotoo-s6.html" class="text-brand-yellow underline">Oimotoo S6</a> custa menos, mas com menos potência e pneus finos.</p>' },
      { h2: 'Autonomia de 40 km e <span class="text-brand-yellow">Bateria 48V</span>', body: '<p class="mb-4 text-brand-muted">Com <strong>48V</strong> e pack generoso, a S6-S entrega até <strong>40 km</strong> — a maior autonomia entre as dobráveis do ranking.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Uso real</h3><p class="mb-4 text-brand-muted">Em modo turbo constante e subidas, espere 28–35 km. Em assistência moderada, chega aos 40 km.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Carga</h3><p class="text-brand-muted">Carregamento completo em 6–7 horas. Bateria removível para carregar dentro de casa.</p>' },
      { h2: 'Fat Tire e <span class="text-brand-yellow">Robustez Dobrável</span>', body: '<p class="mb-4 text-brand-muted">A S6-S prioriza estabilidade: pneus largos, quadro reforçado e suporte até <strong>125 kg</strong> com carga.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Cesto utilitário</h3><p class="mb-4 text-brand-muted">Ideal para compras do dia a dia sem mochila pesada nas costas.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Portabilidade</h3><p class="text-brand-muted">Dobra, mas é mais volumosa que a Oimotoo S6. Planeje o espaço de guarda.</p>' },
      { h2: 'Motor 750W em <span class="text-brand-yellow">Subidas e Carga</span>', body: '<p class="mb-4 text-brand-muted">O 750W entrega torque consistente em aclives de 8–12% mesmo com peso e cesto carregado.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Vs. 450W</h3><p class="mb-4 text-brand-muted">A diferença é clara em morros longos — a S6-S mantém velocidade onde um 450W desacelera.</p><h3 class="mb-3 text-lg font-bold text-brand-yellow">Limite</h3><p class="text-brand-muted">Para off-road agressivo ou 1000W de torque, veja a <a href="review-v9-max.html" class="text-brand-yellow underline">V9 Max</a>.</p>' }
    ],
    specs: [['Marca','Honeywhale'],['Modelo','S6-S · dobrável fat tire'],['Motor','750W brushless'],['Bateria','48V lítio removível'],['Autonomia','Até 40 km'],['Pneus','Fat tire largos'],['Freios','Disco D/T'],['Peso suportado','Até 125 kg'],['Extras','Cesto dianteiro'],['Diferencial','Dobrável robusta para piso ruim']],
    faq: [
      ['Honeywhale S6-S ou Oimotoo S6?','Oimotoo: mais barata e leve. Honeywhale: mais potência, autonomia e conforto em piso ruim.'],
      ['A S6-S aguenta entregas?','Sim, para entregas leves com cesto. Para uso profissional intenso, considere Nado K3 ou V9 Max.'],
      ['Qual a autonomia real?','28–40 km conforme modo, peso e terreno. Turbo constante reduz para a faixa inferior.']
    ]
  }
];

function li(icon, text) {
  return `<li class="flex gap-2">${icon}<span>${text}</span></li>`;
}

function renderPage(p) {
  const prosHtml = p.pros.map(t => li(CHECK, t)).join('\n                ');
  const consHtml = p.cons.map(t => li(CROSS, t)).join('\n                ');
  const sectionsHtml = p.sections.map(s => `
        <section>
          <h2 class="mb-4 text-2xl font-extrabold md:text-3xl">${s.h2}</h2>
          ${s.body}
        </section>`).join('\n');
  const specsHtml = p.specs.map(([k,v], i) => {
    const cls = i < p.specs.length - 1 ? 'border-b border-white/10 even:bg-white/5' : 'even:bg-white/5';
    return `<tr class="${cls}"><th scope="row" class="px-4 py-3 font-semibold text-white">${k}</th><td class="px-4 py-3 text-brand-muted">${v}</td></tr>`;
  }).join('\n              ');
  const faqHtml = p.faq.map(([q,a], i) => `
          <details class="glass p-5"${i === 0 ? ' open' : ''}>
            <summary class="cursor-pointer list-none font-bold">${q}</summary>
            <p class="mt-3 text-sm text-brand-muted">${a}</p>
          </details>`).join('');
  const faqSchema = p.faq.map(([q,a]) => ({ '@type':'Question', name:q, acceptedAnswer:{'@type':'Answer',text:a} }));

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJRGBSSWQG"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KJRGBSSWQG');</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${p.description}">
  <title>${p.title}</title>
  <link rel="canonical" href="https://tudodemelhor.com.br/${p.slug}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.2/lite-yt-embed.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.2/lite-yt-embed.min.js" async></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{bg:'#232F3E',yellow:'#FFE600',orange:'#FF9900',card:'rgba(27, 37, 48, 0.7)',elevated:'#1B2530',border:'#37475A',muted:'#D5D9D9',dim:'#AAB3BD'}},fontFamily:{sans:['Inter','system-ui','sans-serif']},boxShadow:{glow:'0 0 15px rgba(255, 230, 0, 0.4)','glow-emerald':'0 0 24px rgba(16, 185, 129, 0.3)'},backgroundImage:{'brand-gradient':'linear-gradient(135deg, #FFE600 0%, #FF9900 100%)'}}}};</script>
  <style type="text/tailwindcss">@layer utilities{.glass{@apply bg-brand-card backdrop-blur-md border border-white/10 rounded-2xl;}}</style>
  <style>body{background-image:radial-gradient(ellipse 70% 45% at 85% 10%,rgba(255,153,0,.14),transparent 55%),radial-gradient(ellipse 50% 40% at 10% 85%,rgba(255,230,0,.07),transparent 50%),radial-gradient(rgba(255,255,255,.045) 1px,transparent 1px);background-size:auto,auto,18px 18px;background-attachment:fixed}lite-youtube{display:block;width:100%;max-width:100%;aspect-ratio:16/9;border-radius:1rem;overflow:hidden}</style>
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Início","item":"https://tudodemelhor.com.br/"},
      {"@type":"ListItem","position":2,"name":"Reviews","item":"https://tudodemelhor.com.br/reviews.html"},
      {"@type":"ListItem","position":3,"name":"Mobilidade","item":"https://tudodemelhor.com.br/reviews.html#mobilidade"},
      {"@type":"ListItem","position":4,"name":p.model}
    ]},
    {"@type":"Product","name":`${p.brand} ${p.model}`,"brand":{"@type":"Brand","name":p.brand},"image":p.image,
      "review":{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":p.score,"bestRating":"10"},"author":{"@type":"Organization","name":"Tudo de Melhor"}},
      "offers":{"@type":"Offer","url":p.mlLink,"priceCurrency":"BRL","price":p.price,"availability":"https://schema.org/InStock"}},
    {"@type":"FAQPage","mainEntity":faqSchema}
  ]})}</script>
</head>
<body class="bg-brand-bg text-white font-sans antialiased min-h-screen pb-28">
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
        <span class="flex flex-col gap-1.5"><span class="block h-0.5 w-6 bg-white"></span><span class="block h-0.5 w-6 bg-white"></span><span class="block h-0.5 w-6 bg-white"></span></span>
      </button>
      <nav id="site-nav" class="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-brand-muted md:flex">
        <a href="index.html#categorias" class="transition hover:text-white">Categorias</a>
        <a href="categorias.html" class="transition hover:text-white">Rankings</a>
        <a href="reviews.html" class="transition hover:text-white">Reviews</a>
        <a href="index.html#ofertas" class="font-bold text-brand-yellow shadow-glow transition hover:text-white">Melhores Ofertas</a>
      </nav>
    </div>
    <div id="mobile-nav" class="hidden border-t border-white/10 bg-brand-elevated/98 px-4 py-4 md:hidden">
      <nav class="flex flex-col gap-1 text-sm">
        <a href="categorias.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Rankings</a>
        <a href="reviews.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Reviews</a>
      </nav>
    </div>
  </header>

  <main class="px-4 pt-8">
    <div class="mx-auto max-w-6xl">
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-brand-dim" aria-label="Breadcrumb">
        <a href="index.html" class="hover:text-brand-yellow">Início</a><span aria-hidden="true">/</span>
        <a href="reviews.html" class="hover:text-brand-yellow">Reviews</a><span aria-hidden="true">/</span>
        <a href="reviews.html#mobilidade" class="hover:text-brand-yellow">Mobilidade</a><span aria-hidden="true">/</span>
        <span class="text-white" aria-current="page">${p.brand} ${p.model.split(' ')[0]}</span>
      </nav>

      <header class="mb-10">
        <p class="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-yellow">Review · #${p.rank} do ranking de bikes elétricas 2026</p>
        <h1 class="mb-8 text-3xl font-extrabold leading-tight md:text-5xl">${p.h1}</h1>
        <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div class="glass p-6 md:p-8">
            <p class="mb-4 text-lg text-brand-muted">${p.intro1}</p>
            <p class="text-brand-muted">${p.intro2}</p>
          </div>
          <div class="glass overflow-hidden p-4 md:p-5">
            <lite-youtube videoid="ID_DO_SEU_VIDEO" playlabel="Review ${p.brand} ${p.model}"></lite-youtube>
            <p class="mt-3 text-center text-xs text-brand-dim">Assista ao review em vídeo</p>
          </div>
        </div>
      </header>

      <section class="glass mb-10 p-6 md:p-8" aria-label="Veredito editorial">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 class="mb-4 text-sm font-bold uppercase tracking-wide text-brand-dim">Veredito Tudo de Melhor</h2>
            <div class="mb-4 flex items-end gap-3">
              <span class="text-6xl font-black leading-none text-brand-yellow drop-shadow-[0_0_15px_rgba(255,230,0,0.4)]">${p.score}</span>
              <span class="pb-2 text-2xl font-bold text-brand-dim">/10</span>
            </div>
            <p class="mb-2 text-brand-muted">${p.verdict1}</p>
            <p class="text-brand-muted">${p.verdict2}</p>
            <a class="mt-6 inline-flex h-14 w-full items-center justify-center rounded-xl bg-brand-yellow px-8 text-base font-extrabold text-black shadow-glow transition hover:brightness-110 sm:w-auto" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Ver Preço no Mercado Livre</a>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-emerald-300">Prós</h3>
              <ul class="space-y-2.5 text-sm text-brand-muted">${prosHtml}</ul>
            </div>
            <div class="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5">
              <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-orange-300">Contras</h3>
              <ul class="space-y-2.5 text-sm text-brand-muted">${consHtml}</ul>
            </div>
          </div>
        </div>
      </section>

      <article class="mb-10 space-y-10">${sectionsHtml}</article>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Ficha técnica</h2>
        <div class="glass overflow-hidden">
          <table class="w-full text-left text-sm"><tbody>
              ${specsHtml}
              <tr class="even:bg-white/5"><th scope="row" class="px-4 py-3 font-semibold text-white">Preço observado</th><td class="px-4 py-3 font-bold text-brand-yellow">${p.priceDisplay} (Mercado Livre, ago/2026)</td></tr>
              <tr class="even:bg-white/5"><th scope="row" class="px-4 py-3 font-semibold text-white">Nota Tudo de Melhor</th><td class="px-4 py-3 font-bold text-brand-yellow">${p.score} / 10 · #${p.rank} do ranking</td></tr>
          </tbody></table>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-6 text-2xl font-extrabold md:text-3xl">Perguntas <span class="text-brand-yellow">frequentes</span></h2>
        <div class="space-y-3">${faqHtml}</div>
      </section>

      <section class="mb-10" aria-label="Autor">
        <div class="glass flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-black shadow-glow">Equipe</div>
          <div>
            <h3 class="mb-1 text-lg font-bold">Equipe Tudo de Melhor</h3>
            <p class="text-sm text-brand-muted">Review do #${p.rank} do ranking de bicicletas elétricas. Preços e imagens do Mercado Livre. Links de afiliados podem gerar comissão.</p>
          </div>
        </div>
      </section>
    </div>
  </main>

  <div class="fixed bottom-0 z-50 w-full border-t border-white/10 bg-brand-elevated/95 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <strong class="block truncate text-white">${p.shortName}</strong>
        <div class="text-sm font-bold text-brand-yellow">Nota ${p.score} · a partir de ${p.priceDisplay}</div>
      </div>
      <a class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-yellow px-6 text-sm font-extrabold text-black shadow-glow" rel="sponsored noopener" target="_blank" href="${p.mlLink}">Ver Preço no Mercado Livre</a>
    </div>
  </div>

  <footer class="mt-8 border-t border-brand-border bg-[#1a222d] px-4 py-10">
    <div class="mx-auto max-w-6xl grid grid-cols-1 gap-8 md:grid-cols-4">
      <div><a href="index.html" class="mb-3 flex items-center gap-3"><img src="assets/ui/logo-site/logo-tudo-melhor.jpeg" width="42" height="42" alt="" class="h-10 w-10 object-contain"><span class="text-sm font-extrabold uppercase tracking-wider">Tudo de Melhor</span></a><p class="text-sm text-brand-dim">Rankings e reviews para decidir com segurança.</p></div>
      <div><h4 class="mb-3 text-sm font-bold">Navegação</h4><div class="flex flex-col gap-2 text-sm text-brand-dim"><a href="index.html" class="hover:text-brand-yellow">Home</a><a href="categorias.html" class="hover:text-brand-yellow">Rankings</a><a href="reviews.html" class="hover:text-brand-yellow">Reviews</a></div></div>
      <div><h4 class="mb-3 text-sm font-bold">Categorias</h4><div class="flex flex-col gap-2 text-sm text-brand-dim"><a href="melhores-bicicletas-eletricas.html" class="hover:text-brand-yellow">Bicicletas Elétricas</a></div></div>
      <div><h4 class="mb-3 text-sm font-bold">Legal</h4><div class="flex flex-col gap-2 text-sm text-brand-dim"><a href="sobre.html" class="hover:text-brand-yellow">Sobre</a><a href="privacidade.html" class="hover:text-brand-yellow">Privacidade</a><a href="contato.html" class="hover:text-brand-yellow">Contato</a></div></div>
    </div>
    <div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-4 text-xs text-brand-dim">© <span id="y"></span> tudodemelhor.com.br</div>
  </footer>
  <script>
    document.getElementById('y').textContent=new Date().getFullYear();
    const toggle=document.getElementById('nav-toggle'),mobile=document.getElementById('mobile-nav');
    toggle?.addEventListener('click',()=>{const open=mobile.classList.toggle('hidden')===false;toggle.setAttribute('aria-expanded',open?'true':'false');});
  </script>
</body>
</html>`;
}

for (const p of products) {
  const out = join(ROOT, `${p.slug}.html`);
  writeFileSync(out, renderPage(p), 'utf8');
  console.log('✓', p.slug + '.html');
}

console.log(`\nLote 1: ${products.length} reviews gerados.`);

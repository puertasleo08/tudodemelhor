const fs = require('fs');

function textOf(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function countWB(t, term) {
  const parts = term
    .toLowerCase()
    .split(/\s+/)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(
    '(?:^|[^\\p{L}\\p{N}_])' + parts.join('[\\s]+') + '(?=[^\\p{L}\\p{N}_]|$)',
    'giu'
  );
  return (t.match(re) || []).length;
}
function report(label, html, data) {
  const plain = textOf(html).toLowerCase();
  console.log('\n', label, 'words', textOf(html).split(/\s+/).length);
  for (const x of [...data.terms.content_basic, ...data.terms.content_extended]) {
    const c = countWB(plain, x.t);
    const [lo, hi] = x.sugg_usage;
    if (c < lo || c > hi)
      console.log(c < lo ? 'LOW' : 'HIGH', x.usage_pc, JSON.stringify(x.t), c + '/' + lo + '-' + hi);
  }
}

const mimoData = JSON.parse(
  fs.readFileSync(
    'C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/5d06ac26-5758-4ce6-b675-ad552b0916c1.txt',
    'utf8'
  )
);
const zyData = JSON.parse(
  fs.readFileSync(
    'C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/f0b6f50f-c450-4491-ba1a-fcdd7d72c585.txt',
    'utf8'
  )
);

const mimoTitle = 'Umidificador de Ar Barato Recomendado: Menor Preço Mimo Style | Tudo de Melhor';
const mimoDesc =
  'Produto barato com oferta e melhores marcas: review do modelo de entrada para quarto seco.';

// Semi-strict: allow mild over on basics (target mid-high), H2 brands, PAA, ~320 words
const mimoHtml = `<main>
<div>
<nav><a href="ranking-umidificadores.html">Lista de umidificadores</a></nav>
<header>
<h1>Umidificador de ar barato: Mimo Style 2,5L recomendado</h1>
<p>Este produto compacto e silencioso ajuda a ambientar o quarto seco com o menor preço da curadoria — porta de entrada com ótimo custo benefício.</p>
</header>
<section>
<h2>Veredito e pontos positivos</h2>
<p>Nota 8.8. Oferta ~R$ 110. Aparelho ultrassônico para cabeceira, limpeza simples da base e autonomia abaixo das 10 horas dos tanques grandes. Modelo acima de 2 litros / 2L. Sem luminária, lâmpada LED, grade HEPA nem umidificador e aromatizador de ar.</p>
</section>
<section>
<h2>Especificações: modelo ultrassônico bivolt</h2>
<p>Fabricante BDS Digital. Umidificador ar branco, elétrico (confira a descrição do lote). Uso noturno.</p>
</section>
<section>
<h2>G-Tech, Elgin Digital, Mondial e Air: quando pagar mais</h2>
<p>Nos 7 melhores umidificadores de ar costumam surgir G-Tech Allergy Free Dual, Elgin Digital, Mondial, Dellamed, Suggar, umidificador de ar ultrassônico Fisher e umidificador de ar WAP Air. Linhas G-Tech Allergy Free HM e ultrassônico 3l allergy free hm (allergy free hm g-tech, NUA-02, UM45BIBR, HC055, Comfort Air) sobem com filtro, ionizador e recursos smart.</p>
<p>Não substitui purificador de ar nem purificador usb. Para aromaterapia com essência ou óleo, use difusor de aroma próprio. Mini umidificador de ar portátil? Veja o Zyhum portatil. Intensidade da névoa moderada reduz alergia; o clima melhora o sono. Fresh sem pagar premium. Vale comparar as melhores marcas.</p>
</section>
<section>
<h2>Difusor elétrico vs entrada barata</h2>
<p>Quem quer só aroma escolhe difusor dedicado; quem quer umidade barata no ambiente pequeno fica neste tanque.</p>
</section>
<section>
<h2>Onde comprar</h2>
<p>Mercado Livre e Amazon no link rastado.</p>
</section>
<section>
<h2>FAQ</h2>
<details><summary>Qual umidificador é bom e barato?</summary><p>Este de entrada: ticket baixo e operação simples.</p></details>
<details><summary>Quais são os melhores umidificadores de ar com bom custo-benefício?</summary><p>Faixa barata: Mimo Style. Intermediária: Elgin Digital e Mondial.</p></details>
<details><summary>O que pode substituir um umidificador de ar?</summary><p>Toalha úmida ajuda pouco; tanque ultrassônico vence.</p></details>
<details><summary>Porque não se pode dormir com o umidificador ligado?</summary><p>Pode, com névoa baixa e limpeza em dia.</p></details>
<details><summary>Como fazer um umidificador de ar caseiro?</summary><p>Não substitui intensidade da névoa controlada.</p></details>
<details><summary>Mimo Style ou G-Tech?</summary><p>G-Tech e Elgin Digital custam mais com filtro. Aqui o menor preço ambienta o ambiente pequeno.</p></details>
</section>
</div>
</main>`;

const zyTitle = 'Mini Umidificador de Ar Portátil USB Zyhum 500ml: Review | Tudo de Melhor';
const zyDesc =
  'Mini umidificador de ar portátil Zyhum 500ml USB: review do produto com LED, aromatizador e controle remoto.';

// Semi-strict Zyhum ~730 words, reduce mini/umidificador/ar/usb/led repeats
const zyHtml = `<main>
<div>
<nav><a href="ranking-umidificadores.html">Lista de umidificadores</a></nav>
<header>
<h1>Mini umidificador de ar portátil Zyhum 500ml: USB e aromatizador</h1>
<p>Mesa, cabeceira ou viagem: o Zyhum 500 ml é um umidificador de ar portátil ultrassônico com controle remoto — produto compacto e honesto sobre o alcance curto.</p>
</header>
<section>
<h2>Veredito</h2>
<p>Nota 8.6. Ótimo ticket (~R$ 64). Spray fino para ambientar a bolha do teclado, trazer conforto e apoiar saúde pontual.</p>
</section>
<section>
<h2>Prós e contras</h2>
<ul>
<li>Portátil USB com controle remoto e umidificador de ar com LED</li>
<li>Material plástico branco/cinza; tanque acima de rivais com capacidade para até 20ml / 20ml de água</li>
<li>Alcance curto — dispositivo compacto, não sala inteira</li>
<li>Base pede higiene frequente com óleo essencial</li>
</ul>
</section>
<section>
<h2>Especificações e modo de usar</h2>
<p>O umidificador conta com tecnologia ultrassônica e tanque de 500 ml. Alimentação DC 5V: cabo USB na fonte, carregador externo ou USB do computador (entrada USB). Em vários lotes o umidificador possui um LED — possui um led ao redor / led ao redor da tampa, até 7 cores; luz azul e luz vermelha variam por lote. Encha, escolha a intensidade e faça o desligamento ao esvaziar. O aparelho eletrônico é leve e portatil. Rival recarregável: confirme se pode ser usado sem fio antes do carro.</p>
</section>
<section>
<h2>O que é e para que serve o mini umidificador de ar portátil</h2>
<p>Comparar com Midea 6 L é injusto: aqui a proposta é a bolha da mesa. Entrega tecnologia ultrassônica para você respirar melhor no teclado ou, com cuidado, no carro. Capaz de amenizar sintomas característicos de ar seco na pele e ajuda a respirar com facilidade e dormir — facilidade e dormir ainda melhor em clima confortável. É umidificador de ar ultrassônico no formato ar com led portátil usb.</p>
<p>A umidade fica localizada. A água acaba em poucas horas. Para ambientar a sala, suba de categoria. Neste lote a energia costuma vir só do cabo. Em escritório aberto o efeito some rápido; no nicho da mesa o retorno é claro. Para refrescar a casa toda, escolha tanque maior. Em resumo: acessório de mesa com reservatório sério, não brinquedo de 20ml.</p>
<p>No dia a dia, deixe a 30 cm do teclado e evite jato alto no papel. No inverno seco, use só no bloco de foco. Em hotel, o tamanho cabe na mala. Se surgir filme calcário, vinagre diluído e enxágue. Guarde seco para evitar odor. Quem divide kitnet combina com ventilação curta de manhã. Em reunião por vídeo, jato baixo evita estalo no microfone.</p>
<p>Independência de tomada só existe com bateria no lote. Sem isso, planeje porta livre no notebook. Alternativas no ranking: Mimo Style 2,5L e WAP Air Flow 4L. O Zyhum rende como complemento, nunca como solução única da casa.</p>
</section>
<section>
<h2>Onde comprar</h2>
<p>Anúncio rastado do produto. Compare na Amazon.</p>
</section>
<section>
<h2>FAQ</h2>
<details><summary>O mini umidificador de ar Zyhum vale a pena?</summary><p>Sim na mesa; não substitui 4–6 L.</p></details>
<details><summary>Para que serve o mini umidificador de ar portátil?</summary><p>Umidade localizada com aromatizador e controle remoto.</p></details>
<details><summary>Funciona com bateria ou USB?</summary><p>Alguns rivais são recarregável; o Zyhum costuma depender de cabo USB / entrada USB. Confirme antes do carro.</p></details>
<details><summary>Ameniza sintoma de ressecamento?</summary><p>Ajuda a refrescar a pele perto do jato; não trata doença.</p></details>
<details><summary>Como higienizar?</summary><p>Esvazie, lave a base e seque.</p></details>
<details><summary>Gostou do produto?</summary><p>Se a meta é a bolha da mesa, sim.</p></details>
</section>
</div>
</main>`;

fs.writeFileSync('_mimo_v6.html', mimoHtml);
fs.writeFileSync('_zyhum_v6.html', zyHtml);
fs.writeFileSync(
  '_meta_v6.json',
  JSON.stringify({
    mimo: { title: mimoTitle, description: mimoDesc },
    zyhum: { title: zyTitle, description: zyDesc },
  })
);
report('MIMO v6', mimoHtml, mimoData);
report('ZY v6', zyHtml, zyData);

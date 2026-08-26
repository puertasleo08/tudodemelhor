const fs = require('fs');
const base = 'c:/Users/leo/OneDrive/Desktop/TUDO-DE-MELHOR';

function pack(name, query, title, description) {
  const html = fs.readFileSync(`${base}/.tmp-simple-${name}.html`, 'utf8');
  const args = { query, title, description, html };
  const s = JSON.stringify(args);
  fs.writeFileSync(`${base}/.tmp-args-${name}.json`, s);
  console.log(name, 'html', html.length, 'json', s.length, 'dqInHtml', html.includes('"'));
}

pack(
  'kian',
  'cf9f7688c0a64da3',
  'Umidificador de Ar Kian 5L Ultrassônico: Review | Tudo de Melhor',
  'Umidificador de ar Kian 5 litros vale a pena? Review para ambientar quarto: ultrassônico bivolt, autonomia, limpeza, nota 9.2 e onde comprar.'
);
pack(
  'wap',
  '9b6774cc9861ea15',
  'Umidificador de Ar WAP Air Flow 4L: Review | Tudo de Melhor',
  'Umidificador de ar WAP Air Flow 4 litros vale a pena? Review digital com luminária e difusor de aromas, névoa ultrassônica bivolt: nota 9.0 e onde comprar.'
);

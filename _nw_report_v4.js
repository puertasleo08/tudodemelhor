const fs = require('fs');

function textOf(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

function report(label, html, data) {
  const plain = textOf(html).toLowerCase();
  console.log('\n', label, 'words', textOf(html).split(/\s+/).length);
  for (const x of data.terms.content_basic) {
    const c = countWB(plain, x.t);
    const [lo, hi] = x.sugg_usage;
    const flag = c < lo ? 'LOW' : c > hi ? 'HIGH' : 'ok';
    console.log(flag, JSON.stringify(x.t), c + '/' + hi);
  }
  let high = 0,
    low = 0;
  for (const x of data.terms.content_extended) {
    const c = countWB(plain, x.t);
    const [lo, hi] = x.sugg_usage;
    if (c > hi) {
      high++;
      if (x.usage_pc >= 20) console.log('HIGH', x.usage_pc, JSON.stringify(x.t), c + '/' + hi);
    }
    if (c < lo) {
      low++;
      if (x.usage_pc >= 10) console.log('LOW', x.usage_pc, JSON.stringify(x.t), c);
    }
  }
  console.log('ext HIGH', high, 'LOW', low);
}

report('MIMO v4', fs.readFileSync('_mimo_v4.html', 'utf8'), mimoData);
report('ZY v4', fs.readFileSync('_zyhum_v4.html', 'utf8'), zyData);

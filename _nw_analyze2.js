const fs = require('fs');

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
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

function analyze(label, html, data) {
  const plain = textOf(html).toLowerCase();
  const words = plain.split(/\s+/).filter(Boolean).length;
  console.log('\n====', label, 'words', words, 'target', data.metrics?.word_count?.target, '====');
  const issues = [];
  for (const x of data.terms.content_basic) {
    const c = countWB(plain, x.t);
    const [lo, hi] = x.sugg_usage;
    const flag = c < lo ? 'LOW' : c > hi ? 'HIGH' : 'OK';
    if (flag !== 'OK') issues.push({ kind: 'basic', flag, t: x.t, c, lo, hi, pc: x.usage_pc });
    console.log(flag, 'B', JSON.stringify(x.t), c + '/' + lo + '-' + hi);
  }
  for (const x of data.terms.content_extended) {
    const c = countWB(plain, x.t);
    const [lo, hi] = x.sugg_usage;
    const flag = c < lo ? 'LOW' : c > hi ? 'HIGH' : 'OK';
    if (flag !== 'OK') issues.push({ kind: 'ext', flag, t: x.t, c, lo, hi, pc: x.usage_pc });
  }
  issues.sort((a, b) => b.pc - a.pc || (a.flag === 'HIGH' ? -1 : 1));
  console.log('-- issues by pc --');
  for (const m of issues.slice(0, 50)) {
    console.log(m.flag, m.kind, m.pc, JSON.stringify(m.t), m.c + '/' + m.lo + '-' + m.hi);
  }
  console.log('issue count', issues.length, 'HIGH', issues.filter((i) => i.flag === 'HIGH').length, 'LOW', issues.filter((i) => i.flag === 'LOW').length);
}

const mimoData = JSON.parse(
  fs.readFileSync(
    'C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/5d06ac26-5758-4ce6-b675-ad552b0916c1.txt',
    'utf8'
  )
);
const zyhumData = JSON.parse(
  fs.readFileSync(
    'C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/f0b6f50f-c450-4491-ba1a-fcdd7d72c585.txt',
    'utf8'
  )
);

const mimoHtml = fs.readFileSync('c:/Users/leo/OneDrive/Desktop/TUDO-DE-MELHOR/_mimo_nw.html', 'utf8');
const zyhumHtml = fs.readFileSync('c:/Users/leo/OneDrive/Desktop/TUDO-DE-MELHOR/_zyhum_nw.html', 'utf8');
analyze('MIMO NW', mimoHtml, mimoData);
analyze('ZYHUM NW', zyhumHtml, zyhumData);

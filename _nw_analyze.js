const fs = require('fs');

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

function analyze(label, htmlPath, dataPath) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const html = fs.readFileSync(htmlPath, 'utf8');
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log('\n====', label, 'words', words, 'target', data.metrics?.word_count?.target, '====');
  console.log('-- BASIC --');
  for (const x of data.terms.content_basic) {
    const c = countWB(html, x.t);
    const [lo, hi] = x.sugg_usage;
    const flag = c < lo ? 'LOW' : c > hi ? 'HIGH' : 'OK';
    console.log(flag, JSON.stringify(x.t), c + '/' + lo + '-' + hi, 'pc', x.usage_pc);
  }
  console.log('-- EXTENDED miss (usage 0 in content) by pc --');
  const misses = [];
  for (const x of data.terms.content_extended) {
    const c = countWB(html, x.t);
    const [lo, hi] = x.sugg_usage;
    if (c < lo) misses.push({ t: x.t, pc: x.usage_pc, c, lo, hi });
  }
  misses.sort((a, b) => b.pc - a.pc);
  for (const m of misses.slice(0, 40)) {
    console.log('MISS', m.pc, JSON.stringify(m.t), 'have', m.c, 'want', m.lo + '-' + m.hi);
  }
  console.log('total misses', misses.length);
}

analyze(
  'MIMO',
  '_mimo_cur.html',
  'C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/5d06ac26-5758-4ce6-b675-ad552b0916c1.txt'
);
analyze(
  'ZYHUM',
  '_zyhum_cur.html',
  'C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/f0b6f50f-c450-4491-ba1a-fcdd7d72c585.txt'
);

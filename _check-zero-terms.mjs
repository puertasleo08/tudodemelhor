import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = JSON.parse(fs.readFileSync(path.join(__dirname, '_nw-final-args.json'), 'utf8'));
const queryData = JSON.parse(fs.readFileSync('C:/Users/leo/.cursor/projects/c-Users-leo-OneDrive-Desktop-TUDO-DE-MELHOR/agent-tools/25e2afd7-f80c-473b-97e2-2bb6e2f5061f.txt', 'utf8'));

const text = args.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();

function countTerm(term) {
  const t = term.toLowerCase();
  let count = 0;
  let pos = 0;
  while (true) {
    const i = text.indexOf(t, pos);
    if (i === -1) break;
    count++;
    pos = i + t.length;
  }
  return count;
}

const sections = ['content_basic', 'content_extended', 'h1', 'h2', 'title', 'desc'];
const zero = new Set();

for (const section of sections) {
  const list = queryData.terms?.[section] || [];
  for (const item of list) {
    const term = item.t;
    if (countTerm(term) === 0) zero.add(term);
  }
}

console.log(JSON.stringify([...zero].sort(), null, 0));

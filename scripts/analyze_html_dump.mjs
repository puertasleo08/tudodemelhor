import { readFileSync } from 'fs';

const file = process.argv[2];
const t = readFileSync(file, 'utf8');
const ids = [...t.matchAll(/MLB\d{10,13}/g)].map((m) => m[0]);
const uniq = [...new Set(ids)];
console.log('MLB ids', uniq.length);
console.log(uniq.slice(0, 40).join('\n'));
const pics = [...t.matchAll(/D_[NQ]_NP_[^"'\\s<>]+/g)].map((m) => m[0]);
console.log('\npic tokens', [...new Set(pics)].length);
[...new Set(pics)].slice(0, 30).forEach((x) => console.log(x));

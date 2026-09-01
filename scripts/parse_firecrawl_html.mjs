import fs from 'fs';

const file = process.argv[2];
const needle = process.argv[3] || '';
const text = fs.readFileSync(file, 'utf8');
const re = /https:\/\/http2\.mlstatic\.com\/D_[^"'\\s]+?\.(?:webp|jpg)/g;
const urls = [...new Set(text.match(re) || [])];
const filtered = needle
  ? urls.filter((u) => u.includes(needle))
  : urls.filter((u) => /D_NQ_NP_|D_Q_NP_2X_/.test(u) && !u.includes('frontend-assets'));
console.log(filtered.join('\n'));

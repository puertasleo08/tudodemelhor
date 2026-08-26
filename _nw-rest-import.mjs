import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const payload = JSON.parse(fs.readFileSync(path.join(__dirname, '_nw-import-call.json'), 'utf8'));
const API_ENDPOINT = 'https://app.neuronwriter.com/neuron-api/0.5/writer';

// Try common env var names for NeuronWriter API key
const API_KEY = process.env.NEURONWRITER_API_KEY || process.env.NEURON_API_KEY || process.env.NW_API_KEY;

async function call(method, body) {
  const res = await fetch(`${API_ENDPOINT}/${method}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) throw new Error(`${method} HTTP ${res.status}: ${text.slice(0, 500)}`);
  return data;
}

async function main() {
  if (!API_KEY) {
    console.error('NO_API_KEY');
    process.exit(2);
  }
  const importResult = await call('import-content', {
    query: payload.query,
    title: payload.title,
    description: payload.description,
    html: payload.html,
  });
  console.log('IMPORT', JSON.stringify(importResult));
  const evalResult = await call('evaluate-content', {
    query: payload.query,
    html: payload.html,
    title: payload.title,
    description: payload.description,
  });
  console.log('EVAL', JSON.stringify(evalResult));
  const score = evalResult.content_score ?? importResult.content_score;
  if (score >= 85) {
    const done = await call('mark-content-as-done', { query: payload.query });
    console.log('DONE', JSON.stringify(done));
    console.log('MARK_CALLED yes');
  } else {
    console.log('MARK_CALLED no');
  }
  console.log('FINAL_SCORE', score);
}

main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });

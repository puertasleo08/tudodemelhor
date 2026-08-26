import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'file:///C:/Users/leo/AppData/Local/Programs/cursor/resources/app/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StreamableHTTPClientTransport } from 'file:///C:/Users/leo/AppData/Local/Programs/cursor/resources/app/node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = JSON.parse(fs.readFileSync(path.join(__dirname, '_nw-final-args.json'), 'utf8'));

const transport = new StreamableHTTPClientTransport(new URL('https://app.neuronwriter.com/mcp/http'));
const client = new Client({ name: 'nw-import', version: '1.0.0' });

async function callTool(name, toolArgs) {
  const result = await client.callTool({ name, arguments: toolArgs });
  const text = result.content?.find((c) => c.type === 'text')?.text ?? JSON.stringify(result);
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, result };
  }
}

async function main() {
  console.log('HTML_LEN', args.html.length);
  await client.connect(transport);

  const imp = await callTool('import-content', {
    query: args.query,
    title: args.title,
    description: args.description,
    html: args.html,
  });
  console.log('IMPORT', JSON.stringify(imp));

  const ev = await callTool('evaluate-content', {
    query: args.query,
    title: args.title,
    description: args.description,
    html: args.html,
  });
  console.log('EVAL', JSON.stringify(ev));

  const score = ev.content_score ?? imp.content_score;
  console.log('FINAL_SCORE', score);

  if (score >= 85) {
    const done = await callTool('mark-content-as-done', { query: args.query });
    console.log('DONE', JSON.stringify(done));
  }

  await client.close();
}

main().catch((e) => {
  console.error('ERROR', e.message);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = JSON.parse(fs.readFileSync(path.join(__dirname, '_nw-final-args.json'), 'utf8'));

// Emit args for agent MCP call verification
console.log(JSON.stringify({
  step: 'ready',
  htmlLength: args.html.length,
  query: args.query,
  title: args.title,
}));

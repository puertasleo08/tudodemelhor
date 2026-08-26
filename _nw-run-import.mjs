import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = JSON.parse(fs.readFileSync(path.join(__dirname, '_nw-final-args.json'), 'utf8'));

// Write args for external MCP caller (html inline in JSON)
fs.writeFileSync(path.join(__dirname, '_nw-mcp-import.json'), JSON.stringify({
  namespace: 'user-neuronwriter',
  toolName: 'import-content',
  arguments: args,
}));

console.log('HTML_LENGTH', args.html.length);
console.log('QUERY', args.query);

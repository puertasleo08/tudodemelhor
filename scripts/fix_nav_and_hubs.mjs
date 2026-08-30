import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DESKTOP_LINK = `\n        <a href="melhores-bicicletas-eletricas.html" class="transition hover:text-white">Bicicletas Elétricas</a>`;
const MOBILE_LINK = `\n        <a href="melhores-bicicletas-eletricas.html" class="rounded-lg px-3 py-3 text-brand-muted hover:bg-white/5 hover:text-white">Bicicletas Elétricas</a>`;

let cleaned = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith(".html") || f.startsWith("_") || f.startsWith(".")) continue;
  const p = path.join(ROOT, f);
  let c = fs.readFileSync(p, "utf8");
  const before = c;
  c = c.replaceAll(DESKTOP_LINK, "");
  c = c.replaceAll(MOBILE_LINK, "");
  if (c !== before) {
    fs.writeFileSync(p, c);
    cleaned++;
  }
}
console.log(`Header cleaned in ${cleaned} files`);

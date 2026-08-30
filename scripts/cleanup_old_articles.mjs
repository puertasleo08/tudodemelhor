import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = [
  "melhores-marcas-de-ar-condicionado-2026.html",
  "qual-e-o-melhor-travesseiro-para-dormir.html",
];

for (const f of FILES) {
  const filePath = path.join(ROOT, f);
  let content = fs.readFileSync(filePath, "utf8");
  const start = content.indexOf(
    '<div class="mx-auto max-w-6xl space-y-6 px-4 pb-12">'
  );
  const end = content.indexOf(
    '<section class="py-12" id="como-escolher">',
    start
  );
  if (start === -1 || end === -1) {
    console.log(`SKIP ${f}: markers not found (${start}, ${end})`);
    continue;
  }
  content = content.slice(0, start) + content.slice(end);
  fs.writeFileSync(filePath, content);
  console.log(`CLEANED ${f}`);
}

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/i18n/slugTranslations.ts');
let content = fs.readFileSync(file, 'utf8');

// Match the toolNames object
const match = content.match(/export const toolNames: Record<string, Record<string, string>> = (\{[\s\S]*?\n\});\n/);
if (!match) {
  console.error("Could not find toolNames");
  process.exit(1);
}

const toolNamesStr = match[1];
const toolNames = eval('(' + toolNamesStr + ')');

function createSlug(text) {
  return text
    .toLowerCase()
    // Allow unicode letters/numbers
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

const toolSlugs = {};
for (const id of Object.keys(toolNames)) {
  toolSlugs[id] = {};
  for (const lang of Object.keys(toolNames[id])) {
    toolSlugs[id][lang] = createSlug(toolNames[id][lang]);
  }
}

const newToolSlugsStr = 'export const toolSlugs: Record<string, Record<string, string>> = ' + JSON.stringify(toolSlugs, null, 2) + ';\n';

content = content.replace(/export const toolSlugs: Record<string, Record<string, string>> = \{[\s\S]*?\};\n/, newToolSlugsStr);

fs.writeFileSync(file, content);
console.log("Fixed slugs successfully!");

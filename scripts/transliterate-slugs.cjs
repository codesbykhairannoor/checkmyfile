const fs = require('fs');
const path = require('path');
const { slugify } = require('transliteration');

const file = path.join(__dirname, '../src/i18n/slugTranslations.ts');
let content = fs.readFileSync(file, 'utf8');

const match = content.match(/export const toolNames: Record<string, Record<string, string>> = (\{[\s\S]*?\n\});\n/);
if (!match) {
  console.error("Could not find toolNames");
  process.exit(1);
}

const toolNames = eval('(' + match[1] + ')');

const jaOverrides = {
  'merge-pdf': 'pdf-ketsugo',
  'edit-pdf': 'pdf-henshu',
  'split-pdf': 'pdf-bunkatsu',
  'rotate-pdf': 'pdf-kaiten',
  'page-numbers': 'peji-bango',
  'watermark-pdf': 'pdf-sukashi',
  'remove-pdf': 'peji-sakujo',
  'organize-pdf': 'pdf-seiri',
  'crop-pdf': 'pdf-torimingu',
  'sign-pdf': 'pdf-shomei',
  'protect-pdf': 'pdf-hogo',
  'unlock-pdf': 'pdf-kaijo',
  'extract-images-pdf': 'gazo-chushutsu',
  'grayscale-pdf': 'guresukeru-pdf',
  'scan-to-pdf': 'sukyan-to-pdf',
  'remove-pdf-metadata': 'metadeta-sakujo',
  'compare-pdf': 'pdf-hikaku',
  'redact-pdf': 'pdf-suminuri',
  'reverse-pdf': 'pdf-hanten',
  'resize-pdf': 'pdf-risaizu',
  'word-to-pdf': 'word-kara-pdf',
  'excel-to-pdf': 'excel-kara-pdf',
  'ppt-to-pdf': 'ppt-kara-pdf',
  'txt-to-pdf': 'txt-kara-pdf',
  'pdf-to-word': 'pdf-kara-word',
  'pdf-to-ppt': 'pdf-kara-ppt',
  'csv-to-excel': 'csv-kara-excel',
  'excel-to-csv': 'excel-kara-csv',
  'image-to-pdf': 'gazo-kara-pdf',
  'pdf-to-image': 'pdf-kara-gazo',
  'compress-pdf': 'pdf-asshuku',
  'ocr-pdf': 'ocr-pdf'
};

const toolSlugs = {};
for (const id of Object.keys(toolNames)) {
  toolSlugs[id] = {};
  for (const lang of Object.keys(toolNames[id])) {
    let slug = '';
    if (lang === 'ja' && jaOverrides[id]) {
      slug = jaOverrides[id];
    } else {
      slug = slugify(toolNames[id][lang]);
    }
    toolSlugs[id][lang] = slug;
  }
}

const newToolSlugsStr = 'export const toolSlugs: Record<string, Record<string, string>> = ' + JSON.stringify(toolSlugs, null, 2) + ';\n';
content = content.replace(/export const toolSlugs: Record<string, Record<string, string>> = \{[\s\S]*?\};\n/, newToolSlugsStr);

fs.writeFileSync(file, content);
console.log("Transliterated slugs successfully!");

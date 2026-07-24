const fs = require('fs');

const code = fs.readFileSync('src/scripts/translate_ui.cjs', 'utf8');

const baseUIMatch = code.match(/const baseUI = (\{[\s\S]*?\n\});/);
const baseUIString = baseUIMatch[1];
const baseUI = eval('(' + baseUIString + ')');
const keys = Object.keys(baseUI);

let cache = {};
if (fs.existsSync('src/scripts/translate_cache.json')) {
  cache = JSON.parse(fs.readFileSync('src/scripts/translate_cache.json', 'utf8'));
}

const targetLanguages = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'hu', 'no', 'ro', 'uk', 'ms', 'tl'
];

const result = {};

for (const lang of targetLanguages) {
  result[lang] = {};
  for (const k of keys) {
    if (lang === 'id') {
      result[lang][k] = baseUI[k];
    } else {
      if (cache[lang] && cache[lang][k]) {
        result[lang][k] = cache[lang][k];
      } else {
        result[lang][k] = baseUI[k]; // Fallback to id temporarily
      }
    }
  }
}

const tsContent = "// Auto-generated Editor Translations\n" +
"export const editorTranslations: Record<string, Record<string, string>> = " + JSON.stringify(result, null, 2) + ";\n";

fs.writeFileSync('src/i18n/editorTranslations.ts', tsContent);
console.log('Saved editorTranslations.ts from cache for all 30 languages');

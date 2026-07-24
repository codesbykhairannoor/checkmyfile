const fs = require('fs');

const code = fs.readFileSync('src/scripts/translate_ui.cjs', 'utf8');
const baseUIMatch = code.match(/const baseUI = (\{[\s\S]*?\n\});/);
const baseUIString = baseUIMatch[1];
const baseUI = eval('(' + baseUIString + ')');
const keys = Object.keys(baseUI);

const existingContent = fs.readFileSync('src/i18n/editorTranslations.ts', 'utf8');
const existingObjStr = existingContent.replace('export const editorTranslations: Record<string, Record<string, string>> = ', '').replace(/;\s*$/, '');
const existing = eval('(' + existingObjStr + ')');

const newResult = {
  id: baseUI,
  en: existing['en']
};

if (existing['es'] && existing['es']["Gabungkan Sekarang"] !== "Gabungkan Sekarang") {
  newResult['es'] = existing['es'];
}

const tsContent = "// Auto-generated Editor Translations\n" +
  "export const editorTranslations: Record<string, Record<string, string>> = " + JSON.stringify(newResult, null, 2) + ";\n";
fs.writeFileSync('src/i18n/editorTranslations.ts', tsContent);
console.log('Cleaned editorTranslations.ts');

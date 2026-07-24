const fs = require('fs');
let code = fs.readFileSync('src/scripts/translate_ui.cjs', 'utf8');

// The original script ends with:
// fs.writeFileSync('src/i18n/editorTranslations.ts', fileContent);

// We replace that with nothing:
code = code.replace(
  /const fileContent = `export const editorTranslations[\s\S]*fs\.writeFileSync\('src\/i18n\/editorTranslations\.ts', fileContent\);/,
  ''
);

// We find the line where editorTranslations is assigned
code = code.replace(
  /editorTranslations\[lang\] = translatedUI;/,
  `editorTranslations[lang] = translatedUI;\n    const fileContent = \`export const editorTranslations: Record<string, Record<string, string>> = \${JSON.stringify(editorTranslations, null, 2)};\\n\`;\n    fs.writeFileSync('src/i18n/editorTranslations.ts', fileContent);\n    console.log('Saved incremental translation for ' + lang);`
);

fs.writeFileSync('src/scripts/translate_ui_incremental.cjs', code);
console.log('Created better incremental script');

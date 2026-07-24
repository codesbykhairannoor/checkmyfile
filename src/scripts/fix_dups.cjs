const fs = require('fs');
const path = './src/i18n/editorTranslations.ts';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// 0-indexed, so line 185 is index 184
lines.splice(452, 1);
lines.splice(184, 1);

fs.writeFileSync(path, lines.join('\n'));
console.log('Deleted lines 185 and 453');

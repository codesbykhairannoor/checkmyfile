const fs = require('fs');

const file = 'src/i18n/translations.ts';
let content = fs.readFileSync(file, 'utf8');

// Match `pageAboutSec3Desc: '` followed by anything until an unescaped apostrophe, then match anything until the next comma at the end of the line.
// We'll replace it with just the key and the matched translation string, plus the comma.
content = content.replace(/(pageAboutSec3Desc:\s*'.*?(?<!\\)')([^,\n]*),/g, "$1,");

fs.writeFileSync(file, content);
console.log('Fixed syntax errors');

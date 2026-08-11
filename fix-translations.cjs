const fs = require('fs');
let c = fs.readFileSync('src/i18n/translations.ts', 'utf8');
c = c.replace(/\\",/g, '",');
fs.writeFileSync('src/i18n/translations.ts', c);

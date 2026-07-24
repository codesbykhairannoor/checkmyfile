const fs = require('fs');
const path = './src/i18n/editorTranslations.ts';
let content = fs.readFileSync(path, 'utf8');

// Remove the duplicates injected at the top
content = content.replace('    "Ukuran Tanda Tangan": "Ukuran Tanda Tangan",\n', '');
content = content.replace('    "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.": "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.",\n', '');

content = content.replace('    "Ukuran Tanda Tangan": "Signature Size",\n', '');
content = content.replace('    "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.": "Click on the page in Live Preview to place the signature, then drag to adjust.",\n', '');

fs.writeFileSync(path, content);
console.log('Fixed duplicates');

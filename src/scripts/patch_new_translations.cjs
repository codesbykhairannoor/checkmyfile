const fs = require('fs');
const path = './src/i18n/editorTranslations.ts';
let content = fs.readFileSync(path, 'utf8');

const injectEN = `
    "Sertifikat Otomatis": "Automatic Certificate",
    "Nama Penandatangan (Opsional)": "Signer Name (Optional)",
    "Gunakan P12 / PFX Pribadi": "Use Custom P12 / PFX",
    "Ukuran Tanda Tangan": "Signature Size",
    "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.": "Click on the page in Live Preview to place the signature, then drag to adjust.",`;

const injectID = `
    "Sertifikat Otomatis": "Sertifikat Otomatis",
    "Nama Penandatangan (Opsional)": "Nama Penandatangan (Opsional)",
    "Gunakan P12 / PFX Pribadi": "Gunakan P12 / PFX Pribadi",
    "Ukuran Tanda Tangan": "Ukuran Tanda Tangan",
    "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.": "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.",`;

if (!content.includes('"Sertifikat Otomatis"')) {
    content = content.replace(/("en":\s*\{)/, `$1${injectEN}`);
    content = content.replace(/("id":\s*\{)/, `$1${injectID}`);
    fs.writeFileSync(path, content);
    console.log('Patched editorTranslations.ts successfully');
} else {
    console.log('Already patched');
}

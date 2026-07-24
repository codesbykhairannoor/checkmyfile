const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('src/scripts/ast_strings.json', 'utf8'));

const knownSingleWords = ['Kiri', 'Kanan', 'Tengah', 'Bawah', 'Normal', 'Hapus', 'Teks', 'Gambar', 'Unggah', 'Warna', 'Ukuran', 'Portrait', 'Landscape', 'Otomatis', 'Arab', 'Roman', 'Alpha', 'Batal', 'Terapkan', 'Potong', 'Ekstrak', 'Sisipkan', 'Simpan'];

const filtered = raw.filter(s => {
  if (s.length <= 1) return false;
  if (/^[0-9a-fA-F]{3,6}$/.test(s)) return false;
  if (/^[0-9]+(\.[0-9]+)?(px|rem|em|%|ms|s)$/.test(s)) return false;
  if (/^rgba/.test(s)) return false;
  if (/^var\(/.test(s)) return false;
  if (/^[a-z]+(-[a-z]+)+$/.test(s)) return false;
  if (/^[0-9]+$/.test(s)) return false;
  if (s.includes('px solid')) return false;
  if (s === '||' || s === '&&' || s === '===' || s === '!==') return false;
  
  if (s.includes(' ')) return true;
  if (knownSingleWords.includes(s)) return true;
  
  return false;
});

fs.writeFileSync('src/scripts/ast_ui_strings.json', JSON.stringify(filtered, null, 2));
console.log('Filtered down to', filtered.length, 'strings');

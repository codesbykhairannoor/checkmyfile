const fs = require('fs');

const p = 'src/scripts/translate_ui.cjs';
let code = fs.readFileSync(p, 'utf8');

// The injector added strings with literal newlines inside double quotes. 
// Let's replace any double-quoted string containing a newline with a template literal string (backticks).
// Actually, it's safer to just remove the newline.
code = code.replace(/\n                Ini berarti teks dalam file hasil tidak akan bisa di-blok \(copy\/paste\), tetapi sangat cocok untuk kebutuhan cetak \(printing\) yang hemat tinta\."/g, ' Ini berarti teks dalam file hasil tidak akan bisa di-blok (copy/paste), tetapi sangat cocok untuk kebutuhan cetak (printing) yang hemat tinta."');
code = code.replace(/"Untuk memastikan akurasi konversi warna di peramban, dokumen Anda akan diubah menjadi gambar statis \(raster\) beresolusi tinggi. /g, '"Untuk memastikan akurasi konversi warna di peramban, dokumen Anda akan diubah menjadi gambar statis (raster) beresolusi tinggi.');

fs.writeFileSync(p, code);

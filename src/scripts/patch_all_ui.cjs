const fs = require('fs');
const path = require('path');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const stringsToReplace = [
  "Menganalisis Perbedaan...",
  "Bandingkan PDF Sekarang",
  "Klik untuk Unggah PDF Pembanding",
  "Mengompres...",
  "Kompres Sekarang",
  "Potong pinggiran putih pada halaman.",
  "Geser nilai di atas untuk menyesuaikan ukuran margin yang akan dipotong. Pratinjau hasil akan ditampilkan setelah Anda menekan tombol di bawah.",
  "Potong PDF Sekarang",
  "Crop Margin PDF",
  "Margin Atas",
  "Margin Bawah",
  "Margin Kiri",
  "Margin Kanan",
  "Tambahkan teks dan gambar ke dalam dokumen Anda. Geser elemen di layar pratinjau.",
  "Hapus",
  "Terapkan Editan",
  "Edit PDF",
  "Teks",
  "Gambar",
  "Konten Teks",
  "Warna",
  "Ukuran",
  "Gaya Font",
  "Memproses...",
  "Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses.",
  "Mulai Sekarang",
  "Ekstrak Semua Gambar",
  "Ekstrak Gambar",
  "Grayscale PDF",
  "Ubah warna dokumen menjadi hitam putih.",
  "Perhatian: Rasterisasi",
  "Untuk memastikan akurasi konversi warna di peramban, dokumen Anda akan diubah menjadi gambar statis (raster) beresolusi tinggi. \\n                Ini berarti teks dalam file hasil tidak akan bisa di-blok (copy/paste), tetapi sangat cocok untuk kebutuhan cetak (printing) yang hemat tinta.",
  "Ubah Jadi Hitam Putih",
  "Minimal butuh 2 file untuk digabungkan.",
  "Menggabungkan...",
  "Gabungkan Sekarang",
  "Add More",
  "Sisipkan PDF",
  "Tambahkan dokumen PDF lain ke dalam dokumen utama ini pada posisi yang Anda tentukan.",
  "Dokumen yang Akan Disisipkan",
  "Sisipkan Setelah Halaman:",
  "Pilih File PDF Kedua...",
  "Paling Awal (0)",
  "Terapkan Sisipan",
  "Top Center",
  "Top Right",
  "Bottom Center",
  "Bottom Right",
  "Menyimpan...",
  "Terapkan Penomoran",
  "Pilih format gambar yang ingin dihasilkan. Setiap halaman PDF akan diubah menjadi gambar berkualitas tinggi.",
  "Kualitas Terbaik",
  "Ukuran Kecil",
  "Ekstrak Gambar Sekarang",
  "Kunci PDF",
  "Lindungi dokumen PDF Anda dari akses tidak sah. Semua proses enkripsi dilakukan secara lokal di perangkat Anda.",
  "Kata Sandi Baru",
  "Konfirmasi Kata Sandi",
  "Kata sandi tidak cocok.",
  "*Simpan kata sandi ini baik-baik. File yang terkunci tidak bisa dibuka jika Anda lupa kata sandinya.",
  "Kunci Dokumen",
  "Sensor Dokumen (Redact)",
  "Tutup informasi rahasia dengan blok hitam permanen.",
  "Tambah Area Sensor (Halaman 1)",
  "Geser kotak di bagian Pratinjau (Kiri) ke teks yang ingin disensor. Tarik sudut kanan-bawah kotak untuk memperbesar.",
  "Gaya Sensor",
  "Blok Hitam",
  "Efek Blur",
  "Tampilkan Ikon Gembok (Keren)",
  "Proses ini menggunakan",
  "Rasterisasi Penuh",
  ". Teks asli yang tertutup akan hancur sepenuhnya dari kode sumber PDF, sehingga mustahil untuk dipulihkan oleh",
  "hacker",
  "Bersihkan Jejak Digital (Metadata)",
  "Alat ini akan menghapus semua properti tersembunyi dari PDF Anda secara permanen.",
  "Data yang akan dihapus:",
  "Nama Pembuat Dokumen (Author)",
  "Aplikasi Pembuat (Creator/Producer)",
  "Tanggal Pembuatan & Modifikasi",
  "Judul dan Subjek Dokumen",
  "Kata Kunci Tersembunyi (Keywords)",
  "Membersihkan Metadata...",
  "Hapus Metadata Sekarang",
  "Menghapus...",
  "Hapus Sekarang",
  "Resize PDF",
  "Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli.",
  "Ukuran Kertas Target",
  "A4 (210 x 297 mm)",
  "A3 (297 x 420 mm)",
  "Letter (8.5 x 11 in)",
  "Legal (8.5 x 14 in)",
  "Orientasi",
  "Otomatis (Sesuai Asli)",
  "Portrait (Tegak)",
  "Landscape (Mendatar)",
  "Tambah Margin Putih",
  "Tanpa Margin (0px)",
  "Margin Kecil (15px)",
  "Margin Normal (30px)",
  "Margin Besar (60px)",
  "Ubah Ukuran",
  "Reverse PDF",
  "Urutan halaman PDF Anda akan dibalik dari belakang ke depan (contoh: dari 1-2-3 menjadi 3-2-1). Tidak ada konfigurasi tambahan yang diperlukan.",
  "Balikkan Urutan",
  "-90° (Kiri)",
  "+90° (Kanan)",
  "180° (Putar Balik)",
  "0° (Normal)",
  "Rasterize PDF (Jadikan Permanen)",
  "Sistem akan menggambar ulang setiap teks dan komponen PDF menjadi gambar statis beresolusi tinggi, membuat dokumen ini 100% aman dari proses pengeditan atau salin-tempel.",
  "File PDF hasil pemrosesan akan memiliki ukuran sedikit lebih besar karena semua teks diubah menjadi gambar, namun ini adalah cara paling efektif untuk mencegah pemalsuan dokumen.",
  "Memproses Rasterisasi...",
  "Jadikan PDF Permanen Sekarang",
  "E-Sign PDF",
  "Buat tanda tangan Anda dan letakkan di posisi yang tepat pada halaman PDF.",
  "Unggah",
  "Ketebalan Tinta",
  "Unggah Tanda Tangan (PNG/JPG)",
  "Ukuran Tanda Tangan",
  "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.",
  "Terapkan Tanda Tangan",
  "Pilih Dokumen Pratinjau:",
  "Buka Kunci PDF",
  "Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda.",
  "Kata Sandi Dokumen Saat Ini",
  "*Kami tidak menyimpan atau mengirimkan kata sandi Anda ke server mana pun.",
  "Buka & Unduh Dokumen",
  "Interactive Watermark",
  "Tambahkan teks watermark kustom. Perubahan akan terlihat langsung pada layar pratinjau.",
  "Logo (Gambar)",
  "Teks Watermark",
  "Unggah Logo Watermark",
  "Terapkan Watermark"
];

// Clean newlines
const sanitizedStrings = stringsToReplace.map(s => s.replace(/\\n/g, '\n'));

files.forEach(f => {
  const p = path.join(dir, f);
  let code = fs.readFileSync(p, 'utf8');
  let originalCode = code;

  sanitizedStrings.forEach(s => {
    // Escape regex
    const escapedS = s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Replace >String<
    const regex1 = new RegExp(`>\\s*${escapedS}\\s*<`, 'g');
    code = code.replace(regex1, `>{tUi["${s}"] || "${s}"}<`);
    
    // Replace 'String' (assuming in JS context like ternary)
    const regex2 = new RegExp(`'${escapedS}'`, 'g');
    code = code.replace(regex2, `(tUi["${s}"] || "${s}")`);
    
    // Replace "String" inside tags but not imports
    const regex3 = new RegExp(`placeholder="${escapedS}"`, 'g');
    code = code.replace(regex3, `placeholder={tUi["${s}"] || "${s}"}`);
  });

  if (code !== originalCode) {
    fs.writeFileSync(p, code);
    console.log('Patched', f);
  }
});

// Update translate_ui.cjs
const uiScriptPath = 'src/scripts/translate_ui.cjs';
let uiScript = fs.readFileSync(uiScriptPath, 'utf8');

const additionalBaseUI = {};
sanitizedStrings.forEach(s => {
  additionalBaseUI[s] = s;
});

// We need to inject these into baseUI
const baseUiMatch = uiScript.match(/const baseUI = \{([\s\S]*?)\};/);
if (baseUiMatch) {
  let existingContent = baseUiMatch[1];
  let additions = [];
  sanitizedStrings.forEach(s => {
    if (!existingContent.includes(`"${s}"`)) {
      additions.push(`  "${s}": "${s}"`);
    }
  });
  if (additions.length > 0) {
    let newBaseUI = `const baseUI = {\n${existingContent.trim()},\n${additions.join(',\n')}\n};`;
    uiScript = uiScript.replace(baseUiMatch[0], newBaseUI);
    fs.writeFileSync(uiScriptPath, uiScript);
    console.log('Updated translate_ui.cjs');
  }
}

console.log('Done patching.');

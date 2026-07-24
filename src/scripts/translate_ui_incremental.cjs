const fs = require('fs');

const baseUI = {
"Interactive Compress": "Interactive Compress",
  "Pilih tingkat kompresi. Live Preview akan mensimulasikan penurunan kualitas gambar.": "Choose compression level. Live Preview will simulate image quality reduction.",
  "Extreme (Kecil)": "Extreme (Smallest)",
  "Kualitas terendah, ukuran terkecil": "Lowest quality, smallest size",
  "Balanced (Rekomendasi)": "Balanced (Recommended)",
  "Kualitas bagus, ukuran optimal": "Good quality, optimal size",
  "High (Terbaik)": "High (Best Quality)",
  "Kualitas tinggi, ukuran lumayan besar": "High quality, moderate size",
  "Kompres Sekarang": "Compress Now",
  "Rotate Pages": "Rotate Pages",
  "Split Pages": "Split Pages",
  "Extract specific pages or ranges": "Extract specific pages or ranges",
  "Split Now": "Split Now",
  "Crop Margins": "Crop Margins",
  "Remove Pages": "Remove Pages",
  "Pages to remove (e.g. 1, 3-5)": "Pages to remove (e.g. 1, 3-5)",
  "Delete Pages": "Delete Pages",
  "Add Watermark": "Add Watermark",
  "Page Numbers": "Page Numbers",
  "Ganti Dokumen": "Change Document",
  "Process Document": "Process Document",
  "Start Processing": "Start Processing",
  "Download": "Download",
  "Convert Document": "Convert Document",
  "Organize Pages": "Organize Pages",
  "Security & Extras": "Security & Extras",
  "Edit & Sign": "Edit & Sign",
  
  "Interactive Split": "Interactive Split",
  "Ketik rentang halaman yang ingin Anda potong/ekstrak.": "Enter the page range you want to split/extract.",
  "Rentang Halaman (Contoh: 1-3, 5, 8)": "Page Range (Example: 1-3, 5, 8)",
  "Halaman yang masuk dalam rentang ini akan ditandai dengan label \"EXTRACT\" berwarna hijau pada Live Preview di sebelah kiri.": "Pages in this range will be marked with a green \"EXTRACT\" label in the Live Preview on the left.",
  "Potong Sekarang": "Split Now",
  
  "Gabungkan Sekarang": "Merge Now",
  "Gabungkan Skearang": "Merge Now",
  "Pilih Dokumen Pratinjau:": "Select Preview Document:",
  "Interactive Merge": "Interactive Merge",
  "Atur urutan file PDF di bawah dengan menggeser (Drag & Drop) kartu dokumen.": "Arrange the PDF file order below by Drag & Drop the document cards.",
  
  "Interactive Rotate": "Interactive Rotate",
  "Putar orientasi dokumen Anda. Perubahan akan terlihat langsung pada layar pratinjau.": "Rotate your document orientation. Changes will be instantly visible on the preview screen.",
  "Rotasi Cepat": "Quick Rotation",
  "Derajat Khusus": "Custom Degrees",
  "Terapkan Rotasi": "Apply Rotation",
  "Kiri": "Left",
  "Kanan": "Right",
  "Tengah": "Center",
  "Bawah": "Bottom",
  
  "Document Navigation": "Document Navigation",
  "Pilih halaman untuk melompat": "Select page to jump",
  
  "Interactive Page Numbers": "Interactive Page Numbers",
  "Atur posisi penomoran halaman. Angka akan muncul secara *real-time* di kanvas.": "Set page numbering position. Numbers will appear in *real-time* on the canvas.",
  "Pilih Posisi Angka": "Select Number Position",
  "Gaya Penomoran": "Numbering Style",
  "Format Teks": "Text Format",
  "Mulai di Halaman": "Start at Page",
  "Angka Awal": "Starting Number",
  "Terapkan Penomoran": "Apply Page Numbers",
  
  "Hapus Halaman": "Remove Pages",
  "Ketik rentang atau nomor halaman yang ingin Anda hapus secara permanen.": "Enter the page range or numbers you want to permanently delete.",
  "Halaman yang Dihapus (Contoh: 1, 3-5)": "Pages to Delete (Example: 1, 3-5)",
  "Halaman yang masuk dalam rentang ini akan ditandai dengan label merah \"HAPUS\" di Live Preview.": "Pages in this range will be marked with a red \"DELETE\" label in the Live Preview.",
  "Hapus Sekarang": "Delete Now",
  "Menganalisis Perbedaan...": "Menganalisis Perbedaan...",
  "Bandingkan PDF Sekarang": "Bandingkan PDF Sekarang",
  "Klik untuk Unggah PDF Pembanding": "Klik untuk Unggah PDF Pembanding",
  "Mengompres...": "Mengompres...",
  "Potong pinggiran putih pada halaman.": "Potong pinggiran putih pada halaman.",
  "Geser nilai di atas untuk menyesuaikan ukuran margin yang akan dipotong. Pratinjau hasil akan ditampilkan setelah Anda menekan tombol di bawah.": "Geser nilai di atas untuk menyesuaikan ukuran margin yang akan dipotong. Pratinjau hasil akan ditampilkan setelah Anda menekan tombol di bawah.",
  "Potong PDF Sekarang": "Potong PDF Sekarang",
  "Crop Margin PDF": "Crop Margin PDF",
  "Margin Atas": "Margin Atas",
  "Margin Bawah": "Margin Bawah",
  "Margin Kiri": "Margin Kiri",
  "Margin Kanan": "Margin Kanan",
  "Tambahkan teks dan gambar ke dalam dokumen Anda. Geser elemen di layar pratinjau.": "Tambahkan teks dan gambar ke dalam dokumen Anda. Geser elemen di layar pratinjau.",
  "Hapus": "Hapus",
  "Terapkan Editan": "Terapkan Editan",
  "Edit PDF": "Edit PDF",
  "Teks": "Teks",
  "Gambar": "Gambar",
  "Konten Teks": "Konten Teks",
  "Warna": "Warna",
  "Ukuran": "Ukuran",
  "Gaya Font": "Gaya Font",
  "Memproses...": "Memproses...",
  "Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses.": "Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses.",
  "Mulai Sekarang": "Mulai Sekarang",
  "Ekstrak Semua Gambar": "Ekstrak Semua Gambar",
  "Ekstrak Gambar": "Ekstrak Gambar",
  "Grayscale PDF": "Grayscale PDF",
  "Ubah warna dokumen menjadi hitam putih.": "Ubah warna dokumen menjadi hitam putih.",
  "Perhatian: Rasterisasi": "Perhatian: Rasterisasi",
  "Untuk memastikan akurasi konversi warna di peramban, dokumen Anda akan diubah menjadi gambar statis (raster) beresolusi tinggi. Ini berarti teks dalam file hasil tidak akan bisa di-blok (copy/paste), tetapi sangat cocok untuk kebutuhan cetak (printing) yang hemat tinta.": "Untuk memastikan akurasi konversi warna di peramban, dokumen Anda akan diubah menjadi gambar statis (raster) beresolusi tinggi. Ini berarti teks dalam file hasil tidak akan bisa di-blok (copy/paste), tetapi sangat cocok untuk kebutuhan cetak (printing) yang hemat tinta.",
  "Ubah Jadi Hitam Putih": "Ubah Jadi Hitam Putih",
  "Minimal butuh 2 file untuk digabungkan.": "Minimal butuh 2 file untuk digabungkan.",
  "Menggabungkan...": "Menggabungkan...",
  "Add More": "Add More",
  "Sisipkan PDF": "Sisipkan PDF",
  "Tambahkan dokumen PDF lain ke dalam dokumen utama ini pada posisi yang Anda tentukan.": "Tambahkan dokumen PDF lain ke dalam dokumen utama ini pada posisi yang Anda tentukan.",
  "Dokumen yang Akan Disisipkan": "Dokumen yang Akan Disisipkan",
  "Sisipkan Setelah Halaman:": "Sisipkan Setelah Halaman:",
  "Pilih File PDF Kedua...": "Pilih File PDF Kedua...",
  "Paling Awal (0)": "Paling Awal (0)",
  "Terapkan Sisipan": "Terapkan Sisipan",
  "Top Center": "Top Center",
  "Top Right": "Top Right",
  "Bottom Center": "Bottom Center",
  "Bottom Right": "Bottom Right",
  "Menyimpan...": "Menyimpan...",
  "Pilih format gambar yang ingin dihasilkan. Setiap halaman PDF akan diubah menjadi gambar berkualitas tinggi.": "Pilih format gambar yang ingin dihasilkan. Setiap halaman PDF akan diubah menjadi gambar berkualitas tinggi.",
  "Kualitas Terbaik": "Kualitas Terbaik",
  "Ukuran Kecil": "Ukuran Kecil",
  "Ekstrak Gambar Sekarang": "Ekstrak Gambar Sekarang",
  "Kunci PDF": "Kunci PDF",
  "Lindungi dokumen PDF Anda dari akses tidak sah. Semua proses enkripsi dilakukan secara lokal di perangkat Anda.": "Lindungi dokumen PDF Anda dari akses tidak sah. Semua proses enkripsi dilakukan secara lokal di perangkat Anda.",
  "Kata Sandi Baru": "Kata Sandi Baru",
  "Konfirmasi Kata Sandi": "Konfirmasi Kata Sandi",
  "Kata sandi tidak cocok.": "Kata sandi tidak cocok.",
  "*Simpan kata sandi ini baik-baik. File yang terkunci tidak bisa dibuka jika Anda lupa kata sandinya.": "*Simpan kata sandi ini baik-baik. File yang terkunci tidak bisa dibuka jika Anda lupa kata sandinya.",
  "Kunci Dokumen": "Kunci Dokumen",
  "Sensor Dokumen (Redact)": "Sensor Dokumen (Redact)",
  "Tutup informasi rahasia dengan blok hitam permanen.": "Tutup informasi rahasia dengan blok hitam permanen.",
  "Tambah Area Sensor (Halaman 1)": "Tambah Area Sensor (Halaman 1)",
  "Geser kotak di bagian Pratinjau (Kiri) ke teks yang ingin disensor. Tarik sudut kanan-bawah kotak untuk memperbesar.": "Geser kotak di bagian Pratinjau (Kiri) ke teks yang ingin disensor. Tarik sudut kanan-bawah kotak untuk memperbesar.",
  "Gaya Sensor": "Gaya Sensor",
  "Blok Hitam": "Blok Hitam",
  "Efek Blur": "Efek Blur",
  "Tampilkan Ikon Gembok (Keren)": "Tampilkan Ikon Gembok (Keren)",
  "Proses ini menggunakan": "Proses ini menggunakan",
  "Rasterisasi Penuh": "Rasterisasi Penuh",
  ". Teks asli yang tertutup akan hancur sepenuhnya dari kode sumber PDF, sehingga mustahil untuk dipulihkan oleh": ". Teks asli yang tertutup akan hancur sepenuhnya dari kode sumber PDF, sehingga mustahil untuk dipulihkan oleh",
  "hacker": "hacker",
  "Bersihkan Jejak Digital (Metadata)": "Bersihkan Jejak Digital (Metadata)",
  "Alat ini akan menghapus semua properti tersembunyi dari PDF Anda secara permanen.": "Alat ini akan menghapus semua properti tersembunyi dari PDF Anda secara permanen.",
  "Data yang akan dihapus:": "Data yang akan dihapus:",
  "Nama Pembuat Dokumen (Author)": "Nama Pembuat Dokumen (Author)",
  "Aplikasi Pembuat (Creator/Producer)": "Aplikasi Pembuat (Creator/Producer)",
  "Tanggal Pembuatan & Modifikasi": "Tanggal Pembuatan & Modifikasi",
  "Judul dan Subjek Dokumen": "Judul dan Subjek Dokumen",
  "Kata Kunci Tersembunyi (Keywords)": "Kata Kunci Tersembunyi (Keywords)",
  "Membersihkan Metadata...": "Membersihkan Metadata...",
  "Hapus Metadata Sekarang": "Hapus Metadata Sekarang",
  "Menghapus...": "Menghapus...",
  "Resize PDF": "Resize PDF",
  "Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli.": "Ubah ukuran kertas PDF Anda dan tambahkan margin tanpa memotong konten asli.",
  "Ukuran Kertas Target": "Ukuran Kertas Target",
  "A4 (210 x 297 mm)": "A4 (210 x 297 mm)",
  "A3 (297 x 420 mm)": "A3 (297 x 420 mm)",
  "Letter (8.5 x 11 in)": "Letter (8.5 x 11 in)",
  "Legal (8.5 x 14 in)": "Legal (8.5 x 14 in)",
  "Orientasi": "Orientasi",
  "Otomatis (Sesuai Asli)": "Otomatis (Sesuai Asli)",
  "Portrait (Tegak)": "Portrait (Tegak)",
  "Landscape (Mendatar)": "Landscape (Mendatar)",
  "Tambah Margin Putih": "Tambah Margin Putih",
  "Tanpa Margin (0px)": "Tanpa Margin (0px)",
  "Margin Kecil (15px)": "Margin Kecil (15px)",
  "Margin Normal (30px)": "Margin Normal (30px)",
  "Margin Besar (60px)": "Margin Besar (60px)",
  "Ubah Ukuran": "Ubah Ukuran",
  "Reverse PDF": "Reverse PDF",
  "Urutan halaman PDF Anda akan dibalik dari belakang ke depan (contoh: dari 1-2-3 menjadi 3-2-1). Tidak ada konfigurasi tambahan yang diperlukan.": "Urutan halaman PDF Anda akan dibalik dari belakang ke depan (contoh: dari 1-2-3 menjadi 3-2-1). Tidak ada konfigurasi tambahan yang diperlukan.",
  "Balikkan Urutan": "Balikkan Urutan",
  "-90° (Kiri)": "-90° (Kiri)",
  "+90° (Kanan)": "+90° (Kanan)",
  "180° (Putar Balik)": "180° (Putar Balik)",
  "0° (Normal)": "0° (Normal)",
  "Rasterize PDF (Jadikan Permanen)": "Rasterize PDF (Jadikan Permanen)",
  "Sistem akan menggambar ulang setiap teks dan komponen PDF menjadi gambar statis beresolusi tinggi, membuat dokumen ini 100% aman dari proses pengeditan atau salin-tempel.": "Sistem akan menggambar ulang setiap teks dan komponen PDF menjadi gambar statis beresolusi tinggi, membuat dokumen ini 100% aman dari proses pengeditan atau salin-tempel.",
  "File PDF hasil pemrosesan akan memiliki ukuran sedikit lebih besar karena semua teks diubah menjadi gambar, namun ini adalah cara paling efektif untuk mencegah pemalsuan dokumen.": "File PDF hasil pemrosesan akan memiliki ukuran sedikit lebih besar karena semua teks diubah menjadi gambar, namun ini adalah cara paling efektif untuk mencegah pemalsuan dokumen.",
  "Memproses Rasterisasi...": "Memproses Rasterisasi...",
  "Jadikan PDF Permanen Sekarang": "Jadikan PDF Permanen Sekarang",
  "E-Sign PDF": "E-Sign PDF",
  "Buat tanda tangan Anda dan letakkan di posisi yang tepat pada halaman PDF.": "Buat tanda tangan Anda dan letakkan di posisi yang tepat pada halaman PDF.",
  "Unggah": "Unggah",
  "Ketebalan Tinta": "Ketebalan Tinta",
  "Unggah Tanda Tangan (PNG/JPG)": "Unggah Tanda Tangan (PNG/JPG)",
  "Ukuran Tanda Tangan": "Ukuran Tanda Tangan",
  "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.": "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi.",
  "Terapkan Tanda Tangan": "Terapkan Tanda Tangan",
  "Buka Kunci PDF": "Buka Kunci PDF",
  "Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda.": "Hapus kata sandi dari dokumen PDF Anda secara permanen. Proses dekripsi dilakukan 100% di browser Anda.",
  "Kata Sandi Dokumen Saat Ini": "Kata Sandi Dokumen Saat Ini",
  "*Kami tidak menyimpan atau mengirimkan kata sandi Anda ke server mana pun.": "*Kami tidak menyimpan atau mengirimkan kata sandi Anda ke server mana pun.",
  "Buka & Unduh Dokumen": "Buka & Unduh Dokumen",
  "Interactive Watermark": "Interactive Watermark",
  "Tambahkan teks watermark kustom. Perubahan akan terlihat langsung pada layar pratinjau.": "Tambahkan teks watermark kustom. Perubahan akan terlihat langsung pada layar pratinjau.",
  "Logo (Gambar)": "Logo (Gambar)",
  "Teks Watermark": "Teks Watermark",
  "Unggah Logo Watermark": "Unggah Logo Watermark",
  "Terapkan Watermark": "Terapkan Watermark",
  "Bandingkan 2 PDF": "Bandingkan 2 PDF",
  "Pilih file kedua (File Pembanding). Sistem akan menyorot setiap perbedaan piksel atau huruf dengan warna merah.": "Pilih file kedua (File Pembanding). Sistem akan menyorot setiap perbedaan piksel atau huruf dengan warna merah.",
  "Pilih File Pembanding (Revisi)": "Pilih File Pembanding (Revisi)",
  "Ukuran Asli:": "Ukuran Asli:",
  "Estimasi Hasil:": "Estimasi Hasil:",
  "Pengaturan Margin (%)": "Pengaturan Margin (%)",
  "Double click to edit": "Double click to edit",
  "Helvetica Normal": "Helvetica Normal",
  "Helvetica Bold": "Helvetica Bold",
  "Lebar (%)": "Lebar (%)",
  "Tinggi (%)": "Tinggi (%)",
  "Ambil semua foto dari dalam dokumen.": "Ambil semua foto dari dalam dokumen.",
  "Bagaimana cara kerjanya?": "Bagaimana cara kerjanya?",
  "Alat ini akan memindai seluruh dokumen PDF Anda untuk mencari file gambar asli (seperti foto atau ilustrasi) yang tertanam di dalamnya. Semua gambar yang ditemukan akan dikumpulkan secara otomatis ke dalam satu file ZIP tanpa mengurangi kualitas aslinya.": "Alat ini akan memindai seluruh dokumen PDF Anda untuk mencari file gambar asli (seperti foto atau ilustrasi) yang tertanam di dalamnya. Semua gambar yang ditemukan akan dikumpulkan secara otomatis ke dalam satu file ZIP tanpa mengurangi kualitas aslinya.",
  "Konversi PDF ke Word": "Konversi PDF ke Word",
  "Alat ini akan mengekstrak seluruh teks dan tata letak dari dokumen PDF Anda, lalu mengonversinya menjadi dokumen Microsoft Word (DOCX) yang dapat diedit sepenuhnya.": "Alat ini akan mengekstrak seluruh teks dan tata letak dari dokumen PDF Anda, lalu mengonversinya menjadi dokumen Microsoft Word (DOCX) yang dapat diedit sepenuhnya.",
  "Konversi Word ke PDF": "Konversi Word ke PDF",
  "Konversikan dokumen Microsoft Word (DOC/DOCX) Anda menjadi PDF secara instan, dengan mempertahankan format, jenis huruf, dan tata letak persis seperti aslinya.": "Konversikan dokumen Microsoft Word (DOC/DOCX) Anda menjadi PDF secara instan, dengan mempertahankan format, jenis huruf, dan tata letak persis seperti aslinya.",
  "Konversi Excel ke PDF": "Konversi Excel ke PDF",
  "Simpan lembar kerja Excel (XLS/XLSX) Anda ke format PDF. Alat ini akan menyusun baris dan kolom agar tampil rapi dan siap dicetak.": "Simpan lembar kerja Excel (XLS/XLSX) Anda ke format PDF. Alat ini akan menyusun baris dan kolom agar tampil rapi dan siap dicetak.",
  "Konversi Gambar ke PDF": "Konversi Gambar ke PDF",
  "Gabungkan file gambar (PNG, JPG, dll) Anda menjadi sebuah dokumen PDF. Sangat berguna untuk mengumpulkan hasil pindai dokumen.": "Gabungkan file gambar (PNG, JPG, dll) Anda menjadi sebuah dokumen PDF. Sangat berguna untuk mengumpulkan hasil pindai dokumen.",
  "Konversi PowerPoint ke PDF": "Konversi PowerPoint ke PDF",
  "Ubah slide presentasi PowerPoint (PPT/PPTX) Anda menjadi dokumen PDF resolusi tinggi siap cetak secara lokal.": "Ubah slide presentasi PowerPoint (PPT/PPTX) Anda menjadi dokumen PDF resolusi tinggi siap cetak secara lokal.",
  "Konversi PDF ke PowerPoint": "Konversi PDF ke PowerPoint",
  "Ekstrak setiap halaman dari dokumen PDF Anda menjadi slide presentasi Microsoft PowerPoint (PPTX) yang dapat diedit.": "Ekstrak setiap halaman dari dokumen PDF Anda menjadi slide presentasi Microsoft PowerPoint (PPTX) yang dapat diedit.",
  "Konversi CSV ke PDF": "Konversi CSV ke PDF",
  "Olah data ekspor berpemisah koma (CSV) Anda menjadi tabel PDF yang rapi dengan pembagian halaman otomatis.": "Olah data ekspor berpemisah koma (CSV) Anda menjadi tabel PDF yang rapi dengan pembagian halaman otomatis.",
  "Konversi Teks ke PDF": "Konversi Teks ke PDF",
  "Konversikan file teks mentah (TXT) atau log kode Anda menjadi dokumen PDF berformat rapi dan profesional.": "Konversikan file teks mentah (TXT) atau log kode Anda menjadi dokumen PDF berformat rapi dan profesional.",
  "Konversi CSV ke Excel": "Konversi CSV ke Excel",
  "Ubah file data mentah (CSV) menjadi buku kerja Microsoft Excel (XLSX) dengan kolom yang tersusun sempurna.": "Ubah file data mentah (CSV) menjadi buku kerja Microsoft Excel (XLSX) dengan kolom yang tersusun sempurna.",
  "Konversi Excel ke CSV": "Konversi Excel ke CSV",
  "Ekstrak data dari tabel Excel Anda (XLS/XLSX) menjadi format teks data universal CSV (Comma-Separated Values).": "Ekstrak data dari tabel Excel Anda (XLS/XLSX) menjadi format teks data universal CSV (Comma-Separated Values).",
  "Pengaturan Alat": "Pengaturan Alat",
  "✨ Alat ini berjalan 100% secara lokal di perangkat Anda. Tidak ada data yang dikirim ke server.": "✨ Alat ini berjalan 100% secara lokal di perangkat Anda. Tidak ada data yang dikirim ke server.",
  "Error rendering thumbnail:": "Error rendering thumbnail:",
  "transform 0.2s": "transform 0.2s",
  "Remove File": "Remove File",
  "repeat(auto-fill, minmax(110px, 1fr))": "repeat(auto-fill, minmax(110px, 1fr))",
  "all 0.2s": "all 0.2s",
  "File kedua akan disisipkan tepat SETELAH halaman ke-": "File kedua akan disisipkan tepat SETELAH halaman ke-",
  "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  "1 1 calc(50% - 10px)": "1 1 calc(50% - 10px)",
  "1, 2, 3 (Arabic)": "1, 2, 3 (Arabic)",
  "I, II, III (Roman Upper)": "I, II, III (Roman Upper)",
  "i, ii, iii (Roman Lower)": "i, ii, iii (Roman Lower)",
  "A, B, C (Alpha Upper)": "A, B, C (Alpha Upper)",
  "a, b, c (Alpha Lower)": "a, b, c (Alpha Lower)",
  "{n} / {p}": "{n} / {p}",
  "Hal {n}": "Hal {n}",
  "Halaman {n} dari {p}": "Halaman {n} dari {p}",
  "- {n} -": "- {n} -",
  "1fr 1fr": "1fr 1fr",
  "Masukkan kata sandi...": "Masukkan kata sandi...",
  "Ketik ulang kata sandi...": "Ketik ulang kata sandi...",
  "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)": "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
  "Area Sensor Aktif": "Area Sensor Aktif",
  "Menyensor & Merasterisasi...": "Menyensor & Merasterisasi...",
  "Terapkan Sensor Permanen": "Terapkan Sensor Permanen",
  "e.g. 1, 3-5, 8": "e.g. 1, 3-5, 8",
  "Portrait": "Portrait",
  "Landscape": "Landscape",
  "e.g. 1-3, 5, 8": "e.g. 1-3, 5, 8",
  "+ Add More Files": "+ Add More Files",
  "0 -16px": "0 -16px",
  "e.g. CONFIDENTIAL": "e.g. CONFIDENTIAL",
  "Watermark Logo": "Watermark Logo",
  "1 1 calc(50% - 16px)": "1 1 calc(50% - 16px)",
  "Transparansi (": "Transparansi (",
  "Ukuran (": "Ukuran (",
  "Rotasi (": "Rotasi ("
};

const keys = Object.keys(baseUI);
const englishValues = Object.values(baseUI);

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar', 'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs', 'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

async function translateChunk(texts, targetLang) {
  if (targetLang === 'en') return texts;
  let gLang = targetLang;
  if (gLang === 'zh') gLang = 'zh-CN';
  if (gLang === 'he') gLang = 'iw';
  
  const delimiter = ' ||| ';
  const query = texts.join(delimiter);
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + gLang + "&dt=t&q=" + encodeURIComponent(query);
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const translatedText = data[0].map(x => x[0]).join('');
    const parts = translatedText.split(/\s*\|\|\|\s*/);
    return parts.map(x => x.trim().replace(/^"|"$/g, ''));
  } catch (e) {
    console.error('Translation failed for', targetLang, e);
    return texts;
  }
}

async function run() {
  const result = {};
  
  for (const lang of langs) {
    console.log('Translating UI to', lang, '...');
    result[lang] = {};
    
    const chunkSize = 15; 
    let translatedFlat = [];
    
    for (let i = 0; i < englishValues.length; i += chunkSize) {
      const chunk = englishValues.slice(i, i + chunkSize);
      const translatedChunk = await translateChunk(chunk, lang);
      translatedFlat = translatedFlat.concat(translatedChunk);
      await new Promise(r => setTimeout(r, 600));
    }
    
    for (let i = 0; i < keys.length; i++) {
      result[lang][keys[i]] = translatedFlat[i] || englishValues[i];
    }
  }
  
  const tsContent = "// Auto-generated Editor Translations\n" +
"export const editorTranslations: Record<string, Record<string, string>> = " + JSON.stringify(result, null, 2) + ";\n";
  
  fs.writeFileSync('src/i18n/editorTranslations.ts', tsContent);
  console.log('Done editorTranslations.ts');
}

run();

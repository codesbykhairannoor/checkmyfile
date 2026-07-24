const fs = require('fs');
const path = require('path');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { search: "<span>Interactive Split</span>", replace: "<span>{tUi['Interactive Split'] || 'Interactive Split'}</span>" },
  { search: "Ketik rentang halaman yang ingin Anda potong/ekstrak.", replace: "{tUi['Ketik rentang halaman yang ingin Anda potong/ekstrak.'] || 'Ketik rentang halaman yang ingin Anda potong/ekstrak.'}" },
  { search: "Rentang Halaman (Contoh: 1-3, 5, 8)", replace: "{tUi['Rentang Halaman (Contoh: 1-3, 5, 8)'] || 'Rentang Halaman (Contoh: 1-3, 5, 8)'}" },
  { search: "Halaman yang masuk dalam rentang ini akan ditandai dengan label \"EXTRACT\" berwarna hijau pada Live Preview di sebelah kiri.", replace: "{tUi['Halaman yang masuk dalam rentang ini akan ditandai dengan label \"EXTRACT\" berwarna hijau pada Live Preview di sebelah kiri.'] || 'Halaman yang masuk dalam rentang ini akan ditandai dengan label \"EXTRACT\" berwarna hijau pada Live Preview di sebelah kiri.'}" },
  { search: "<span>{isProcessing ? 'Menyimpan...' : 'Potong Sekarang'}</span>", replace: "<span>{isProcessing ? 'Menyimpan...' : (tUi['Potong Sekarang'] || 'Potong Sekarang')}</span>" },
  
  { search: "<span>Interactive Merge</span>", replace: "<span>{tUi['Interactive Merge'] || 'Interactive Merge'}</span>" },
  { search: "Atur urutan file PDF di bawah dengan menggeser (Drag & Drop) kartu dokumen.", replace: "{tUi['Atur urutan file PDF di bawah dengan menggeser (Drag & Drop) kartu dokumen.'] || 'Atur urutan file PDF di bawah dengan menggeser (Drag & Drop) kartu dokumen.'}" },
  { search: "<span>{isProcessing ? 'Menyimpan...' : 'Gabungkan Sekarang'}</span>", replace: "<span>{isProcessing ? 'Menyimpan...' : (tUi['Gabungkan Sekarang'] || 'Gabungkan Sekarang')}</span>" },
  { search: "<span>{isProcessing ? 'Menyimpan...' : 'Gabungkan Skearang'}</span>", replace: "<span>{isProcessing ? 'Menyimpan...' : (tUi['Gabungkan Sekarang'] || 'Gabungkan Sekarang')}</span>" },
  { search: "Pilih Dokumen Pratinjau:", replace: "{tUi['Pilih Dokumen Pratinjau:'] || 'Pilih Dokumen Pratinjau:'}" },
  
  { search: "<span>Interactive Rotate</span>", replace: "<span>{tUi['Interactive Rotate'] || 'Interactive Rotate'}</span>" },
  { search: "Putar orientasi dokumen Anda. Perubahan akan terlihat langsung pada layar pratinjau.", replace: "{tUi['Putar orientasi dokumen Anda. Perubahan akan terlihat langsung pada layar pratinjau.'] || 'Putar orientasi dokumen Anda. Perubahan akan terlihat langsung pada layar pratinjau.'}" },
  { search: "Rotasi Cepat", replace: "{tUi['Rotasi Cepat'] || 'Rotasi Cepat'}" },
  { search: "Derajat Khusus", replace: "{tUi['Derajat Khusus'] || 'Derajat Khusus'}" },
  { search: "<span>{isProcessing ? 'Menyimpan...' : 'Terapkan Rotasi'}</span>", replace: "<span>{isProcessing ? 'Menyimpan...' : (tUi['Terapkan Rotasi'] || 'Terapkan Rotasi')}</span>" },
  { search: ">Kiri<", replace: ">{tUi['Kiri'] || 'Kiri'}<" },
  { search: ">Kanan<", replace: ">{tUi['Kanan'] || 'Kanan'}<" },
  { search: ">Tengah<", replace: ">{tUi['Tengah'] || 'Tengah'}<" },
  { search: ">Bawah<", replace: ">{tUi['Bawah'] || 'Bawah'}<" },
  
  { search: ">Document Navigation<", replace: ">{tUi['Document Navigation'] || 'Document Navigation'}<" },
  { search: "Pilih halaman untuk melompat", replace: "{tUi['Pilih halaman untuk melompat'] || 'Pilih halaman untuk melompat'}" },
  
  { search: "<span>Interactive Page Numbers</span>", replace: "<span>{tUi['Interactive Page Numbers'] || 'Interactive Page Numbers'}</span>" },
  { search: "Atur posisi penomoran halaman. Angka akan muncul secara *real-time* di kanvas.", replace: "{tUi['Atur posisi penomoran halaman. Angka akan muncul secara *real-time* di kanvas.'] || 'Atur posisi penomoran halaman. Angka akan muncul secara *real-time* di kanvas.'}" },
  { search: "Pilih Posisi Angka", replace: "{tUi['Pilih Posisi Angka'] || 'Pilih Posisi Angka'}" },
  { search: "Gaya Penomoran", replace: "{tUi['Gaya Penomoran'] || 'Gaya Penomoran'}" },
  { search: "Format Teks", replace: "{tUi['Format Teks'] || 'Format Teks'}" },
  { search: "Mulai di Halaman", replace: "{tUi['Mulai di Halaman'] || 'Mulai di Halaman'}" },
  { search: "Angka Awal", replace: "{tUi['Angka Awal'] || 'Angka Awal'}" },
  { search: "<span>{isProcessing ? 'Menyimpan...' : 'Terapkan Penomoran'}</span>", replace: "<span>{isProcessing ? 'Menyimpan...' : (tUi['Terapkan Penomoran'] || 'Terapkan Penomoran')}</span>" },
  
  { search: "<span>Hapus Halaman</span>", replace: "<span>{tUi['Hapus Halaman'] || 'Hapus Halaman'}</span>" },
  { search: "Ketik rentang atau nomor halaman yang ingin Anda hapus secara permanen.", replace: "{tUi['Ketik rentang atau nomor halaman yang ingin Anda hapus secara permanen.'] || 'Ketik rentang atau nomor halaman yang ingin Anda hapus secara permanen.'}" },
  { search: "Halaman yang Dihapus (Contoh: 1, 3-5)", replace: "{tUi['Halaman yang Dihapus (Contoh: 1, 3-5)'] || 'Halaman yang Dihapus (Contoh: 1, 3-5)'}" },
  { search: "Halaman yang masuk dalam rentang ini akan ditandai dengan label merah \"HAPUS\" di Live Preview.", replace: "{tUi['Halaman yang masuk dalam rentang ini akan ditandai dengan label merah \"HAPUS\" di Live Preview.'] || 'Halaman yang masuk dalam rentang ini akan ditandai dengan label merah \"HAPUS\" di Live Preview.'}" },
  { search: "<span>{isProcessing ? 'Menyimpan...' : 'Hapus Sekarang'}</span>", replace: "<span>{isProcessing ? 'Menyimpan...' : (tUi['Hapus Sekarang'] || 'Hapus Sekarang')}</span>" }
];

let changedCount = 0;
files.forEach(f => {
  const p = path.join(dir, f);
  let code = fs.readFileSync(p, 'utf8');
  let originalCode = code;
  
  replacements.forEach(r => {
    // using split join to replace all occurrences
    if (code.includes(r.search)) {
      code = code.split(r.search).join(r.replace);
    }
  });
  
  if (code !== originalCode) {
    fs.writeFileSync(p, code);
    console.log('Patched', f);
    changedCount++;
  }
});
console.log('Total files patched:', changedCount);

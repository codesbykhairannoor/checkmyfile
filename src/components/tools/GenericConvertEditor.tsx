import React from 'react';
import { Settings2 } from 'lucide-react';

interface GenericConvertEditorProps {
  tUi?: Record<string, string>;
  toolId: string;
  onApply: () => void;
  isProcessing: boolean;
}

export const GenericConvertEditor: React.FC<GenericConvertEditorProps> = ({
  tUi = {},
 toolId, onApply, isProcessing }) => {
  void tUi;
  const getToolInfo = () => {
    switch (toolId) {
      case 'pdf-to-word':
        return {
          title: (tUi["Konversi PDF ke Word"] || "Konversi PDF ke Word"),
          desc: (tUi["Alat ini akan mengekstrak seluruh teks dan tata letak dari dokumen PDF Anda, lalu mengonversinya menjadi dokumen Microsoft Word (DOCX) yang dapat diedit sepenuhnya."] || "Alat ini akan mengekstrak seluruh teks dan tata letak dari dokumen PDF Anda, lalu mengonversinya menjadi dokumen Microsoft Word (DOCX) yang dapat diedit sepenuhnya.")
        };
      case 'word-to-pdf':
        return {
          title: (tUi["Konversi Word ke PDF"] || "Konversi Word ke PDF"),
          desc: (tUi["Konversikan dokumen Microsoft Word (DOC/DOCX) Anda menjadi PDF secara instan, dengan mempertahankan format, jenis huruf, dan tata letak persis seperti aslinya."] || "Konversikan dokumen Microsoft Word (DOC/DOCX) Anda menjadi PDF secara instan, dengan mempertahankan format, jenis huruf, dan tata letak persis seperti aslinya.")
        };
      case 'excel-to-pdf':
        return {
          title: (tUi["Konversi Excel ke PDF"] || "Konversi Excel ke PDF"),
          desc: (tUi["Simpan lembar kerja Excel (XLS/XLSX) Anda ke format PDF. Alat ini akan menyusun baris dan kolom agar tampil rapi dan siap dicetak."] || "Simpan lembar kerja Excel (XLS/XLSX) Anda ke format PDF. Alat ini akan menyusun baris dan kolom agar tampil rapi dan siap dicetak.")
        };
      case 'image-to-pdf':
        return {
          title: (tUi["Konversi Gambar ke PDF"] || "Konversi Gambar ke PDF"),
          desc: (tUi["Gabungkan file gambar (PNG, JPG, dll) Anda menjadi sebuah dokumen PDF. Sangat berguna untuk mengumpulkan hasil pindai dokumen."] || "Gabungkan file gambar (PNG, JPG, dll) Anda menjadi sebuah dokumen PDF. Sangat berguna untuk mengumpulkan hasil pindai dokumen.")
        };
      case 'ppt-to-pdf':
        return {
          title: (tUi["Konversi PowerPoint ke PDF"] || "Konversi PowerPoint ke PDF"),
          desc: (tUi["Ubah slide presentasi PowerPoint (PPT/PPTX) Anda menjadi dokumen PDF resolusi tinggi siap cetak secara lokal."] || "Ubah slide presentasi PowerPoint (PPT/PPTX) Anda menjadi dokumen PDF resolusi tinggi siap cetak secara lokal.")
        };
      case 'pdf-to-ppt':
        return {
          title: (tUi["Konversi PDF ke PowerPoint"] || "Konversi PDF ke PowerPoint"),
          desc: (tUi["Ekstrak setiap halaman dari dokumen PDF Anda menjadi slide presentasi Microsoft PowerPoint (PPTX) yang dapat diedit."] || "Ekstrak setiap halaman dari dokumen PDF Anda menjadi slide presentasi Microsoft PowerPoint (PPTX) yang dapat diedit.")
        };
      case 'csv-to-pdf':
        return {
          title: (tUi["Konversi CSV ke PDF"] || "Konversi CSV ke PDF"),
          desc: (tUi["Olah data ekspor berpemisah koma (CSV) Anda menjadi tabel PDF yang rapi dengan pembagian halaman otomatis."] || "Olah data ekspor berpemisah koma (CSV) Anda menjadi tabel PDF yang rapi dengan pembagian halaman otomatis.")
        };
      case 'txt-to-pdf':
        return {
          title: (tUi["Konversi Teks ke PDF"] || "Konversi Teks ke PDF"),
          desc: (tUi["Konversikan file teks mentah (TXT) atau log kode Anda menjadi dokumen PDF berformat rapi dan profesional."] || "Konversikan file teks mentah (TXT) atau log kode Anda menjadi dokumen PDF berformat rapi dan profesional.")
        };
      case 'csv-to-excel':
        return {
          title: (tUi["Konversi CSV ke Excel"] || "Konversi CSV ke Excel"),
          desc: (tUi["Ubah file data mentah (CSV) menjadi buku kerja Microsoft Excel (XLSX) dengan kolom yang tersusun sempurna."] || "Ubah file data mentah (CSV) menjadi buku kerja Microsoft Excel (XLSX) dengan kolom yang tersusun sempurna.")
        };
      case 'excel-to-csv':
        return {
          title: (tUi["Konversi Excel ke CSV"] || "Konversi Excel ke CSV"),
          desc: (tUi["Ekstrak data dari tabel Excel Anda (XLS/XLSX) menjadi format teks data universal CSV (Comma-Separated Values)."] || "Ekstrak data dari tabel Excel Anda (XLS/XLSX) menjadi format teks data universal CSV (Comma-Separated Values).")
        };
      default:
        return {
          title: (tUi["Pengaturan Alat"] || "Pengaturan Alat"),
          desc: (tUi["Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses."] || (tUi["Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses."] || "Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses."))
        };
    }
  };

  const info = getToolInfo();

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings2 size={18} className="text-brand-primary" />
          <span>{info.title}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {info.desc}
        </p>
      </div>
      
      <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
        {tUi["✨ Alat ini berjalan 100% secara lokal di perangkat Anda. Tidak ada data yang dikirim ke server."] || "✨ Alat ini berjalan 100% secara lokal di perangkat Anda. Tidak ada data yang dikirim ke server."}</div>

      <button
        onClick={onApply}
        disabled={isProcessing}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          background: 'var(--brand-gradient)',
          color: '#fff',
          border: 'none',
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
      >
        {isProcessing ? (tUi["Memproses..."] || "Memproses...") : (tUi["Mulai Sekarang"] || (tUi["Mulai Sekarang"] || "Mulai Sekarang"))}
      </button>
    </div>
  );
};

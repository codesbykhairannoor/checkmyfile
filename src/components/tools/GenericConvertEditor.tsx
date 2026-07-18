import React from 'react';
import { Settings2 } from 'lucide-react';

interface GenericConvertEditorProps {
  toolId: string;
  onApply: () => void;
  isProcessing: boolean;
}

export const GenericConvertEditor: React.FC<GenericConvertEditorProps> = ({ toolId, onApply, isProcessing }) => {
  const getToolInfo = () => {
    switch (toolId) {
      case 'pdf-to-word':
        return {
          title: 'Konversi PDF ke Word',
          desc: 'Alat ini akan mengekstrak seluruh teks dan tata letak dari dokumen PDF Anda, lalu mengonversinya menjadi dokumen Microsoft Word (DOCX) yang dapat diedit sepenuhnya.'
        };
      case 'word-to-pdf':
        return {
          title: 'Konversi Word ke PDF',
          desc: 'Konversikan dokumen Microsoft Word (DOC/DOCX) Anda menjadi PDF secara instan, dengan mempertahankan format, jenis huruf, dan tata letak persis seperti aslinya.'
        };
      case 'excel-to-pdf':
        return {
          title: 'Konversi Excel ke PDF',
          desc: 'Simpan lembar kerja Excel (XLS/XLSX) Anda ke format PDF. Alat ini akan menyusun baris dan kolom agar tampil rapi dan siap dicetak.'
        };
      case 'image-to-pdf':
        return {
          title: 'Konversi Gambar ke PDF',
          desc: 'Gabungkan file gambar (PNG, JPG, dll) Anda menjadi sebuah dokumen PDF. Sangat berguna untuk mengumpulkan hasil pindai dokumen.'
        };
      default:
        return {
          title: 'Pengaturan Alat',
          desc: 'Tidak ada opsi lanjutan yang diperlukan untuk alat ini. Klik tombol Terapkan di bawah untuk memproses.'
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
        ✨ Alat ini berjalan 100% secara lokal di perangkat Anda. Tidak ada data yang dikirim ke server.
      </div>

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
        {isProcessing ? 'Memproses...' : 'Mulai Sekarang'}
      </button>
    </div>
  );
};

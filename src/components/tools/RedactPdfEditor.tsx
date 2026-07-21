import React from 'react';
import { EyeOff, PlusCircle, AlertTriangle } from 'lucide-react';

interface RedactPdfEditorProps {
  onProcess: () => void;
  isProcessing: boolean;
  redactConfig: any;
  setRedactConfig: React.Dispatch<React.SetStateAction<any>>;
  activeFileIndex: number; // We assume activePage is always 1 internally or we add to page 1 by default, but let's just add to the currently visible page if possible, or just page 0 for now.
}

export const RedactPdfEditor: React.FC<RedactPdfEditorProps> = ({ onProcess, isProcessing, redactConfig, setRedactConfig }) => {
  const addRedactBox = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setRedactConfig((prev: any) => {
      const page0Boxes = prev.boxes[0] || [];
      return {
        ...prev,
        boxes: {
          ...prev.boxes,
          [0]: [...page0Boxes, { id, x: 35, y: 45, width: 25, height: 5 }]
        }
      };
    });
  };

  const totalBoxes: number = Object.values(redactConfig.boxes || {}).reduce((sum: number, boxes: any) => sum + boxes.length, 0) as number;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <EyeOff size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            Sensor Dokumen (Redact)
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Tutup informasi rahasia dengan blok hitam permanen.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 20 }}>
        <button
          onClick={addRedactBox}
          className="btn-secondary"
          style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}
        >
          <PlusCircle size={18} />
          Tambah Area Sensor (Halaman 1)
        </button>
        
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Geser kotak di bagian Pratinjau (Kiri) ke teks yang ingin disensor. Tarik sudut kanan-bawah kotak untuk memperbesar.
        </p>

        {totalBoxes > 0 && (
          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#047857', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
            {totalBoxes} Area Sensor Aktif
          </div>
        )}

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Gaya Sensor</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => setRedactConfig((prev: any) => ({ ...prev, mode: 'black' }))}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${redactConfig.mode === 'black' ? 'var(--brand-primary)' : 'var(--border-color)'}`, background: redactConfig.mode === 'black' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: redactConfig.mode === 'black' ? 'var(--brand-primary)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Blok Hitam
              </button>
              <button 
                onClick={() => setRedactConfig((prev: any) => ({ ...prev, mode: 'blur' }))}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${redactConfig.mode === 'blur' ? 'var(--brand-primary)' : 'var(--border-color)'}`, background: redactConfig.mode === 'blur' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: redactConfig.mode === 'blur' ? 'var(--brand-primary)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Efek Blur
              </button>
            </div>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={redactConfig.showLock} 
              onChange={(e) => setRedactConfig((prev: any) => ({ ...prev, showLock: e.target.checked }))} 
              style={{ width: 16, height: 16, accentColor: 'var(--brand-primary)' }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>Tampilkan Ikon Gembok (Keren)</span>
          </label>
        </div>
      </div>

      <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309', lineHeight: 1.5 }}>
          Proses ini menggunakan <strong>Rasterisasi Penuh</strong>. Teks asli yang tertutup akan hancur sepenuhnya dari kode sumber PDF, sehingga mustahil untuk dipulihkan oleh <i>hacker</i>.
        </p>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing || totalBoxes === 0}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.1rem', opacity: (totalBoxes === 0 || isProcessing) ? 0.6 : 1 }}
      >
        {isProcessing ? 'Menyensor & Merasterisasi...' : 'Terapkan Sensor Permanen'}
      </button>
    </div>
  );
};

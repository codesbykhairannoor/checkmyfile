import React, { useRef } from 'react';
import { Scale, UploadCloud, File as FileIcon, X } from 'lucide-react';

interface ComparePdfEditorProps {
  onProcess: (options: { compareFile2: File }) => void;
  isProcessing: boolean;
}

export const ComparePdfEditor: React.FC<ComparePdfEditorProps> = ({ onProcess, isProcessing }) => {
  const [file2, setFile2] = React.useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile2(e.target.files[0]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <Scale size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            Bandingkan 2 PDF
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Pilih file kedua (File Pembanding). Sistem akan menyorot setiap perbedaan piksel atau huruf dengan warna merah.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 20 }}>
        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
          Pilih File Pembanding (Revisi)
        </label>
        
        {!file2 ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              border: '2px dashed var(--border-color)', borderRadius: 8, padding: '32px 24px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer',
              background: 'rgba(0,0,0,0.01)', transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <UploadCloud size={32} color="var(--text-muted)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>Klik untuk Unggah PDF Pembanding</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'rgba(225, 29, 72, 0.05)', border: '1px solid rgba(225, 29, 72, 0.2)', borderRadius: 8 }}>
            <FileIcon size={24} className="text-accent" />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file2.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {(file2.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
            <button 
              onClick={() => setFile2(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="var(--text-muted)" />
            </button>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="application/pdf" 
          style={{ display: 'none' }} 
        />
      </div>

      <button
        onClick={() => {
          if (file2) onProcess({ compareFile2: file2 });
        }}
        disabled={isProcessing || !file2}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.1rem', opacity: (!file2 || isProcessing) ? 0.6 : 1 }}
      >
        {isProcessing ? 'Menganalisis Perbedaan...' : 'Bandingkan PDF Sekarang'}
      </button>
    </div>
  );
};

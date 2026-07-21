import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, Settings2, Image as ImageIcon, Type } from 'lucide-react';

interface SignPdfEditorProps {
  signatureConfig: { pageIndex: number; x: number; y: number; width: number; height: number; imageUrl: string; };
  setSignatureConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
  totalPages: number;
}

export const SignPdfEditor: React.FC<SignPdfEditorProps> = ({
  signatureConfig,
  setSignatureConfig,
  onApply,
  isProcessing,
  totalPages
}) => {
  const [tab, setTab] = useState<'type' | 'upload'>('type');
  const [typedName, setTypedName] = useState('Tanda Tangan');
  const [selectedFont, setSelectedFont] = useState('Caveat, cursive');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Fonts available for "Type" mode
  const signatureFonts = [
    { label: 'Caveat', value: 'Caveat, cursive' },
    { label: 'Dancing Script', value: '"Dancing Script", cursive' },
    { label: 'Pacifico', value: 'Pacifico, cursive' }
  ];

  // Generate image from text
  useEffect(() => {
    if (tab === 'type' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Load font trick (basic)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = `40px ${selectedFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName || ' ', canvas.width / 2, canvas.height / 2);
      
      setSignatureConfig({ ...signatureConfig, imageUrl: canvas.toDataURL('image/png') });
    }
  }, [typedName, selectedFont, tab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSignatureConfig({ ...signatureConfig, imageUrl: ev.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenTool size={18} className="text-brand-primary" color="#3b82f6" />
          <span>E-Sign PDF</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Buat tanda tangan Anda dan letakkan di posisi yang tepat pada halaman PDF.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--bg-input)', padding: 4, borderRadius: 8 }}>
        <button 
          onClick={() => setTab('type')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 600, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: tab === 'type' ? 'var(--bg-card)' : 'transparent', color: tab === 'type' ? 'var(--brand-primary)' : 'var(--text-muted)', border: 'none', boxShadow: tab === 'type' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          <Type size={14} /> Ketik
        </button>
        <button 
          onClick={() => setTab('upload')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 600, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: tab === 'upload' ? 'var(--bg-card)' : 'transparent', color: tab === 'upload' ? 'var(--brand-primary)' : 'var(--text-muted)', border: 'none', boxShadow: tab === 'upload' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          <ImageIcon size={14} /> Unggah
        </button>
      </div>

      {/* Mode Content */}
      {tab === 'type' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            value={typedName}
            onChange={e => setTypedName(e.target.value)}
            placeholder="Ketik Nama Anda..."
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none' }}
          />
          <select
            value={selectedFont}
            onChange={e => setSelectedFont(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none' }}
          >
            {signatureFonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <canvas ref={canvasRef} width={400} height={150} style={{ display: 'none' }} />
          
          <div style={{ padding: 16, background: '#fff', border: '1px dashed var(--border-color)', borderRadius: 8, display: 'flex', justifyContent: 'center' }}>
            <img src={signatureConfig.imageUrl} alt="Preview" style={{ maxHeight: 60, objectFit: 'contain' }} />
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div>
          <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} ref={fileRef} onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} className="btn-secondary" style={{ width: '100%', padding: '12px', justifyContent: 'center', background: 'var(--bg-input)' }}>
            <ImageIcon size={16} /> Unggah Tanda Tangan (PNG/JPG)
          </button>
          {signatureConfig.imageUrl && signatureConfig.imageUrl.length > 100 && (
            <div style={{ marginTop: 12, padding: 16, background: '#fff', border: '1px dashed var(--border-color)', borderRadius: 8, display: 'flex', justifyContent: 'center' }}>
              <img src={signatureConfig.imageUrl} alt="Preview" style={{ maxHeight: 60, objectFit: 'contain' }} />
            </div>
          )}
        </div>
      )}

      {/* Position Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Posisi & Ukuran (Live Preview)</h5>
        
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Halaman (1 - {totalPages})</label>
        <input type="range" min="0" max={totalPages - 1} value={signatureConfig.pageIndex} onChange={e => setSignatureConfig({...signatureConfig, pageIndex: Number(e.target.value)})} />
        
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posisi Horizontal (X)</label>
        <input type="range" min="0" max="100" value={signatureConfig.x} onChange={e => setSignatureConfig({...signatureConfig, x: Number(e.target.value)})} />
        
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posisi Vertikal (Y)</label>
        <input type="range" min="0" max="100" value={signatureConfig.y} onChange={e => setSignatureConfig({...signatureConfig, y: Number(e.target.value)})} />
        
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ukuran</label>
        <input type="range" min="5" max="50" value={signatureConfig.width} onChange={e => setSignatureConfig({...signatureConfig, width: Number(e.target.value)})} />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !signatureConfig.imageUrl}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)' }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? 'Memproses...' : 'Terapkan Tanda Tangan'}</span>
        </button>
      </div>
    </div>
  );
};

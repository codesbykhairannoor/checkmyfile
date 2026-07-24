import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, Settings2, Image as ImageIcon, RotateCcw, ShieldCheck, Lock } from 'lucide-react';
import { generateSelfSignedP12 } from '../../engines/pdf/cryptoUtils';

interface SignPdfEditorProps {
  tUi?: Record<string, string>;
  signatureConfig: any;
  setSignatureConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const SignPdfEditor: React.FC<SignPdfEditorProps> = ({
  tUi = {},
  signatureConfig,
  setSignatureConfig,
  onApply,
  isProcessing
}) => {
  const [tab, setTab] = useState<'draw' | 'upload'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const certFileRef = useRef<HTMLInputElement>(null);

  // Crypto State
  const [certMode, setCertMode] = useState<'auto' | 'custom'>('auto');
  const [certPassword, setCertPassword] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize canvas context and clear on mount
  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#000';
      }
    }
  }, [tab, lineWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#000';

    const rect = canvas.getBoundingClientRect();
    const xRaw = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const yRaw = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    
    const x = xRaw * (canvas.width / rect.width);
    const y = yRaw * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const xRaw = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const yRaw = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    
    const x = xRaw * (canvas.width / rect.width);
    const y = yRaw * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setSignatureConfig((prev: any) => ({ ...prev, imageUrl: canvasRef.current!.toDataURL('image/png') }));
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setSignatureConfig((prev: any) => ({ ...prev, imageUrl: '' }));
    }
  };

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

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFile(file);
    }
  };

  const handleApply = async () => {
    setIsGenerating(true);
    try {
      if (certMode === 'auto') {
        const password = 'auto_generated_password';
        const p12Bytes = await generateSelfSignedP12(password, 'Anonymous User');
        setSignatureConfig({
          ...signatureConfig,
          p12Bytes,
          password
        });
      } else {
        if (!certFile || !certPassword) {
          alert('Harap unggah file sertifikat (.p12/.pfx) dan masukkan passwordnya.');
          setIsGenerating(false);
          return;
        }
        const arrayBuffer = await certFile.arrayBuffer();
        setSignatureConfig({
          ...signatureConfig,
          p12Bytes: arrayBuffer,
          password: certPassword
        });
      }
      
      // Delay slightly so state updates before parent processes
      setTimeout(() => {
        onApply();
        setIsGenerating(false);
      }, 100);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses sertifikat digital.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenTool size={18} className="text-brand-primary" color="#3b82f6" />
          <span>{tUi["E-Sign PDF"] || "E-Sign PDF"}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{tUi["Buat tanda tangan Anda dan letakkan di posisi yang tepat pada halaman PDF."] || "Buat tanda tangan Anda dan letakkan di posisi yang tepat pada halaman PDF."}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--bg-input)', padding: 4, borderRadius: 8 }}>
        <button 
          onClick={() => setTab('draw')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 600, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: tab === 'draw' ? 'var(--bg-card)' : 'transparent', color: tab === 'draw' ? 'var(--brand-primary)' : 'var(--text-muted)', border: 'none', boxShadow: tab === 'draw' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          <PenTool size={14} />{tUi["Gambar"] || "Gambar"}</button>
        <button 
          onClick={() => setTab('upload')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 600, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: tab === 'upload' ? 'var(--bg-card)' : 'transparent', color: tab === 'upload' ? 'var(--brand-primary)' : 'var(--text-muted)', border: 'none', boxShadow: tab === 'upload' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          <ImageIcon size={14} />{tUi["Unggah"] || "Unggah"}</button>
      </div>

      {/* Mode Content */}
      {tab === 'draw' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative', width: '100%', border: '2px dashed var(--border-color)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
            <canvas 
              ref={canvasRef} 
              width={320} 
              height={180} 
              style={{ display: 'block', width: '100%', height: '180px', cursor: 'crosshair', touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <button 
              onClick={clearCanvas}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: 4, padding: 6, cursor: 'pointer', color: '#333' }}
              title="Bersihkan"
            >
              <RotateCcw size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{tUi["Ketebalan Tinta"] || "Ketebalan Tinta"}</span>
              <span>{lineWidth}px</span>
            </label>
            <input type="range" min="1" max="10" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} />
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div>
          <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} ref={fileRef} onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} className="btn-secondary" style={{ width: '100%', padding: '12px', justifyContent: 'center', background: 'var(--bg-input)' }}>
            <ImageIcon size={16} />{tUi["Unggah Tanda Tangan (PNG/JPG)"] || "Unggah Tanda Tangan (PNG/JPG)"}</button>
          {signatureConfig?.imageUrl && signatureConfig.imageUrl.length > 100 && (
            <div style={{ marginTop: 12, padding: 16, background: '#fff', border: '1px dashed var(--border-color)', borderRadius: 8, display: 'flex', justifyContent: 'center' }}>
              <img src={signatureConfig.imageUrl} alt="Preview" style={{ maxHeight: 60, objectFit: 'contain' }} />
            </div>
          )}
        </div>
      )}

      {/* Position Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{tUi["Ukuran Tanda Tangan"] || "Ukuran Tanda Tangan"}</h5>
        <input type="range" min="5" max="50" value={signatureConfig?.width || 30} onChange={e => setSignatureConfig({...signatureConfig, width: Number(e.target.value)})} />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tUi["Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi."] || "Klik halaman di Live Preview untuk memindahkan tanda tangan, lalu geser (drag) untuk menyesuaikan posisi."}</p>
      </div>

      {/* Crypto Signature Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={16} className="text-green-500" />
          {tUi["Sertifikat Kriptografi"] || "Sertifikat Kriptografi (PKCS#7)"}
        </h5>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
            <input type="radio" name="certMode" value="auto" checked={certMode === 'auto'} onChange={() => setCertMode('auto')} />
            <span>{tUi["Sertifikat Otomatis (Anonim)"] || "Sertifikat Otomatis (Anonim)"}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
            <input type="radio" name="certMode" value="custom" checked={certMode === 'custom'} onChange={() => setCertMode('custom')} />
            <span>{tUi["Gunakan P12 / PFX Pribadi"] || "Gunakan P12 / PFX Pribadi"}</span>
          </label>
        </div>

        {certMode === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-input)', padding: 12, borderRadius: 8, marginTop: 4 }}>
            <input type="file" accept=".p12,.pfx" style={{ display: 'none' }} ref={certFileRef} onChange={handleCertUpload} />
            <button onClick={() => certFileRef.current?.click()} className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}>
              <Lock size={14} /> {certFile ? certFile.name : (tUi["Pilih File .p12 / .pfx"] || "Pilih File .p12 / .pfx")}
            </button>
            <input 
              type="password" 
              placeholder={tUi["Password Sertifikat"] || "Password Sertifikat"} 
              value={certPassword}
              onChange={e => setCertPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={handleApply}
          disabled={isProcessing || isGenerating || !signatureConfig?.imageUrl}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)" }}
        >
          {(isProcessing || isGenerating) ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{(isProcessing || isGenerating) ? (tUi["Memproses..."] || "Memproses...") : (tUi["Terapkan Enkripsi PDF"] || "Terapkan Enkripsi PDF")}</span>
        </button>
      </div>
    </div>
  );
};

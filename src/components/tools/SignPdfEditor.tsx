import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, Settings2, Image as ImageIcon, RotateCcw, ShieldCheck, Lock } from 'lucide-react';

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
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const [tab, setTab] = useState<'draw' | 'upload'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

    const dataUrl = canvas.toDataURL('image/png');
    setSignatureConfig((prev: any) => ({ ...prev, imageUrl: dataUrl }));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureConfig((prev: any) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setSignatureConfig((prev: any) => ({ ...prev, imageUrl: loadEvt.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenTool size={18} className="text-brand-primary" />
          <span>{t("sign_pdf", "Sign PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("sign_desc", "Add legal digital or drawn signatures directly to your PDF documents.")}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, background: 'var(--bg-input)', padding: 4, borderRadius: 8 }}>
        <button 
          onClick={() => setTab('draw')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 600, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: tab === 'draw' ? 'var(--bg-card)' : 'transparent', color: tab === 'draw' ? 'var(--brand-primary)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
        >
          <PenTool size={14} />{t("signature_type_draw", "Draw Signature")}
        </button>
        <button 
          onClick={() => setTab('upload')}
          style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 600, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: tab === 'upload' ? 'var(--bg-card)' : 'transparent', color: tab === 'upload' ? 'var(--brand-primary)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
        >
          <ImageIcon size={14} />{t("signature_type_upload", "Upload Signature (PNG/JPG)")}
        </button>
      </div>

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
              title="Clear"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div>
          <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} ref={fileRef} onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} className="btn-secondary" style={{ width: '100%', padding: '12px', justifyContent: 'center', background: 'var(--bg-input)' }}>
            <ImageIcon size={16} />{t("signature_type_upload", "Upload Signature (PNG/JPG)")}
          </button>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !signatureConfig?.imageUrl}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? t("signing_btn", "Signing...") : t("apply_signature", "Apply Signature Now")}</span>
        </button>
      </div>
    </div>
  );
};

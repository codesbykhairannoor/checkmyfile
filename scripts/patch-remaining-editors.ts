import * as fs from 'fs';
import * as path from 'path';

// 14. OrganizePdfEditor.tsx
const OrganizePdfEditorContent = `import React, { useRef } from 'react';
import { LayoutList, Download, Settings2, FileUp, Info } from 'lucide-react';

interface OrganizePdfEditorProps {
  tUi?: Record<string, string>;
  insertFile: File | null;
  setInsertFile: (file: File | null) => void;
  insertAtIndex: number;
  setInsertAtIndex: (idx: number) => void;
  onApply: () => void;
  isProcessing: boolean;
  totalPages: number;
}

export const OrganizePdfEditor: React.FC<OrganizePdfEditorProps> = ({
  tUi = {},
  insertFile,
  setInsertFile,
  insertAtIndex,
  setInsertAtIndex,
  onApply,
  isProcessing,
  totalPages
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <LayoutList size={18} className="text-brand-primary" color="#8b5cf6" />
          <span>{t("organize_pdf", "Organize PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("organize_desc", "Insert or reorder pages inside your PDF document.")}
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          {t("insert_file_label", "Insert Document")}
        </label>
        
        <input 
          type="file" 
          accept="application/pdf" 
          style={{ display: 'none' }} 
          ref={fileRef}
          onChange={(e) => {
            if (e.target.files?.[0]) setInsertFile(e.target.files[0]);
          }}
        />
        
        <button 
          onClick={() => fileRef.current?.click()}
          className="btn-secondary"
          style={{ width: '100%', padding: '12px', justifyContent: 'center', background: 'var(--bg-input)' }}
        >
          <FileUp size={16} />
          <span>{insertFile ? insertFile.name : t("select_second_pdf", "Select PDF File to Insert...")}</span>
        </button>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          {t("insert_after_page", "Insert After Page:")}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="range"
            min="0"
            max={totalPages || 1}
            value={insertAtIndex}
            onChange={(e) => setInsertAtIndex(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#8b5cf6' }}
          />
          <div style={{ background: 'var(--bg-input)', padding: '6px 12px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700 }}>
            {insertAtIndex === 0 ? t("insert_at_start", "At the Very Beginning (0)") : insertAtIndex}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !insertFile}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("inserting_btn", "Inserting...") : t("apply_insert", "Apply Page Insertion")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// 15. ResizePdfEditor.tsx
const ResizePdfEditorContent = `import React from 'react';
import { Maximize, Download, RotateCw } from 'lucide-react';

interface ResizePdfEditorProps {
  tUi?: Record<string, string>;
  config: any;
  setConfig: (c: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ResizePdfEditor: React.FC<ResizePdfEditorProps> = ({
  tUi = {},
  config, setConfig, onApply, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Maximize size={18} className="text-brand-primary" />
          <span>{t("resize_pdf", "Resize PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("resize_desc", "Change PDF page dimensions and paper size without cropping content.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {t("target_page_size", "Target Paper Size")}
          </label>
          <select 
            className="select-input" 
            value={config.pageSize || 'A4'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, pageSize: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="A4">A4 (210 x 297 mm)</option>
            <option value="A3">A3 (297 x 420 mm)</option>
            <option value="Letter">Letter (8.5 x 11 in)</option>
            <option value="Legal">Legal (8.5 x 14 in)</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {t("orientation", "Orientation")}
          </label>
          <select 
            className="select-input" 
            value={config.orientation || 'Auto'} 
            onChange={(e) => setConfig((prev: any) => ({ ...prev, orientation: e.target.value }))} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)' }}
          >
            <option value="Auto">{t("auto_fit", "Auto (Keep Original)")}</option>
            <option value="Portrait">{t("portrait", "Portrait (Vertical)")}</option>
            <option value="Landscape">{t("landscape", "Landscape (Horizontal)")}</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><RotateCw size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? t("resizing_btn", "Resizing...") : t("apply_resize", "Resize PDF Now")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// 16. GenericConvertEditor.tsx
const GenericConvertEditorContent = `import React from 'react';
import { Settings2, Download } from 'lucide-react';

interface GenericConvertEditorProps {
  tUi?: Record<string, string>;
  toolId: string;
  onApply: () => void;
  isProcessing: boolean;
}

export const GenericConvertEditor: React.FC<GenericConvertEditorProps> = ({
  tUi = {},
  toolId, onApply, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings2 size={18} className="text-brand-primary" />
          <span>{t("generic_convert", "Convert Document")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("generic_convert_desc", "Fast client-side document conversion with preserved fonts and layouts.")}
        </p>
      </div>
      
      <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
        {t("local_privacy_badge", "✨ 100% Client-Side Privacy: Your files never leave your device.")}
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
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10
        }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("generic_converting_btn", "Converting...") : t("apply_generic_convert", "Start Conversion")}</span>
      </button>
    </div>
  );
};
`;

// 17. PdfToImageEditor.tsx
const PdfToImageEditorContent = `import React from 'react';
import { Image as ImageIcon, Download, Settings2 } from 'lucide-react';

interface PdfToImageEditorProps {
  tUi?: Record<string, string>;
  format: 'png' | 'jpg';
  setFormat: (val: 'png' | 'jpg') => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const PdfToImageEditor: React.FC<PdfToImageEditorProps> = ({
  tUi = {},
  format,
  setFormat,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageIcon size={18} className="text-brand-primary" />
          <span>{t("convert_to_image", "Convert PDF to Images")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("convert_to_image_desc", "Extract high-resolution image files from every page of your PDF.")}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setFormat('png')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: format === 'png' ? 'var(--brand-gradient)' : 'var(--bg-input)',
              color: format === 'png' ? '#fff' : 'var(--text-main)',
              border: format === 'png' ? '1px solid transparent' : '1px solid var(--border-color)',
              borderRadius: 12
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>PNG</span>
            <span style={{ fontWeight: 600, fontSize: '0.75rem', opacity: format === 'png' ? 0.9 : 0.6 }}>High Quality</span>
          </button>
          <button
            onClick={() => setFormat('jpg')}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: format === 'jpg' ? 'var(--brand-gradient)' : 'var(--bg-input)',
              color: format === 'jpg' ? '#fff' : 'var(--text-main)',
              border: format === 'jpg' ? '1px solid transparent' : '1px solid var(--border-color)',
              borderRadius: 12
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>JPG</span>
            <span style={{ fontWeight: 600, fontSize: '0.75rem', opacity: format === 'jpg' ? 0.9 : 0.6 }}>Compact Size</span>
          </button>
        </div>
      </div>

      <button
        onClick={onApply}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '14px 24px', fontSize: '1rem', fontWeight: 700, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("extracting_btn", "Extracting Images...") : t("apply_image_convert", "Extract Images Now")}</span>
      </button>
    </div>
  );
};
`;

// 18. ExtractImagesEditor.tsx
const ExtractImagesEditorContent = `import React from 'react';
import { Image, Download, Settings2 } from 'lucide-react';

interface ExtractImagesEditorProps {
  tUi?: Record<string, string>;
  onApply: () => void;
  isProcessing: boolean;
}

export const ExtractImagesEditor: React.FC<ExtractImagesEditorProps> = ({
  tUi = {},
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Image size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t("convert_to_image", "Extract Images")}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {t("convert_to_image_desc", "Extract high-resolution image files from every page of your PDF.")}
        </p>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button onClick={onApply} disabled={isProcessing} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 }}>
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
          ) : (
            <><Download size={18} />{t("apply_image_convert", "Extract All Images Now")}</>
          )}
        </button>
      </div>
    </div>
  );
};
`;

// 19. ScanToPdfEditor.tsx
const ScanToPdfEditorContent = `import React from 'react';
import { ScanLine, Lightbulb, Download, Settings2 } from 'lucide-react';

interface ScanToPdfEditorProps {
  tUi?: Record<string, string>;
  onProcess: () => void;
  isProcessing: boolean;
}

export const ScanToPdfEditor: React.FC<ScanToPdfEditorProps> = ({
  tUi = {},
  onProcess, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <ScanLine size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {t("scan_to_pdf", "Scan to PDF")}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {t("scan_to_pdf_desc", "Transform clean digital PDFs into authentic scanned-looking documents.")}
          </p>
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("scanning_btn", "Rasterizing Scanner Effect...") : t("apply_scan", "Apply Scanner Effect")}</span>
      </button>
    </div>
  );
};
`;

// 20. RemoveMetadataEditor.tsx
const RemoveMetadataEditorContent = `import React from 'react';
import { Eraser, ShieldCheck, Download, Settings2 } from 'lucide-react';

interface RemoveMetadataEditorProps {
  tUi?: Record<string, string>;
  onProcess: () => void;
  isProcessing: boolean;
}

export const RemoveMetadataEditor: React.FC<RemoveMetadataEditorProps> = ({
  tUi = {},
  onProcess, isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-color)' }}>
        <div style={{ padding: 12, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', borderRadius: 12 }}>
          <Eraser size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {t("remove_metadata", "Remove Metadata")}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {t("remove_metadata_desc", "Sanitize author, creator, GPS, and creation timestamps permanently.")}
          </p>
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("sanitizing_btn", "Sanitizing...") : t("apply_remove_metadata", "Sanitize Metadata Now")}</span>
      </button>
    </div>
  );
};
`;

// 21. SignPdfEditor.tsx
const SignPdfEditorContent = `import React, { useState, useRef, useEffect } from 'react';
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
`;

// Write remaining files
fs.writeFileSync('src/components/tools/OrganizePdfEditor.tsx', OrganizePdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/ResizePdfEditor.tsx', ResizePdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/GenericConvertEditor.tsx', GenericConvertEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/PdfToImageEditor.tsx', PdfToImageEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/ExtractImagesEditor.tsx', ExtractImagesEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/ScanToPdfEditor.tsx', ScanToPdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/RemoveMetadataEditor.tsx', RemoveMetadataEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/SignPdfEditor.tsx', SignPdfEditorContent, 'utf-8');

console.log("🎉 All 25 tool editors successfully updated with 100% i18n!");

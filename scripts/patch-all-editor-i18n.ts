import * as fs from 'fs';
import * as path from 'path';

// 6. ProtectPdfEditor.tsx
const ProtectPdfEditorContent = `import React, { useState } from 'react';
import { Lock, Download, Settings2 } from 'lucide-react';

interface ProtectPdfEditorProps {
  tUi?: Record<string, string>;
  pdfPassword?: string;
  setPdfPassword: (pw: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ProtectPdfEditor: React.FC<ProtectPdfEditorProps> = ({
  tUi = {},
  pdfPassword = '',
  setPdfPassword,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const [confirmPassword, setConfirmPassword] = useState('');
  
  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={18} className="text-brand-primary" color="#3b82f6" />
          <span>{t("protect_pdf", "Protect PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("protect_desc", "Secure your PDF document with strong password encryption completely in your browser.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {t("new_password", "New Password")}
        </label>
        <input
          type="password"
          value={pdfPassword}
          onChange={(e) => setPdfPassword(e.target.value)}
          placeholder={t("enter_password_placeholder", "Enter password...")}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 8 }}>
          {t("confirm_password", "Confirm Password")}
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("retype_password_placeholder", "Retype password...")}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
        {pdfPassword && confirmPassword && pdfPassword !== confirmPassword && (
          <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>
            {t("passwords_not_match", "Passwords do not match.")}
          </span>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !pdfPassword || pdfPassword !== confirmPassword}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? t("protecting_btn", "Encrypting...") : t("apply_protect", "Apply PDF Encryption")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// 7. UnlockPdfEditor.tsx
const UnlockPdfEditorContent = `import React from 'react';
import { Unlock, Download, Settings2 } from 'lucide-react';

interface UnlockPdfEditorProps {
  tUi?: Record<string, string>;
  pdfPassword?: string;
  setPdfPassword: (pw: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const UnlockPdfEditor: React.FC<UnlockPdfEditorProps> = ({
  tUi = {},
  pdfPassword = '',
  setPdfPassword,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Unlock size={18} className="text-brand-primary" color="#3b82f6" />
          <span>{t("unlock_pdf", "Unlock PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("unlock_desc", "Remove password restrictions from your PDF document permanently in your browser.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {t("current_doc_password", "Current Document Password")}
        </label>
        <input
          type="password"
          value={pdfPassword}
          onChange={(e) => setPdfPassword(e.target.value)}
          placeholder={t("enter_password_placeholder", "Enter password...")}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--border-color)', background: 'var(--bg-input)',
            color: 'var(--text-main)', outline: 'none'
          }}
        />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !pdfPassword}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? t("unlocking_btn", "Unlocking...") : t("apply_unlock", "Unlock Document Now")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// 8. CropPdfEditor.tsx
const CropPdfEditorContent = `import React from 'react';
import { Crop, Settings } from 'lucide-react';

interface CropPdfEditorProps {
  tUi?: Record<string, string>;
  cropConfig: { marginTop: number; marginBottom: number; marginLeft: number; marginRight: number };
  setCropConfig: (config: any) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const CropPdfEditor: React.FC<CropPdfEditorProps> = ({
  tUi = {},
  cropConfig,
  setCropConfig,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  const handleChange = (key: string, value: number) => {
    setCropConfig({ ...cropConfig, [key]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'var(--brand-primary)', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Crop size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t("crop_pdf", "Crop PDF")}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {t("crop_desc", "Trim white margins around document pages visually.")}
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} /> {t("crop_pdf", "Margin Settings (%)")}
          </h3>

          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_top", "Top Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginTop}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginTop} onChange={(e) => handleChange('marginTop', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_bottom", "Bottom Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginBottom}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginBottom} onChange={(e) => handleChange('marginBottom', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_left", "Left Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginLeft}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginLeft} onChange={(e) => handleChange('marginLeft', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t("margin_right", "Right Margin")}</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{cropConfig.marginRight}%</span>
              </div>
              <input type="range" min="0" max="40" value={cropConfig.marginRight} onChange={(e) => handleChange('marginRight', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-primary)' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || (cropConfig.marginTop === 0 && cropConfig.marginBottom === 0 && cropConfig.marginLeft === 0 && cropConfig.marginRight === 0)}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 }}
        >
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Crop size={20} />{t("apply_crop", "Crop PDF Now")}</>
          )}
        </button>
      </div>
    </div>
  );
};
`;

// 9. RedactPdfEditor.tsx
const RedactPdfEditorContent = `import React from 'react';
import { EyeOff, PlusCircle, AlertTriangle } from 'lucide-react';

interface RedactPdfEditorProps {
  tUi?: Record<string, string>;
  redactConfig: {
    mode: 'black' | 'blur';
    showLock: boolean;
    boxes: Record<number, Array<{ id: string; x: number; y: number; width: number; height: number }>>;
  };
  setRedactConfig: React.Dispatch<React.SetStateAction<any>>;
  onProcess: () => void;
  isProcessing: boolean;
  activeFileIndex?: number;
}

export const RedactPdfEditor: React.FC<RedactPdfEditorProps> = ({
  tUi = {},
  redactConfig,
  setRedactConfig,
  onProcess,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  const addBox = (pageIndex: number) => {
    const newBox = {
      id: Math.random().toString(36).substring(7),
      x: 100,
      y: 100,
      width: 200,
      height: 40
    };
    setRedactConfig((prev: any) => {
      const pageBoxes = prev.boxes[pageIndex] || [];
      return {
        ...prev,
        boxes: {
          ...prev.boxes,
          [pageIndex]: [...pageBoxes, newBox]
        }
      };
    });
  };

  const totalBoxes = Object.values(redactConfig.boxes || {}).reduce((sum, list) => sum + list.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: '#ef4444', color: 'white', padding: '8px', borderRadius: 8 }}>
            <EyeOff size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t("redact_pdf", "Redact PDF")}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {t("redact_desc", "Permanently black out sensitive information and rasterize to prevent copying.")}
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div className="glass-panel" style={{ padding: '20px', marginBottom: 20 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 12 }}>
            {t("black_box_mode", "Black Box Mode")}
          </label>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button
              onClick={() => setRedactConfig((prev: any) => ({ ...prev, mode: 'black' }))}
              style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: redactConfig.mode === 'black' ? '#ef4444' : 'var(--bg-input)',
                color: redactConfig.mode === 'black' ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {t("black_box_mode", "Black Box Mode")}
            </button>
            <button
              onClick={() => setRedactConfig((prev: any) => ({ ...prev, mode: 'blur' }))}
              style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: redactConfig.mode === 'blur' ? '#3b82f6' : 'var(--bg-input)',
                color: redactConfig.mode === 'blur' ? '#fff' : 'var(--text-main)',
                border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {t("blur_mode", "Blur Mode")}
            </button>
          </div>

          <button
            onClick={() => addBox(0)}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8 }}
          >
            <PlusCircle size={18} /> {t("add_redact_box", "+ Add Redact Area (Page 1)")}
          </button>
        </div>

        <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, display: 'flex', gap: 12 }}>
          <AlertTriangle color="#ef4444" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171', lineHeight: 1.5 }}>
            {t("redact_desc", "Redacted areas are permanently burned into static pixels using pure WebAssembly.")}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button
          onClick={onProcess}
          disabled={isProcessing || totalBoxes === 0}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ef4444', borderRadius: 12 }}
        >
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><EyeOff size={20} />{t("apply_redaction", "Apply Permanent Redaction")}</>
          )}
        </button>
      </div>
    </div>
  );
};
`;

// 10. ComparePdfEditor.tsx
const ComparePdfEditorContent = `import React from 'react';
import { Scale, UploadCloud, File as FileIcon, X } from 'lucide-react';

interface ComparePdfEditorProps {
  tUi?: Record<string, string>;
  compareFile2?: File | null;
  setCompareFile2?: (file: File | null) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const ComparePdfEditor: React.FC<ComparePdfEditorProps> = ({
  tUi = {},
  compareFile2,
  setCompareFile2,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && setCompareFile2) {
      setCompareFile2(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 320, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Scale size={18} className="text-brand-primary" color="#10b981" />
          <span>{t("compare_pdf", "Compare PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("compare_desc", "Visually compare two PDF documents side-by-side with highlight diffs.")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {t("select_second_pdf", "Select Comparison PDF (Revised)")}
        </label>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
        />

        {compareFile2 ? (
          <div style={{ background: 'var(--bg-input)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <FileIcon size={20} className="text-brand-primary" />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{compareFile2.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{(compareFile2.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            {setCompareFile2 && (
              <button onClick={() => setCompareFile2(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '2px dashed var(--border-color)', background: 'var(--bg-input)', borderRadius: 12, cursor: 'pointer' }}
          >
            <UploadCloud size={28} className="text-brand-primary" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t("choose_second_pdf_btn", "Click to Upload Second PDF")}</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !compareFile2}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Scale size={18} /></div> : <Scale size={18} />}
          <span>{isProcessing ? t("comparing_btn", "Analyzing Differences...") : t("apply_compare", "Compare Documents Now")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// 11. GrayscalePdfEditor.tsx
const GrayscalePdfEditorContent = `import React from 'react';
import { Contrast, AlertTriangle } from 'lucide-react';

interface GrayscalePdfEditorProps {
  tUi?: Record<string, string>;
  onApply: () => void;
  isProcessing: boolean;
}

export const GrayscalePdfEditor: React.FC<GrayscalePdfEditorProps> = ({
  tUi = {},
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: '#64748b', color: 'white', padding: '8px', borderRadius: 8 }}>
            <Contrast size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t("grayscale_pdf", "Grayscale PDF")}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {t("grayscale_desc", "Convert all document colors and images to black & white grayscale for printing.")}
        </p>
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: 16, background: 'rgba(100, 116, 139, 0.1)', border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: 12, display: 'flex', gap: 12 }}>
          <AlertTriangle color="#94a3b8" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {t("local_privacy_badge", "✨ 100% Client-Side Privacy: Your files never leave your device.")}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#475569', borderRadius: 12 }}
        >
          {isProcessing ? (
            <span className="spinner" style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <><Contrast size={20} />{t("apply_grayscale", "Convert to Grayscale")}</>
          )}
        </button>
      </div>
    </div>
  );
};
`;

// 12. ReversePdfEditor.tsx
const ReversePdfEditorContent = `import React from 'react';
import { ArrowDownUp, Download, RotateCw } from 'lucide-react';

interface ReversePdfEditorProps {
  tUi?: Record<string, string>;
  onApply: () => void;
  isProcessing: boolean;
}

export const ReversePdfEditor: React.FC<ReversePdfEditorProps> = ({
  tUi = {},
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowDownUp size={18} className="text-brand-primary" />
          <span>{t("reverse_pdf", "Reverse PDF")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("reverse_desc", "Reverse document page sequence from back to front (e.g. 1-2-3 becomes 3-2-1).")}
        </p>
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
          <span>{isProcessing ? t("reversing_btn", "Reversing...") : t("apply_reverse", "Reverse Page Order")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// 13. RemovePdfEditor.tsx
const RemovePdfEditorContent = `import React from 'react';
import { Trash2, Download, Settings2, Info } from 'lucide-react';

interface RemovePdfEditorProps {
  tUi?: Record<string, string>;
  removeRange: string;
  setRemoveRange: (val: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

export const RemovePdfEditor: React.FC<RemovePdfEditorProps> = ({
  tUi = {},
  removeRange,
  setRemoveRange,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280, height: '100%' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trash2 size={18} className="text-brand-primary" color="#ef4444" />
          <span>{t("remove_pdf", "Remove Pages")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t("remove_desc", "Permanently delete unwanted pages from your document.")}
        </p>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)', display: 'block', marginBottom: 8 }}>
          {t("pages_to_remove_label", "Pages to Delete (e.g. 1, 3-5)")}
        </label>
        <input
          type="text"
          value={removeRange}
          onChange={(e) => setRemoveRange(e.target.value)}
          placeholder="e.g. 1, 3-5, 8"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
        />
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={16} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: '#f87171', margin: 0, lineHeight: 1.4 }}>
            {t("remove_hint", 'Pages in this range will be marked with a red "REMOVE" label in the Live Preview.')}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing || !removeRange.trim()}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#ef4444', borderRadius: 12 }}
        >
          {isProcessing ? <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div> : <Download size={18} />}
          <span>{isProcessing ? t("removing_btn", "Deleting...") : t("apply_remove", "Delete Pages Now")}</span>
        </button>
      </div>
    </div>
  );
};
`;

// Write additional files
fs.writeFileSync('src/components/tools/ProtectPdfEditor.tsx', ProtectPdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/UnlockPdfEditor.tsx', UnlockPdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/CropPdfEditor.tsx', CropPdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/RedactPdfEditor.tsx', RedactPdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/ComparePdfEditor.tsx', ComparePdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/GrayscalePdfEditor.tsx', GrayscalePdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/ReversePdfEditor.tsx', ReversePdfEditorContent, 'utf-8');
fs.writeFileSync('src/components/tools/RemovePdfEditor.tsx', RemovePdfEditorContent, 'utf-8');

console.log("✅ Successfully patched remaining tool editor components!");

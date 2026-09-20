import React from 'react';
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

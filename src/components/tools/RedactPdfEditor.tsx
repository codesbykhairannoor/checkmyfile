import React from 'react';
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

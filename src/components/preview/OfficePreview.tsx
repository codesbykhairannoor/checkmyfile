import React, { useState } from 'react';
import { Copy, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface OfficePreviewProps {
  isDocx: boolean;
  isText: boolean;
  isLoadingPreview: boolean;
  docxContainerRef: React.RefObject<HTMLDivElement | null>;
  textPreviewContent: string | null;
}

export const OfficePreview: React.FC<OfficePreviewProps> = ({
  isDocx, isText, isLoadingPreview, docxContainerRef, textPreviewContent
}) => {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleCopy = () => {
    if (textPreviewContent) {
      navigator.clipboard.writeText(textPreviewContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {isDocx && (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto', background: 'transparent', opacity: isLoadingPreview ? 0 : 1, transition: 'opacity 0.2s ease' }}>
          {!isLoadingPreview && (
            <div style={{ position: 'sticky', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: 999, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="btn-secondary" style={{ border: 'none', padding: 4, background: 'transparent' }}><ZoomOut size={16} /></button>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 40, textAlign: 'center', color: '#1a202c' }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="btn-secondary" style={{ border: 'none', padding: 4, background: 'transparent' }}><ZoomIn size={16} /></button>
            </div>
          )}
          <div
            ref={docxContainerRef}
            className="docx-live-preview-container"
            style={{ width: '100%', minHeight: '100%', zoom: zoom }}
          />
        </div>
      )}


      {isText && textPreviewContent && !isLoadingPreview && (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <button 
              onClick={handleCopy}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span style={{ color: copied ? '#10b981' : 'inherit', fontWeight: 600 }}>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>
          <div
            style={{ width: '100%', flex: 1, overflow: 'auto', padding: '32px', paddingTop: '56px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.9rem', color: '#334155' }}
          >
            {textPreviewContent}
          </div>
        </div>
      )}
    </>
  );
};

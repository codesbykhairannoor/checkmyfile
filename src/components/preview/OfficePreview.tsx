import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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
        <div
          ref={docxContainerRef}
          className="docx-live-preview-container"
          style={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto', background: 'transparent', opacity: isLoadingPreview ? 0 : 1, transition: 'opacity 0.2s ease' }}
        />
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

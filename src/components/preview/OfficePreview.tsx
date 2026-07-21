import React from 'react';

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
  return (
    <>
      {isDocx && (
        <div
          ref={docxContainerRef}
          style={{ width: '100%', flex: 1, minHeight: '100%', overflow: 'auto', padding: '32px 36px', color: '#1a202c', fontSize: '0.88rem', lineHeight: 1.7, background: 'transparent', opacity: isLoadingPreview ? 0 : 1, transition: 'opacity 0.2s ease' }}
        />
      )}


      {isText && textPreviewContent && !isLoadingPreview && (
        <div
          style={{ width: '100%', flex: 1, minHeight: '100%', overflow: 'auto', padding: '32px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.9rem', color: '#334155', background: '#f8fafc' }}
        >
          {textPreviewContent}
        </div>
      )}
    </>
  );
};

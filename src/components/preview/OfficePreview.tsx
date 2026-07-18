import React from 'react';

interface OfficePreviewProps {
  isDocx: boolean;
  isSpreadsheet: boolean;
  isText: boolean;
  isLoadingPreview: boolean;
  docxContainerRef: React.RefObject<HTMLDivElement | null>;
  spreadsheetHtml: string | null;
  textPreviewContent: string | null;
}

export const OfficePreview: React.FC<OfficePreviewProps> = ({
  isDocx, isSpreadsheet, isText, isLoadingPreview, docxContainerRef, spreadsheetHtml, textPreviewContent
}) => {
  return (
    <>
      {isDocx && !isLoadingPreview && (
        <div
          ref={docxContainerRef}
          style={{ width: '100%', height: '100%', overflow: 'auto', padding: '32px 36px', color: '#1a202c', fontSize: '0.88rem', lineHeight: 1.7, background: 'transparent' }}
        />
      )}

      {isSpreadsheet && spreadsheetHtml && !isLoadingPreview && (
        <div
          style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px', background: '#fff' }}
          dangerouslySetInnerHTML={{ __html: spreadsheetHtml }}
        />
      )}

      {isText && textPreviewContent && !isLoadingPreview && (
        <div
          style={{ width: '100%', height: '100%', overflow: 'auto', padding: '32px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.9rem', color: '#334155', background: '#f8fafc' }}
        >
          {textPreviewContent}
        </div>
      )}
    </>
  );
};

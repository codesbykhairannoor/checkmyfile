import React from 'react';
import LazyPdfPage from './LazyPdfPage';

interface PdfPreviewProps {
  pdfDoc: any;
  isLoadingPreview: boolean;
  watermarkConfig?: { type?: 'text' | 'image'; text: string; imageUrl?: string; opacity: number; color: string; scale: number; rotation: number; };
  pageNumberConfig?: any;
  totalPages: number;
  containerWidth?: number;
  containerHeight?: number;
  splitRange?: string;
  compressQuality?: 'extreme' | 'balanced' | 'high';
  previewRotate: number;
  externalRotate?: number;
  pixelWidth: number;
  paperShadow: string;
  pageAspectRatio: number;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfDoc, isLoadingPreview, watermarkConfig, pageNumberConfig, totalPages, containerWidth, containerHeight, splitRange, compressQuality,
  previewRotate, externalRotate, pixelWidth, paperShadow, pageAspectRatio
}) => {
  if (isLoadingPreview || !pdfDoc) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', alignItems: 'center', paddingBottom: 64 }}>
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        const totalRotate = ((externalRotate !== undefined ? externalRotate : previewRotate) % 360 + 360) % 360;

        return (
          <div id={`pdf-page-${pageNum}`} key={i} style={{ position: 'relative', width: pixelWidth ? `${pixelWidth}px` : '100%' }}>
            <LazyPdfPage
              pdfDoc={pdfDoc}
              pageNum={pageNum}
              zoomScale={1.0}
              totalRotate={totalRotate}
              wrapperWidth={pixelWidth || 600}
              paperShadow={paperShadow}
              defaultRatio={pageAspectRatio}
            />

            {/* Overlays */}
            {watermarkConfig && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 20 }}>
                <div style={{
                  transform: `rotate(${watermarkConfig.rotation}deg) scale(${watermarkConfig.scale})`,
                  opacity: watermarkConfig.opacity, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {watermarkConfig.type === 'image' && watermarkConfig.imageUrl ? (
                    <img src={watermarkConfig.imageUrl} alt="Watermark" style={{ width: '50%', height: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ 
                      color: watermarkConfig.color, 
                      fontSize: `${Math.min(containerWidth || 600, containerHeight || 800) / 9}px`,
                      fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Helvetica, Arial, sans-serif' 
                    }}>
                      {watermarkConfig.text}
                    </span>
                  )}
                </div>
              </div>
            )}

            {pageNumberConfig && (() => {
              if (pageNum < pageNumberConfig.startPage) return null;
              
              const currentNumber = pageNumberConfig.startNumber + (pageNum - pageNumberConfig.startPage);
              const text = (pageNumberConfig.format || '{n}')
                .replace('{n}', currentNumber.toString())
                .replace('{p}', totalPages.toString());

              return (
                <div style={{
                  position: 'absolute', inset: 32, pointerEvents: 'none', display: 'flex',
                  alignItems: pageNumberConfig.position.startsWith('top') ? 'flex-start' : 'flex-end',
                  justifyContent: pageNumberConfig.position.endsWith('left') ? 'flex-start' : pageNumberConfig.position.endsWith('right') ? 'flex-end' : 'center',
                  zIndex: 20
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', background: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: 4 }}>
                    {text}
                  </div>
                </div>
              );
            })()}

            {splitRange !== undefined && (() => {
              const isSelected = (() => {
                if (!splitRange.trim()) return true;
                const parts = splitRange.split(',');
                for (const part of parts) {
                  const trimmed = part.trim();
                  if (trimmed.includes('-')) {
                    const [s, e] = trimmed.split('-').map(Number);
                    if (!isNaN(s) && !isNaN(e) && pageNum >= s && pageNum <= e) return true;
                  } else {
                    const n = parseInt(trimmed);
                    if (!isNaN(n) && n === pageNum) return true;
                  }
                }
                return false;
              })();

              if (!isSelected) {
                return (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                    <span style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>DILEWATI</span>
                  </div>
                );
              }
              return (
                <div style={{ position: 'absolute', inset: 0, border: '4px solid #10b981', zIndex: 30, pointerEvents: 'none', borderRadius: 4 }}>
                  <span style={{ position: 'absolute', top: 16, right: 16, background: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem' }}>✓ DIEKSTRAK</span>
                </div>
              );
            })()}

            {compressQuality && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backdropFilter: compressQuality === 'extreme' ? 'blur(1.5px) contrast(1.1)' : compressQuality === 'balanced' ? 'blur(0.5px)' : 'none',
                backgroundColor: compressQuality === 'extreme' ? 'rgba(255,255,255,0.05)' : 'transparent',
                zIndex: 15, borderRadius: 4
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';

interface PdfPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoadingPreview: boolean;
  watermarkConfig?: { text: string; opacity: number; color: string; scale: number; rotation: number; };
  pageNumberConfig?: { position: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right' };
  pageNumber: number;
  splitRange?: string;
  compressQuality?: 'extreme' | 'balanced' | 'high';
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  canvasRef, isLoadingPreview, watermarkConfig, pageNumberConfig, pageNumber, splitRange, compressQuality
}) => {
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: isLoadingPreview ? 'none' : 'block',
          width: '100%',
          height: '100%',
          objectFit: 'fill',
        }}
      />

      {watermarkConfig && !isLoadingPreview && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 20 }}>
          <div style={{
            transform: `rotate(${watermarkConfig.rotation}deg) scale(${watermarkConfig.scale})`,
            opacity: watermarkConfig.opacity, color: watermarkConfig.color, fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)',
          }}>
            {watermarkConfig.text}
          </div>
        </div>
      )}

      {pageNumberConfig && !isLoadingPreview && (
        <div style={{
          position: 'absolute', inset: 20, pointerEvents: 'none', display: 'flex',
          alignItems: pageNumberConfig.position.startsWith('top') ? 'flex-start' : 'flex-end',
          justifyContent: pageNumberConfig.position.endsWith('left') ? 'flex-start' : pageNumberConfig.position.endsWith('right') ? 'flex-end' : 'center',
          zIndex: 20
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', background: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: 4 }}>
            {pageNumber}
          </div>
        </div>
      )}

      {splitRange !== undefined && !isLoadingPreview && (
        (() => {
          const isSelected = (() => {
            if (!splitRange.trim()) return true;
            const parts = splitRange.split(',');
            for (const part of parts) {
              const trimmed = part.trim();
              if (trimmed.includes('-')) {
                const [s, e] = trimmed.split('-').map(Number);
                if (!isNaN(s) && !isNaN(e) && pageNumber >= s && pageNumber <= e) return true;
              } else {
                const n = parseInt(trimmed);
                if (!isNaN(n) && n === pageNumber) return true;
              }
            }
            return false;
          })();

          if (!isSelected) {
            return (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>DILEWATI</span>
              </div>
            );
          }
          return (
            <div style={{ position: 'absolute', inset: 0, border: '4px solid #10b981', zIndex: 30, pointerEvents: 'none', borderRadius: 3 }}>
              <span style={{ position: 'absolute', top: 16, right: 16, background: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem' }}>✓ DIEKSTRAK</span>
            </div>
          );
        })()
      )}

      {compressQuality && !isLoadingPreview && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backdropFilter: compressQuality === 'extreme' ? 'blur(1.5px) contrast(1.1)' : compressQuality === 'balanced' ? 'blur(0.5px)' : 'none',
          backgroundColor: compressQuality === 'extreme' ? 'rgba(255,255,255,0.05)' : 'transparent',
          zIndex: 15
        }} />
      )}
    </>
  );
};

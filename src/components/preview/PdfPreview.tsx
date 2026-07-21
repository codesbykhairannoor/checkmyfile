import React, { useState, useEffect, useRef } from 'react';
import LazyPdfPage from './LazyPdfPage';

const DraggableSignature = ({ config, onUpdate }: { config: any, onUpdate: (x: number, y: number) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startConfig = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current?.parentElement) return;
      const parent = containerRef.current.parentElement;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      
      const newX = startConfig.current.x + (dx / parent.clientWidth) * 100;
      const newY = startConfig.current.y + (dy / parent.clientHeight) * 100;
      
      onUpdate(Math.max(0, Math.min(100 - config.width, newX)), Math.max(0, Math.min(100 - config.height, newY)));
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, config, onUpdate]);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        startConfig.current = { x: config.x, y: config.y };
        e.preventDefault();
      }}
      style={{
        position: 'absolute',
        left: `${config.x}%`,
        top: `${config.y}%`,
        width: `${config.width}%`,
        height: `${config.height}%`,
        zIndex: 40,
        border: '2px dashed #8b5cf6',
        background: 'rgba(139, 92, 246, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}>
      <img src={config.imageUrl} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', top: -24, left: 0, background: '#8b5cf6', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>Tanda Tangan (Geser)</span>
    </div>
  );
};

const DraggableRedactBox = ({ config, onUpdate }: { config: any, onUpdate: (x: number, y: number, w: number, h: number) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startConfig = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current?.parentElement) return;
      const parent = containerRef.current.parentElement;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      
      if (isDragging) {
        const newX = startConfig.current.x + (dx / parent.clientWidth) * 100;
        const newY = startConfig.current.y + (dy / parent.clientHeight) * 100;
        onUpdate(Math.max(0, Math.min(100 - config.width, newX)), Math.max(0, Math.min(100 - config.height, newY)), config.width, config.height);
      } else if (isResizing) {
        const newW = startConfig.current.w + (dx / parent.clientWidth) * 100;
        const newH = startConfig.current.h + (dy / parent.clientHeight) * 100;
        onUpdate(config.x, config.y, Math.max(5, Math.min(100 - config.x, newW)), Math.max(5, Math.min(100 - config.y, newH)));
      }
    };

    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, config, onUpdate]);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).className.includes('resize-handle')) return;
        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        startConfig.current = { x: config.x, y: config.y, w: config.width, h: config.height };
        e.preventDefault();
      }}
      style={{
        position: 'absolute',
        left: `${config.x}%`,
        top: `${config.y}%`,
        width: `${config.width}%`,
        height: `${config.height}%`,
        zIndex: 40,
        background: '#000000',
        border: '2px solid #ef4444',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}>
      <span style={{ position: 'absolute', top: -24, left: 0, background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>Area Sensor (Geser)</span>
      
      {/* Resize Handle */}
      <div 
        className="resize-handle"
        onMouseDown={(e) => {
          setIsResizing(true);
          startPos.current = { x: e.clientX, y: e.clientY };
          startConfig.current = { x: config.x, y: config.y, w: config.width, h: config.height };
          e.stopPropagation();
          e.preventDefault();
        }}
        style={{
          position: 'absolute', bottom: -6, right: -6, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', cursor: 'se-resize', zIndex: 41
        }} 
      />
    </div>
  );
};


interface PdfPreviewProps {
  pdfDoc: any;
  isLoadingPreview: boolean;
  watermarkConfig?: { type?: 'text' | 'image'; text: string; imageUrl?: string; opacity: number; color: string; scale: number; rotation: number; };
  pageNumberConfig?: any;
  cropConfig?: any;
  totalPages: number;
  containerWidth?: number;
  containerHeight?: number;
  splitRange?: string;
  removeRange?: string;
  signatureConfig?: { pageIndex: number; x: number; y: number; width: number; height: number; imageUrl: string; };
  onSignatureUpdate?: (x: number, y: number, pageIndex?: number) => void;
  redactConfig?: Record<number, Array<{ id: string, x: number, y: number, width: number, height: number }>>;
  setRedactConfig?: React.Dispatch<React.SetStateAction<any>>;
  compressQuality?: 'extreme' | 'balanced' | 'high';
  previewRotate: number;
  externalRotate?: number;
  pixelWidth: number;
  paperShadow: string;
  pageAspectRatio: number;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfDoc, isLoadingPreview, watermarkConfig, pageNumberConfig, cropConfig, totalPages, containerWidth, containerHeight, splitRange, removeRange, signatureConfig, onSignatureUpdate, redactConfig, setRedactConfig, compressQuality,
  previewRotate, externalRotate, pixelWidth, paperShadow, pageAspectRatio
}) => {
  if (isLoadingPreview || !pdfDoc) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', alignItems: 'center', paddingBottom: 64 }}>
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        const totalRotate = ((externalRotate !== undefined ? externalRotate : previewRotate) % 360 + 360) % 360;

        return (
          <div 
            id={`pdf-page-${pageNum}`} 
            key={i} 
            style={{ position: 'relative', width: pixelWidth ? `${pixelWidth}px` : '100%', cursor: onSignatureUpdate ? 'crosshair' : 'default' }}
            onClick={(e) => {
              if (onSignatureUpdate && signatureConfig && signatureConfig.pageIndex !== (pageNum - 1)) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                onSignatureUpdate(Math.max(0, Math.min(100 - signatureConfig.width, x)), Math.max(0, Math.min(100 - signatureConfig.height, y)), pageNum - 1);
              }
            }}
          >
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

            {cropConfig && (
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 25 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${cropConfig.marginTop}%`, background: 'rgba(0,0,0,0.5)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${cropConfig.marginBottom}%`, background: 'rgba(0,0,0,0.5)' }} />
                <div style={{ position: 'absolute', top: `${cropConfig.marginTop}%`, bottom: `${cropConfig.marginBottom}%`, left: 0, width: `${cropConfig.marginLeft}%`, background: 'rgba(0,0,0,0.5)' }} />
                <div style={{ position: 'absolute', top: `${cropConfig.marginTop}%`, bottom: `${cropConfig.marginBottom}%`, right: 0, width: `${cropConfig.marginRight}%`, background: 'rgba(0,0,0,0.5)' }} />
                <div style={{
                  position: 'absolute',
                  top: `${cropConfig.marginTop}%`,
                  bottom: `${cropConfig.marginBottom}%`,
                  left: `${cropConfig.marginLeft}%`,
                  right: `${cropConfig.marginRight}%`,
                  border: '2px dashed var(--brand-primary)',
                }}>
                  <div style={{ position: 'absolute', top: -24, left: 0, background: 'var(--brand-primary)', color: 'white', padding: '2px 8px', fontSize: '0.75rem', borderRadius: 4, fontWeight: 700 }}>
                    Area Pemotongan
                  </div>
                </div>
              </div>
            )}

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

            {removeRange !== undefined && (() => {
              const isRemoved = (() => {
                if (!removeRange.trim()) return false;
                const parts = removeRange.split(',');
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

              if (isRemoved) {
                return (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.15)', border: '4px solid #ef4444', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                    <span style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>X DIHAPUS</span>
                  </div>
                );
              }
              return null;
            })()}

            {signatureConfig && signatureConfig.pageIndex === (pageNum - 1) && onSignatureUpdate && (
              <DraggableSignature config={signatureConfig} onUpdate={onSignatureUpdate} />
            )}

            {redactConfig && redactConfig[pageNum - 1]?.map((box) => (
              <DraggableRedactBox 
                key={box.id} 
                config={box} 
                onUpdate={(x, y, w, h) => {
                  if (setRedactConfig) {
                    setRedactConfig((prev: any) => {
                      const pageBoxes = prev[pageNum - 1] || [];
                      return {
                        ...prev,
                        [pageNum - 1]: pageBoxes.map((b: any) => b.id === box.id ? { ...b, x, y, width: w, height: h } : b)
                      };
                    });
                  }
                }} 
              />
            ))}

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

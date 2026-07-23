import React, { useState, useEffect, useRef } from 'react';
import LazyPdfPage from './LazyPdfPage';

const toRoman = (num: number): string => {
  if (num < 1) return '';
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const rom = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let roman = '';
  for (let i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      roman += rom[i];
      num -= val[i];
    }
  }
  return roman;
};

const toAlpha = (num: number): string => {
  if (num < 1) return '';
  let alpha = '';
  while (num > 0) {
    const r = (num - 1) % 26;
    alpha = String.fromCharCode(65 + r) + alpha;
    num = Math.floor((num - r) / 26);
  }
  return alpha;
};

const formatNumber = (num: number, style?: string): string => {
  switch (style) {
    case 'roman_upper': return toRoman(num);
    case 'roman_lower': return toRoman(num).toLowerCase();
    case 'alpha_upper': return toAlpha(num);
    case 'alpha_lower': return toAlpha(num).toLowerCase();
    case 'arabic':
    default: return num.toString();
  }
};

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

const DraggableEditElement = ({ 
  element, 
  isSelected, 
  onClick, 
  onUpdate 
}: { 
  element: any; 
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<any>) => void;
}) => {
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
      
      onUpdate({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
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
  }, [isDragging, onUpdate]);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        startConfig.current = { x: element.x, y: element.y };
        onClick();
        e.stopPropagation();
        e.preventDefault();
      }}
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: element.type === 'image' ? `${element.width}%` : 'auto',
        height: element.type === 'image' ? `${element.height}%` : 'auto',
        zIndex: 50,
        border: isSelected ? '2px dashed #3b82f6' : '1px solid transparent',
        background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        display: 'flex', 
        alignItems: element.type === 'image' ? 'center' : 'flex-start', 
        justifyContent: element.type === 'image' ? 'center' : 'flex-start',
        cursor: isDragging ? 'grabbing' : 'grab',
        padding: element.type === 'text' ? '4px 8px' : 0,
      }}>
      
      {element.type === 'text' && (
        <div style={{
          color: element.color,
          fontSize: `${element.fontSize}px`,
          fontFamily: element.fontFamily === 'bold' ? 'Helvetica, Arial, sans-serif' : 'Helvetica, Arial, sans-serif',
          fontWeight: element.fontFamily === 'bold' ? 'bold' : 'normal',
          whiteSpace: 'pre-wrap',
          pointerEvents: 'none'
        }}>
          {element.text}
        </div>
      )}

      {element.type === 'image' && element.imageUrl && (
        <img src={element.imageUrl} alt="Edit Element" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
      )}
    </div>
  );
};

const DraggableRedactBox = ({ config, mode, showLock, onUpdate }: { config: any, mode: string, showLock: boolean, onUpdate: (x: number, y: number, w: number, h: number) => void }) => {
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
        background: mode === 'blur' ? 'transparent' : '#000000',
        backdropFilter: mode === 'blur' ? 'blur(8px)' : 'none',
        border: mode === 'blur' ? '1px dashed #64748b' : '2px solid #ef4444',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <span style={{ position: 'absolute', top: -24, left: 0, background: mode === 'blur' ? '#64748b' : '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>Area Sensor (Geser)</span>
      
      {showLock && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mode === 'blur' ? '#334155' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}
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
  redactConfig?: any;
  setRedactConfig?: React.Dispatch<React.SetStateAction<any>>;
  compressQuality?: 'extreme' | 'balanced' | 'high';
  previewRotate: number;
  externalRotate?: number;
  pixelWidth: number;
  paperShadow: string;
  pageAspectRatio: number;
  resizeConfig?: { pageSize: string; orientation: string; margin: number };
  editElements?: any[];
  setEditElements?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedEditId?: string | null;
  setSelectedEditId?: (id: string | null) => void;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfDoc, isLoadingPreview, watermarkConfig, pageNumberConfig, cropConfig, totalPages, containerWidth, containerHeight, splitRange, removeRange, signatureConfig, onSignatureUpdate, redactConfig, setRedactConfig, compressQuality,
  previewRotate, externalRotate, pixelWidth, paperShadow, pageAspectRatio, resizeConfig, editElements, setEditElements, selectedEditId, setSelectedEditId
}) => {
  if (isLoadingPreview || !pdfDoc) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', alignItems: 'center', paddingBottom: 64 }}>
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        const totalRotate = ((externalRotate !== undefined ? externalRotate : previewRotate) % 360 + 360) % 360;
        
        let wrapperHeight = undefined;
        let innerScale = 1;
        
        if (resizeConfig) {
          const PAGE_SIZES: Record<string, [number, number]> = {
            'A4': [595.28, 841.89],
            'A3': [841.89, 1190.55],
            'Letter': [612, 792],
            'Legal': [612, 1008]
          };
          let [targetW, targetH] = PAGE_SIZES[resizeConfig.pageSize] || PAGE_SIZES['A4'];
          
          if (resizeConfig.orientation === 'Portrait' && targetW > targetH) {
            [targetW, targetH] = [targetH, targetW];
          } else if (resizeConfig.orientation === 'Landscape' && targetW < targetH) {
            [targetW, targetH] = [targetH, targetW];
          } else if (resizeConfig.orientation === 'Auto') {
            if ((pageAspectRatio > 1 && targetW < targetH) || (pageAspectRatio < 1 && targetW > targetH)) {
              [targetW, targetH] = [targetH, targetW];
            }
          }
          
          const targetRatio = targetW / targetH;
          wrapperHeight = pixelWidth / targetRatio;
          
          // Calculate scale to fit the original PDF inside the new paper size (minus margin)
          const availableW = pixelWidth - (resizeConfig.margin * 2);
          const availableH = wrapperHeight - (resizeConfig.margin * 2);
          
          const origW = availableW;
          const origH = origW / pageAspectRatio;
          
          if (origH > availableH) {
             innerScale = availableH / origH;
          }
        }

        return (
          <div 
            id={`pdf-page-${pageNum}`} 
            key={i} 
            style={{ 
              position: 'relative', 
              width: pixelWidth ? `${pixelWidth}px` : '100%', 
              height: wrapperHeight ? `${wrapperHeight}px` : 'auto',
              cursor: onSignatureUpdate ? 'crosshair' : 'default',
              background: resizeConfig ? '#ffffff' : 'transparent',
              boxShadow: resizeConfig ? paperShadow : 'none',
              display: resizeConfig ? 'flex' : 'block',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
            onClick={(e) => {
              if (onSignatureUpdate && signatureConfig && signatureConfig.pageIndex !== (pageNum - 1)) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                onSignatureUpdate(Math.max(0, Math.min(100 - signatureConfig.width, x)), Math.max(0, Math.min(100 - signatureConfig.height, y)), pageNum - 1);
              }
            }}
          >
            <div style={{
              transform: resizeConfig ? `scale(${innerScale})` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: resizeConfig ? (pixelWidth - (resizeConfig.margin * 2)) : '100%'
            }}>
              <LazyPdfPage
                pdfDoc={pdfDoc}
                pageNum={pageNum}
                zoomScale={1.0}
                totalRotate={totalRotate}
                wrapperWidth={resizeConfig ? (pixelWidth - (resizeConfig.margin * 2)) : (pixelWidth || 600)}
                paperShadow={resizeConfig ? 'none' : paperShadow}
                defaultRatio={pageAspectRatio}
              />
            </div>

            {/* Overlays */}
            {editElements && setEditElements && setSelectedEditId && (
              <>
                {editElements.filter(el => el.pageIndex === (pageNum - 1)).map(el => (
                  <DraggableEditElement
                    key={el.id}
                    element={el}
                    isSelected={selectedEditId === el.id}
                    onClick={() => setSelectedEditId(el.id)}
                    onUpdate={(updates) => setEditElements(prev => prev.map(e => e.id === el.id ? { ...e, ...updates } : e))}
                  />
                ))}
              </>
            )}

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
              const formattedNumber = formatNumber(currentNumber, pageNumberConfig.numberStyle);
              const formattedTotal = formatNumber(totalPages, pageNumberConfig.numberStyle);
              
              const text = (pageNumberConfig.format || '{n}')
                .replace('{n}', formattedNumber)
                .replace('{p}', formattedTotal);

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

            {redactConfig && redactConfig.boxes && redactConfig.boxes[pageNum - 1]?.map((box: any) => (
              <DraggableRedactBox 
                key={box.id} 
                config={box} 
                mode={redactConfig.mode || 'black'}
                showLock={redactConfig.showLock || false}
                onUpdate={(x, y, w, h) => {
                  if (setRedactConfig) {
                    setRedactConfig((prev: any) => {
                      const pageBoxes = prev.boxes[pageNum - 1] || [];
                      return {
                        ...prev,
                        boxes: {
                          ...prev.boxes,
                          [pageNum - 1]: pageBoxes.map((b: any) => b.id === box.id ? { ...b, x, y, width: w, height: h } : b)
                        }
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

import React, { useEffect, useRef, useState } from 'react';
import { Presentation } from 'lucide-react';
import { unzipSync } from 'fflate';
import { decode, parseSlideXml } from '../../engines/office/pptxToPdf';
import type { ParsedSlide } from '../../engines/office/pptxToPdf';

interface PptxPreviewProps {
  file: File;
  zoomScale?: number;
}

interface SlideRenderData extends ParsedSlide {
  // Map of imgKey to base64 data URL
  images: Record<string, string>;
}

export const PptxPreview: React.FC<PptxPreviewProps> = ({ file, zoomScale = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideRenderData[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    let lastWidth = 0;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (Math.abs(newWidth - lastWidth) > 20) {
          lastWidth = newWidth;
          setContainerWidth(newWidth);
        }
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    const render = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[PptxPreview] Starting custom render...');
        const buffer = await file.arrayBuffer();
        if (cancelled) return;
        
        const unzipped = unzipSync(new Uint8Array(buffer));
        
        const slideKeys = Object.keys(unzipped)
          .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
          .sort((a, b) => {
            const na = parseInt(a.match(/\d+/)?.[0] || '0');
            const nb = parseInt(b.match(/\d+/)?.[0] || '0');
            return na - nb;
          });

        if (slideKeys.length === 0) throw new Error('No slides found');

        const parsedSlides: SlideRenderData[] = [];
        
        for (const key of slideKeys) {
          if (cancelled) return;
          const slideXml = decode(unzipped[key]);
          const parsed = parseSlideXml(slideXml, key, unzipped);
          
          const images: Record<string, string> = {};
          
          // Process images for this slide safely
          for (const shape of parsed.shapes) {
            if (shape.type === 'image' && shape.imgKey && unzipped[shape.imgKey]) {
              if (!images[shape.imgKey]) {
                const imgBytes = unzipped[shape.imgKey];
                const ext = shape.imgKey.split('.').pop()?.toLowerCase() || 'png';
                const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : 'image/png';
                const blob = new Blob([imgBytes], { type: mime });
                images[shape.imgKey] = URL.createObjectURL(blob);
              }
            }
          }
          parsedSlides.push({ ...parsed, images });
        }

        if (cancelled) return;
        setSlides(parsedSlides);
      } catch (err: any) {
        if (!cancelled) {
          console.error('[PptxPreview] error:', err);
          setError('Gagal memuat pratinjau presentasi. File mungkin memiliki format yang tidak didukung.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();

    return () => {
      cancelled = true;
      // Clean up object URLs
      slides.forEach(s => {
        Object.values(s.images).forEach(url => URL.revokeObjectURL(url));
      });
    };
  }, [file]);

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 12, padding: 24, textAlign: 'center', color: '#ef4444' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>
      {/* Slide counter badge */}
      {slides.length > 0 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
            <Presentation size={12} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            {slides.length} slide{slides.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Memuat slide presentasi&hellip;</p>
        </div>
      )}

      {/* Render Custom Slides */}
      {!loading && slides.length > 0 && containerWidth > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', padding: '0 8px 16px 8px' }}>
          {slides.map((slide, idx) => {
            const scale = (containerWidth / slide.slideWidth) * zoomScale;
            const scaledWidth = containerWidth * zoomScale;
            const scaledHeight = slide.slideHeight * scale;

            return (
              <div
                key={idx}
                className="pptx-slide-preview"
                style={{
                  position: 'relative',
                  width: scaledWidth,
                  height: scaledHeight,
                  backgroundColor: slide.bgColor,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {/* Scale wrapper so we don't have to recalculate all shape dimensions */}
                <div style={{
                  position: 'absolute',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: slide.slideWidth,
                  height: slide.slideHeight,
                }}>
                  {slide.shapes.map((shape, sIdx) => {
                    const baseStyle: React.CSSProperties = {
                      position: 'absolute',
                      left: shape.x,
                      top: shape.y,
                      width: shape.w,
                      height: shape.h,
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                    };

                    if (shape.type === 'image' && shape.imgKey && slide.images[shape.imgKey]) {
                      return (
                        <div key={sIdx} style={baseStyle}>
                          <img 
                            src={slide.images[shape.imgKey]} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                            alt="" 
                          />
                        </div>
                      );
                    }

                    if (shape.type === 'text' && shape.text) {
                      return (
                        <div key={sIdx} style={{
                          ...baseStyle,
                          backgroundColor: shape.bgColor !== 'transparent' ? shape.bgColor : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                        }}>
                          <span style={{
                            fontFamily: 'Calibri, Arial, sans-serif',
                            fontSize: `${shape.fontSize}px`,
                            fontWeight: shape.bold ? 700 : 400,
                            color: shape.color,
                            textAlign: shape.align as any || 'left',
                            width: '100%',
                            wordBreak: 'break-word',
                            lineHeight: 1.3,
                            whiteSpace: 'pre-wrap'
                          }}>
                            {shape.text}
                          </span>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

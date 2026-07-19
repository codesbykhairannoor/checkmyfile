import React, { useEffect, useRef, useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight } from 'lucide-react';

interface PptxPreviewProps {
  file: File;
}

export const PptxPreview: React.FC<PptxPreviewProps> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSlides, setTotalSlides] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    let lastWidth = 0;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        // Only update if width changes by more than 20px to prevent infinite render loops
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
    if (!file || !containerRef.current || containerWidth === 0) return;
    let cancelled = false;

    const render = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[PptxPreview] Starting render...');
        // Dynamically import to avoid SSR/build issues
        const pptxPreviewLib = await import('pptx-preview');
        console.log('[PptxPreview] Imported lib:', pptxPreviewLib);
        const init = pptxPreviewLib.init || (pptxPreviewLib as any).default?.init;
        if (!init) throw new Error('pptx-preview library init not found');

        // pptx-preview relies heavily on JSZip, sometimes globally
        const JSZip = (await import('jszip')).default || (await import('jszip'));
        (window as any).JSZip = JSZip;

        if (cancelled) return;

        // Destroy old instance
        if (previewInstanceRef.current) {
          try { previewInstanceRef.current.destroy(); } catch (_) {}
        }

        // Clear container
        if (containerRef.current) containerRef.current.innerHTML = '';

        // 16:9 ratio for slides
        const w = Math.floor(containerWidth);
        const h = Math.floor(w * (9 / 16));

        console.log('[PptxPreview] Initializing instance with width', w);
        const instance = init(containerRef.current, {
          width: w,
          height: h,
          mode: 'scroll', // show all slides stacked
        });
        previewInstanceRef.current = instance;

        console.log('[PptxPreview] Reading arrayBuffer...');
        const arrayBuffer = await file.arrayBuffer();
        if (cancelled) return;

        console.log('[PptxPreview] Calling instance.preview()...');
        const pptx = await instance.preview(arrayBuffer);
        console.log('[PptxPreview] Preview success, slides:', pptx?.slides?.length);
        if (cancelled) return;

        setTotalSlides(pptx?.slides?.length || 0);
        setCurrentSlide(1);
      } catch (err: any) {
        if (!cancelled) {
          console.error('[PptxPreview] pptx-preview error:', err);
          setError('Gagal memuat pratinjau presentasi. File mungkin memiliki format yang tidak didukung.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();

    return () => {
      cancelled = true;
      if (previewInstanceRef.current) {
        try { previewInstanceRef.current.destroy(); } catch (_) {}
        previewInstanceRef.current = null;
      }
    };
  }, [file, containerWidth]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>
      {/* Slide counter badge */}
      {totalSlides > 0 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
            <Presentation size={12} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            {totalSlides} slide{totalSlides > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, padding: 32 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Memuat slide presentasi…</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 32, textAlign: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(225,29,72,0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Presentation size={28} />
          </div>
          <h5 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#1a202c' }}>Pratinjau tidak tersedia</h5>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, maxWidth: 280 }}>{error}</p>
        </div>
      )}

      {/* Actual pptx-preview render target */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: loading || error ? 'none' : 'block',
          borderRadius: 8,
          background: '#1a1a1a',
        }}
      />
    </div>
  );
};

export default PptxPreview;

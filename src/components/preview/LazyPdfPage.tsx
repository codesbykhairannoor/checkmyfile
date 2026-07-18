import { useEffect, useRef, useState } from 'react';

const LazyPdfPage = ({
  pdfDoc,
  pageNum,
  zoomScale,
  totalRotate,
  wrapperWidth,
  paperShadow,
  defaultRatio,
  id
}: {
  pdfDoc: any;
  pageNum: number;
  zoomScale: number;
  totalRotate: number;
  wrapperWidth: number;
  paperShadow: string;
  defaultRatio: number;
  id?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(defaultRatio);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); 
      }
    }, { rootMargin: '400px' });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !pdfDoc) return;
    
    let isCancelled = false;
    
    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;
        
        const baseRotate = page.rotate || 0;
        const finalRotate = ((baseRotate + totalRotate) % 360 + 360) % 360;
        
        const baseViewport = page.getViewport({ scale: 1.0, rotation: finalRotate });
        setAspectRatio(baseViewport.width / baseViewport.height);
        
        const renderScale = (wrapperWidth / baseViewport.width) * zoomScale;
        const viewport = page.getViewport({ scale: renderScale, rotation: finalRotate });
        
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            
            const pixelRatio = Math.max(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(viewport.width * pixelRatio);
            canvas.height = Math.floor(viewport.height * pixelRatio);
            context.scale(pixelRatio, pixelRatio);
            context.clearRect(0, 0, viewport.width, viewport.height);
            
            const renderTask = page.render({ canvasContext: context, viewport, canvas } as any);
            renderTaskRef.current = renderTask;
            await renderTask.promise;
          }
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.warn('Lazy render error', err);
        }
      }
    };
    renderPage();
    return () => {
      isCancelled = true;
      if (renderTaskRef.current) renderTaskRef.current.cancel();
    }
  }, [isVisible, pdfDoc, pageNum, zoomScale, totalRotate, wrapperWidth]);

  return (
    <div 
      ref={containerRef}
      id={id}
      style={{
        aspectRatio: `${aspectRatio}`,
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        borderRadius: 4,
        boxShadow: paperShadow,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 24,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
    </div>
  );
};

export default LazyPdfPage;

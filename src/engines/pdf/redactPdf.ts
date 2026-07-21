import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const redactPdf = async (
  file: File,
  redactConfig: any,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  const newPdf = await PDFDocument.create();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const scale = 2.0;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport } as any).promise;

    // Draw the black redaction boxes or blur
    const boxes = redactConfig?.boxes?.[i - 1] || [];
    const mode = redactConfig?.mode || 'black';
    const showLock = redactConfig?.showLock || false;

    if (boxes.length > 0) {
      for (const box of boxes) {
        // box coords are percentages (0-100)
        const pxX = (box.x / 100) * viewport.width;
        const pxY = (box.y / 100) * viewport.height;
        const pxW = (box.width / 100) * viewport.width;
        const pxH = (box.height / 100) * viewport.height;
        
        if (mode === 'blur') {
          // Extract the region to blur
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = pxW;
          tempCanvas.height = pxH;
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCtx.drawImage(canvas, pxX, pxY, pxW, pxH, 0, 0, pxW, pxH);
          
          // Draw back with blur
          context.filter = 'blur(12px)';
          context.drawImage(tempCanvas, pxX, pxY);
          context.filter = 'none';
          
          // Optional subtle border
          context.strokeStyle = 'rgba(100, 116, 139, 0.5)';
          context.lineWidth = 2;
          context.setLineDash([5, 5]);
          context.strokeRect(pxX, pxY, pxW, pxH);
          context.setLineDash([]);
        } else {
          context.fillStyle = '#000000';
          context.fillRect(pxX, pxY, pxW, pxH);
        }

        if (showLock) {
          // Draw lock icon in center
          const cx = pxX + pxW / 2;
          const cy = pxY + pxH / 2;
          const lockSize = Math.min(pxW, pxH) * 0.4;
          const lockW = Math.min(lockSize, 32);
          const lockH = lockW * 0.7;
          
          context.fillStyle = mode === 'blur' ? 'rgba(51, 65, 85, 0.8)' : '#ffffff';
          context.strokeStyle = mode === 'blur' ? 'rgba(51, 65, 85, 0.8)' : '#ffffff';
          context.lineWidth = lockW * 0.1;
          context.lineJoin = 'round';
          
          // Lock body
          const bodyY = cy;
          context.fillRect(cx - lockW/2, bodyY, lockW, lockH);
          
          // Lock shackle
          context.beginPath();
          context.arc(cx, bodyY, lockW * 0.35, Math.PI, 0);
          context.stroke();
        }
      }
    }

    // Rasterize the page
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const image = await newPdf.embedJpg(jpegDataUrl);

    const newPage = newPdf.addPage([viewport.width / scale, viewport.height / scale]);
    newPage.drawImage(image, { x: 0, y: 0, width: viewport.width / scale, height: viewport.height / scale });

    if (onProgress) {
      onProgress((i / numPages) * 100);
    }
  }

  return await newPdf.save();
};

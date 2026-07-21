import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/worker.min.js';

export const redactPdf = async (
  file: File,
  redactConfig: Record<number, Array<{ id: string, x: number, y: number, width: number, height: number }>>,
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

    // Draw the black redaction boxes!
    const boxes = redactConfig[i - 1] || [];
    if (boxes.length > 0) {
      context.fillStyle = '#000000';
      for (const box of boxes) {
        // box coords are percentages (0-100)
        const pxX = (box.x / 100) * viewport.width;
        const pxY = (box.y / 100) * viewport.height;
        const pxW = (box.width / 100) * viewport.width;
        const pxH = (box.height / 100) * viewport.height;
        context.fillRect(pxX, pxY, pxW, pxH);
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

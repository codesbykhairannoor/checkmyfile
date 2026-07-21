import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Use same worker as extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/worker.min.js';

export const scanToPdf = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // 1. Create a new empty PDF
  const newPdf = await PDFDocument.create();

  // 2. Load the original PDF with pdf.js to render it
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  // Render scale (quality). 2.0 is a good balance for scan-like quality.
  const scale = 2.0;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    // Create a canvas to render the page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext as any).promise;

    // Get the image data as JPEG (to save space)
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Embed the JPEG into the new PDF
    const image = await newPdf.embedJpg(jpegDataUrl);

    // Add a new blank page with the exact dimensions
    const newPage = newPdf.addPage([viewport.width / scale, viewport.height / scale]);

    // Draw the rasterized image to cover the entire page
    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width: viewport.width / scale,
      height: viewport.height / scale,
    });

    if (onProgress) {
      onProgress((i / numPages) * 100);
    }
  }

  // Save the new rasterized PDF
  return await newPdf.save();
};

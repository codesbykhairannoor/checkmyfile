import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

export async function grayscalePdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  
  const numPages = pdf.numPages;
  const newPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    // Use 2x scale for decent print quality without crashing browser memory
    const viewport = page.getViewport({ scale: 2.0 });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D context not supported");
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: ctx,
      viewport: viewport
    } as any).promise;
    
    // Convert to grayscale using pixel manipulation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Standard grayscale luminance formula
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
      // Alpha channel data[i+3] remains unchanged
    }
    ctx.putImageData(imageData, 0, 0);
    
    // Export to JPEG to keep the final PDF size manageable
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    
    // Embed in new PDF. We divide by 2.0 because we scaled by 2.0 earlier.
    const newPage = newPdfDoc.addPage([viewport.width / 2.0, viewport.height / 2.0]);
    const pdfImage = await newPdfDoc.embedJpg(dataUrl);
    
    newPage.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width: viewport.width / 2.0,
      height: viewport.height / 2.0,
    });
    
    if (onProgress) {
      onProgress(Math.round((pageNum / numPages) * 100));
    }
  }

  const pdfBytes = await newPdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

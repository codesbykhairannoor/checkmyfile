import { PDFDocument } from 'pdf-lib';

export async function cropPdf(
  file: File,
  cropConfig: { marginTop: number; marginBottom: number; marginLeft: number; marginRight: number },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    
    // Convert percentage (0-100) to points
    const leftPt = width * (cropConfig.marginLeft / 100);
    const rightPt = width * (cropConfig.marginRight / 100);
    const topPt = height * (cropConfig.marginTop / 100);
    const bottomPt = height * (cropConfig.marginBottom / 100);

    const newX = leftPt;
    // PDF coordinate system starts from bottom-left (0,0)
    const newY = bottomPt;
    const newWidth = Math.max(10, width - leftPt - rightPt);
    const newHeight = Math.max(10, height - topPt - bottomPt);

    page.setCropBox(newX, newY, newWidth, newHeight);
    
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

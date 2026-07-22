import { PDFDocument, PageSizes } from 'pdf-lib';

export interface ResizeOptions {
  pageSize: string; // 'A4', 'Letter', 'Legal', 'Fit', 'Original'
  orientation: string; // 'Portrait', 'Landscape', 'Auto'
  margin: number; // margin in points
}

export const resizePdf = async (
  file: File, 
  options: ResizeOptions,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress?.(10);
  
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  onProgress?.(30);

  const newPdfDoc = await PDFDocument.create();
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width: origWidth, height: origHeight } = page.getSize();
    
    // Determine target dimensions
    let targetW = origWidth;
    let targetH = origHeight;
    
    if (options.pageSize === 'A4') {
      targetW = PageSizes.A4[0];
      targetH = PageSizes.A4[1];
    } else if (options.pageSize === 'Letter') {
      targetW = PageSizes.Letter[0];
      targetH = PageSizes.Letter[1];
    } else if (options.pageSize === 'Legal') {
      targetW = PageSizes.Legal[0];
      targetH = PageSizes.Legal[1];
    } else if (options.pageSize === 'A3') {
      targetW = 841.89; // 297mm
      targetH = 1190.55; // 420mm
    }
    
    // Apply orientation
    const isAutoLandscape = origWidth > origHeight;
    const shouldBeLandscape = options.orientation === 'Landscape' || (options.orientation === 'Auto' && isAutoLandscape);
    
    if (shouldBeLandscape && targetW < targetH) {
      // Swap width and height for landscape
      const temp = targetW;
      targetW = targetH;
      targetH = temp;
    } else if (!shouldBeLandscape && targetW > targetH) {
       // Ensure portrait if not landscape
      const temp = targetW;
      targetW = targetH;
      targetH = temp;
    }
    
    // Create new blank page
    const newPage = newPdfDoc.addPage([targetW, targetH]);
    
    // Embed the original page
    const embeddedPage = await newPdfDoc.embedPage(page);
    
    // Calculate scaling to fit within target minus margins
    const availableW = Math.max(1, targetW - (options.margin * 2));
    const availableH = Math.max(1, targetH - (options.margin * 2));
    
    const scaleX = availableW / origWidth;
    const scaleY = availableH / origHeight;
    const scale = Math.min(scaleX, scaleY); // Scale to fit
    
    const scaledW = origWidth * scale;
    const scaledH = origHeight * scale;
    
    // Center it
    const x = (targetW - scaledW) / 2;
    const y = (targetH - scaledH) / 2;
    
    newPage.drawPage(embeddedPage, {
      x,
      y,
      width: scaledW,
      height: scaledH,
    });
    
    onProgress?.(30 + Math.round(((i + 1) / totalPages) * 60));
  }
  
  const pdfBytes = await newPdfDoc.save();
  onProgress?.(100);
  
  return pdfBytes;
};

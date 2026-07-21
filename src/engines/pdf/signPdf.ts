import { PDFDocument } from 'pdf-lib';

export interface SignatureConfig {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string; // Base64 data URL
}

/**
 * Adds an electronic signature image to a specific page of a PDF.
 * @param file The original PDF file
 * @param config Configuration for the signature placement
 * @param onProgress Callback for progress percentage
 * @returns Blob of the signed PDF
 */
export async function signPdf(
  file: File,
  config: SignatureConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);
  
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(30);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  onProgress?.(50);

  const pages = pdfDoc.getPages();
  const page = pages[config.pageIndex];

  if (!page) {
    throw new Error('Invalid page index');
  }

  // Embed the image
  let embeddedImage;
  const isPng = config.imageUrl.startsWith('data:image/png');
  const isJpeg = config.imageUrl.startsWith('data:image/jpeg') || config.imageUrl.startsWith('data:image/jpg');

  if (isPng) {
    embeddedImage = await pdfDoc.embedPng(config.imageUrl);
  } else if (isJpeg) {
    embeddedImage = await pdfDoc.embedJpg(config.imageUrl);
  } else {
    // Attempt PNG by default for signatures
    embeddedImage = await pdfDoc.embedPng(config.imageUrl);
  }
  
  onProgress?.(70);

  // pdf-lib's coordinate system originates at bottom-left.
  // Our UI coordinate system originates at top-left.
  // We need to invert the Y coordinate.
  const pageHeight = page.getHeight();
  const pdfLibY = pageHeight - config.y - config.height;

  page.drawImage(embeddedImage, {
    x: config.x,
    y: pdfLibY,
    width: config.width,
    height: config.height,
  });

  onProgress?.(90);

  const pdfBytes = await pdfDoc.save();
  onProgress?.(100);

  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

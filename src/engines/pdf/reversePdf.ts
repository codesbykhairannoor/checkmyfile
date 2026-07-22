import { PDFDocument } from 'pdf-lib';

export const reversePdf = async (file: File, onProgress?: (progress: number) => void): Promise<Uint8Array> => {
  onProgress?.(10);
  
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  onProgress?.(30);

  const totalPages = pdfDoc.getPageCount();
  const reversedIndices = Array.from({ length: totalPages }, (_, i) => totalPages - 1 - i);

  onProgress?.(50);
  
  const newPdfDoc = await PDFDocument.create();
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, reversedIndices);
  
  onProgress?.(70);

  copiedPages.forEach((page) => newPdfDoc.addPage(page));
  
  onProgress?.(90);

  const pdfBytes = await newPdfDoc.save();
  onProgress?.(100);
  
  return pdfBytes;
};

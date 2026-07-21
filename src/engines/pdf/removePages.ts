import { PDFDocument } from 'pdf-lib';

/**
 * Removes specific pages from a PDF.
 * @param file The original PDF file
 * @param pagesToRemove Array of 0-indexed page numbers to remove
 * @param onProgress Callback for progress percentage
 * @returns Blob of the new PDF
 */
export async function removePdfPages(
  file: File,
  pagesToRemove: number[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);
  
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(30);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  onProgress?.(50);

  const totalPages = pdfDoc.getPageCount();
  
  // Sort descending so removing pages doesn't shift the indices of subsequent removals
  const sortedToRemove = [...new Set(pagesToRemove)].sort((a, b) => b - a);
  
  let removedCount = 0;
  for (const pageIndex of sortedToRemove) {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      pdfDoc.removePage(pageIndex);
      removedCount++;
    }
    onProgress?.(50 + Math.floor((removedCount / sortedToRemove.length) * 30));
  }

  const pdfBytes = await pdfDoc.save();
  onProgress?.(100);

  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

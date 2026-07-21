import { PDFDocument } from 'pdf-lib';

/**
 * Inserts pages from a secondary PDF into a main PDF at a specific index.
 * @param mainFile The primary PDF file
 * @param insertFile The secondary PDF file to insert
 * @param insertAtIndex 0-indexed position where the inserted pages will start
 * @param onProgress Callback for progress percentage
 * @returns Blob of the new PDF
 */
export async function insertPdfPages(
  mainFile: File,
  insertFile: File,
  insertAtIndex: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);
  
  const mainBuffer = await mainFile.arrayBuffer();
  const insertBuffer = await insertFile.arrayBuffer();
  onProgress?.(30);

  const mainDoc = await PDFDocument.load(mainBuffer);
  const insertDoc = await PDFDocument.load(insertBuffer);
  onProgress?.(50);

  const insertPages = await mainDoc.copyPages(insertDoc, insertDoc.getPageIndices());
  onProgress?.(70);

  const safeIndex = Math.max(0, Math.min(insertAtIndex, mainDoc.getPageCount()));
  
  let i = 0;
  for (const page of insertPages) {
    mainDoc.insertPage(safeIndex + i, page);
    i++;
  }
  onProgress?.(90);

  const pdfBytes = await mainDoc.save();
  onProgress?.(100);

  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

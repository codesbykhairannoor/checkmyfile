import { PDFDocument } from 'pdf-lib';

export const mergePdfs = async (
  files: File[],
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  if (!files || files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    onProgress(Math.round(((i + 0.1) / totalFiles) * 85));
    try {
      const arrayBuffer = await files[i].arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err: any) {
      throw new Error(`Failed to load file "${files[i].name}": ${err?.message || 'File may be corrupted or password protected.'}`);
    }
    onProgress(Math.round(((i + 1) / totalFiles) * 85));
  }

  onProgress(95);
  const pdfBytes = await mergedPdf.save();
  onProgress(100);
  return pdfBytes;
};


import { PDFDocument } from 'pdf-lib';

export const unlockPdf = async (
  file: File,
  _password?: string,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> => {
  if (onProgress) onProgress(30);
  const arrayBuffer = await file.arrayBuffer();
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Cannot unlock PDF: ${err?.message || 'File is restricted with strong owner encryption.'}`);
  }
  if (onProgress) onProgress(80);
  const data = await pdf.save();
  if (onProgress) onProgress(100);
  return data;
};


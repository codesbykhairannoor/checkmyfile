import { HighPrecisionPdfConverter } from 'high-precision-pdf-to-docx';

export const convertPdfToWord = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  
  const arrayBuffer = await file.arrayBuffer();
  const pdfUint8Array = new Uint8Array(arrayBuffer);
  onProgress(30);

  const converter = new HighPrecisionPdfConverter();
  await converter.initialize();
  onProgress(50);

  const docxBuffer = await converter.convertPdfToDocx(pdfUint8Array);
  onProgress(90);

  const result = new Uint8Array(docxBuffer);
  onProgress(100);
  
  return result;
};

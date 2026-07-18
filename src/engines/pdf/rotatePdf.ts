import { PDFDocument, degrees } from 'pdf-lib';

export const rotatePdf = async (
  file: File,
  rotationDegrees: number,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(30);
  const arrayBuffer = await file.arrayBuffer();
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Cannot open PDF to rotate: ${err?.message}`);
  }
  onProgress(60);

  const pages = pdf.getPages();
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
  });

  onProgress(90);
  const data = await pdf.save();
  onProgress(100);
  return data;
};

export const encryptPdf = async (
  file: File,
  userPassword: string,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(30);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  onProgress(70);

  const data = await pdf.save({
    // @ts-ignore modern browser pdf-lib encryption/permissions support
    userPassword: userPassword || '123456',
    ownerPassword: userPassword || '123456',
  });
  onProgress(100);
  return data;
};


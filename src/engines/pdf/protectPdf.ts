import { encryptPDF } from '@pdfsmaller/pdf-encrypt';

export async function protectPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (!password) {
    throw new Error('Password is required to protect the PDF');
  }

  onProgress?.(10);
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  
  onProgress?.(40);
  
  // Encrypt using AES-256 (default)
  const encryptedBytes = await encryptPDF(pdfBytes, password);
  
  onProgress?.(90);

  const blob = new Blob([encryptedBytes as any], { type: 'application/pdf' });
  onProgress?.(100);

  return blob;
}

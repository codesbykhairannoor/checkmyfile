import { decryptPDF } from '@pdfsmaller/pdf-decrypt';

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (!password) {
    throw new Error('Password is required to unlock the PDF');
  }

  onProgress?.(10);
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  
  onProgress?.(40);
  
  try {
    const decryptedBytes = await decryptPDF(pdfBytes, password);
    onProgress?.(90);

    const blob = new Blob([decryptedBytes as any], { type: 'application/pdf' });
    onProgress?.(100);

    return blob;
  } catch (error: any) {
    if (error.message?.includes('Incorrect password')) {
      throw new Error('Kata sandi salah. Silakan coba lagi.');
    }
    throw error;
  }
}

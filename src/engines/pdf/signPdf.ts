import * as Zga from 'zgapdfsigner';

export interface SignatureConfig {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string; // Base64 data URL
  
  // New properties for cryptographic signature
  p12Bytes?: ArrayBuffer;
  password?: string;
  reason?: string;
  location?: string;
}

/**
 * Digitally signs a PDF document cryptographically using zgapdfsigner.
 * It also embeds a visual signature (image) based on the config.
 * 
 * @param file The original PDF file
 * @param config Configuration for the signature placement and PKI details
 * @param onProgress Callback for progress percentage
 * @returns Blob of the digitally signed PDF
 */
export async function signPdf(
  file: File,
  config: SignatureConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);
  
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(30);

  if (!config.p12Bytes || typeof config.password === 'undefined') {
    throw new Error('Sertifikat (P12/PFX) dan password diperlukan untuk enkripsi tanda tangan.');
  }

  // Parse the base64 image URL to extract raw image data for zgapdfsigner
  const base64Data = config.imageUrl.split(',')[1];
  const mimeMatch = config.imageUrl.match(/data:(.*?);/);
  let imgType = 'png';
  if (mimeMatch && mimeMatch[1]) {
    const mime = mimeMatch[1];
    if (mime.includes('jpeg') || mime.includes('jpg')) imgType = 'jpg';
  }

  // Decode base64 to ArrayBuffer
  const imgDataStr = atob(base64Data);
  const imgBuffer = new ArrayBuffer(imgDataStr.length);
  const imgView = new Uint8Array(imgBuffer);
  for (let i = 0; i < imgDataStr.length; i++) {
    imgView[i] = imgDataStr.charCodeAt(i);
  }

  onProgress?.(50);

  const sopt: Zga.SignOption = {
    p12cert: config.p12Bytes,
    pwd: config.password,
    reason: config.reason || "I approve this document.",
    location: config.location || "Internet",
    drawinf: {
      area: {
        x: config.x,
        y: config.y,
        w: config.width,
        h: config.height
      },
      pageidx: config.pageIndex.toString(),
      imgInfo: {
        imgData: imgBuffer,
        imgType: imgType
      }
    }
  };

  onProgress?.(70);

  // Initialize signer
  const signer = new Zga.PdfSigner(sopt);
  
  // Execute digital signing
  const signedUint8Array = await signer.sign(arrayBuffer);
  
  onProgress?.(100);

  return new Blob([signedUint8Array as any], { type: 'application/pdf' });
}

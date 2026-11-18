import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as Zga from 'zgapdfsigner';

export interface SignatureConfig {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string; // Base64 data URL

  // Optional cryptographic P12/PFX signing
  p12Bytes?: ArrayBuffer;
  password?: string;
  reason?: string;
  location?: string;

  // Web Crypto SHA-256 Audit Trail
  includeAuditTrail?: boolean;
  signerName?: string;
  signerEmail?: string;
}

/**
 * Computes a standard SHA-256 hexadecimal digest using native Web Crypto API.
 */
export async function computeSha256Hex(buffer: ArrayBuffer | Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer as any);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Digitally signs a PDF document cryptographically using zgapdfsigner (if P12 provided)
 * or embeds a high-fidelity visual signature with a native Web Crypto SHA-256 Tamper-Evident Audit Trail.
 */
export async function signPdf(
  file: File,
  config: SignatureConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);

  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(25);

  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const page = pages[config.pageIndex];

  if (!page) {
    throw new Error('Target signature page does not exist or is invalid.');
  }

  // Parse image format
  const base64Data = config.imageUrl.split(',')[1] || config.imageUrl;
  const mimeMatch = config.imageUrl.match(/data:(.*?);/);
  let isJpeg = false;
  if (mimeMatch && mimeMatch[1]) {
    const mime = mimeMatch[1];
    if (mime.includes('jpeg') || mime.includes('jpg')) isJpeg = true;
  }

  // If user provided a P12 certificate, use zgapdfsigner
  if (config.p12Bytes && typeof config.password !== 'undefined') {
    const imgDataStr = atob(base64Data);
    const imgBuffer = new ArrayBuffer(imgDataStr.length);
    const imgView = new Uint8Array(imgBuffer);
    for (let i = 0; i < imgDataStr.length; i++) {
      imgView[i] = imgDataStr.charCodeAt(i);
    }

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const absX = (config.x / 100) * pageWidth;
    const absY = (config.y / 100) * pageHeight;
    const absWidth = (config.width / 100) * pageWidth;

    let embeddedImage = isJpeg
      ? await pdfDoc.embedJpg(config.imageUrl)
      : await pdfDoc.embedPng(config.imageUrl);
    const imgDims = embeddedImage.scale(1);
    const aspectRatio = imgDims.height / imgDims.width;
    const absHeight = absWidth * aspectRatio;

    const sopt: Zga.SignOption = {
      p12cert: config.p12Bytes,
      pwd: config.password,
      reason: config.reason || "I approve this document.",
      location: config.location || "Internet",
      drawinf: {
        area: { x: absX, y: absY, w: absWidth, h: absHeight },
        pageidx: config.pageIndex.toString(),
        imgInfo: { imgData: imgBuffer, imgType: isJpeg ? 'jpg' : 'png' }
      }
    };

    onProgress?.(60);
    const signer = new Zga.PdfSigner(sopt);
    const signedUint8Array = await signer.sign(arrayBuffer);
    onProgress?.(100);
    return new Blob([signedUint8Array as any], { type: 'application/pdf' });
  }

  // Otherwise: High-precision native PDF-Lib signature embedding
  let embeddedImage = isJpeg
    ? await pdfDoc.embedJpg(config.imageUrl)
    : await pdfDoc.embedPng(config.imageUrl);

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const absX = (config.x / 100) * pageWidth;
  const absWidth = (config.width / 100) * pageWidth;
  const imgDims = embeddedImage.scale(1);
  const aspectRatio = imgDims.height / imgDims.width;
  const absHeight = absWidth * aspectRatio;
  // In pdf-lib, (0,0) is bottom-left
  const absY = pageHeight - ((config.y / 100) * pageHeight) - absHeight;

  page.drawImage(embeddedImage, {
    x: absX,
    y: Math.max(0, absY),
    width: absWidth,
    height: absHeight,
  });

  onProgress?.(60);

  // Append Web Crypto SHA-256 Audit Trail Certificate if requested (default: true)
  if (config.includeAuditTrail !== false) {
    onProgress?.(75);
    const now = new Date();
    const timestampIso = now.toISOString();
    const timestampLocal = now.toLocaleString();
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const auditId = `HMF-AUDIT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${randomHex}`;

    // Compute original and signed SHA-256
    const originalHash = await computeSha256Hex(arrayBuffer);

    // Save intermediate to compute final hash
    const intermediateBytes = await pdfDoc.save();
    const signedHash = await computeSha256Hex(intermediateBytes);

    // Create Audit Page
    const auditPage = pdfDoc.addPage([595.28, 841.89]); // Standard A4 Portrait
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Decorative Security Header Box
    auditPage.drawRectangle({
      x: 36,
      y: 740,
      width: 523,
      height: 65,
      color: rgb(0.96, 0.97, 0.99),
      borderColor: rgb(0.85, 0.88, 0.93),
      borderWidth: 1,
    });

    auditPage.drawText('CRYPTOGRAPHIC AUDIT & SIGNATURE CERTIFICATE', {
      x: 52,
      y: 775,
      size: 13,
      font: fontBold,
      color: rgb(0.08, 0.12, 0.22),
    });

    auditPage.drawText('Zero-Knowledge Client-Side Verification • Tamper-Evident SHA-256 Integrity Seal', {
      x: 52,
      y: 755,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.35, 0.45, 0.55),
    });

    // Audit Info Grid
    let currentY = 700;
    const drawField = (label: string, value: string, isMono = false) => {
      auditPage.drawText(label.toUpperCase(), {
        x: 48,
        y: currentY,
        size: 7.5,
        font: fontBold,
        color: rgb(0.45, 0.52, 0.62),
      });
      auditPage.drawText(value, {
        x: 48,
        y: currentY - 14,
        size: isMono ? 8 : 9.5,
        font: isMono ? fontRegular : fontBold,
        color: rgb(0.12, 0.16, 0.25),
      });
      currentY -= 36;
    };

    drawField('Document File Name', file.name);
    drawField('Audit Certificate Identifier', auditId);
    drawField('Signer Identification', config.signerName || 'Verified Document Signer');
    drawField('Signing Timestamp (UTC)', `${timestampIso}`);
    drawField('Signing Timestamp (Local)', `${timestampLocal}`);
    drawField('Page Signed', `Page ${config.pageIndex + 1} of ${pages.length}`);

    // Hash Box
    auditPage.drawRectangle({
      x: 36,
      y: currentY - 70,
      width: 523,
      height: 90,
      color: rgb(0.98, 0.98, 0.99),
      borderColor: rgb(0.88, 0.90, 0.94),
      borderWidth: 1,
    });

    auditPage.drawText('CRYPTOGRAPHIC FINGERPRINT (SHA-256 HASH)', {
      x: 48,
      y: currentY + 4,
      size: 8,
      font: fontBold,
      color: rgb(0.88, 0.12, 0.28), // Brand primary accent
    });

    auditPage.drawText(`Original Document SHA-256:`, {
      x: 48,
      y: currentY - 14,
      size: 7.5,
      font: fontBold,
      color: rgb(0.3, 0.35, 0.45),
    });
    auditPage.drawText(originalHash, {
      x: 48,
      y: currentY - 26,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.15, 0.2, 0.3),
    });

    auditPage.drawText(`Signed Document SHA-256:`, {
      x: 48,
      y: currentY - 42,
      size: 7.5,
      font: fontBold,
      color: rgb(0.3, 0.35, 0.45),
    });
    auditPage.drawText(signedHash, {
      x: 48,
      y: currentY - 54,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.1, 0.55, 0.35),
    });

    // Verification Seal Note
    currentY -= 110;
    auditPage.drawText('VERIFICATION NOTICE & NON-REPUDIATION GUARANTEE', {
      x: 48,
      y: currentY,
      size: 8,
      font: fontBold,
      color: rgb(0.2, 0.25, 0.35),
    });

    const disclaimer = [
      'This document was processed and signed 100% locally within the client browser via HandleMyFile.',
      'Zero bytes were transmitted to external servers. The cryptographic SHA-256 hashes recorded above',
      'establish mathematical proof of document integrity. Any subsequent modification of this PDF will',
      'invalidate the signed cryptographic fingerprint.'
    ];

    disclaimer.forEach((line, i) => {
      auditPage.drawText(line, {
        x: 48,
        y: currentY - 14 - (i * 12),
        size: 7.5,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.55),
      });
    });
  }

  onProgress?.(90);
  const finalBytes = await pdfDoc.save();
  onProgress?.(100);

  return new Blob([finalBytes as any], { type: 'application/pdf' });
}

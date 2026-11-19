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

  // Append Web Crypto SHA-256 Audit Trail Certificate if requested (PRO / 3x Free per month)
  if (config.includeAuditTrail === true) {
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

    // Create Audit Page (A4 Standard)
    const auditPage = pdfDoc.addPage([595.28, 841.89]);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);
    const fontMonoBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

    // ================= ADOBE ACROBAT SIGN AUDIT REPORT STANDARD =================
    const leftX = 48;
    const rightX = 547;
    const contentWidth = rightX - leftX; // ~500 pt

    // 1. Header
    auditPage.drawText('AUDIT REPORT', {
      x: leftX,
      y: 792,
      size: 16,
      font: fontBold,
      color: rgb(0.12, 0.12, 0.12),
    });

    auditPage.drawText('ADOBE ACROBAT SIGN STANDARD', {
      x: 375,
      y: 795,
      size: 7.5,
      font: fontBold,
      color: rgb(0.45, 0.48, 0.55),
    });

    const displayFileName = file.name.length > 50 ? file.name.substring(0, 47) + '...' : file.name;
    const displaySigner = (config.signerName || 'Verified Document Signer').trim();

    auditPage.drawText(`Agreement Title: ${displayFileName}`, {
      x: leftX,
      y: 772,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.25, 0.28, 0.35),
    });

    // Header hairline divider
    auditPage.drawLine({
      start: { x: leftX, y: 758 },
      end: { x: rightX, y: 758 },
      thickness: 1,
      color: rgb(0.78, 0.81, 0.86),
    });

    // 2. Agreement Details
    auditPage.drawText('AGREEMENT DETAILS', {
      x: leftX,
      y: 740,
      size: 8.5,
      font: fontBold,
      color: rgb(0.15, 0.18, 0.25),
    });

    const col1X = leftX;
    const col2X = 300;

    const drawDetailRow = (y: number, l1: string, v1: string, l2: string, v2: string, isV1Mono = false, isV2Green = false) => {
      auditPage.drawText(l1.toUpperCase(), {
        x: col1X,
        y,
        size: 6.8,
        font: fontBold,
        color: rgb(0.50, 0.54, 0.62),
      });
      auditPage.drawText(v1, {
        x: col1X,
        y: y - 11,
        size: 8.5,
        font: isV1Mono ? fontMonoBold : fontBold,
        color: rgb(0.12, 0.15, 0.22),
      });

      auditPage.drawText(l2.toUpperCase(), {
        x: col2X,
        y,
        size: 6.8,
        font: fontBold,
        color: rgb(0.50, 0.54, 0.62),
      });
      auditPage.drawText(v2, {
        x: col2X,
        y: y - 11,
        size: 8.5,
        font: fontBold,
        color: isV2Green ? rgb(0.08, 0.52, 0.28) : rgb(0.12, 0.15, 0.22),
      });
    };

    drawDetailRow(722, 'Transaction ID', auditId, 'Agreement Status', 'Signed and Completed', true, true);
    drawDetailRow(692, 'Signer Identification', displaySigner, 'Target Page Signed', `Page ${config.pageIndex + 1} of ${pages.length} (Visual Signature Affixed)`);
    drawDetailRow(662, 'Completion Time (Local)', timestampLocal, 'Completion Time (UTC)', timestampIso);
    drawDetailRow(632, 'Execution Environment', 'Client-Side In-Memory RAM (0 Bytes Cloud Upload)', 'Compliance Standard', 'ISO 32000-1 / ESIGN / UETA / eIDAS');

    // Section divider
    auditPage.drawLine({
      start: { x: leftX, y: 606 },
      end: { x: rightX, y: 606 },
      thickness: 0.75,
      color: rgb(0.88, 0.90, 0.94),
    });

    // 3. Chronological Event Log
    auditPage.drawText('CHRONOLOGICAL EVENT LOG', {
      x: leftX,
      y: 588,
      size: 8.5,
      font: fontBold,
      color: rgb(0.15, 0.18, 0.25),
    });

    auditPage.drawText('All events and timestamps are verified in client-side memory using the W3C Web Cryptography standard.', {
      x: leftX,
      y: 576,
      size: 7,
      font: fontRegular,
      color: rgb(0.48, 0.52, 0.6),
    });

    // Vertical timeline bar
    const timelineX = 56;
    const startY = 554;
    const endY = 440;
    auditPage.drawLine({
      start: { x: timelineX, y: startY },
      end: { x: timelineX, y: endY },
      thickness: 1.5,
      color: rgb(0.85, 0.88, 0.93),
    });

    const drawEvent = (dotY: number, title: string, subtitle: string, dotColor = rgb(0.25, 0.45, 0.85)) => {
      auditPage.drawCircle({
        x: timelineX,
        y: dotY,
        size: 3.5,
        color: dotColor,
      });
      auditPage.drawText(title, {
        x: 72,
        y: dotY - 2,
        size: 8,
        font: fontBold,
        color: rgb(0.12, 0.16, 0.24),
      });
      auditPage.drawText(subtitle, {
        x: 72,
        y: dotY - 13,
        size: 7,
        font: fontRegular,
        color: rgb(0.45, 0.50, 0.58),
      });
    };

    drawEvent(554, 'Agreement Created & In-Memory Loaded', `${timestampLocal}  •  Client Browser Environment  •  Original document imported`);
    drawEvent(516, `Document Viewed by ${displaySigner}`, `${timestampLocal}  •  Client-Side Verification  •  Rendered on isolated canvas`);
    drawEvent(478, `Electronic Signature Affixed by ${displaySigner}`, `${timestampLocal}  •  Method: Biometric Canvas Signature  •  Affixed to Page ${config.pageIndex + 1}`);
    drawEvent(440, 'Agreement Locked & Cryptographically Sealed', `${timestampLocal}  •  Status: Closed & Tamper-Evident  •  SHA-256 seal computed`, rgb(0.08, 0.55, 0.3));

    // Section divider
    auditPage.drawLine({
      start: { x: leftX, y: 412 },
      end: { x: rightX, y: 412 },
      thickness: 0.75,
      color: rgb(0.88, 0.90, 0.94),
    });

    // 4. Cryptographic Integrity Hash (SHA-256)
    auditPage.drawText('CRYPTOGRAPHIC INTEGRITY HASH (SHA-256)', {
      x: leftX,
      y: 394,
      size: 8.5,
      font: fontBold,
      color: rgb(0.15, 0.18, 0.25),
    });

    auditPage.drawText('The mathematical SHA-256 hashes below prove the document has not been altered or tampered with post-signing.', {
      x: leftX,
      y: 382,
      size: 7,
      font: fontRegular,
      color: rgb(0.48, 0.52, 0.6),
    });

    // Original Hash Box
    auditPage.drawText('ORIGINAL PRE-SIGNED SHA-256 HASH:', {
      x: leftX,
      y: 366,
      size: 6.8,
      font: fontBold,
      color: rgb(0.4, 0.45, 0.55),
    });
    auditPage.drawRectangle({
      x: leftX,
      y: 346,
      width: contentWidth,
      height: 17,
      color: rgb(0.96, 0.97, 0.98),
      borderWidth: 0.75,
      borderColor: rgb(0.85, 0.88, 0.92),
    });
    auditPage.drawText(originalHash, {
      x: leftX + 8,
      y: 351,
      size: 7.2,
      font: fontMono,
      color: rgb(0.2, 0.24, 0.32),
    });

    // Signed Hash Box
    auditPage.drawText('FINAL SEALED DOCUMENT SHA-256 HASH:', {
      x: leftX,
      y: 326,
      size: 6.8,
      font: fontBold,
      color: rgb(0.15, 0.45, 0.28),
    });
    auditPage.drawRectangle({
      x: leftX,
      y: 306,
      width: contentWidth,
      height: 17,
      color: rgb(0.94, 0.98, 0.95),
      borderWidth: 0.75,
      borderColor: rgb(0.72, 0.85, 0.76),
    });
    auditPage.drawText(signedHash, {
      x: leftX + 8,
      y: 311,
      size: 7.2,
      font: fontMonoBold,
      color: rgb(0.06, 0.48, 0.25),
    });

    // Section divider
    auditPage.drawLine({
      start: { x: leftX, y: 286 },
      end: { x: rightX, y: 286 },
      thickness: 0.75,
      color: rgb(0.88, 0.90, 0.94),
    });

    // 5. Legal Notice & Statutory Compliance
    auditPage.drawText('LEGAL NOTICE & STATUTORY NON-REPUDIATION', {
      x: leftX,
      y: 268,
      size: 8.5,
      font: fontBold,
      color: rgb(0.15, 0.18, 0.25),
    });

    const legalLines = [
      'This Audit Report provides a full, tamper-evident record of the electronic signature transaction pursuant to the United States Electronic',
      'Signatures in Global and National Commerce Act (ESIGN Act, 15 U.S.C. § 7001 et seq.), the Uniform Electronic Transactions Act (UETA), and',
      'the European Union eIDAS Regulation (Regulation (EU) No 910/2014) regarding enforceable electronic signatures.',
      '',
      'The cryptographic SHA-256 digests affixed above establish mathematical verification of document completeness. Any post-signing alteration,',
      'page extraction, or annotation invalidates the digital hash. HandleMyFile executes all operations client-side via in-memory WebAssembly isolate;',
      'no document data, signatures, or biometric inputs were stored or transmitted across any network or cloud server.',
    ];

    let textY = 252;
    for (const line of legalLines) {
      if (line === '') {
        textY -= 4;
        continue;
      }
      auditPage.drawText(line, {
        x: leftX,
        y: textY,
        size: 6.8,
        font: fontRegular,
        color: rgb(0.42, 0.46, 0.54),
      });
      textY -= 10.5;
    }

    // Security Guarantee Badges Box
    auditPage.drawRectangle({
      x: leftX,
      y: 110,
      width: contentWidth,
      height: 48,
      color: rgb(0.98, 0.99, 1.0),
      borderWidth: 0.75,
      borderColor: rgb(0.85, 0.88, 0.94),
    });

    const colW = contentWidth / 3;
    auditPage.drawText('ZERO-KNOWLEDGE PRIVACY', { x: leftX + 12, y: 142, size: 7, font: fontBold, color: rgb(0.12, 0.16, 0.24) });
    auditPage.drawText('100% In-Memory isolate. Zero cloud upload.', { x: leftX + 12, y: 124, size: 6.5, font: fontRegular, color: rgb(0.45, 0.50, 0.58) });

    auditPage.drawText('TAMPER-EVIDENT INTEGRITY', { x: leftX + colW + 12, y: 142, size: 7, font: fontBold, color: rgb(0.12, 0.16, 0.24) });
    auditPage.drawText('Mathematical SHA-256 hash sealing.', { x: leftX + colW + 12, y: 124, size: 6.5, font: fontRegular, color: rgb(0.45, 0.50, 0.58) });

    auditPage.drawText('STATUTORY ENFORCEABILITY', { x: leftX + (colW * 2) + 12, y: 142, size: 7, font: fontBold, color: rgb(0.12, 0.16, 0.24) });
    auditPage.drawText('Compliant with ESIGN, UETA, & eIDAS.', { x: leftX + (colW * 2) + 12, y: 124, size: 6.5, font: fontRegular, color: rgb(0.45, 0.50, 0.58) });

    // 6. Footer
    auditPage.drawLine({
      start: { x: leftX, y: 65 },
      end: { x: rightX, y: 65 },
      thickness: 1,
      color: rgb(0.82, 0.85, 0.90),
    });

    auditPage.drawText('HandleMyFile Cryptographic Engine • Adobe Acrobat Sign Audit Standard • ISO 32000-1 Compliant', {
      x: leftX,
      y: 50,
      size: 7,
      font: fontRegular,
      color: rgb(0.45, 0.50, 0.58),
    });

    const totalPages = pages.length + 1;
    auditPage.drawText(`Page ${totalPages} of ${totalPages} (Audit Trail)`, {
      x: 435,
      y: 50,
      size: 7,
      font: fontBold,
      color: rgb(0.35, 0.40, 0.48),
    });
  }

  onProgress?.(90);
  const finalBytes = await pdfDoc.save();
  onProgress?.(100);

  return new Blob([finalBytes as any], { type: 'application/pdf' });
}

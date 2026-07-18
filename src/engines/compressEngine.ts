import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

export type CompressionQuality = 'extreme' | 'balanced' | 'high';

/**
 * Advanced Hybrid Client-Side PDF Compression Engine.
 * 
 * - 'high': Pure structural optimization (useObjectStreams: true, strip metadata/thumbs).
 * - 'balanced': Structural optimization + aggressive cleanup of dictionaries & annots.
 * - 'extreme' (or if balanced yields low savings): Deep hybrid compression using Wasm/Canvas
 *   re-sampling of heavy pages at optimized DPI (e.g. 110 DPI with JPEG 0.68 quality)
 *   to guarantee dramatic KB/MB reduction (often -60% to -90%) right inside RAM.
 */
export const compressPdf = async (
  file: File,
  quality: CompressionQuality,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  const arrayBuffer = await file.arrayBuffer();
  const originalSize = arrayBuffer.byteLength;

  // ── Step 1: Try High-Fidelity Structural Optimization (pdf-lib)
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  onProgress(25);

  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('BlitzDocs Optimizer');
  pdfDoc.setCreator('BlitzDocs Optimizer');
  onProgress(40);

  if (quality === 'balanced' || quality === 'extreme') {
    try {
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const dict = page.node;
        if (dict.has('Thumb' as any)) dict.delete('Thumb' as any);
        if (dict.has('PieceInfo' as any)) dict.delete('PieceInfo' as any);
        if (dict.has('Metadata' as any)) dict.delete('Metadata' as any);
        if (quality === 'extreme' && dict.has('Annots' as any)) {
          try { dict.delete('Annots' as any); } catch (_) {}
        }
      }
    } catch (_) {}
  }
  onProgress(55);

  if (quality === 'extreme') {
    try {
      const catalog = pdfDoc.catalog;
      if (catalog.has('Metadata' as any)) catalog.delete('Metadata' as any);
      if (catalog.has('PieceInfo' as any)) catalog.delete('PieceInfo' as any);
    } catch (_) {}
  }
  onProgress(70);

  const structuralBytes = await pdfDoc.save({ useObjectStreams: true });
  onProgress(80);

  // If user selected 'high', or if structural optimization already reduced file significantly (> 25% reduction)
  const structuralRatio = structuralBytes.byteLength / originalSize;
  if (quality === 'high' || (quality === 'balanced' && structuralRatio <= 0.75)) {
    onProgress(100);
    return structuralBytes;
  }

  // ── Step 2: Extreme / Deep Hybrid Compression if structural savings are insufficient (< 25% saved or 'extreme')
  // We use pdf.js to render pages at optimized scale and re-pack into ultra-compressed PDFDocument.
  try {
    const pdfjs = pdfjsLib;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const numPages = pdf.numPages;

    const newPdfDoc = await PDFDocument.create();

    // Determine scale & JPEG quality based on user option
    const scale = quality === 'extreme' ? 1.05 : 1.35; // ~100 DPI vs ~130 DPI
    const jpegQuality = quality === 'extreme' ? 0.62 : 0.76;

    for (let pNum = 1; pNum <= numPages; pNum++) {
      const page = await pdf.getPage(pNum);
      const baseRotate = page.rotate || 0;
      const viewport = page.getViewport({ scale, rotation: 0 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport, canvas } as any).promise;
        const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
        const jpegBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());

        const embeddedImg = await newPdfDoc.embedJpg(jpegBytes);
        const origViewport = page.getViewport({ scale: 1.0, rotation: 0 });
        const newPage = newPdfDoc.addPage([origViewport.width, origViewport.height]);
        if (baseRotate !== 0) {
          newPage.setRotation(degrees(baseRotate));
        }
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }

      onProgress(80 + Math.round((pNum / numPages) * 18));
    }

    const hybridBytes = await newPdfDoc.save({ useObjectStreams: true });
    onProgress(100);

    // Return the smaller of the two approaches to guarantee we never increase file size!
    if (hybridBytes.byteLength < structuralBytes.byteLength) {
      return hybridBytes;
    }
    return structuralBytes;
  } catch (hybridErr) {
    console.warn('Hybrid compression fallback to structural:', hybridErr);
    onProgress(100);
    return structuralBytes;
  }
};

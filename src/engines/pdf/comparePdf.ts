import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';


pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const comparePdf = async (
  file1: File,
  file2: File,
  onProgress?: (progress: number) => void
): Promise<{ bytes: Uint8Array, accuracy: number }> => {
  const [arrayBuffer1, arrayBuffer2] = await Promise.all([
    file1.arrayBuffer(),
    file2.arrayBuffer()
  ]);

  const [pdfDoc1, pdfDoc2] = await Promise.all([
    pdfjsLib.getDocument({ data: arrayBuffer1 }).promise,
    pdfjsLib.getDocument({ data: arrayBuffer2 }).promise
  ]);

  const newPdf = await PDFDocument.create();
  const maxPages = Math.max(pdfDoc1.numPages, pdfDoc2.numPages);
  const scale = 1.5; // lower scale for diffing to save memory
  
  let totalDiffPixels = 0;
  let totalPixels = 0;

  for (let i = 1; i <= maxPages; i++) {
    let page1, page2;
    try { page1 = await pdfDoc1.getPage(i); } catch (e) {}
    try { page2 = await pdfDoc2.getPage(i); } catch (e) {}

    // Determine target dimensions
    const viewport1 = page1 ? page1.getViewport({ scale }) : null;
    const viewport2 = page2 ? page2.getViewport({ scale }) : null;
    
    const width = Math.ceil(Math.max(viewport1?.width || 0, viewport2?.width || 0) || 800);
    const height = Math.ceil(Math.max(viewport1?.height || 0, viewport2?.height || 0) || 1200);

    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const diffCanvas = document.createElement('canvas');
    
    canvas1.width = width; canvas1.height = height;
    canvas2.width = width; canvas2.height = height;
    diffCanvas.width = width; diffCanvas.height = height;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const diffCtx = diffCanvas.getContext('2d');

    if (!ctx1 || !ctx2 || !diffCtx) throw new Error('Could not create canvas contexts');

    // Fill white backgrounds
    ctx1.fillStyle = '#ffffff'; ctx1.fillRect(0, 0, width, height);
    ctx2.fillStyle = '#ffffff'; ctx2.fillRect(0, 0, width, height);

    if (page1 && viewport1) {
      await page1.render({ canvasContext: ctx1, viewport: viewport1 } as any).promise;
    }
    if (page2 && viewport2) {
      await page2.render({ canvasContext: ctx2, viewport: viewport2 } as any).promise;
    }

    const img1 = ctx1.getImageData(0, 0, width, height);
    const img2 = ctx2.getImageData(0, 0, width, height);
    const diff = diffCtx.createImageData(width, height);

    // Continuous Red/Green Visual Diffing Engine (Anaglyph style)
    const img1Data = img1.data;
    const img2Data = img2.data;
    const diffData = diff.data;
    let numDiffPixels = 0;

    for (let i = 0; i < img1Data.length; i += 4) {
      // Calculate perceived luminance (grayscale) for both pixels
      const v1 = (img1Data[i] * 0.299 + img1Data[i+1] * 0.587 + img1Data[i+2] * 0.114);
      const v2 = (img2Data[i] * 0.299 + img2Data[i+1] * 0.587 + img2Data[i+2] * 0.114);
      
      if (Math.abs(v1 - v2) > 30) {
        numDiffPixels++;
      }
      
      // Continuous Color Mapping:
      // - If v1=0 (Old text) & v2=255 (New bg) -> R=255, G=0, B=0 (RED = Removed)
      // - If v1=255 (Old bg) & v2=0 (New text) -> R=0, G=255, B=0 (GREEN = Added)
      // - If v1=0 & v2=0 (Match text) -> R=0, G=0, B=0 (BLACK)
      // - If v1=255 & v2=255 (Match bg) -> R=255, G=255, B=255 (WHITE)
      // We lighten the matching black text slightly to dark gray so colors pop more
      const baseB = Math.min(v1, v2);
      
      // To prevent pure black matching text from overpowering, we lighten everything by 20%
      diffData[i]   = Math.min(255, v2 + (255 - v2) * 0.2); // Red channel comes from Doc 2 (inverts Doc 1 darkness)
      diffData[i+1] = Math.min(255, v1 + (255 - v1) * 0.2); // Green channel comes from Doc 1 (inverts Doc 2 darkness)
      diffData[i+2] = Math.min(255, baseB + (255 - baseB) * 0.2); // Blue channel
      diffData[i+3] = 255;
    }
    
    totalDiffPixels += numDiffPixels;
    totalPixels += width * height;

    // Draw the generated diff to the canvas
    diffCtx.putImageData(diff, 0, 0);

    const jpegDataUrl = diffCanvas.toDataURL('image/jpeg', 0.85);
    const image = await newPdf.embedJpg(jpegDataUrl);

    const newPage = newPdf.addPage([width / scale, height / scale]);
    newPage.drawImage(image, { x: 0, y: 0, width: width / scale, height: height / scale });

    if (onProgress) {
      onProgress((i / maxPages) * 100);
    }
  }

  const accuracy = totalPixels > 0 ? Math.max(0, 100 - (totalDiffPixels / totalPixels) * 100) : 100;
  return { bytes: await newPdf.save(), accuracy };
};

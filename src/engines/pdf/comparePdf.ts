import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pixelmatch from 'pixelmatch';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/worker.min.js';

export const comparePdf = async (
  file1: File,
  file2: File,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> => {
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
  const scale = 1.5; // Good balance for performance vs detail

  for (let i = 1; i <= maxPages; i++) {
    let page1, page2;
    try { page1 = await pdfDoc1.getPage(i); } catch (e) {}
    try { page2 = await pdfDoc2.getPage(i); } catch (e) {}

    // Determine target dimensions
    const viewport1 = page1 ? page1.getViewport({ scale }) : null;
    const viewport2 = page2 ? page2.getViewport({ scale }) : null;
    
    const width = Math.max(viewport1?.width || 0, viewport2?.width || 0) || 800;
    const height = Math.max(viewport1?.height || 0, viewport2?.height || 0) || 1200;

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

    // Run pixelmatch
    pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1, diffColor: [255, 0, 0] });

    // We want the diff to show the original document faded out, with red highlights
    // So we draw img1 to diffCtx first, fade it, then draw the diff pixels over it
    diffCtx.putImageData(img1, 0, 0);
    diffCtx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Fade out original
    diffCtx.fillRect(0, 0, width, height);
    
    // Now draw the red diff pixels on top
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width; tempCanvas.height = height;
    tempCanvas.getContext('2d')?.putImageData(diff, 0, 0);
    diffCtx.drawImage(tempCanvas, 0, 0);

    const jpegDataUrl = diffCanvas.toDataURL('image/jpeg', 0.85);
    const image = await newPdf.embedJpg(jpegDataUrl);

    const newPage = newPdf.addPage([width / scale, height / scale]);
    newPage.drawImage(image, { x: 0, y: 0, width: width / scale, height: height / scale });

    if (onProgress) {
      onProgress((i / maxPages) * 100);
    }
  }

  return await newPdf.save();
};

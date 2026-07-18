import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { zipSync, strToU8 } from 'fflate';

// Initialize PDF.js worker using public CDNs or built-in worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const convertImagesToPdf = async (
  files: File[],
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  if (files.length === 0) throw new Error('No images provided');
  onProgress(10);

  const firstImgUrl = URL.createObjectURL(files[0]);
  const firstImg = await loadImage(firstImgUrl);
  URL.revokeObjectURL(firstImgUrl);

  const orientation = firstImg.width > firstImg.height ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'px',
    format: [firstImg.width, firstImg.height],
  });

  for (let i = 0; i < files.length; i++) {
    onProgress(10 + Math.round(((i + 0.5) / files.length) * 80));
    const file = files[i];
    const imgUrl = URL.createObjectURL(file);
    const img = await loadImage(imgUrl);
    URL.revokeObjectURL(imgUrl);

    if (i > 0) {
      doc.addPage([img.width, img.height], img.width > img.height ? 'landscape' : 'portrait');
    }

    const format = file.type.includes('png') ? 'PNG' : 'JPEG';
    doc.addImage(img, format, 0, 0, img.width, img.height);
    onProgress(10 + Math.round(((i + 1) / files.length) * 80));
  }

  onProgress(95);
  const out = doc.output('arraybuffer');
  onProgress(100);
  return new Uint8Array(out);
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

export const convertPdfToImagesZip = async (
  file: File,
  imageFormat: 'png' | 'jpg',
  onProgress: (progress: number) => void
): Promise<{ zipBytes: Uint8Array; filename: string }> => {
  onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDoc.numPages;
  onProgress(30);

  const zipFiles: Record<string, Uint8Array> = {};

  // Add README inside zip emphasizing client-side privacy
  zipFiles['README_PRIVACY.txt'] = strToU8(
    `Processed 100% Client-Side inside your browser using BlitzDocs Wasm Platform.\nFile: ${file.name}\nTotal Pages Extracted: ${totalPages}\nFormat: ${imageFormat.toUpperCase()}\nPrivacy: Files were never sent to any server.`
  );

  for (let i = 1; i <= totalPages; i++) {
    onProgress(30 + Math.round(((i - 0.5) / totalPages) * 60));
    const page = await pdfDoc.getPage(i);
    const scale = 2.0; // High resolution extraction (approx 150-200 DPI)
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas 2D context not available');

    await page.render({ canvasContext: ctx, viewport, canvas: canvas as any }).promise;

    const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    const base64Data = dataUrl.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const binaryStr = window.atob(base64Data);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let j = 0; j < len; j++) {
      bytes[j] = binaryStr.charCodeAt(j);
    }

    const pageNumStr = String(i).padStart(3, '0');
    zipFiles[`page_${pageNumStr}.${imageFormat}`] = bytes;
    onProgress(30 + Math.round((i / totalPages) * 60));
  }

  onProgress(95);
  const zipBytes = zipSync(zipFiles, { level: 6 });
  onProgress(100);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  return {
    zipBytes,
    filename: `${baseName}_images_${imageFormat.toUpperCase()}.zip`,
  };
};

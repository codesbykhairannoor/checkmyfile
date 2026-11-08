import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

import { zipSync, strToU8 } from 'fflate';
import * as pdfjsLib from 'pdfjs-dist';
import PptxGenJS from 'pptxgenjs';

export type WatermarkPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface AddWatermarkConfig {
  type?: 'text' | 'image';
  text: string;
  imageUrl?: string;
  opacity: number;
  color: string;
  scale: number;
  rotation: number;
  position?: WatermarkPosition;
  isRepeating?: boolean;
}

export const addWatermark = async (
  file: File,
  config: AddWatermarkConfig,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(30);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();
  const totalPages = pages.length;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0.75, g: 0.15, b: 0.15 };
  };
  const rgbColor = hexToRgb(config.color);

  let embeddedImage: any = null;
  if (config.type === 'image' && config.imageUrl) {
    try {
      const base64Data = config.imageUrl.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      if (config.imageUrl.includes('image/png')) {
        embeddedImage = await pdf.embedPng(imageBytes);
      } else if (config.imageUrl.includes('image/jpeg') || config.imageUrl.includes('image/jpg')) {
        embeddedImage = await pdf.embedJpg(imageBytes);
      }
    } catch (e) {
      console.warn("Failed to embed watermark image", e);
    }
  }

  const getTargetPoints = (width: number, height: number, pos?: WatermarkPosition, isRepeating?: boolean): { x: number; y: number }[] => {
    if (isRepeating) {
      const points: { x: number; y: number }[] = [];
      const xs = [width * 0.2, width * 0.5, width * 0.8];
      const ys = [height * 0.8, height * 0.5, height * 0.2];
      for (const y of ys) {
        for (const x of xs) {
          points.push({ x, y });
        }
      }
      return points;
    }

    const effectivePos = pos || 'center';
    let targetX = width * 0.5;
    let targetY = height * 0.5;

    switch (effectivePos) {
      case 'top-left':
        targetX = width * 0.22;
        targetY = height * 0.82;
        break;
      case 'top-center':
        targetX = width * 0.5;
        targetY = height * 0.82;
        break;
      case 'top-right':
        targetX = width * 0.78;
        targetY = height * 0.82;
        break;
      case 'center-left':
        targetX = width * 0.22;
        targetY = height * 0.5;
        break;
      case 'center':
        targetX = width * 0.5;
        targetY = height * 0.5;
        break;
      case 'center-right':
        targetX = width * 0.78;
        targetY = height * 0.5;
        break;
      case 'bottom-left':
        targetX = width * 0.22;
        targetY = height * 0.18;
        break;
      case 'bottom-center':
        targetX = width * 0.5;
        targetY = height * 0.18;
        break;
      case 'bottom-right':
        targetX = width * 0.78;
        targetY = height * 0.18;
        break;
    }

    return [{ x: targetX, y: targetY }];
  };

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const isRep = !!config.isRepeating;
    const baseTextSize = Math.min(width, height) / (isRep ? 13 : 9);
    const textSize = baseTextSize * config.scale;
    const text = config.text || 'CONFIDENTIAL';
    const textWidth = font.widthOfTextAtSize(text, textSize);

    const angle = -config.rotation * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const points = getTargetPoints(width, height, config.position, config.isRepeating);

    for (const pt of points) {
      if (embeddedImage) {
        const imgScaleFactor = isRep ? 0.28 : 0.5;
        const imgWidth = width * imgScaleFactor * config.scale;
        const imgHeight = (embeddedImage.height / embeddedImage.width) * imgWidth;
        
        const cx_img = imgWidth / 2;
        const cy_img = imgHeight / 2;
        const dx_img = cx_img * cos - cy_img * sin;
        const dy_img = cx_img * sin + cy_img * cos;

        page.drawImage(embeddedImage, {
          x: pt.x - dx_img,
          y: pt.y - dy_img,
          width: imgWidth,
          height: imgHeight,
          opacity: config.opacity,
          rotate: degrees(-config.rotation),
        });
      } else {
        const cx_text = textWidth / 2;
        const cy_text = textSize / 3;
        const dx_text = cx_text * cos - cy_text * sin;
        const dy_text = cx_text * sin + cy_text * cos;

        page.drawText(text, {
          x: pt.x - dx_text,
          y: pt.y - dy_text,
          size: textSize,
          font,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity: config.opacity,
          rotate: degrees(-config.rotation),
        });
      }
    }
    onProgress(30 + Math.round(((i + 1) / totalPages) * 60));
  }

  const data = await pdf.save();
  onProgress(100);
  return data;
};

export const convertPdfToPptx = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const numPages = pdf.numPages;
  onProgress(30);

  const pres = new PptxGenJS();
  let slideWidthIn = 10; // inches
  let slideHeightIn = 7.5; // inches
  let layoutSet = false;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1.0 });
    const pdfW = baseViewport.width;   // PDF units (1/72 inch)
    const pdfH = baseViewport.height;

    // Set presentation layout based on first page
    if (!layoutSet) {
      // Keep slide at standard width, adjust height for aspect ratio
      slideWidthIn = 10;
      slideHeightIn = (pdfH / pdfW) * slideWidthIn;
      // Clamp to reasonable presentation sizes
      if (slideHeightIn > 12) { slideHeightIn = 12; }
      pres.defineLayout({ name: 'CUSTOM_PDF', width: slideWidthIn, height: slideHeightIn });
      pres.layout = 'CUSTOM_PDF';
      layoutSet = true;
    }

    // --- STEP 1: Render page as high-res image (2x) ---
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    const base64Image = canvas.toDataURL('image/jpeg', 0.92);

    const slide = pres.addSlide();

    // Add background image covering 100% of slide
    slide.addImage({ data: base64Image, x: 0, y: 0, w: '100%', h: '100%' });

    // --- STEP 2: Extract text with positions and overlay transparent text boxes ---
    const textContent = await page.getTextContent();
    for (const item of textContent.items) {
      if (!('str' in item) || !item.str.trim()) continue;

      // Transform matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
      const [, , , scaleY, tx, ty] = item.transform as number[];
      const fontSize = Math.abs(scaleY); // font size in PDF user units

      // Convert PDF coordinates to slide inches
      // PDF origin is bottom-left, PPTX origin is top-left
      const xIn = (tx / pdfW) * slideWidthIn;
      const yIn = ((pdfH - ty - fontSize) / pdfH) * slideHeightIn;
      const wIn = Math.max(0.2, ((item as any).width / pdfW) * slideWidthIn);
      const hIn = Math.max(0.1, (fontSize / pdfH) * slideHeightIn * 1.3); // 1.3 line-height buffer
      const fontSizePt = Math.max(6, Math.round((fontSize / pdfH) * slideHeightIn * 72));

      // Clamp to within slide bounds
      if (xIn < 0 || yIn < 0 || xIn > slideWidthIn || yIn > slideHeightIn) continue;

      try {
        slide.addText(item.str, {
          x: xIn,
          y: yIn,
          w: Math.min(wIn, slideWidthIn - xIn),
          h: Math.min(hIn, slideHeightIn - yIn),
          fontSize: fontSizePt,
          color: 'FFFFFF', // White so it's invisible over the image
          transparency: 100, // Fully transparent text box — still selectable in PowerPoint
          fontFace: 'Arial',
          wrap: false,
        });
      } catch (_) {
        // Skip items that fail to add (e.g. out-of-bounds coordinates)
      }
    }

    onProgress(30 + Math.round((i / numPages) * 65));
  }

  onProgress(95);
  const outBuf = await pres.write({ outputType: 'arraybuffer' });
  onProgress(100);
  return new Uint8Array(outBuf as ArrayBuffer);
};

export const convertPdfToImage = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const numPages = pdf.numPages;
  onProgress(30);

  const zipFiles: Record<string, Uint8Array> = {};

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport, canvas: canvas as any }).promise;

      const base64 = canvas.toDataURL('image/png').split(',')[1];
      const binaryStr = atob(base64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let j = 0; j < len; j++) {
        bytes[j] = binaryStr.charCodeAt(j);
      }
      zipFiles[`${file.name.replace(/\.[^/.]+$/, '')}_page_${i}.png`] = bytes;
    }
    onProgress(30 + Math.round((i / numPages) * 60));
  }

  onProgress(95);
  const zipped = zipSync(zipFiles);
  onProgress(100);
  return zipped;
};

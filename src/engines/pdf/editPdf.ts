import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface PdfEditElement {
  id: string;
  type: 'text' | 'image';
  pageIndex: number;
  x: number; // 0-100 percentage relative to page width
  y: number; // 0-100 percentage relative to page height
  width?: number; // percentage
  height?: number; // percentage
  text?: string;
  fontSize?: number;
  color?: string; // Hex string #RRGGBB
  fontFamily?: string;
  imageUrl?: string; // Base64 data URL
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
};

export const editPdf = async (
  file: File,
  elements: PdfEditElement[],
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  onProgress(30);

  const pages = pdfDoc.getPages();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const embedImageCache: Record<string, any> = {};

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (el.pageIndex < 0 || el.pageIndex >= pages.length) continue;
    
    const page = pages[el.pageIndex];
    const { width, height } = page.getSize();
    
    // Convert Web coordinate (top-left origin) to PDF coordinate (bottom-left origin)
    const pdfX = (el.x / 100) * width;
    let pdfY = height - ((el.y / 100) * height);
    
    if (el.type === 'text' && el.text) {
      const colorRGB = hexToRgb(el.color || '#000000');
      const fontSize = el.fontSize || 16;
      
      // Adjust Y for text baseline approximation
      pdfY = pdfY - (fontSize * 0.75);

      // Support basic newlines
      const lines = el.text.split('\n');
      for (let l = 0; l < lines.length; l++) {
        page.drawText(lines[l], {
          x: pdfX,
          y: pdfY - (l * fontSize * 1.2),
          size: fontSize,
          font: el.fontFamily === 'bold' ? helveticaBold : helveticaFont,
          color: rgb(colorRGB.r, colorRGB.g, colorRGB.b),
        });
      }
    } else if (el.type === 'image' && el.imageUrl) {
      let imageObj = embedImageCache[el.imageUrl];
      if (!imageObj) {
        if (el.imageUrl.includes('image/png')) {
          imageObj = await pdfDoc.embedPng(el.imageUrl);
        } else if (el.imageUrl.includes('image/jpeg') || el.imageUrl.includes('image/jpg')) {
          imageObj = await pdfDoc.embedJpg(el.imageUrl);
        }
        if (imageObj) {
          embedImageCache[el.imageUrl] = imageObj;
        }
      }
      
      if (imageObj) {
        const elW = el.width || 20;
        const elH = el.height || 20;
        const targetW = (elW / 100) * width;
        const targetH = (elH / 100) * height;
        
        page.drawImage(imageObj, {
          x: pdfX,
          y: pdfY - targetH, // subtract height because drawImage originates at bottom-left of the image
          width: targetW,
          height: targetH,
        });
      }
    }
    
    onProgress(30 + Math.floor(((i + 1) / elements.length) * 50));
  }

  onProgress(85);
  const pdfBytes = await pdfDoc.save();
  onProgress(100);
  
  return pdfBytes;
};

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export type EditElementType = 'text' | 'image' | 'whiteout' | 'highlight' | 'shape' | 'ink';

export interface PdfEditElement {
  id: string;
  type: EditElementType;
  pageIndex: number;
  x: number; // 0-100 percentage relative to page width
  y: number; // 0-100 percentage relative to page height
  width?: number; // 0-100 percentage relative to page width
  height?: number; // 0-100 percentage relative to page height
  rotation?: number; // 0-360 degrees
  opacity?: number; // 0-1
  // Text specific
  text?: string;
  fontSize?: number; // in points
  color?: string; // Hex string #RRGGBB
  fontFamily?: 'Helvetica' | 'Helvetica-Bold' | 'Courier' | 'Courier-Bold' | 'Times-Roman' | 'Times-Roman-Bold';
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  // Whiteout & Highlight specific
  fillColor?: string; // Hex string #RRGGBB
  strokeColor?: string; // Hex string #RRGGBB
  strokeWidth?: number; // in points
  // Shape specific
  shapeType?: 'rectangle' | 'circle' | 'line' | 'arrow';
  // Image specific
  imageUrl?: string; // Base64 data URL
  // Ink / Freehand drawing specific
  points?: { x: number; y: number }[]; // Coordinates in percentage 0-100
}

const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  if (result) {
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    };
  }
  // 3-digit hex fallback
  const shortResult = /^([a-f\d])([a-f\d])([a-f\d])$/i.exec(cleanHex);
  if (shortResult) {
    return {
      r: parseInt(shortResult[1] + shortResult[1], 16) / 255,
      g: parseInt(shortResult[2] + shortResult[2], 16) / 255,
      b: parseInt(shortResult[3] + shortResult[3], 16) / 255
    };
  }
  return { r: 0, g: 0, b: 0 };
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
  
  // Pre-load standard font families
  const fonts = {
    'Helvetica': await pdfDoc.embedFont(StandardFonts.Helvetica),
    'Helvetica-Bold': await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    'Courier': await pdfDoc.embedFont(StandardFonts.Courier),
    'Courier-Bold': await pdfDoc.embedFont(StandardFonts.CourierBold),
    'Times-Roman': await pdfDoc.embedFont(StandardFonts.TimesRoman),
    'Times-Roman-Bold': await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
  };

  const embedImageCache: Record<string, any> = {};

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (el.pageIndex < 0 || el.pageIndex >= pages.length) continue;

    const page = pages[el.pageIndex];
    const { width, height } = page.getSize();

    // Convert Web coordinate (top-left origin, percentage) to PDF coordinate (bottom-left origin, points)
    const pdfX = (el.x / 100) * width;
    let pdfY = height - ((el.y / 100) * height);
    const targetW = ((el.width || 20) / 100) * width;
    const targetH = ((el.height || 10) / 100) * height;
    const elemOpacity = el.opacity !== undefined ? Math.max(0, Math.min(1, el.opacity)) : 1;
    const elemRotate = el.rotation ? degrees(el.rotation) : undefined;

    switch (el.type) {
      case 'text': {
        if (!el.text) break;
        const colorRGB = hexToRgb(el.color || '#000000');
        const fontSize = el.fontSize || 16;
        const fontKey = el.fontFamily && fonts[el.fontFamily] ? el.fontFamily : 'Helvetica';
        const selectedFont = fonts[fontKey];

        // Draw background pill if configured
        if (el.backgroundColor) {
          const bgRGB = hexToRgb(el.backgroundColor);
          page.drawRectangle({
            x: pdfX - 4,
            y: pdfY - targetH - 4,
            width: targetW + 8,
            height: targetH + 8,
            color: rgb(bgRGB.r, bgRGB.g, bgRGB.b),
            opacity: elemOpacity,
            rotate: elemRotate,
          });
        }

        const lines = el.text.split('\n');
        for (let l = 0; l < lines.length; l++) {
          const lineText = lines[l];
          let lineX = pdfX;

          // Alignment calculation if bounding box width is specified
          if (el.textAlign && el.width) {
            const lineWidth = selectedFont.widthOfTextAtSize(lineText, fontSize);
            if (el.textAlign === 'center') {
              lineX = pdfX + Math.max(0, (targetW - lineWidth) / 2);
            } else if (el.textAlign === 'right') {
              lineX = pdfX + Math.max(0, targetW - lineWidth);
            }
          }

          page.drawText(lineText, {
            x: lineX,
            y: pdfY - (fontSize * 0.8) - (l * fontSize * 1.25),
            size: fontSize,
            font: selectedFont,
            color: rgb(colorRGB.r, colorRGB.g, colorRGB.b),
            opacity: elemOpacity,
            rotate: elemRotate,
          });
        }
        break;
      }

      case 'whiteout': {
        // Solid opaque whiteout box covering underlying PDF content
        const fillRGB = hexToRgb(el.fillColor || '#ffffff');
        const borderRGB = el.strokeColor ? hexToRgb(el.strokeColor) : undefined;
        page.drawRectangle({
          x: pdfX,
          y: pdfY - targetH,
          width: targetW,
          height: targetH,
          color: rgb(fillRGB.r, fillRGB.g, fillRGB.b),
          borderColor: borderRGB ? rgb(borderRGB.r, borderRGB.g, borderRGB.b) : undefined,
          borderWidth: el.strokeWidth || 0,
          opacity: elemOpacity,
          rotate: elemRotate,
        });
        break;
      }

      case 'highlight': {
        // Translucent highlight box overlay
        const fillRGB = hexToRgb(el.fillColor || '#facc15'); // Yellow default
        page.drawRectangle({
          x: pdfX,
          y: pdfY - targetH,
          width: targetW,
          height: targetH,
          color: rgb(fillRGB.r, fillRGB.g, fillRGB.b),
          opacity: el.opacity !== undefined ? el.opacity : 0.38,
          rotate: elemRotate,
        });
        break;
      }

      case 'shape': {
        const fillRGB = el.fillColor ? hexToRgb(el.fillColor) : undefined;
        const strokeRGB = hexToRgb(el.strokeColor || '#ef4444');
        const strokeW = el.strokeWidth || 2;

        if (el.shapeType === 'circle') {
          page.drawEllipse({
            x: pdfX + (targetW / 2),
            y: pdfY - (targetH / 2),
            xScale: targetW / 2,
            yScale: targetH / 2,
            color: fillRGB ? rgb(fillRGB.r, fillRGB.g, fillRGB.b) : undefined,
            borderColor: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
            borderWidth: strokeW,
            opacity: elemOpacity,
            rotate: elemRotate,
          });
        } else if (el.shapeType === 'line') {
          page.drawLine({
            start: { x: pdfX, y: pdfY },
            end: { x: pdfX + targetW, y: pdfY - targetH },
            thickness: strokeW,
            color: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
            opacity: elemOpacity,
          });
        } else if (el.shapeType === 'arrow') {
          const startX = pdfX;
          const startY = pdfY;
          const endX = pdfX + targetW;
          const endY = pdfY - targetH;

          // Main line
          page.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: strokeW,
            color: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
            opacity: elemOpacity,
          });

          // Arrow head calculation
          const angle = Math.atan2(endY - startY, endX - startX);
          const headLength = Math.max(10, strokeW * 4);
          const arrowAngle = Math.PI / 6; // 30 degrees

          page.drawLine({
            start: { x: endX, y: endY },
            end: {
              x: endX - headLength * Math.cos(angle - arrowAngle),
              y: endY - headLength * Math.sin(angle - arrowAngle)
            },
            thickness: strokeW,
            color: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
            opacity: elemOpacity,
          });

          page.drawLine({
            start: { x: endX, y: endY },
            end: {
              x: endX - headLength * Math.cos(angle + arrowAngle),
              y: endY - headLength * Math.sin(angle + arrowAngle)
            },
            thickness: strokeW,
            color: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
            opacity: elemOpacity,
          });
        } else {
          // Default: Rectangle
          page.drawRectangle({
            x: pdfX,
            y: pdfY - targetH,
            width: targetW,
            height: targetH,
            color: fillRGB ? rgb(fillRGB.r, fillRGB.g, fillRGB.b) : undefined,
            borderColor: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
            borderWidth: strokeW,
            opacity: elemOpacity,
            rotate: elemRotate,
          });
        }
        break;
      }

      case 'ink': {
        // Freehand vector drawing points
        if (el.points && el.points.length > 1) {
          const strokeRGB = hexToRgb(el.strokeColor || '#1e3a8a');
          const strokeW = el.strokeWidth || 2.5;

          for (let p = 0; p < el.points.length - 1; p++) {
            const p1 = el.points[p];
            const p2 = el.points[p + 1];

            const startX = (p1.x / 100) * width;
            const startY = height - ((p1.y / 100) * height);
            const endX = (p2.x / 100) * width;
            const endY = height - ((p2.y / 100) * height);

            page.drawLine({
              start: { x: startX, y: startY },
              end: { x: endX, y: endY },
              thickness: strokeW,
              color: rgb(strokeRGB.r, strokeRGB.g, strokeRGB.b),
              opacity: elemOpacity,
            });
          }
        }
        break;
      }

      case 'image': {
        if (!el.imageUrl) break;
        let imageObj = embedImageCache[el.imageUrl];
        if (!imageObj) {
          try {
            if (el.imageUrl.includes('image/png')) {
              imageObj = await pdfDoc.embedPng(el.imageUrl);
            } else if (el.imageUrl.includes('image/jpeg') || el.imageUrl.includes('image/jpg')) {
              imageObj = await pdfDoc.embedJpg(el.imageUrl);
            } else {
              // Convert any other format data URL to PNG
              imageObj = await pdfDoc.embedPng(el.imageUrl);
            }
          } catch (embedErr) {
            console.warn('[EditPDF] Image embed fallback error:', embedErr);
          }
          if (imageObj) {
            embedImageCache[el.imageUrl] = imageObj;
          }
        }

        if (imageObj) {
          page.drawImage(imageObj, {
            x: pdfX,
            y: pdfY - targetH,
            width: targetW,
            height: targetH,
            opacity: elemOpacity,
            rotate: elemRotate,
          });
        }
        break;
      }
    }

    onProgress(30 + Math.floor(((i + 1) / elements.length) * 55));
  }

  onProgress(90);
  const pdfBytes = await pdfDoc.save();
  onProgress(100);

  return pdfBytes;
};

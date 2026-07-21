import jsPDF from 'jspdf';
import { unzipSync } from 'fflate';
import html2canvas from 'html2canvas';

// Helper: safely decode bytes as UTF-8
export const decode = (b: Uint8Array) => new TextDecoder('utf-8').decode(b);

// Helper: convert EMUs (English Metric Units) to pixels (96dpi)
export const emuToPx = (emu: number) => Math.round(emu / 914400 * 96);

// Helper: parse a hex color string from xml attribute like "RRGGBB" or "FFRRGGBB"
export const parseColor = (hex?: string): string => {
  if (!hex) return '#1F2937';
  const clean = hex.replace('#', '').slice(-6);
  return `#${clean}`;
};

export interface SlideShape {
  type: 'text' | 'image';
  x: number; y: number; w: number; h: number;
  text?: string;
  fontSize?: number;
  bold?: boolean;
  color?: string;
  bgColor?: string;
  align?: string;
  imgKey?: string;
}

export interface ParsedSlide {
  bgColor: string;
  shapes: SlideShape[];
  slideWidth: number;
  slideHeight: number;
}

export function parseSlideXml(slideXml: string, slideKey: string, unzipped: Record<string, Uint8Array>): ParsedSlide {
  // Slide dimensions default to 16:9 (10 inches x 7.5 inches in EMU: 9144000 x 6858000)
  let slideWidth = 9144000;
  let slideHeight = 6858000;

  // Try to read presentation.xml for slide dimensions
  if (unzipped['ppt/presentation.xml']) {
    const presXml = decode(unzipped['ppt/presentation.xml']);
    const szMatch = presXml.match(/<p:sldSz[^>]+cx="(\d+)"[^>]+cy="(\d+)"/);
    if (szMatch) {
      slideWidth = parseInt(szMatch[1]);
      slideHeight = parseInt(szMatch[2]);
    }
  }

  const pxW = emuToPx(slideWidth);
  const pxH = emuToPx(slideHeight);

  // Background color
  let bgColor = '#FFFFFF';
  const bgMatch = slideXml.match(/<p:bg>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/);
  if (bgMatch) bgColor = `#${bgMatch[1]}`;

  // Read slide relationships to get image paths
  const relKey = slideKey.replace('ppt/slides/slide', 'ppt/slides/_rels/slide').replace('.xml', '.xml.rels');
  const relMap: Record<string, string> = {};
  if (unzipped[relKey]) {
    const relXml = decode(unzipped[relKey]);
    const relMatches = [...relXml.matchAll(/Id="([^"]+)"[^>]+Target="([^"]+)"/g)];
    for (const m of relMatches) {
      // Resolve relative path
      const target = m[2].startsWith('../') 
        ? `ppt/${m[2].slice(3)}` 
        : `ppt/slides/${m[2]}`;
      relMap[m[1]] = target;
    }
  }

  const shapes: SlideShape[] = [];

  // Parse each shape (sp) and picture (pic)
  const spPattern = /<p:sp>([\s\S]*?)<\/p:sp>/g;
  for (const spMatch of [...slideXml.matchAll(spPattern)]) {
    const sp = spMatch[1];

    // Position
    const offMatch = sp.match(/<a:off x="(\d+)" y="(\d+)"/);
    const extMatch = sp.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
    if (!offMatch || !extMatch) continue;

    const x = Math.round(emuToPx(parseInt(offMatch[1])));
    const y = Math.round(emuToPx(parseInt(offMatch[2])));
    const w = Math.round(emuToPx(parseInt(extMatch[1])));
    const h = Math.round(emuToPx(parseInt(extMatch[2])));

    // Background fill
    const bgFillMatch = sp.match(/<a:solidFill>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/);
    const shapeBg = bgFillMatch ? `#${bgFillMatch[1]}` : 'transparent';

    // Text runs
    const textRuns: string[] = [];
    for (const runMatch of [...sp.matchAll(/<a:r>([\s\S]*?)<\/a:r>/g)]) {
      const tMatch = runMatch[1].match(/<a:t>([^<]*)<\/a:t>/);
      if (tMatch && tMatch[1].trim()) textRuns.push(tMatch[1]);
    }

    if (textRuns.length === 0) continue;

    // Font size (in hundredths of a point)
    const szMatch = sp.match(/sz="(\d+)"/);
    const fontSize = szMatch ? Math.max(8, Math.round(parseInt(szMatch[1]) / 100)) : 14;

    // Bold
    const isBold = /<a:rPr[^>]*\bb="1"/.test(sp) || /<a:rPr[^>]*\bbold="1"/.test(sp);

    // Color
    const colorMatch = sp.match(/<a:rPr[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/);
    const color = colorMatch ? `#${colorMatch[1]}` : '#1F2937';

    // Alignment
    const alignMatch = sp.match(/<a:pPr[^>]*algn="([^"]+)"/);
    const align = alignMatch ? alignMatch[1] : 'l';

    shapes.push({
      type: 'text',
      x, y, w, h,
      text: textRuns.join(' '),
      fontSize,
      bold: isBold,
      color,
      bgColor: shapeBg,
      align: align === 'ctr' ? 'center' : align === 'r' ? 'right' : 'left',
    });
  }

  // Parse pictures (blipFill references)
  const picPattern = /<p:pic>([\s\S]*?)<\/p:pic>/g;
  for (const picMatch of [...slideXml.matchAll(picPattern)]) {
    const pic = picMatch[1];
    const offMatch = pic.match(/<a:off x="(\d+)" y="(\d+)"/);
    const extMatch = pic.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
    const rIdMatch = pic.match(/r:embed="([^"]+)"/);
    if (!offMatch || !extMatch || !rIdMatch) continue;

    const x = emuToPx(parseInt(offMatch[1]));
    const y = emuToPx(parseInt(offMatch[2]));
    const w = emuToPx(parseInt(extMatch[1]));
    const h = emuToPx(parseInt(extMatch[2]));
    const imgKey = relMap[rIdMatch[1]];
    if (!imgKey || !unzipped[imgKey]) continue;

    shapes.push({ type: 'image', x, y, w, h, imgKey });
  }

  return { bgColor, shapes, slideWidth: pxW, slideHeight: pxH };
}

export const convertPptxToPdf = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(10);
  const unzipped = unzipSync(new Uint8Array(await file.arrayBuffer()));
  onProgress(25);

  const slideKeys = Object.keys(unzipped)
    .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] || '0');
      const nb = parseInt(b.match(/\d+/)?.[0] || '0');
      return na - nb;
    });

  if (slideKeys.length === 0) throw new Error('No slides found in PPTX file.');

  // Parse first slide to get dimensions
  const firstParsed = parseSlideXml(decode(unzipped[slideKeys[0]]), slideKeys[0], unzipped);
  const pxW = firstParsed.slideWidth;
  const pxH = firstParsed.slideHeight;
  const isLandscape = pxW >= pxH;

  // Create off-screen container safely (fixed position behind everything)
  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:0;top:0;width:${pxW}px;height:${pxH}px;overflow:hidden;box-sizing:border-box;z-index:-9999;pointer-events:none;`;
  document.body.appendChild(container);

  // Create jsPDF document with the EXACT dimensions of the slide in pixels
  const doc = new jsPDF({ 
    orientation: isLandscape ? 'landscape' : 'portrait', 
    unit: 'px', 
    format: [pxW, pxH] 
  });

  try {
    for (let si = 0; si < slideKeys.length; si++) {
      const slideKey = slideKeys[si];
      const slideXml = decode(unzipped[slideKey]);
      const parsed = parseSlideXml(slideXml, slideKey, unzipped);

      // Build the slide HTML
      container.style.background = parsed.bgColor;
      container.innerHTML = '';

      for (const shape of parsed.shapes) {
        const el = document.createElement('div');
        el.style.cssText = `position:absolute;left:${shape.x}px;top:${shape.y}px;width:${shape.w}px;height:${shape.h}px;overflow:hidden;box-sizing:border-box;`;

        if (shape.type === 'image' && shape.imgKey) {
          const imgBytes = unzipped[shape.imgKey];
          const ext = shape.imgKey.split('.').pop()?.toLowerCase() || 'png';
          const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : 'image/png';
          
          // Safely convert large byte arrays to base64 URL
          const blob = new Blob([imgBytes], { type: mime });
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          const img = document.createElement('img');
          img.src = dataUrl;
          img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
          el.appendChild(img);
        } else if (shape.type === 'text' && shape.text) {
          if (shape.bgColor && shape.bgColor !== 'transparent') {
            el.style.background = shape.bgColor;
          }
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.padding = '4px 8px';
          const span = document.createElement('span');
          span.style.cssText = `
            font-family: Calibri, Arial, sans-serif;
            font-size: ${shape.fontSize}px;
            font-weight: ${shape.bold ? '700' : '400'};
            color: ${shape.color};
            text-align: ${shape.align};
            width: 100%;
            word-break: break-word;
            line-height: 1.3;
            white-space: pre-wrap;
          `;
          span.textContent = shape.text;
          el.appendChild(span);
        }
        container.appendChild(el);
      }

      // Render to canvas and add to PDF
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: parsed.bgColor,
        width: pxW,
        height: pxH,
        windowWidth: pxW,
        windowHeight: pxH,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0
      });

      if (si > 0) doc.addPage([pxW, pxH], isLandscape ? 'landscape' : 'portrait');
      doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pxW, pxH, undefined, 'FAST');
      onProgress(25 + Math.round(((si + 1) / slideKeys.length) * 70));
    }
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }

  onProgress(100);
  return new Uint8Array(doc.output('arraybuffer'));
};

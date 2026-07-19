import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

import { zipSync, strToU8 } from 'fflate';
import * as pdfjsLib from 'pdfjs-dist';
import PptxGenJS from 'pptxgenjs';

export const addWatermark = async (
  file: File,
  config: { type?: 'text' | 'image'; text: string; imageUrl?: string; opacity: number; color: string; scale: number; rotation: number },
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

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const baseTextSize = Math.min(width, height) / 9;
    const textSize = baseTextSize * config.scale;
    const text = config.text || 'CONFIDENTIAL';
    const textWidth = font.widthOfTextAtSize(text, textSize);

    const angle = -config.rotation * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    if (embeddedImage) {
      const imgWidth = width * 0.5 * config.scale; // Matches CSS width: 50% + transform: scale()
      const imgHeight = (embeddedImage.height / embeddedImage.width) * imgWidth;
      
      const cx_img = imgWidth / 2;
      const cy_img = imgHeight / 2;
      const dx_img = cx_img * cos - cy_img * sin;
      const dy_img = cx_img * sin + cy_img * cos;

      page.drawImage(embeddedImage, {
        x: width / 2 - dx_img,
        y: height / 2 - dy_img,
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
        x: width / 2 - dx_text,
        y: height / 2 - dy_text,
        size: textSize,
        font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: config.opacity,
        rotate: degrees(-config.rotation),
      });
    }
    onProgress(30 + Math.round(((i + 1) / totalPages) * 60));
  }

  const data = await pdf.save();
  onProgress(100);
  return data;
};

export const convertPdfToWord = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const numPages = pdf.numPages;
  onProgress(35);

  // Collect structured lines and spans from all pages with exact font metadata
  interface PdfSpan {
    text: string;
    x: number;
    y: number;
    width: number;
    fontSizePt: number;
    fontFamily: string;
    isBold: boolean;
    isItalic: boolean;
  }

  interface PdfLine {
    y: number;
    spans: PdfSpan[];
  }

  const pagesContent: { lines: PdfLine[] }[] = [];
  const escape = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const fontStyles: any = content.styles || {};

    const rawItems = content.items
      .filter((item: any): item is (typeof item & { str: string; transform: number[]; width?: number; height?: number; fontName?: string }) => 'str' in item && item.str.trim().length > 0)
      .map((item: any) => {
        const transform = item.transform || [12, 0, 0, 12, 0, 0];
        const x = transform[4] || 0;
        const y = transform[5] || 0;
        const fontSizePt = Math.max(7, Math.round(Math.sqrt(transform[0] * transform[0] + transform[1] * transform[1]) || item.height || 12));
        const fontName = item.fontName || '';
        const styleObj = fontStyles[fontName] || {};
        const rawFamily = styleObj.fontFamily || fontName || 'Calibri';

        let fontFamily = 'Calibri';
        if (/times|serif|tinos/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Times New Roman';
        else if (/arial|arimo|helv/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Arial';
        else if (/courier|mono/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Courier New';
        else if (/georgia/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Georgia';
        else if (/tahoma/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Tahoma';
        else if (/verdana/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Verdana';
        else if (/cambria/i.test(rawFamily + ' ' + fontName)) fontFamily = 'Cambria';
        else if (typeof rawFamily === 'string' && !rawFamily.includes('_')) fontFamily = rawFamily.replace(/^[A-Z]{6}\+/, '');

        const isBold = /bold|heavy|black|w[789]00/i.test(fontName + ' ' + rawFamily);
        const isItalic = /italic|oblique/i.test(fontName + ' ' + rawFamily);

        return {
          text: item.str,
          x,
          y,
          width: item.width || (item.str.length * fontSizePt * 0.5),
          fontSizePt,
          fontFamily,
          isBold,
          isItalic,
        } as PdfSpan;
      });

    // Group items into horizontal lines (threshold: Math.max(3.5, fontSize * 0.4))
    const lines: PdfLine[] = [];
    for (const item of rawItems) {
      const threshold = Math.max(3.5, item.fontSizePt * 0.4);
      const existing = lines.find((l) => Math.abs(l.y - item.y) <= threshold);
      if (existing) {
        existing.spans.push(item);
      } else {
        lines.push({ y: item.y, spans: [item] });
      }
    }

    // Sort lines top-to-bottom (higher Y in PDF is top of page)
    lines.sort((a, b) => b.y - a.y);

    // For each line, sort spans left-to-right and merge adjacent contiguous spans with identical formatting
    for (const line of lines) {
      line.spans.sort((a, b) => a.x - b.x);
      const mergedSpans: PdfSpan[] = [];
      for (const s of line.spans) {
        if (mergedSpans.length === 0) {
          mergedSpans.push({ ...s });
        } else {
          const prev = mergedSpans[mergedSpans.length - 1];
          const gap = s.x - (prev.x + prev.width);
          // If formatting is identical and gap is small (< 12 pt), merge into single span
          if (
            prev.fontFamily === s.fontFamily &&
            prev.fontSizePt === s.fontSizePt &&
            prev.isBold === s.isBold &&
            prev.isItalic === s.isItalic &&
            gap < 12
          ) {
            const space = gap > 2.5 && !prev.text.endsWith(' ') && !s.text.startsWith(' ') ? ' ' : '';
            prev.text += space + s.text;
            prev.width = (s.x + s.width) - prev.x;
          } else {
            mergedSpans.push({ ...s });
          }
        }
      }
      line.spans = mergedSpans;
    }

    pagesContent.push({ lines });
    onProgress(35 + Math.round((pageNum / numPages) * 45));
  }

  let xmlBody = '';

  for (let pIdx = 0; pIdx < pagesContent.length; pIdx++) {
    const page = pagesContent[pIdx];
    const lines = page.lines;

    // Detect multi-column or table rows (consecutive lines that have 2 or more distinct column spans aligned in X)
    let lIdx = 0;
    while (lIdx < lines.length) {
      const currentLine = lines[lIdx];

      // Check if current line and upcoming lines form a table (>= 2 spans)
      if (currentLine.spans.length >= 2) {
        let endIdx = lIdx;
        while (endIdx < lines.length && lines[endIdx].spans.length >= 2) {
          endIdx++;
        }

        // If 2 or more consecutive multi-column lines exist, build a high-precision Word Table (<w:tbl>)
        if (endIdx - lIdx >= 2) {
          const tableLines = lines.slice(lIdx, endIdx);

          // Step A: Collect and cluster all distinct X coordinates into fixed column buckets across the entire table
          const rawXs = tableLines.flatMap(l => l.spans.map(s => s.x)).sort((a, b) => a - b);
          const colXBuckets: number[] = [];
          for (const xVal of rawXs) {
            const existing = colXBuckets.find(b => Math.abs(b - xVal) <= 24);
            if (!existing && colXBuckets.length === 0) {
              colXBuckets.push(xVal);
            } else if (!existing && colXBuckets.length > 0) {
              // Check gap from last bucket
              if (xVal - colXBuckets[colXBuckets.length - 1] > 24) {
                colXBuckets.push(xVal);
              }
            }
          }

          const numCols = Math.max(2, colXBuckets.length);
          const colWidthDxa = Math.round(9200 / numCols);

          let tableXml = `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="6" w:space="0" w:color="B0B8C4"/><w:left w:val="single" w:sz="6" w:space="0" w:color="B0B8C4"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="B0B8C4"/><w:right w:val="single" w:sz="6" w:space="0" w:color="B0B8C4"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/></w:tblBorders><w:tblCellMar><w:top w:w="140" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/><w:left w:w="180" w:type="dxa"/><w:right w:w="180" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>`;
          for (let c = 0; c < numCols; c++) {
            tableXml += `<w:gridCol w:w="${colWidthDxa}"/>`;
          }
          tableXml += `</w:tblGrid>`;

          for (const tl of tableLines) {
            tableXml += `<w:tr>`;
            for (let c = 0; c < numCols; c++) {
              // Find spans whose X coordinate falls into this column bucket closest distance
              const matchedSpans = tl.spans.filter(s => {
                let closestIdx = 0;
                let minDist = Math.abs(s.x - (colXBuckets[0] ?? 0));
                for (let k = 1; k < colXBuckets.length; k++) {
                  const d = Math.abs(s.x - (colXBuckets[k] ?? (k * 150)));
                  if (d < minDist) {
                    minDist = d;
                    closestIdx = k;
                  }
                }
                return closestIdx === c;
              });

              tableXml += `<w:tc><w:tcPr><w:tcW w:w="${colWidthDxa}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>`;
              if (matchedSpans.length > 0) {
                for (const span of matchedSpans) {
                  const szVal = Math.round(span.fontSizePt * 2);
                  tableXml += `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="${escape(span.fontFamily)}" w:hAnsi="${escape(span.fontFamily)}"/>${span.isBold ? '<w:b/>' : ''}${span.isItalic ? '<w:i/>' : ''}<w:sz w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escape(span.text)}</w:t></w:r></w:p>`;
                }
              } else {
                tableXml += `<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>`;
              }
              tableXml += `</w:tc>`;
            }
            tableXml += `</w:tr>`;
          }
          tableXml += `</w:tbl>`;
          xmlBody += tableXml;
          lIdx = endIdx;
          continue;
        }
      }

      // Normal paragraph line
      const maxSz = Math.max(...currentLine.spans.map(s => s.fontSizePt));
      const isHeading = maxSz >= 15;
      const spacingAfter = isHeading ? 100 : 80;
      const pStyleAttr = isHeading ? (maxSz >= 18 ? 'Heading1' : 'Heading2') : 'Normal';

      let pRuns = '';
      for (let sIdx = 0; sIdx < currentLine.spans.length; sIdx++) {
        const span = currentLine.spans[sIdx];
        if (sIdx > 0) {
          const prevSpan = currentLine.spans[sIdx - 1];
          const gap = span.x - (prevSpan.x + prevSpan.width);
          if (gap > 20) {
            pRuns += `<w:r><w:tab/></w:r>`;
          } else if (gap > 4 && !prevSpan.text.endsWith(' ') && !span.text.startsWith(' ')) {
            pRuns += `<w:r><w:t xml:space="preserve"> </w:t></w:r>`;
          }
        }
        const szVal = Math.round(span.fontSizePt * 2);
        pRuns += `<w:r><w:rPr><w:rFonts w:ascii="${escape(span.fontFamily)}" w:hAnsi="${escape(span.fontFamily)}"/>${span.isBold ? '<w:b/>' : ''}${span.isItalic ? '<w:i/>' : ''}<w:sz w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escape(span.text)}</w:t></w:r>`;
      }

      if (!pRuns) {
        lIdx++;
        continue;
      }

      xmlBody += `<w:p><w:pPr><w:pStyle w:val="${pStyleAttr}"/><w:spacing w:after="${spacingAfter}"/></w:pPr>${pRuns}</w:p>`;
      lIdx++;
    }

    if (pIdx < pagesContent.length - 1) {
      xmlBody += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${xmlBody}
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
  </w:body>
</w:document>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="36"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
</w:styles>`;

  const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>
</w:settings>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`;

  const zipData = zipSync({
    '[Content_Types].xml': strToU8(contentTypesXml),
    '_rels/.rels': strToU8(rootRelsXml),
    'word/document.xml': strToU8(documentXml),
    'word/styles.xml': strToU8(stylesXml),
    'word/settings.xml': strToU8(settingsXml),
    'word/_rels/document.xml.rels': strToU8(wordRelsXml),
  });

  onProgress(100);
  return zipData;
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
    await page.render({ canvasContext: ctx as any, viewport }).promise;
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

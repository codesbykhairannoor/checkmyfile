import * as pdfjsLib from 'pdfjs-dist';
import * as fflate from 'fflate';

// Set worker src if not already configured
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface TextSpan {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  fontName: string;
}

interface FormattedLine {
  y: number;
  fontSize: number;
  spans: TextSpan[];
}

/**
 * Intelligent Client-Side Spatial Reflow DOCX Generator
 * Reconstructs layout runs, lines, paragraphs, headings, and font styles into standard OpenXML.
 */
async function fallbackSpatialDocxConverter(
  pdfBytes: Uint8Array,
  onProgress: (progress: number) => void
): Promise<Uint8Array> {
  onProgress(40);
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes,
    useSystemFonts: true
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const allParagraphs: {
    text: string;
    isHeading?: boolean;
    isBold?: boolean;
    isItalic?: boolean;
    fontSizePt?: number;
    pageBreakBefore?: boolean;
  }[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const spans: TextSpan[] = [];
    for (const item of textContent.items as any[]) {
      if (!item.str || !item.str.trim()) continue;
      const t = item.transform;
      const fontSize = Math.abs(t[3]) || Math.abs(t[0]) || 11;
      const fontName = (item.fontName || '').toLowerCase();
      const isBold = fontName.includes('bold') || fontName.includes('black') || fontName.includes('heavy') || fontName.includes('700');
      const isItalic = fontName.includes('italic') || fontName.includes('oblique');

      spans.push({
        text: item.str,
        x: t[4],
        y: t[5], // Higher Y is higher on page in PDF
        w: item.width || 0,
        h: item.height || fontSize,
        fontSize,
        isBold,
        isItalic,
        fontName: item.fontName || ''
      });
    }

    if (spans.length === 0) {
      if (pageNum > 1) {
        allParagraphs.push({ text: '', pageBreakBefore: true });
      }
      continue;
    }

    // 1. Group spans into lines based on vertical tolerance
    spans.sort((a, b) => b.y - a.y);

    const lines: FormattedLine[] = [];
    for (const span of spans) {
      let matchedLine = lines.find(l => Math.abs(l.y - span.y) <= Math.max(3, span.fontSize * 0.35));
      if (!matchedLine) {
        matchedLine = { y: span.y, fontSize: span.fontSize, spans: [] };
        lines.push(matchedLine);
      }
      matchedLine.spans.push(span);
      matchedLine.fontSize = Math.max(matchedLine.fontSize, span.fontSize);
    }

    lines.sort((a, b) => b.y - a.y);
    for (const line of lines) {
      line.spans.sort((a, b) => a.x - b.x);
    }

    // 2. Assemble lines into logical paragraphs
    let currentParaText = '';
    let currentParaBold = false;
    let currentParaItalic = false;
    let currentParaFontSize = 11;
    let isFirstLineOnPage = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = i > 0 ? lines[i - 1] : null;

      const verticalGap = prevLine ? (prevLine.y - line.y) : 0;
      const isNewParagraph = !prevLine || verticalGap > (line.fontSize * 1.55);

      if (isNewParagraph && currentParaText.trim()) {
        const isHeading = currentParaFontSize >= 14;
        allParagraphs.push({
          text: currentParaText.trim(),
          isHeading,
          isBold: currentParaBold || isHeading,
          isItalic: currentParaItalic,
          fontSizePt: currentParaFontSize,
          pageBreakBefore: isFirstLineOnPage && pageNum > 1
        });
        isFirstLineOnPage = false;
        currentParaText = '';
      }

      let lineText = '';
      let lineBold = false;
      let lineItalic = false;
      let prevX = 0;
      let prevW = 0;

      for (const s of line.spans) {
        if (lineText.length > 0 && (s.x - (prevX + prevW)) > 2) {
          lineText += ' ';
        }
        lineText += s.text;
        prevX = s.x;
        prevW = s.w;
        if (s.isBold) lineBold = true;
        if (s.isItalic) lineItalic = true;
      }

      if (currentParaText.length > 0 && !currentParaText.endsWith(' ') && !lineText.startsWith(' ')) {
        currentParaText += ' ';
      }
      currentParaText += lineText;
      currentParaBold = lineBold;
      currentParaItalic = lineItalic;
      currentParaFontSize = line.fontSize;
    }

    if (currentParaText.trim()) {
      const isHeading = currentParaFontSize >= 14;
      allParagraphs.push({
        text: currentParaText.trim(),
        isHeading,
        isBold: currentParaBold || isHeading,
        isItalic: currentParaItalic,
        fontSizePt: currentParaFontSize,
        pageBreakBefore: isFirstLineOnPage && pageNum > 1
      });
    }

    onProgress(Math.min(85, Math.round(40 + (pageNum / numPages) * 45)));
  }

  // 3. Package OpenXML DOCX archive
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
      <w:sz w:val="22"/>
      <w:szCs w:val="22"/>
      <w:lang w:val="en-US"/>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="140" w:line="260" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`;

  let bodyXml = '';
  for (const p of allParagraphs) {
    if (p.pageBreakBefore) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
    const safeText = escapeXml(p.text);
    const szVal = p.fontSizePt ? Math.min(72, Math.max(16, Math.round(p.fontSizePt * 2))) : (p.isHeading ? 32 : 22);
    
    let rPr = `<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/>`;
    if (p.isBold || p.isHeading) rPr += `<w:b/><w:bCs/>`;
    if (p.isItalic) rPr += `<w:i/><w:iCs/>`;

    const spacingAfter = p.isHeading ? '240' : '140';
    const pPr = `<w:spacing w:after="${spacingAfter}" w:line="260" w:lineRule="auto"/>`;

    bodyXml += `
    <w:p>
      <w:pPr>${pPr}</w:pPr>
      <w:r>
        <w:rPr>${rPr}</w:rPr>
        <w:t xml:space="preserve">${safeText}</w:t>
      </w:r>
    </w:p>`;
  }

  bodyXml += `
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${bodyXml}
  </w:body>
</w:document>`;

  const filesToZip: Record<string, Uint8Array> = {
    '[Content_Types].xml': fflate.strToU8(contentTypesXml),
    '_rels/.rels': fflate.strToU8(rootRelsXml),
    'word/_rels/document.xml.rels': fflate.strToU8(docRelsXml),
    'word/styles.xml': fflate.strToU8(stylesXml),
    'word/document.xml': fflate.strToU8(documentXml)
  };

  onProgress(95);
  return fflate.zipSync(filesToZip);
}

/**
 * High-Reliability Dual-Layer PDF to Word Converter
 * Attempts C++ WASM conversion first; seamlessly falls back to spatial reflow extractor on any exception.
 */
export const convertPdfToWord = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  const arrayBuffer = await file.arrayBuffer();
  const pdfUint8Array = new Uint8Array(arrayBuffer);
  onProgress(25);

  // 1. Attempt C++ WASM High Precision Engine
  try {
    const { HighPrecisionPdfConverter } = await import('high-precision-pdf-to-docx');
    const converter = new HighPrecisionPdfConverter();
    await converter.initialize();
    onProgress(50);

    const docxBuffer = await converter.convertPdfToDocx(pdfUint8Array);
    if (docxBuffer && docxBuffer.byteLength > 500) {
      onProgress(100);
      return new Uint8Array(docxBuffer);
    }
  } catch (wasmErr) {
    console.warn('C++ WASM PDF-to-Word module bypassed or failed, using Spatial Reflow Engine:', wasmErr);
  }

  // 2. Resilient Pure-JS Spatial Reflow Fallback Engine
  const docxBytes = await fallbackSpatialDocxConverter(pdfUint8Array, onProgress);
  onProgress(100);
  return docxBytes;
};

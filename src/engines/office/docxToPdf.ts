import jsPDF from 'jspdf';
import { unzipSync } from 'fflate';

// ─────────────────────────────────────────────────────────────────────────────
// DOCX XML PARSER & NATIVE VECTOR RENDERING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const wAttr = (el: Element, name: string): string | null =>
  el.getAttributeNS(W, name) ?? el.getAttribute('w:' + name);

const child = (el: Element, name: string): Element | null => {
  for (const c of Array.from(el.children)) if (c.localName === name) return c;
  return null;
};

const children = (el: Element, name: string): Element[] =>
  Array.from(el.children).filter((c) => c.localName === name);

interface RunStyle {
  fontFamily?: string;
  fontSize?: number; // pt
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

interface ParaStyle extends RunStyle {
  textAlign?: string;
  marginTopPt?: number;
  marginBottomPt?: number;
  indentLeftPt?: number;
  headingLevel?: number;
  isList?: boolean;
}

interface StyleDef {
  run: RunStyle;
  para: Partial<ParaStyle>;
  basedOn?: string;
}

function parseRPr(rPr: Element): RunStyle {
  const s: RunStyle = {};
  const sz = child(rPr, 'sz');
  if (sz) {
    const v = wAttr(sz, 'val');
    if (v) s.fontSize = Math.round(parseInt(v) / 2 * 10) / 10;
  }
  const b = child(rPr, 'b');
  if (b && wAttr(b, 'val') !== '0') s.bold = true;
  const i = child(rPr, 'i');
  if (i && wAttr(i, 'val') !== '0') s.italic = true;
  const color = child(rPr, 'color');
  if (color) {
    const v = wAttr(color, 'val');
    if (v && v !== 'auto') s.color = '#' + v;
  }
  return s;
}

function parsePPrInto(pPr: Element, para: Partial<ParaStyle>): void {
  const jc = child(pPr, 'jc');
  if (jc) para.textAlign = wAttr(jc, 'val') || undefined;
  const ind = child(pPr, 'ind');
  if (ind) {
    const left = wAttr(ind, 'left');
    if (left) para.indentLeftPt = parseInt(left) / 20;
  }
  const spacing = child(pPr, 'spacing');
  if (spacing) {
    const before = wAttr(spacing, 'before');
    const after = wAttr(spacing, 'after');
    if (before) para.marginTopPt = parseInt(before) / 20;
    if (after) para.marginBottomPt = parseInt(after) / 20;
  }
  const numPr = child(pPr, 'numPr');
  if (numPr) para.isList = true;
  const rPr = child(pPr, 'rPr');
  if (rPr) Object.assign(para, parseRPr(rPr));
}

function parseDocxStyles(stylesXml: string): { styleMap: Record<string, StyleDef>; defaultRun: RunStyle } {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(stylesXml, 'text/xml');
  const styleMap: Record<string, StyleDef> = {};
  let defaultRun: RunStyle = { fontFamily: 'Helvetica', fontSize: 11 };

  const allEls = Array.from(doc.getElementsByTagName('*'));
  const docDefaults = allEls.find((e) => e.localName === 'docDefaults');
  if (docDefaults) {
    const rPrDefault = Array.from(docDefaults.getElementsByTagName('*')).find((e) => e.localName === 'rPr');
    if (rPrDefault) defaultRun = { ...defaultRun, ...parseRPr(rPrDefault) };
  }

  const styleEls = allEls.filter((e) => e.localName === 'style' && wAttr(e, 'type') === 'paragraph');
  for (const styleEl of styleEls) {
    const styleId = wAttr(styleEl, 'styleId');
    if (!styleId) continue;
    const styleName = (child(styleEl, 'name') ? wAttr(child(styleEl, 'name')!, 'val') : '') || '';
    const basedOnEl = child(styleEl, 'basedOn');
    const rPrEl = Array.from(styleEl.children).find((c) => c.localName === 'rPr');
    const pPrEl = Array.from(styleEl.children).find((c) => c.localName === 'pPr');
    const paraStyle: Partial<ParaStyle> = {};
    if (pPrEl) parsePPrInto(pPrEl, paraStyle);
    
    const nameL = styleName.toLowerCase();
    if (nameL.includes('heading 1') || styleId === 'Heading1') paraStyle.headingLevel = 1;
    else if (nameL.includes('heading 2') || styleId === 'Heading2') paraStyle.headingLevel = 2;
    else if (nameL.includes('heading 3') || styleId === 'Heading3') paraStyle.headingLevel = 3;

    styleMap[styleId] = { run: rPrEl ? parseRPr(rPrEl) : {}, para: paraStyle, basedOn: basedOnEl ? wAttr(basedOnEl, 'val') || undefined : undefined };
  }
  return { styleMap, defaultRun };
}

function resolveStyle(styleId: string, styleMap: Record<string, StyleDef>, defaultRun: RunStyle): { run: RunStyle; para: Partial<ParaStyle> } {
  const visited = new Set<string>();
  const chain: StyleDef[] = [];
  let current: string | undefined = styleId;
  while (current && !visited.has(current)) {
    visited.add(current);
    if (styleMap[current]) {
      chain.unshift(styleMap[current]);
      current = styleMap[current].basedOn;
    } else break;
  }
  const mergedRun: RunStyle = { ...defaultRun };
  const mergedPara: Partial<ParaStyle> = {};
  for (const def of chain) {
    Object.assign(mergedRun, def.run);
    Object.assign(mergedPara, def.para);
  }
  return { run: mergedRun, para: mergedPara };
}

// ─────────────────────────────────────────────────────────────────────────────
// NATIVE VECTOR RENDERER
// ─────────────────────────────────────────────────────────────────────────────

class NativePdfLayoutEngine {
  doc: jsPDF;
  cursorY: number = 20;
  cursorX: number = 20;
  margin = { top: 20, right: 20, bottom: 20, left: 20 };
  pageWidth: number;
  pageHeight: number;
  maxWidth: number;
  
  constructor() {
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.maxWidth = this.pageWidth - this.margin.left - this.margin.right;
  }
  
  checkPageBreak(heightNeeded: number) {
    if (this.cursorY + heightNeeded > this.pageHeight - this.margin.bottom) {
      this.doc.addPage();
      this.cursorY = this.margin.top;
      this.cursorX = this.margin.left;
    }
  }

  // Simplified conversion of pt to mm
  ptToMm(pt: number): number {
    return pt * 0.352778;
  }

  hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    if (clean.length === 6) {
      return [parseInt(clean.substring(0, 2), 16), parseInt(clean.substring(2, 4), 16), parseInt(clean.substring(4, 6), 16)];
    }
    return [0, 0, 0];
  }

  renderParagraph(pEl: Element, styleMap: Record<string, StyleDef>, defaultRun: RunStyle) {
    const pPrEl = child(pEl, 'pPr');
    let styleId = 'Normal';
    const pStyleEl = pPrEl ? child(pPrEl, 'pStyle') : null;
    if (pStyleEl) styleId = wAttr(pStyleEl, 'val') || 'Normal';

    const resolved = resolveStyle(styleId, styleMap, defaultRun);
    const paraBase = { ...resolved.run };
    const pPrRPr = pPrEl ? child(pPrEl, 'rPr') : null;
    if (pPrRPr) Object.assign(paraBase, parseRPr(pPrRPr));
    
    const paraStyle: Partial<ParaStyle> = { ...resolved.para };
    if (pPrEl) parsePPrInto(pPrEl, paraStyle);

    let fontSize = paraBase.fontSize || 11;
    let isBold = paraBase.bold || false;
    
    if (paraStyle.headingLevel === 1) { fontSize = 20; isBold = true; }
    else if (paraStyle.headingLevel === 2) { fontSize = 16; isBold = true; }
    else if (paraStyle.headingLevel === 3) { fontSize = 13; isBold = true; }

    const marginTop = this.ptToMm(paraStyle.marginTopPt || (paraStyle.headingLevel ? 14 : 0));
    const marginBottom = this.ptToMm(paraStyle.marginBottomPt || (paraStyle.headingLevel ? 4 : 6));
    const indentLeft = this.ptToMm(paraStyle.indentLeftPt || 0) + (paraStyle.isList ? 10 : 0);

    const lineHeight = this.ptToMm(fontSize * 1.4);
    const baseline = this.ptToMm(fontSize);

    this.cursorY += marginTop;
    this.checkPageBreak(lineHeight);

    this.cursorY += baseline;
    this.cursorX = this.margin.left + indentLeft;

    if (paraStyle.isList) {
      this.doc.setFont('Helvetica', 'normal');
      this.doc.setFontSize(fontSize);
      this.doc.text('•', this.cursorX - 5, this.cursorY);
    }

    const runs: { text: string, style: RunStyle }[] = [];
    for (const c of Array.from(pEl.children)) {
      if (c.localName === 'r') {
        const rPrEl = child(c, 'rPr');
        const rStyle = rPrEl ? { ...paraBase, ...parseRPr(rPrEl) } : paraBase;
        if (paraStyle.headingLevel) rStyle.fontSize = fontSize;
        if (paraStyle.headingLevel) rStyle.bold = isBold;
        
        const tEls = children(c, 't');
        const text = tEls.map(t => {
          const space = t.getAttribute('xml:space');
          return space === 'preserve' ? t.textContent || '' : (t.textContent || '').replace(/\s+/g, ' ');
        }).join('');
        if (text) runs.push({ text, style: rStyle });
      }
    }

    if (runs.length === 0) {
      this.cursorY += (lineHeight - baseline) + marginBottom;
      return;
    }

    let currentLineHeight = lineHeight;
    
    for (const run of runs) {
      const fs = run.style.fontSize || fontSize;
      this.doc.setFontSize(fs);
      this.doc.setFont('Helvetica', run.style.bold ? (run.style.italic ? 'bolditalic' : 'bold') : (run.style.italic ? 'italic' : 'normal'));
      if (run.style.color) {
        const rgb = this.hexToRgb(run.style.color);
        this.doc.setTextColor(rgb[0], rgb[1], rgb[2]);
      } else {
        this.doc.setTextColor(0, 0, 0);
      }

      const words = run.text.split(/(\s+)/); // Preserve spaces as words
      for (const word of words) {
        if (!word) continue;
        const wWidth = this.doc.getTextWidth(word);
        
        if (this.cursorX + wWidth > this.pageWidth - this.margin.right) {
          if (word.trim().length > 0) { // Wrap to next line
            this.cursorY += currentLineHeight;
            if (this.cursorY > this.pageHeight - this.margin.bottom) {
              this.doc.addPage();
              this.cursorY = this.margin.top + baseline;
            }
            this.cursorX = this.margin.left + indentLeft;
            this.doc.text(word, this.cursorX, this.cursorY);
            this.cursorX += wWidth;
          }
        } else {
          this.doc.text(word, this.cursorX, this.cursorY);
          this.cursorX += wWidth;
        }
      }
    }
    this.cursorY += (lineHeight - baseline) + marginBottom;
  }
  
  renderTable(tblEl: Element, styleMap: Record<string, StyleDef>, defaultRun: RunStyle) {
    // Simple table fallback: Render each cell as paragraph
    const rows = children(tblEl, 'tr');
    this.cursorY += 5;
    for (const tr of rows) {
      const cells = children(tr, 'tc');
      this.cursorX = this.margin.left;
      let maxCellHeight = 0;
      const startY = this.cursorY;
      
      for (const tc of cells) {
        let cellY = startY;
        for (const c of Array.from(tc.children)) {
          if (c.localName === 'p') {
            const oldY = this.cursorY;
            this.cursorY = cellY;
            this.renderParagraph(c, styleMap, defaultRun);
            cellY = this.cursorY;
            this.cursorY = oldY;
          }
        }
        if (cellY - startY > maxCellHeight) maxCellHeight = cellY - startY;
      }
      this.cursorY = startY + maxCellHeight + 5;
    }
  }

  parseDocx(docXml: string, stylesXml: string) {
    const { styleMap, defaultRun } = parseDocxStyles(stylesXml);
    const parser = new DOMParser();
    const docDom = parser.parseFromString(docXml, 'text/xml');
    const bodyEls = Array.from(docDom.getElementsByTagName('*')).filter((e) => e.localName === 'body');
    const body = bodyEls[0];
    if (!body) return;

    for (const node of Array.from(body.children)) {
      if (node.localName === 'p') {
        this.renderParagraph(node, styleMap, defaultRun);
      } else if (node.localName === 'tbl') {
        this.renderTable(node, styleMap, defaultRun);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Function
// ─────────────────────────────────────────────────────────────────────────────

export const convertDocxToPdf = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  const arrayBuffer = await file.arrayBuffer();
  onProgress(20);

  const unzipped = unzipSync(new Uint8Array(arrayBuffer));
  const decode = (bytes: Uint8Array) => new TextDecoder('utf-8').decode(bytes);

  const docXmlStr = unzipped['word/document.xml'] ? decode(unzipped['word/document.xml']) : '';
  const stylesXmlStr = unzipped['word/styles.xml'] ? decode(unzipped['word/styles.xml']) : '';

  if (!docXmlStr) throw new Error('Cannot read word/document.xml from the DOCX file.');
  onProgress(50);

  const engine = new NativePdfLayoutEngine();
  engine.parseDocx(docXmlStr, stylesXmlStr);
  
  onProgress(90);
  const outBuf = engine.doc.output('arraybuffer');
  onProgress(100);
  
  return new Uint8Array(outBuf);
};

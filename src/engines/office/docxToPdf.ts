import jsPDF from 'jspdf';
import { unzipSync } from 'fflate';

import html2canvas from 'html2canvas';

// ─────────────────────────────────────────────────────────────────────────────
// DOCX XML PARSER — reads word/document.xml + word/styles.xml with fflate
// Extracts exact: font-family, font-size (pt), bold, italic, underline, color,
// strikethrough, superscript/subscript, text-align, indentation, spacing, tables
// ─────────────────────────────────────────────────────────────────────────────

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

/** Get attribute value under the `w:` namespace */
const wAttr = (el: Element, name: string): string | null =>
  el.getAttributeNS(W, name) ?? el.getAttribute('w:' + name);

/** Find first direct child by localName */
const child = (el: Element, name: string): Element | null => {
  for (const c of Array.from(el.children))
    if (c.localName === name) return c;
  return null;
};

/** Find all direct children by localName */
const children = (el: Element, name: string): Element[] =>
  Array.from(el.children).filter((c) => c.localName === name);

interface RunStyle {
  fontFamily?: string;
  fontSize?: number; // pt
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  bgColor?: string;
  vertAlign?: 'super' | 'sub';
}

interface ParaStyle extends RunStyle {
  textAlign?: string;
  marginTopPt?: number;
  marginBottomPt?: number;
  lineHeightFactor?: number;
  indentLeftPt?: number;
  headingLevel?: number; // 1-6
}

interface StyleDef {
  run: RunStyle;
  para: Partial<ParaStyle>;
  basedOn?: string;
}

const HIGHLIGHT_MAP: Record<string, string> = {
  yellow: '#FFFF00', green: '#00FF00', cyan: '#00FFFF', magenta: '#FF00FF',
  blue: '#0070C0', red: '#FF0000', darkBlue: '#00008B', darkCyan: '#008B8B',
  darkGreen: '#006400', darkMagenta: '#8B008B', darkRed: '#8B0000',
  darkYellow: '#B8860B', darkGray: '#A9A9A9', lightGray: '#D3D3D3',
};

/** Parse <w:rPr> element → RunStyle */
function parseRPr(rPr: Element): RunStyle {
  const s: RunStyle = {};
  const rFonts = child(rPr, 'rFonts');
  if (rFonts) {
    const font = wAttr(rFonts, 'ascii') || wAttr(rFonts, 'hAnsi') || wAttr(rFonts, 'cs');
    if (font) s.fontFamily = font;
  }
  const sz = child(rPr, 'sz');
  if (sz) {
    const v = wAttr(sz, 'val');
    if (v) s.fontSize = Math.round(parseInt(v) / 2 * 10) / 10; // half-pt → pt
  }
  const b = child(rPr, 'b');
  if (b && wAttr(b, 'val') !== '0') s.bold = true;
  const i = child(rPr, 'i');
  if (i && wAttr(i, 'val') !== '0') s.italic = true;
  const u = child(rPr, 'u');
  if (u && wAttr(u, 'val') && wAttr(u, 'val') !== 'none') s.underline = true;
  const strike = child(rPr, 'strike');
  if (strike && wAttr(strike, 'val') !== '0') s.strikethrough = true;
  const color = child(rPr, 'color');
  if (color) {
    const v = wAttr(color, 'val');
    if (v && v !== 'auto') s.color = '#' + v;
  }
  const hl = child(rPr, 'highlight');
  if (hl) {
    const v = wAttr(hl, 'val');
    if (v && HIGHLIGHT_MAP[v]) s.bgColor = HIGHLIGHT_MAP[v];
  }
  const va = child(rPr, 'vertAlign');
  if (va) {
    const v = wAttr(va, 'val');
    if (v === 'superscript') s.vertAlign = 'super';
    if (v === 'subscript') s.vertAlign = 'sub';
  }
  return s;
}

/** Parse <w:pPr> element → fills para style fields */
function parsePPrInto(pPr: Element, para: Partial<ParaStyle>): void {
  const jc = child(pPr, 'jc');
  if (jc) {
    const v = wAttr(jc, 'val');
    if (v === 'center') para.textAlign = 'center';
    else if (v === 'right') para.textAlign = 'right';
    else if (v === 'both') para.textAlign = 'justify';
    else if (v === 'left') para.textAlign = 'left';
  }
  const ind = child(pPr, 'ind');
  if (ind) {
    const left = wAttr(ind, 'left');
    if (left) para.indentLeftPt = parseInt(left) / 20; // twips → pt
  }
  const spacing = child(pPr, 'spacing');
  if (spacing) {
    const before = wAttr(spacing, 'before');
    const after = wAttr(spacing, 'after');
    const line = wAttr(spacing, 'line');
    if (before) para.marginTopPt = parseInt(before) / 20;
    if (after) para.marginBottomPt = parseInt(after) / 20;
    if (line) para.lineHeightFactor = parseInt(line) / 240; // 240 = single spacing
  }
  const rPr = child(pPr, 'rPr');
  if (rPr) Object.assign(para, parseRPr(rPr));
}

/** Parse word/styles.xml → style definitions map */
function parseDocxStyles(stylesXml: string): { styleMap: Record<string, StyleDef>; defaultRun: RunStyle } {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(stylesXml, 'text/xml');
  const styleMap: Record<string, StyleDef> = {};
  let defaultRun: RunStyle = { fontFamily: 'Calibri', fontSize: 11 };

  // Document defaults
  const allEls = Array.from(doc.getElementsByTagName('*'));
  const docDefaults = allEls.find((e) => e.localName === 'docDefaults');
  if (docDefaults) {
    const rPrDefault = Array.from(docDefaults.getElementsByTagName('*')).find((e) => e.localName === 'rPr');
    if (rPrDefault) defaultRun = { ...defaultRun, ...parseRPr(rPrDefault) };
  }

  // Named paragraph styles
  const styleEls = allEls.filter((e) => e.localName === 'style' && wAttr(e, 'type') === 'paragraph');
  for (const styleEl of styleEls) {
    const styleId = wAttr(styleEl, 'styleId');
    if (!styleId) continue;
    const styleName = (child(styleEl, 'name') ? wAttr(child(styleEl, 'name')!, 'val') : '') || '';

    const basedOnEl = child(styleEl, 'basedOn');
    const basedOn = basedOnEl ? wAttr(basedOnEl, 'val') || undefined : undefined;

    const rPrEl = Array.from(styleEl.children).find((c) => c.localName === 'rPr');
    const runStyle = rPrEl ? parseRPr(rPrEl) : {};

    const pPrEl = Array.from(styleEl.children).find((c) => c.localName === 'pPr');
    const paraStyle: Partial<ParaStyle> = {};
    if (pPrEl) parsePPrInto(pPrEl, paraStyle);

    // Detect heading styles
    const nameL = styleName.toLowerCase();
    if (nameL === 'heading 1' || styleId === 'Heading1') paraStyle.headingLevel = 1;
    else if (nameL === 'heading 2' || styleId === 'Heading2') paraStyle.headingLevel = 2;
    else if (nameL === 'heading 3' || styleId === 'Heading3') paraStyle.headingLevel = 3;
    else if (nameL === 'heading 4' || styleId === 'Heading4') paraStyle.headingLevel = 4;
    else if (nameL === 'heading 5' || styleId === 'Heading5') paraStyle.headingLevel = 5;
    else if (nameL === 'heading 6' || styleId === 'Heading6') paraStyle.headingLevel = 6;
    else if (/^heading\s*(\d)/i.test(nameLSafe(styleId))) {
      const m = styleId.match(/\d/);
      if (m) paraStyle.headingLevel = parseInt(m[0]);
    }

    styleMap[styleId] = { run: runStyle, para: paraStyle, basedOn };
  }

  return { styleMap, defaultRun };
}

function nameLSafe(s: string): string { return s?.toLowerCase() ?? ''; }

/** Resolve style including basedOn chain, returning merged RunStyle */
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

/** Build CSS string from RunStyle */
function runStyleToCss(s: RunStyle): string {
  const parts: string[] = [];
  if (s.fontFamily) parts.push(`font-family: "${s.fontFamily}", Calibri, Arial, sans-serif`);
  if (s.fontSize) parts.push(`font-size: ${s.fontSize}pt`);
  if (s.bold) parts.push('font-weight: bold');
  if (s.italic) parts.push('font-style: italic');
  const decs: string[] = [];
  if (s.underline) decs.push('underline');
  if (s.strikethrough) decs.push('line-through');
  if (decs.length) parts.push(`text-decoration: ${decs.join(' ')}`);
  if (s.color) parts.push(`color: ${s.color}`);
  if (s.bgColor) parts.push(`background-color: ${s.bgColor}`);
  if (s.vertAlign === 'super') parts.push('vertical-align: super; font-size: 0.7em');
  if (s.vertAlign === 'sub') parts.push('vertical-align: sub; font-size: 0.7em');
  return parts.join('; ');
}

/** Render a single <w:r> run to HTML */
function renderRun(rEl: Element, paraRunBase: RunStyle): string {
  const rPrEl = child(rEl, 'rPr');
  const runStyle = rPrEl ? { ...paraRunBase, ...parseRPr(rPrEl) } : paraRunBase;

  // Check for break/special runs
  const brEl = child(rEl, 'br');
  if (brEl) {
    const brType = wAttr(brEl, 'type');
    if (brType === 'page') return '<div style="page-break-after: always"></div>';
    return '<br>';
  }

  const tEls = children(rEl, 't');
  if (!tEls.length) return '';

  let text = tEls.map((t) => {
    const space = t.getAttribute('xml:space');
    const raw = t.textContent || '';
    return space === 'preserve' ? raw : raw.trim();
  }).join('');

  if (!text) return '';

  // Escape HTML entities
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const css = runStyleToCss(runStyle);
  return css ? `<span style="${css}">${text}</span>` : text;
}

/** Render a single <w:p> paragraph to HTML */
function renderParagraph(pEl: Element, styleMap: Record<string, StyleDef>, defaultRun: RunStyle): string {
  const pPrEl = child(pEl, 'pPr');

  // Get named style
  let styleId = 'Normal';
  let headingLevel = 0;
  const pStyleEl = pPrEl ? child(pPrEl, 'pStyle') : null;
  if (pStyleEl) styleId = wAttr(pStyleEl, 'val') || 'Normal';

  const resolved = resolveStyle(styleId, styleMap, defaultRun);
  const paraBase = { ...resolved.run };

  // Override with inline pPr rPr
  const pPrRPr = pPrEl ? child(pPrEl, 'rPr') : null;
  if (pPrRPr) Object.assign(paraBase, parseRPr(pPrRPr));

  // Paragraph-level formatting
  const paraStyle: Partial<ParaStyle> = { ...resolved.para };
  if (pPrEl) parsePPrInto(pPrEl, paraStyle);

  headingLevel = paraStyle.headingLevel || 0;

  // Check if list paragraph
  const numPr = pPrEl ? child(pPrEl, 'numPr') : null;
  const isList = !!numPr;

  // Build CSS for paragraph
  const paraCSS: string[] = [];
  if (paraStyle.textAlign) paraCSS.push(`text-align: ${paraStyle.textAlign}`);
  if (paraStyle.marginTopPt != null) paraCSS.push(`margin-top: ${paraStyle.marginTopPt}pt`);
  if (paraStyle.marginBottomPt != null) paraCSS.push(`margin-bottom: ${paraStyle.marginBottomPt}pt`);
  else paraCSS.push('margin-bottom: 6pt');
  if (paraStyle.lineHeightFactor != null && paraStyle.lineHeightFactor > 0)
    paraCSS.push(`line-height: ${Math.max(1, paraStyle.lineHeightFactor)}`);
  if (paraStyle.indentLeftPt) paraCSS.push(`padding-left: ${paraStyle.indentLeftPt}pt`);
  else if (isList) paraCSS.push('padding-left: 20pt');

  // Render runs
  const allRunContainers: Element[] = [];
  for (const c of Array.from(pEl.children)) {
    if (c.localName === 'r' || c.localName === 'hyperlink' || c.localName === 'ins') {
      allRunContainers.push(c);
    }
  }

  let innerHtml = '';
  for (const container of allRunContainers) {
    if (container.localName === 'r') {
      innerHtml += renderRun(container, paraBase);
    } else if (container.localName === 'hyperlink') {
      // Runs inside hyperlink
      for (const r of children(container, 'r')) {
        const runHtml = renderRun(r, { ...paraBase, color: '#2563EB', underline: true });
        innerHtml += runHtml;
      }
    } else if (container.localName === 'ins') {
      for (const r of children(container, 'r')) {
        innerHtml += renderRun(r, paraBase);
      }
    }
  }

  if (!innerHtml.trim() && allRunContainers.length === 0) {
    // Empty paragraph → spacer
    return `<p style="margin-bottom: 4pt; ${paraCSS.join('; ')}">&nbsp;</p>`;
  }

  // Determine HTML tag
  let tag = 'p';
  if (headingLevel >= 1 && headingLevel <= 6) tag = `h${headingLevel}`;

  // Heading default styles
  const headingDefaults: Record<number, string> = {
    1: 'font-size: 20pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;',
    2: 'font-size: 16pt; font-weight: bold; margin-top: 12pt; margin-bottom: 5pt;',
    3: 'font-size: 13pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt;',
    4: 'font-size: 12pt; font-weight: bold; margin-top: 8pt; margin-bottom: 3pt;',
    5: 'font-size: 11pt; font-weight: bold; margin-top: 6pt; margin-bottom: 2pt;',
    6: 'font-size: 11pt; font-weight: bold; font-style: italic; margin-top: 4pt;',
  };

  if (isList) {
    return `<div style="display:flex;align-items:flex-start;${paraCSS.join('; ')};margin-bottom:3pt">
      <span style="margin-right:8pt;flex-shrink:0">•</span>
      <span style="flex:1">${innerHtml}</span>
    </div>`;
  }

  const baseStyle = headingLevel ? headingDefaults[headingLevel] + ' ' : '';
  const fullStyle = baseStyle + paraCSS.join('; ');

  return `<${tag} style="${fullStyle}">${innerHtml}</${tag}>`;
}

/** Render a <w:tbl> table to HTML */
function renderTable(tblEl: Element, styleMap: Record<string, StyleDef>, defaultRun: RunStyle): string {
  const rows = children(tblEl, 'tr');
  let html = `<table style="width:100%;border-collapse:collapse;margin:8pt 0;page-break-inside:auto">`;

  rows.forEach((trEl, rIdx) => {
    html += '<tr style="page-break-inside:avoid">';
    const cells = children(trEl, 'tc');
    cells.forEach((tcEl) => {
      // Cell properties
      const tcPr = child(tcEl, 'tcPr');
      const shd = tcPr ? child(tcPr, 'shd') : null;
      const bgColor = shd ? wAttr(shd, 'fill') : null;
      const colSpan = tcPr ? child(tcPr, 'gridSpan') : null;
      const spanVal = colSpan ? wAttr(colSpan, 'val') : null;

      const isHeader = rIdx === 0;
      const tag = isHeader ? 'th' : 'td';
      const cellCss = [
        'border: 0.75pt solid #CBD5E1',
        'padding: 5pt 7pt',
        'vertical-align: top',
        'text-align: left',
        'font-size: 10pt',
        isHeader ? 'background-color: #F1F5F9; font-weight: bold;' : '',
        bgColor && bgColor !== 'auto' && bgColor !== 'FFFFFF' ? `background-color: #${bgColor}` : '',
      ].filter(Boolean).join('; ');

      const spanAttr = spanVal ? ` colspan="${spanVal}"` : '';

      // Render cell content
      let cellHtml = '';
      for (const c of Array.from(tcEl.children)) {
        if (c.localName === 'p') cellHtml += renderParagraph(c, styleMap, defaultRun);
        else if (c.localName === 'tbl') cellHtml += renderTable(c, styleMap, defaultRun);
      }

      html += `<${tag}${spanAttr} style="${cellCss}">${cellHtml}</${tag}>`;
    });
    html += '</tr>';
  });

  html += '</table>';
  return html;
}

/** Main parser: word/document.xml → full HTML string */
function parseDocxToHtml(docXml: string, stylesXml: string): string {
  const { styleMap, defaultRun } = parseDocxStyles(stylesXml);

  const parser = new DOMParser();
  const docDom = parser.parseFromString(docXml, 'text/xml');

  // Find body element
  const bodyEls = Array.from(docDom.getElementsByTagName('*')).filter((e) => e.localName === 'body');
  const body = bodyEls[0];
  if (!body) return '<p>Could not parse document body.</p>';

  let html = '';
  for (const node of Array.from(body.children)) {
    const ln = node.localName;
    if (ln === 'p') {
      html += renderParagraph(node, styleMap, defaultRun);
    } else if (ln === 'tbl') {
      html += renderTable(node, styleMap, defaultRun);
    } else if (ln === 'sectPr') {
      // Section properties — skip
    }
  }
  return html;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: convertDocxToPdf using native DOCX XML parsing → html2canvas → jsPDF
// ─────────────────────────────────────────────────────────────────────────────

export const convertDocxToPdf = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  const arrayBuffer = await file.arrayBuffer();
  onProgress(20);

  // Step 1: Unzip DOCX (it's a ZIP file)
  const unzipped = unzipSync(new Uint8Array(arrayBuffer));
  const decode = (bytes: Uint8Array) => new TextDecoder('utf-8').decode(bytes);

  const docXmlStr = unzipped['word/document.xml'] ? decode(unzipped['word/document.xml']) : '';
  const stylesXmlStr = unzipped['word/styles.xml'] ? decode(unzipped['word/styles.xml']) : '';

  if (!docXmlStr) throw new Error('Cannot read word/document.xml from the DOCX file.');
  onProgress(35);

  // Step 2: Parse DOCX XML → styled HTML (preserving exact fonts, sizes, bold, italic)
  const bodyHtml = parseDocxToHtml(docXmlStr, stylesXmlStr);
  onProgress(50);

  // Step 3: Check for embedded fonts inside the DOCX ZIP file and register them dynamically
  const fontOverrides: Record<string, string> = {};

  try {
    const fontTableXmlStr = unzipped['word/fontTable.xml'] ? decode(unzipped['word/fontTable.xml']) : '';
    const fontTableRelsStr = unzipped['word/_rels/fontTable.xml.rels'] ? decode(unzipped['word/_rels/fontTable.xml.rels']) : '';

    if (fontTableXmlStr) {
      const parser = new DOMParser();
      const fontTableDoc = parser.parseFromString(fontTableXmlStr, 'text/xml');
      const relsDoc = fontTableRelsStr ? parser.parseFromString(fontTableRelsStr, 'text/xml') : null;

      // Map relationship ID to zip target path
      const relsMap: Record<string, string> = {};
      if (relsDoc) {
        const relElements = Array.from(relsDoc.getElementsByTagName('*')).filter((e) => e.localName === 'Relationship');
        for (const rel of relElements) {
          const id = rel.getAttribute('Id');
          const target = rel.getAttribute('Target');
          if (id && target) {
            // Rel Target paths are relative to word/ (e.g. Target="fonts/font1.odttf" -> word/fonts/font1.odttf)
            let zipPath = target;
            if (zipPath.startsWith('/')) zipPath = zipPath.slice(1);
            if (!zipPath.startsWith('word/')) zipPath = 'word/' + zipPath;
            relsMap[id] = zipPath;
          }
        }
      }

      // Find all font tags
      const fontElements = Array.from(fontTableDoc.getElementsByTagName('*')).filter((e) => e.localName === 'font');
      for (const fontEl of fontElements) {
        const fontName = wAttr(fontEl, 'name');
        if (!fontName) continue;

        // Check for style tag embed nodes
        const embedStyles = ['embedRegular', 'embedBold', 'embedItalic', 'embedBoldItalic'];
        for (const styleTag of embedStyles) {
          const embedEl = child(fontEl, styleTag);
          if (!embedEl) continue;

          const rId = wAttr(embedEl, 'id');
          const fontKey = wAttr(embedEl, 'fontKey');
          if (!rId || !fontKey) continue;

          const zipPath = relsMap[rId];
          const fontFileBytes = zipPath ? unzipped[zipPath] : null;
          if (!fontFileBytes) continue;

          // Deobfuscate ODTTF font using its GUID fontKey
          const cleanGuid = fontKey.replace(/[{}-]/g, '');
          const key = new Uint8Array(16);
          for (let i = 0; i < 16; i++) {
            key[15 - i] = parseInt(cleanGuid.substring(i * 2, i * 2 + 2), 16);
          }

          const fontData = new Uint8Array(fontFileBytes.length);
          fontData.set(fontFileBytes);
          for (let i = 0; i < Math.min(32, fontData.length); i++) {
            fontData[i] ^= key[i % 16];
          }

          // Register FontFace in document
          let fontStyle = 'normal';
          let fontWeight = 'normal';
          if (styleTag === 'embedBold') fontWeight = 'bold';
          if (styleTag === 'embedItalic') fontStyle = 'italic';
          if (styleTag === 'embedBoldItalic') { fontWeight = 'bold'; fontStyle = 'italic'; }

          const fontFaceName = `docx-embed-${fontName.replace(/\s+/g, '-')}`;
          const fontFace = new FontFace(fontFaceName, fontData.buffer, {
            style: fontStyle,
            weight: fontWeight,
          });

          try {
            const loaded = await fontFace.load();
            document.fonts.add(loaded);
            fontOverrides[fontName.toLowerCase()] = fontFaceName;
          } catch (err) {
            console.warn(`Failed to dynamically load embedded font ${fontName}:`, err);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error reading or loading embedded fonts:', err);
  }

  // Load fallback standard web fonts
  const FONT_LINK_ID = 'helpmyfile-docx-fonts';
  if (!document.getElementById(FONT_LINK_ID)) {
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,700;1,400;1,700&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap';
    document.head.appendChild(link);
  }

  // Wait for all web fonts and newly added system/embedded fonts to resolve
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Step 4: Map Word fonts to include both native system font stacks and their metric-compatible Google web font fallbacks
  const normalizeFontFamily = (html: string): string => {
    let output = html;
    // Inject custom loaded embedded font mappings if present
    for (const [rawFont, overrideFont] of Object.entries(fontOverrides)) {
      const regex = new RegExp(`font-family:\\s*"?${rawFont}"?`, 'gi');
      const fallback = rawFont === 'calibri' ? '"Carlito", sans-serif' :
                       rawFont === 'times new roman' ? '"Tinos", serif' :
                       rawFont === 'arial' ? '"Arimo", sans-serif' : 'sans-serif';
      output = output.replace(regex, `font-family: "${overrideFont}", "${rawFont}", ${fallback}`);
    }

    return output
      .replace(/font-family:\s*"?Calibri"?/gi, 'font-family: "Calibri", "Carlito", sans-serif')
      .replace(/font-family:\s*"?Calibri Light"?/gi, 'font-family: "Calibri Light", "Carlito", sans-serif')
      .replace(/font-family:\s*"?Times New Roman"?/gi, 'font-family: "Times New Roman", "Tinos", serif')
      .replace(/font-family:\s*"?Cambria"?/gi, 'font-family: "Cambria", "Tinos", serif')
      .replace(/font-family:\s*"?Georgia"?/gi, 'font-family: "Georgia", "Tinos", serif')
      .replace(/font-family:\s*"?Arial"?/gi, 'font-family: "Arial", "Arimo", sans-serif')
      .replace(/font-family:\s*"?Helvetica"?/gi, 'font-family: "Helvetica", "Arimo", sans-serif')
      .replace(/font-family:\s*"?Tahoma"?/gi, 'font-family: "Tahoma", "Arimo", sans-serif');
  };
  const normalizedHtml = normalizeFontFamily(bodyHtml);

  // Step 5: Inject into styled A4 container, prioritizing native Calibri
  const container = document.createElement('div');
  container.style.cssText = [
    'position: absolute',
    'left: -99999px',
    'top: 0',
    'width: 794px',
    'background: #ffffff',
    'color: #000000',
    'padding: 76px 96px', // Word: 1 inch sides, ~0.79 inch top/bottom
    'box-sizing: border-box',
    'font-family: "Calibri", "Carlito", "Segoe UI", sans-serif',
    'font-size: 11pt',
    'line-height: 1.45',
  ].join('; ');

  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,700;1,400;1,700&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');
      * { box-sizing: border-box; }
      body, div { margin: 0; padding: 0; }
      p { margin: 0 0 6pt; line-height: 1.45; }
      h1 { font-size: 20pt; font-weight: bold; margin: 14pt 0 5pt; line-height: 1.3; }
      h2 { font-size: 16pt; font-weight: bold; margin: 12pt 0 4pt; line-height: 1.3; }
      h3 { font-size: 13pt; font-weight: bold; margin: 10pt 0 3pt; }
      h4 { font-size: 12pt; font-weight: bold; margin: 8pt 0 2pt; }
      h5 { font-size: 11pt; font-weight: bold; margin: 6pt 0 2pt; }
      h6 { font-size: 11pt; font-weight: bold; font-style: italic; margin: 4pt 0 2pt; }
      table { border-collapse: collapse; width: 100%; margin: 8pt 0; page-break-inside: auto; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
      th { background: #F1F5F9; font-weight: bold; }
      th, td { border: 0.75pt solid #CBD5E1; padding: 5pt 7pt; vertical-align: top; text-align: left; font-size: 10pt; }
      sup { font-size: 0.7em; vertical-align: super; }
      sub { font-size: 0.7em; vertical-align: sub; }
      a { color: #2563EB; text-decoration: underline; }
      ul, ol { margin: 0 0 6pt 20pt; }
      li { margin-bottom: 3pt; }
    </style>
    ${normalizedHtml}
  `;
  document.body.appendChild(container);

  try {
    onProgress(58);

    // Step 6: Render full HTML to one tall canvas (Retina 4x for Ultra HD)
    const SCALE = 4;
    const canvas = await html2canvas(container, {
      scale: SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    });
    onProgress(72);

    // Step 7: Smart multi-page slicing with DOM coordinate snap mapping
    const A4_W_MM = 210;
    const A4_H_MM = 297;
    const MARGIN_MM = 15;
    const PRINT_H_MM = A4_H_MM - MARGIN_MM * 2;
    const MM_PER_PX = A4_W_MM / canvas.width;
    const MAX_SLICE_PX = Math.floor(PRINT_H_MM / MM_PER_PX);

    // Map DOM elements to coordinates on the 2x scaled canvas to avoid slicing them in half
    // We select atomic/leaf block elements (table rows, paragraphs, headings, etc.) to prevent slicing across them,
    // avoiding large container elements like <table> or <div> whose .top might be way above the current page offset.
    const elements = Array.from(
      container.querySelectorAll('tr, p, li, blockquote, img, h1, h2, h3, h4, h5, h6, pre, figure')
    ).filter((el: any) => el.offsetHeight > 0) as HTMLElement[];

    const containerRect = container.getBoundingClientRect();
    const blocks = elements.map(el => {
      const rect = el.getBoundingClientRect();
      return {
        top: Math.round((rect.top - containerRect.top) * SCALE),
        bottom: Math.round((rect.bottom - containerRect.top) * SCALE)
      };
    }).filter(b => b.bottom > b.top);

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const ctx = canvas.getContext('2d')!;

    let yOffset = 0;
    let pageIdx = 0;

    while (yOffset < canvas.height) {
      const remaining = canvas.height - yOffset;
      let sliceH = Math.min(MAX_SLICE_PX, remaining);

      if (remaining > MAX_SLICE_PX) {
        const targetCut = yOffset + MAX_SLICE_PX;
        let bestCut = targetCut;

        // 1. Try snapping to the top of the highest straddled DOM element (e.g. table rows or paragraphs)
        let straddledBlock = null;
        let highestTop = targetCut;
        const minSlicePx = yOffset + Math.floor(MAX_SLICE_PX * 0.12); // ensure at least 12% page progress before snapping
        for (const b of blocks) {
          if (b.top < targetCut && b.bottom > targetCut) {
            if (b.top > minSlicePx && b.top < highestTop) {
              highestTop = b.top;
              straddledBlock = b;
            }
          }
        }

        if (straddledBlock) {
          bestCut = highestTop;
        }

        // 2. Fallback: Scan pixels for a white spacing row if snap was not possible
        if (bestCut === targetCut) {
          const scanLimit = yOffset + Math.floor(MAX_SLICE_PX * 0.85);
          for (let scanY = targetCut; scanY > scanLimit; scanY -= 1) {
            const row = ctx.getImageData(0, Math.floor(scanY), canvas.width, 1).data;
            let darkPixelCount = 0;
            for (let x = 0; x < canvas.width; x += 8) { // sample pixels
              const r = row[x * 4];
              const g = row[x * 4 + 1];
              const b = row[x * 4 + 2];
              if (r < 180 && g < 180 && b < 180) { // foreground pixel
                darkPixelCount++;
              }
            }
            if (darkPixelCount <= 4) { // safe white space
              bestCut = scanY;
              break;
            }
          }
        }
        sliceH = bestCut - yOffset;
      }

      // Safety check: ensure sliceH is positive and non-zero
      if (sliceH <= 0 || isNaN(sliceH)) {
        sliceH = Math.min(MAX_SLICE_PX, canvas.height - yOffset);
      }
      if (sliceH <= 0) break;

      // Copy slice to temp canvas
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH;
      const sCtx = sliceCanvas.getContext('2d')!;
      sCtx.fillStyle = '#ffffff';
      sCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      sCtx.drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

      if (sliceCanvas.width > 0 && sliceCanvas.height > 0) {
        if (pageIdx > 0) doc.addPage();
        const sliceHeightMm = sliceH * MM_PER_PX;
        doc.addImage(
          sliceCanvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          MARGIN_MM,
          MARGIN_MM,
          A4_W_MM - MARGIN_MM * 2,
          sliceHeightMm,
          undefined,
          'FAST'
        );
        pageIdx++;
      }
      yOffset += sliceH;
      onProgress(72 + Math.round((yOffset / canvas.height) * 24));
    }

    onProgress(98);
    const outBuf = doc.output('arraybuffer');
    onProgress(100);
    return new Uint8Array(outBuf);
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
};


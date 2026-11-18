import { createWorker } from 'tesseract.js';
import workerPath from 'tesseract.js/dist/worker.min.js?url';
import corePath from 'tesseract.js-core/tesseract-core.wasm.js?url';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Map our ISO language codes to Tesseract traineddata language codes
const LANG_TO_TESS: Record<string, string> = {
  en: 'eng',
  id: 'ind',
  es: 'spa',
  fr: 'fra',
  de: 'deu',
  ja: 'jpn',
  pt: 'por',
  ru: 'rus',
  zh: 'chi_sim',
  ar: 'ara',
  hi: 'hin',
  it: 'ita',
  ko: 'kor',
  nl: 'nld',
  tr: 'tur',
  pl: 'pol',
  vi: 'vie',
  th: 'tha',
};

export interface OcrResult {
  text: string;
  confidence: number;
  tableRows: string[][];
  excelBytes?: Uint8Array;
}

/**
 * Groups OCR words into structured table columns and rows based on spatial coordinates.
 */
export function detectTableFromOcrWords(
  words: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>
): string[][] {
  if (!words || words.length === 0) return [];

  // Sort words vertically by top coordinate (y0)
  const sortedWords = [...words].sort((a, b) => a.bbox.y0 - b.bbox.y0);

  const rows: Array<Array<{ text: string; x0: number; x1: number }>> = [];
  let currentRow: Array<{ text: string; x0: number; x1: number }> = [];
  let currentY = -1;
  const Y_TOLERANCE = 14; // pixels

  for (const w of sortedWords) {
    if (currentY === -1 || Math.abs(w.bbox.y0 - currentY) <= Y_TOLERANCE) {
      currentRow.push({ text: w.text, x0: w.bbox.x0, x1: w.bbox.x1 });
      if (currentY === -1) currentY = w.bbox.y0;
    } else {
      currentRow.sort((a, b) => a.x0 - b.x0);
      rows.push(currentRow);
      currentRow = [{ text: w.text, x0: w.bbox.x0, x1: w.bbox.x1 }];
      currentY = w.bbox.y0;
    }
  }
  if (currentRow.length > 0) {
    currentRow.sort((a, b) => a.x0 - b.x0);
    rows.push(currentRow);
  }

  // Segment rows into discrete columns based on horizontal gaps (>26px)
  const tableData: string[][] = [];
  for (const r of rows) {
    const rowCells: string[] = [];
    let currentCell = '';
    let lastX1 = -1;

    for (const item of r) {
      if (lastX1 === -1 || (item.x0 - lastX1) > 26) {
        if (currentCell.trim()) rowCells.push(currentCell.trim());
        currentCell = item.text;
      } else {
        currentCell += ' ' + item.text;
      }
      lastX1 = item.x1;
    }
    if (currentCell.trim()) rowCells.push(currentCell.trim());
    if (rowCells.length > 0) tableData.push(rowCells);
  }

  return tableData;
}

/**
 * Exports structured 2D table data into a clean, auto-sized Excel .xlsx binary buffer.
 */
export function exportTableToExcelBytes(rows: string[][]): Uint8Array {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [['(No Table Data Detected)']]);

  // Set column widths based on maximum string lengths
  const colWidths = rows.reduce<number[]>((acc, row) => {
    row.forEach((cell, colIdx) => {
      const len = String(cell || '').length;
      acc[colIdx] = Math.max(acc[colIdx] || 12, Math.min(60, len + 4));
    });
    return acc;
  }, []);
  ws['!cols'] = colWidths.map((w) => ({ wch: w }));

  XLSX.utils.book_append_sheet(wb, ws, 'OCR Extracted Table');
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(buffer);
}

export const runOcrOnDocument = async (
  file: File,
  uiLang: string,
  onProgress: (progress: number, status: string) => void,
  extractFormat: 'txt' | 'xlsx' | 'docx' = 'txt'
): Promise<OcrResult> => {
  const tessLang = LANG_TO_TESS[uiLang] || 'eng';
  onProgress(5, `Initializing Tesseract Web Worker (${tessLang.toUpperCase()})...`);

  const worker = await createWorker(tessLang, 1, {
    workerPath,
    corePath,
    langPath: '/tessdata',
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        const p = Math.round(m.progress * 80) + 15;
        onProgress(p, `Recognizing Text: ${Math.round(m.progress * 100)}%`);
      } else {
        onProgress(10, `Status: ${m.status}`);
      }
    },
  });

  try {
    let imageSource: string | ImageData = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      onProgress(12, 'Rasterizing first PDF page to high-res canvas...');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdfDoc.getPage(1);
      const scale = 2.5; // High contrast resolution for OCR
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context failed');

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      await page.render({ canvasContext: ctx, viewport, canvas: canvas as any }).promise;
      imageSource = canvas.toDataURL('image/png');
    } else {
      // It's an image PNG/JPG
      imageSource = URL.createObjectURL(file);
    }

    onProgress(15, 'Starting neural network OCR recognition...');
    const { data } = await worker.recognize(imageSource);
    onProgress(90, 'Analyzing layout structure and tabular coordinates...');

    if (typeof imageSource === 'string' && imageSource.startsWith('blob:')) {
      URL.revokeObjectURL(imageSource);
    }

    // Extract table rows from word coordinate bounding boxes
    const tableRows = detectTableFromOcrWords(data.words as any || []);
    let excelBytes: Uint8Array | undefined;
    if (extractFormat === 'xlsx' || tableRows.length > 0) {
      excelBytes = exportTableToExcelBytes(tableRows);
    }

    await worker.terminate();
    onProgress(100, 'Complete!');

    return {
      text: data.text || 'No text detected.',
      confidence: data.confidence || 0,
      tableRows,
      excelBytes,
    };
  } catch (error) {
    await worker.terminate();
    throw error;
  }
};

import jsPDF from 'jspdf';

import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

export const convertCsvToPdf = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(20);
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error('No worksheets found');
  onProgress(40);
  return renderChunkedSpreadsheetRowsToPdf(XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][], file.name, onProgress);
};

export const convertCsvToExcel = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(20);
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  onProgress(50);
  // Optional: rename the default sheet if needed, but keeping it as parsed is usually better for pure conversion
  onProgress(85);
  return new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }));
};

export const convertExcelToCsv = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(25);
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error('No worksheets found');
  onProgress(80);
  return new TextEncoder().encode(XLSX.utils.sheet_to_csv(ws));
};

export const convertExcelToPdf = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(20);
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error('No worksheets found');
  onProgress(40);
  return renderChunkedSpreadsheetRowsToPdf(XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][], file.name, onProgress);
};

const renderChunkedSpreadsheetRowsToPdf = async (
  rows: any[][],
  filename: string,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  if (!rows || rows.length === 0) throw new Error('Spreadsheet file is empty or has no readable rows.');
  const headers: string[] = rows[0].map((cell) => String(cell ?? ''));
  const dataRows = rows.slice(1);
  const rowsToProcess = dataRows.length > 0 ? dataRows : [headers];
  const activeHeaders = dataRows.length > 0 ? headers : [];
  const chunkSize = 25;
  const chunks: any[][][] = [];
  for (let i = 0; i < rowsToProcess.length; i += chunkSize) chunks.push(rowsToProcess.slice(i, i + chunkSize));
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;left:-99999px;top:0;width:1123px;background:#fff;color:#1F2937;padding:35px;box-sizing:border-box;font-family:Calibri,Arial,sans-serif';
  document.body.appendChild(container);
  try {
    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci];
      const hHtml = activeHeaders.length > 0 ? `<tr>${activeHeaders.map((h) => `<th>${h}</th>`).join('')}</tr>` : '';
      const bHtml = chunk.map((row, ri) => `<tr class="${ri % 2 === 1 ? 'e' : ''}">${row.map((cell) => `<td>${String(cell ?? '')}</td>`).join('')}</tr>`).join('');
      container.innerHTML = `<style>
        .h{font-size:18px;font-weight:bold;color:#312E81;margin-bottom:14px;border-bottom:2px solid #E0E7FF;padding-bottom:8px}
        table{width:100%;border-collapse:collapse;font-size:12px;margin-top:6px}
        th{background:#4F46E5;color:#fff;font-weight:bold;padding:9px 11px;border:1px solid #4338CA;text-align:left}
        td{padding:7px 11px;border:1px solid #E5E7EB;color:#1F2937}
        .e{background:#F8FAFC}
      </style>
      <div class="h">${filename} — Page ${ci + 1} of ${chunks.length}</div>
      <table>${activeHeaders.length > 0 ? `<thead>${hHtml}</thead>` : ''}<tbody>${bHtml}</tbody></table>`;
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      if (ci > 0) doc.addPage();
      const imgH = canvas.height * (297 / canvas.width);
      doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, Math.min(210, imgH), undefined, 'FAST');
      onProgress(40 + Math.round(((ci + 1) / chunks.length) * 55));
    }
    onProgress(98);
    return new Uint8Array(doc.output('arraybuffer'));
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
};

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const convertCsvToExcel = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(20);
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  onProgress(50);
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
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error('No worksheets found');
  onProgress(40);

  // Use defval: '' so empty cells are still extracted
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][];
  if (!rows || rows.length === 0) throw new Error('Spreadsheet file is empty or has no readable rows.');

  // Find max columns
  let maxCols = 0;
  for (const row of rows) {
    if (row.length > maxCols) maxCols = row.length;
  }
  maxCols = Math.max(1, maxCols);

  const getColumnLabel = (index: number) => {
    let label = '';
    let curr = index;
    while (curr >= 0) {
      label = String.fromCharCode(65 + (curr % 26)) + label;
      curr = Math.floor(curr / 26) - 1;
    }
    return label;
  };

  const headers: string[] = ['']; // Empty header for row number column
  for (let i = 0; i < maxCols; i++) {
    headers.push(getColumnLabel(i));
  }

  // Extract data rows
  const dataRows = rows.map((row, rowIndex) => {
    const cleanRow = [String(rowIndex + 1)]; // First cell is row number
    for (let i = 0; i < maxCols; i++) {
      cleanRow.push(String(row[i] ?? ''));
    }
    return cleanRow;
  });

  onProgress(60);

  // Initialize jsPDF in landscape A4
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  
  onProgress(75);

  // Generate Table natively using vector graphics
  autoTable(doc, {
    startY: 14,
    head: [headers],
    body: dataRows,
    theme: 'grid',
    styles: { 
      fontSize: 9, 
      font: 'helvetica',
      cellPadding: 3,
      textColor: [31, 41, 55], // #1F2937
      lineColor: [229, 231, 235], // #E5E7EB
      lineWidth: 0.2
    },
    headStyles: { 
      fillColor: [79, 70, 229], // #4F46E5 Brand Primary
      textColor: [255, 255, 255], 
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { 
        fillColor: [241, 245, 249], // slate-100
        fontStyle: 'bold', 
        halign: 'center', 
        textColor: [100, 116, 139],
        cellWidth: 10
      }
    },
    alternateRowStyles: { 
      fillColor: [248, 250, 252] // #F8FAFC Zebra Striping
    },
    margin: { top: 22, right: 14, bottom: 20, left: 14 },
    didDrawPage: (data) => {
      // Add page number at the bottom center of each page
      const str = `Halaman ${data.pageNumber}`;
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // #64748b
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      doc.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  });

  onProgress(95);
  
  const result = new Uint8Array(doc.output('arraybuffer'));
  onProgress(100);
  return result;
};

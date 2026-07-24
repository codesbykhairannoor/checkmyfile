const fs = require('fs');

let content = fs.readFileSync('src/hooks/useDocumentProcessor.ts', 'utf8');

// 1. Remove static imports
content = content.replace(/import \* as [a-zA-Z]+ from '\.\.\/engines\/[a-zA-Z]+';\n/g, '');
content = content.replace(/import \{ [a-zA-Z]+ \} from '\.\.\/engines\/pdf\/[a-zA-Z]+';\n/g, '');

// 2. Replace pdfEngine usages
content = content.replace(/pdfEngine\.mergePdfs/g, "(await import('../engines/pdfEngine')).mergePdfs");
content = content.replace(/pdfEngine\.splitPdf/g, "(await import('../engines/pdfEngine')).splitPdf");
content = content.replace(/pdfEngine\.addPageNumbers/g, "(await import('../engines/pdfEngine')).addPageNumbers");
content = content.replace(/pdfEngine\.addWatermark/g, "(await import('../engines/pdfEngine')).addWatermark");
content = content.replace(/pdfEngine\.convertPdfToPptx/g, "(await import('../engines/pdfEngine')).convertPdfToPptx");

// 3. Replace imageEngine usages
content = content.replace(/imageEngine\.convertImagesToPdf/g, "(await import('../engines/imageEngine')).convertImagesToPdf");
content = content.replace(/imageEngine\.convertPdfToImagesZip/g, "(await import('../engines/imageEngine')).convertPdfToImagesZip");

// 4. Replace officeEngine usages
content = content.replace(/officeEngine\.convertPdfToWord/g, "(await import('../engines/officeEngine')).convertPdfToWord");
content = content.replace(/officeEngine\.convertCsvToExcel/g, "(await import('../engines/officeEngine')).convertCsvToExcel");
content = content.replace(/officeEngine\.convertExcelToCsv/g, "(await import('../engines/officeEngine')).convertExcelToCsv");
content = content.replace(/officeEngine\.convertOfficeDocumentToPdf/g, "(await import('../engines/officeEngine')).convertOfficeDocumentToPdf");

// 5. Replace compressEngine usages
content = content.replace(/compressEngine\.compressPdf/g, "(await import('../engines/compressEngine')).compressPdf");

// 6. Replace ocrEngine usages
content = content.replace(/ocrEngine\.runOcrOnDocument/g, "(await import('../engines/ocrEngine')).runOcrOnDocument");

// 7. Replace individual pdf functions
const pdfFuncs = [
  { func: 'removePdfPages', file: 'removePages' },
  { func: 'insertPdfPages', file: 'organizePdf' },
  { func: 'signPdf', file: 'signPdf' },
  { func: 'protectPdf', file: 'protectPdf' },
  { func: 'unlockPdf', file: 'unlockPdf' },
  { func: 'cropPdf', file: 'cropPdf' },
  { func: 'extractImagesPdf', file: 'extractImages' },
  { func: 'grayscalePdf', file: 'grayscalePdf' },
  { func: 'scanToPdf', file: 'scanToPdf' },
  { func: 'removeMetadataPdf', file: 'removeMetadataPdf' },
  { func: 'comparePdf', file: 'comparePdf' },
  { func: 'redactPdf', file: 'redactPdf' },
  { func: 'reversePdf', file: 'reversePdf' },
  { func: 'resizePdf', file: 'resizePdf' },
  { func: 'editPdf', file: 'editPdf' }
];

pdfFuncs.forEach(({ func, file }) => {
  const regex = new RegExp(`(?<!\\/\\/\\s*|import.*)await ${func}\\(`, 'g');
  content = content.replace(regex, `await (await import('../engines/pdf/${file}')).${func}(`);
});

fs.writeFileSync('src/hooks/useDocumentProcessor.ts', content);
console.log('useDocumentProcessor.ts refactored!');

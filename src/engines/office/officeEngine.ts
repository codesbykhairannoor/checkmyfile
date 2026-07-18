import { convertDocxToPdf } from './docxToPdf';
import { convertTextToPdf } from './textToPdf';
import { convertExcelToPdf, convertCsvToPdf } from './xlsxToPdf';
import { convertPptxToPdf } from './pptxToPdf';
export const convertOfficeDocumentToPdf = async (file: File, toolId: string, onProgress: (p: number) => void): Promise<Uint8Array> => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (toolId === 'word-to-pdf' || ext === 'docx' || ext === 'doc') return convertDocxToPdf(file, onProgress);
  if (toolId === 'excel-to-pdf' || ext === 'xlsx' || ext === 'xls') return convertExcelToPdf(file, onProgress);
  if (toolId === 'ppt-to-pdf' || ext === 'pptx' || ext === 'ppt') return convertPptxToPdf(file, onProgress);
  if (ext === 'csv') return convertCsvToPdf(file, onProgress);
  return convertTextToPdf(file, onProgress);
};

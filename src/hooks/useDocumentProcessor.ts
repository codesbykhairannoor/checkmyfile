import { useState, useEffect } from 'react';
import * as pdfEngine from '../engines/pdfEngine';
import * as compressEngine from '../engines/compressEngine';
import * as officeEngine from '../engines/officeEngine';
import * as imageEngine from '../engines/imageEngine';
import * as ocrEngine from '../engines/ocrEngine';
import { getUiTranslations } from '../i18n/translations';

interface ProcessorOptions {
  files: File[];
  toolId: string;
  toolCategory: string;
  currentLang: string;
  splitRange?: string;
  rotateDegrees?: number;
  password?: string;
  pageNumberConfig?: any;
  watermarkConfig?: any;
  compressQuality?: any;
}

export function useDocumentProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('converted.pdf');
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ocrTextResult, setOcrTextResult] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadBlobUrl) {
        URL.revokeObjectURL(downloadBlobUrl);
      }
    };
  }, [downloadBlobUrl]);

  const startProcessing = async (options: ProcessorOptions) => {
    const { files, toolId, toolCategory, currentLang } = options;
    if (files.length === 0) return;
    const t = getUiTranslations(currentLang);
    
    setIsProcessing(true);
    setIsCompleted(false);
    setProgress(5);
    setErrorMessage(null);
    setOcrTextResult(null);
    setStatusText(t.processingText);

    try {
      let resultBytes: Uint8Array | null = null;
      let outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_processed.pdf`;

      if (toolId === 'merge-pdf') {
        resultBytes = await pdfEngine.mergePdfs(files, (p) => setProgress(p));
        outName = `merged_${files.length}_files.pdf`;
      } else if (toolId === 'split-pdf') {
        const results = await pdfEngine.splitPdf(files[0], options.splitRange || '', (p) => setProgress(p));
        if (results.length === 1) {
          resultBytes = results[0].data;
          outName = results[0].name;
        } else {
          const zipFiles: Record<string, Uint8Array> = {};
          results.forEach((r) => { zipFiles[r.name] = r.data; });
          const { zipSync } = await import('fflate');
          resultBytes = zipSync(zipFiles, { level: 6 });
          outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_split_pages.zip`;
        }
      } else if (toolId === 'rotate-pdf') {
        resultBytes = await pdfEngine.rotatePdf(files[0], options.rotateDegrees || 0, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_rotated.pdf`;
      } else if (toolId === 'protect-pdf') {
        resultBytes = await pdfEngine.encryptPdf(files[0], options.password || '123456', (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_protected.pdf`;
      } else if (toolId === 'unlock-pdf') {
        resultBytes = await pdfEngine.unlockPdf(files[0], options.password, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_unlocked.pdf`;
      } else if (toolId === 'page-numbers') {
        resultBytes = await pdfEngine.addPageNumbers(files[0], options.pageNumberConfig, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_numbered.pdf`;
      } else if (toolId === 'watermark-pdf') {
        resultBytes = await pdfEngine.addWatermark(files[0], options.watermarkConfig, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_watermarked.pdf`;
      } else if (toolId === 'compress-pdf') {
        resultBytes = await compressEngine.compressPdf(files[0], options.compressQuality, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_compressed.pdf`;
      } else if (toolId === 'pdf-to-word') {
        resultBytes = await pdfEngine.convertPdfToWord(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.docx`;
      } else if (toolId === 'pdf-to-ppt') {
        resultBytes = await pdfEngine.convertPdfToPptx(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.pptx`;
      } else if (toolId === 'csv-to-excel') {
        resultBytes = await officeEngine.convertCsvToExcel(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.xlsx`;
      } else if (toolId === 'excel-to-csv') {
        resultBytes = await officeEngine.convertExcelToCsv(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.csv`;
      } else if (toolCategory === 'office') {
        resultBytes = await officeEngine.convertOfficeDocumentToPdf(files[0], toolId, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`;
      } else if (toolId === 'image-to-pdf') {
        resultBytes = await imageEngine.convertImagesToPdf(files, (p) => setProgress(p));
        outName = `converted_${files.length}_images.pdf`;
      } else if (toolId === 'pdf-to-image') {
        resultBytes = await pdfEngine.convertPdfToImage(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_images.zip`;
      } else if (toolId === 'ocr-pdf') {
        const ocrRes = await ocrEngine.runOcrOnDocument(files[0], currentLang, (p, status) => {
          setProgress(p);
          setStatusText(status);
        });
        setOcrTextResult(ocrRes.text);
        const encoder = new TextEncoder();
        resultBytes = encoder.encode(ocrRes.text);
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_ocr_extracted.txt`;
      }

      if (resultBytes) {
        let mimeType = 'application/pdf';
        if (outName.endsWith('.zip')) mimeType = 'application/zip';
        else if (outName.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (outName.endsWith('.pptx')) mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        else if (outName.endsWith('.xlsx')) mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        else if (outName.endsWith('.csv')) mimeType = 'text/csv;charset=utf-8;';
        else if (outName.endsWith('.txt')) mimeType = 'text/plain;charset=utf-8;';

        const blob = new Blob([resultBytes as any], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const generatedFile = new File([blob], outName, { type: mimeType });
        setResultFile(generatedFile);
        setDownloadBlobUrl(url);
        setDownloadFilename(outName);
        setIsCompleted(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Error occurred during processing. Please verify file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcessor = () => {
    if (downloadBlobUrl) {
      URL.revokeObjectURL(downloadBlobUrl);
    }
    setResultFile(null);
    setIsProcessing(false);
    setIsCompleted(false);
    setProgress(0);
    setDownloadBlobUrl(null);
    setOcrTextResult(null);
    setErrorMessage(null);
  };

  return {
    isProcessing, progress, statusText, isCompleted, downloadBlobUrl, downloadFilename, resultFile, errorMessage, ocrTextResult,
    startProcessing, resetProcessor
  };
}

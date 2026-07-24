import { useState, useEffect } from 'react';
import * as pdfEngine from '../engines/pdfEngine';
import * as compressEngine from '../engines/compressEngine';
import * as officeEngine from '../engines/officeEngine';
import * as imageEngine from '../engines/imageEngine';
import * as ocrEngine from '../engines/ocrEngine';
import { removePdfPages } from '../engines/pdf/removePages';
import { insertPdfPages } from '../engines/pdf/organizePdf';
import { signPdf } from '../engines/pdf/signPdf';
import { protectPdf } from '../engines/pdf/protectPdf';
import { unlockPdf } from '../engines/pdf/unlockPdf';
import { cropPdf } from '../engines/pdf/cropPdf';
import { extractImagesPdf } from '../engines/pdf/extractImages';
import { grayscalePdf } from '../engines/pdf/grayscalePdf';
import { scanToPdf } from '../engines/pdf/scanToPdf';
import { removeMetadataPdf } from '../engines/pdf/removeMetadataPdf';
import { comparePdf } from '../engines/pdf/comparePdf';
import { redactPdf } from '../engines/pdf/redactPdf';
import { reversePdf } from '../engines/pdf/reversePdf';
import { resizePdf } from '../engines/pdf/resizePdf';
import { editPdf } from '../engines/pdf/editPdf';
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
  extractImageFormat?: 'png' | 'jpg';
  removeRange?: string;
  insertFile?: File | null;
  insertAtIndex?: number;
  signatureConfig?: any;
  pdfPassword?: string;
  cropConfig?: any;
  compareFile2?: File | null;
  redactConfig?: any;
  resizePageSize?: string;
  resizeOrientation?: string;
  resizeMargin?: number;
  editElements?: any[];
}

export function useDocumentProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('converted.pdf');
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultPreviewFiles, setResultPreviewFiles] = useState<File[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processorMetadata, setProcessorMetadata] = useState<any>(null);
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
    setProcessorMetadata(null);
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
        const resultBlob = await protectPdf(files[0], options.pdfPassword, (p) => setProgress(p));
        resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_protected.pdf`;
      } else if (toolId === 'unlock-pdf') {
        const resultBlob = await unlockPdf(files[0], options.pdfPassword, (p) => setProgress(p));
        resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_unlocked.pdf`;
      } else if (toolId === 'crop-pdf') {
        const resultBlob = await cropPdf(files[0], options.cropConfig, (p) => setProgress(p));
        resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_cropped.pdf`;
      } else if (toolId === 'extract-images-pdf') {
        const resultBlob = await extractImagesPdf(files[0], (p) => setProgress(p));
        resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_images.zip`;
      } else if (toolId === 'grayscale-pdf') {
        const resultBlob = await grayscalePdf(files[0], (p) => setProgress(p));
        resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_grayscale.pdf`;
      } else if (toolId === 'scan-to-pdf') {
        resultBytes = await scanToPdf(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_scanned.pdf`;
      } else if (toolId === 'remove-pdf-metadata') {
        resultBytes = await removeMetadataPdf(files[0]);
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_sanitized.pdf`;
      } else if (toolId === 'compare-pdf') {
        if (!options.compareFile2) throw new Error("File pembanding tidak ditemukan.");
        const compareResult = await comparePdf(files[0], options.compareFile2, (p) => setProgress(p));
        resultBytes = compareResult.bytes;
        setProcessorMetadata({ 
          accuracy: compareResult.accuracy,
          originalAnnotatedBytes: compareResult.originalBytes 
        });
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_comparison.pdf`;
      } else if (toolId === 'redact-pdf') {
        if (!options.redactConfig) throw new Error("Konfigurasi sensor tidak ditemukan.");
        resultBytes = await redactPdf(files[0], options.redactConfig, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_redacted.pdf`;
      } else if (toolId === 'reverse-pdf') {
        resultBytes = await reversePdf(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_reversed.pdf`;
      } else if (toolId === 'resize-pdf') {
        const resizeOptions = {
          pageSize: options.resizePageSize || 'A4',
          orientation: options.resizeOrientation || 'Auto',
          margin: options.resizeMargin || 0
        };
        resultBytes = await resizePdf(files[0], resizeOptions, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_resized.pdf`;
      } else if (toolId === 'edit-pdf') {
        if (!options.editElements) throw new Error("Konfigurasi elemen edit tidak ditemukan.");
        resultBytes = await editPdf(files[0], options.editElements, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_edited.pdf`;
      } else if (toolId === 'page-numbers') {
        resultBytes = await pdfEngine.addPageNumbers(files[0], options.pageNumberConfig, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_numbered.pdf`;
      } else if (toolId === 'watermark-pdf') {
        resultBytes = await pdfEngine.addWatermark(files[0], options.watermarkConfig, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_watermarked.pdf`;
      } else if (toolId === 'remove-pdf') {
        if (options.removeRange) {
          const pagesToRemove: number[] = [];
          const parts = options.removeRange.split(',');
          for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes('-')) {
              const [s, e] = trimmed.split('-').map(Number);
              if (!isNaN(s) && !isNaN(e)) {
                for (let i = s; i <= e; i++) pagesToRemove.push(i - 1);
              }
            } else {
              const n = parseInt(trimmed);
              if (!isNaN(n)) pagesToRemove.push(n - 1);
            }
          }
          const resultBlob = await removePdfPages(files[0], pagesToRemove, (p) => setProgress(p));
          resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        }
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_removed.pdf`;
      } else if (toolId === 'organize-pdf') {
        if (options.insertFile && options.insertAtIndex !== undefined) {
          const resultBlob = await insertPdfPages(files[0], options.insertFile, options.insertAtIndex, (p) => setProgress(p));
          resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        }
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_organized.pdf`;
      } else if (toolId === 'sign-pdf') {
        if (options.signatureConfig) {
          const resultBlob = await signPdf(files[0], options.signatureConfig, (p) => setProgress(p));
          resultBytes = new Uint8Array(await resultBlob.arrayBuffer());
        }
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_signed.pdf`;
      } else if (toolId === 'compress-pdf') {
        resultBytes = await compressEngine.compressPdf(files[0], options.compressQuality, (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}_compressed.pdf`;
      } else if (toolId === 'pdf-to-word') {
        resultBytes = await officeEngine.convertPdfToWord(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.docx`;
        setResultPreviewFiles([files[0]]);
      } else if (toolId === 'pdf-to-ppt') {
        resultBytes = await pdfEngine.convertPdfToPptx(files[0], (p) => setProgress(p));
        outName = `${files[0].name.replace(/\.[^/.]+$/, '')}.pptx`;
        const generatedPptx = new File([resultBytes as any], outName, { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        setResultPreviewFiles([generatedPptx]);
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
        const { zipBytes, filename, previewFiles } = await imageEngine.convertPdfToImagesZip(
          files[0],
          options.extractImageFormat || 'png',
          (p) => setProgress(p)
        );
        resultBytes = zipBytes;
        outName = filename;
        if (previewFiles && previewFiles.length > 0) {
          setResultPreviewFiles(previewFiles);
        }
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
    setResultPreviewFiles(null);
    setIsProcessing(false);
    setIsCompleted(false);
    setProgress(0);
    setDownloadBlobUrl(null);
    setOcrTextResult(null);
    setErrorMessage(null);
    setProcessorMetadata(null);
  };

  return {
    isProcessing, progress, statusText, isCompleted, downloadBlobUrl, downloadFilename, resultFile, resultPreviewFiles, errorMessage, ocrTextResult, processorMetadata,
    startProcessing, resetProcessor
  };
}

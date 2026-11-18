import { useState, useEffect } from 'react';
import { getUiTranslations } from '../i18n/translations';
import { trackToolStarted, trackToolCompleted, trackToolFailed, getEngineTypeFromToolId } from '../lib/analytics';
import { getCanonicalToolId } from '../catalog/toolsCatalog';

interface ProcessorOptions {
  files: File[];
  toolId: string;
  toolCategory: string;
  currentLang: string;
  isPro?: boolean;
  splitRange?: string;
  rotateDegrees?: number;
  password?: string;
  pageNumberConfig?: any;
  watermarkConfig?: any;
  compressQuality?: any;
  compressPercent?: number;
  targetSizeKB?: number;
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
  metadataConfig?: any;
}

interface SingleFileResult {
  bytes: Uint8Array;
  name: string;
  metadata?: any;
  previewFiles?: File[];
  ocrText?: string;
}

async function processSingleFile(
  canonicalId: string,
  file: File,
  options: ProcessorOptions,
  onProgress: (p: number) => void
): Promise<SingleFileResult> {
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  switch (canonicalId) {
    case 'split-pdf': {
      const results = await (await import('../engines/pdfEngine')).splitPdf(file, options.splitRange || '', onProgress);
      if (results.length === 1) {
        return { bytes: results[0].data, name: results[0].name };
      } else {
        const zipFiles: Record<string, Uint8Array> = {};
        results.forEach((r) => { zipFiles[r.name] = r.data; });
        const { zipSync } = await import('fflate');
        return { bytes: zipSync(zipFiles, { level: 6 }), name: `${baseName}_split_pages.zip` };
      }
    }

    case 'rotate-pdf': {
      const bytes = await (await import('../engines/pdfEngine')).rotatePdf(file, options.rotateDegrees || 0, onProgress);
      return { bytes, name: `${baseName}_rotated.pdf` };
    }

    case 'protect-pdf': {
      const resultBlob = await (await import('../engines/pdf/protectPdf')).protectPdf(file, options.pdfPassword, onProgress);
      return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_protected.pdf` };
    }

    case 'unlock-pdf': {
      const resultBlob = await (await import('../engines/pdf/unlockPdf')).unlockPdf(file, options.pdfPassword, onProgress);
      return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_unlocked.pdf` };
    }

    case 'crop-pdf': {
      const resultBlob = await (await import('../engines/pdf/cropPdf')).cropPdf(file, options.cropConfig, onProgress);
      return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_cropped.pdf` };
    }

    case 'extract-images-pdf': {
      const resultBlob = await (await import('../engines/pdf/extractImages')).extractImagesPdf(file, onProgress);
      return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_images.zip` };
    }

    case 'grayscale-pdf': {
      const resultBlob = await (await import('../engines/pdf/grayscalePdf')).grayscalePdf(file, onProgress);
      return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_grayscale.pdf` };
    }

    case 'scan-to-pdf': {
      const bytes = await (await import('../engines/pdf/scanToPdf')).scanToPdf(file, onProgress);
      return { bytes, name: `${baseName}_scanned.pdf` };
    }

    case 'remove-pdf-metadata': {
      const bytes = await (await import('../engines/pdf/removeMetadataPdf')).removeMetadataPdf(file);
      return { bytes, name: `${baseName}_sanitized.pdf` };
    }

    case 'edit-pdf-metadata': {
      const bytes = await (await import('../engines/pdf/editMetadataPdf')).editMetadataPdf(file, options.metadataConfig);
      return { bytes, name: `${baseName}_properties_updated.pdf` };
    }

    case 'redact-pdf': {
      if (!options.redactConfig) throw new Error("Konfigurasi sensor tidak ditemukan.");
      const bytes = await (await import('../engines/pdf/redactPdf')).redactPdf(file, options.redactConfig, onProgress);
      return { bytes, name: `${baseName}_redacted.pdf` };
    }

    case 'reverse-pdf': {
      const bytes = await (await import('../engines/pdf/reversePdf')).reversePdf(file, onProgress);
      return { bytes, name: `${baseName}_reversed.pdf` };
    }

    case 'repair-pdf': {
      const result = await (await import('../engines/pdf/repairPdf')).repairPdf(file, (p, text) => {
        onProgress(p);
      });
      return { bytes: result.bytes, name: `${baseName}_repaired.pdf`, metadata: result.diagnostics };
    }

    case 'resize-pdf': {
      const resizeOptions = {
        pageSize: options.resizePageSize || 'A4',
        orientation: options.resizeOrientation || 'Auto',
        margin: options.resizeMargin || 0
      };
      const bytes = await (await import('../engines/pdf/resizePdf')).resizePdf(file, resizeOptions, onProgress);
      return { bytes, name: `${baseName}_resized.pdf` };
    }

    case 'edit-pdf': {
      if (!options.editElements) throw new Error("Konfigurasi elemen edit tidak ditemukan.");
      const bytes = await (await import('../engines/pdf/editPdf')).editPdf(file, options.editElements, onProgress);
      return { bytes, name: `${baseName}_edited.pdf` };
    }

    case 'page-numbers': {
      const bytes = await (await import('../engines/pdfEngine')).addPageNumbers(file, options.pageNumberConfig, onProgress);
      return { bytes, name: `${baseName}_numbered.pdf` };
    }

    case 'watermark-pdf': {
      const bytes = await (await import('../engines/pdfEngine')).addWatermark(file, options.watermarkConfig, onProgress);
      return { bytes, name: `${baseName}_watermarked.pdf` };
    }

    case 'remove-pdf': {
      const pagesToRemove: number[] = [];
      if (options.removeRange) {
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
      }
      const resultBlob = await (await import('../engines/pdf/removePages')).removePdfPages(file, pagesToRemove, onProgress);
      return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_removed.pdf` };
    }

    case 'organize-pdf': {
      if (options.insertFile && options.insertAtIndex !== undefined) {
        const resultBlob = await (await import('../engines/pdf/organizePdf')).insertPdfPages(file, options.insertFile, options.insertAtIndex, onProgress);
        return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_organized.pdf` };
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      return { bytes, name: `${baseName}_organized.pdf` };
    }

    case 'sign-pdf': {
      if (options.signatureConfig) {
        const resultBlob = await (await import('../engines/pdf/signPdf')).signPdf(file, options.signatureConfig, onProgress);
        return { bytes: new Uint8Array(await resultBlob.arrayBuffer()), name: `${baseName}_signed.pdf` };
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      return { bytes, name: `${baseName}_signed.pdf` };
    }

    case 'compress-pdf': {
      const bytes = await (await import('../engines/compressEngine')).compressPdf(
        file,
        options.compressQuality,
        onProgress,
        options.compressPercent,
        options.targetSizeKB
      );
      return { bytes, name: `${baseName}_compressed.pdf` };
    }

    case 'pdf-to-word': {
      const bytes = await (await import('../engines/officeEngine')).convertPdfToWord(file, onProgress);
      return { bytes, name: `${baseName}.docx`, previewFiles: [file] };
    }

    case 'pdf-to-ppt': {
      const bytes = await (await import('../engines/pdfEngine')).convertPdfToPptx(file, onProgress);
      const outName = `${baseName}.pptx`;
      const pptxFile = new File([bytes as any], outName, { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      return { bytes, name: outName, previewFiles: [pptxFile] };
    }

    case 'csv-to-excel': {
      const bytes = await (await import('../engines/officeEngine')).convertCsvToExcel(file, onProgress);
      return { bytes, name: `${baseName}.xlsx` };
    }

    case 'excel-to-csv': {
      const bytes = await (await import('../engines/officeEngine')).convertExcelToCsv(file, onProgress);
      return { bytes, name: `${baseName}.csv` };
    }

    case 'excel-to-pdf':
    case 'ppt-to-pdf':
    case 'txt-to-pdf':
    case 'word-to-pdf': {
      const bytes = await (await import('../engines/officeEngine')).convertOfficeDocumentToPdf(file, canonicalId, onProgress);
      return { bytes, name: `${baseName}.pdf` };
    }

    case 'pdf-to-image': {
      const { zipBytes, filename, previewFiles } = await (await import('../engines/imageEngine')).convertPdfToImagesZip(
        file,
        options.extractImageFormat || 'png',
        onProgress
      );
      return { bytes: zipBytes, name: filename, previewFiles: previewFiles || [] };
    }

    case 'ocr-pdf': {
      const format = (options.extractImageFormat as any) || 'txt';
      const ocrRes = await (await import('../engines/ocrEngine')).runOcrOnDocument(
        file,
        options.currentLang,
        (p) => onProgress(p),
        format
      );
      if (format === 'xlsx' && ocrRes.excelBytes) {
        return { bytes: ocrRes.excelBytes, name: `${baseName}_tables.xlsx`, ocrText: ocrRes.text };
      }
      const encoder = new TextEncoder();
      return { bytes: encoder.encode(ocrRes.text), name: `${baseName}_ocr_extracted.txt`, ocrText: ocrRes.text };
    }

    default: {
      if (options.toolCategory === 'office') {
        const bytes = await (await import('../engines/officeEngine')).convertOfficeDocumentToPdf(file, canonicalId, onProgress);
        return { bytes, name: `${baseName}.pdf` };
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      return { bytes, name: `${baseName}_processed.pdf` };
    }
  }
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
    setStatusText(t.processingText || 'Processing documents...');

    // Resolve Canonical Tool ID (guarantees all SEO aliases execute their true engine)
    const canonicalId = getCanonicalToolId(toolId);

    // Free users: cap at 10 files per batch
    const filesToProcess = (!options.isPro && files.length > 10) ? files.slice(0, 10) : files;

    // Track analytics: tool started
    const processingStartTime = performance.now();
    const totalFileSizeKb = filesToProcess.reduce((acc, f) => acc + f.size / 1024, 0);
    const engineType = getEngineTypeFromToolId(canonicalId, toolCategory);
    trackToolStarted({
      tool_id: canonicalId,
      tool_category: toolCategory,
      engine_type: engineType,
      file_count: filesToProcess.length,
      file_size_kb: totalFileSizeKb,
      language: currentLang,
    });

    try {
      let resultBytes: Uint8Array | null = null;
      let outName = `${filesToProcess[0].name.replace(/\.[^/.]+$/, '')}_processed.pdf`;

      // 1. Native Multi-File Combiners
      if (canonicalId === 'merge-pdf') {
        resultBytes = await (await import('../engines/pdfEngine')).mergePdfs(filesToProcess, (p) => setProgress(p));
        outName = `merged_${filesToProcess.length}_files.pdf`;
      } else if (canonicalId === 'image-to-pdf') {
        resultBytes = await (await import('../engines/imageEngine')).convertImagesToPdf(filesToProcess, (p) => setProgress(p));
        outName = `converted_${filesToProcess.length}_images.pdf`;
      } else if (canonicalId === 'compare-pdf') {
        const file1 = filesToProcess[0];
        const file2 = options.compareFile2 || filesToProcess[1];
        if (!file2) throw new Error("File pembanding tidak ditemukan.");
        const compareResult = await (await import('../engines/pdf/comparePdf')).comparePdf(file1, file2, (p) => setProgress(p));
        resultBytes = compareResult.bytes;
        outName = `${file1.name.replace(/\.[^/.]+$/, '')}_comparison.pdf`;
        setProcessorMetadata({
          accuracy: compareResult.accuracy,
          originalAnnotatedBytes: compareResult.originalBytes
        });
      } else if (filesToProcess.length === 1) {
        // 2. Single Document Processing
        const single = await processSingleFile(canonicalId, filesToProcess[0], options, (p) => setProgress(p));
        resultBytes = single.bytes;
        outName = single.name;
        if (single.metadata) setProcessorMetadata(single.metadata);
        if (single.previewFiles) setResultPreviewFiles(single.previewFiles);
        if (single.ocrText) setOcrTextResult(single.ocrText);
      } else {
        // 3. Batch Multi-File Processing (Every single tool now natively processes batches!)
        const { zipSync } = await import('fflate');
        const zipMap: Record<string, Uint8Array> = {};
        const allPreviewFiles: File[] = [];
        const total = filesToProcess.length;

        for (let i = 0; i < total; i++) {
          const file = filesToProcess[i];
          const basePercent = Math.round((i / total) * 100);
          const spanPercent = 100 / total;
          setStatusText(`Batch processing ${i + 1}/${total}: ${file.name}...`);

          const single = await processSingleFile(canonicalId, file, options, (subP) => {
            setProgress(Math.round(basePercent + (subP / 100) * spanPercent));
          });

          if (single.previewFiles) {
            allPreviewFiles.push(...single.previewFiles);
          }

          // Prevent filename collisions inside ZIP
          let uniqueName = single.name;
          let counter = 1;
          while (zipMap[uniqueName]) {
            const dot = uniqueName.lastIndexOf('.');
            const base = dot !== -1 ? uniqueName.slice(0, dot) : uniqueName;
            const ext = dot !== -1 ? uniqueName.slice(dot) : '';
            uniqueName = `${base}_(${counter})${ext}`;
            counter++;
          }
          zipMap[uniqueName] = single.bytes;
        }

        resultBytes = zipSync(zipMap, { level: 6 });
        outName = `${canonicalId}_batch_${total}_files.zip`;
        if (allPreviewFiles.length > 0) {
          setResultPreviewFiles(allPreviewFiles);
        }
        setStatusText(`Complete! ${total} files processed in batch.`);
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

        // Track analytics: tool completed successfully
        const durationMs = performance.now() - processingStartTime;
        const outputSizeKb = resultBytes ? resultBytes.byteLength / 1024 : 0;
        trackToolCompleted({
          tool_id: canonicalId,
          tool_category: toolCategory,
          engine_type: engineType,
          duration_ms: durationMs,
          output_size_kb: outputSizeKb,
          language: currentLang,
        });
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || 'Error occurred during processing. Please verify file format.';
      setErrorMessage(errMsg);
      // Track analytics: tool failed
      trackToolFailed({
        tool_id: canonicalId,
        tool_category: toolCategory,
        error_message: errMsg,
        language: currentLang,
      });
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

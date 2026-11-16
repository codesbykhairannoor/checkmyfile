import { zipSync } from 'fflate';

export type BatchAction = 'compress' | 'grayscale' | 'rotate' | 'protect' | 'watermark' | 'remove-metadata';

export interface BatchOptions {
  action: BatchAction;
  compressQuality?: 'extreme' | 'balanced' | 'high' | 'custom';
  compressPercent?: number;
  rotateDegrees?: number;
  password?: string;
  watermarkText?: string;
}

export interface BatchFileResult {
  fileName: string;
  outputName: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  originalSize: number;
  processedSize?: number;
  error?: string;
  resultBlob?: Blob;
}

export interface BatchProcessResult {
  items: BatchFileResult[];
  zipBlob: Blob;
  zipFilename: string;
  totalOriginalSize: number;
  totalProcessedSize: number;
  successCount: number;
  failCount: number;
}

/**
 * High-performance, 100% in-browser batch document processing engine.
 * Processes an arbitrary list of PDF files (or folder contents) entirely in client RAM.
 * Automatically bundles all output documents into a compressed ZIP file using fflate.
 */
export async function executeBatchProcessing(
  files: File[],
  options: BatchOptions,
  onProgress?: (overallPercent: number, currentItemIndex: number, currentItemName: string) => void,
  onItemUpdated?: (index: number, updatedItem: BatchFileResult) => void
): Promise<BatchProcessResult> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for batch processing.');
  }

  const items: BatchFileResult[] = files.map((f) => ({
    fileName: f.name,
    outputName: f.name,
    status: 'pending',
    originalSize: f.size,
  }));

  const zipFiles: Record<string, Uint8Array> = {};
  let totalOriginalSize = 0;
  let totalProcessedSize = 0;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    totalOriginalSize += file.size;

    // Notify processing item
    items[i].status = 'processing';
    onItemUpdated?.(i, { ...items[i] });
    
    const overallPercent = Math.round((i / files.length) * 100);
    onProgress?.(overallPercent, i, file.name);

    try {
      let outputBytes: Uint8Array | null = null;
      let outputName = file.name;
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      switch (options.action) {
        case 'compress': {
          const { compressPdf } = await import('../compressEngine');
          const quality = options.compressQuality || 'balanced';
          outputBytes = await compressPdf(file, quality, undefined, options.compressPercent);
          outputName = `${baseName}_compressed.pdf`;
          break;
        }

        case 'grayscale': {
          const { grayscalePdf } = await import('./grayscalePdf');
          const blob = await grayscalePdf(file);
          outputBytes = new Uint8Array(await blob.arrayBuffer());
          outputName = `${baseName}_grayscale.pdf`;
          break;
        }

        case 'rotate': {
          const { rotatePdf } = await import('./rotatePdf');
          const deg = options.rotateDegrees || 90;
          outputBytes = await rotatePdf(file, deg, () => {});
          outputName = `${baseName}_rotated_${deg}deg.pdf`;
          break;
        }

        case 'protect': {
          const { protectPdf } = await import('./protectPdf');
          const pwd = options.password || 'password';
          const blob = await protectPdf(file, pwd);
          outputBytes = new Uint8Array(await blob.arrayBuffer());
          outputName = `${baseName}_protected.pdf`;
          break;
        }

        case 'watermark': {
          const { addWatermark } = await import('./addWatermark');
          const text = options.watermarkText || 'CONFIDENTIAL';
          const blob = await addWatermark(file, {
            type: 'text',
            text: text,
            opacity: 0.35,
            color: '#dc2626',
            scale: 1,
            rotation: 45,
            position: 'center',
            isRepeating: false,
          });
          outputBytes = new Uint8Array(await blob.arrayBuffer());
          outputName = `${baseName}_watermarked.pdf`;
          break;
        }

        case 'remove-metadata': {
          const { removeMetadataPdf } = await import('./removeMetadataPdf');
          outputBytes = await removeMetadataPdf(file);
          outputName = `${baseName}_sanitized.pdf`;
          break;
        }

        default:
          throw new Error(`Unsupported batch action: ${options.action}`);
      }

      if (outputBytes) {
        // Ensure unique name in zip
        let finalZipKey = outputName;
        let counter = 1;
        while (zipFiles[finalZipKey]) {
          finalZipKey = `${baseName}_${counter}.pdf`;
          counter++;
        }

        zipFiles[finalZipKey] = outputBytes;
        const resultBlob = new Blob([outputBytes as any], { type: 'application/pdf' });
        
        items[i].status = 'done';
        items[i].outputName = outputName;
        items[i].processedSize = outputBytes.byteLength;
        items[i].resultBlob = resultBlob;
        totalProcessedSize += outputBytes.byteLength;
        successCount++;
      }
    } catch (err: any) {
      console.error(`Batch processing failed for file ${file.name}:`, err);
      items[i].status = 'error';
      items[i].error = err?.message || 'Processing failed';
      failCount++;
    }

    onItemUpdated?.(i, { ...items[i] });
  }

  // Final 100% notification
  onProgress?.(100, files.length - 1, 'Finalizing ZIP bundle...');

  // Compress all outputs into a single ZIP file in RAM
  const zipUint8Array = zipSync(zipFiles, { level: 6 });
  const zipBlob = new Blob([zipUint8Array as any], { type: 'application/zip' });
  const zipFilename = `handlemyfile_batch_${options.action}_${files.length}_files.zip`;

  return {
    items,
    zipBlob,
    zipFilename,
    totalOriginalSize,
    totalProcessedSize,
    successCount,
    failCount,
  };
}

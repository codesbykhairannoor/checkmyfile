import { convert } from 'handlemyfile';

/**
 * Pure Rust WebAssembly PDF to Word (DOCX) Converter Engine
 * Powered by handlemyfile v0.2.1 (Crates.io / PyPI / NPM: handlemyfile)
 * 100% Client-Side In-Browser Memory Execution (Zero Server Uploads).
 */
export const convertPdfToWord = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(10);
  const arrayBuffer = await file.arrayBuffer();
  const pdfUint8Array = new Uint8Array(arrayBuffer);
  onProgress(25);

  // Execute High-Precision Pure WASM PDF to DOCX Conversion with real-time stage progress
  const docxBytes = await convert(pdfUint8Array, {
    onProgress: ({ current, total, stage }) => {
      if (total > 0) {
        const pagePct = Math.round((current / total) * 70);
        onProgress(Math.min(95, 25 + pagePct));
      } else {
        if (stage === 'parsing') onProgress(35);
        else if (stage === 'analyzing_layout') onProgress(60);
        else if (stage === 'generating_docx') onProgress(85);
      }
    }
  });

  onProgress(100);
  return docxBytes;
};

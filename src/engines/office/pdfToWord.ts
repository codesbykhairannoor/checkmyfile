import init, { convert_pdf_to_docx } from 'handlemyfile';
import wasmUrl from 'handlemyfile/handlemyfile_bg.wasm?url';

let wasmInitPromise: Promise<unknown> | null = null;

/**
 * Ensures the HandleMyFile Rust WebAssembly engine is instantiated in-browser.
 */
async function ensureWasmInitialized(): Promise<void> {
  if (!wasmInitPromise) {
    wasmInitPromise = (async () => {
      try {
        await init(wasmUrl);
      } catch {
        // Fallback to default import.meta.url resolution if needed
        await init();
      }
    })();
  }
  await wasmInitPromise;
}

/**
 * Pure Rust WebAssembly PDF to Word (DOCX) Converter Engine
 * Powered by handlemyfile (Crates.io / PyPI / NPM: @handlemyfile)
 * 100% Client-Side In-Browser Memory Execution (Zero Server Uploads).
 */
export const convertPdfToWord = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const pdfUint8Array = new Uint8Array(arrayBuffer);
  onProgress(35);

  // 1. Initialize HandleMyFile WebAssembly Core
  onProgress(55);
  await ensureWasmInitialized();
  onProgress(75);

  // 2. Execute Pure WASM PDF to DOCX Conversion in Browser RAM
  const docxBytes = convert_pdf_to_docx(pdfUint8Array);
  onProgress(100);

  return docxBytes;
};

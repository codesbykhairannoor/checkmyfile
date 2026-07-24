declare module 'high-precision-pdf-to-docx' {
  export class HighPrecisionPdfConverter {
    constructor();
    initialize(): Promise<void>;
    convertPdfToDocx(pdfUint8Array: Uint8Array): Promise<ArrayBuffer>;
  }
}

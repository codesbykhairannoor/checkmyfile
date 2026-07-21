import { createWorker } from 'tesseract.js';
import workerPath from 'tesseract.js/dist/worker.min.js?url';
import corePath from 'tesseract.js-core/tesseract-core.wasm.js?url';
import * as pdfjsLib from 'pdfjs-dist';

// Map our ISO language codes to Tesseract traineddata language codes
const LANG_TO_TESS: Record<string, string> = {
  en: 'eng',
  id: 'ind',
  es: 'spa',
  fr: 'fra',
  de: 'deu',
  ja: 'jpn',
  pt: 'por',
  ru: 'rus',
  zh: 'chi_sim',
  ar: 'ara',
  hi: 'hin',
  it: 'ita',
  ko: 'kor',
  nl: 'nld',
  tr: 'tur',
  pl: 'pol',
  vi: 'vie',
  th: 'tha',
};

export const runOcrOnDocument = async (
  file: File,
  uiLang: string,
  onProgress: (progress: number, status: string) => void
): Promise<{ text: string; confidence: number }> => {
  const tessLang = LANG_TO_TESS[uiLang] || 'eng';
  onProgress(5, `Initializing Tesseract Web Worker (${tessLang.toUpperCase()})...`);

  const worker = await createWorker(tessLang, 1, {
    workerPath,
    corePath,
    langPath: '/tessdata',
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        const p = Math.round(m.progress * 80) + 15;
        onProgress(p, `Recognizing Text: ${Math.round(m.progress * 100)}%`);
      } else {
        onProgress(10, `Status: ${m.status}`);
      }
    },
  });

  try {
    let imageSource: string | ImageData = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      onProgress(12, 'Rasterizing first PDF page to high-res canvas...');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdfDoc.getPage(1);
      const scale = 2.5; // High contrast resolution for OCR
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context failed');

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      await page.render({ canvasContext: ctx, viewport, canvas: canvas as any }).promise;
      imageSource = canvas.toDataURL('image/png');
    } else {
      // It's an image PNG/JPG
      imageSource = URL.createObjectURL(file);
    }

    onProgress(15, 'Starting neural network OCR recognition...');
    const { data } = await worker.recognize(imageSource);
    onProgress(95, 'Finalizing extracted text...');

    if (typeof imageSource === 'string' && imageSource.startsWith('blob:')) {
      URL.revokeObjectURL(imageSource);
    }

    await worker.terminate();
    onProgress(100, 'Complete!');

    return {
      text: data.text || 'No text detected.',
      confidence: data.confidence || 0,
    };
  } catch (error) {
    await worker.terminate();
    throw error;
  }
};

import type { ToolDefinition } from './types';
import { generateSlugsForId, defaultFaqs } from './types';

export const ocrTools: ToolDefinition[] = [
  {
    id: 'ocr-pdf',
    category: 'ocr',
    iconName: 'ScanText',
    slugs: generateSlugsForId('ocr-pdf', {
      en: 'ocr-pdf',
      id: 'ocr-pdf-ke-teks',
      es: 'ocr-pdf-a-texto',
    }),
    seo: {
      en: {
        title: 'Free Browser OCR - Extract Text from Scanned PDF & Images',
        h1: 'Extract Text from Scanned PDFs & Images with Tesseract OCR',
        description: 'Turn non-searchable scanned PDFs and images into editable plain text locally using multi-language WebAssembly OCR workers.',
        faqs: defaultFaqs('OCR PDF & Image', 'en'),
      }
    }
  }
];

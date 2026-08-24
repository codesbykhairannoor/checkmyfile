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
  },
  {
    id: 'scanned-pdf-to-text-ocr',
    category: 'ocr',
    iconName: 'ScanText',
    slugs: generateSlugsForId('scanned-pdf-to-text-ocr', {
      en: 'scanned-pdf-to-text-ocr',
      id: 'memindai-pdf-ke-teks-ocr',
      es: 'pdf-escaneado-a-texto-ocr',
      fr: 'pdf-num-ris-en-texte-ocr',
      de: 'gescanntes-pdf-in-text-ocr',
      ja: 'scanned-pdf-to-text-ocr',
      pt: 'pdf-digitalizado-para-texto-ocr',
      ru: 'scanned-pdf-to-text-ocr',
      zh: 'scanned-pdf-to-text-ocr',
      ar: 'scanned-pdf-to-text-ocr',
      it: 'pdf-scansionato-in-testo-ocr',
      ko: 'scanned-pdf-to-text-ocr',
      nl: 'gescande-pdf-naar-tekst-ocr',
      tr: 'taranan-pdf-i-metin-ocr-a-d-n-t-rme',
      pl: 'zeskanowany-plik-pdf-do-tekstu-ocr',
      vi: 'qu-t-pdf-sang-v-n-b-n-ocr',
      th: 'scanned-pdf-to-text-ocr',
      sv: 'skannade-pdf-till-text-ocr',
      cs: 'naskenovan-pdf-do-textu-ocr',
      da: 'scannet-pdf-til-tekst-ocr',
      el: 'scanned-pdf-to-text-ocr',
      fi: 'skannattu-pdf-tekstiksi-ocr',
      he: 'scanned-pdf-to-text-ocr',
      hu: 'szkennelt-pdf-sz-vegg-ocr',
      no: 'skannet-pdf-til-tekst-ocr',
      ro: 'pdf-scanat-n-text-ocr',
      sk: 'naskenovan-pdf-do-textu-ocr',
      uk: 'scanned-pdf-to-text-ocr',
      ms: 'diimbas-pdf-ke-teks-ocr',
    }),
    seo: {
      en: {
        title: 'Convert Scanned PDF to Text',
        h1: 'Extract Text from Scanned PDFs with OCR',
        description: 'Turn non-searchable scanned PDFs and images into editable plain text locally using multi-language WebAssembly OCR workers.',
        faqs: defaultFaqs('Convert Scanned PDF to Text', 'en'),
      },
      id: {
        title: 'Konversi PDF Hasil Scan ke Teks Online (OCR Gratis)',
        h1: 'Ekstrak Teks dari PDF Pindaian / Foto dengan OCR',
        description: 'Ubah dokumen PDF hasil pindaian (scan) atau foto yang tidak bisa disalin teksnya menjadi teks mentah (TXT) di peramban Anda.',
        faqs: defaultFaqs('Konversi PDF Hasil Scan', 'id'),
      }
    }
  }
];

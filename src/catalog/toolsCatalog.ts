import type { ToolDefinition, LocalizedSeoData } from './types';
import { pdfTools } from './pdfTools';
import { compressTools } from './compressTools';
import { officeTools } from './officeTools';
import { imageTools } from './imageTools';
import { ocrTools } from './ocrTools';
import { defaultFaqs } from './types';

// Re-export types so other files don't need to change imports
export type { ToolCategory, ToolFaqItem, LocalizedSeoData, ToolDefinition } from './types';

export const TOOLS_CATALOG: ToolDefinition[] = [
  ...pdfTools,
  ...compressTools,
  ...officeTools,
  ...imageTools,
  ...ocrTools,
];

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOLS_CATALOG.find((t) => t.id === id);
};

export const getToolBySlugAndLang = (slug: string, lang: string): ToolDefinition | undefined => {
  return TOOLS_CATALOG.find((t) => t.slugs[lang] === slug || t.id === slug);
};

import { catalogTranslations } from '../i18n/catalogTranslations';

export const getCanonicalToolId = (toolId: string): string => {
  switch (toolId) {
    // 1. Merge
    case 'gabung-pdf':
    case 'combine-multiple-pdf-files':
    case 'gabung-beberapa-file-pdf':
    case 'merge-pdf-files-offline':
    case 'menggabungkan-file-pdf-secara-offline':
      return 'merge-pdf';

    // 2. Split
    case 'pisah-pdf':
      return 'split-pdf';

    // 3. Rotate
    case 'rotasi-pdf':
      return 'rotate-pdf';

    // 4. Page Numbers
    case 'nomor-halaman-pdf':
    case 'add-page-numbers-to-pdf-free':
    case 'tambahkan-nomor-halaman-ke-pdf-gratis':
      return 'page-numbers';

    // 5. Watermark
    case 'tanda-air-pdf':
    case 'remove-pdf-watermark-online':
    case 'hapus-tanda-air-pdf-online':
      return 'watermark-pdf';

    // 6. Remove Pages
    case 'hapus-halaman-pdf':
      return 'remove-pdf';

    // 7. Organize / Reorder
    case 'sisip-halaman-pdf':
    case 'reorder-pdf-pages-drag-and-drop':
    case 'menyusun-ulang-halaman-pdf-seret-dan-lepas':
      return 'organize-pdf';

    // 8. Sign PDF
    case 'ttd-pdf':
    case 'sign-pdf-without-registration':
    case 'ttd-pdf-tanpa-daftar':
    case 'tanda-tangan-pdf':
      return 'sign-pdf';

    // 9. Protect
    case 'kunci-pdf':
      return 'protect-pdf';

    // 10. Unlock
    case 'buka-kunci-pdf':
    case 'remove-pdf-password-without-password':
    case 'hapus-kata-sandi-pdf-tanpa-kata-sandi':
      return 'unlock-pdf';

    // 11. Crop
    case 'pangkas-pdf':
    case 'crop-pdf-margins':
    case 'potong-margin-pdf':
      return 'crop-pdf';

    // 12. Extract Images
    case 'ambil-gambar-dari-pdf':
    case 'extract-high-res-images-pdf':
    case 'ekstrak-gambar-resolusi-tinggi-pdf':
      return 'extract-images-pdf';

    // 13. Grayscale
    case 'ubah-pdf-jadi-hitam-putih':
    case 'grayscale-pdf-for-printing':
    case 'pdf-skala-abu-abu-untuk-dicetak':
      return 'grayscale-pdf';

    // 14. Remove Metadata
    case 'hapus-metadata-pdf':
    case 'remove-pdf-author-metadata':
    case 'hapus-metadata-penulis-pdf':
      return 'remove-pdf-metadata';

    // 15. Edit Metadata
    case 'edit-metadata-pdf':
      return 'edit-pdf-metadata';

    // 16. Compare PDF
    case 'bandingkan-pdf':
    case 'compare-pdf-files-visually':
    case 'bandingkan-file-pdf-secara-visual':
      return 'compare-pdf';

    // 17. Scan to PDF
    case 'scan-ke-pdf':
      return 'scan-to-pdf';

    // 18. Redact
    case 'sensor-pdf':
      return 'redact-pdf';

    // 19. Reverse
    case 'balik-urutan-pdf':
      return 'reverse-pdf';

    // 20. Resize
    case 'ubah-ukuran-pdf':
      return 'resize-pdf';

    // 21. Compress & Batch
    case 'kompres-pdf':
    case 'compress-pdf-for-email':
    case 'kompres-pdf-untuk-email':
    case 'compress-pdf-to-100kb':
    case 'kompres-pdf-100kb':
    case 'compress-pdf-without-losing-quality':
    case 'kompres-pdf-tanpa-mengurangi-kualitas':
    case 'reduce-pdf-size-offline':
    case 'kurangi-ukuran-pdf-secara-offline':
    case 'batch-pdf':
    case 'proses-batch-pdf':
      return 'compress-pdf';

    // 22. Word to PDF
    case 'word-ke-pdf':
      return 'word-to-pdf';

    // 23. Excel to PDF
    case 'excel-ke-pdf':
      return 'excel-to-pdf';

    // 24. PPT to PDF
    case 'ppt-ke-pdf':
      return 'ppt-to-pdf';

    // 25. TXT to PDF
    case 'teks-ke-pdf':
      return 'txt-to-pdf';

    // 26. PDF to Word
    case 'pdf-ke-word':
    case 'pdf-to-word-without-losing-formatting':
    case 'pdf-ke-word-tanpa-kehilangan-format':
      return 'pdf-to-word';

    // 27. PDF to PPT
    case 'pdf-ke-ppt':
      return 'pdf-to-ppt';

    // 28. CSV to Excel
    case 'csv-ke-excel':
      return 'csv-to-excel';

    // 29. Excel to CSV
    case 'excel-ke-csv':
      return 'excel-to-csv';

    // 30. Image to PDF
    case 'gambar-ke-pdf':
      return 'image-to-pdf';

    // 31. PDF to Image
    case 'pdf-ke-gambar':
      return 'pdf-to-image';

    // 32. OCR PDF
    case 'ocr-pdf-ke-teks':
    case 'convert-scanned-pdf-to-text':
    case 'mengonversi-pindaian-pdf-menjadi-teks':
    case 'scanned-pdf-to-text-ocr':
    case 'memindai-pdf-ke-teks-ocr':
      return 'ocr-pdf';

    default:
      return toolId;
  }
};

export const supportsMultipleFiles = (toolId: string): boolean => {
  const canonical = getCanonicalToolId(toolId);
  return canonical !== 'compare-pdf';
};

export const getLocalizedSeo = (tool: ToolDefinition, lang: string): LocalizedSeoData => {
  const translations = catalogTranslations[lang]?.[tool.id] || catalogTranslations['en']?.[tool.id] || tool.seo[lang] || tool.seo['en'] || {
    title: `${tool.id} - Zero Upload Client-Side Tool`,
    h1: tool.id,
    description: `Use ${tool.id} completely in your browser with 100% privacy.`,
  };

  return {
    ...translations,
    faqs: defaultFaqs(tool.id, lang),
  };
};

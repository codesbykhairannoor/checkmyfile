import type { ToolDefinition } from './types';
import { generateSlugsForId, defaultFaqs } from './types';

export const compressTools: ToolDefinition[] = [
  {
    id: 'compress-pdf',
    category: 'compress',
    iconName: 'Minimize2',
    slugs: generateSlugsForId('compress-pdf', {
      en: 'compress-pdf',
      id: 'kompres-pdf',
      es: 'comprimir-pdf',
      fr: 'compresser-pdf',
      de: 'pdf-komprimieren',
    }),
    seo: {
      en: {
        title: 'Compress PDF Online - Reduce File Size by 60-90% Locally',
        h1: 'Compress PDF Documents without Losing Quality',
        description: 'Shrink large PDF files up to 90% using adaptive lossless and DPI rasterization techniques directly in WebAssembly.',
        faqs: defaultFaqs('Compress PDF', 'en'),
      },
      id: {
        title: 'Kompres PDF Online Gratis - Kecilkan Ukuran File Hingga 90%',
        h1: 'Kecilkan Ukuran Berkas PDF Tanpa Mengurangi Kualitas',
        description: 'Kompres file PDF berukuran megabita menjadi sangat ringan untuk dikirim lewat email atau WhatsApp dengan pemrosesan lokal.',
        faqs: defaultFaqs('Kompres PDF', 'id'),
      },
      es: {
        title: 'Comprimir PDF Online - Reducir Tamaño de Archivo sin Subidas',
        h1: 'Comprime Archivos PDF manteniendo una Excelente Calidad',
        description: 'Reduce el peso de tus documentos PDF grandes hasta un 90% mediante técnicas avanzadas en la memoria de tu navegador.',
        faqs: defaultFaqs('Comprimir PDF', 'es'),
      },
    },
  },

];

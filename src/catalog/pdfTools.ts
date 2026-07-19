import type { ToolDefinition } from './types';
import { generateSlugsForId, defaultFaqs } from './types';

export const pdfTools: ToolDefinition[] = [
  {
    id: 'merge-pdf',
    category: 'pdf',
    iconName: 'Combine',
    slugs: generateSlugsForId('merge-pdf', {
      en: 'merge-pdf',
      id: 'gabung-pdf',
      es: 'unir-pdf',
      fr: 'fusionner-pdf',
      de: 'pdf-zusammenfuehren',
      pt: 'juntar-pdf',
      ms: 'gabung-pdf-online',
    }),
    seo: {
      en: {
        title: 'Free Online PDF Merger - Combine PDF Files Locally | Zero Upload',
        h1: 'Merge PDF Files Instantly in Your Browser',
        description: 'Combine multiple PDF files into a single document using pure client-side WebAssembly. No file uploads, 100% privacy guaranteed, zero limits.',
        faqs: defaultFaqs('Merge PDF', 'en'),
      },
      id: {
        title: 'Gabung PDF Online Gratis - Satukan File PDF Tanpa Unggah Server',
        h1: 'Gabungkan Berkas PDF Instan di Dalam Peramban',
        description: 'Satukan beberapa file PDF menjadi satu dokumen berurutan dengan teknologi WebAssembly lokal. Tanpa batasan kuota, 100% privat dan aman.',
        faqs: defaultFaqs('Gabung PDF', 'id'),
      },
      es: {
        title: 'Unir PDF Gratis Online - Combinar Archivos sin Subir al Servidor',
        h1: 'Combina Archivos PDF al Instante en tu Navegador',
        description: 'Une varios archivos PDF en un solo documento usando WebAssembly en el cliente. Sin subidas, 100% privado y sin límites.',
        faqs: defaultFaqs('Unir PDF', 'es'),
      },
    },
  },
  {
    id: 'split-pdf',
    category: 'pdf',
    iconName: 'Scissors',
    slugs: generateSlugsForId('split-pdf', {
      en: 'split-pdf',
      id: 'pisah-pdf',
      es: 'dividir-pdf',
      fr: 'diviser-pdf',
      de: 'pdf-teilen',
    }),
    seo: {
      en: {
        title: 'Split PDF Online - Extract Pages Separately | Client-Side Privacy',
        h1: 'Split PDF Documents & Extract Specific Pages',
        description: 'Separate one or more PDF pages into independent PDF files or a ZIP archive locally. Fast, secure, and 100% browser-based.',
        faqs: defaultFaqs('Split PDF', 'en'),
      },
      id: {
        title: 'Pisah PDF Online Gratis - Ekstrak Halaman PDF Tanpa Unggah',
        h1: 'Pisahkan Dokumen PDF & Ekstrak Halaman Pilihan',
        description: 'Ambil halaman tertentu atau pisahkan rentang halaman PDF menjadi file terpisah secara lokal di peramban Anda dengan privasi penuh.',
        faqs: defaultFaqs('Pisah PDF', 'id'),
      },
      es: {
        title: 'Dividir PDF Online Gratis - Extraer Páginas de Forma Privada',
        h1: 'Divide Documentos PDF y Extrae Páginas Específicas',
        description: 'Separa páginas de PDF en archivos independientes o en un archivo ZIP directamente en tu navegador sin subir nada a internet.',
        faqs: defaultFaqs('Dividir PDF', 'es'),
      },
    },
  },
  {
    id: 'rotate-pdf',
    category: 'pdf',
    iconName: 'RotateCw',
    slugs: generateSlugsForId('rotate-pdf', {
      en: 'rotate-pdf',
      id: 'rotasi-pdf',
      es: 'rotar-pdf',
      fr: 'pivoter-pdf',
    }),
    seo: {
      en: {
        title: 'Rotate PDF Pages Online - Turn PDF 90/180/270 Degrees Locally',
        h1: 'Rotate PDF Pages & Fix Orientation',
        description: 'Rotate individual pages or all pages in your PDF document locally in seconds. Zero uploads required.',
        faqs: defaultFaqs('Rotate PDF', 'en'),
      },
      id: {
        title: 'Rotasi PDF Online Gratis - Putar Halaman PDF 90° atau 180°',
        h1: 'Putar Halaman PDF & Perbaiki Orientasi Dokumen',
        description: 'Putar halaman PDF yang terbalik atau miring secara permanen langsung di dalam peramban dengan cepat dan aman.',
        faqs: defaultFaqs('Rotasi PDF', 'id'),
      },
    },
  },

  {
    id: 'page-numbers',
    category: 'pdf',
    iconName: 'Hash',
    slugs: generateSlugsForId('page-numbers', {
      en: 'page-numbers',
      id: 'nomor-halaman-pdf',
      es: 'numeros-de-pagina-pdf',
    }),
    seo: {
      en: {
        title: 'Add Page Numbers to PDF - Custom Header & Footer Locally',
        h1: 'Insert Page Numbers into PDF Documents',
        description: 'Easily add clean, customizable page numbers to your PDF header or footer with full styling control in your browser.',
        faqs: defaultFaqs('Page Numbers', 'en'),
      },
      id: {
        title: 'Tambah Nomor Halaman PDF Online - Kustomisasi Header & Footer',
        h1: 'Sisipkan Nomor Halaman Rapi ke Dokumen PDF',
        description: 'Beri nomor halaman otomatis pada bagian atas atau bawah dokumen PDF Anda secara lokal dengan mudah dan cepat.',
        faqs: defaultFaqs('Nomor Halaman PDF', 'id'),
      },
    },
  },
  {
    id: 'watermark-pdf',
    category: 'pdf',
    iconName: 'Stamp',
    slugs: generateSlugsForId('watermark-pdf', {
      en: 'watermark-pdf',
      id: 'tanda-air-pdf',
      es: 'marca-de-agua-pdf',
    }),
    seo: {
      en: {
        title: 'Add Watermark to PDF - Stamp Custom Text or Image Locally',
        h1: 'Stamp Custom Text or Image Watermarks onto PDF',
        description: 'Protect your intellectual property by stamping transparent text or image watermarks across your PDF pages offline.',
        faqs: defaultFaqs('Watermark PDF', 'en'),
      },
      id: {
        title: 'Beri Tanda Air (Watermark) PDF Online - Stempel Teks / Gambar',
        h1: 'Tambahkan Stempel Tanda Air Transparan ke PDF',
        description: 'Lindungi hak cipta dokumen Anda dengan menyematkan tanda air teks kustom di seluruh halaman PDF secara privat.',
        faqs: defaultFaqs('Tanda Air PDF', 'id'),
      },
    },
  },

];

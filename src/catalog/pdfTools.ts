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
  {
    id: 'remove-pdf',
    category: 'pdf',
    iconName: 'Trash2',
    slugs: generateSlugsForId('remove-pdf', {
      en: 'remove-pages-pdf',
      id: 'hapus-halaman-pdf',
    }),
    seo: {
      en: {
        title: 'Remove PDF Pages Online - Delete Pages from PDF Locally',
        h1: 'Remove Pages from PDF Instantly',
        description: 'Delete unwanted pages from your PDF file securely inside your browser.',
        faqs: defaultFaqs('Remove PDF Pages', 'en'),
      },
      id: {
        title: 'Hapus Halaman PDF Online - Hapus Page PDF Gratis Tanpa Server',
        h1: 'Hapus Halaman PDF dengan Cepat & Aman',
        description: 'Pilih dan hapus halaman yang tidak diinginkan dari dokumen PDF Anda secara lokal.',
        faqs: defaultFaqs('Hapus Halaman PDF', 'id'),
      },
    },
  },
  {
    id: 'organize-pdf',
    category: 'pdf',
    iconName: 'LayoutList',
    slugs: generateSlugsForId('organize-pdf', {
      en: 'organize-pdf',
      id: 'sisip-halaman-pdf',
    }),
    seo: {
      en: {
        title: 'Organize PDF Online - Insert Pages into PDF Locally',
        h1: 'Insert Pages into PDF Precisely',
        description: 'Insert another PDF file at a specific page index securely inside your browser.',
        faqs: defaultFaqs('Organize PDF', 'en'),
      },
      id: {
        title: 'Sisipkan Halaman PDF Online - Extract & Insert Page PDF',
        h1: 'Sisipkan Halaman PDF di Posisi Spesifik',
        description: 'Sisipkan dokumen PDF tambahan ke halaman tertentu pada PDF utama Anda tanpa batasan.',
        faqs: defaultFaqs('Sisip Halaman PDF', 'id'),
      },
    },
  },
  {
    id: 'sign-pdf',
    category: 'pdf',
    iconName: 'PenTool',
    slugs: generateSlugsForId('sign-pdf', {
      en: 'sign-pdf',
      id: 'tanda-tangan-pdf',
    }),
    seo: {
      en: {
        title: 'Sign PDF Online - Add Electronic Signature to PDF',
        h1: 'E-Sign PDF Documents Locally',
        description: 'Draw, upload, or generate an electronic signature and add it to your PDF.',
        faqs: defaultFaqs('Sign PDF', 'en'),
      },
      id: {
        title: 'Tanda Tangan PDF Online - E-Sign PDF Gratis & Privat',
        h1: 'Bubuhkan Tanda Tangan Elektronik ke PDF',
        description: 'Gambar, ketik, atau unggah tanda tangan elektronik Anda dan letakkan di dokumen PDF secara lokal.',
        faqs: defaultFaqs('Tanda Tangan PDF', 'id'),
      },
    },
  },
  {
    id: 'protect-pdf',
    category: 'pdf',
    iconName: 'Lock',
    slugs: generateSlugsForId('protect-pdf', {
      en: 'protect-pdf',
      id: 'kunci-pdf',
    }),
    seo: {
      en: {
        title: 'Protect PDF Online - Password Protect PDF Locally',
        h1: 'Encrypt & Password Protect PDF Documents',
        description: 'Secure your PDF files with AES-256 encryption and password protection locally in your browser.',
        faqs: defaultFaqs('Protect PDF', 'en'),
      },
      id: {
        title: 'Kunci PDF Online - Enkripsi PDF & Beri Kata Sandi Secara Lokal',
        h1: 'Amankan Dokumen PDF dengan Kata Sandi',
        description: 'Lindungi file PDF Anda dari akses tidak sah dengan enkripsi AES-256 tingkat tinggi langsung di peramban Anda.',
        faqs: defaultFaqs('Kunci PDF', 'id'),
      },
    },
  },
  {
    id: 'unlock-pdf',
    category: 'pdf',
    iconName: 'Unlock',
    slugs: generateSlugsForId('unlock-pdf', {
      en: 'unlock-pdf',
      id: 'buka-kunci-pdf',
    }),
    seo: {
      en: {
        title: 'Unlock PDF Online - Remove PDF Password Locally',
        h1: 'Unlock Password Protected PDF Documents',
        description: 'Remove password and encryption from your PDF files instantly in your browser.',
        faqs: defaultFaqs('Unlock PDF', 'en'),
      },
      id: {
        title: 'Buka Kunci PDF Online - Hapus Kata Sandi PDF Gratis',
        h1: 'Buka File PDF yang Dikunci Kata Sandi',
        description: 'Hapus pengaman dan kata sandi dari dokumen PDF Anda secara instan dengan privasi terjamin 100%.',
        faqs: defaultFaqs('Buka Kunci PDF', 'id'),
      },
    },
  },
  {
    id: 'crop-pdf',
    category: 'pdf',
    iconName: 'Crop',
    slugs: generateSlugsForId('crop-pdf', {
      en: 'crop-pdf',
      id: 'potong-margin-pdf',
    }),
    seo: {
      en: {
        title: 'Crop PDF Online - Remove Margins from PDF Locally',
        h1: 'Crop PDF Pages Instantly',
        description: 'Remove white margins or cut PDF pages to a specific size locally in your browser.',
        faqs: defaultFaqs('Crop PDF', 'en'),
      },
      id: {
        title: 'Potong Margin PDF Online - Crop Halaman PDF Gratis',
        h1: 'Potong Margin & Area Halaman PDF',
        description: 'Pangkas pinggiran putih pada jurnal atau dokumen PDF Anda agar lebih nyaman dibaca di tablet atau HP.',
        faqs: defaultFaqs('Crop PDF', 'id'),
      },
    },
  },
  {
    id: 'extract-images-pdf',
    category: 'pdf',
    iconName: 'Images',
    slugs: generateSlugsForId('extract-images-pdf', {
      en: 'extract-images-from-pdf',
      id: 'ambil-gambar-dari-pdf',
    }),
    seo: {
      en: {
        title: 'Extract Images from PDF - Save All Pictures from PDF',
        h1: 'Extract Images & Photos from PDF',
        description: 'Instantly scan your PDF and extract all embedded images as high-quality JPG/PNG files locally.',
        faqs: defaultFaqs('Extract Images', 'en'),
      },
      id: {
        title: 'Ambil Gambar dari PDF Online - Ekstrak Foto dari PDF',
        h1: 'Ekstrak Seluruh Gambar dari PDF',
        description: 'Ambil dan simpan semua foto, grafik, atau logo dari dokumen PDF Anda menjadi file gambar terpisah (ZIP).',
        faqs: defaultFaqs('Ekstrak Gambar', 'id'),
      },
    },
  },
  {
    id: 'grayscale-pdf',
    category: 'pdf',
    iconName: 'Contrast',
    slugs: generateSlugsForId('grayscale-pdf', {
      en: 'convert-pdf-to-grayscale',
      id: 'ubah-pdf-jadi-hitam-putih',
    }),
    seo: {
      en: {
        title: 'Convert PDF to Grayscale - Black and White PDF Online',
        h1: 'Make PDF Black and White',
        description: 'Convert colored PDF documents to grayscale instantly in your browser to save printing ink.',
        faqs: defaultFaqs('Grayscale PDF', 'en'),
      },
      id: {
        title: 'Ubah PDF Jadi Hitam Putih - Grayscale PDF Gratis',
        h1: 'Ubah PDF Berwarna Menjadi Hitam Putih',
        description: 'Konversi dokumen berwarna Anda menjadi PDF hitam putih (grayscale) secara privat untuk menghemat tinta cetak.',
        faqs: defaultFaqs('Grayscale PDF', 'id'),
      },
    },
  }
];

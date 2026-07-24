import type { ToolDefinition } from './types';
import { generateSlugsForId, defaultFaqs } from './types';

export const officeTools: ToolDefinition[] = [
  /*
  {
    id: 'word-to-pdf',
    category: 'office',
    iconName: 'FileText',
    slugs: generateSlugsForId('word-to-pdf', { en: 'word-to-pdf', id: 'word-ke-pdf', es: 'word-a-pdf', fr: 'word-en-pdf', de: 'word-in-pdf', pt: 'word-para-pdf', it: 'word-in-pdf', nl: 'word-naar-pdf' }),
    seo: {
      en: {
        title: 'Convert Word to PDF Online - DOCX to PDF Locally | Zero Upload',
        h1: 'Convert Microsoft Word (DOCX) to PDF Instantly',
        description: 'Turn your DOCX and DOC documents into pixel-perfect PDF files entirely in your browser without uploading to any server.',
        faqs: defaultFaqs('Word to PDF', 'en'),
      },
      id: {
        title: 'Konversi Word ke PDF Online Gratis - DOCX ke PDF Tanpa Unggah',
        h1: 'Ubah File Microsoft Word (DOCX) Menjadi PDF Presisi',
        description: 'Terjemahkan dokumen pengolah kata Word Anda menjadi format PDF siap cetak dengan mempertahankan tata letak asli secara lokal.',
        faqs: defaultFaqs('Word ke PDF', 'id'),
      },
      es: {
        title: 'Convertir Word a PDF Online Gratis - DOCX a PDF de Forma Privada',
        h1: 'Convierte Documentos Microsoft Word (DOCX) a PDF',
        description: 'Transforma tus archivos DOCX en documentos PDF perfectamente formateados y 100% seguros dentro de tu navegador.',
        faqs: defaultFaqs('Word a PDF', 'es'),
      },
    },
  },
  */
  {
    id: 'excel-to-pdf',
    category: 'office',
    iconName: 'FileSpreadsheet',
    slugs: generateSlugsForId('excel-to-pdf', { en: 'excel-to-pdf', id: 'excel-ke-pdf', es: 'excel-a-pdf', fr: 'excel-en-pdf', de: 'excel-in-pdf', pt: 'excel-para-pdf', it: 'excel-in-pdf', nl: 'excel-naar-pdf' }),
    seo: {
      en: {
        title: 'Convert Excel to PDF Online - XLSX & XLS to PDF Locally',
        h1: 'Convert Microsoft Excel Spreadsheets to PDF',
        description: 'Transform spreadsheets and financial data into clean, printable PDF tables offline in your browser.',
        faqs: defaultFaqs('Excel to PDF', 'en'),
      },
      id: {
        title: 'Konversi Excel ke PDF Online - Lembar Sebar XLSX ke PDF',
        h1: 'Ubah Tabel Microsoft Excel (XLSX) Menjadi Dokumen PDF',
        description: 'Konversi data keuangan dan tabel lembar kerja Excel menjadi PDF rapi tanpa merusak format kolom di dalam peramban.',
        faqs: defaultFaqs('Excel ke PDF', 'id'),
      },
    },
  },
  {
    id: 'ppt-to-pdf',
    category: 'office',
    iconName: 'Presentation',
    slugs: generateSlugsForId('ppt-to-pdf', { en: 'ppt-to-pdf', id: 'ppt-ke-pdf', es: 'ppt-a-pdf', fr: 'ppt-en-pdf', de: 'ppt-in-pdf', pt: 'ppt-para-pdf', it: 'ppt-in-pdf', nl: 'ppt-naar-pdf' }),
    seo: {
      en: {
        title: 'Convert PowerPoint to PDF - PPTX Slides to PDF Locally',
        h1: 'Convert PowerPoint Presentations to High-Res PDF Slides',
        description: 'Save PPTX presentation slides as universal PDF documents for easy sharing and printing without server uploads.',
        faqs: defaultFaqs('PowerPoint to PDF', 'en'),
      },
      id: {
        title: 'Konversi PowerPoint ke PDF Online - Slide PPTX ke PDF',
        h1: 'Ubah Presentasi PowerPoint Menjadi Dokumen PDF Universal',
        description: 'Simpan slide presentasi Anda ke dalam format PDF resolusi tinggi agar tidak berantakan saat dibuka di perangkat lain.',
        faqs: defaultFaqs('PowerPoint ke PDF', 'id'),
      },
    },
  },
  {
    id: 'txt-to-pdf',
    category: 'office',
    iconName: 'AlignLeft',
    slugs: generateSlugsForId('txt-to-pdf', { en: 'txt-to-pdf', id: 'teks-ke-pdf', es: 'texto-a-pdf', fr: 'texte-en-pdf', de: 'text-in-pdf', pt: 'texto-para-pdf', it: 'testo-in-pdf', nl: 'tekst-naar-pdf' }),
    seo: {
      en: {
        title: 'Convert TXT to PDF Online - Plain Text to PDF Document',
        h1: 'Convert Plain Text Files (TXT) into Formatted PDFs',
        description: 'Quickly turn plain text files or code logs into well-structured, readable PDF documents instantly in your browser.',
        faqs: defaultFaqs('TXT to PDF', 'en'),
      },
      id: {
        title: 'Konversi Teks Mentah (TXT) ke PDF Online - Cepat & Rapi',
        h1: 'Ubah Berkas Teks (TXT) Menjadi Dokumen PDF Siap Pakai',
        description: 'Konversi catatan atau file teks mentah Anda ke format PDF dengan margin, ukuran huruf, dan tampilan yang profesional.',
        faqs: defaultFaqs('TXT ke PDF', 'id'),
      },
    },
  },

  /*
  {
    id: 'pdf-to-word',
    category: 'office',
    iconName: 'FileText',
    slugs: generateSlugsForId('pdf-to-word', {
      en: 'pdf-to-word',
      id: 'pdf-ke-word',
      es: 'pdf-a-word',
    }),
    seo: {
      en: {
        title: 'Free PDF to Word Converter (.docx) - 100% Offline Client-Side',
        h1: 'Convert PDF to Editable Word DOCX in Your Browser',
        description: 'Extract exact text, layout runs, and paragraphs from any PDF into a clean Microsoft Word (.docx) file directly inside browser memory.',
        faqs: defaultFaqs('PDF to Word Converter', 'en'),
      },
      id: {
        title: 'Konversi PDF ke Word Online Gratis (.docx) - 100% Offline Wasm',
        h1: 'Ubah PDF Menjadi Dokumen Word DOCX yang Bisa Diedit',
        description: 'Ekstrak teks, paragraf, dan tata letak dari berkas PDF ke file Microsoft Word (.docx) berstruktur rapi langsung di RAM komputer Anda.',
        faqs: defaultFaqs('Konversi PDF ke Word', 'id'),
      },
      es: {
        title: 'Convertir PDF a Word Gratis (.docx) - 100% Client-Side',
        h1: 'Convierte PDF en Archivos de Word DOCX Editables',
        description: 'Extrae texto exacto y pArrafos de archivos PDF en documentos de Microsoft Word (.docx) directamente en tu navegador offline.',
        faqs: defaultFaqs('PDF a Word', 'es'),
      },
    },
  },
  */
  {
    id: 'pdf-to-ppt',
    category: 'office',
    iconName: 'Presentation',
    slugs: generateSlugsForId('pdf-to-ppt', {
      en: 'pdf-to-ppt',
      id: 'pdf-ke-ppt',
      es: 'pdf-a-ppt',
    }),
    seo: {
      en: {
        title: 'Free PDF to PowerPoint Converter (.pptx) - Zero Uploads',
        h1: 'Convert PDF to PowerPoint Presentation Slides Offline',
        description: 'Turn your multi-page PDF documents into editable PowerPoint (.pptx) slides with high fidelity inside browser RAM.',
        faqs: defaultFaqs('PDF to PPTX Converter', 'en'),
      },
      id: {
        title: 'Konversi PDF ke PowerPoint Online Gratis (.pptx) - Tanpa Server',
        h1: 'Ubah PDF Menjadi Slide Presentasi PowerPoint (.pptx)',
        description: 'Konversi setiap halaman PDF Anda menjadi slide presentasi Microsoft PowerPoint (.pptx) dengan presisi tinggi di memori lokal.',
        faqs: defaultFaqs('Konversi PDF ke PPTX', 'id'),
      },
      es: {
        title: 'Convertir PDF a PowerPoint Gratis (.pptx) - Sin Subir Archivos',
        h1: 'Convierte PDF en Diapositivas de PowerPoint (.pptx)',
        description: 'Transforma pAginas PDF en diapositivas de presentaciA3n editables de PowerPoint (.pptx) de forma local en tu navegador.',
        faqs: defaultFaqs('PDF a PPTX', 'es'),
      },
    },
  },
  {
    id: 'csv-to-excel',
    category: 'office',
    iconName: 'Table',
    slugs: generateSlugsForId('csv-to-excel', {
      en: 'csv-to-excel',
      id: 'csv-ke-excel',
      es: 'csv-a-excel',
    }),
    seo: {
      en: {
        title: 'Free CSV to Excel Converter (.xlsx) - Instant Browser Engine',
        h1: 'Convert Comma Separated CSV to Microsoft Excel Spreadsheet (.xlsx)',
        description: 'Turn raw CSV files into properly formatted Excel spreadsheets with multi-sheet support and zero data loss offline.',
        faqs: defaultFaqs('CSV to Excel Converter', 'en'),
      },
      id: {
        title: 'Konversi CSV ke Excel Gratis (.xlsx) - Cepat & Offline Wasm',
        h1: 'Ubah File Data CSV Menjadi Spreadsheet Microsoft Excel (.xlsx)',
        description: 'Konversi data mentah CSV ke dalam buku kerja Microsoft Excel (.xlsx) resmi dengan tata letak kolom yang rapi tanpa koneksi internet.',
        faqs: defaultFaqs('Konversi CSV ke Excel', 'id'),
      },
      es: {
        title: 'Convertir CSV a Excel Gratis (.xlsx) - Motor SheetJS Offline',
        h1: 'Convierte Archivos CSV en Hojas de CAlculo de Excel (.xlsx)',
        description: 'Transforma tus datos CSV en libros de Microsoft Excel perfectamente estructurados directamente en el navegador.',
        faqs: defaultFaqs('CSV a Excel', 'es'),
      },
    },
  },
  {
    id: 'excel-to-csv',
    category: 'office',
    iconName: 'FileSpreadsheet',
    slugs: generateSlugsForId('excel-to-csv', {
      en: 'excel-to-csv',
      id: 'excel-ke-csv',
      es: 'excel-a-csv',
    }),
    seo: {
      en: {
        title: 'Free Excel to CSV Converter (.xlsx to .csv) - Zero Uploads',
        h1: 'Extract Excel Worksheets to Standard UTF-8 CSV Files',
        description: 'Quickly export data from Microsoft Excel spreadsheets (.xlsx, .xls) into universal CSV format entirely in your browser.',
        faqs: defaultFaqs('Excel to CSV Converter', 'en'),
      },
      id: {
        title: 'Konversi Excel ke CSV Gratis (.xlsx ke .csv) - Tanpa Unggahan',
        h1: 'Ekstrak Tabel Excel Menjadi Berkas Teks CSV Universal',
        description: 'Ekspor data dari buku kerja Microsoft Excel (.xlsx/.xls) ke format teks berpemisah koma (CSV) berpresisi tinggi di memori perangkat Anda.',
        faqs: defaultFaqs('Konversi Excel ke CSV', 'id'),
      },
      es: {
        title: 'Convertir Excel a CSV Gratis (.xlsx a .csv) - Client-Side',
        h1: 'Extrae Hojas de CAlculo de Excel en Archivos CSV',
        description: 'Convierte instantAneamente tus libros de Excel en formato universal CSV con codificaciA3n UTF-8 en el navegador.',
        faqs: defaultFaqs('Excel a CSV', 'es'),
      },
    },
  }
];

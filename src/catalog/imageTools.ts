import type { ToolDefinition } from './types';
import { generateSlugsForId, defaultFaqs } from './types';

export const imageTools: ToolDefinition[] = [
  {
    id: 'image-to-pdf',
    category: 'image',
    iconName: 'Image',
    slugs: generateSlugsForId('image-to-pdf', {
      en: 'image-to-pdf',
      id: 'gambar-ke-pdf',
      es: 'imagen-a-pdf',
      fr: 'image-en-pdf',
      de: 'bild-in-pdf',
    }),
    seo: {
      en: {
        title: 'Convert JPG & PNG to PDF Online - Images to PDF Locally',
        h1: 'Convert PNG & JPG Images into Multi-Page PDF Documents',
        description: 'Combine photos, screenshots, or PNG/JPG images into a single clean PDF document locally without uploading.',
        faqs: defaultFaqs('Image to PDF', 'en'),
      },
      id: {
        title: 'Konversi Gambar PNG / JPG ke PDF Online Gratis - Satukan Foto',
        h1: 'Ubah Foto & Gambar (PNG/JPG) Menjadi Dokumen PDF',
        description: 'Satukan beberapa gambar atau foto hasil jepretan layar ke dalam satu file PDF bersusun rapi secara instan dan privat.',
        faqs: defaultFaqs('Gambar ke PDF', 'id'),
      },
      es: {
        title: 'Convertir JPG y PNG a PDF Online Gratis - Sin Subir Archivos',
        h1: 'Convierte Imágenes PNG y JPG en Documentos PDF',
        description: 'Une fotos, capturas o imágenes sueltas en un solo archivo PDF perfectamente maquetado en tu navegador.',
        faqs: defaultFaqs('Imagen a PDF', 'es'),
      },
    },
  },
  {
    id: 'pdf-to-image',
    category: 'image',
    iconName: 'Images',
    slugs: generateSlugsForId('pdf-to-image', {
      en: 'pdf-to-image',
      id: 'pdf-ke-gambar',
      es: 'pdf-a-imagen',
    }),
    seo: {
      en: {
        title: 'Convert PDF to JPG/PNG Images Online - Extract Pages to ZIP',
        h1: 'Extract PDF Pages as High-Resolution PNG or JPG Images',
        description: 'Rasterize PDF pages into crystal-clear PNG/JPG images locally. Download individually or as a high-speed ZIP archive.',
        faqs: defaultFaqs('PDF to Image', 'en'),
      },
      id: {
        title: 'Konversi PDF ke Gambar PNG / JPG Online - Unduh ZIP Instan',
        h1: 'Ekstrak Halaman PDF Menjadi Gambar Resolusi Tinggi',
        description: 'Ubah setiap halaman dokumen PDF menjadi file gambar PNG atau JPG berkualitas tinggi yang dapat diunduh dalam satu arsip ZIP.',
        faqs: defaultFaqs('PDF ke Gambar', 'id'),
      },
    },
  },

];

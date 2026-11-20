export type ToolCategory = 'pdf' | 'compress' | 'office' | 'image' | 'ocr';

export interface ToolFaqItem {
  q: string;
  a: string;
}

export interface LocalizedSeoData {
  title: string;
  h1: string;
  description: string;
  faqs: ToolFaqItem[];
}

export interface ToolDefinition {
  id: string;
  category: ToolCategory;
  iconName: string;
  slugs: Record<string, string>;
  seo: Record<string, LocalizedSeoData>;
}

import { toolSlugs } from '../i18n/slugTranslations';

export const generateSlugsForId = (id: string, overrides: Record<string, string> = {}): Record<string, string> => {
  const codes = [
    'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
    'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
    'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
  ];
  const result: Record<string, string> = {};
  for (const code of codes) {
    result[code] = overrides[code] || toolSlugs[id]?.[code] || id;
  }
  return result;
};

export const defaultFaqs = (toolName: string, lang: string): ToolFaqItem[] => {
  if (lang === 'id') {
    return [
      {
        q: `Apakah alat ${toolName} ini gratis digunakan?`,
        a: `Ya! Alat ${toolName} kami menyediakan paket Free Starter gratis (hingga 10 berkas per batch) tanpa perlu kartu kredit atau komitmen biaya bulanan. Untuk pemrosesan batch tak terbatas (100+ berkas) dan kustomisasi nama berkas output, tersedia opsi Founder Lifetime Pass.`,
      },
      {
        q: `Apakah dokumen saya diunggah ke server awan?`,
        a: `Tidak. Berbeda dari platform konvensional, semua pemrosesan berkas dieksekusi di dalam RAM peramban Anda menggunakan teknologi WebAssembly. Dokumen Anda tidak pernah menyentuh server kami.`,
      },
      {
        q: `Apakah kualitas dokumen asli tetap terjaga?`,
        a: `Tentu. Algoritma pemrosesan biner kami memastikan resolusi vektor, teks, dan tata letak dokumen asli tetap utuh presisi tanpa distorsi.`,
      },
    ];
  }
  if (lang === 'es') {
    return [
      {
        q: `¿Es gratuita esta herramienta de ${toolName}?`,
        a: `¡Sí! Nuestra herramienta ofrece un plan Free Starter gratuito (hasta 10 archivos por lote) sin necesidad de tarjeta de crédito ni suscripciones obligatorias. También disponemos de un Founder Lifetime Pass para procesamiento por lotes ilimitado (más de 100 archivos) y personalización del nombre de salida.`,
      },
      {
        q: `¿Mis documentos se suben a algún servidor?`,
        a: `No. A diferencia de otras webs, todo el procesamiento se ejecuta localmente en la memoria RAM de tu navegador gracias a WebAssembly. Tus datos nunca salen de tu ordenador.`,
      },
      {
        q: `¿Se mantiene la calidad original del documento?`,
        a: `Absolutamente. Nuestros motores binarios conservan los vectores, fuentes y formato original con máxima precisión.`,
      },
    ];
  }
  return [
    {
      q: `Is this ${toolName} tool free to use?`,
      a: `Yes! Our ${toolName} tool includes a generous Free Starter plan (up to 10 files per batch) with no credit card required to start. For unlimited batch processing (100+ files) and custom output renaming, an affordable Founder Lifetime Pass is available.`,
    },
    {
      q: `Are my private documents uploaded to remote cloud servers?`,
      a: `No. Unlike traditional cloud-based aggregators, all file processing is executed 100% locally in your browser memory using WebAssembly C/C++ libraries. Your files never cross the internet.`,
    },
    {
      q: `Will the original formatting and visual quality be preserved?`,
      a: `Yes. Our low-level binary manipulation engines ensure that vector elements, fonts, tables, and image fidelity remain intact and pixel-perfect.`,
    },
  ];
};

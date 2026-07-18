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

export const generateSlugsForId = (id: string, overrides: Record<string, string> = {}): Record<string, string> => {
  const codes = [
    'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
    'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
    'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms',
  ];
  const result: Record<string, string> = {};
  for (const code of codes) {
    result[code] = overrides[code] || id;
  }
  return result;
};

export const defaultFaqs = (toolName: string, lang: string): ToolFaqItem[] => {
  if (lang === 'id') {
    return [
      {
        q: `Apakah alat ${toolName} ini gratis dan tanpa batas?`,
        a: `Ya! Alat ${toolName} kami 100% gratis tanpa batasan kuota harian atau pembatasan ukuran berkas karena pemrosesan dilakukan di komputer Anda sendiri.`,
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
        q: `¿Es esta herramienta de ${toolName} gratuita y sin límites?`,
        a: `¡Sí! Nuestra herramienta es 100% gratuita y no tiene límites artificiales de uso ni de tamaño, ya que tu propio navegador realiza todo el cálculo.`,
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
      q: `Is this ${toolName} tool completely free and unlimited?`,
      a: `Yes! Our ${toolName} tool is 100% free with no daily usage caps, file size limits, or registration required because your device CPU handles the conversion directly.`,
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

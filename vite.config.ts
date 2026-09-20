import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normId = id.replace(/\\/g, '/');
          if (normId.includes('src/i18n/translations.ts')) return 'i18n-translations';
          if (normId.includes('src/i18n/catalogTranslations.ts')) return 'i18n-catalog';
          if (normId.includes('src/i18n/researchTranslations.ts')) return 'i18n-research';
          if (normId.includes('src/i18n/editorTranslations.ts')) return 'i18n-editor';
          if (id.includes('node_modules')) {
            if (id.includes('jspdf')) return 'vendor-jspdf';
            if (id.includes('fflate')) return 'vendor-fflate';
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
            if (id.includes('pdf-lib')) return 'vendor-pdflib';
            if (id.includes('xlsx')) return 'vendor-xlsx';
            if (id.includes('tesseract')) return 'vendor-tesseract';
            if (id.includes('docx-preview')) return 'vendor-docx';
            if (id.includes('html2canvas')) return 'vendor-html2canvas';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
          }
        }
      }
    }
  }
})

const fs = require('fs');

const filesToPatch = [
  'src/engines/pdf/redactPdf.ts',
  'src/engines/pdf/scanToPdf.ts',
  'src/engines/pdf/comparePdf.ts',
  'src/engines/imageEngine.ts',
  'src/engines/compressEngine.ts'
];

for (const file of filesToPatch) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Add import if missing
    if (!code.includes('import pdfWorkerUrl')) {
      code = "import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';\n" + code;
    }
    
    // Replace CDN url
    code = code.replace(
      /pdfjsLib\.GlobalWorkerOptions\.workerSrc = `https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/pdf\.js\/\$\{pdfjsLib\.version\}\/pdf\.worker\.min\.mjs`;/g,
      "pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;"
    );
    
    fs.writeFileSync(file, code);
    console.log('Patched', file);
  }
}

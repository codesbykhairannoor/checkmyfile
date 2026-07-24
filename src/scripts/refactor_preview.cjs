const fs = require('fs');

let content = fs.readFileSync('src/components/common/DocumentLivePreview.tsx', 'utf8');

// Remove static imports
content = content.replace(/import \* as pdfjsLib from 'pdfjs-dist';\n/g, '');
content = content.replace(/import \{ renderAsync \} from 'docx-preview';\n/g, '');
content = content.replace(/pdfjsLib\.GlobalWorkerOptions\.workerSrc = [^;]+;\n/g, '');

// Replace dynamic usages
// pdfjsLib.getDocument -> (await import('pdfjs-dist')).getDocument
// renderAsync -> (await import('docx-preview')).renderAsync
// Also handle the workerSrc assignment right before getDocument.

content = content.replace(/const pdfPromise = pdfjsLib\.getDocument/g, 
  `const pdfjsLib = await import('pdfjs-dist');\n          pdfjsLib.GlobalWorkerOptions.workerSrc = \`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjsLib.version}/pdf.worker.min.mjs\`;\n          const pdfPromise = pdfjsLib.getDocument`);

content = content.replace(/await renderAsync\(/g, "await (await import('docx-preview')).renderAsync(");

fs.writeFileSync('src/components/common/DocumentLivePreview.tsx', content);
console.log('DocumentLivePreview.tsx refactored!');

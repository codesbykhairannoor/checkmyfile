const fs = require('fs');

// 1. Fix useDocumentProcessor.ts
let useDoc = fs.readFileSync('src/hooks/useDocumentProcessor.ts', 'utf8');
useDoc = useDoc.replace(/pdfEngine\.rotatePdf/g, "(await import('../engines/pdfEngine')).rotatePdf");
fs.writeFileSync('src/hooks/useDocumentProcessor.ts', useDoc);
console.log('useDocumentProcessor.ts fixed');

// 2. Fix DocumentLivePreview.tsx
let docPreview = fs.readFileSync('src/components/common/DocumentLivePreview.tsx', 'utf8');
docPreview = docPreview.replace(/import \* as pdfjsLib from 'pdfjs-dist';\r?\n/g, '');
docPreview = docPreview.replace(/import \{ renderAsync \} from 'docx-preview';\r?\n/g, '');
fs.writeFileSync('src/components/common/DocumentLivePreview.tsx', docPreview);
console.log('DocumentLivePreview.tsx fixed');

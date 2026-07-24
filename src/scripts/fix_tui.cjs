const fs = require('fs');

const errors = [
  'src/components/tools/ComparePdfEditor.tsx',
  'src/components/tools/CropPdfEditor.tsx',
  'src/components/tools/EditPdfEditor.tsx',
  'src/components/tools/ExtractImagesEditor.tsx',
  'src/components/tools/GenericConvertEditor.tsx',
  'src/components/tools/GrayscalePdfEditor.tsx',
  'src/components/tools/MergePdfEditor.tsx',
  'src/components/tools/OrganizePdfEditor.tsx',
  'src/components/tools/PageNumbersPdfEditor.tsx',
  'src/components/tools/PdfToImageEditor.tsx',
  'src/components/tools/ProtectPdfEditor.tsx',
  'src/components/tools/RedactPdfEditor.tsx',
  'src/components/tools/RemoveMetadataEditor.tsx',
  'src/components/tools/RemovePdfEditor.tsx',
  'src/components/tools/ResizePdfEditor.tsx',
  'src/components/tools/ReversePdfEditor.tsx',
  'src/components/tools/RotatePdfEditor.tsx',
  'src/components/tools/ScanToPdfEditor.tsx',
  'src/components/tools/SignPdfEditor.tsx',
  'src/components/tools/SplitPdfEditor.tsx',
  'src/components/tools/UnlockPdfEditor.tsx',
  'src/components/tools/WatermarkPdfEditor.tsx'
];

errors.forEach(f => {
  if (!f) return;
  const code = fs.readFileSync(f, 'utf8');
  const newCode = code.replace(/\s*tUi\?: Record<string, string>;/, '').replace(/\s*tUi = {},/, '');
  fs.writeFileSync(f, newCode);
});

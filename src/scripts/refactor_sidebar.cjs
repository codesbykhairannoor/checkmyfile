const fs = require('fs');

let content = fs.readFileSync('src/components/tools/ToolSidebar.tsx', 'utf8');

// Replace all imports of Editor components with React.lazy
const editors = [
  'RotatePdfEditor', 'WatermarkPdfEditor', 'PageNumbersPdfEditor', 'SplitPdfEditor',
  'MergePdfEditor', 'CompressPdfEditor', 'PdfToImageEditor', 'GenericConvertEditor',
  'RemovePdfEditor', 'OrganizePdfEditor', 'SignPdfEditor', 'ProtectPdfEditor',
  'UnlockPdfEditor', 'CropPdfEditor', 'ExtractImagesEditor', 'GrayscalePdfEditor',
  'ScanToPdfEditor', 'RemoveMetadataEditor', 'ComparePdfEditor', 'RedactPdfEditor',
  'ReversePdfEditor', 'ResizePdfEditor', 'EditPdfEditor'
];

editors.forEach(editor => {
  const regex = new RegExp(`import \\{ ${editor} \\} from '\\.\\/${editor}';`, 'g');
  content = content.replace(regex, `const ${editor} = React.lazy(() => import('./${editor}').then(m => ({ default: m.${editor} })));`);
});

// Wrap the return block in Suspense
content = content.replace(
  'return (\n    <div style={{ flex: 1, padding: 24, overflowY: \'auto\'',
  'return (\n    <React.Suspense fallback={<div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>Loading module...</div>}>\n      <div style={{ flex: 1, padding: 24, overflowY: \'auto\''
);

// We need to find the matching closing div for the return block to close the suspense.
// Wait, the file ends with:
//     </div>
//   );
// };
content = content.replace(
  '    </div>\n  );\n};',
  '      </div>\n    </React.Suspense>\n  );\n};'
);

fs.writeFileSync('src/components/tools/ToolSidebar.tsx', content);
console.log('ToolSidebar.tsx refactored!');

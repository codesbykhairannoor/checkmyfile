const fs = require('fs');

let content = fs.readFileSync('src/components/common/DocumentLivePreview.tsx', 'utf8');

// Replace static imports with React.lazy
const previews = [
  'PdfPreview', 'OfficePreview', 'PptxPreview', 'SpreadsheetPreview'
];

previews.forEach(preview => {
  const regex = new RegExp(`import \\{ ${preview} \\} from '\\.\\.\\/preview\\/${preview}';`, 'g');
  content = content.replace(regex, `const ${preview} = React.lazy(() => import('../preview/${preview}').then(m => ({ default: m.${preview} })));`);
});

// Wrap the rendering of previews in Suspense
// The rendering happens in `renderPreviewContent()` which returns a JSX element based on file type.
// We can wrap the call to `renderPreviewContent()` inside the return statement of `DocumentLivePreview` with Suspense.
// Wait, `renderPreviewContent` is a function inside `DocumentLivePreview`.
// Let's wrap it where it is called: {renderPreviewContent()}

content = content.replace(
  '{renderPreviewContent()}',
  '<React.Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--text-muted)" }}>Loading Preview...</div>}>\n              {renderPreviewContent()}\n            </React.Suspense>'
);

fs.writeFileSync('src/components/common/DocumentLivePreview.tsx', content);
console.log('DocumentLivePreview.tsx React.lazy refactored!');

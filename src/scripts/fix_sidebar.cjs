const fs = require('fs');

let content = fs.readFileSync('src/components/tools/ToolSidebar.tsx', 'utf8');

// The file currently has an extra `</React.Suspense>` at the end. Let's add the opening tag right after `return (`.
content = content.replace(
  'return (\n    <div className="mobile-full-width"',
  'return (\n    <React.Suspense fallback={<div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>Loading module...</div>}>\n    <div className="mobile-full-width"'
);

fs.writeFileSync('src/components/tools/ToolSidebar.tsx', content);
console.log('ToolSidebar.tsx syntax fixed!');

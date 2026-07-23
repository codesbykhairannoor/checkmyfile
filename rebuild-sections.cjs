const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src', 'components', 'seo-sections', 'tools');
const mergePath = path.join(sectionsDir, 'MergePdfSections.tsx');
let mergeContent = fs.readFileSync(mergePath, 'utf8');

// Add floating objects to MergePdfHeroSection
const floatingObjects = `
      {/* Floating Objects */}
      <div className="floating-object hidden-mobile" style={{ position: 'absolute', top: '10%', left: '5%', width: 64, height: 64, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(6deg)', animation: 'float 6s ease-in-out infinite' }}>
        🚀
      </div>
      <div className="floating-object hidden-mobile" style={{ position: 'absolute', bottom: '15%', right: '8%', width: 80, height: 80, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(-12deg)', animation: 'float 8s ease-in-out infinite' }}>
        ✨
      </div>
      <div className="floating-object hidden-tablet" style={{ position: 'absolute', top: '20%', right: '12%', width: 56, height: 56, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid rgba(255,255,255,0.8)', zIndex: 20, transform: 'rotate(15deg)', animation: 'float 7s ease-in-out infinite reverse' }}>
        ⚡
      </div>
`;

// Insert floating objects and marginTop: 80
mergeContent = mergeContent.replace(
  `style={{ padding: '100px 24px', margin: '60px 0', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)' }}>`,
  `style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>${floatingObjects}`
);

// We also write the updated MergePdfSections.tsx
fs.writeFileSync(mergePath, mergeContent);

const tools = [
  { prefix: 'Split', icon: 'Scissors', id: 'split' },
  { prefix: 'PageNumbers', icon: 'FileDigit', id: 'page-numbers' },
  { prefix: 'Rotate', icon: 'RotateCw', id: 'rotate' }
];

for (const tool of tools) {
  let content = mergeContent;
  
  // Replace Merge with new prefix
  content = content.replace(/Merge/g, tool.prefix);
  
  // Replace lucide icon 'Combine' with new icon
  content = content.replace(/Combine/g, tool.icon);
  
  const destPath = path.join(sectionsDir, `${tool.prefix}PdfSections.tsx`.replace('PageNumbersPdf', 'PageNumbers'));
  
  fs.writeFileSync(destPath, content);
  console.log(`Successfully generated ${destPath}`);
}

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/preview/PdfPreview.tsx');
let code = fs.readFileSync(filePath, 'utf8');

const regex = /\{watermarkConfig && \([\s\S]*?\{watermarkConfig\.text\}[\s\S]*?<\/div>\s*\)\}/;

const replacement = `{watermarkConfig && (() => {
              const pos = watermarkConfig.position || 'center';
              const isRepeating = !!watermarkConfig.isRepeating;
              
              const alignMap: Record<string, string> = {
                'top-left': 'flex-start', 'top-center': 'flex-start', 'top-right': 'flex-start',
                'center-left': 'center', 'center': 'center', 'center-right': 'center',
                'bottom-left': 'flex-end', 'bottom-center': 'flex-end', 'bottom-right': 'flex-end'
              };
              const justifyMap: Record<string, string> = {
                'top-left': 'flex-start', 'center-left': 'flex-start', 'bottom-left': 'flex-start',
                'top-center': 'center', 'center': 'center', 'bottom-center': 'center',
                'top-right': 'flex-end', 'center-right': 'flex-end', 'bottom-right': 'flex-end'
              };

              const renderItem = (scaleFactor: number = 1) => (
                <div style={{
                  transform: \`rotate(\${watermarkConfig.rotation}deg) scale(\${watermarkConfig.scale * scaleFactor})\`,
                  opacity: watermarkConfig.opacity, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {watermarkConfig.type === 'image' && watermarkConfig.imageUrl ? (
                    <img src={watermarkConfig.imageUrl} alt="Watermark" style={{ width: isRepeating ? '70%' : '50%', height: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ 
                      color: watermarkConfig.color, 
                      fontSize: \`\${(Math.min(containerWidth || 600, containerHeight || 800) / (isRepeating ? 13 : 9))}px\`,
                      fontWeight: 'bold', whiteSpace: 'nowrap', fontFamily: 'Helvetica, Arial, sans-serif' 
                    }}>
                      {watermarkConfig.text || 'CONFIDENTIAL'}
                    </span>
                  )}
                </div>
              );

              if (isRepeating) {
                return (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)',
                    pointerEvents: 'none', overflow: 'hidden', zIndex: 20
                  }}>
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {renderItem(0.75)}
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div style={{
                  position: 'absolute', inset: 32,
                  display: 'flex',
                  alignItems: alignMap[pos] || 'center',
                  justifyContent: justifyMap[pos] || 'center',
                  pointerEvents: 'none', overflow: 'hidden', zIndex: 20
                }}>
                  {renderItem(1)}
                </div>
              );
            })()}`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully patched PdfPreview.tsx with watermark support!');
} else {
  console.error('Regex pattern not found in PdfPreview.tsx');
}

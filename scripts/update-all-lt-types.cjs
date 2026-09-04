const fs = require('fs');
const path = require('path');

const seoTools = [
  'crop-pdf-margins',
  'grayscale-pdf-for-printing',
  'remove-pdf-author-metadata',
  'extract-high-res-images-pdf',
  'compare-pdf-files-visually'
];

const localesDir = path.join(__dirname, '../src/locales/seo');

function updateJsonFiles() {
  for (const tool of seoTools) {
    const toolDir = path.join(localesDir, tool);
    if (!fs.existsSync(toolDir)) continue;

    const files = fs.readdirSync(toolDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(toolDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        let modified = false;
        if (data.sections && Array.isArray(data.sections)) {
          data.sections = data.sections.map(sec => {
            if (sec.type && typeof sec.type === 'string') {
              if (sec.type.includes('geo_targeting') && !sec.type.startsWith('lt_geo_targeting')) {
                sec.type = 'lt_geo_targeting';
                modified = true;
              }
              if (sec.type.includes('privacy_security') && !sec.type.startsWith('lt_privacy_security')) {
                sec.type = 'lt_privacy_security';
                modified = true;
              }
              if (sec.type.includes('performance') && !sec.type.startsWith('lt_performance')) {
                sec.type = 'lt_performance';
                modified = true;
              }
            }
            return sec;
          });
        }

        if (modified) {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        }
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err.message);
      }
    }
  }
  console.log('Finished updating section types for all long-tail pages!');
}

updateJsonFiles();

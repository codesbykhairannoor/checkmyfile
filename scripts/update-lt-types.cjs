const fs = require('fs');
const path = require('path');

const localesFolder = path.join(__dirname, '../src/locales/seo');

const mappings = {
  'crop-pdf-margins': { from: 'split_how_to_steps', to: 'lt_crop_margins_how_to_steps' },
  'grayscale-pdf-for-printing': { from: 'crop_how_to_steps', to: 'lt_grayscale_how_to_steps' },
  'remove-pdf-author-metadata': { from: 'merge_how_to_steps', to: 'lt_remove_metadata_how_to_steps' },
  'extract-high-res-images-pdf': { from: 'compress_how_to_steps', to: 'lt_extract_images_how_to_steps' },
  'compare-pdf-files-visually': { from: 'watermark_how_to_steps', to: 'lt_compare_pdf_how_to_steps' }
};

for (const [tool, mapTypes] of Object.entries(mappings)) {
  const toolDir = path.join(localesFolder, tool);
  if (!fs.existsSync(toolDir)) {
    console.warn(`Tool directory not found: ${toolDir}`);
    continue;
  }

  const files = fs.readdirSync(toolDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(toolDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let modified = false;

      if (data.sections && Array.isArray(data.sections)) {
        for (const section of data.sections) {
          if (section.type === mapTypes.from) {
            section.type = mapTypes.to;
            modified = true;
          }
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${tool}/${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${tool}/${file}:`, err);
    }
  }
}

console.log('Update complete.');

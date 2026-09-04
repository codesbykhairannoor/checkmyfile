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

const GEO_TYPES = [
  'geo_targeting', 'word_geo_targeting', 'excel_geo_targeting', 'ppt_geo_targeting',
  'image_geo_targeting', 'txt_geo_targeting', 'protect_geo_targeting', 'unlock_geo_targeting',
  'redact_geo_targeting', 'sign_geo_targeting', 'metadata_geo_targeting', 'rotate_geo_targeting',
  'watermark_geo_targeting', 'grayscale_geo_targeting', 'reverse_geo_targeting', 'resize_geo_targeting',
  'pagenum_geo_targeting', 'organize_geo_targeting', 'scan_geo_targeting', 'ocr_geo_targeting',
  'compare_geo_targeting', 'edit_geo_targeting', 'csv_excel_geo_targeting', 'excel_csv_geo_targeting'
];

const PRIVACY_TYPES = [
  'privacy_security', 'word_privacy_security', 'excel_privacy_security', 'ppt_privacy_security',
  'image_privacy_security', 'txt_privacy_security', 'protect_privacy_security', 'unlock_privacy_security',
  'redact_privacy_security', 'sign_privacy_security', 'metadata_privacy_security', 'rotate_privacy_security',
  'watermark_privacy_security', 'grayscale_privacy_security', 'reverse_privacy_security', 'resize_privacy_security',
  'pagenum_privacy_security', 'organize_privacy_security', 'scan_privacy_security', 'ocr_privacy_security',
  'compare_privacy_security', 'edit_privacy_security', 'csv_excel_privacy_security', 'excel_csv_privacy_security'
];

const PERFORMANCE_TYPES = [
  'performance', 'word_performance', 'excel_performance', 'ppt_performance',
  'image_performance', 'txt_performance', 'protect_performance', 'unlock_performance',
  'redact_performance', 'sign_performance', 'metadata_performance', 'rotate_performance',
  'watermark_performance', 'grayscale_performance', 'reverse_performance', 'resize_performance',
  'pagenum_performance', 'organize_performance', 'scan_performance', 'ocr_performance',
  'compare_performance', 'edit_performance', 'csv_excel_performance', 'excel_csv_performance'
];

function getRandomType(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function restoreRandomLayouts() {
  for (const tool of seoTools) {
    const toolDir = path.join(localesDir, tool);
    if (!fs.existsSync(toolDir)) continue;

    // Pick 1 random type for each category for this specific TOOL.
    // That means all languages of THIS tool will share the same randomized layout 
    // to keep the pages consistent across locales, but uniquely randomized compared to other tools!
    const randomGeo = getRandomType(GEO_TYPES);
    const randomPrivacy = getRandomType(PRIVACY_TYPES);
    const randomPerf = getRandomType(PERFORMANCE_TYPES);

    const files = fs.readdirSync(toolDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(toolDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        let modified = false;
        if (data.sections && Array.isArray(data.sections)) {
          data.sections = data.sections.map(sec => {
            if (sec.type === 'lt_geo_targeting') {
              sec.type = randomGeo;
              modified = true;
            } else if (sec.type === 'lt_privacy_security') {
              sec.type = randomPrivacy;
              modified = true;
            } else if (sec.type === 'lt_performance') {
              sec.type = randomPerf;
              modified = true;
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
  console.log('Finished restoring randomized layout types for all long-tail pages!');
}

restoreRandomLayouts();

const fs = require('fs');
const path = require('path');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.tsx'));

const stringsToReplace = [
  "Interactive Compress",
  "Pilih tingkat kompresi. Live Preview akan mensimulasikan penurunan kualitas gambar.",
  "Extreme (Kecil)",
  "Kualitas terendah, ukuran terkecil",
  "Balanced (Rekomendasi)",
  "Kualitas bagus, ukuran optimal",
  "High (Terbaik)",
  "Kualitas tinggi, ukuran lumayan besar",
  "Kompres Sekarang",
  "Rotate Pages",
  "Split Pages",
  "Extract specific pages or ranges",
  "Split Now",
  "Crop Margins",
  "Remove Pages",
  "Pages to remove (e.g. 1, 3-5)",
  "Delete Pages",
  "Add Watermark",
  "Page Numbers",
  "Process Document",
  "Start Processing",
  "Convert Document"
];

files.forEach(f => {
  const p = path.join(dir, f);
  let code = fs.readFileSync(p, 'utf8');
  
  let modified = false;

  // Add tUi to props interface if not exists
  if (!code.includes('tUi?: Record<string, string>')) {
    code = code.replace(/(interface \w+Props \{)/, '$1\n  tUi?: Record<string, string>;');
    // Add tUi to destructured props
    code = code.replace(/(export const \w+: React\.FC<\w+Props> = \(\{\n?)/, '$1  tUi = {},\n');
    modified = true;
  }

  // Replace exact strings
  stringsToReplace.forEach(s => {
    // Escape string for regex
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Replace text inside elements e.g. >String<
    const regexText = new RegExp(`>\\s*${escaped}\\s*<`, 'g');
    if (regexText.test(code)) {
      code = code.replace(regexText, `>{tUi["${s}"] || '${s}'}<`);
      modified = true;
    }
    
    // Replace text in placeholder="..."
    const regexPlaceholder = new RegExp(`placeholder="${escaped}"`, 'g');
    if (regexPlaceholder.test(code)) {
      code = code.replace(regexPlaceholder, `placeholder={tUi["${s}"] || '${s}'}`);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(p, code);
    console.log(`Updated ${f}`);
  }
});

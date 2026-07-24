const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('src/scripts/ast_ui_strings.json', 'utf8'));

const filtered = raw.filter(s => {
  // Remove CSS-like
  if (s.includes('rgba')) return false;
  if (s.includes('var(')) return false;
  if (s.includes('px ')) return false;
  if (s.includes('image/')) return false;
  if (s.includes('spin 1s')) return false;
  if (s.includes('ease')) return false;
  
  return true;
});

fs.writeFileSync('src/scripts/ast_ui_strings.json', JSON.stringify(filtered, null, 2));
console.log('Filtered down to', filtered.length, 'strings');

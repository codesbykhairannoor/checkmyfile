const fs = require('fs');
const filePath = 'src/i18n/translations.ts';

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let inBlock = false;
let currentBlockKeys = new Set();
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^(?:export )?(?:const |interface )[a-zA-Z0-9_]+/) || line.match(/^\s*\}?,?'?[a-z]{2,3}(?:-[A-Za-z0-9]+)?'?:\s*\{/)) {
    inBlock = true;
    currentBlockKeys = new Set();
    newLines.push(line);
    continue;
  }
  
  if (inBlock && line.trim() === '}' || line.trim() === '},') {
    inBlock = false;
    newLines.push(line);
    continue;
  }
  
  if (inBlock) {
    const match = line.match(/^\s*([a-zA-Z0-9_]+)\??\s*:/);
    if (match) {
      const key = match[1];
      if (currentBlockKeys.has(key)) {
        console.log(`Removed duplicate key: ${key} on line ${i}`);
        // Skip adding this line to newLines
        continue;
      } else {
        currentBlockKeys.add(key);
      }
    }
  }
  
  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Deduplication complete.');

const fs = require('fs');
const path = require('path');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const strings = new Set();

files.forEach(f => {
  const code = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Extract text inside tags: > text <
  const tagRegex = />([^<>{]+)</g;
  let match;
  while ((match = tagRegex.exec(code)) !== null) {
    const text = match[1].trim();
    if (text.length > 2 && /[a-zA-Z]/.test(text) && text !== '&&' && text !== '||') {
      strings.add(text);
    }
  }

  // Extract strings in ternaries or direct strings: 'Memproses...'
  const stringRegex = /'([^'\\]+)'/g;
  while ((match = stringRegex.exec(code)) !== null) {
    const text = match[1].trim();
    // Only capture strings with words and spaces, indicating UI text, usually starts with uppercase
    if (text.length > 2 && /^[A-Z]/.test(text) && text.includes(' ')) {
      strings.add(text);
    }
    // specific keywords
    if (text.includes('Sekarang') || text.includes('Memproses') || text.includes('Menyimpan') || text.includes('Menganalisis')) {
      strings.add(text);
    }
  }
});

const ArrayStr = Array.from(strings);
console.log(JSON.stringify(ArrayStr, null, 2));

const fs = require('fs');
const path = require('path');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.tsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let code = fs.readFileSync(p, 'utf8');
  
  if (code.includes('tUi = {}') && !code.includes('void tUi;')) {
    code = code.replace(/(export const \w+: React\.FC<\w+Props> = \(\{\n[\s\S]*?\}\) => \{\n)/, '$1  void tUi;\n');
    fs.writeFileSync(p, code);
    console.log(`Fixed ${f}`);
  }
});

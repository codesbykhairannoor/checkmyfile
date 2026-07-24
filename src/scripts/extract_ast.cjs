const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const extractedStrings = new Set();

function visit(node) {
  // Extract JSX Text nodes
  if (ts.isJsxText(node)) {
    let text = node.getText().replace(/\s+/g, ' ').trim();
    if (text.length > 0 && text !== '{' && text !== '}' && text !== '&&') {
      extractedStrings.add(text);
    }
  }
  
  // Extract String Literals (can be inside JSX Attributes, JSX Expressions, Ternaries, etc.)
  if (ts.isStringLiteral(node)) {
    let text = node.text;
    if (text.length > 0) {
      // Filter out obvious code-like strings (like classNames, keys, formats, etc)
      const ignorePattern = /^(var|#|[0-9a-fA-F]{3,6}$|^btn-|^text-|^bg-|^flex|^w-|^h-|^col-|^px-|^py-|^mt-|^mb-|align-|justify-|items-|^[a-z]+(-[a-z]+)*$|\.tsx?$|\.css$)/;
      // Filter out common english code terms
      const codeTerms = ['auto', 'none', 'button', 'text', 'center', 'right', 'left', 'bottom', 'top', 'absolute', 'relative', 'transparent', 'white', 'black', 'solid', 'dashed', 'hidden', 'visible', 'block', 'flex', 'grid', 'normal', 'bold', 'italic', '100%', '0%', '0px', 'rgba', 'rgb'];
      
      if (!ignorePattern.test(text) && !codeTerms.includes(text)) {
        extractedStrings.add(text);
      }
    }
  }

  ts.forEachChild(node, visit);
}

files.forEach(f => {
  const p = path.join(dir, f);
  const code = fs.readFileSync(p, 'utf8');
  
  const sourceFile = ts.createSourceFile(
    f,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  
  visit(sourceFile);
});

// Write findings to a JSON file for easy review
const arr = Array.from(extractedStrings);
fs.writeFileSync('src/scripts/ast_strings.json', JSON.stringify(arr, null, 2));
console.log('Extracted', arr.length, 'strings to ast_strings.json');

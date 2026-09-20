import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

const toolsDir = path.resolve('src/components/tools');
const commonDir = path.resolve('src/components/common');

const targetFiles = [
  ...fs.readdirSync(toolsDir).map(f => path.join(toolsDir, f)),
  path.join(commonDir, 'DocumentLivePreview.tsx')
].filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

const collectedStrings = new Set<string>();

for (const file of targetFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);

  function visit(node: ts.Node) {
    // Collect JsxText
    if (ts.isJsxText(node)) {
      const text = node.getText(sourceFile).trim();
      if (text && text.length > 1 && !text.match(/^[{}\s\d+\-°%(),.:;]+$/)) {
        collectedStrings.add(text);
      }
    }
    // Collect StringLiteral in JSX attributes, tUi lookups, placeholders, titles
    if (ts.isStringLiteral(node)) {
      const text = node.text.trim();
      if (
        text &&
        text.length > 1 &&
        !text.startsWith('http') &&
        !text.startsWith('#') &&
        !text.startsWith('var(') &&
        !text.startsWith('rgba(') &&
        !text.includes('px') &&
        !text.includes('data:image') &&
        !text.match(/^[a-zA-Z0-9_\-]+$/) && // skip classnames / tool IDs
        !text.match(/^[\d+\-°%(),.:;]+$/)
      ) {
        collectedStrings.add(text);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

console.log(`Found ${collectedStrings.size} unique strings across editor components:`);
const sorted = Array.from(collectedStrings).sort();
console.log(JSON.stringify(sorted, null, 2));
fs.writeFileSync('scripts/extracted_editor_strings.json', JSON.stringify(sorted, null, 2));

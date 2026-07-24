const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const dir = 'src/components/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const stringsToReplace = new Set(JSON.parse(fs.readFileSync('src/scripts/ast_ui_strings.json', 'utf8')));

files.forEach(f => {
  const p = path.join(dir, f);
  let code = fs.readFileSync(p, 'utf8');
  
  const sourceFile = ts.createSourceFile(
    f,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  
  const edits = [];

  function visit(node) {
    if (ts.isJsxText(node)) {
      let rawText = node.getFullText();
      let trimmedText = node.getText().replace(/\s+/g, ' ').trim();
      if (stringsToReplace.has(trimmedText) && !rawText.includes('tUi[')) {
        // Find where the actual text starts and ends, to preserve surrounding whitespace if any
        // But for JSX text, it's easier to just replace the whole node text and wrap it in {}
        // JsxText nodes include their surrounding whitespace in getFullText().
        // To be safe, we replace the exact node text bounds.
        edits.push({
          start: node.getStart(),
          end: node.getEnd(),
          newText: `{tUi["${trimmedText.replace(/"/g, '\\"')}"] || "${trimmedText.replace(/"/g, '\\"')}"}`
        });
      }
    } else if (ts.isStringLiteral(node)) {
      let text = node.text;
      if (stringsToReplace.has(text)) {
        // Only replace if not already part of tUi["..."]
        // Check surrounding code manually using source offsets
        const surrounding = code.substring(Math.max(0, node.getStart() - 10), node.getEnd() + 10);
        if (!surrounding.includes('tUi[')) {
          // If it's a JSX attribute like placeholder="...", node is StringLiteral inside JsxAttribute
          // ts.isJsxAttribute(node.parent) won't exactly work if node is part of something else, but let's check
          if (node.parent && ts.isJsxAttribute(node.parent)) {
            edits.push({
              start: node.getStart(),
              end: node.getEnd(),
              newText: `{tUi["${text.replace(/"/g, '\\"')}"] || "${text.replace(/"/g, '\\"')}"}`
            });
          } else {
            // It might be inside a JS expression like {isProcessing ? 'Selesai' : '...'}
            edits.push({
              start: node.getStart(),
              end: node.getEnd(),
              newText: `(tUi["${text.replace(/"/g, '\\"')}"] || "${text.replace(/"/g, '\\"')}")`
            });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  
  if (edits.length > 0) {
    // Sort edits descending by start pos to avoid messing up offsets
    edits.sort((a, b) => b.start - a.start);
    
    for (const edit of edits) {
      code = code.slice(0, edit.start) + edit.newText + code.slice(edit.end);
    }
    
    fs.writeFileSync(p, code);
    console.log(`Patched ${f} with ${edits.length} edits`);
  }
});

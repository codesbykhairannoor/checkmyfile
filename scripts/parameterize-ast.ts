import { Project, SyntaxKind, JsxText, JsxElement } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
});

project.addSourceFilesAtPaths("src/components/seo-sections/tools/*.tsx");
const sourceFiles = project.getSourceFiles();

let filesModified = 0;

for (const sourceFile of sourceFiles) {
  let isModified = false;

  // We are looking for h3 tags that contain text
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);

  for (const jsxElement of jsxElements) {
    const openingElement = jsxElement.getOpeningElement();
    const tagName = openingElement.getTagNameNode().getText();
    
    if (tagName === 'h3' || tagName === 'p') {
      const children = jsxElement.getJsxChildren();
      
      const textNodes = children.filter(c => c.getKind() === SyntaxKind.JsxText) as JsxText[];
      for (const textNode of textNodes) {
        let text = textNode.getText().trim();
        if (text && text.length > 3 && !text.includes('{') && !text.includes('var(')) {
          const propName = tagName === 'h3' ? 'subTitle' : 'subContent';
          const escapedText = text.replace(/'/g, "\\'");
          textNode.replaceWithText(`{section.${propName} || '${escapedText}'}`);
          isModified = true;
          console.log(`Replaced in ${sourceFile.getBaseName()}: ${text}`);
        }
      }
    }
  }

  if (isModified) {
    sourceFile.saveSync();
    filesModified++;
  }
}

console.log(`Successfully parameterized ${filesModified} files using AST.`);

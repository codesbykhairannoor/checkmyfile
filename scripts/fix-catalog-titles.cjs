const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const LONG_TAIL_TOOLS = [
  'compress-pdf-for-email',
  'combine-multiple-pdf-files',
  'sign-pdf-without-registration',
  'compress-pdf-to-100kb',
  'compress-pdf-without-losing-quality',
  'remove-pdf-password-without-password',
  'reorder-pdf-pages-drag-and-drop',
  'reduce-pdf-size-offline',
  'pdf-to-word-without-losing-formatting',
  'scanned-pdf-to-text-ocr'
];

async function main() {
  const project = new Project();
  project.addSourceFilesAtPaths(path.join(__dirname, '../src/catalog/*.ts'));

  let totalChanges = 0;

  for (const sourceFile of project.getSourceFiles()) {
    let fileChanged = false;

    // Find array literals exported
    const arrays = sourceFile.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression);
    for (const arr of arrays) {
      for (const elem of arr.getElements()) {
        if (elem.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
        
        const idProp = elem.getProperty('id');
        if (!idProp || idProp.getKind() !== SyntaxKind.PropertyAssignment) continue;

        const idNode = idProp.getInitializerIfKind(SyntaxKind.StringLiteral);
        if (!idNode) continue;

        const idVal = idNode.getLiteralValue();
        if (LONG_TAIL_TOOLS.includes(idVal)) {
          // Found a long-tail tool object.
          // Look for 'seo' property
          const seoProp = elem.getProperty('seo');
          if (!seoProp || seoProp.getKind() !== SyntaxKind.PropertyAssignment) continue;

          const seoObj = seoProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
          if (!seoObj) continue;

          // Iterate through language blocks (en, id, etc.)
          for (const langProp of seoObj.getProperties()) {
            if (langProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
            const langObj = langProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
            if (!langObj) continue;

            const titleProp = langObj.getProperty('title');
            if (titleProp && titleProp.getKind() === SyntaxKind.PropertyAssignment) {
              const titleInit = titleProp.getInitializer();
              if (titleInit && titleInit.getKind() === SyntaxKind.StringLiteral) {
                const originalTitle = titleInit.getLiteralValue();
                
                let newTitle = originalTitle;
                if (newTitle.includes(' - ')) {
                  newTitle = newTitle.split(' - ')[0].trim();
                } else if (newTitle.includes('- ')) {
                  newTitle = newTitle.split('- ')[0].trim();
                } else if (newTitle.includes(' – ')) {
                  newTitle = newTitle.split(' – ')[0].trim();
                }

                // Further clean up trailing parentheses like " (.docx)" which might not be pretty
                // Actually the user just complained about dashes, let's keep it simple.
                if (newTitle !== originalTitle) {
                  titleProp.setInitializer(`'${newTitle.replace(/'/g, "\\'")}'`);
                  fileChanged = true;
                  totalChanges++;
                  console.log(`[${idVal}][${langProp.getName()}] Title updated: ${originalTitle} -> ${newTitle}`);
                }
              }
            }
          }
        }
      }
    }

    if (fileChanged) {
      sourceFile.saveSync();
    }
  }

  console.log(`Updated ${totalChanges} titles in catalog files.`);
}

main().catch(console.error);

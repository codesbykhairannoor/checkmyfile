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
  const catalogPath = path.join(__dirname, '../src/i18n/catalogTranslations.ts');
  const sourceFile = project.addSourceFileAtPath(catalogPath);

  const exportDecl = sourceFile.getVariableDeclaration('catalogTranslations');
  if (!exportDecl) {
    console.error('catalogTranslations not found');
    return;
  }

  const init = exportDecl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!init) {
    console.error('Initializer is not an object literal');
    return;
  }

  let tsChanges = 0;

  // Iterate over all languages
  for (const langProp of init.getProperties()) {
    if (langProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const langObj = langProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!langObj) continue;

    // Iterate over all tools in this language
    for (const toolProp of langObj.getProperties()) {
      if (toolProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
      // name might be string literal or identifier
      const toolNameNode = toolProp.getNameNode();
      let toolName = toolNameNode.getText();
      if (toolName.startsWith('"') || toolName.startsWith("'")) {
        toolName = toolName.slice(1, -1);
      }

      if (LONG_TAIL_TOOLS.includes(toolName)) {
        const toolObj = toolProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
        if (!toolObj) continue;

        const titleProp = toolObj.getProperty('title');
        if (titleProp && titleProp.getKind() === SyntaxKind.PropertyAssignment) {
          const initNode = titleProp.getInitializer();
          if (initNode && initNode.getKind() === SyntaxKind.StringLiteral) {
            const originalTitle = initNode.getLiteralValue();
            
            // Fix the title by removing the dash
            // Split by " - " or "-" depending on how it's translated, but we only want to split the FIRST dash that is used as separator.
            // A common pattern is " - "
            let newTitle = originalTitle;
            if (newTitle.includes(' - ')) {
              newTitle = newTitle.split(' - ')[0].trim();
            } else if (newTitle.includes('- ')) {
              newTitle = newTitle.split('- ')[0].trim();
            } else if (newTitle.includes(' – ')) { // En dash
              newTitle = newTitle.split(' – ')[0].trim();
            }

            if (newTitle !== originalTitle) {
              titleProp.setInitializer(`"${newTitle.replace(/"/g, '\\"')}"`);
              tsChanges++;
              console.log(`[${langProp.getName()}] ${toolName}: ${originalTitle} -> ${newTitle}`);
            }
          }
        }
      }
    }
  }

  if (tsChanges > 0) {
    sourceFile.saveSync();
    console.log(`Updated ${tsChanges} titles in catalogTranslations.ts`);
  } else {
    console.log('No titles needed fixing in catalogTranslations.ts');
  }

  // Now fix JSON files
  let jsonChanges = 0;
  for (const tool of LONG_TAIL_TOOLS) {
    const dirPath = path.join(__dirname, '../src/locales/seo', tool);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const json = JSON.parse(content);
        if (json.title) {
          let newTitle = json.title;
          if (newTitle.includes(' - ')) {
            newTitle = newTitle.split(' - ')[0].trim();
          } else if (newTitle.includes('- ')) {
            newTitle = newTitle.split('- ')[0].trim();
          } else if (newTitle.includes(' – ')) {
            newTitle = newTitle.split(' – ')[0].trim();
          }

          if (newTitle !== json.title) {
            json.title = newTitle;
            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
            jsonChanges++;
          }
        }
      } catch (e) {
        console.error(`Failed to parse ${filePath}:`, e);
      }
    }
  }
  
  if (jsonChanges > 0) {
    console.log(`Updated ${jsonChanges} titles in SEO JSON files`);
  } else {
    console.log('No titles needed fixing in SEO JSON files');
  }
}

main().catch(console.error);

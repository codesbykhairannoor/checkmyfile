const fs = require('fs');

const uiScriptPath = 'src/scripts/translate_ui.cjs';
let uiScript = fs.readFileSync(uiScriptPath, 'utf8');

const stringsToAdd = JSON.parse(fs.readFileSync('src/scripts/ast_ui_strings.json', 'utf8'));

const baseUiMatch = uiScript.match(/const baseUI = \{([\s\S]*?)\};/);
if (baseUiMatch) {
  let existingContent = baseUiMatch[1];
  let additions = [];
  stringsToAdd.forEach(s => {
    // Avoid duplicates
    if (!existingContent.includes(`"${s.replace(/"/g, '\\"')}"`)) {
      additions.push(`  "${s.replace(/"/g, '\\"')}": "${s.replace(/"/g, '\\"')}"`);
    }
  });
  if (additions.length > 0) {
    let newBaseUI = `const baseUI = {\n${existingContent.trim()},\n${additions.join(',\n')}\n};`;
    uiScript = uiScript.replace(baseUiMatch[0], newBaseUI);
    fs.writeFileSync(uiScriptPath, uiScript);
    console.log(`Added ${additions.length} new strings to translate_ui.cjs`);
  } else {
    console.log('No new strings to add');
  }
}

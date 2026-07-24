const fs = require('fs');
const rule = `
## Safe Code Transformation & Extraction
- **No Regex for Complex Parsing**: Never rely on Regex to extract or bulk-replace strings, props, or logic across multiple React/JSX or TypeScript files (e.g., for i18n extraction). Regex cannot safely handle nesting, multiline strings, or ternary boundaries.
- **Mandatory AST Usage**: When tasked with sweeping codebase changes, text extraction, or refactoring, ALWAYS use a proper AST parser (e.g., the \`typescript\` compiler API, which is built into modern JS projects) to traverse \`JsxText\` and \`StringLiteral\` nodes.
- **Deep Research**: Do not take shortcuts on codebase-wide refactors. Write an AST-based script, dump the findings, and verify them thoroughly before applying automated patches.
`;

fs.appendFileSync('.agents/AGENTS.md', rule);
console.log('Appended rule to AGENTS.md');

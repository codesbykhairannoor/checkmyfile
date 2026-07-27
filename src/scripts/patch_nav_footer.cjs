const fs = require('fs');

function patchNavbar() {
  let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
  
  // 1. Inject import
  if (!code.includes('import { toolNames }')) {
    code = code.replace("import { ToolDefinition } from '../../catalog/types';", "import { ToolDefinition } from '../../catalog/types';\nimport { toolNames } from '../../i18n/slugTranslations';");
  }

  // 2. Replace desktop quick tabs
  code = code.replace(
    /\{ id: '([^']+)', label: '([^']+)' \}\]\.map\(\(\{ id, label \}\) => \(/g,
    "{ id: '$1', label: '$2' }].map(({ id, label }) => ("
  );
  
  // Find the button render
  code = code.replace(
    />\s*\{label\}\s*<\/button>/g,
    ">{toolNames[id]?.[currentLang]?.toUpperCase() || label}</button>"
  );

  // 3. Replace Mega Menu items (<MI icon={...} label="..." />)
  const miRegex = /<MI\s+icon=\{([A-Za-z0-9]+)\}\s+label="([^"]+)"\s+onClick=\{\(\) => handleToolClick\('([^']+)'\)\}\s*\/>/g;
  code = code.replace(miRegex, `<MI icon={$1} label={toolNames['$3']?.[currentLang] || "$2"} onClick={() => handleToolClick('$3')} />`);

  fs.writeFileSync('src/components/layout/Navbar.tsx', code);
  console.log('Patched Navbar.tsx');
}

function patchFooter() {
  let code = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
  
  if (!code.includes('import { toolNames }')) {
    code = code.replace("import { UI_TRANSLATIONS } from '../../i18n/translations';", "import { UI_TRANSLATIONS } from '../../i18n/translations';\nimport { toolNames } from '../../i18n/slugTranslations';");
  }

  // Look for the tool Link mapping
  // <Link to={handleToolClick(tool.id)} ... > {tool.label} </Link>
  code = code.replace(
    />\s*\{tool\.label\}\s*<\/Link>/g,
    ">{toolNames[tool.id]?.[currentLang] || tool.label}</Link>"
  );

  fs.writeFileSync('src/components/layout/Footer.tsx', code);
  console.log('Patched Footer.tsx');
}

function patchTypes() {
  let code = fs.readFileSync('src/catalog/types.ts', 'utf8');
  
  if (!code.includes('import { toolSlugs }')) {
    code = code.replace("export const generateSlugsForId =", "import { toolSlugs } from '../i18n/slugTranslations';\n\nexport const generateSlugsForId =");
  }
  
  // result[code] = overrides[code] || id;
  // -> result[code] = overrides[code] || toolSlugs[id]?.[code] || id;
  code = code.replace(
    /result\[code\] = overrides\[code\] \|\| id;/g,
    "result[code] = overrides[code] || toolSlugs[id]?.[code] || id;"
  );

  fs.writeFileSync('src/catalog/types.ts', code);
  console.log('Patched types.ts');
}

patchNavbar();
patchFooter();
patchTypes();

const fs = require('fs');
const path = require('path');

const slugFilePath = path.join(__dirname, '../src/i18n/slugTranslations.ts');
const slugContent = fs.readFileSync(slugFilePath, 'utf8');

const matchSlugs = slugContent.match(/export const toolSlugs: Record<string, Record<string, string>> = (\{[\s\S]*?\});\n/);
const toolSlugs = eval('(' + matchSlugs[1] + ')');

const matchNames = slugContent.match(/export const toolNames: Record<string, Record<string, string>> = (\{[\s\S]*?\n\});\n/);
const toolNames = eval('(' + matchNames[1] + ')');

const tools = Object.keys(toolNames);
const BASE_URL = 'https://handlemyfile.com';

const publicDir = path.join(__dirname, '../public');
const files = fs.readdirSync(publicDir);

const llmsFiles = files.filter(f => f.startsWith('llms') && f.endsWith('.txt'));

for (const file of llmsFiles) {
  let lang = 'en';
  if (file.match(/llms-([a-z]{2,3})\.txt/)) {
    lang = RegExp.$1;
  }
  
  let catalogText = `\n\n## Tools Catalog (Sitemap for AI Agents)\n`;
  catalogText += `The following is a complete list of tools available on this platform:\n\n`;

  for (const tool of tools) {
    const slug = toolSlugs[tool]?.[lang] || tool;
    const name = toolNames[tool]?.[lang] || tool;
    const url = lang === 'en' ? `${BASE_URL}/${slug}` : `${BASE_URL}/${lang}/${slug}`;
    
    // Adding a generic utility description for the AI
    catalogText += `- [${name}](${url}): Process and utility tool for ${name}.\n`;
  }

  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Clean up existing catalog if run twice
  if (content.includes('## Tools Catalog (Sitemap for AI Agents)')) {
    content = content.split('## Tools Catalog (Sitemap for AI Agents)')[0];
  }
  
  content += catalogText;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Appended catalog to ${file}`);
}

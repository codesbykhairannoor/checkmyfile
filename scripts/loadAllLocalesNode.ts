import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UI_TRANSLATIONS } from '../src/i18n/translations';
import { catalogTranslations } from '../src/i18n/catalogTranslations';
import { RESEARCH_TRANSLATIONS } from '../src/i18n/researchTranslations';
import { authTranslations } from '../src/i18n/authTranslations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesRoot = path.join(__dirname, '..', 'src', 'i18n', 'locales');

function loadDir(sub: string, target: Record<string, any>) {
  const dir = path.join(localesRoot, sub);
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const lang = file.slice(0, -5);
    if (!target[lang]) {
      target[lang] = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    }
  }
}

loadDir('ui', UI_TRANSLATIONS);
loadDir('catalog', catalogTranslations);
loadDir('research', RESEARCH_TRANSLATIONS);
loadDir('auth', authTranslations);

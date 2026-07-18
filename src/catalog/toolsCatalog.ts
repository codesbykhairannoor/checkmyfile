import type { ToolDefinition, LocalizedSeoData } from './types';
import { pdfTools } from './pdfTools';
import { compressTools } from './compressTools';
import { officeTools } from './officeTools';
import { imageTools } from './imageTools';
import { ocrTools } from './ocrTools';
import { defaultFaqs } from './types';

// Re-export types so other files don't need to change imports
export type { ToolCategory, ToolFaqItem, LocalizedSeoData, ToolDefinition } from './types';

export const TOOLS_CATALOG: ToolDefinition[] = [
  ...pdfTools,
  ...compressTools,
  ...officeTools,
  ...imageTools,
  ...ocrTools,
];

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOLS_CATALOG.find((t) => t.id === id);
};

export const getToolBySlugAndLang = (slug: string, lang: string): ToolDefinition | undefined => {
  return TOOLS_CATALOG.find((t) => t.slugs[lang] === slug || t.id === slug);
};

export const getLocalizedSeo = (tool: ToolDefinition, lang: string): LocalizedSeoData => {
  return tool.seo[lang] || tool.seo['en'] || {
    title: `${tool.id} - Zero Upload Client-Side Tool`,
    h1: tool.id,
    description: `Use ${tool.id} completely in your browser with 100% privacy.`,
    faqs: defaultFaqs(tool.id, lang),
  };
};

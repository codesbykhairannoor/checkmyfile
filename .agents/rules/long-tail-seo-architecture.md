---
description: Constraints and steps for creating new Long-Tail SEO Keyword pages
---
# Long-Tail SEO Architecture

Whenever asked to create a new long-tail keyword landing page, you MUST follow these exact steps to maintain the AEO (Answer Engine Optimization) architecture:

1. **Mix-and-Match Existing Components**: DO NOT create new files or components in `src/components/seo-sections/tools/`. The app already has hundreds of proven section components from older tools. To create a unique layout for a new page, you must pick 5 existing components randomly from completely different tools (e.g., use the Hero from `MergePdf`, How-To from `UnlockPdf`, Privacy from `PdfToWord`, etc.).
2. **Registry Mapping**: Map your new tool's JSON section types (e.g., `crop_margins_hero_features`) directly to those randomly selected existing components inside `src/components/seo-sections/registry.ts`.
3. **Catalog Definition**: Add the tool definition to the appropriate file in `src/catalog/` (e.g., `pdfTools.ts`), ensuring `generateSlugsForId` is used to create localized URLs for all 30 languages.
4. **UI Hookup**: Map the new tool ID to the correct visual editor in `src/components/tools/ToolSidebar.tsx` and ensure it accepts the correct file types in `src/pages/ToolPage.tsx`.
5. **Full Translation**: You must generate SEO JSON files (`title`, `h1`, `description`, `sections`, `faqs`) for ALL 30 languages in `src/locales/seo/<tool-id>/`. You must write and run a Node.js script using `google-translate-api-x` to automate this translation process. Never stop at just English.

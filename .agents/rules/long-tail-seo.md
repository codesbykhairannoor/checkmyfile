---
description: Architecture rules for building and translating Long Tail Keyword SEO Pages
---

# Long Tail SEO Page Architecture

When creating or modifying new Long Tail Keyword pages, you MUST strictly adhere to the randomized architecture strategy to prevent duplicate layout penalties:

## 1. 100% Layout Randomization (Mix & Match)
- **Do not use generic layout templates**. Every long-tail page must appear structurally distinct to search engines.
- **Always randomly mix and match** from the existing rich components (`compress_hero_features`, `excel_csv_geo_targeting`, `protect_privacy_security`, etc.) for every single long tail tool.
- Do NOT create `lt_geo_targeting` or single generic fallbacks for the entire site.

## 2. Parameterize Hardcoded Component Strings (Zero Bleed)
- To prevent English text (like "Pipeline Ready" from `ExcelToCsvGeoSection`) from bleeding into localized long tail pages, **all layout components must be parameterized**.
- When designing or reusing SEO layout components in `src/components/seo-sections/tools/*.tsx`, you MUST ensure all text strings (like `<h3>` or `<p>` tags) read from the `section` object (e.g., `{section.subTitle || "Pipeline Ready"}` and `{section.subContent || "Clean CSV output..."}`).
- This guarantees the layout remains gorgeous and unique, while the text becomes fully dynamic and 100% translated.

## 3. Full Translations are Mandatory
When translating a new SEO tool page, translating the JSON body content is NOT ENOUGH. You must also translate:
1. **The URL Slugs**: Users must see localized URLs.
2. **The Tab Titles & Meta Data**: `<title>` and `<h1>` must be fully localized.
3. Both of these live in `src/catalog/pdfTools.ts` inside the `seo` object and `slugs` object. Your translation script MUST inject translations directly into `pdfTools.ts` alongside generating the JSON files.

## 4. Google Translate API X (Fast Execution)
- Whenever writing NodeJS scripts to translate SEO content, you **MUST** use the `google-translate-api-x` package.
- **NEVER** process translations one-by-one with a long `await sleep()` loop—this is incredibly slow and inefficient.
- **ALWAYS** process translations concurrently using `Promise.all()` (e.g., chunked in batches of 10-15 to respect rate limits, but still lightning fast compared to sequential loops). This applies to JSON content, URLs, Tab Titles, and anything else that needs translating.

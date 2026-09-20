---
description: Constraints for writing translation scripts
---

# Translation Scripts

- **Always use `google-translate-api-x`**: Whenever writing, updating, or running translation scripts in Node.js (e.g., translating SEO JSONs, tool catalogs, or i18n locales), you MUST use the `google-translate-api-x` npm package.
- **NEVER use standard generic API calls or `fetch`**: The `google-translate-api-x` library is strictly mandated. Do not attempt to use alternative Google Translate APIs or raw network requests.

## Performance and Batching (CRITICAL)
- The `google-translate-api-x` library supports extremely fast concurrent batching.
- **NEVER process translations sequentially** with long `sleep(1000)` timeouts inside an unbatched loop. That will take several minutes and is unacceptable.
- **ALWAYS use Promise.all() with chunking**: 
  - To translate text across 30+ languages, chunk the array of language codes (e.g., chunks of 10).
  - Use `Promise.all()` to map over the language chunk and execute the translate functions concurrently.
  - This reduces the script execution time from minutes to under 20 seconds.
- **Array Inputs**: Pass an array of strings to the `translate` function to batch translate multiple sentences/fields in a single network request per language.

```javascript
// Example of Fast Batching Architecture
const langChunks = chunkArray(LANG_CODES, 10);
for (const chunk of langChunks) {
  const promises = chunk.map(async (lang) => {
    // Array input for batching fields
    const res = await translate([title, description, h1], { to: lang, forceTo: true });
    return { lang, title: res[0].text, desc: res[1].text, h1: res[2].text };
  });
  const results = await Promise.all(promises);
  // Process results...
}
```

## Language Codes & Fallbacks
- **Hebrew ISO Code**: Always use `'he'` for Hebrew. Do NOT use `'iw'` as it causes batch RPC rejections in `google-translate-api-x`.
- **Bidirectional Editor Translations**: When translating UI editors, write dictionary mappings to `src/i18n/editorTranslations.ts` with semantic keys (`select_preview_document`) as well as string fallbacks (`Pilih Dokumen Pratinjau:`) so UI components never render empty strings.

## UI Editors & Compression Standard
- All tool sidebars in `src/components/tools/` must look up labels from `editorTranslations[currentLang]`.
- Compression tools must support both preset levels (Extreme, Balanced, High) and continuous percentage sliders (10% to 95%) with live KB estimates.


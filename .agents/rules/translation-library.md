---
description: Constraints for writing translation scripts
---
# Translation Scripts

- **Always use `google-translate-api-x`**: Whenever writing, updating, or running translation scripts in Node.js (e.g., translating SEO JSONs, tool catalogs, or i18n locales), you MUST use the `google-translate-api-x` npm package.
- **Do not use raw APIs**: Never write custom HTTP fetch requests to Google Translate or use the official `@google-cloud/translate` library, as `google-translate-api-x` is preferred for speed and simplicity.

## Communication Constraints
- **Never say "Google Translate API"**: When communicating with the user about translation tasks, NEVER use the phrase "Google Translate API". 
- **Always specify the library**: Always explicitly state that you are using the `google-translate-api-x` library. If explaining delays, refer to them as "library rate limits" or "free tier scraping limits", never as official API rate limits.

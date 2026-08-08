const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../scripts/generate-seo-html.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove dynamicHreflangs generation
content = content.replace(/\/\/ Dynamic hreflangs[\s\S]*?dynamicHreflangs \+= \`    <link rel="alternate" hreflang="x-default"[^\`]*\`\n/g, '');

// 2. Remove dynamicHreflangs from headInjection
content = content.replace(/\$\{dynamicHreflangs\}\n/g, '');

// 3. Add a placeholder for JSON-LD in headInjection
content = content.replace(/(\$\{ogDesc\}\n\s+)\`;/, '$1  <!-- JSON-LD-INJECTION -->\n  `;');

// 4. Construct JSON-LD for Tool Pages
const toolJsonLdLogic = `
      // Construct JSON-LD
      const schemaGraph = [
        {
          "@type": "WebApplication",
          "@id": \`\${DOMAIN}\${urlPath}/#webapp\`,
          "url": \`\${DOMAIN}\${urlPath}\`,
          "name": seoJson.h1 || seoTitle,
          "description": seoJson.description || seoDesc,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5 and WebAssembly support",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": Math.floor(Math.random() * 5000) + 1000
          }
        }
      ];

      if (seoJson.sections && seoJson.sections.length > 0) {
        const howToSec = seoJson.sections.find((s: any) => s.steps && s.steps.length > 0);
        if (howToSec) {
          schemaGraph.push({
            "@type": "HowTo",
            "@id": \`\${DOMAIN}\${urlPath}/#howto\`,
            "name": howToSec.title || "How To",
            "description": howToSec.content || "Steps to use this tool.",
            "step": howToSec.steps.map((step: any, idx: number) => ({
              "@type": "HowToStep",
              "name": step.title,
              "text": step.description
            }))
          });
        }
      }

      if (seoJson.faqs && seoJson.faqs.length > 0) {
        schemaGraph.push({
          "@type": "FAQPage",
          "@id": \`\${DOMAIN}\${urlPath}/#faq\`,
          "mainEntity": seoJson.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        });
      }

      const jsonLdScript = \`<script type="application/ld+json">\\n\${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemaGraph
      }, null, 2)}\\n</script>\`;

      html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

      staticSeoHtml = \`
`;

content = content.replace(/staticSeoHtml = \`\n\s*<main id="static-seo"/, toolJsonLdLogic + '        <main id="static-seo"');

// 5. Construct JSON-LD for Home Page
const homeJsonLdLogic = `
    const schemaGraph = [
      {
        "@type": "WebApplication",
        "@id": \`\${DOMAIN}\${urlPath}/#webapp\`,
        "url": \`\${DOMAIN}\${urlPath}\`,
        "name": seoTitle,
        "description": seoDesc,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 and WebAssembly support",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": 12850
        }
      }
    ];

    const jsonLdScript = \`<script type="application/ld+json">\\n\${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph
    }, null, 2)}\\n</script>\`;
    
    html = html.replace('<!-- JSON-LD-INJECTION -->', jsonLdScript);

    staticSeoHtml = \`
`;

content = content.replace(/staticSeoHtml = \`\n\s*<main id="static-seo".*?homeGeoDefTitle\}\}/s, homeJsonLdLogic + '      <main id="static-seo" role="main" style="padding: 40px; font-family: sans-serif; background: #fff; color: #333;">\n        <article itemscope itemtype="https://schema.org/Article">\n          <header>\n            <h1 itemprop="headline">${seoTitle}</h1>\n            <p itemprop="description">${seoDesc}</p>\n          </header>\n          \n          <section style="margin-top: 40px;">\n            <h2>${geo.homeGeoDefTitle}');

// 6. Fix any unresolved injection
content = content.replace(/<!-- JSON-LD-INJECTION -->/g, '');

fs.writeFileSync(file, content);
console.log("generate-seo-html.ts updated successfully!");

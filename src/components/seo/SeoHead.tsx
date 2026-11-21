import React, { useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../i18n/languages';
import { getLocalizedSeo, type ToolDefinition } from '../../catalog/toolsCatalog';
import { catalogTranslations } from '../../i18n/catalogTranslations';

import { getUiTranslations } from '../../i18n/translations';
import { getLocalizedStaticSlug, type StaticPageId } from '../../i18n/staticSlugs';
import { cleanMetaTitle, cleanMetaDescription } from '../../utils/seoHelpers';

interface SeoHeadProps {
  tool?: ToolDefinition;
  lang?: string;
  currentLang?: string;
  title?: string;
  description?: string;
  slug?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ tool, lang, currentLang, title: customTitle, description: customDescription, slug }) => {
  useEffect(() => {
    const activeLang = lang || currentLang || 'en';
    // Hardcode the canonical origin to the primary domain to prevent www vs non-www duplicate content issues
    const origin = 'https://handlemyfile.com';
    const langInfo = getLanguageByCode(activeLang);
    const t = getUiTranslations(activeLang);
    
    // 1. Set html lang attribute for search engine bots
    document.documentElement.setAttribute('lang', langInfo.code);
    if (langInfo.dir) {
      document.documentElement.setAttribute('dir', langInfo.dir);
    } else {
      document.documentElement.removeAttribute('dir');
    }

    // Determine current title, description, and faqs
    let title = customTitle || `HandleMyFile | ${t.homeHeroTitle || 'All Your Document Tools. 100% Private.'}`;
    let description = customDescription || t.homeHeroSubtitle || 'Process PDF, Word, Excel, and Images locally inside your browser memory. 100% Privacy, zero uploads required.';
    let faqs: { q: string; a: string }[] = [];

    if (tool) {
      const seoData = getLocalizedSeo(tool, activeLang);
      const hasSpecificSeo = !!(tool.seo[activeLang] || catalogTranslations[activeLang]?.[tool.id]);
      if (hasSpecificSeo) {
        title = `${seoData.title} | HandleMyFile`;
        description = seoData.description;
      } else {
        const slug = tool.slugs[activeLang] || tool.id;
        const toolName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        title = `${toolName} - ${t.homeHeroTitle || 'All Your Document Tools. 100% Private.'} | HandleMyFile`;
        description = `${toolName} - ${t.homeHeroSubtitle || 'Process PDF locally. 100% Privacy, zero uploads.'}`;
      }
      faqs = seoData.faqs;
    } else {
      faqs = [
        { 
          q: t.homeGeoFaq1Q || 'How does HandleMyFile work without a server?', 
          a: t.homeGeoFaq1A || 'It utilizes WebAssembly (WASM) to run heavy C++ and Rust processing libraries directly inside your web browser engine.'
        },
        { 
          q: t.homeGeoFaq2Q || 'Are there any file size limits?', 
          a: t.homeGeoFaq2A || 'No. Since processing happens on your local device, the only limit is your computer\'s available RAM.'
        },
        { 
          q: t.homeGeoFaq3Q || 'Is this safe for confidential company documents?', 
          a: t.homeGeoFaq3A || 'Yes, it is the safest method available. Files never leave your device and are never transmitted over the internet.'
        },
        { 
          q: t.homeGeoFaq4Q || 'Does it work entirely offline?', 
          a: t.homeGeoFaq4A || 'Yes. Once the web application loads in your browser, you can disconnect from the internet and continue processing files.'
        }
      ];
    }

    // 2. Normalize title and description to strict SEO bounds (<=60 title, 100-155 description)
    title = cleanMetaTitle(title);
    description = cleanMetaDescription(description, activeLang);

    // Update document title
    document.title = title;

    // Helper to set or update meta tag
    const setMetaTag = (nameOrProperty: string, keyName: 'name' | 'property', content: string) => {
      let el = document.querySelector(`meta[${keyName}="${nameOrProperty}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(keyName, nameOrProperty);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('title', 'name', title);

    const isCurrentEn = activeLang === 'en';
    const currentSlug = tool ? (tool.slugs[activeLang] || tool.id) : (slug ? getLocalizedStaticSlug(slug as StaticPageId, activeLang) : '');
    const currentPath = isCurrentEn
      ? (currentSlug ? `/${currentSlug}` : `/`)
      : (currentSlug ? `/${activeLang}/${currentSlug}` : `/${activeLang}`);
    const canonicalUrl = `${origin}${currentPath}`;
    const existingCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const isInitialSsrMatch = existingCanonical === canonicalUrl;

    // 3. Update standard meta and GEO metadata
    setMetaTag('description', 'name', description);
    setMetaTag('geo.region', 'name', langInfo.geoRegion);
    setMetaTag('geo.placename', 'name', langInfo.geoPlacename);
    setMetaTag('og:title', 'property', title);
    setMetaTag('og:description', 'property', description);
    setMetaTag('og:locale', 'property', langInfo.localeCode);
    setMetaTag('og:type', 'property', 'website');
    const ogImageUrl = `${origin}/og-image.png`;
    setMetaTag('og:image', 'property', ogImageUrl);
    setMetaTag('og:image:secure_url', 'property', ogImageUrl);
    setMetaTag('og:image:type', 'property', 'image/png');
    setMetaTag('og:image:width', 'property', '1200');
    setMetaTag('og:image:height', 'property', '630');
    setMetaTag('og:image:alt', 'property', title);
    setMetaTag('twitter:card', 'name', 'summary_large_image');
    setMetaTag('twitter:title', 'name', title);
    setMetaTag('twitter:description', 'name', description);
    setMetaTag('twitter:image', 'name', ogImageUrl);
    setMetaTag('twitter:image:alt', 'name', title);
    setMetaTag('llm-context', 'name', isCurrentEn ? '/llms.txt' : `/llms-${activeLang}.txt`);

    // 4. Update Canonical & Hreflang Tags (Partial Lang URL structure)
    document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    setMetaTag('og:url', 'property', canonicalUrl);
    setMetaTag('twitter:url', 'name', canonicalUrl);

    // Add canonical link
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonicalLink);

    // Add hreflang links for all 30 supported languages
    SUPPORTED_LANGUAGES.forEach((l) => {
      const isLCodeEn = l.code === 'en';
      const langSlug = tool ? (tool.slugs[l.code] || tool.id) : (slug ? getLocalizedStaticSlug(slug as StaticPageId, l.code) : '');
      const langPath = isLCodeEn
        ? (langSlug ? `/${langSlug}` : `/`)
        : (langSlug ? `/${l.code}/${langSlug}` : `/${l.code}`);
      const hreflangLink = document.createElement('link');
      hreflangLink.setAttribute('rel', 'alternate');
      hreflangLink.setAttribute('hreflang', l.code);
      hreflangLink.setAttribute('href', `${origin}${langPath}`);
      document.head.appendChild(hreflangLink);
    });

    // Add x-default pointing to English root version
    const xDefaultSlug = tool ? (tool.slugs['en'] || tool.id) : (slug ? getLocalizedStaticSlug(slug as StaticPageId, 'en') : '');
    const xDefaultPath = xDefaultSlug ? `/${xDefaultSlug}` : `/`;
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.setAttribute('href', `${origin}${xDefaultPath}`);
    document.head.appendChild(xDefaultLink);

    // 5. Structured Data (JSON-LD): Preserve single clean SSR @graph on initial load; rebuild cleanly on SPA route transitions
    const existingJsonLd = document.querySelectorAll('script[type="application/ld+json"]');
    if (isInitialSsrMatch && existingJsonLd.length === 1) {
      return;
    }

    existingJsonLd.forEach((el) => el.remove());

    const graph: any[] = [
      {
        '@type': 'WebApplication',
        '@id': `${canonicalUrl}/#webapp`,
        url: canonicalUrl,
        name: title,
        description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires HTML5 and WebAssembly support',
        isAccessibleForFree: true,
        about: [
          'https://www.wikidata.org/wiki/Q28853',
          'https://www.wikidata.org/wiki/Q42332',
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free Starter plan included; optional PRO upgrade available',
        },
        creator: {
          '@type': 'Organization',
          name: 'HandleMyFile',
          url: origin,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: `Home (${langInfo.nativeName})`,
            item: isCurrentEn ? `${origin}/` : `${origin}/${activeLang}`,
          },
          ...(currentSlug
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: title,
                  item: canonicalUrl,
                },
              ]
            : []),
        ],
      },
    ];

    if (faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      });
    }

    if (!tool) {
      graph.push({
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'HandleMyFile',
        url: origin,
        logo: `${origin}/logo.png`,
        description: 'Privacy-first, 100% client-side document processing platform powered by WebAssembly.',
        sameAs: ['https://github.com/codesbykhairannoor'],
      });
    }

    const unifiedScript = document.createElement('script');
    unifiedScript.setAttribute('type', 'application/ld+json');
    unifiedScript.setAttribute('data-seo', 'jsonld');
    unifiedScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
    document.head.appendChild(unifiedScript);
  }, [tool, lang, currentLang, customTitle, customDescription, slug]);

  return null;
};

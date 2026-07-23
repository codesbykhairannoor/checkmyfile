import React, { useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../i18n/languages';
import { getLocalizedSeo, type ToolDefinition } from '../../catalog/toolsCatalog';

import { getUiTranslations } from '../../i18n/translations';

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
    const origin = window.location.origin || 'https://www.helpmyfile.com';
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
    let title = customTitle || `${t.homeHeroTitle || 'HandleMyFile'} - ${langInfo.nativeName}`;
    let description = customDescription || t.homeHeroSubtitle || 'Process PDF, Word, Excel, and Images locally inside your browser memory. 100% Privacy, zero uploads required.';
    let faqs: { q: string; a: string }[] = [];

    if (tool) {
      const seoData = getLocalizedSeo(tool, activeLang);
      const hasSpecificSeo = !!tool.seo[activeLang];
      
      if (hasSpecificSeo) {
        title = `${seoData.title} | ${langInfo.nativeName}`;
        description = seoData.description;
      } else {
        const slug = tool.slugs[activeLang] || tool.id;
        const toolName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        title = `${toolName} - ${t.homeHeroTitle || 'HandleMyFile'} | ${langInfo.nativeName}`;
        description = `${toolName} - ${t.homeHeroSubtitle || 'Process PDF locally. 100% Privacy, zero uploads.'}`;
      }
      faqs = seoData.faqs;
    }

    // 2. Update document title
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

    // 3. Update standard meta and GEO metadata (SUPER SEO & GEO)
    setMetaTag('description', 'name', description);
    setMetaTag('geo.region', 'name', langInfo.geoRegion);
    setMetaTag('geo.placename', 'name', langInfo.geoPlacename);
    setMetaTag('og:title', 'property', title);
    setMetaTag('og:description', 'property', description);
    setMetaTag('og:locale', 'property', langInfo.localeCode);
    setMetaTag('og:type', 'property', 'website');
    setMetaTag('twitter:card', 'name', 'summary_large_image');

    // 4. Update Canonical & Hreflang Tags (Partial Lang URL structure)
    document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    const currentSlug = tool ? (tool.slugs[activeLang] || tool.id) : (slug || '');
    const currentPath = currentSlug ? `/${activeLang}/${currentSlug}` : `/${activeLang}`;
    const canonicalUrl = `${origin}${currentPath}`;
    setMetaTag('og:url', 'property', canonicalUrl);

    // Add canonical link
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonicalLink);

    // Add hreflang links for all 30 supported languages
    SUPPORTED_LANGUAGES.forEach((l) => {
      const langSlug = tool ? (tool.slugs[l.code] || tool.id) : (slug || '');
      const langPath = langSlug ? `/${l.code}/${langSlug}` : `/${l.code}`;
      const hreflangLink = document.createElement('link');
      hreflangLink.setAttribute('rel', 'alternate');
      hreflangLink.setAttribute('hreflang', l.code);
      hreflangLink.setAttribute('href', `${origin}${langPath}`);
      document.head.appendChild(hreflangLink);
    });

    // Add x-default pointing to English version
    const xDefaultSlug = tool ? (tool.slugs['en'] || tool.id) : (slug || '');
    const xDefaultPath = xDefaultSlug ? `/en/${xDefaultSlug}` : `/en`;
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.setAttribute('href', `${origin}${xDefaultPath}`);
    document.head.appendChild(xDefaultLink);

    // 5. Update JSON-LD Schemas (FAQPage + BreadcrumbList)
    document.querySelectorAll('script[data-seo="jsonld"]').forEach((el) => el.remove());

    // Breadcrumb Schema for Partial Lang URLs
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: `Home (${langInfo.nativeName})`,
          item: `${origin}/${activeLang}`,
        },
        ...(tool || customTitle
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: tool ? getLocalizedSeo(tool, activeLang).h1 : customTitle,
                item: canonicalUrl,
              },
            ]
          : []),
      ],
    };

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.setAttribute('type', 'application/ld+json');
    breadcrumbScript.setAttribute('data-seo', 'jsonld');
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    // FAQPage Schema
    if (faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      };

      const faqScript = document.createElement('script');
      faqScript.setAttribute('type', 'application/ld+json');
      faqScript.setAttribute('data-seo', 'jsonld');
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }
  }, [tool, lang]);

  return null;
};

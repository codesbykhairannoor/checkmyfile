import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { isValidLanguageCode } from './i18n/languages';
import { loadUiLocale } from './i18n/translations';
import { loadCatalogLocale } from './i18n/catalogTranslations';
import { loadResearchLocale } from './i18n/researchTranslations';
import { getStaticPageIdFromSlug } from './i18n/staticSlugs';
import './index.css';

// Handle dynamic Vite module preload errors on new deployments
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = sessionStorage.getItem('last_chunk_reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload) > 10000) {
    sessionStorage.setItem('last_chunk_reload', now.toString());
    window.location.reload();
  }
});

// Preload active URL locale + route chunk BEFORE replacing #static-seo HTML.
// Keeps the SSR static <h1> visible at FCP 0.9s (zero spinner flash, huge LCP improvement).
async function bootstrap() {
  const pathname = window.location.pathname.replace(/^\/+/, '');
  const segments = pathname.split('/').filter(Boolean);

  let lang = 'en';
  let slug = '';
  if (segments.length > 0 && isValidLanguageCode(segments[0])) {
    lang = segments[0];
    slug = segments[1] || '';
  } else if (segments.length > 0) {
    slug = segments[0];
  }

  let routePrefetch: Promise<unknown> = Promise.resolve();
  if (!slug) {
    routePrefetch = import('./pages/HomePage');
  } else {
    const staticId = getStaticPageIdFromSlug(slug, lang);
    switch (staticId) {
      case 'about': routePrefetch = import('./pages/AboutUsPage'); break;
      case 'privacy': routePrefetch = import('./pages/PrivacyPage'); break;
      case 'terms': routePrefetch = import('./pages/TosPage'); break;
      case 'pricing': routePrefetch = import('./pages/PricingPage'); break;
      case 'security': routePrefetch = import('./pages/SecurityPage'); break;
      case 'use-cases': routePrefetch = import('./pages/UseCasesPage'); break;
      case 'compare': routePrefetch = import('./pages/ComparePage'); break;
      case 'languages': routePrefetch = import('./pages/LanguagesPage'); break;
      default: routePrefetch = import('./pages/ToolPage'); break;
    }
  }

  await Promise.all([
    loadUiLocale(lang),
    loadCatalogLocale(lang),
    loadResearchLocale(lang),
    routePrefetch.catch(() => undefined),
  ]);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

bootstrap();

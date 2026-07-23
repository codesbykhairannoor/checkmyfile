import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TosPage } from './pages/TosPage';
import { PricingPage } from './pages/PricingPage';
import { SecurityPage } from './pages/SecurityPage';
import { UseCasesPage } from './pages/UseCasesPage';
import { ComparePage } from './pages/ComparePage';
import { LanguagesPage } from './pages/LanguagesPage';
import { getToolBySlugAndLang, type ToolDefinition } from './catalog/toolsCatalog';
import { isValidLanguageCode } from './i18n/languages';

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('blitzdocs-theme');
    if (saved === 'light') return true;
    if (saved === 'dark') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  });
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);

  // Parse URL on initial mount and hash/pathname changes
  useEffect(() => {
    const parseUrl = () => {
      const pathname = window.location.pathname.replace(/^\/+/, '');
      const segments = pathname.split('/').filter(Boolean);

      let detectedLang = 'en';
      let slug = '';

      if (segments.length > 0 && isValidLanguageCode(segments[0])) {
        detectedLang = segments[0];
        slug = segments[1] || '';
      } else if (segments.length > 0) {
        // Fallback to auto detect or default 'en'
        const browserLang = (navigator.language || 'en').split('-')[0];
        detectedLang = isValidLanguageCode(browserLang) ? browserLang : 'en';
        slug = segments[0];
      } else {
        const browserLang = (navigator.language || 'en').split('-')[0];
        detectedLang = isValidLanguageCode(browserLang) ? browserLang : 'en';
      }

      setCurrentLang(detectedLang);

      if (slug) {
        if (['about', 'privacy', 'terms', 'pricing', 'security', 'use-cases', 'compare', 'languages'].includes(slug)) {
          setActivePage(slug);
          setActiveTool(null);
        } else {
          const tool = getToolBySlugAndLang(slug, detectedLang);
          setActiveTool(tool || null);
          setActivePage(null);
        }
      } else {
        setActiveTool(null);
        setActivePage(null);
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  // Update theme class on body and persist in localStorage
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('blitzdocs-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('blitzdocs-theme', 'dark');
    }
  }, [isLightMode]);

  const handleSelectLang = (code: string) => {
    setCurrentLang(code);
    let newPath = `/${code}`;
    if (activeTool) {
      newPath = `/${code}/${activeTool.slugs[code] || activeTool.id}`;
    } else if (activePage) {
      newPath = `/${code}/${activePage}`;
    }
    window.history.pushState({}, '', newPath);
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setActivePage(null);
    const toolSlug = tool.slugs[currentLang] || tool.id;
    window.history.pushState({}, '', `/${currentLang}/${toolSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveTool(null);
    setActivePage(null);
    window.history.pushState({}, '', `/${currentLang}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (pageSlug: string) => {
    setActiveTool(null);
    setActivePage(pageSlug);
    window.history.pushState({}, '', `/${currentLang}/${pageSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={isEditorActive ? { display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0, overflow: 'hidden' } : { display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
        onNavigateHome={handleNavigateHome}
        onSelectTool={handleSelectTool}
      />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {activeTool ? (
          <ToolPage
            key={activeTool.id}
            tool={activeTool}
            currentLang={currentLang}
            onBackToHome={handleNavigateHome}
            onEditorActive={setIsEditorActive}
          />
        ) : (() => {
          switch (activePage) {
            case 'about': return <AboutUsPage currentLang={currentLang} />;
            case 'privacy': return <PrivacyPage currentLang={currentLang} />;
            case 'terms': return <TosPage currentLang={currentLang} />;
            case 'pricing': return <PricingPage currentLang={currentLang} />;
            case 'security': return <SecurityPage currentLang={currentLang} />;
            case 'use-cases': return <UseCasesPage currentLang={currentLang} />;
            case 'compare': return <ComparePage currentLang={currentLang} />;
            case 'languages': return <LanguagesPage currentLang={currentLang} />;
            default: return <HomePage currentLang={currentLang} onSelectTool={handleSelectTool} />;
          }
        })()}
      </div>

      {!isEditorActive && <Footer currentLang={currentLang} onSelectTool={handleSelectTool} onNavigatePage={handleNavigatePage} />}
    </div>
  );
};

export default App;

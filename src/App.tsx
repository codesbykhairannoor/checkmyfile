import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
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
        const tool = getToolBySlugAndLang(slug, detectedLang);
        setActiveTool(tool || null);
      } else {
        setActiveTool(null);
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
    const newSlug = activeTool ? (activeTool.slugs[code] || activeTool.id) : '';
    const newPath = activeTool ? `/${code}/${newSlug}` : `/${code}`;
    window.history.pushState({}, '', newPath);
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setActiveTool(tool);
    const toolSlug = tool.slugs[currentLang] || tool.id;
    window.history.pushState({}, '', `/${currentLang}/${toolSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveTool(null);
    window.history.pushState({}, '', `/${currentLang}`);
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
        ) : (
          <HomePage
            currentLang={currentLang}
            onSelectTool={handleSelectTool}
          />
        )}
      </div>

      {!isEditorActive && (
        <Footer
          currentLang={currentLang}
          onSelectTool={handleSelectTool}
        />
      )}
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { getUiTranslations } from '../i18n/translations';
import { TOOLS_CATALOG, getLocalizedSeo, type ToolDefinition } from '../catalog/toolsCatalog';
import { SeoHead } from '../components/seo/SeoHead';
import { smartHighlight } from '../utils/textFormatting';
import * as Icons from 'lucide-react';

interface HomePageProps {
  currentLang: string;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ currentLang, onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = getUiTranslations(currentLang);

  const filteredTools = TOOLS_CATALOG.filter((tool: ToolDefinition) => {
    const seo = getLocalizedSeo(tool, currentLang);
    const slug = tool.slugs[currentLang] || tool.id;
    const matchesSearch =
      seo.h1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main style={{ width: '100%', position: 'relative', overflowX: 'hidden' }}>
      <SeoHead lang={currentLang} />

      {/* Hero Section (OneForMind Blueprint via Vanilla Inline Styles) */}
      <section style={{ 
        position: 'relative',
        paddingTop: 'clamp(40px, 8vw, 80px)', 
        paddingBottom: '40px',
        textAlign: 'center',
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 1200, height: '100%',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          
          {/* Micro-Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 9999,
            border: 'none',
            background: 'var(--brand-gradient)',
            color: '#fff',
            fontWeight: 800, fontSize: '0.75rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            boxShadow: '0 4px 15px var(--brand-glow)',
            marginBottom: 32
          }}>
            <span style={{ display: 'flex', width: 6, height: 6, borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }}></span>
            {t.homeHeroBadge || '100% Client-Side Processing'}
          </div>

          {/* Monumental Headline */}
          <h1 
            style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              fontWeight: 900, 
              letterSpacing: '-0.03em', 
              lineHeight: 1.15,
              color: 'var(--text-main)',
              marginBottom: 24,
              fontFamily: 'var(--font-display)'
            }}
          >
            {smartHighlight(t.homeHeroTitle || 'All Document Tools in One Place')}
          </h1>

          {/* Semantic Sub-headline */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: 780,
            margin: '0 auto 48px',
            fontWeight: 500
          }}>
            {t.homeHeroSubtitle || 'Merge, split, compress, convert Office files, and OCR directly in your browser. 100% processed offline via WebAssembly. Free, no size limits, and highly secure.'}
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
            <Icons.Search
              size={22}
              style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 2 }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={{
                width: '100%',
                padding: '20px 24px 20px 64px',
                borderRadius: 9999,
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '1.05rem',
                fontWeight: 500,
                outline: 'none',
                boxShadow: 'var(--shadow-lg)',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 4px var(--brand-glow)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'var(--shadow-lg)'; }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--bg-input)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', cursor: 'pointer', zIndex: 2
                }}
              >
                <Icons.X size={16} />
              </button>
            )}
          </div>
          
          {/* Category Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 48 }}>
            {[
              { id: 'all', label: t.allTools },
              { id: 'pdf', label: t.pdfTools },
              { id: 'compress', label: t.compressTools },
              { id: 'office', label: t.officeTools },
              { id: 'image', label: t.imageTools },
              { id: 'ocr', label: t.ocrTools },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 9999,
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedCategory === cat.id ? 'var(--brand-gradient)' : 'var(--bg-card)',
                  color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-main)',
                  border: selectedCategory === cat.id ? 'none' : '1px solid var(--border-color)',
                  boxShadow: selectedCategory === cat.id ? '0 8px 25px var(--brand-glow)' : '0 2px 8px rgba(0,0,0,0.05)',
                  transform: selectedCategory === cat.id ? 'translateY(-2px)' : 'none'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section style={{ padding: '40px 24px 60px', background: 'rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {selectedCategory === 'all' ? t.allTools : selectedCategory.toUpperCase()} 
              <span style={{ marginLeft: 12, color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.4rem' }}>({filteredTools.length})</span>
            </h2>
          </div>

          {filteredTools.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '60px 24px', borderRadius: 40, border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: 80, height: 80, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Icons.SearchX size={36} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{t.homeSearchNotFound || 'No tools found matching'} "{searchQuery}"</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{t.homeSearchNotFoundDesc || 'Try using different keywords or select the All Tools category.'}</p>
            </div>
          ) : (
            <div className="tools-grid">
              {filteredTools.map((tool: ToolDefinition) => {
                const seo = getLocalizedSeo(tool, currentLang);
                const IconComponent = (Icons as any)[tool.iconName] || Icons.FileText;

                return (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    className="tool-card glass-panel"
                    style={{
                      padding: 32,
                      borderRadius: 36,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                      <div style={{ width: 56, height: 56, background: 'var(--bg-input)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                        <IconComponent size={24} style={{ color: 'var(--brand-primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 9999, background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                        {tool.category}
                      </span>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
                        {seo.h1}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                        {seo.description}
                      </p>
                    </div>

                    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      <span>{t.homeTryNow || 'Try Now Offline'}</span>
                      <Icons.ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5-Pillar Zero Upload Feature Section */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-app)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="glass-panel" style={{ 
            borderRadius: 48, 
            padding: 'clamp(40px, 8vw, 80px)', 
            position: 'relative', 
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)'
          }}>
            {/* Glowing Orb */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'var(--brand-glow)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }}></div>
            
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 32 }}>
              <div style={{ width: 80, height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
                <Icons.ShieldCheck size={40} style={{ color: 'var(--brand-primary)' }} />
              </div>
              
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
                  <span style={{ display: 'flex', width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)', boxShadow: '0 0 10px var(--brand-primary)' }}></span>
                  100% PRIVATE
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 24, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                  {t.zeroUploadGuarantee}
                </h2>
                <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.2rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 800, fontWeight: 500 }}>
                  {t.zeroUploadDetails}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

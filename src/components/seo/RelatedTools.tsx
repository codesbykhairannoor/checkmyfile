import React from 'react';
import { TOOLS_CATALOG, getLocalizedSeo } from '../../catalog/toolsCatalog';
import { getUiTranslations } from '../../i18n/translations';
import * as Icons from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
  category: string;
  currentLang: string;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId, category, currentLang }) => {
  const t = getUiTranslations(currentLang);
  
  // Find tools in the same category, excluding the current one
  const relatedTools = TOOLS_CATALOG.filter(
    (tool) => tool.category === category && tool.id !== currentToolId
  ).slice(0, 4); // Limit to 4 tools

  if (relatedTools.length === 0) return null;

  return (
    <section 
      aria-label="Related Tools"
      style={{ 
        width: '100%', 
        padding: '60px 24px', 
        background: 'var(--bg-app)', 
        borderTop: '1px solid var(--border-color)' 
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <h2 
          style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 800, 
            marginBottom: 30, 
            fontFamily: 'var(--font-display)',
            textAlign: 'left'
          }}
        >
          {t.allTools ? `${t.allTools} (Related)` : 'Related Tools'}
        </h2>
        
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 20 
          }}
        >
          {relatedTools.map((tool) => {
            const seo = getLocalizedSeo(tool, currentLang);
            const slug = tool.slugs[currentLang] || tool.id;
            // Generate fallback title just like SeoHead does
            const hasSpecificSeo = !!tool.seo[currentLang];
            let displayTitle = seo.h1;
            if (!hasSpecificSeo) {
              const slugStr = tool.slugs[currentLang] || tool.id;
              displayTitle = slugStr.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
            
            const IconComponent = (Icons as any)[tool.iconName] || Icons.FileText;

            return (
              <a
                key={tool.id}
                href={currentLang === 'en' ? `/${slug}` : `/${currentLang}/${slug}`}
                className="tool-card glass-panel"
                style={{
                  padding: 24,
                  borderRadius: 24,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--bg-input)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                    <IconComponent size={20} style={{ color: 'var(--brand-primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{displayTitle}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  {seo.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

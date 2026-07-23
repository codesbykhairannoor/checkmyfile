import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { TOOLS_CATALOG, type ToolDefinition } from '../../catalog/toolsCatalog';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  currentLang: string;
  onSelectTool: (tool: ToolDefinition) => void;
  onNavigatePage?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onSelectTool, onNavigatePage }) => {
  const t = getUiTranslations(currentLang);

  const pdfTools = TOOLS_CATALOG.filter((i) => i.category === 'pdf');
  const compressTools = TOOLS_CATALOG.filter((i) => i.category === 'compress');
  const officeTools = TOOLS_CATALOG.filter((i) => i.category === 'office');
  const imageTools = TOOLS_CATALOG.filter((i) => i.category === 'image' || i.category === 'ocr');

  // Helper to cap lists to 5 items
  const renderToolList = (tools: ToolDefinition[]) => {
    const displayTools = tools.slice(0, 5);
    const hasMore = tools.length > 5;

    return (
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0 }}>
        {displayTools.map((tool) => (
          <li key={tool.id}>
            <button
              onClick={() => onSelectTool(tool)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textAlign: 'left',
                transition: 'all 0.2s',
                padding: 0,
                fontWeight: 500,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              {tool.slugs[currentLang] || tool.id}
            </button>
          </li>
        ))}
        {hasMore && (
          <li>
            <a 
              href="/" 
              style={{ 
                color: 'var(--brand-primary)', 
                fontSize: '0.85rem', 
                fontWeight: 800, 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8
              }}
            >
              {t.allTools || 'View All Tools'} &rarr;
            </a>
          </li>
        )}
      </ul>
    );
  };

  return (
    <footer
      aria-label="Main Site Footer"
      style={{
        background: 'var(--bg-card)', 
        borderTop: '1px solid var(--border-color)',
        padding: '80px 0 0 0',
        marginTop: 100,
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 200, background: 'var(--brand-glow)', filter: 'blur(100px)', opacity: 0.5, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        
        {/* Top Section: Brand & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ background: 'var(--brand-gradient)', color: '#fff', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.6rem', boxShadow: '0 8px 20px var(--brand-glow)' }}>
              B
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
              HandleMyFile
            </span>
          </div>
          <p style={{ maxWidth: 500, color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500 }}>
            {t.brandDescription}
          </p>
        </div>

        {/* Tools Columns */}
        <div className="footer-tools-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 48,
            marginBottom: 80,
          }}
        >
          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.pdfTools}</h5>
            {renderToolList(pdfTools)}
          </div>

          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.compressTools}</h5>
            {renderToolList(compressTools)}
          </div>

          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.officeTools}</h5>
            {renderToolList(officeTools)}
          </div>

          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.imageTools}</h5>
            {renderToolList(imageTools)}
          </div>

          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Resources</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0 }}>
              <li>
                <button onClick={() => onNavigatePage?.('pricing')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerPricing || 'Pricing'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage?.('security')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerSecurity || 'Security & Trust'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage?.('use-cases')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerUseCases || 'Use Cases'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage?.('compare')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerCompare || 'Compare'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage?.('languages')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerLanguages || 'Supported Languages'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.footerCompany || 'Company'}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0 }}>
              <li>
                <button onClick={() => onNavigatePage?.('about')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerAbout || 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage?.('privacy')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerPrivacy || 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage?.('terms')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', padding: 0, fontWeight: 500 }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {t.footerTos || 'Terms of Service'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar Full Width */}
      <div style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border-color)', padding: '24px 32px' }}>
        <div className="footer-bottom"
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-main)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--brand-primary)' }} />
              {/* Sanitize potential encoding issues in translation string */}
              <span>{t.privacyBadge?.replace(/[^a-zA-Z0-9 %-]/g, '')?.trim() || '100% Client-Side Privacy'}</span>
            </div>
          </div>
          
          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            &copy; {new Date().getFullYear()} HandleMyFile Platform. Made with <Heart size={14} style={{ color: 'var(--brand-primary)', fill: 'var(--brand-primary)' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

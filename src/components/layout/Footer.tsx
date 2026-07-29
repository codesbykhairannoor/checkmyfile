import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { TOOLS_CATALOG, type ToolDefinition } from '../../catalog/toolsCatalog';
import { ShieldCheck, Heart, Mail } from 'lucide-react';

interface FooterProps {
  currentLang: string;
  onSelectTool: (tool: ToolDefinition) => void;
  onNavigatePage?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onSelectTool, onNavigatePage }) => {
  const t = getUiTranslations(currentLang);

  // Group 1: Popular Tools
  const popularIds = ['merge-pdf', 'split-pdf', 'compress-pdf', 'edit-pdf', 'sign-pdf'];
  const popularTools = popularIds.map(id => TOOLS_CATALOG.find(t => t.id === id)).filter(Boolean) as ToolDefinition[];

  // Group 2: Convert Tools
  const convertIds = ['pdf-to-word', 'word-to-pdf', 'image-to-pdf', 'excel-to-pdf', 'ocr-pdf'];
  const convertTools = convertIds.map(id => TOOLS_CATALOG.find(t => t.id === id)).filter(Boolean) as ToolDefinition[];

  const renderToolList = (tools: ToolDefinition[]) => {
    return (
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0, margin: 0 }}>
        {tools.map((tool) => {
          const displayTitle = tool.seo?.[currentLang]?.title || tool.seo?.['en']?.title || tool.id;
          return (
            <li key={tool.id}>
              <button
                onClick={() => onSelectTool(tool)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  padding: 0,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--brand-primary)';
                  e.currentTarget.style.transform = 'translateX(6px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {displayTitle}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderLinkItem = (label: string, slug: string) => (
    <li>
      <button
        onClick={() => onNavigatePage?.(slug)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.95rem',
          textAlign: 'left',
          transition: 'all 0.2s',
          padding: 0,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--brand-primary)';
          e.currentTarget.style.transform = 'translateX(6px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        {label}
      </button>
    </li>
  );

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
      <div 
        className="footer-grid-container"
        style={{ 
          maxWidth: 1440, 
          margin: '0 auto', 
          padding: '64px 32px',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: 48
        }}
      >
        {/* Column 1: Brand & Intro */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, userSelect: 'none' }}>
            <img src="/logo.png" alt="HandleMyFile Logo" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              HandleMyFile
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 8, paddingRight: 24 }}>
            The all-in-one platform to handle your documents securely. Edit, convert, and sign PDFs with 100% client-side privacy. Fast, free, and strictly confidential.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <button 
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                background: 'var(--brand-primary)', color: 'white', borderRadius: 8,
                border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Mail size={16} /> Contact Support
            </button>
          </div>
        </div>

        {/* Column 2: Popular Tools */}
        <div>
          <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Popular Tools</h5>
          {renderToolList(popularTools)}
        </div>

        {/* Column 3: Convert Tools */}
        <div>
          <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Convert & OCR</h5>
          {renderToolList(convertTools)}
        </div>

        {/* Column 4: Resources & Company */}
        <div>
          <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Company</h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0, margin: 0 }}>
            {renderLinkItem(t.footerAbout || 'About Us', 'about')}
            {renderLinkItem(t.footerPrivacy || 'Privacy Policy', 'privacy')}
            {renderLinkItem(t.footerTos || 'Terms of Service', 'terms')}
            {renderLinkItem(t.footerSecurity || 'Security & Trust', 'security')}
            {renderLinkItem(t.footerPricing || 'Pricing', 'pricing')}
            {renderLinkItem(t.footerCompare || 'Compare', 'compare')}
            {renderLinkItem(t.footerLanguages || 'Languages', 'languages')}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
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
              <span>{t.privacyBadge?.replace(/[^a-zA-Z0-9 %-]/g, '')?.trim() || '100% Client-Side Privacy'}</span>
            </div>
          </div>
          
          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            &copy; {new Date().getFullYear()} HandleMyFile Platform. Made with <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
          </div>
        </div>
      </div>
      
      {/* Mobile Styles (Using inline style tag to keep it self-contained) */}
      <style>{`
        @media (max-width: 992px) {
          .footer-grid-container {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 576px) {
          .footer-grid-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

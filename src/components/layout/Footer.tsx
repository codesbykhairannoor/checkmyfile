import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { TOOLS_CATALOG, getLocalizedSeo, type ToolDefinition } from '../../catalog/toolsCatalog';
import { ShieldCheck, Mail } from 'lucide-react';
import { getLocalizedStaticSlug, type StaticPageId } from '../../i18n/staticSlugs';

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
          const displayTitle = getLocalizedSeo(tool, currentLang).title || tool.id;
          const slug = tool.slugs[currentLang] || tool.id;
          const href = currentLang === 'en' ? `/${slug}` : `/${currentLang}/${slug}`;
          return (
            <li key={tool.id}>
              <a
                href={href}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    window.history.pushState({}, '', href);
                    onSelectTool(tool);
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  textDecoration: 'none',
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
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderLinkItem = (label: string, slug: string) => {
    const localizedSlug = getLocalizedStaticSlug(slug as StaticPageId, currentLang);
    const href = currentLang === 'en' ? `/${localizedSlug}` : `/${currentLang}/${localizedSlug}`;
    return (
      <li>
        <a
          href={href}
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
              e.preventDefault();
              window.history.pushState({}, '', href);
              onNavigatePage?.(slug);
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            textAlign: 'left',
            textDecoration: 'none',
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
        </a>
      </li>
    );
  };

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
              HandleMy<span className="gradient-text">File</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: 8, paddingRight: 24 }}>
            {t.brandDescription || 'The all-in-one platform to handle your documents securely. Edit, convert, and sign PDFs with 100% client-side privacy. Fast, free, and strictly confidential.'}
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
              <Mail size={16} /> {t.navSupportCenter || 'Contact Support'}
            </button>
          </div>
        </div>

        {/* Column 2: Popular Tools */}
        <div>
          <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.navAllPdfTools || 'Popular Tools'}</h5>
          {renderToolList(popularTools)}
        </div>

        {/* Column 3: Convert Tools */}
        <div>
          <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.ocrTools || 'Convert & OCR'}</h5>
          {renderToolList(convertTools)}
        </div>

        {/* Column 4: Resources & Company */}
        <div>
          <h5 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.footerCompany || 'Company'}</h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0, margin: 0 }}>
            {renderLinkItem(t.footerAbout || 'About Us', 'about')}
            {renderLinkItem(t.footerPrivacy || 'Privacy Policy', 'privacy')}
            {renderLinkItem(t.footerTos || 'Terms of Service', 'terms')}
            {renderLinkItem(t.footerSecurity || 'Security & Trust', 'security')}
            {renderLinkItem(t.footerPricing || 'Pricing', 'pricing')}
            {renderLinkItem(t.footerCompare || 'Compare', 'compare')}
            {renderLinkItem(t.footerLanguages || 'Languages', 'languages')}
            <li>
              <a
                href="https://discord.gg/NcWY6bcVdN"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#5865F2',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord Community</span>
              </a>
            </li>
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
              <span>{t.privacyBadge?.replace('🔒 ', '')?.trim() || '100% Client-Side Privacy'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="https://discord.gg/NcWY6bcVdN"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 9999,
                background: 'rgba(88, 101, 242, 0.1)',
                border: '1px solid rgba(88, 101, 242, 0.3)',
                color: '#5865F2',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Join Discord</span>
            </a>
            <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              &copy; {new Date().getFullYear()} HandleMyFile Platform. {t.footerRights || 'All rights reserved.'}
            </div>
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

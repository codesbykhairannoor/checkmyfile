import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { TOOLS_CATALOG, type ToolDefinition } from '../../catalog/toolsCatalog';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { ShieldCheck, Lock, Cpu, Globe, MapPin } from 'lucide-react';

interface FooterProps {
  currentLang: string;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onSelectTool }) => {
  const t = getUiTranslations(currentLang);

  const pdfTools = TOOLS_CATALOG.filter((i) => i.category === 'pdf');
  const compressTools = TOOLS_CATALOG.filter((i) => i.category === 'compress');
  const officeTools = TOOLS_CATALOG.filter((i) => i.category === 'office');
  const imageTools = TOOLS_CATALOG.filter((i) => i.category === 'image' || i.category === 'ocr');

  return (
    <footer
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        padding: '64px 24px 32px',
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Top Guarantee Banner */}
        <div
          className="glass-panel"
          style={{
            padding: 32,
            marginBottom: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            background: 'rgba(99, 102, 241, 0.04)',
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <ShieldCheck size={32} className="text-indigo-400 shrink-0" />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{t.privacyTitle}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.privacyText}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Cpu size={32} className="text-purple-400 shrink-0" />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>WebAssembly Client Memory</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Powered by low-level C/C++ compiled binaries (`pdf-lib`, `Tesseract.js`, `fflate`) running directly inside your browser memory for zero server latency.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Lock size={32} className="text-pink-400 shrink-0" />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 6 }}>No File Size Limits</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Because you use your own computer CPU and RAM offline, there are no artificial daily caps or megabyte limitations.
              </p>
            </div>
          </div>
        </div>

        {/* Tools Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            marginBottom: 48,
          }}
        >
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-accent)' }}>{t.pdfTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pdfTools.map((tool) => (
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
                      transition: 'color 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {tool.slugs[currentLang] || tool.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-accent)' }}>{t.compressTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {compressTools.map((tool) => (
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
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {tool.slugs[currentLang] || tool.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-accent)' }}>{t.officeTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {officeTools.map((tool) => (
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
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {tool.slugs[currentLang] || tool.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-accent)' }}>{t.imageTools} & {t.ocrTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {imageTools.map((tool) => (
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
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {tool.slugs[currentLang] || tool.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SUPER SEO & GEO: 30 Programmatic Language Directory for Search Engine Bots & Fast Human Navigation */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: 36,
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Globe size={20} className="text-indigo-400" />
            <h5 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
              30 Programmatic SEO & Geo Regions (Partial Lang URL Directory):
            </h5>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Every localized route (`/:lang/:slug`) automatically injects 30 `&lt;link rel="alternate" hreflang="..."&gt;` tags, `geo.region` metadata, and `FAQPage JSON-LD` schema to maximize global rankings.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
              gap: 8,
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <a
                key={lang.code}
                href={`/${lang.code}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', `/${lang.code}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: lang.code === currentLang ? 'var(--brand-glow)' : 'var(--bg-input)',
                  border: lang.code === currentLang ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  color: lang.code === currentLang ? 'var(--text-accent)' : 'var(--text-muted)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand-primary)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
                onMouseOut={(e) => {
                  if (lang.code !== currentLang) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                  <span>{lang.flag}</span>
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang.nativeName}</span>
                </div>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 800 }}>/{lang.code}/</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={16} />
            <span>100% Client-Side WebAssembly Execution • Files Never Leave Your Browser</span>
          </div>
          <div>© {new Date().getFullYear()} BlitzDocs Wasm Platform. {t.footerRights}</div>
        </div>
      </div>
    </footer>
  );
};

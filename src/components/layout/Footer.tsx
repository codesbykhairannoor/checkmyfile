import React from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { TOOLS_CATALOG, type ToolDefinition } from '../../catalog/toolsCatalog';
import { ShieldCheck } from 'lucide-react';

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
        background: 'var(--bg-app)', // Full width background matches app, but we'll use a distinct top border
        borderTop: '1px solid var(--border-color)',
        padding: '64px 0 0 0',
        marginTop: 80,
        width: '100%'
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
        
        {/* Top Section: Brand & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--brand-primary)', color: '#fff', width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem' }}>
              B
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
              BlitzDocs
            </span>
          </div>
          <p style={{ maxWidth: 500, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            100% Client-Side WebAssembly Document Platform. 
            All conversions are executed directly inside your browser memory for maximum privacy and zero server latency.
          </p>
        </div>

        {/* Tools Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 64,
          }}
        >
          <div>
            <h5 style={{ fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.pdfTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
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
                      padding: 0
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
            <h5 style={{ fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.compressTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
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
                      padding: 0
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
            <h5 style={{ fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.officeTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
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
                      padding: 0
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
            <h5 style={{ fontWeight: 800, marginBottom: 20, color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t.imageTools} & {t.ocrTools}</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}>
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
                      padding: 0
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
      </div>

      {/* Bottom Copyright Bar Full Width */}
      <div style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border-color)', padding: '24px 32px' }}>
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <ShieldCheck size={18} className="text-green-500" />
            <span>Files Never Leave Your Browser</span>
          </div>
          <div style={{ fontWeight: 500 }}>© {new Date().getFullYear()} BlitzDocs Platform. {t.footerRights}</div>
        </div>
      </div>
    </footer>
  );
};

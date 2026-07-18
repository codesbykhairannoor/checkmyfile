import React, { useState } from 'react';
import { getUiTranslations } from '../i18n/translations';
import { TOOLS_CATALOG, getLocalizedSeo, type ToolDefinition } from '../catalog/toolsCatalog';
import { SeoHead } from '../components/seo/SeoHead';
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
    <main style={{ maxWidth: 1440, margin: '0 auto', padding: '36px 24px' }}>
      <SeoHead lang={currentLang} />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: '32px 0 56px' }}>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display)',
            marginBottom: 18,
          }}
        >
          Semua Alat Dokumen <span className="gradient-text">&amp; PDF</span> di Satu Tempat
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: 780,
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          Gabung, pisah, kompres, konversi Word/Excel/PPT, hingga OCR langsung di peramban Anda. 
          100% diproses offline via WebAssembly. Gratis, tanpa batas ukuran, dan super aman.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <Icons.Search
            size={20}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              width: '100%',
              padding: '16px 20px 16px 54px',
              borderRadius: 9999,
              border: '1.5px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--brand-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <Icons.X size={18} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
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
              className="btn-secondary"
              style={{
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: selectedCategory === cat.id ? 'var(--brand-gradient)' : 'var(--bg-card)',
                color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-main)',
                border: selectedCategory === cat.id ? 'none' : '1px solid var(--border-color)',
                boxShadow: selectedCategory === cat.id ? '0 4px 15px var(--brand-glow)' : undefined,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {selectedCategory === 'all' ? t.allTools : selectedCategory.toUpperCase()} ({filteredTools.length})
          </h2>
        </div>

        {filteredTools.length === 0 ? (
          <div className="glass-panel" style={{ padding: 48, textAlign: 'center', margin: '32px 0' }}>
            <Icons.AlertCircle size={48} className="text-indigo-400" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Alat dengan kata kunci "{searchQuery}" tidak ditemukan</h3>
            <p style={{ color: 'var(--text-muted)' }}>Coba gunakan kata kunci lain atau pilih kategori Semua Alat.</p>
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
                  className="tool-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="tool-icon-wrapper">
                      <IconComponent size={24} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 9999,
                        background: 'var(--bg-input)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {tool.category}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
                      {seo.h1}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      {seo.description}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--text-accent)',
                    }}
                  >
                    <span>Coba Sekarang Offline</span>
                    <Icons.ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Zero Upload Guarantee Info Section */}
      <section style={{ marginTop: 80 }}>
        <div className="glass-panel" style={{ padding: 44, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Icons.ShieldAlert size={34} className="text-indigo-400" />
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {t.zeroUploadGuarantee}
            </h2>
          </div>
          <p style={{ fontSize: '1.02rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 960 }}>
            {t.zeroUploadDetails}
          </p>
        </div>
      </section>
    </main>
  );
};

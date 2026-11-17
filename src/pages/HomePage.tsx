import React, { useState } from 'react';
import { SlidersHorizontal,
  Search, X, SearchX, ArrowRight, ShieldCheck, Check,
  Combine, PenTool, Scissors, RotateCw, Hash, Stamp, Trash2,
  LayoutList, Lock, Unlock, Crop, Images, Contrast, Eraser, Scale,
  ScanLine, EyeOff, ArrowDownUp, Maximize, FileText, ListOrdered,
  FileSpreadsheet, Presentation, AlignLeft, Table, ScanText, Image, Minimize2, FolderArchive,
  Zap, HardDrive, Cpu, Shield, Sparkles, HelpCircle
} from 'lucide-react';
import { getUiTranslations } from '../i18n/translations';
import { TOOLS_CATALOG, getLocalizedSeo, type ToolDefinition } from '../catalog/toolsCatalog';
import { SeoHead } from '../components/seo/SeoHead';
import { smartHighlight } from '../utils/textFormatting';
import { ResearchGroundingSection } from '../components/seo-sections/ResearchGroundingSection';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string; strokeWidth?: number }>> = {
  Combine, PenTool, Scissors, RotateCw, Hash, Stamp, Trash2,
  LayoutList, Lock, Unlock, Crop, Images, Contrast, Eraser, Scale,
  ScanLine, EyeOff, ArrowDownUp, Maximize, FileText, ListOrdered,
  FileSpreadsheet, Presentation, AlignLeft, Table, ScanText, Image, Minimize2, FolderArchive
};

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

      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        paddingTop: 'clamp(56px, 10vw, 96px)', 
        paddingBottom: '40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          


          {/* Monumental Headline */}
          <h1
            className="homepage-hero-title"
            style={{ 
              fontSize: 'clamp(2.5rem, 5.2vw, 4.5rem)', 
              fontWeight: 900, 
              letterSpacing: '-0.03em', 
              lineHeight: 1.15,
              color: 'var(--text-main)',
              marginBottom: 24,
              fontFamily: 'var(--font-display)',
              maxWidth: 1440,
              margin: '0 auto 24px'
            }}
          >
            {smartHighlight(t.homeHeroTitle || 'All Your Document Tools. 100% Private.')}
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
            <Search
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
                <X size={16} />
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
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {selectedCategory === 'all' ? t.allTools : selectedCategory.toUpperCase()} 
              <span style={{ marginLeft: 12, color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.4rem' }}>({filteredTools.length})</span>
            </h2>
          </div>

          {filteredTools.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '60px 24px', borderRadius: 40, border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: 80, height: 80, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <SearchX size={36} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{t.homeSearchNotFound || 'No tools found matching'} "{searchQuery}"</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{t.homeSearchNotFoundDesc || 'Try using different keywords or select the All Tools category.'}</p>
            </div>
          ) : (
            <div className="tools-grid">
              {filteredTools.map((tool: ToolDefinition) => {
                const seo = getLocalizedSeo(tool, currentLang);
                const IconComponent = ICON_MAP[tool.iconName] || FileText;

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
                      <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.4rem)', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
                        {seo.h1}
                      </h3>
                      <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                        {seo.description}
                      </p>
                    </div>

                    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      <span>{t.homeTryNow || 'Try Now Offline'}</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 100% Client-Side Sandbox Showcase Section */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-app)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div className="glass-panel" style={{ 
            borderRadius: 36, 
            padding: 'clamp(36px, 6vw, 64px)', 
            position: 'relative', 
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 48, alignItems: 'center' }}>
              
              {/* Left Column: Core Guarantee */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(225, 29, 72, 0.25)', background: 'rgba(225, 29, 72, 0.08)', color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
                  <ShieldCheck size={14} color="var(--brand-primary)" />
                  100% CLIENT-SIDE SANDBOX
                </div>

                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 20, fontFamily: 'var(--font-display)', lineHeight: 1.15, color: 'var(--text-main)' }}>
                  {t.zeroUploadGuarantee}
                </h2>

                <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32, fontWeight: 500 }}>
                  {t.zeroUploadDetails}
                </p>

                {/* 3 Trust Feature Chips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Zap size={15} />
                    </div>
                    <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {currentLang === 'id' ? 'Pemrosesan C/C++ WebAssembly instan di RAM browser Anda' : 'Instant C/C++ WebAssembly execution inside browser RAM'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Shield size={15} />
                    </div>
                    <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {currentLang === 'id' ? '0 Kilobyte data dikirim ke cloud — dokumen tidak pernah bocor' : '0 Kilobytes uploaded to the cloud — zero data leakage risk'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <HardDrive size={15} />
                    </div>
                    <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {currentLang === 'id' ? 'Berjalan 100% offline saat internet terputus atau mode pesawat' : 'Runs 100% offline — works seamlessly in airplane mode'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Architecture Terminal Card */}
              <div style={{
                background: 'var(--bg-app)',
                borderRadius: 24,
                border: '1px solid var(--border-color)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {currentLang === 'id' ? 'Sandbox Browser Lokal' : 'Local Browser Sandbox'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    0% CLOUD EGRESS
                  </span>
                </div>

                {/* 3 Pipeline Stream Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FileText size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>1. File Ingestion</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Local Uint8Array Buffer in Device RAM</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>0 KB Sent</span>
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Cpu size={18} color="#8b5cf6" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>2. WebAssembly Engine Core</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Sandboxed C++ / Rust Processing Pipeline</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8b5cf6' }}>Active WASM</span>
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>3. Direct Memory Export</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Instant Blob URL Generation & Download</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>Completed</span>
                  </div>
                </div>

                {/* Footer Telemetry */}
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', paddingTop: 6 }}>
                  🔒 {currentLang === 'id' ? 'Diproses 100% aman tanpa perantara server pihak ketiga' : '100% client-side security verified with zero remote telemetry'}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* GEO SECTIONS: Definitions & Trust Bento Grid */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))', gap: 32 }}>
            
            {/* Bento Card 1: What is HandleMyFile? */}
            <div 
              className="glass-panel"
              style={{
                borderRadius: 28,
                padding: 'clamp(32px, 5vw, 44px)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 24,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(225, 29, 72, 0.25)' }}>
                    <FileText size={24} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 9999, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ARCHITECTURE & PLATFORM
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--text-main)' }}>
                  {t.homeGeoDefTitle || 'What is HandleMyFile?'}
                </h2>

                <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                  {t.homeGeoDefDesc || 'HandleMyFile is a 100% client-side document processing application that allows users to edit, convert, merge, and compress PDF and Office files directly in the browser. By leveraging WebAssembly (WASM), it processes all data locally on your device without uploading anything to external servers, ensuring absolute privacy and enterprise-grade security.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  ✨ 30+ Free Web Tools
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  ⚡ WebAssembly (WASM)
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  🚫 No Sign-Up Needed
                </span>
              </div>
            </div>

            {/* Bento Card 2: Why is this 100% Secure & Private? */}
            <div 
              className="glass-panel"
              style={{
                borderRadius: 28,
                padding: 'clamp(32px, 5vw, 44px)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 24,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 9999, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    DATA PRIVACY & COMPLIANCE
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--text-main)' }}>
                  {t.homeGeoTrustTitle || 'Why is this 100% Secure & Private?'}
                </h2>

                <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                  {t.homeGeoTrustDesc || 'Unlike traditional cloud-based PDF tools that require you to upload sensitive documents to their servers, HandleMyFile executes all algorithms inside your browser\'s secure sandbox. The application uses WebAssembly and JavaScript TypedArrays to manipulate files locally. This architecture guarantees zero data leakage. For more technical details on our security audits and practices, visit our '}{' '}
                  <a href={`/${currentLang === 'en' ? '' : currentLang + '/'}about`} style={{ color: 'var(--brand-primary)', textDecoration: 'underline', fontWeight: 700 }}>
                    {currentLang === 'id' ? 'Halaman Tentang Kami' : 'About Page'}
                  </a>.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  🛡️ Zero Server Uploads
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  🔒 ISO 32000-2 Compliant
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  🛡️ Zero Data Leakage
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Research & Scientific Grounding Section */}
      <ResearchGroundingSection lang={currentLang} />

      {/* GEO SECTIONS: Key Takeaways & FAQ */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-app)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: 56, alignItems: 'start' }}>
          
          {/* Key Takeaways Column */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 9999, background: 'rgba(225, 29, 72, 0.08)', color: 'var(--brand-primary)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              <Check size={13} strokeWidth={3} />
              EXECUTIVE SUMMARY
            </div>

            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 28, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-main)' }}>
              {t.homeGeoTakeawaysTitle || 'Key Takeaways'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                t.homeGeoTakeawaysItem1 || 'Process PDFs and Office files locally in your browser memory.',
                t.homeGeoTakeawaysItem2 || 'Zero file uploads required, ensuring total data privacy.',
                t.homeGeoTakeawaysItem3 || 'Powered by WebAssembly for high-speed offline conversions.'
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="glass-panel"
                  style={{ 
                    padding: '20px 22px', 
                    borderRadius: 18, 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16 
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Trust Badge */}
            <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 16, background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {currentLang === 'id' ? 'Standar Dokumen ISO 32000-2 • Bebas risiko kebocoran data di server cloud' : 'ISO 32000-2 Certified • Zero risk of cloud storage breaches'}
              </span>
            </div>
          </div>

          {/* FAQs Column */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 9999, background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              <HelpCircle size={13} />
              COMMON QUESTIONS
            </div>

            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 28, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-main)' }}>
              {t.homeGeoFaqTitle || 'Frequently Asked Questions'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { 
                  q: t.homeGeoFaq1Q || 'How does HandleMyFile work without a server?', 
                  a: t.homeGeoFaq1A || 'It utilizes WebAssembly (WASM) to run heavy C++ and Rust processing libraries directly inside your web browser engine.'
                },
                { 
                  q: t.homeGeoFaq2Q || 'Are there any file size limits?', 
                  a: t.homeGeoFaq2A || 'No. Since processing happens on your local device, the only limit is your computer\'s available RAM.'
                },
                { 
                  q: t.homeGeoFaq3Q || 'Is this safe for confidential company documents?', 
                  a: t.homeGeoFaq3A || 'Yes, it is the safest method available. Files never leave your device and are never transmitted over the internet.'
                },
                { 
                  q: t.homeGeoFaq4Q || 'Does it work entirely offline?', 
                  a: t.homeGeoFaq4A || 'Yes. Once the web application loads in your browser, you can disconnect from the internet and continue processing files.'
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className="glass-panel"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 20,
                    padding: '22px 24px',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <h3 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.28rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4, fontFamily: 'var(--font-display)' }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

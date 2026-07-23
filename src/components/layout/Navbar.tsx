import React, { useState, useRef, useEffect } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';
import {
  Sun, Moon, FileText, ChevronDown, ChevronUp, Grid,
  Combine, Scissors, Minimize2, FileSpreadsheet, LayoutList, Crop,
  ScanText, ScanLine, Eraser, Scale, EyeOff, RotateCw, Hash, Stamp,
  Presentation, AlignLeft, TableProperties, Image, Images, Trash2,
  PenTool, Lock, Unlock, Contrast, Maximize, ArrowDownUp, Edit3,
  Menu, X,
} from 'lucide-react';
import { getToolById, type ToolDefinition } from '../../catalog/toolsCatalog';
import { UI_TRANSLATIONS } from '../../i18n/translations';

interface NavbarProps {
  currentLang: string;
  onSelectLang: (code: string) => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onSelectTool?: (tool: ToolDefinition) => void;
}

// Helper: compact mega menu item (icon + label only, no description)
const MI: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}> = ({ icon: Icon, label, onClick, highlight }) => (
  <div
    onClick={onClick}
    className="mega-menu-item"
    style={highlight ? { background: 'rgba(59,130,246,0.04)', borderColor: 'rgba(59,130,246,0.15)' } : {}}
  >
    <Icon size={15} style={{ flexShrink: 0, color: highlight ? 'var(--brand-primary)' : undefined }} />
    <span className="item-title" style={highlight ? { color: 'var(--brand-primary)' } : {}}>{label}</span>
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  isLightMode,
  onToggleTheme,
  onNavigateHome,
  onSelectTool,
}) => {
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAllOpen, setIsMobileAllOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = UI_TRANSLATIONS[currentLang] ?? UI_TRANSLATIONS['en'];
  const en = UI_TRANSLATIONS['en'];

  // Nav category labels using partial translations with English fallbacks
  const NAV = {
    allPdfTools:  t.navAllPdfTools ?? en.navAllPdfTools ?? 'ALL PDF TOOLS',
    organize:     t.navOrganizePdf ?? en.navOrganizePdf ?? '📁 ORGANIZE PDF',
    optimize:     t.navOptimizeEnhance ?? en.navOptimizeEnhance ?? '⚡ OPTIMIZE & ENHANCE',
    spreadsheet:  t.navSpreadsheetTools ?? en.navSpreadsheetTools ?? '📊 SPREADSHEET TOOLS',
    security:     t.navSecuritySign ?? en.navSecuritySign ?? '🔐 SECURITY & SIGN',
    fromPdf:      t.navConvertFromPdf ?? en.navConvertFromPdf ?? '📑 CONVERT FROM PDF',
    toPdf:        t.navConvertToPdf ?? en.navConvertToPdf ?? '🔄 CONVERT TO PDF',
    moreTools:    t.navMoreTools ?? en.navMoreTools ?? '🔧 MORE PDF TOOLS',
  };

  const handleToolClick = (toolId: string) => {
    setIsMegaOpen(false);
    setIsMobileMenuOpen(false);
    const tool = getToolById(toolId);
    if (tool && onSelectTool) onSelectTool(tool);
    else onNavigateHome();
  };

  // Hover mega menu with delay to prevent flicker
  const handleMegaEnter = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setIsMegaOpen(true);
  };
  const handleMegaLeave = () => {
    megaTimerRef.current = setTimeout(() => setIsMegaOpen(false), 120);
  };

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <header
      ref={navRef}
      aria-label="Main Site Header"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.12)',
        fontFamily: 'var(--font-main)',
      }}
    >
      {/* ── Main bar ── */}
      <div style={{
        padding: '0 24px',
        maxWidth: 1440, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 20, height: 60,
      }}>

        {/* Left: Logo + Quick Nav + Hover Mega */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Brand */}
          <div onClick={onNavigateHome} aria-label="Navigate to Home" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 16px var(--brand-glow)', flexShrink: 0 }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                HandleMyFile <span className="gradient-text">⚡</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                100% Client-Side Wasm
              </div>
            </div>
          </div>

          {/* Desktop Quick Tabs */}
          <nav aria-label="Desktop Quick Navigation" className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { id: 'merge-pdf', label: 'MERGE PDF' },
              { id: 'split-pdf', label: 'SPLIT PDF' },
              { id: 'compress-pdf', label: 'COMPRESS PDF' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleToolClick(id)}
                className="nav-tab-btn"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '6px 12px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em' }}
              >
                {label}
              </button>
            ))}

            {/* ALL PDF TOOLS — hover dropdown trigger */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <button
                style={{
                  background: isMegaOpen ? 'var(--brand-gradient)' : 'rgba(225,29,72,0.1)',
                  color: isMegaOpen ? '#fff' : 'var(--text-accent)',
                  border: '1px solid rgba(225,29,72,0.3)',
                  padding: '6px 14px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s', letterSpacing: '0.02em',
                  boxShadow: isMegaOpen ? '0 4px 14px var(--brand-glow)' : 'none',
                }}
              >
                <Grid size={15} />
                {NAV.allPdfTools}
                {isMegaOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaOpen && (
                <div
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                  style={{
                    position: 'fixed',
                    top: 60, left: 0, right: 0,
                    background: 'var(--bg-card)',
                    borderBottom: '2px solid var(--brand-primary)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                    padding: '24px',
                    zIndex: 200,
                    animation: 'fadeInDown 0.15s ease',
                  }}
                >
                  <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    {/* Col 1: Organize PDF — 7 items */}
                    <div className="mega-menu-col">
                      <div className="mega-menu-title">{NAV.organize}</div>
                      <MI icon={Combine}    label="Merge PDF"     onClick={() => handleToolClick('merge-pdf')} />
                      <MI icon={Scissors}   label="Split PDF"     onClick={() => handleToolClick('split-pdf')} />
                      <MI icon={RotateCw}   label="Rotate PDF"    onClick={() => handleToolClick('rotate-pdf')} />
                      <MI icon={Hash}       label="Page Numbers"  onClick={() => handleToolClick('page-numbers')} />
                      <MI icon={Trash2}     label="Remove Pages"  onClick={() => handleToolClick('remove-pdf')} />
                      <MI icon={LayoutList} label="Organize PDF"  onClick={() => handleToolClick('organize-pdf')} />
                      <MI icon={Crop}       label="Crop PDF"      onClick={() => handleToolClick('crop-pdf')} />
                    </div>

                    {/* Col 2: Optimize & Spreadsheet — 8 items */}
                    <div className="mega-menu-col">
                      <div className="mega-menu-title">{NAV.optimize}</div>
                      <MI icon={Edit3}      label="Edit PDF"          onClick={() => handleToolClick('edit-pdf')} />
                      <MI icon={Minimize2}  label="Compress PDF"      onClick={() => handleToolClick('compress-pdf')} />
                      <MI icon={ScanText}   label="OCR PDF to Text"   onClick={() => handleToolClick('ocr-pdf')} />
                      <MI icon={Contrast}   label="Grayscale PDF"     onClick={() => handleToolClick('grayscale-pdf')} />
                      <MI icon={ScanLine}   label="Scan to PDF"       onClick={() => handleToolClick('scan-to-pdf')} />
                      <MI icon={Eraser}     label="Remove Metadata"   onClick={() => handleToolClick('remove-pdf-metadata')} />
                      <div className="mega-menu-title" style={{ marginTop: 12 }}>{NAV.spreadsheet}</div>
                      <MI icon={TableProperties} label="CSV to Excel (.xlsx)" onClick={() => handleToolClick('csv-to-excel')} />
                      <MI icon={FileText}        label="Excel to CSV"         onClick={() => handleToolClick('excel-to-csv')} />
                    </div>

                    {/* Col 3: Security & Convert From — 8 items */}
                    <div className="mega-menu-col">
                      <div className="mega-menu-title">{NAV.security}</div>
                      <MI icon={Stamp}       label="Watermark PDF"      onClick={() => handleToolClick('watermark-pdf')} />
                      <MI icon={PenTool}     label="Sign PDF"           onClick={() => handleToolClick('sign-pdf')} />
                      <MI icon={Lock}        label="Protect PDF"        onClick={() => handleToolClick('protect-pdf')} />
                      <MI icon={Unlock}      label="Unlock PDF"         onClick={() => handleToolClick('unlock-pdf')} />
                      <MI icon={EyeOff}      label="Redact PDF"         onClick={() => handleToolClick('redact-pdf')} />
                      <div className="mega-menu-title" style={{ marginTop: 12 }}>{NAV.fromPdf}</div>
                      <MI icon={Presentation} label="PDF to POWERPOINT" onClick={() => handleToolClick('pdf-to-ppt')} />
                      <MI icon={Images}       label="PDF to JPG / PNG"  onClick={() => handleToolClick('pdf-to-image')} />
                      <MI icon={Image}        label="Extract Images"    onClick={() => handleToolClick('extract-images-pdf')} />
                    </div>

                    {/* Col 4: Convert To PDF + More Tools — 7 items */}
                    <div className="mega-menu-col">
                      <div className="mega-menu-title">{NAV.toPdf}</div>
                      <MI icon={FileSpreadsheet} label="EXCEL to PDF"       onClick={() => handleToolClick('excel-to-pdf')} />
                      <MI icon={Presentation}    label="POWERPOINT to PDF"  onClick={() => handleToolClick('ppt-to-pdf')} />
                      <MI icon={Image}           label="JPG / PNG to PDF"   onClick={() => handleToolClick('image-to-pdf')} />
                      <MI icon={AlignLeft}       label="TXT to PDF"         onClick={() => handleToolClick('txt-to-pdf')} />
                      <div className="mega-menu-title" style={{ marginTop: 12 }}>{NAV.moreTools}</div>
                      <MI icon={Scale}       label="Compare PDF"  onClick={() => handleToolClick('compare-pdf')} />
                      <MI icon={Maximize}    label="Resize PDF"   onClick={() => handleToolClick('resize-pdf')} />
                      <MI icon={ArrowDownUp} label="Reverse PDF"  onClick={() => handleToolClick('reverse-pdf')} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Theme + Lang (Desktop) */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onToggleTheme}
            style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isLightMode ? '#fef3c7' : '#1e1b4b', color: isLightMode ? '#d97706' : '#a855f7', border: `1.5px solid ${isLightMode ? '#f59e0b' : '#6366f1'}`, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
            title={isLightMode ? 'Dark Mode' : 'Light Mode'}
          >
            {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <LocaleSwitcher
            currentLang={currentLang}
            onSelectLang={onSelectLang}
            isOpen={isDesktopLangOpen}
            onClose={() => setIsDesktopLangOpen(false)}
            onOpen={() => setIsDesktopLangOpen(true)}
          />
        </div>

        {/* Mobile top-right controls */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onToggleTheme}
            style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isLightMode ? '#fef3c7' : '#1e1b4b', color: isLightMode ? '#d97706' : '#a855f7', border: `1.5px solid ${isLightMode ? '#f59e0b' : '#6366f1'}`, cursor: 'pointer' }}
          >
            {isLightMode ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <LocaleSwitcher
            currentLang={currentLang}
            onSelectLang={onSelectLang}
            isOpen={isMobileLangOpen}
            onClose={() => setIsMobileLangOpen(false)}
            onOpen={() => setIsMobileLangOpen(true)}
          />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: isMobileMenuOpen ? 'var(--brand-primary)' : 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: isMobileMenuOpen ? 'white' : 'var(--text-main)', cursor: 'pointer', display: 'flex', padding: 7 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-container"
          style={{ position: 'absolute', top: 60, left: 0, right: 0, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', padding: '16px 16px 28px', maxHeight: 'calc(100vh - 60px)', overflowY: 'auto', zIndex: 40, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          {/* Quick 3 buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { id: 'merge-pdf', label: 'Merge' },
              { id: 'split-pdf', label: 'Split' },
              { id: 'compress-pdf', label: 'Compress' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => handleToolClick(id)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: 8, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.82rem', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Accordion: All Tools */}
          <button
            onClick={() => setIsMobileAllOpen(!isMobileAllOpen)}
            style={{ width: '100%', background: 'var(--brand-gradient)', color: '#fff', border: 'none', padding: '11px 16px', borderRadius: 8, fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: isMobileAllOpen ? 12 : 0 }}
          >
            <span>{NAV.allPdfTools}</span>
            {isMobileAllOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isMobileAllOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { section: NAV.organize, tools: [
                  { id: 'merge-pdf', label: 'Merge PDF', Icon: Combine },
                  { id: 'split-pdf', label: 'Split PDF', Icon: Scissors },
                  { id: 'rotate-pdf', label: 'Rotate PDF', Icon: RotateCw },
                  { id: 'page-numbers', label: 'Page Numbers', Icon: Hash },
                  { id: 'remove-pdf', label: 'Remove Pages', Icon: Trash2 },
                  { id: 'organize-pdf', label: 'Organize PDF', Icon: LayoutList },
                  { id: 'crop-pdf', label: 'Crop PDF', Icon: Crop },
                  { id: 'compare-pdf', label: 'Compare PDF', Icon: Scale },
                  { id: 'resize-pdf', label: 'Resize PDF', Icon: Maximize },
                  { id: 'reverse-pdf', label: 'Reverse PDF', Icon: ArrowDownUp },
                ]},
                { section: NAV.optimize, tools: [
                  { id: 'edit-pdf', label: 'Edit PDF', Icon: Edit3 },
                  { id: 'compress-pdf', label: 'Compress PDF', Icon: Minimize2 },
                  { id: 'ocr-pdf', label: 'OCR to Text', Icon: ScanText },
                  { id: 'grayscale-pdf', label: 'Grayscale PDF', Icon: Contrast },
                  { id: 'scan-to-pdf', label: 'Scan to PDF', Icon: ScanLine },
                  { id: 'remove-pdf-metadata', label: 'Remove Metadata', Icon: Eraser },
                ]},
                { section: NAV.spreadsheet, tools: [
                  { id: 'csv-to-excel', label: 'CSV to Excel', Icon: TableProperties },
                  { id: 'excel-to-csv', label: 'Excel to CSV', Icon: FileText },
                ]},
                { section: NAV.security, tools: [
                  { id: 'watermark-pdf', label: 'Watermark PDF', Icon: Stamp },
                  { id: 'sign-pdf', label: 'Sign PDF', Icon: PenTool },
                  { id: 'protect-pdf', label: 'Protect PDF', Icon: Lock },
                  { id: 'unlock-pdf', label: 'Unlock PDF', Icon: Unlock },
                  { id: 'redact-pdf', label: 'Redact PDF', Icon: EyeOff },
                ]},
                { section: NAV.fromPdf, tools: [
                  { id: 'pdf-to-ppt', label: 'PDF to PPTX', Icon: Presentation },
                  { id: 'pdf-to-image', label: 'PDF to JPG/PNG', Icon: Images },
                  { id: 'extract-images-pdf', label: 'Extract Images', Icon: Image },
                ]},
                { section: NAV.toPdf, tools: [
                  { id: 'excel-to-pdf', label: 'Excel to PDF', Icon: FileSpreadsheet },
                  { id: 'ppt-to-pdf', label: 'PPTX to PDF', Icon: Presentation },
                  { id: 'image-to-pdf', label: 'JPG/PNG to PDF', Icon: Image },
                  { id: 'txt-to-pdf', label: 'TXT to PDF', Icon: AlignLeft },
                ]},
              ].map(group => (
                <div key={group.section}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-accent)', letterSpacing: '0.06em', marginTop: 8, marginBottom: 8, paddingBottom: 6, borderBottom: '1px dashed var(--border-color)' }}>
                    {group.section}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {group.tools.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleToolClick(id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '9px 11px', borderRadius: 8, fontWeight: 600, color: 'var(--text-main)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <Icon size={13} color="var(--brand-primary)" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .nav-tab-btn:hover {
          color: var(--text-accent) !important;
          background: rgba(225, 29, 72, 0.08) !important;
        }
        .mega-menu-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mega-menu-title {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--text-accent);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 7px;
        }
        .mega-menu-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 9px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--text-main);
          border: 1px solid transparent;
        }
        .mega-menu-item:hover {
          background: var(--bg-card-hover, rgba(225,29,72,0.05));
          border-color: rgba(225,29,72,0.25);
          transform: translateX(3px);
        }
        .mega-menu-item .item-title {
          font-size: 0.87rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }
        .mega-menu-item:hover .item-title {
          color: var(--text-accent);
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
          .mobile-menu-container { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only, .mobile-menu-container { display: none !important; }
          .desktop-only { display: flex !important; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

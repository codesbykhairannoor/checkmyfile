import React, { useState, useRef, useEffect } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Sun, Moon, FileText, ChevronDown, ChevronUp, Grid, Combine, Scissors, Minimize2, RotateCw, Hash, Stamp, FileSpreadsheet, Presentation, AlignLeft, Table, Image, Images, ScanText } from 'lucide-react';
import { TOOLS_CATALOG, getToolById, type ToolDefinition } from '../../catalog/toolsCatalog';

interface NavbarProps {
  currentLang: string;
  onSelectLang: (code: string) => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onSelectTool?: (tool: ToolDefinition) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  isLightMode,
  onToggleTheme,
  onNavigateHome,
  onSelectTool,
}) => {
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsAllToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (toolId: string) => {
    setIsAllToolsOpen(false);
    const tool = getToolById(toolId);
    if (tool && onSelectTool) {
      onSelectTool(tool);
    } else {
      onNavigateHome();
    }
  };

  return (
    <header
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.15)',
        fontFamily: 'var(--font-main)',
      }}
    >
      <div
        style={{
          padding: '14px 24px',
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        {/* Left Section: Brand & Main Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* Brand Logo */}
          <div
            onClick={onNavigateHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 16px var(--brand-glow)',
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
                BlitzDocs <span className="gradient-text">⚡</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                100% Client-Side Wasm
              </div>
            </div>
          </div>

          {/* Top Bar Navigation Tabs (iLovePDF Style) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => handleToolClick('merge-pdf')}
              className="nav-tab-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              MERGE PDF
            </button>

            <button
              onClick={() => handleToolClick('split-pdf')}
              className="nav-tab-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              SPLIT PDF
            </button>

            <button
              onClick={() => handleToolClick('compress-pdf')}
              className="nav-tab-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              COMPRESS PDF
            </button>

            {/* ALL PDF TOOLS Mega Menu Button */}
            <button
              onClick={() => {
                setIsAllToolsOpen(!isAllToolsOpen);
              }}
              style={{
                background: isAllToolsOpen ? 'var(--brand-gradient)' : 'rgba(225, 29, 72, 0.1)',
                color: isAllToolsOpen ? '#fff' : 'var(--text-accent)',
                border: '1px solid rgba(225, 29, 72, 0.3)',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
                boxShadow: isAllToolsOpen ? '0 4px 14px var(--brand-glow)' : 'none',
              }}
            >
              <Grid size={16} />
              <span>ALL PDF TOOLS</span>
              {isAllToolsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </nav>
        </div>

        {/* Right Section: Mode Toggle Icon, Language Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onToggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              background: isLightMode ? '#fef3c7' : '#1e1b4b',
              color: isLightMode ? '#d97706' : '#a855f7',
              border: `1.5px solid ${isLightMode ? '#f59e0b' : '#6366f1'}`,
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
            }}
            title={isLightMode ? 'Beralih ke Dark Mode' : 'Beralih ke Light Mode'}
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <LocaleSwitcher
            currentLang={currentLang}
            onSelectLang={onSelectLang}
            isOpen={isLangModalOpen}
            onClose={() => setIsLangModalOpen(false)}
            onOpen={() => setIsLangModalOpen(true)}
          />
        </div>
      </div>

      {/* MEGA MENU: ALL PDF TOOLS PANEL (iLovePDF Full Grid) */}
      {isAllToolsOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            borderBottom: '2px solid var(--brand-primary)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            padding: '32px 24px',
            animation: 'fadeInDown 0.2s ease out',
            zIndex: 100,
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Grid className="text-accent" size={24} />
                <span>All Client-Side Wasm Tools ({TOOLS_CATALOG.length} Tools Available)</span>
              </h3>
              <button
                onClick={() => setIsAllToolsOpen(false)}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '6px 14px' }}
              >
                ✕ Close Menu
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
              {/* Column 1: Organize PDF */}
              <div className="mega-menu-col">
                <div className="mega-menu-title">📁 ORGANIZE PDF</div>
                <div onClick={() => handleToolClick('merge-pdf')} className="mega-menu-item">
                  <Combine size={18} />
                  <div>
                    <div className="item-title">Merge PDF</div>
                    <div className="item-desc">Combine multiple PDFs in order</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('split-pdf')} className="mega-menu-item">
                  <Scissors size={18} />
                  <div>
                    <div className="item-title">Split PDF</div>
                    <div className="item-desc">Extract pages or split ranges</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('rotate-pdf')} className="mega-menu-item">
                  <RotateCw size={18} />
                  <div>
                    <div className="item-title">Rotate PDF</div>
                    <div className="item-desc">Turn pages 90° or 180°</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('page-numbers')} className="mega-menu-item">
                  <Hash size={18} />
                  <div>
                    <div className="item-title">Page Numbers</div>
                    <div className="item-desc">Add page numbers to header/footer</div>
                  </div>
                </div>
              </div>

              {/* Column 2: Optimize PDF */}
              <div className="mega-menu-col">
                <div className="mega-menu-title">⚡ OPTIMIZE PDF</div>
                <div onClick={() => handleToolClick('compress-pdf')} className="mega-menu-item">
                  <Minimize2 size={18} />
                  <div>
                    <div className="item-title">Compress PDF</div>
                    <div className="item-desc">Shrink file size up to 90%</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('ocr-pdf')} className="mega-menu-item">
                  <ScanText size={18} />
                  <div>
                    <div className="item-title">OCR PDF to Text</div>
                    <div className="item-desc">Extract text from scans locally</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('watermark-pdf')} className="mega-menu-item">
                  <Stamp size={18} />
                  <div>
                    <div className="item-title">Watermark PDF</div>
                    <div className="item-desc">Stamp custom text watermarks</div>
                  </div>
                </div>
              </div>

              {/* Column 3: Convert TO PDF */}
              <div className="mega-menu-col">
                <div className="mega-menu-title">🔄 CONVERT TO PDF</div>
                <div onClick={() => handleToolClick('word-to-pdf')} className="mega-menu-item">
                  <FileText size={18} />
                  <div>
                    <div className="item-title">WORD to PDF</div>
                    <div className="item-desc">Convert .docx to clean PDF</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('excel-to-pdf')} className="mega-menu-item">
                  <FileSpreadsheet size={18} />
                  <div>
                    <div className="item-title">EXCEL to PDF</div>
                    <div className="item-desc">Spreadsheets to PDF tables</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('ppt-to-pdf')} className="mega-menu-item">
                  <Presentation size={18} />
                  <div>
                    <div className="item-title">POWERPOINT to PDF</div>
                    <div className="item-desc">Slides to printable PDF</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('image-to-pdf')} className="mega-menu-item">
                  <Image size={18} />
                  <div>
                    <div className="item-title">JPG / PNG to PDF</div>
                    <div className="item-desc">Combine photos into PDF</div>
                  </div>
                </div>

                <div onClick={() => handleToolClick('txt-to-pdf')} className="mega-menu-item">
                  <AlignLeft size={18} />
                  <div>
                    <div className="item-title">TXT to PDF</div>
                    <div className="item-desc">Plain text & logs to PDF</div>
                  </div>
                </div>
              </div>

              {/* Column 4: Convert FROM PDF */}
              <div className="mega-menu-col">
                <div className="mega-menu-title">📑 CONVERT FROM PDF</div>
                <div onClick={() => handleToolClick('pdf-to-word')} className="mega-menu-item">
                  <FileText size={18} />
                  <div>
                    <div className="item-title">PDF to WORD (.docx)</div>
                    <div className="item-desc">100% layout & font preservation</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('pdf-to-ppt')} className="mega-menu-item">
                  <Presentation size={18} />
                  <div>
                    <div className="item-title">PDF to POWERPOINT</div>
                    <div className="item-desc">Editable PPTX slides</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('pdf-to-image')} className="mega-menu-item">
                  <Images size={18} />
                  <div>
                    <div className="item-title">PDF to JPG / PNG</div>
                    <div className="item-desc">Extract all pages to ZIP</div>
                  </div>
                </div>
              </div>



              {/* Column 6: Spreadsheet Tools */}
              <div className="mega-menu-col">
                <div className="mega-menu-title">📊 SPREADSHEET TOOLS</div>
                <div onClick={() => handleToolClick('csv-to-excel')} className="mega-menu-item">
                  <Table size={18} />
                  <div>
                    <div className="item-title">CSV to Excel (.xlsx)</div>
                    <div className="item-desc">Instant multi-column SheetJS</div>
                  </div>
                </div>
                <div onClick={() => handleToolClick('excel-to-csv')} className="mega-menu-item">
                  <FileSpreadsheet size={18} />
                  <div>
                    <div className="item-title">Excel to CSV</div>
                    <div className="item-desc">Export worksheets to UTF-8 CSV</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper styles for mega menu and dropdowns */}
      <style>{`
        .nav-tab-btn:hover {
          color: var(--text-accent) !important;
          background: rgba(225, 29, 72, 0.08) !important;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          transition: all 0.15s ease;
        }
        .dropdown-item:hover {
          background: rgba(225, 29, 72, 0.12);
          color: var(--text-accent);
        }
        .mega-menu-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mega-menu-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--text-accent);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 8px;
        }
        .mega-menu-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-main);
          border: 1px solid transparent;
        }
        .mega-menu-item:hover {
          background: var(--bg-card-hover);
          border-color: rgba(225, 29, 72, 0.3);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .mega-menu-item .item-title {
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-main);
        }
        .mega-menu-item:hover .item-title {
          color: var(--text-accent);
        }
        .mega-menu-item .item-desc {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
    </header>
  );
};

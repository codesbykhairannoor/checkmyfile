import React, { useState, useRef, useEffect } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';
import {
  Sun, Moon, FileText, ChevronDown, ChevronUp, Grid,
  Combine, Scissors, Minimize2, FileSpreadsheet, LayoutList, Crop,
  ScanText, ScanLine, Eraser, Scale, EyeOff, RotateCw, Hash, Stamp,
  Presentation, AlignLeft, TableProperties, Image, Images, Trash2,
  PenTool, Lock, Unlock, Contrast, Maximize, ArrowDownUp, Edit3, SlidersHorizontal,
  Menu, X, FolderArchive, LogIn, LogOut, Crown,
  Boxes, Monitor, Smartphone, ExternalLink, Globe, Sparkles, Film, QrCode, ShieldCheck, ArrowRight,
  CreditCard, ArrowLeft, Search, Check,
} from 'lucide-react';
import { getToolById, type ToolDefinition } from '../../catalog/toolsCatalog';
import { toolNames } from '../../i18n/slugTranslations';
import { UI_TRANSLATIONS } from '../../i18n/translations';
import { authTranslations } from '../../i18n/authTranslations';
import { getLanguageByCode, SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { useAuth } from '../../context/AuthContext';

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
    style={highlight ? { background: 'rgba(225,29,72,0.06)', borderColor: 'rgba(225,29,72,0.2)' } : {}}
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
  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [suiteView, setSuiteView] = useState<'main' | 'language'>('main');
  const [langSearch, setLangSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAllOpen, setIsMobileAllOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, isPro, openAuthModal, signOut } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const suiteRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suiteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = UI_TRANSLATIONS[currentLang] ?? UI_TRANSLATIONS['en'];
  const en = UI_TRANSLATIONS['en'];
  const authT = authTranslations[currentLang] ?? authTranslations['en'] ?? {};

  // Nav category labels using partial translations with English fallbacks
  const NAV = {
    allPdfTools: t.navAllPdfTools ?? en.navAllPdfTools ?? 'ALL PDF TOOLS',
    organize: t.navOrganizePdf ?? en.navOrganizePdf ?? '📁 ORGANIZE PDF',
    optimize: t.navOptimizeEnhance ?? en.navOptimizeEnhance ?? '⚡ OPTIMIZE & ENHANCE',
    spreadsheet: t.navSpreadsheetTools ?? en.navSpreadsheetTools ?? '📊 SPREADSHEET TOOLS',
    security: t.navSecuritySign ?? en.navSecuritySign ?? '🔐 SECURITY & SIGN',
    fromPdf: t.navConvertFromPdf ?? en.navConvertFromPdf ?? '📑 CONVERT FROM PDF',
    toPdf: t.navConvertToPdf ?? en.navConvertToPdf ?? '🔄 CONVERT TO PDF',
    moreTools: t.navMoreTools ?? en.navMoreTools ?? '🔧 MORE PDF TOOLS',
  };

  const handleToolClick = (toolId: string) => {
    setIsMegaOpen(false);
    setIsSuiteOpen(false);
    setIsMobileMenuOpen(false);
    const tool = getToolById(toolId);
    if (tool && onSelectTool) onSelectTool(tool);
    else onNavigateHome();
  };

  // Hover mega menu with delay to prevent flicker
  const handleMegaEnter = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    if (suiteTimerRef.current) clearTimeout(suiteTimerRef.current);
    setIsSuiteOpen(false);
    setIsMegaOpen(true);
  };
  const handleMegaLeave = () => {
    megaTimerRef.current = setTimeout(() => setIsMegaOpen(false), 120);
  };

  // Hover Suite menu with delay
  const handleSuiteEnter = () => {
    if (suiteTimerRef.current) clearTimeout(suiteTimerRef.current);
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setIsMegaOpen(false);
    setIsSuiteOpen(true);
  };
  const handleSuiteLeave = () => {
    suiteTimerRef.current = setTimeout(() => setIsSuiteOpen(false), 140);
  };

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
        setIsSuiteOpen(false);
        setSuiteView('main');
        setLangSearch('');
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <header
      ref={navRef}
      className="main-site-header"
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
      {/* 🌟 Main bar 🌟 */}
      <div className="navbar-main-inner" style={{
        padding: '0 24px',
        maxWidth: 1440, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 68,
        position: 'relative'
      }}>

        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div onClick={onNavigateHome} aria-label="Navigate to Home" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="HandleMyFile Logo" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
            <div className="brand-title" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
              HandleMy<span className="gradient-text">File</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Quick Tabs */}
        <nav aria-label="Desktop Quick Navigation" className="desktop-only" style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 0 }}>
          {[
            { id: 'merge-pdf', label: 'MERGE PDF' },
            { id: 'compress-pdf', label: 'COMPRESS PDF' },
            { id: 'pdf-to-word', label: 'PDF TO WORD' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleToolClick(id)}
              className="nav-tab-btn"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '6px 12px', borderRadius: 8, fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em' }}
            >{toolNames[id]?.[currentLang]?.toUpperCase() || label}</button>
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
                padding: '6px 14px', borderRadius: 8, fontSize: '0.92rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s', letterSpacing: '0.02em',
                boxShadow: isMegaOpen ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
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
                  top: 68, left: 0, right: 0,
                  background: 'var(--bg-card)',
                  borderBottom: '2px solid var(--brand-primary)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                  padding: '24px',
                  zIndex: 200,
                  animation: 'fadeInDown 0.15s ease',
                }}
              >
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                  {/* Col 1: Organize PDF — 8 items */}
                  <div className="mega-menu-col">
                    <div className="mega-menu-title">{NAV.organize}</div>
                    <MI icon={FolderArchive} label={toolNames['batch-pdf']?.[currentLang] || "Batch PDF (Folder)"} onClick={() => handleToolClick('batch-pdf')} highlight={true} />
                    <MI icon={Combine} label={toolNames['merge-pdf']?.[currentLang] || "Merge PDF"} onClick={() => handleToolClick('merge-pdf')} />
                    <MI icon={Scissors} label={toolNames['split-pdf']?.[currentLang] || "Split PDF"} onClick={() => handleToolClick('split-pdf')} />
                    <MI icon={RotateCw} label={toolNames['rotate-pdf']?.[currentLang] || "Rotate PDF"} onClick={() => handleToolClick('rotate-pdf')} />
                    <MI icon={Hash} label={toolNames['page-numbers']?.[currentLang] || "Page Numbers"} onClick={() => handleToolClick('page-numbers')} />
                    <MI icon={Trash2} label={toolNames['remove-pdf']?.[currentLang] || "Remove Pages"} onClick={() => handleToolClick('remove-pdf')} />
                    <MI icon={LayoutList} label={toolNames['organize-pdf']?.[currentLang] || "Organize PDF"} onClick={() => handleToolClick('organize-pdf')} />
                    <MI icon={Crop} label={toolNames['crop-pdf']?.[currentLang] || "Crop PDF"} onClick={() => handleToolClick('crop-pdf')} />
                  </div>

                  {/* Col 2: Optimize & Spreadsheet — 8 items */}
                  <div className="mega-menu-col">
                    <div className="mega-menu-title">{NAV.optimize}</div>
                    <MI icon={Edit3} label={toolNames['edit-pdf']?.[currentLang] || "Edit PDF"} onClick={() => handleToolClick('edit-pdf')} />
                    <MI icon={Minimize2} label={toolNames['compress-pdf']?.[currentLang] || "Compress PDF"} onClick={() => handleToolClick('compress-pdf')} />
                    <MI icon={ScanText} label={toolNames['ocr-pdf']?.[currentLang] || "OCR PDF to Text"} onClick={() => handleToolClick('ocr-pdf')} />
                    <MI icon={Contrast} label={toolNames['grayscale-pdf']?.[currentLang] || "Grayscale PDF"} onClick={() => handleToolClick('grayscale-pdf')} />
                    <MI icon={ScanLine} label={toolNames['scan-to-pdf']?.[currentLang] || "Scan to PDF"} onClick={() => handleToolClick('scan-to-pdf')} />
                    <MI icon={Eraser} label={toolNames['remove-pdf-metadata']?.[currentLang] || "Remove Metadata"} onClick={() => handleToolClick('remove-pdf-metadata')} />
                    <MI icon={SlidersHorizontal} label={toolNames['edit-pdf-metadata']?.[currentLang] || "Edit Metadata"} onClick={() => handleToolClick('edit-pdf-metadata')} />
                    <div className="mega-menu-title" style={{ marginTop: 12 }}>{NAV.spreadsheet}</div>
                    <MI icon={TableProperties} label={toolNames['csv-to-excel']?.[currentLang] || "CSV to Excel (.xlsx)"} onClick={() => handleToolClick('csv-to-excel')} />
                    <MI icon={FileText} label={toolNames['excel-to-csv']?.[currentLang] || "Excel to CSV"} onClick={() => handleToolClick('excel-to-csv')} />
                  </div>

                  {/* Col 3: Security & Convert From — 8 items */}
                  <div className="mega-menu-col">
                    <div className="mega-menu-title">{NAV.security}</div>
                    <MI icon={Stamp} label={toolNames['watermark-pdf']?.[currentLang] || "Watermark PDF"} onClick={() => handleToolClick('watermark-pdf')} />
                    <MI icon={PenTool} label={toolNames['sign-pdf']?.[currentLang] || "Sign PDF"} onClick={() => handleToolClick('sign-pdf')} />
                    <MI icon={Lock} label={toolNames['protect-pdf']?.[currentLang] || "Protect PDF"} onClick={() => handleToolClick('protect-pdf')} />
                    <MI icon={Unlock} label={toolNames['unlock-pdf']?.[currentLang] || "Unlock PDF"} onClick={() => handleToolClick('unlock-pdf')} />
                    <MI icon={EyeOff} label={toolNames['redact-pdf']?.[currentLang] || "Redact PDF"} onClick={() => handleToolClick('redact-pdf')} />
                    <div className="mega-menu-title" style={{ marginTop: 12 }}>{NAV.fromPdf}</div>
                    <MI icon={FileText} label={toolNames['pdf-to-word']?.[currentLang] || "PDF to Word"} onClick={() => handleToolClick('pdf-to-word')} highlight={true} />
                    <MI icon={Presentation} label={toolNames['pdf-to-ppt']?.[currentLang] || "PDF to POWERPOINT"} onClick={() => handleToolClick('pdf-to-ppt')} />
                    <MI icon={Images} label={toolNames['pdf-to-image']?.[currentLang] || "PDF to JPG / PNG"} onClick={() => handleToolClick('pdf-to-image')} />
                    <MI icon={Image} label={toolNames['extract-images-pdf']?.[currentLang] || "Extract Images"} onClick={() => handleToolClick('extract-images-pdf')} />
                  </div>

                  {/* Col 4: Convert To PDF + More Tools — 7 items */}
                  <div className="mega-menu-col">
                    <div className="mega-menu-title">{NAV.toPdf}</div>
                    <MI icon={FileSpreadsheet} label={toolNames['excel-to-pdf']?.[currentLang] || "EXCEL to PDF"} onClick={() => handleToolClick('excel-to-pdf')} />
                    <MI icon={Presentation} label={toolNames['ppt-to-pdf']?.[currentLang] || "POWERPOINT to PDF"} onClick={() => handleToolClick('ppt-to-pdf')} />
                    <MI icon={Image} label={toolNames['image-to-pdf']?.[currentLang] || "JPG / PNG to PDF"} onClick={() => handleToolClick('image-to-pdf')} />
                    <MI icon={AlignLeft} label={toolNames['txt-to-pdf']?.[currentLang] || "TXT to PDF"} onClick={() => handleToolClick('txt-to-pdf')} />
                    <div className="mega-menu-title" style={{ marginTop: 12 }}>{NAV.moreTools}</div>
                    <MI icon={Scale} label={toolNames['compare-pdf']?.[currentLang] || "Compare PDF"} onClick={() => handleToolClick('compare-pdf')} />
                    <MI icon={Maximize} label={toolNames['resize-pdf']?.[currentLang] || "Resize PDF"} onClick={() => handleToolClick('resize-pdf')} />
                    <MI icon={ArrowDownUp} label={toolNames['reverse-pdf']?.[currentLang] || "Reverse PDF"} onClick={() => handleToolClick('reverse-pdf')} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Auth + 9-Dot Launcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, justifyContent: 'flex-end' }}>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Desktop Language Selector beside Sign In */}
            <LocaleSwitcher
              currentLang={currentLang}
              onSelectLang={(code) => {
                onSelectLang(code);
                setIsDesktopLangOpen(false);
              }}
              isOpen={isDesktopLangOpen}
              onClose={() => setIsDesktopLangOpen(false)}
              onOpen={() => {
                setIsDesktopLangOpen(true);
                setIsMegaOpen(false);
                setIsSuiteOpen(false);
                setIsUserMenuOpen(false);
              }}
              compact={false}
            />

            {/* Desktop Auth Button / User Dropdown */}
            {!user ? (
              <button
                onClick={openAuthModal}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(225,29,72,0.25)',
                }}
              >
                <LogIn size={15} />
                <span>{currentLang === 'id' ? 'Masuk / Login' : (authT.nav_signin || 'Sign In')}</span>
              </button>
            ) : (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '3px 10px 3px 3px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 9999,
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--brand-primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      maxWidth: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.displayName || user.email?.split('@')[0] || authT.nav_account || 'Account'}
                  </span>
                  {isPro && (
                    <span
                      style={{
                        background: '#f59e0b',
                        color: '#000000',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: 6,
                        letterSpacing: '0.05em',
                      }}
                    >
                      PRO
                    </span>
                  )}
                  <ChevronDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: 230,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 12,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                      padding: '12px',
                      zIndex: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.displayName || authT.nav_account || 'User'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                      <span style={{ fontWeight: 700, color: isPro ? '#f59e0b' : 'var(--text-main)' }}>
                        {isPro
                          ? (profile?.billingInterval === 'monthly'
                            ? (authT.pro_plan_monthly_name || 'PRO Monthly')
                            : (authT.nav_pro_active || 'PRO Lifetime'))
                          : (authT.nav_free_tier || 'Free Starter')}
                      </span>
                    </div>
                    {!isPro && (
                      <a
                        href={currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsUserMenuOpen(false);
                          window.history.pushState({}, '', currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        style={{
                          padding: '8px 10px',
                          background: 'rgba(225, 29, 72, 0.1)',
                          color: 'var(--brand-primary)',
                          borderRadius: 8,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <Crown size={14} />
                        {authT.nav_upgrade_pro || 'Upgrade to PRO'}
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 10px',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: 6,
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={14} />
                      {authT.nav_signout || 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 🌟 9-DOT WAFFLE LAUNCHER (iLovePDF Style) 🌟 */}
            <div
              style={{ position: 'relative' }}
              ref={suiteRef}
              onMouseEnter={handleSuiteEnter}
              onMouseLeave={handleSuiteLeave}
            >
              <button
                onClick={() => {
                  setIsSuiteOpen(!isSuiteOpen);
                  setIsMegaOpen(false);
                  setIsUserMenuOpen(false);
                }}
                aria-label="Apps and Preferences Launcher"
                title={currentLang === 'id' ? 'Aplikasi & Pengaturan' : 'Apps & Preferences'}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSuiteOpen ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
                  color: isSuiteOpen ? 'var(--brand-primary)' : 'var(--text-main)',
                  border: isSuiteOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSuiteOpen) {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSuiteOpen) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                {/* 3x3 Grid Dots SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="4.5" cy="4.5" r="2" />
                  <circle cx="12" cy="4.5" r="2" />
                  <circle cx="19.5" cy="4.5" r="2" />
                  <circle cx="4.5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19.5" cy="12" r="2" />
                  <circle cx="4.5" cy="19.5" r="2" />
                  <circle cx="12" cy="19.5" r="2" />
                  <circle cx="19.5" cy="19.5" r="2" />
                </svg>
              </button>

              {/* Dropdown Menu anchored to the RIGHT */}
              {isSuiteOpen && (
                <div
                  onMouseEnter={handleSuiteEnter}
                  onMouseLeave={handleSuiteLeave}
                  className="suite-flyout-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: 820,
                    maxWidth: 'calc(100vw - 24px)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 16,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
                    overflow: 'hidden',
                    zIndex: 250,
                    animation: 'fadeInDown 0.15s ease',
                    fontFamily: 'var(--font-main)',
                  }}
                >
                  {suiteView === 'main' ? (
                    <div>
                      {/* 2-Pane Split Content */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', minHeight: 320 }}>
                        {/* LEFT PANE: ECOSYSTEM APPS & PLATFORMS */}
                        <div style={{ padding: '20px 22px', borderRight: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                            {currentLang === 'id' ? 'Aplikasi Web Ekosistem (0% Upload)' : 'Ecosystem Web Apps (0% Server Upload)'}
                          </div>

                          {/* 2x2 Grid with Authentic Logos */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                            {/* App 1: HandleMyFile */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 10,
                                background: 'rgba(225,29,72,0.05)',
                                border: '1px solid rgba(225,29,72,0.25)',
                              }}
                            >
                              <img
                                src="/ecosystem/handlemyfile.png"
                                alt="HandleMyFile"
                                style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--brand-primary)' }}>HandleMyFile</span>
                                  <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'rgba(225,29,72,0.12)', color: 'var(--brand-primary)' }}>
                                    Active
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {currentLang === 'id' ? 'Tools PDF & Dokumen' : 'PDF & Document Studio'}
                                </div>
                              </div>
                            </div>

                            {/* App 2: HelpMyIMG */}
                            <a
                              href="https://helpmyimg.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 10,
                                background: 'var(--bg-app)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.background = 'var(--bg-app)';
                              }}
                            >
                              <img
                                src="/ecosystem/helpmyimg.png"
                                alt="HelpMyIMG"
                                style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>HelpMyIMG</span>
                                  <ExternalLink size={11} color="var(--text-muted)" />
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {currentLang === 'id' ? 'AI Photo & Edit Foto' : 'AI Photo & Local Editor'}
                                </div>
                              </div>
                            </a>

                            {/* App 3: SolveMyMedia */}
                            <a
                              href="https://solvemymedia.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 10,
                                background: 'var(--bg-app)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
                                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.background = 'var(--bg-app)';
                              }}
                            >
                              <img
                                src="/ecosystem/solvemymedia.png"
                                alt="SolveMyMedia"
                                style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>SolveMyMedia</span>
                                  <ExternalLink size={11} color="var(--text-muted)" />
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {currentLang === 'id' ? 'Video & Audio Lossless' : 'Lossless Video & Audio'}
                                </div>
                              </div>
                            </a>

                            {/* App 4: CreateMy-QR */}
                            <a
                              href="https://createmy-qr.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 10,
                                background: 'var(--bg-app)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.background = 'var(--bg-app)';
                              }}
                            >
                              <img
                                src="/ecosystem/createmy-qr.png"
                                alt="CreateMy-QR"
                                style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>CreateMy-QR</span>
                                  <ExternalLink size={11} color="var(--text-muted)" />
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {currentLang === 'id' ? 'QR Code & Barcode' : 'Vector QR & Barcodes'}
                                </div>
                              </div>
                            </a>
                          </div>

                          {/* Native Clients (Coming Soon) */}
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                            {currentLang === 'id' ? 'Aplikasi Desktop & Mobile' : 'Desktop & Mobile Clients'}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {/* Windows Desktop */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 10px',
                                borderRadius: 8,
                                background: 'var(--bg-app)',
                                border: '1px solid var(--border-color)',
                              }}
                            >
                              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                                <Monitor size={14} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Windows 64-bit</span>
                                  <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'rgba(100,116,139,0.15)', color: 'var(--text-muted)' }}>
                                    {currentLang === 'id' ? 'Segera' : 'Soon'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                  100% Offline .exe
                                </div>
                              </div>
                            </div>

                            {/* Android Mobile */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 10px',
                                borderRadius: 8,
                                background: 'var(--bg-app)',
                                border: '1px solid var(--border-color)',
                              }}
                            >
                              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                                <Smartphone size={14} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Android App</span>
                                  <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'rgba(100,116,139,0.15)', color: 'var(--text-muted)' }}>
                                    {currentLang === 'id' ? 'Segera' : 'Soon'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                  Zero-Upload APK
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT PANE: COMPANY & TRUST */}
                        <div style={{ padding: '20px 22px', background: 'var(--bg-app)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                            {currentLang === 'id' ? 'Perusahaan & Keamanan' : 'Company & Trust'}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {/* 1. Pricing Plans */}
                            <a
                              href={currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                window.history.pushState({}, '', currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`);
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 8,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                              }}
                            >
                              <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CreditCard size={15} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {currentLang === 'id' ? 'Paket Harga' : 'Pricing & Plans'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {currentLang === 'id' ? 'Free Starter, Pro & Founder' : 'Starter, Pro & Founder Pass'}
                                </div>
                              </div>
                            </a>

                            {/* 2. Privacy & Security */}
                            <a
                              href={currentLang === 'en' ? '/privacy' : `/${currentLang}/privacy`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                window.history.pushState({}, '', currentLang === 'en' ? '/privacy' : `/${currentLang}/pricing`);
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 8,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                              }}
                            >
                              <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <ShieldCheck size={15} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {currentLang === 'id' ? 'Privasi Zero-Server' : 'Zero-Server Privacy'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {currentLang === 'id' ? '100% Olah di browser via WASM' : '100% Client-Side WebAssembly'}
                                </div>
                              </div>
                            </a>

                            {/* 3. About Us */}
                            <a
                              href={currentLang === 'en' ? '/about' : `/${currentLang}/about`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                window.history.pushState({}, '', currentLang === 'en' ? '/about' : `/${currentLang}/about`);
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 8,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                              }}
                            >
                              <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Sparkles size={15} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {currentLang === 'id' ? 'Tentang HandleMyFile' : 'About Us & Mission'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {currentLang === 'id' ? 'Misi privasi lokal tanpa server' : 'Our local privacy mission'}
                                </div>
                              </div>
                            </a>

                            {/* 4. Terms of Service */}
                            <a
                              href={currentLang === 'en' ? '/tos' : `/${currentLang}/tos`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                window.history.pushState({}, '', currentLang === 'en' ? '/tos' : `/${currentLang}/tos`);
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 8,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                              }}
                            >
                              <div style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FileText size={15} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {currentLang === 'id' ? 'Syarat & Transparansi' : 'Terms & Legal'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  {currentLang === 'id' ? 'Ketentuan layanan & data' : 'Service terms & transparency'}
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Footer Bar: Appearance Toggle + Sliding Language Selector Trigger */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 22px',
                          borderTop: '1px solid var(--border-color)',
                          background: 'var(--bg-app)',
                        }}
                      >
                        {/* Theme Mode Toggle (Clean button, non-intrusive) */}
                        <button
                          onClick={onToggleTheme}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 14px',
                            borderRadius: 8,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          title={currentLang === 'id' ? 'Ganti mode terang/gelap' : 'Toggle appearance'}
                        >
                          {isLightMode ? <Sun size={15} color="#d97706" /> : <Moon size={15} color="#a855f7" />}
                          <span>
                            {currentLang === 'id'
                              ? (isLightMode ? 'Mode Terang' : 'Mode Gelap')
                              : (isLightMode ? 'Light Mode' : 'Dark Mode')}
                          </span>
                        </button>

                        {/* Language Selector Drilldown Button (Sliding Navigation) */}
                        <button
                          onClick={() => setSuiteView('language')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 14px',
                            borderRadius: 8,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Globe size={14} color="var(--brand-primary)" />
                          <span>
                            {getLanguageByCode(currentLang).flag} {getLanguageByCode(currentLang).nativeName}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ({currentLang === 'id' ? '30 Bahasa' : '30 Languages'})
                          </span>
                          <ArrowRight size={13} color="var(--text-muted)" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Sliding Language Selector Sub-Panel ── */
                    <div style={{ animation: 'fadeInDown 0.15s ease' }}>
                      {/* Sub-Header with Back Button */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 22px',
                          borderBottom: '1px solid var(--border-color)',
                          background: 'var(--bg-app)',
                        }}
                      >
                        <button
                          onClick={() => setSuiteView('main')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'none',
                            border: 'none',
                            color: 'var(--brand-primary)',
                            fontWeight: 800,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: 6,
                          }}
                        >
                          <ArrowLeft size={16} />
                          <span>{currentLang === 'id' ? 'Kembali ke Menu Suite' : 'Back to Ecosystem'}</span>
                        </button>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {currentLang === 'id' ? 'Pilih Bahasa (30 Bahasa)' : 'Select Language (30 Available)'}
                        </div>
                      </div>

                      {/* Language Search Input */}
                      <div style={{ padding: '12px 22px 8px', borderBottom: '1px solid var(--border-color)' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 8,
                            padding: '7px 12px',
                          }}
                        >
                          <Search size={15} color="var(--text-muted)" />
                          <input
                            type="text"
                            value={langSearch}
                            onChange={(e) => setLangSearch(e.target.value)}
                            placeholder={currentLang === 'id' ? 'Cari bahasa (contoh: English, Español, Indonesia)...' : 'Search language (e.g. English, Español, Deutsch)...'}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              outline: 'none',
                              width: '100%',
                              fontSize: '0.82rem',
                              color: 'var(--text-main)',
                            }}
                          />
                          {langSearch && (
                            <button
                              onClick={() => setLangSearch('')}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 3-Column Grid of 30 Languages with fixed height */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 6,
                          padding: '14px 22px 18px',
                          maxHeight: 290,
                          overflowY: 'auto',
                        }}
                      >
                        {SUPPORTED_LANGUAGES.filter(
                          (l) =>
                            l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
                            l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
                            l.code.toLowerCase().includes(langSearch.toLowerCase())
                        ).map((l) => {
                          const isSelected = currentLang === l.code;
                          return (
                            <button
                              key={l.code}
                              onClick={() => {
                                onSelectLang(l.code);
                                setSuiteView('main');
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderRadius: 8,
                                border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                                background: isSelected ? 'rgba(225,29,72,0.08)' : 'var(--bg-app)',
                                color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                                fontSize: '0.78rem',
                                fontWeight: isSelected ? 800 : 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.12s ease',
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <span style={{ fontSize: '1rem' }}>{l.flag}</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.nativeName}</span>
                              </span>
                              {isSelected && <Check size={14} color="var(--brand-primary)" style={{ flexShrink: 0 }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile top-right controls: Thumb-Friendly Hamburger ONLY */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => {
                setIsMobileLangOpen(false);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label="Toggle Navigation Menu"
              style={{
                width: 38,
                height: 38,
                background: isMobileMenuOpen ? 'var(--brand-primary)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                color: isMobileMenuOpen ? 'white' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-container"
          style={{ position: 'absolute', top: 68, left: 0, right: 0, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', padding: '16px 16px 28px', maxHeight: 'calc(100vh - 68px)', overflowY: 'auto', zIndex: 40, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          {/* Mobile Top Row: Language Selector & Theme Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <LocaleSwitcher
              currentLang={currentLang}
              onSelectLang={(code) => {
                onSelectLang(code);
                setIsMobileMenuOpen(false);
                setIsMobileLangOpen(false);
              }}
              isOpen={isMobileLangOpen}
              onClose={() => setIsMobileLangOpen(false)}
              onOpen={() => {
                setIsMobileLangOpen(true);
              }}
              compact={false}
              fullWidth={true}
            />

            <button
              onClick={onToggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 9999,
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                minHeight: 38,
              }}
            >
              {isLightMode ? <Moon size={15} color="#8b5cf6" /> : <Sun size={15} color="#f59e0b" />}
              <span>{currentLang === 'id' ? (isLightMode ? 'Mode Gelap' : 'Mode Terang') : (isLightMode ? 'Dark Mode' : 'Light Mode')}</span>
            </button>
          </div>

          {/* Mobile User Profile or Sign In Card */}
          {!user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAuthModal();
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                background: 'var(--brand-primary)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              <LogIn size={16} />
              <span>{currentLang === 'id' ? 'Masuk / Login Akun' : (authT.nav_signin || 'Sign In')}</span>
            </button>
          ) : (
            <div
              style={{
                padding: '12px',
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.displayName || authT.nav_account || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {isPro && (
                  <span style={{ background: '#f59e0b', color: '#000000', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
                    PRO
                  </span>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {authT.nav_signout || 'Sign Out'}
                </button>
              </div>
            </div>
          )}

          {/* Mobile Pricing / PRO Link Banner */}
          <a
            href={currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              window.history.pushState({}, '', currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: 'var(--text-main)',
              textDecoration: 'none',
              marginBottom: 14,
              fontSize: '0.88rem',
              fontWeight: 700,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Crown size={16} color="#f59e0b" />
              <span>{t.footerPricing || 'Pricing'} &amp; PRO Suite</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 800 }}>
              $9.99 / $129 Pass &rarr;
            </span>
          </a>

          {/* Mobile Suite Ecosystem Card */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                <Boxes size={15} color="var(--brand-primary)" />
                <span>The Privacy Suite</span>
              </div>
              <span style={{ fontSize: '0.64rem', fontWeight: 900, padding: '2px 6px', borderRadius: 4, background: 'rgba(225,29,72,0.12)', color: 'var(--brand-primary)' }}>
                4 Apps
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {/* HandleMyFile */}
              <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.25)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>HandleMyFile</div>
                <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700 }}>● {currentLang === 'id' ? 'Aktif' : 'Current'}</div>
              </div>
              {/* HelpMyIMG */}
              <a href="https://helpmyimg.com" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-app)', border: '1px solid var(--border-color)', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  <span>HelpMyIMG</span>
                  <ExternalLink size={10} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>AI Photo Tools</div>
              </a>
              {/* SolveMyMedia */}
              <a href="https://solvemymedia.com" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-app)', border: '1px solid var(--border-color)', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  <span>SolveMyMedia</span>
                  <ExternalLink size={10} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Audio & Video</div>
              </a>
              {/* CreateMy-QR */}
              <a href="https://createmy-qr.com" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-app)', border: '1px solid var(--border-color)', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  <span>CreateMy-QR</span>
                  <ExternalLink size={10} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Vector QR Codes</div>
              </a>
            </div>

            {/* Upcoming Native Apps */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                💻 Desktop Windows &amp; Mac <span style={{ color: '#d97706', fontWeight: 800 }}>({currentLang === 'id' ? 'Segera' : 'Soon'})</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                📱 Android &amp; iOS App <span style={{ color: '#d97706', fontWeight: 800 }}>({currentLang === 'id' ? 'Segera' : 'Soon'})</span>
              </div>
            </div>
          </div>

          {/* Quick buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
            {[
              { id: 'merge-pdf', label: 'Merge' },
              { id: 'compress-pdf', label: 'Compress' },
              { id: 'pdf-to-word', label: 'Word' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => handleToolClick(id)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px 4px', borderRadius: 8, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'center' }}>{toolNames[id]?.[currentLang]?.toUpperCase() || label}</button>
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
                {
                  section: NAV.organize, tools: [
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
                  ]
                },
                {
                  section: NAV.optimize, tools: [
                    { id: 'edit-pdf', label: 'Edit PDF', Icon: Edit3 },
                    { id: 'compress-pdf', label: 'Compress PDF', Icon: Minimize2 },
                    { id: 'ocr-pdf', label: 'OCR to Text', Icon: ScanText },
                    { id: 'grayscale-pdf', label: 'Grayscale PDF', Icon: Contrast },
                    { id: 'scan-to-pdf', label: 'Scan to PDF', Icon: ScanLine },
                    { id: 'remove-pdf-metadata', label: 'Remove Metadata', Icon: Eraser },
                    { id: 'edit-pdf-metadata', label: 'Edit Metadata', Icon: SlidersHorizontal },
                  ]
                },
                {
                  section: NAV.spreadsheet, tools: [
                    { id: 'csv-to-excel', label: 'CSV to Excel', Icon: TableProperties },
                    { id: 'excel-to-csv', label: 'Excel to CSV', Icon: FileText },
                  ]
                },
                {
                  section: NAV.security, tools: [
                    { id: 'watermark-pdf', label: 'Watermark PDF', Icon: Stamp },
                    { id: 'sign-pdf', label: 'Sign PDF', Icon: PenTool },
                    { id: 'protect-pdf', label: 'Protect PDF', Icon: Lock },
                    { id: 'unlock-pdf', label: 'Unlock PDF', Icon: Unlock },
                    { id: 'redact-pdf', label: 'Redact PDF', Icon: EyeOff },
                  ]
                },
                {
                  section: NAV.fromPdf, tools: [
                    { id: 'pdf-to-word', label: 'PDF to Word', Icon: FileText },
                    { id: 'pdf-to-ppt', label: 'PDF to PPTX', Icon: Presentation },
                    { id: 'pdf-to-image', label: 'PDF to JPG/PNG', Icon: Images },
                    { id: 'extract-images-pdf', label: 'Extract Images', Icon: Image },
                  ]
                },
                {
                  section: NAV.toPdf, tools: [
                    { id: 'excel-to-pdf', label: 'Excel to PDF', Icon: FileSpreadsheet },
                    { id: 'ppt-to-pdf', label: 'PPTX to PDF', Icon: Presentation },
                    { id: 'image-to-pdf', label: 'JPG/PNG to PDF', Icon: Image },
                    { id: 'txt-to-pdf', label: 'TXT to PDF', Icon: AlignLeft },
                  ]
                },
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
                        <Icon size={13} color="var(--brand-primary)" />{toolNames[id]?.[currentLang]?.toUpperCase() || label}</button>
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
          font-size: 0.85rem;
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
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          text-transform: uppercase;
        }
        .mega-menu-item:hover .item-title {
          color: var(--text-accent);
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
          .mobile-menu-container { display: block !important; }
          .navbar-main-inner { padding: 0 14px !important; }
          .brand-title { font-size: 1.2rem !important; }
        }
        @media (min-width: 769px) {
          .mobile-only, .mobile-menu-container { display: none !important; }
          .desktop-only { display: flex !important; }
        }
        @media (max-width: 920px) and (min-width: 769px) {
          .suite-flyout-card {
            width: calc(100vw - 48px) !important;
            left: 0 !important;
          }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

// Helper to convert ALL-CAPS or raw text to clean Title Case for navigation
const toTitleCase = (str: string): string => {
  if (!str) return '';
  const emojiMatch = str.match(/^([\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\s]+)(.*)$/u);
  const emoji = emojiMatch ? emojiMatch[1] : '';
  const rawText = emojiMatch ? emojiMatch[2] : str;
  const formatted = rawText
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (['pdf', 'wasm', 'ocr', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'png'].includes(word)) {
        return word.toUpperCase();
      }
      if (['&', 'and', 'or', 'to', 'from', 'ke', 'dari', 'dan'].includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  return emoji ? `${emoji.trim()} ${formatted}` : formatted;
};

// Helper to strip emoji completely (used in mobile drawer where red Lucide SVG icons are used)
const stripEmoji = (str: string): string => {
  if (!str) return '';
  return str.replace(/^[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\s]+/u, '').trim();
};

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
  const [langSearch, setLangSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, isPro, openAuthModal, signOut } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const suiteRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suiteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = UI_TRANSLATIONS[currentLang] ?? UI_TRANSLATIONS['en'];
  const en = UI_TRANSLATIONS['en'];
  const authT = authTranslations[currentLang] ?? authTranslations['en'] ?? {};

  // Nav category labels using partial translations with English fallbacks (Title Case / Capitalized)
  const NAV = {
    allPdfTools: toTitleCase(t.navAllPdfTools ?? en.navAllPdfTools ?? 'All PDF Tools'),
    organize: toTitleCase(t.navOrganizePdf ?? en.navOrganizePdf ?? '📁 Organize PDF'),
    optimize: toTitleCase(t.navOptimizeEnhance ?? en.navOptimizeEnhance ?? '⚡ Optimize & Enhance'),
    spreadsheet: toTitleCase(t.navSpreadsheetTools ?? en.navSpreadsheetTools ?? '📊 Spreadsheet Tools'),
    security: toTitleCase(t.navSecuritySign ?? en.navSecuritySign ?? '🔐 Security & Sign'),
    fromPdf: toTitleCase(t.navConvertFromPdf ?? en.navConvertFromPdf ?? '📑 Convert from PDF'),
    toPdf: toTitleCase(t.navConvertToPdf ?? en.navConvertToPdf ?? '🔄 Convert to PDF'),
    moreTools: toTitleCase(t.navMoreTools ?? en.navMoreTools ?? '🔧 More PDF Tools'),
  };

  const popularTools = [
    { id: 'merge-pdf', label: 'Merge PDF', Icon: Combine, color: '#e11d48' },
    { id: 'compress-pdf', label: 'Compress PDF', Icon: Minimize2, color: '#2563eb' },
    { id: 'pdf-to-word', label: 'PDF to Word', Icon: FileText, color: '#059669' },
    { id: 'split-pdf', label: 'Split PDF', Icon: Scissors, color: '#d97706' },
    { id: 'protect-pdf', label: 'Protect PDF', Icon: Lock, color: '#7c3aed' },
    { id: 'image-to-pdf', label: 'JPG to PDF', Icon: Images, color: '#db2777' },
  ];

  const mobileToolCategories = [
    {
      title: NAV.organize,
      icon: Combine,
      tools: [
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
      ],
    },
    {
      title: NAV.optimize,
      icon: Minimize2,
      tools: [
        { id: 'edit-pdf', label: 'Edit PDF', Icon: Edit3 },
        { id: 'compress-pdf', label: 'Compress PDF', Icon: Minimize2 },
        { id: 'ocr-pdf', label: 'OCR to Text', Icon: ScanText },
        { id: 'grayscale-pdf', label: 'Grayscale PDF', Icon: Contrast },
        { id: 'scan-to-pdf', label: 'Scan to PDF', Icon: ScanLine },
        { id: 'remove-pdf-metadata', label: 'Remove Metadata', Icon: Eraser },
        { id: 'edit-pdf-metadata', label: 'Edit Metadata', Icon: SlidersHorizontal },
      ],
    },
    {
      title: NAV.fromPdf,
      icon: FileText,
      tools: [
        { id: 'pdf-to-word', label: 'PDF to Word', Icon: FileText },
        { id: 'pdf-to-ppt', label: 'PDF to PPTX', Icon: Presentation },
        { id: 'pdf-to-image', label: 'PDF to JPG/PNG', Icon: Images },
        { id: 'extract-images-pdf', label: 'Extract Images', Icon: Image },
      ],
    },
    {
      title: NAV.toPdf,
      icon: Presentation,
      tools: [
        { id: 'excel-to-pdf', label: 'Excel to PDF', Icon: FileSpreadsheet },
        { id: 'ppt-to-pdf', label: 'PPTX to PDF', Icon: Presentation },
        { id: 'image-to-pdf', label: 'JPG/PNG to PDF', Icon: Image },
        { id: 'txt-to-pdf', label: 'TXT to PDF', Icon: AlignLeft },
      ],
    },
    {
      title: NAV.security,
      icon: Lock,
      tools: [
        { id: 'watermark-pdf', label: 'Watermark PDF', Icon: Stamp },
        { id: 'sign-pdf', label: 'Sign PDF', Icon: PenTool },
        { id: 'protect-pdf', label: 'Protect PDF', Icon: Lock },
        { id: 'unlock-pdf', label: 'Unlock PDF', Icon: Unlock },
        { id: 'redact-pdf', label: 'Redact PDF', Icon: EyeOff },
      ],
    },
    {
      title: NAV.spreadsheet,
      icon: TableProperties,
      tools: [
        { id: 'csv-to-excel', label: 'CSV to Excel', Icon: TableProperties },
        { id: 'excel-to-csv', label: 'Excel to CSV', Icon: FileText },
      ],
    },
  ];

  const allMobileTools = mobileToolCategories.flatMap((g) =>
    g.tools.map((t) => ({ ...t, categoryName: g.title }))
  );

  const filteredMobileTools = mobileSearch.trim()
    ? allMobileTools.filter((t) => {
      const q = mobileSearch.toLowerCase().trim();
      const localized = (toolNames[t.id]?.[currentLang] || t.label).toLowerCase();
      const idMatch = t.id.toLowerCase().includes(q);
      const catMatch = t.categoryName.toLowerCase().includes(q);
      return localized.includes(q) || idMatch || catMatch;
    })
    : [];

  const handleToolClick = (toolId: string) => {
    setIsMegaOpen(false);
    setIsSuiteOpen(false);
    setIsMobileMenuOpen(false);
    setMobileSearch('');
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
      const target = e.target as HTMLElement | null;
      // Do not close if clicking inside the mobile menu drawer
      if (target?.closest?.('.mobile-menu-container')) {
        return;
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
        setIsSuiteOpen(false);
        setLangSearch('');
        setIsMobileMenuOpen(false);
        setMobileSearch('');
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={navRef}
      className="main-site-header"
      aria-label="Main Site Header"
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
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
            <img src="/logo.png" alt="HandleMyFile Logo" className="brand-logo-img" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
            <div className="brand-title" style={{ fontSize: 'var(--nav-brand-size, 1.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
              HandleMy<span className="gradient-text">File</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Quick Tabs */}
        <nav aria-label="Desktop Quick Navigation" className="desktop-only" style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 0 }}>
          {[
            { id: 'merge-pdf', label: 'Merge PDF' },
            { id: 'compress-pdf', label: 'Compress PDF' },
            { id: 'pdf-to-word', label: 'PDF to Word' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleToolClick(id)}
              className="nav-tab-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 'var(--nav-link-size, 0.875rem)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '-0.01em',
              }}
            >
              {toolNames[id]?.[currentLang] || label}
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
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 'var(--nav-link-size, 0.875rem)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
                letterSpacing: '-0.01em',
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
                    <MI icon={Presentation} label={toolNames['pdf-to-ppt']?.[currentLang] || "PDF to PowerPoint"} onClick={() => handleToolClick('pdf-to-ppt')} />
                    <MI icon={Images} label={toolNames['pdf-to-image']?.[currentLang] || "PDF to JPG / PNG"} onClick={() => handleToolClick('pdf-to-image')} />
                    <MI icon={Image} label={toolNames['extract-images-pdf']?.[currentLang] || "Extract Images"} onClick={() => handleToolClick('extract-images-pdf')} />
                  </div>

                  {/* Col 4: Convert To PDF + More Tools — 7 items */}
                  <div className="mega-menu-col">
                    <div className="mega-menu-title">{NAV.toPdf}</div>
                    <MI icon={FileSpreadsheet} label={toolNames['excel-to-pdf']?.[currentLang] || "Excel to PDF"} onClick={() => handleToolClick('excel-to-pdf')} />
                    <MI icon={Presentation} label={toolNames['ppt-to-pdf']?.[currentLang] || "PowerPoint to PDF"} onClick={() => handleToolClick('ppt-to-pdf')} />
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
                  padding: '7px 18px',
                  borderRadius: 8,
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 'var(--nav-btn-size, 0.875rem)',
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
                      {!isPro && !user.emailVerified && (
                        <div
                          style={{
                            marginTop: 6,
                            padding: '4px 8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 6,
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{currentLang === 'id' ? 'Belum Verifikasi' : 'Unverified'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openAuthModal();
                            }}
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 4,
                              padding: '2px 6px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {currentLang === 'id' ? 'Verifikasi' : 'Verify'}
                          </button>
                        </div>
                      )}
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

                      {/* Claim PRO Offer Button (Directed to Pricing, exact same compact size) */}
                      <a
                        href={currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsSuiteOpen(false);
                          window.history.pushState({}, '', currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 7,
                          padding: '6px 14px',
                          borderRadius: 8,
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          color: 'var(--text-main)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        }}
                        title={currentLang === 'id' ? 'Klaim Penawaran PRO (Diskon 34%)' : 'Claim PRO Offer (Save 34%)'}
                      >
                        <Crown size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                        <span>
                          {currentLang === 'id' ? 'Klaim Promo PRO' : 'Claim PRO Offer'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            background: '#f59e0b',
                            color: '#000000',
                            padding: '1px 5px',
                            borderRadius: 4,
                            letterSpacing: '0.02em',
                          }}
                        >
                          -34%
                        </span>
                        <ArrowRight size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile top-right controls: Compact Sign In / Avatar + Hamburger */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!user ? (
              <button
                onClick={openAuthModal}
                style={{
                  height: 36,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: 'rgba(225, 29, 72, 0.08)',
                  border: '1px solid rgba(225, 29, 72, 0.25)',
                  color: 'var(--brand-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <LogIn size={14} />
                <span>{authT.nav_signin || (currentLang === 'id' ? 'Masuk' : 'Sign In')}</span>
              </button>
            ) : (
              <div
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem' }}>
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => {
                setIsMobileLangOpen(false);
                if (isMobileMenuOpen) setMobileSearch('');
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label="Toggle Navigation Menu"
              style={{
                width: 38,
                height: 38,
                background: isMobileMenuOpen ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-card)',
                border: isMobileMenuOpen ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid var(--border-color)',
                borderRadius: 8,
                color: isMobileMenuOpen ? 'var(--brand-primary)' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Clean Mobile Full-Height Drawer Menu ── */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="mobile-menu-container"
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '100%',
            background: 'var(--bg-app)',
            borderTop: '1px solid var(--border-color)',
            padding: '16px 16px calc(60px + env(safe-area-inset-bottom, 32px))',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxSizing: 'border-box',
          }}
        >
          {/* User Profile & Sign Out (only if logged in) */}
          {user && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
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
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {isPro && (
                  <span style={{ background: '#f59e0b', color: '#000000', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
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
                    border: '1px solid rgba(239,68,68,0.25)',
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

          {user && !isPro && !user.emailVerified && (
            <div
              style={{
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 8,
                fontSize: '0.78rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span>{currentLang === 'id' ? 'Email Anda belum diverifikasi' : 'Your email is not verified'}</span>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal();
                }}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {currentLang === 'id' ? 'Verifikasi' : 'Verify'}
              </button>
            </div>
          )}

          {/* 2. Live Tool Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder={currentLang === 'id' ? 'Cari 30+ alat PDF (contoh: kompres, word)...' : 'Search 30+ PDF tools (e.g. compress, word)...'}
              style={{
                width: '100%',
                height: 42,
                padding: '0 36px 0 38px',
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {mobileSearch && (
              <button
                onClick={() => setMobileSearch('')}
                aria-label="Clear Search"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* 3. Tools Navigation Area */}
          {mobileSearch.trim() ? (
            /* Live Filtered Search Results */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredMobileTools.length > 0 ? (
                filteredMobileTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setMobileSearch('');
                      handleToolClick(tool.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(225,29,72,0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <tool.Icon size={16} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {toolNames[tool.id]?.[currentLang] || tool.label}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {toTitleCase(tool.categoryName)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  </button>
                ))
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  <div>{currentLang === 'id' ? 'Tidak ada alat yang cocok untuk' : 'No tools found matching'} "{mobileSearch}"</div>
                  <button
                    onClick={() => setMobileSearch('')}
                    style={{ marginTop: 10, padding: '6px 14px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {currentLang === 'id' ? 'Hapus Pencarian' : 'Clear Search'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Standard Mobile View: Popular Tools + Collapsible Categories */
            <>
              {/* Popular Tools Section */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.02em', marginBottom: 8, textTransform: 'none' }}>
                  {currentLang === 'id' ? 'Alat Populer' : 'Popular Tools'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {popularTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                        padding: '10px 10px',
                        borderRadius: 10,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        minHeight: 46,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: `${tool.color}15`,
                          color: tool.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <tool.Icon size={16} />
                      </div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {toolNames[tool.id]?.[currentLang] || tool.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Categories Accordion */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.02em', marginBottom: 8, textTransform: 'none' }}>
                  {currentLang === 'id' ? 'Semua Alat PDF' : 'All PDF Tools'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {mobileToolCategories.map((group) => {
                    const isExpanded = expandedMobileCategory === group.title;
                    return (
                      <div
                        key={group.title}
                        style={{
                          borderRadius: 10,
                          border: '1px solid var(--border-color)',
                          background: isExpanded ? 'var(--bg-card)' : 'transparent',
                          overflow: 'hidden',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <button
                          onClick={() => setExpandedMobileCategory(isExpanded ? null : group.title)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '11px 14px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <group.icon size={16} color="var(--brand-primary)" />
                            <span>{stripEmoji(toTitleCase(group.title))}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-app)', padding: '2px 7px', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                              {group.tools.length}
                            </span>
                            {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div style={{ padding: '4px 10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, borderTop: '1px dashed var(--border-color)' }}>
                            {group.tools.map(({ id, label, Icon }) => (
                              <button
                                key={id}
                                onClick={() => handleToolClick(id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  background: 'var(--bg-app)',
                                  border: '1px solid var(--border-color)',
                                  padding: '9px 10px',
                                  borderRadius: 8,
                                  fontWeight: 600,
                                  color: 'var(--text-main)',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  minWidth: 0,
                                }}
                              >
                                <Icon size={14} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {toolNames[id]?.[currentLang] || label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0 2px' }} />

          {/* 4. Mobile Utility Controls: Language & Theme Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileLangOpen((prev) => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 12px',
                background: isMobileLangOpen ? 'rgba(225, 29, 72, 0.1)' : 'var(--bg-card)',
                border: isMobileLangOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                borderRadius: 10,
                color: isMobileLangOpen ? 'var(--brand-primary)' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                minHeight: 42,
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{getLanguageByCode(currentLang).flag}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getLanguageByCode(currentLang).nativeName}
              </span>
              <ChevronDown size={14} style={{ transform: isMobileLangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleTheme();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                minHeight: 42,
              }}
            >
              {isLightMode ? <Moon size={16} color="#8b5cf6" /> : <Sun size={16} color="#f59e0b" />}
              <span>{currentLang === 'id' ? (isLightMode ? 'Mode Gelap' : 'Mode Terang') : (isLightMode ? 'Dark Mode' : 'Light Mode')}</span>
            </button>
          </div>

          {/* Inline Language Selector Panel (100% in-flow, zero clipping) */}
          {isMobileLangOpen && (
            <div
              id="mobile-lang-panel"
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: 12,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {t.languageSelect || 'Select Language'} ({SUPPORTED_LANGUAGES.length})
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileLangOpen(false);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Filter for Language */}
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder={currentLang === 'id' ? 'Cari bahasa (id, en, es, ja)...' : 'Search language (en, es, fr, de)...'}
                  style={{
                    width: '100%',
                    height: 36,
                    padding: '0 10px 0 32px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Scrollable Language Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                {SUPPORTED_LANGUAGES.filter(
                  (l) =>
                    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
                    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
                    l.code.toLowerCase().includes(langSearch.toLowerCase())
                ).map((l) => {
                  const isSelected = currentLang === l.code;
                  return (
                    <button
                      type="button"
                      key={l.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLang(l.code);
                        setIsMobileLangOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-app)',
                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 800 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        minWidth: 0,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.95rem' }}>{l.flag}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.nativeName}</span>
                      </span>
                      {isSelected && <Check size={13} color="var(--brand-primary)" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Mobile Pricing / PRO Link Banner (Placed at the bottom!) */}
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
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--text-main)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                <Crown size={17} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{currentLang === 'id' ? 'Paket PRO & Langganan' : (t.footerPricing || 'Pricing & PRO')}</span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#f59e0b', color: '#000', padding: '1px 5px', borderRadius: 4 }}>
                    -34%
                  </span>
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  $9.99/bln · $79/thn · $129 Founder Lifetime
                </div>
              </div>
            </div>
            <ArrowRight size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
          </a>

          {/* 6. Client-Side Privacy Guarantee */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>{currentLang === 'id' ? '100% Olah di Browser · Privasi Bebas Server' : '100% Client-Side WASM · Zero Server Upload'}</span>
          </div>
        </div>,
        typeof document !== 'undefined' ? document.documentElement : (document.body || null)
      )}

      {/* Styles */}
      <style>{`
        .nav-tab-btn {
          text-transform: capitalize;
        }
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
          font-size: 13px;
          font-weight: 800;
          color: var(--text-accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 6px;
        }
        .mega-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 6px;
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
          font-size: var(--nav-link-size, 0.875rem);
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.25;
          letter-spacing: -0.01em;
          text-transform: capitalize;
        }
        .mega-menu-item:hover .item-title {
          color: var(--text-accent);
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
          .mobile-menu-container {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 60px !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: calc(100% - 60px) !important;
            max-height: none !important;
            background: var(--bg-app) !important;
            z-index: 999999 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 16px 16px calc(60px + env(safe-area-inset-bottom, 32px)) !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            border-radius: 0 !important;
            zoom: 1 !important;
          }
          .navbar-main-inner { padding: 0 16px !important; height: 60px !important; }
          .brand-title { font-size: 1.18rem !important; }
          .brand-logo-img { height: 32px !important; }
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

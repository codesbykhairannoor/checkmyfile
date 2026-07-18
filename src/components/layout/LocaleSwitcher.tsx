import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../i18n/languages';
import { getUiTranslations } from '../../i18n/translations';
import { Globe, X, Search, Check } from 'lucide-react';

interface LocaleSwitcherProps {
  currentLang: string;
  onSelectLang: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({
  currentLang,
  onSelectLang,
  isOpen,
  onClose,
  onOpen,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLangInfo = getLanguageByCode(currentLang);
  const t = getUiTranslations(currentLang);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
    lang.geoPlacename.toLowerCase().includes(filterQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setFilterQuery('');
    }
  }, [isOpen]);

  // Handle clicking outside the dropdown panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Sleek, Professional Navbar Trigger Button */}
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: isOpen ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-input)',
          border: isOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
          color: isOpen ? 'var(--text-accent)' : 'var(--text-main)',
          padding: '8px 14px',
          borderRadius: 9999,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.88rem',
          transition: 'all 0.2s ease',
        }}
        title="Pilih dari 30 Bahasa Partial URL & Wilayah GEO"
      >
        <Globe size={16} />
        <span>{currentLangInfo.flag} {currentLangInfo.code.toUpperCase()}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
      </button>

      {/* Fast Dropdown Panel underneath language button */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 320,
            maxHeight: 440,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            zIndex: 110,
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            animation: 'fadeInDown 0.15s ease out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={16} className="text-accent" />
              <span>{t.languageSelect} ({SUPPORTED_LANGUAGES.length})</span>
            </span>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
              title="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Filter Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari bahasa (id, en, es)..."
              autoFocus
              style={{
                width: '100%',
                padding: '8px 10px 8px 34px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Languages List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              maxHeight: 310,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {filteredLanguages.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Bahasa tidak ditemukan.
              </div>
            ) : (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLang(lang.code);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: lang.code === currentLang ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                    border: lang.code === currentLang ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid transparent',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    fontSize: '0.85rem',
                    fontWeight: lang.code === currentLang ? 700 : 500,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
                    <span>
                      <strong style={{ color: lang.code === currentLang ? 'var(--text-accent)' : 'inherit' }}>
                        {lang.nativeName}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                        ({lang.code.toUpperCase()})
                      </span>
                    </span>
                  </span>
                  {lang.code === currentLang && <Check size={15} style={{ color: 'var(--text-accent)' }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

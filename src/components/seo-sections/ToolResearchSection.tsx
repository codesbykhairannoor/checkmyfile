import React from 'react';
import { RESEARCH_TRANSLATIONS } from '../../i18n/researchTranslations';
import { BookOpen } from 'lucide-react';

interface ToolResearchSectionProps {
  toolType: 'redact' | 'ocr' | 'compress' | 'sign';
  lang: string;
}

export const ToolResearchSection: React.FC<ToolResearchSectionProps> = ({ toolType, lang }) => {
  const t = RESEARCH_TRANSLATIONS[lang] || RESEARCH_TRANSLATIONS['en'];
  let title = '';
  let cite = '';
  let desc = '';

  switch (toolType) {
    case 'redact':
      title = t.toolRedactResearchTitle;
      cite = t.toolRedactResearchCite;
      desc = t.toolRedactResearchDesc;
      break;
    case 'ocr':
      title = t.toolOcrResearchTitle;
      cite = t.toolOcrResearchCite;
      desc = t.toolOcrResearchDesc;
      break;
    case 'compress':
      title = t.toolCompressResearchTitle;
      cite = t.toolCompressResearchCite;
      desc = t.toolCompressResearchDesc;
      break;
    case 'sign':
      title = t.toolSignResearchTitle;
      cite = t.toolSignResearchCite;
      desc = t.toolSignResearchDesc;
      break;
  }

  return (
    <section
      className="seo-section research-grounding"
      style={{
        padding: '60px 24px',
        margin: '40px 0',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 24,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 9999,
          color: '#2563eb',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: 16
        }}>
          <BookOpen size={14} />
          <span>{t.researchBadge}</span>
        </div>

        <h3 style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 12px 0',
          lineHeight: 1.3
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
          color: '#334155',
          lineHeight: 1.75,
          margin: '0 0 16px 0'
        }}>
          {desc}
        </p>

        <footer style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: 12,
          marginTop: 12
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748b',
            lineHeight: 1.5,
            margin: 0,
            fontStyle: 'italic'
          }}>
            <strong style={{ fontStyle: 'normal', color: '#475569' }}>Academic & Industry Reference:</strong>{' '}
            <cite>{cite}</cite>
          </p>
        </footer>
      </div>
    </section>
  );
};

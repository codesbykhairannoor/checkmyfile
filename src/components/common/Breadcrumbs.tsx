import React from 'react';
import { ChevronRight, Home } from 'lucide-react';


interface BreadcrumbItem {
  label: string;
  url?: string; // if not provided, it's the current page
}

interface BreadcrumbsProps {
  currentLang: string;
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentLang, items }) => {
  const homeUrl = currentLang === 'en' ? '/' : `/${currentLang}`;

  return (
    <nav aria-label="Breadcrumb" style={{ width: '100%', padding: '16px 24px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
      <ol 
        style={{ 
          listStyle: 'none', 
          margin: 0, 
          padding: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          maxWidth: 1200,
          marginInline: 'auto',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap'
        }}
      >
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <a href={homeUrl} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} aria-label="Home">
            <Home size={16} />
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li style={{ display: 'flex', alignItems: 'center', color: 'var(--border-color)' }}>
                <ChevronRight size={14} />
              </li>
              <li style={{ display: 'flex', alignItems: 'center' }} aria-current={isLast ? 'page' : undefined}>
                {isLast || !item.url ? (
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.label}</span>
                ) : (
                  <a href={item.url} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                    {item.label}
                  </a>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
      
      {/* Semantic JSON-LD for Breadcrumbs */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://helpmyfile.com${homeUrl}` },
          ...items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 2,
            name: item.label,
            item: item.url ? `https://helpmyfile.com${item.url}` : undefined
          }))
        ]
      })}} />
    </nav>
  );
};

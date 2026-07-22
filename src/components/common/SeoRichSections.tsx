import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, Star } from 'lucide-react';

interface SeoSectionData {
  type: string;
  title: string;
  content?: string;
  steps?: { title: string; description: string }[];
}

interface SeoJson {
  title: string;
  h1: string;
  description: string;
  sections: SeoSectionData[];
  faqs: { q: string; a: string }[];
}

interface SeoRichSectionsProps {
  toolId: string;
  lang: string;
  fallbackH1: string;
  fallbackDescription: string;
}

export const SeoRichSections: React.FC<SeoRichSectionsProps> = ({ toolId, lang, fallbackH1, fallbackDescription }) => {
  const [data, setData] = useState<SeoJson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadSeoData = async () => {
      try {
        const module = await import(`../../locales/seo/${toolId}/${lang}.json`);
        if (isMounted) {
          setData(module.default || module);
        }
      } catch (error) {
        console.warn(`[SEO] Failed to load SEO data for ${toolId} in ${lang}.`, error);
        if (isMounted) setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSeoData();
    return () => { isMounted = false; };
  }, [toolId, lang]);

  if (loading) {
    return <div style={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--text-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
          {fallbackH1}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 700, margin: '0 auto' }}>
          {fallbackDescription}
        </p>
      </div>
    );
  }

  const { h1, description, sections, faqs } = data;

  const renderSection = (section: SeoSectionData, index: number) => {
    switch (section.type) {
      case 'hero_features':
        return (
          <section key={index} className="seo-section hero-features" style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 24, margin: '40px 0', border: '1px solid var(--border-color)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', marginBottom: 24 }}>
                <Star size={32} />
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          </section>
        );
      
      case 'how_to_steps':
        return (
          <section key={index} className="seo-section how-to-steps" style={{ padding: '60px 24px', margin: '40px 0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: 'var(--text-main)' }}>{section.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, maxWidth: 1000, margin: '0 auto' }}>
              {section.steps?.map((step, i) => (
                <div key={i} className="glass-panel" style={{ padding: 32, textAlign: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, boxShadow: '0 8px 16px rgba(99,102,241,0.3)' }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: 16, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'geo_targeting':
        return (
          <section key={index} className="seo-section geo-targeting" style={{ padding: '60px 24px', margin: '40px 0', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))', borderRadius: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <Globe size={48} color="#10b981" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          </section>
        );

      case 'privacy_security':
        return (
          <section key={index} className="seo-section privacy-security" style={{ padding: '60px 24px', margin: '40px 0', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 24, background: 'rgba(16, 185, 129, 0.02)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <Shield size={48} color="#10b981" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          </section>
        );

      case 'performance':
        return (
          <section key={index} className="seo-section performance" style={{ padding: '60px 24px', margin: '40px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <Zap size={48} color="#f59e0b" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <article className="seo-rich-sections-container" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', paddingTop: 60 }}>
      {/* Dynamic Header */}
      <div style={{ textAlign: 'center', marginBottom: 80, padding: '0 20px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 16, background: 'linear-gradient(to right, var(--text-main), var(--text-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {h1}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>

      {/* Dynamic Sections */}
      {sections.map((section, index) => renderSection(section, index))}

      {/* Dynamic SEO FAQs with Schema.org JSON-LD */}
      {faqs && faqs.length > 0 && (
        <section className="seo-section faqs" style={{ marginTop: 80, padding: '40px 0', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 40, color: 'var(--text-main)' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="glass-panel" style={{ padding: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{faq.q}</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>

          {/* JSON-LD for Google Rich Snippets */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                  "@type": "Question",
                  "name": faq.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                  }
                }))
              })
            }}
          />
        </section>
      )}
    </article>
  );
};

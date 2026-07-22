import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, Star, MapPin, CheckCircle, Clock, ServerOff } from 'lucide-react';

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

export const useSeoData = (toolId: string, lang: string) => {
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

  return { data, loading };
};

interface SeoRichSectionsProps {
  data: SeoJson | null;
}

export const SeoRichSections: React.FC<SeoRichSectionsProps> = ({ data }) => {
  if (!data) return null;

  const { sections, faqs } = data;

  const renderSection = (section: SeoSectionData, index: number) => {
    switch (section.type) {
      case 'hero_features':
        return (
          <section key={index} className="seo-section hero-features" style={{ padding: '80px 24px', margin: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', marginBottom: 24 }}>
                  <Star size={32} />
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
              </div>
              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))', borderRadius: 24, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                  <Shield size={100} style={{ color: '#6366f1', opacity: 0.8 }} />
                </div>
              </div>
            </div>
          </section>
        );
      
      case 'how_to_steps':
        return (
          <section key={index} className="seo-section how-to-steps" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-card)', borderRadius: 32 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 60, color: 'var(--text-main)' }}>{section.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
              {section.steps?.map((step, i) => (
                <div key={i} style={{ textAlign: 'left', position: 'relative', paddingLeft: 40 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--text-main)', color: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'geo_targeting':
        return (
          <section key={index} className="seo-section geo-targeting" style={{ padding: '80px 24px', margin: '40px 0' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 48 }}>
              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: 400, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <Globe size={160} color="rgba(16, 185, 129, 0.2)" />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#10b981', color: 'white', padding: '16px 24px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)', fontWeight: 800, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                    <MapPin size={24} /> Local Processing
                  </div>
                  {/* Decorative Elements */}
                  <div style={{ position: 'absolute', top: '20%', right: '15%', width: 12, height: 12, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 20px #3b82f6' }}></div>
                  <div style={{ position: 'absolute', bottom: '25%', left: '15%', width: 16, height: 16, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 20px #10b981' }}></div>
                </div>
              </div>
              <div style={{ flex: '1 1 400px' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><ServerOff size={16}/> Zero Server Ping</div>
                  <div style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={16}/> Instant Access</div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'privacy_security':
        return (
          <section key={index} className="seo-section privacy-security" style={{ padding: '80px 24px', margin: '60px 0', background: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)', borderRadius: 32, borderLeft: '8px solid #10b981' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 25px rgba(16,185,129,0.3)' }}>
                <Shield size={40} />
              </div>
              <div style={{ flex: 1, minWidth: 300 }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>{section.title}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{section.content}</p>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle size={20} color="#10b981" /> GDPR Compliant</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle size={20} color="#10b981" /> HIPAA Ready</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)', fontWeight: 600 }}><CheckCircle size={20} color="#10b981" /> 100% Offline</div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'performance':
        return (
          <section key={index} className="seo-section performance" style={{ padding: '80px 24px', margin: '40px 0', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', marginBottom: 24 }}>
                <Zap size={48} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' }} />
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                <div style={{ padding: 24, background: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: 8 }}>90%</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>Faster Processing</div>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: 8 }}>0<span style={{ fontSize: '1.5rem' }}>ms</span></div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>Upload Latency</div>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6', marginBottom: 8 }}><Clock size={40} style={{ margin: '0 auto' }}/></div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>No Queue Times</div>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <article className="seo-rich-sections-container" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', paddingTop: 60 }}>
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

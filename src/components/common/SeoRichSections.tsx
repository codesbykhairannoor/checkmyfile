import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, Star, MapPin, CheckCircle, Clock, ServerOff, Scissors, Layers, FileDown, Lock, Monitor, ArrowRight } from 'lucide-react';

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

  const { sections, faqs, title, description } = data;

  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  };
  
  // Combine title and description to guarantee vastly different hashes for different tools/langs
  const seed = getHash((title || '') + (description || ''));

  // Randomize section order deterministically based on seed
  const orderedSections = [...sections];
  const flipOrder1 = (seed % 10) > 4; 
  const flipOrder2 = (seed % 7) > 3;

  if (flipOrder1 && orderedSections.length > 3) {
    // Swap geo and privacy
    const temp = orderedSections[2];
    orderedSections[2] = orderedSections[3];
    orderedSections[3] = temp;
  }
  if (flipOrder2 && orderedSections.length > 4) {
    // Swap privacy and performance
    const temp = orderedSections[3];
    orderedSections[3] = orderedSections[4];
    orderedSections[4] = temp;
  }

  const renderSection = (section: SeoSectionData, index: number) => {
    // Use a mix of the global seed, the section type's own hash, and its index to decide layout
    const sectionHash = getHash(section.type);
    const flipLayout = (seed + sectionHash + index) % 2 !== 0;

    let type = section.type;
    if (type.startsWith('merge_') || type.startsWith('comp_')) {
      type = type.replace('merge_', '').replace('comp_', '');
    }

    switch (type) {
      case 'hero_features':
        return (
          <section key={index} className="seo-section hero-features" style={{ padding: '80px 24px', margin: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', marginBottom: 24 }}>
                  <Star size={32} />
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
              </div>
              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  {/* Decorative placeholder for UI mockup */}
                  <div style={{ width: '80%', height: '60%', background: 'var(--bg-main)', borderRadius: 12, border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6366f1' }}></div>
                    </div>
                  </div>
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

      // --- TOTALLY DISTINCT DESIGNS FOR SPLIT-PDF ---
      case 'split_hero_features':
        return (
          <section key={index} className="seo-section split-hero" style={{ padding: '100px 24px', margin: '60px 0', background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', borderRadius: 40 }}>
            <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: 'white', marginBottom: 32, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}>
                <Scissors size={40} />
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
            </div>
          </section>
        );

      case 'split_how_to_steps':
        return (
          <section key={index} className="seo-section split-how-to" style={{ padding: '60px 24px', margin: '40px 0' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, textAlign: 'left', marginBottom: 40, color: 'var(--text-main)', paddingBottom: 16, borderBottom: '2px solid var(--border-color)' }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800 }}>
              {section.steps?.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: 32, background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border-color)', transition: 'transform 0.2s', cursor: 'default' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem', fontWeight: 900 }}>
                    {i === 0 ? <Layers size={32} /> : i === 1 ? <Scissors size={32} /> : <FileDown size={32} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
                    <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'split_geo_targeting':
        return (
          <section key={index} className="seo-section split-geo" style={{ padding: '80px 24px', margin: '40px 0', background: 'var(--bg-main)' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', alignItems: 'stretch', gap: 0, borderRadius: 32, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ flex: '1 1 50%', padding: '60px 40px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 24, alignSelf: 'flex-start' }}>Local Processing Node</div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
              </div>
              <div style={{ flex: '1 1 50%', minHeight: 300, background: 'linear-gradient(45deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
                <MapPin size={80} color="white" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
              </div>
            </div>
          </section>
        );

      case 'split_privacy_security':
        return (
          <section key={index} className="seo-section split-privacy" style={{ padding: '80px 24px', margin: '60px 0', background: '#111827', borderRadius: 32, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(59, 130, 246, 0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <Lock size={64} color="#60a5fa" style={{ marginBottom: 32 }} />
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'white' }}>{section.title}</h2>
              <p style={{ fontSize: '1.25rem', color: '#9ca3af', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600 }}>No External API Calls</div>
                <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600 }}>Memory-Only Execution</div>
              </div>
            </div>
          </section>
        );

      case 'split_performance':
        return (
          <section key={index} className="seo-section split-performance" style={{ padding: '60px 0', margin: '40px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ flex: '1 1 400px' }}>
                <Monitor size={48} color="#ec4899" style={{ marginBottom: 24 }} />
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 24, color: 'var(--text-main)', lineHeight: 1.2 }}>{section.title}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.content}</p>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>Browser Speed</span>
                  <ArrowRight size={24} color="#ec4899" />
                </div>
                <div style={{ padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>WASM Compilation</span>
                  <ArrowRight size={24} color="#a855f7" />
                </div>
              </div>
            </div>
          </section>
        );

      case 'geo_targeting':
        return (
          <section key={index} className="seo-section geo-targeting" style={{ padding: '80px 24px', margin: '40px 0' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: flipLayout ? 'row-reverse' : 'row', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 48 }}>
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
      {/* Dynamic Sections (Order Randomized Deterministically) */}
      {orderedSections.map((section, index) => renderSection(section, index))}

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

// @ts-nocheck
import React from 'react';
import { Image as ImageIcon, Images, Focus, FileDown, ShieldCheck, Zap, Maximize } from 'lucide-react';
import type { SectionProps } from '../types';

export const ImageToPdfHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: 'var(--brand-primary)', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Decorative background circles */}
    <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'white', opacity: 0.05, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'white', opacity: 0.05, pointerEvents: 'none' }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', perspective: 1000 }}>
         {/* Animated Photo Stack */}
         <div style={{ position: 'relative', width: 300, height: 350, transformStyle: 'preserve-3d' }}>
            {/* Top Photo */}
            <div style={{ position: 'absolute', top: 0, left: 20, width: 260, height: 260, background: 'white', borderRadius: 16, padding: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transform: 'rotate(-5deg) translateZ(30px)', display: 'flex', flexDirection: 'column', zIndex: 3, animation: 'floatTop 6s ease-in-out infinite alternate' }}>
               <div style={{ flex: 1, background: '#fef2f2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={64} color="var(--brand-primary)" opacity={0.5} />
               </div>
               <div style={{ height: 20 }} />
            </div>
            
            {/* Middle Photo */}
            <div style={{ position: 'absolute', top: 30, left: -10, width: 260, height: 260, background: '#f8fafc', borderRadius: 16, padding: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', transform: 'rotate(8deg) translateZ(20px)', display: 'flex', flexDirection: 'column', zIndex: 2 }}>
               <div style={{ flex: 1, background: '#e0f2fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={64} color="#3b82f6" opacity={0.5} />
               </div>
               <div style={{ height: 20 }} />
            </div>
            
            {/* Bottom Photo */}
            <div style={{ position: 'absolute', top: 60, left: 40, width: 260, height: 260, background: '#f1f5f9', borderRadius: 16, padding: 12, boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transform: 'rotate(-12deg) translateZ(10px)', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
               <div style={{ flex: 1, background: '#dcfce3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={64} color="#10b981" opacity={0.5} />
               </div>
               <div style={{ height: 20 }} />
            </div>
            
            <style>{`@keyframes floatTop { 0% { transform: rotate(-5deg) translateZ(30px) translateY(0); } 100% { transform: rotate(-2deg) translateZ(30px) translateY(-20px); } }`}</style>
            
            {/* PDF Binder Clip */}
            <div style={{ position: 'absolute', top: -10, left: 50, width: 60, height: 40, background: '#1e293b', borderRadius: 8, zIndex: 10, transform: 'rotate(-5deg) translateZ(40px)', boxShadow: '0 5px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.9rem' }}>PDF</div>
         </div>
      </div>
      
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(0,0,0,0.15)', borderRadius: 100, fontWeight: 700, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Images size={16} /> Batch Image Compiler
        </div>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', opacity: 0.9, lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ImageToPdfHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40, position: 'relative' }}>
      {/* Visual connecting line */}
      <div style={{ position: 'absolute', left: 40, top: 0, bottom: 0, width: 4, background: 'var(--bg-card)' }} className="hidden-mobile" />
      
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40, padding: 32, background: 'var(--bg-card)', borderRadius: 32, border: '1px solid var(--border-color)', position: 'relative', zIndex: 1 }} className="hover-lift">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(225, 29, 72, 0.2)', marginLeft: -4 }}>
            {i === 0 ? <ImageIcon size={32} /> : i === 1 ? <Focus size={32} /> : <FileDown size={32} />}
          </div>
          <div>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ImageToPdfGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: '#111827', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#9ca3af', lineHeight: 1.7, maxWidth: 800, margin: '0 auto 60px' }}>{section.content}</p>
       
       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {(badges || ['ID Scans', 'Invoices', 'Sketches', 'Photos']).map((item, i) => (
             <div key={i} style={{ width: 140, height: 140, background: '#1f2937', borderRadius: 24, border: '1px solid #374151', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <ImageIcon size={32} color="var(--brand-primary)" />
                <span style={{ fontWeight: 700, color: 'white' }}>{item}</span>
             </div>
          ))}
       </div>
    </div>
  </section>
);

export const ImageToPdfPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ position: 'relative', padding: 48, background: 'var(--bg-app)', borderRadius: '50%', border: '8px solid var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <ShieldCheck size={80} color="var(--brand-primary)" />
            {/* Spinning text ring around the shield would go here if we wanted complex SVG */}
         </div>
      </div>
    </div>
  </section>
);

export const ImageToPdfPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative', color: 'white' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
       <Zap size={64} style={{ margin: '0 auto 40px' }} />
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, lineHeight: 1.7, maxWidth: 800, margin: '0 auto 60px' }}>{section.content}</p>
       
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ padding: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 24, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>No Quality Loss</h3>
             <p style={{ opacity: 0.8 }}>Images are embedded directly into the PDF without aggressive recompression.</p>
          </div>
          <div style={{ padding: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 24, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Instant Merging</h3>
             <p style={{ opacity: 0.8 }}>Compile 100+ images into a single PDF document in less than 3 seconds.</p>
          </div>
       </div>
    </div>
  </section>
);

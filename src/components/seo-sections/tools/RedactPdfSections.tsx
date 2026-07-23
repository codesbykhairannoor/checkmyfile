// @ts-nocheck
import React from 'react';
import { Eraser, FileSignature, AlertTriangle, Fingerprint, EyeOff, FileText, Ban } from 'lucide-react';
import type { SectionProps } from '../types';

export const RedactHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: '#000000', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Classified Stamp Background */}
    <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.05, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
       <h1 style={{ fontSize: '15rem', color: 'red', margin: 0, lineHeight: 0.8, letterSpacing: '0.1em' }}>TOP</h1>
       <h1 style={{ fontSize: '15rem', color: 'red', margin: 0, lineHeight: 0.8, letterSpacing: '0.1em' }}>SECRET</h1>
    </div>
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.2)', borderRadius: 100, color: '#ef4444', fontWeight: 800, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={18} /> Permanent Data Deletion
        </div>
        
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 24, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          {section.title}
        </h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#a1a1aa', lineHeight: 1.6, marginBottom: 40 }}>
          {section.content}
        </p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
            {/* The Document */}
            <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div style={{ height: 24, width: '60%', background: '#f1f5f9', borderRadius: 4 }} />
               <div style={{ height: 16, width: '100%', background: '#f1f5f9', borderRadius: 4, marginTop: 16 }} />
               <div style={{ height: 16, width: '90%', background: '#f1f5f9', borderRadius: 4 }} />
               <div style={{ height: 16, width: '95%', background: '#f1f5f9', borderRadius: 4 }} />
               
               {/* Redacted Line */}
               <div style={{ height: 24, width: '70%', background: 'black', borderRadius: 4, marginTop: 16, position: 'relative', overflow: 'hidden' }}>
                  {/* Glitch effect on the black box */}
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 20, background: 'rgba(255,255,255,0.2)', animation: 'scan 2s infinite linear' }} />
               </div>
               <style>{`@keyframes scan { 0% { left: -20px; } 100% { left: 100%; } }`}</style>
               
               <div style={{ height: 16, width: '85%', background: '#f1f5f9', borderRadius: 4, marginTop: 16 }} />
               <div style={{ height: 16, width: '100%', background: '#f1f5f9', borderRadius: 4 }} />
            </div>
            
            {/* Hovering marker */}
            <div style={{ position: 'absolute', right: -20, bottom: 100, background: '#18181b', padding: 16, borderRadius: 16, border: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
               <Eraser color="#ef4444" size={24} />
               <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>Blackout Tool</span>
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const RedactHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 48, background: 'var(--bg-app)', borderRadius: 32, borderTop: '4px solid #ef4444', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ flexShrink: 0, color: '#ef4444' }}>
            {i === 0 ? <FileText size={48} /> : i === 1 ? <Ban size={48} /> : <EyeOff size={48} />}
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

export const RedactGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: '#09090b', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#a1a1aa', lineHeight: 1.7, maxWidth: 800, margin: '0 auto 60px' }}>{section.content}</p>
       
       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          {(badges || ['Legal', 'Medical', 'Government', 'Financial']).map((item, i) => (
             <div key={i} style={{ padding: '12px 24px', background: '#18181b', borderRadius: 100, border: '1px solid #27272a', fontWeight: 700, fontSize: '1rem', color: '#e4e4e7' }}>
                {item} Grade
             </div>
          ))}
       </div>
    </div>
  </section>
);

export const RedactPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--brand-primary)', color: 'white', position: 'relative', boxShadow: '0 30px 60px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
            <Fingerprint size={64} color="white" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>PDF Object Deletion</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7 }}>We don't just put a black box over your text. We surgically remove the text data from the PDF's internal structure.</p>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const RedactPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 800, margin: '0 auto 60px' }}>{section.content}</p>
       
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {/* Comparison Cards */}
          <div style={{ padding: 40, background: '#fef2f2', borderRadius: 24, border: '1px solid #fecaca' }}>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b91c1c', marginBottom: 16 }}>Fake Redaction</h3>
             <ul style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, color: '#7f1d1d' }}>
                <li>❌ Just draws a box</li>
                <li>❌ Text can be copy-pasted</li>
                <li>❌ Fails court submission</li>
             </ul>
          </div>
          <div style={{ padding: 40, background: 'var(--bg-app)', borderRadius: 24, border: '2px solid var(--brand-primary)' }}>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16 }}>Our Redaction</h3>
             <ul style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--text-main)' }}>
                <li>✅ Deletes vector objects</li>
                <li>✅ Re-renders background</li>
                <li>✅ Court-ready output</li>
             </ul>
          </div>
       </div>
    </div>
  </section>
);

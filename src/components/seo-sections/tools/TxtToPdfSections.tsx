// @ts-nocheck
// Trigger HMR rebuild
import React from 'react';
import { AlignLeft, Terminal, FileText, Download, ShieldAlert, Cpu, Settings2, FileCheck } from 'lucide-react';
import type { SectionProps } from '../types';

export const TxtToPdfHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: '#0f172a', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Grid / Terminal Background */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--brand-glow)', borderRadius: 100, color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: 24, gap: 12, alignItems: 'center', border: '1px solid var(--brand-primary)' }}>
          <Terminal size={18} /> Raw Text to PDF
        </div>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#94a3b8', lineHeight: 1.8, marginBottom: 40 }}>{section.content}</p>
      </div>
      
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ position: 'relative', width: '100%', maxWidth: 460, height: 320 }}>
            {/* Terminal Window Mockup */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 40, bottom: 40, background: '#1e293b', borderRadius: 16, border: '2px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
               {/* Terminal Header */}
               <div style={{ height: 36, background: '#0f172a', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ marginLeft: 8, fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>server.log</span>
               </div>
               {/* Terminal Content */}
               <div style={{ flex: 1, padding: 24, fontFamily: 'monospace', color: 'var(--brand-primary)', fontSize: '0.9rem', lineHeight: 1.6, position: 'relative' }}>
                  [INFO] Starting conversion...<br/>
                  [DATA] Found 14,023 characters.<br/>
                  [WARN] Encoding detected: UTF-8<br/>
                  <span style={{ animation: 'blinkCursor 1s step-end infinite' }}>_</span>
               </div>
               <style>{`@keyframes blinkCursor { 50% { opacity: 0; } }`}</style>
            </div>
            
            {/* The Document Transformation */}
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 220, height: 260, background: 'white', borderRadius: 8, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', padding: 32, zIndex: 10, animation: 'slideDocUp 4s ease-in-out infinite alternate', transformOrigin: 'bottom center' }}>
               <div style={{ position: 'absolute', top: -16, left: -16, width: 48, height: 48, background: 'var(--brand-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid #0f172a' }}>
                  <FileText size={24} />
               </div>
               
               {/* Nicely formatted document lines */}
               <h4 style={{ color: '#0f172a', margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 900, borderBottom: '2px solid #e2e8f0', paddingBottom: 8 }}>Server Log</h4>
               <div style={{ height: 8, width: '100%', background: '#cbd5e1', borderRadius: 4, marginBottom: 12 }} />
               <div style={{ height: 8, width: '90%', background: '#e2e8f0', borderRadius: 4, marginBottom: 12 }} />
               <div style={{ height: 8, width: '95%', background: '#e2e8f0', borderRadius: 4, marginBottom: 12 }} />
               <div style={{ height: 8, width: '80%', background: '#e2e8f0', borderRadius: 4, marginBottom: 12 }} />
               <div style={{ height: 8, width: '85%', background: '#e2e8f0', borderRadius: 4 }} />
            </div>
            <style>{`@keyframes slideDocUp { 0% { transform: translateY(20px); opacity: 0.8; } 100% { transform: translateY(0); opacity: 1; } }`}</style>
         </div>
      </div>
    </div>
  </section>
);

export const TxtToPdfHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40, padding: 48, background: 'var(--bg-app)', borderRadius: 24, borderLeft: '4px solid var(--brand-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ flexShrink: 0, color: 'var(--brand-primary)' }}>
            {i === 0 ? <Terminal size={48} /> : i === 1 ? <Settings2 size={48} /> : <FileCheck size={48} />}
          </div>
          <div>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const TxtToPdfGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
       <div>
         <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
         <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
       </div>
       <div style={{ padding: 48, background: '#0f172a', borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 24, color: 'white' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>Offline Security</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, color: '#94a3b8', fontSize: '1.1rem' }}>
             <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldAlert color="var(--brand-primary)" /> Prevent code leaks</li>
             <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldAlert color="var(--brand-primary)" /> Safe for API keys / Logs</li>
             <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldAlert color="var(--brand-primary)" /> Absolute privacy</li>
          </ul>
       </div>
    </div>
  </section>
);

export const TxtToPdfPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: 'var(--brand-primary)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: '#0f172a', position: 'relative', zIndex: 1 }}>
       <div style={{ width: 100, height: 100, margin: '0 auto 40px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlignLeft size={48} color="white" />
       </div>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, fontWeight: 700, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const TxtToPdfPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: '50%', border: '8px solid var(--border-color)', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.05)' }}>
             <Cpu size={80} color="var(--brand-primary)" />
             <div style={{ position: 'absolute', bottom: 40, background: '#0f172a', color: 'white', padding: '8px 16px', borderRadius: 100, fontWeight: 800, fontSize: '1rem' }}>Local Wasm</div>
          </div>
       </div>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40 }}>{section.content}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(badges || ['No upload required', 'Instant Typesetting', 'Millisecond Save']).map((item, i) => (
             <div key={i} style={{ padding: '16px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}>
                {item}
             </div>
          ))}
        </div>
       </div>
    </div>
  </section>
);

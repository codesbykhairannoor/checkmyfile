// @ts-nocheck
import React from 'react';
import { Terminal, FileSpreadsheet, FileJson, Code2, Database, UploadCloud, ServerCrash, LayoutList, ChevronRight, Binary } from 'lucide-react';
import type { SectionProps } from '../types';

export const ExcelToCsvHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: '#020617', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Terminal scanline effect */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         {/* Terminal Window Graphic */}
         <div style={{ width: 440, background: '#0f172a', borderRadius: 16, border: '1px solid #334155', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ background: '#1e293b', padding: '12px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
               <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
               <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
               <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
               <div style={{ marginLeft: 16, fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>pipeline.sh - extraction</div>
            </div>
            <div style={{ padding: 24, fontFamily: 'monospace', fontSize: '0.9rem', color: '#10b981', display: 'flex', flexDirection: 'column', gap: 12 }}>
               <div><span style={{ color: '#3b82f6' }}>$</span> extract --input data.xlsx --format csv</div>
               <div style={{ color: '#94a3b8' }}>{`> Loading workbook... OK`}</div>
               <div style={{ color: '#94a3b8' }}>{`> Parsing Sheet1 (50,000 rows)... OK`}</div>
               <div style={{ color: '#94a3b8' }}>{`> Removing styles & formulas... OK`}</div>
               <div style={{ color: '#94a3b8' }}>{`> Writing UTF-8 CSV blob... OK`}</div>
               <div style={{ color: '#22c55e' }}>{`> SUCCESS: output.csv generated locally (0ms network)`}</div>
               <div className="blinking-cursor" style={{ width: 10, height: 18, background: '#3b82f6', marginTop: 8 }} />
            </div>
         </div>
         <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } } .blinking-cursor { animation: blink 1s step-end infinite; }`}</style>
      </div>
      
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '8px 16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 100, color: '#22c55e', fontWeight: 700, fontSize: '0.85rem', marginBottom: 24, gap: 8, alignItems: 'center', fontFamily: 'monospace' }}>
          <Binary size={16} /> NO_UPLOAD=true
        </div>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 24, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#94a3b8', lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ExcelToCsvHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '32px 48px', background: 'var(--bg-card)', borderRadius: 24, borderLeft: '8px solid var(--brand-primary)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="hover-lift">
          <div style={{ flexShrink: 0 }}>
            {i === 0 ? <FileSpreadsheet size={48} color="var(--brand-primary)" /> : i === 1 ? <LayoutList size={48} color="var(--brand-primary)" /> : <FileJson size={48} color="var(--brand-primary)" />}
          </div>
          <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12, color: 'var(--text-main)' }}>{step.title}</h3>
             <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{step.description}</p>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.2, fontFamily: 'monospace' }}>
            STEP_0{i + 1}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ExcelToCsvGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'var(--brand-primary)', color: 'white', position: 'relative', boxShadow: '0 30px 60px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
            <Database size={48} color="white" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>Pipeline Ready</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>Clean CSV output is the universal language for databases, ML models, and data pipelines.</p>
         </div>
      </div>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ExcelToCsvPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#020617', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', padding: 24, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginBottom: 40, border: '2px dashed #ef4444' }}>
        <ServerCrash size={64} color="#ef4444" />
      </div>
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#94a3b8', fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
      <div style={{ marginTop: 40, display: 'inline-flex', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', color: '#10b981', fontFamily: 'monospace', alignItems: 'center', gap: 12 }}>
         <Code2 size={20} /> `upload_to_server = false; process_in_ram = true;`
      </div>
    </div>
  </section>
);

export const ExcelToCsvPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40 }}>{section.content}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(badges || ['No Network Latency', 'High-Speed Parsing', 'Handles Giant Workbooks']).map((item, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                <ChevronRight size={24} color="var(--brand-primary)" /> {item}
             </div>
          ))}
        </div>
       </div>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontSize: '15rem', fontWeight: 900, color: 'var(--brand-primary)', opacity: 0.1, lineHeight: 0.8, userSelect: 'none' }}>
             0ms
          </div>
       </div>
    </div>
  </section>
);

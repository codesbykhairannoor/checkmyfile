// @ts-nocheck
import React from 'react';
import { Table, Sheet, FileSpreadsheet, Download, Columns, ArrowRightLeft, ShieldCheck, Database, LayoutGrid } from 'lucide-react';
import type { SectionProps } from '../types';

export const CsvToExcelHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '120px 24px', margin: '80px 0 60px', background: 'var(--bg-app)', position: 'relative', overflow: 'hidden' }}>
    {/* Futuristic background grid */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(225, 29, 72, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(225, 29, 72, 0.05) 1px, transparent 1px)', zIndex: 0 }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--bg-card)', borderRadius: 100, color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: 40, gap: 12, alignItems: 'center', border: '1px solid var(--brand-primary)', boxShadow: '0 10px 30px rgba(225, 29, 72, 0.15)' }}>
        <Database size={18} /> SheetJS Engine Powered
      </div>
      
      <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 900 }}>{section.title}</h2>
      <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 80px' }}>{section.content}</p>
      
      {/* Extreme Transformation Graphic */}
      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
         {/* CSV Card */}
         <div style={{ flex: 1, background: 'var(--bg-card)', padding: 40, borderRadius: 32, border: '2px dashed var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }} className="hover-lift">
            <LayoutGrid size={64} color="var(--text-muted)" />
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)' }}>Raw .CSV</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>id,name,email<br/>1,john,doe@mail.com</div>
         </div>
         
         {/* Arrow */}
         <div style={{ flexShrink: 0, animation: 'pulseArrow 2s infinite' }}>
            <ArrowRightLeft size={48} color="var(--brand-primary)" />
         </div>
         <style>{`@keyframes pulseArrow { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0.5; } }`}</style>
         
         {/* Excel Card */}
         <div style={{ flex: 1, background: 'var(--brand-gradient)', padding: 40, borderRadius: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 20px 40px rgba(225, 29, 72, 0.3)' }} className="hover-lift">
            <FileSpreadsheet size={64} color="white" />
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>Excel .XLSX</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textAlign: 'center' }}>Structured Columns<br/>Native Worksheet</div>
         </div>
      </div>
    </div>
  </section>
);

export const CsvToExcelHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ padding: 48, background: 'var(--bg-app)', borderRadius: 40, border: '1px solid var(--border-color)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--brand-primary)', opacity: 0.1, position: 'absolute', top: 20, right: 30, lineHeight: 1 }}>
            {i + 1}
          </div>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            {i === 0 ? <LayoutGrid size={32} /> : i === 1 ? <Columns size={32} /> : <Download size={32} />}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', zIndex: 1 }}>{step.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.1rem', zIndex: 1 }}>{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const CsvToExcelGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', background: 'var(--bg-card)', borderRadius: 40, border: '1px solid var(--border-color)', padding: 80, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
       <div style={{ width: 100, height: 100, margin: '0 auto 40px', background: 'rgba(225, 29, 72, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={48} color="var(--brand-primary)" />
       </div>
       <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const CsvToExcelPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', color: '#94a3b8', fontWeight: 500, lineHeight: 1.7 }}>{section.content}</p>
      </div>
      <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
         {/* Safe Box graphic */}
         <div style={{ width: '100%', maxWidth: 400, padding: 48, borderRadius: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }} className="hover-lift">
            <ShieldCheck size={64} color="var(--brand-primary)" style={{ marginBottom: 24 }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16, color: 'white' }}>Zero Cloud Access</h3>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7 }}>All CSV parsing and Excel generation is isolated in your local memory.</p>
         </div>
      </div>
    </div>
  </section>
);

export const CsvToExcelPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--brand-gradient)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', color: 'white' }}>
       <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, lineHeight: 1.7, maxWidth: 800, margin: '0 auto 60px' }}>{section.content}</p>
       
       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {(badges || ['100,000+ Rows', 'Instant UTF-8 Parsing', 'WebAssembly Core']).map((item, i) => (
             <div key={i} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', fontWeight: 800, fontSize: '1.1rem' }}>
                {item}
             </div>
          ))}
       </div>
    </div>
  </section>
);

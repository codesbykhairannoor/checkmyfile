// @ts-nocheck
import React from 'react';
import { Table, FileOutput, ShieldCheck, Lock, Activity, FileSpreadsheet, LockKeyhole } from 'lucide-react';
import type { SectionProps } from '../types';

export const ExcelToPdfHeroSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section hero" style={{ padding: '100px 24px', margin: '80px 0 60px', background: '#0f172a', borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
    {/* Grid / Spreadsheet Background */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 40px', opacity: 0.5, zIndex: 0 }} />
    
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1, color: 'white' }}>
      <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: '100%', maxWidth: 460, position: 'relative', height: 350 }}>
            {/* The Excel Table Mockup */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 40, bottom: 40, background: 'var(--bg-app)', borderRadius: 16, border: '2px solid #10b981', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
               {/* Excel Header */}
               <div style={{ height: 40, background: '#10b981', display: 'flex', alignItems: 'center', padding: '0 16px', color: 'white', fontWeight: 800, gap: 8 }}>
                  <Table size={18} /> data_q3.xlsx
               </div>
               {/* Excel Cells */}
               <div style={{ flex: 1, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                     <div key={i} style={{ height: 24, background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }} />
                  ))}
               </div>
            </div>
            
            {/* The Conversion Process -> PDF */}
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 200, height: 240, background: 'white', borderRadius: 16, border: '2px solid var(--brand-primary)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(225, 29, 72, 0.3)', padding: 24, zIndex: 10 }}>
               <div style={{ position: 'absolute', top: -30, left: -30, width: 60, height: 60, background: 'var(--brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid #0f172a' }}>
                  <FileOutput size={24} />
               </div>
               {/* PDF Lines */}
               <div style={{ height: 16, width: '80%', background: 'var(--bg-app)', borderRadius: 4, marginBottom: 24, marginTop: 16 }} />
               <div style={{ height: 12, width: '100%', background: 'var(--bg-app)', borderRadius: 4, marginBottom: 8 }} />
               <div style={{ height: 12, width: '100%', background: 'var(--bg-app)', borderRadius: 4, marginBottom: 8 }} />
               <div style={{ height: 12, width: '90%', background: 'var(--bg-app)', borderRadius: 4, marginBottom: 8 }} />
               <div style={{ height: 12, width: '95%', background: 'var(--bg-app)', borderRadius: 4 }} />
            </div>
         </div>
      </div>
      
      <div style={{ flex: '1 1 500px' }}>
        <div style={{ display: 'inline-flex', padding: '10px 24px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 100, color: '#10b981', fontWeight: 800, fontSize: '0.9rem', marginBottom: 24, gap: 8, alignItems: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <LockKeyhole size={18} /> Lock Formatting
        </div>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#94a3b8', lineHeight: 1.8 }}>{section.content}</p>
      </div>
    </div>
  </section>
);

export const ExcelToPdfHowToSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section how-to" style={{ padding: '120px 24px', background: 'var(--bg-card)', position: 'relative' }}>
    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: 80, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{section.title}</h2>
    
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {section.steps?.map((step: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40, padding: 48, background: 'var(--bg-app)', borderRadius: 24, borderLeft: '4px solid #10b981', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} className="hover-lift">
          <div style={{ flexShrink: 0, color: '#10b981' }}>
            {i === 0 ? <FileSpreadsheet size={48} /> : i === 1 ? <Table size={48} /> : <FileOutput size={48} />}
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

export const ExcelToPdfGeoSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section geo" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
       <div>
         <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
         <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>{section.content}</p>
       </div>
       <div style={{ padding: 48, background: 'var(--bg-card)', borderRadius: 32, border: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>Business Trusted</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--text-muted)', fontSize: '1.1rem' }}>
             <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck color="#10b981" /> No data collection</li>
             <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck color="#10b981" /> Runs without internet</li>
             <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck color="#10b981" /> Zero server retention</li>
          </ul>
       </div>
    </div>
  </section>
);

export const ExcelToPdfPrivacySection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section privacy" style={{ padding: '120px 24px', background: '#10b981', position: 'relative', overflow: 'hidden' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
       <div style={{ width: 100, height: 100, margin: '0 auto 40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <Lock size={48} color="white" />
       </div>
       <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{section.title}</h2>
       <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', opacity: 0.9, fontWeight: 500, lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>{section.content}</p>
    </div>
  </section>
);

export const ExcelToPdfPerformanceSection: React.FC<SectionProps> = ({ section, badges, stats, buttonText }) => (
  <section className="seo-section performance" style={{ padding: '120px 24px', background: 'var(--bg-app)', position: 'relative' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap-reverse', gap: 64, alignItems: 'center' }}>
       <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Spinning graph ring */}
             <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', animation: 'spinVault 10s linear infinite' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-card)" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="100 200" strokeLinecap="round" />
             </svg>
             <Activity size={64} color="#10b981" />
          </div>
       </div>
       <div style={{ flex: '1 1 500px' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 32, color: 'var(--text-main)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>{section.title}</h2>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40 }}>{section.content}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(badges || ['No upload queue', 'Browser Rendering', 'Instant Save']).map((item, i) => (
             <div key={i} style={{ padding: '16px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}>
                {item}
             </div>
          ))}
        </div>
       </div>
    </div>
  </section>
);

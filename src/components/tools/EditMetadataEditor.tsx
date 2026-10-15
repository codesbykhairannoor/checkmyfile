import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Download, Settings2, Sparkles, Calendar, ShieldCheck, ArrowRight, RefreshCw, RotateCcw } from 'lucide-react';
import type { ExistingPdfMetadata } from '../../engines/pdf/editMetadataPdf';

interface EditMetadataEditorProps {
  file: File;
  onApply: (metadataConfig: any) => void;
  tUi?: Record<string, string>;
  currentLang?: string;
  isProcessing: boolean;
}

export const EditMetadataEditor: React.FC<EditMetadataEditorProps> = ({
  file,
  onApply,
  tUi = {},
  currentLang = 'id',
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [creator, setCreator] = useState('');
  const [producer, setProducer] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [modDate, setModDate] = useState('');
  const [purgeAiManifests, setPurgeAiManifests] = useState(true);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [originalMeta, setOriginalMeta] = useState<ExistingPdfMetadata | null>(null);
  const [showOriginalMeta, setShowOriginalMeta] = useState(false);

  // Read existing metadata when file changes
  useEffect(() => {
    let isCancelled = false;
    const loadMeta = async () => {
      if (!file) return;
      setIsLoadingMeta(true);
      try {
        const { readPdfMetadata } = await import('../../engines/pdf/editMetadataPdf');
        const meta = await readPdfMetadata(file, currentLang);
        if (!isCancelled) {
          setOriginalMeta(meta);
          setTitle(meta.title);
          setAuthor(meta.author);
          setSubject(meta.subject);
          setKeywords(meta.keywords);
          setCreator(meta.creator);
          setProducer(meta.producer);
          setCreationDate(meta.creationDate);
          setModDate(meta.modDate || getNowDatetimeLocal());
        }
      } catch (err) {
        console.warn('Failed to read existing PDF metadata:', err);
      } finally {
        if (!isCancelled) setIsLoadingMeta(false);
      }
    };
    loadMeta();
    return () => {
      isCancelled = true;
    };
  }, [file, currentLang]);

  const resetToOriginal = () => {
    if (!originalMeta) return;
    setTitle(originalMeta.title);
    setAuthor(originalMeta.author);
    setSubject(originalMeta.subject);
    setKeywords(originalMeta.keywords);
    setCreator(originalMeta.creator);
    setProducer(originalMeta.producer);
    setCreationDate(originalMeta.creationDate);
    setModDate(originalMeta.modDate || getNowDatetimeLocal());
  };

  const getNowDatetimeLocal = (): string => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const applyPreset = (presetKey: string) => {
    const now = getNowDatetimeLocal();
    switch (presetKey) {
      case 'word':
        setCreator('Microsoft® Word for Microsoft 365');
        setProducer('Microsoft® Word for Microsoft 365');
        if (!creationDate) setCreationDate(now);
        setModDate(now);
        break;
      case 'adobe':
        setCreator('Adobe Acrobat Reader (64-bit) 24.1.20604.0');
        setProducer('Adobe PDF Library 24.1.20604');
        if (!creationDate) setCreationDate(now);
        setModDate(now);
        break;
      case 'apple':
        setCreator('Pages');
        setProducer('macOS Version 14.5 (Build 23F79) Quartz PDFContext');
        if (!creationDate) setCreationDate(now);
        setModDate(now);
        break;
      case 'gdocs':
        setCreator('Google Docs');
        setProducer('Skia/PDF m124 Google Docs Renderer');
        if (!creationDate) setCreationDate(now);
        setModDate(now);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const kwArray = keywords
      .split(/[,;\n]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);

    onApply({
      title,
      author,
      subject,
      keywords: kwArray,
      creator,
      producer,
      creationDate: creationDate ? new Date(creationDate).toISOString() : undefined,
      modDate: modDate ? new Date(modDate).toISOString() : new Date().toISOString(),
      purgeAiManifests,
    });
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 320 }}>
      {/* Header */}
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={20} className="text-brand-primary" />
          <span>{currentLang === 'id' ? 'Edit Metadata & Properti PDF' : 'Edit PDF Metadata'}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {currentLang === 'id'
            ? 'Atur judul, penulis hak cipta, tanggal pengerjaan, dan software pembuat dokumen secara resmi.'
            : 'Customize author, document title, keywords, creator software, and timestamps seamlessly.'}
        </p>
      </div>

      {isLoadingMeta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ width: 14, height: 14, border: '2px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>{currentLang === 'id' ? 'Membaca metadata dokumen...' : 'Reading document properties...'}</span>
        </div>
      )}

      {/* Original Metadata Inspector Card */}
      {originalMeta && (
        <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setShowOriginalMeta(prev => !prev)}
            style={{
              width: '100%',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔍</span>
              <span>{currentLang === 'id' ? 'Metadata Asli Dokumen' : 'Original Document Metadata'}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: originalMeta.foundCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: originalMeta.foundCount > 0 ? '#f59e0b' : '#10b981',
                  fontWeight: 700,
                }}
              >
                {originalMeta.foundCount} {currentLang === 'id' ? 'Terdeteksi' : 'Found'}
              </span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {showOriginalMeta ? (currentLang === 'id' ? 'Tutup ▲' : 'Lihat Detail ▼') : (currentLang === 'id' ? 'Lihat Detail ▼' : 'View Details ▼')}
            </span>
          </button>

          {showOriginalMeta && (
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {currentLang === 'id' ? 'Nilai Asli Sebelum Diedit:' : 'Original Values Before Edit:'}
                </span>
                <button
                  type="button"
                  onClick={resetToOriginal}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    color: 'var(--brand-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontWeight: 600,
                  }}
                >
                  <RotateCcw size={11} />
                  <span>{currentLang === 'id' ? 'Reset ke Asli' : 'Reset Inputs'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'var(--bg-input)', padding: 10, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentLang === 'id' ? 'Penulis:' : 'Author:'}</span>
                  <span style={{ fontWeight: 600, color: originalMeta.author ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                    {originalMeta.author || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentLang === 'id' ? 'Judul:' : 'Title:'}</span>
                  <span style={{ fontWeight: 600, color: originalMeta.title ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                    {originalMeta.title || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentLang === 'id' ? 'Aplikasi:' : 'Creator:'}</span>
                  <span style={{ fontWeight: 600, color: originalMeta.creator ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                    {originalMeta.creator || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentLang === 'id' ? 'Mesin PDF:' : 'Producer:'}</span>
                  <span style={{ fontWeight: 600, color: originalMeta.producer ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                    {originalMeta.producer || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentLang === 'id' ? 'Dibuat Pada:' : 'Created At:'}</span>
                  <span style={{ fontWeight: 600, color: originalMeta.creationDateHuman ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                    {originalMeta.creationDateHuman || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentLang === 'id' ? 'Jejak AI/XMP:' : 'AI/XMP Stream:'}</span>
                  <span style={{ fontWeight: 600, color: originalMeta.hasXmp ? '#f59e0b' : '#10b981' }}>
                    {originalMeta.hasXmp ? (currentLang === 'id' ? '⚠️ Ada Paket XMP' : '⚠️ Has XMP') : (currentLang === 'id' ? '✅ Bersih' : '✅ Clean')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preset Quick Bar */}
      <div style={{ background: 'var(--bg-input)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <Sparkles size={14} className="text-brand-primary" />
          <span>{currentLang === 'id' ? 'Preset Aplikasi Populer:' : 'Quick Software Presets:'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          <button
            type="button"
            onClick={() => applyPreset('word')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left' }}
          >
            🪟 MS Word 365
          </button>
          <button
            type="button"
            onClick={() => applyPreset('adobe')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left' }}
          >
            📕 Adobe Acrobat
          </button>
          <button
            type="button"
            onClick={() => applyPreset('apple')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left' }}
          >
            🍏 Apple Pages
          </button>
          <button
            type="button"
            onClick={() => applyPreset('gdocs')}
            style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left' }}
          >
            🌐 Google Docs
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {currentLang === 'id' ? 'Judul Dokumen (Title)' : 'Document Title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={currentLang === 'id' ? 'cth: Laporan Kerja Praktek 2026' : 'e.g. Official Project Proposal'}
            style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
        </div>

        {/* Author */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {currentLang === 'id' ? 'Penulis / Pemilik Hak Cipta (Author)' : 'Author / Copyright Owner'}
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={currentLang === 'id' ? 'cth: Khairan Noor' : 'e.g. John Doe'}
            style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
        </div>

        {/* Subject */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {currentLang === 'id' ? 'Subjek / Deskripsi (Subject)' : 'Subject / Topic'}
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={currentLang === 'id' ? 'cth: Perjanjian Kerjasama Bisnis' : 'e.g. Business Agreement'}
            style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
        </div>

        {/* Keywords */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
            {currentLang === 'id' ? 'Kata Kunci (Keywords, pisahkan koma)' : 'Keywords (Comma separated)'}
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="proposal, final, signed, 2026"
            style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
        </div>

        {/* Creator & Producer in 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
              {currentLang === 'id' ? 'Aplikasi (Creator)' : 'Application (Creator)'}
            </label>
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="Microsoft® Word 365"
              style={{ width: '100%', padding: '8px 10px', fontSize: '0.8rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
              {currentLang === 'id' ? 'Mesin PDF (Producer)' : 'PDF Engine (Producer)'}
            </label>
            <input
              type="text"
              value={producer}
              onChange={(e) => setProducer(e.target.value)}
              placeholder="Adobe PDF Library"
              style={{ width: '100%', padding: '8px 10px', fontSize: '0.8rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        {/* Creation Date & Mod Date */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentLang === 'id' ? 'Tanggal Pembuatan Dokumen' : 'Creation Date'}
            </label>
            <button
              type="button"
              onClick={() => setCreationDate(getNowDatetimeLocal())}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.72rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            >
              {currentLang === 'id' ? 'Set Sekarang' : 'Set to Now'}
            </button>
          </div>
          <input
            type="datetime-local"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
        </div>

        {/* C2PA / AI Purge Checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
          <input
            type="checkbox"
            checked={purgeAiManifests}
            onChange={(e) => setPurgeAiManifests(e.target.checked)}
            style={{ marginTop: 2, cursor: 'pointer' }}
          />
          <div style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
            <strong style={{ color: 'var(--text-main)', display: 'block' }}>
              <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4, color: '#10b981' }} />
              {currentLang === 'id' ? 'Bersihkan Jejak Manifest AI & C2PA' : 'Purge AI & C2PA Provenance Manifests'}
            </strong>
            <span style={{ color: 'var(--text-muted)' }}>
              {currentLang === 'id'
                ? 'Hapus paket XML XMP tersembunyi yang disisipkan oleh generator otomatis.'
                : 'Delete hidden XML XMP tracking streams generated by automated AI tools.'}
            </span>
          </div>
        </label>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        disabled={isProcessing}
        className="btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>
          {isProcessing
            ? (currentLang === 'id' ? 'Menerapkan Properti...' : 'Saving Properties...')
            : (currentLang === 'id' ? 'Simpan & Terapkan Metadata' : 'Save & Update Metadata')}
        </span>
      </button>

      {/* Cross-link to Remove Metadata */}
      <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <a
          href={currentLang === 'id' ? '/id/hapus-metadata-pdf' : '/remove-pdf-metadata'}
          style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>{currentLang === 'id' ? 'Ingin mengosongkan seluruh data tanpa jejak?' : 'Want to completely strip all metadata?'}</span>
          <strong style={{ color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {currentLang === 'id' ? 'Hapus Metadata' : 'Remove Metadata'} <ArrowRight size={12} />
          </strong>
        </a>
      </div>
    </div>
  );
};

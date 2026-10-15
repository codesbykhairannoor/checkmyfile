import React, { useState, useEffect } from 'react';
import { Eraser, Download, Settings2, ArrowRight, ShieldCheck, AlertTriangle, FileText, RefreshCw, User, Tag, Laptop, Cpu, Calendar, Clock, Sparkles } from 'lucide-react';
import type { ExistingPdfMetadata } from '../../engines/pdf/editMetadataPdf';

interface RemoveMetadataEditorProps {
  file?: File;
  tUi?: Record<string, string>;
  onProcess: () => void;
  isProcessing: boolean;
  currentLang?: string;
}

export const RemoveMetadataEditor: React.FC<RemoveMetadataEditorProps> = ({
  file,
  tUi = {},
  onProcess,
  isProcessing,
  currentLang = 'id',
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const isId = currentLang === 'id';

  const [metadata, setMetadata] = useState<ExistingPdfMetadata | null>(null);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const loadMetadata = async () => {
    if (!file) return;
    setIsLoadingMeta(true);
    try {
      const { readPdfMetadata } = await import('../../engines/pdf/editMetadataPdf');
      const meta = await readPdfMetadata(file, currentLang);
      setMetadata(meta);
    } catch (err) {
      console.warn('Failed to inspect PDF metadata:', err);
    } finally {
      setIsLoadingMeta(false);
    }
  };

  useEffect(() => {
    loadMetadata();
  }, [file, currentLang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          background: 'var(--bg-card)',
          padding: 18,
          borderRadius: 14,
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            padding: 10,
            background: 'rgba(225, 29, 72, 0.1)',
            color: 'var(--brand-primary)',
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          <Eraser size={22} />
        </div>
        <div>
          <h3
            style={{
              margin: 0,
              marginBottom: 4,
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t("remove_metadata", isId ? "Hapus Metadata PDF" : "Remove PDF Metadata")}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {t(
              "remove_metadata_desc",
              isId
                ? "Sanitasi nama penulis, software, stempel waktu, dan jejak AI secara permanen."
                : "Sanitize author, creator, GPS, and creation timestamps permanently."
            )}
          </p>
        </div>
      </div>

      {/* Metadata Inspector Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Inspector Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              🔍 {isId ? 'Hasil Pemeriksaan Metadata' : 'Document Metadata Inspector'}
            </span>
          </div>
          <button
            type="button"
            onClick={loadMetadata}
            disabled={isLoadingMeta || !file}
            title={isId ? 'Pindai ulang metadata file' : 'Rescan metadata'}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            <RefreshCw size={13} style={{ animation: isLoadingMeta ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isId ? 'Pindai Ulang' : 'Rescan'}</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoadingMeta && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              className="spinner"
              style={{
                width: 22,
                height: 22,
                border: '2px solid var(--border-color)',
                borderTopColor: 'var(--brand-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>{isId ? 'Memindai jejak & metadata dokumen...' : 'Scanning document metadata...'}</span>
          </div>
        )}

        {/* Loaded State */}
        {!isLoadingMeta && metadata && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Status Alert Banner */}
            {metadata.foundCount > 0 ? (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                  <strong style={{ color: '#f59e0b', display: 'block', marginBottom: 2 }}>
                    {isId
                      ? `Ditemukan ${metadata.foundCount} Jejak Metadata di File Ini`
                      : `Found ${metadata.foundCount} Metadata Properties in File`}
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {isId
                      ? 'Dokumen menyimpan informasi identitas & perangkat berikut yang dapat dilihat pihak lain:'
                      : 'This document contains tracking details that may expose author or software info:'}
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <ShieldCheck size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                  <strong style={{ color: '#10b981', display: 'block', marginBottom: 2 }}>
                    {isId ? 'Dokumen Bersih (0 Jejak Metadata)' : 'Clean Document (0 Metadata Found)'}
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {isId
                      ? 'Tidak ditemukan nama penulis, judul, stempel waktu, atau jejak XMP. Anda tetap dapat melakukan sanitasi untuk memastikan stream biner 100% steril.'
                      : 'No author, creator software, timestamps, or XMP streams found. You may still sanitize to ensure 100% binary-level sterilization.'}
                  </span>
                </div>
              </div>
            )}

            {/* Metadata Item List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                background: 'var(--bg-input)',
                padding: 10,
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
              }}
            >
              {/* Row 1: Penulis (Author) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <User size={13} /> {isId ? 'Penulis (Author):' : 'Author:'}
                </span>
                <span style={{ fontWeight: metadata.author ? 700 : 400, color: metadata.author ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right', wordBreak: 'break-word' }}>
                  {metadata.author || (isId ? '— (Kosong)' : '— (Empty)')}
                </span>
              </div>

              {/* Row 2: Judul (Title) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <FileText size={13} /> {isId ? 'Judul (Title):' : 'Title:'}
                </span>
                <span style={{ fontWeight: metadata.title ? 700 : 400, color: metadata.title ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right', wordBreak: 'break-word' }}>
                  {metadata.title || (isId ? '— (Kosong)' : '— (Empty)')}
                </span>
              </div>

              {/* Row 3: Subjek (Subject) */}
              {metadata.subject && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <Tag size={13} /> {isId ? 'Subjek:' : 'Subject:'}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', textAlign: 'right', wordBreak: 'break-word' }}>
                    {metadata.subject}
                  </span>
                </div>
              )}

              {/* Row 4: Kata Kunci (Keywords) */}
              {metadata.keywords && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <Tag size={13} /> {isId ? 'Kata Kunci:' : 'Keywords:'}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', wordBreak: 'break-word' }}>
                    {metadata.keywords}
                  </span>
                </div>
              )}

              {/* Row 5: Software Pembuat (Creator) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Laptop size={13} /> {isId ? 'Aplikasi (Creator):' : 'Creator App:'}
                </span>
                <span style={{ fontWeight: metadata.creator ? 700 : 400, color: metadata.creator ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right', wordBreak: 'break-word' }}>
                  {metadata.creator || (isId ? '— (Kosong)' : '— (Empty)')}
                </span>
              </div>

              {/* Row 6: Mesin PDF (Producer) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Cpu size={13} /> {isId ? 'Mesin (Producer):' : 'PDF Engine:'}
                </span>
                <span style={{ fontWeight: metadata.producer ? 700 : 400, color: metadata.producer ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right', wordBreak: 'break-word' }}>
                  {metadata.producer || (isId ? '— (Kosong)' : '— (Empty)')}
                </span>
              </div>

              {/* Row 7: Tanggal Dibuat (Creation Date) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Calendar size={13} /> {isId ? 'Dibuat Pada:' : 'Created At:'}
                </span>
                <span style={{ fontWeight: metadata.creationDateHuman ? 700 : 400, color: metadata.creationDateHuman ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                  {metadata.creationDateHuman || (isId ? '— (Kosong)' : '— (Empty)')}
                </span>
              </div>

              {/* Row 8: Terakhir Diubah (Mod Date) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Clock size={13} /> {isId ? 'Terakhir Diubah:' : 'Modified At:'}
                </span>
                <span style={{ fontWeight: metadata.modDateHuman ? 700 : 400, color: metadata.modDateHuman ? 'var(--text-main)' : 'var(--text-muted)', textAlign: 'right' }}>
                  {metadata.modDateHuman || (isId ? '— (Kosong)' : '— (Empty)')}
                </span>
              </div>

              {/* Row 9: Jejak AI & Manifest XMP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Sparkles size={13} /> {isId ? 'Paket XMP / AI:' : 'XMP / AI Stream:'}
                </span>
                {metadata.hasXmp ? (
                  <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {isId ? '⚠️ Terdeteksi (XML Metadata)' : '⚠️ Detected'}
                  </span>
                ) : (
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>
                    {isId ? '✅ Bersih' : '✅ Clean'}
                  </span>
                )}
              </div>
            </div>

            {/* Clear Explanation Note */}
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              {isId
                ? 'Seluruh properti di atas akan dikosongkan dan dibersihkan secara total saat Anda menekan tombol di bawah. Isi teks dan visual dokumen Anda dijamin tetap utuh 100%.'
                : 'All detected metadata properties above will be permanently wiped clean without altering your document pages, text, or images.'}
            </p>
          </div>
        )}
      </div>

      {/* Main Process Button */}
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '1rem',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontWeight: 700,
        }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}>
            <Settings2 size={18} />
          </div>
        ) : (
          <Eraser size={18} />
        )}
        <span>
          {isProcessing
            ? t("sanitizing_btn", isId ? "Membersihkan Metadata..." : "Sanitizing...")
            : t("apply_remove_metadata", isId ? "Hapus Bersih Semua Metadata Sekarang" : "Sanitize Metadata Now")}
        </span>
      </button>

      {/* Privacy guarantee badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: '0.74rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        <ShieldCheck size={14} style={{ color: '#10b981' }} />
        <span>
          {isId
            ? 'Diproses 100% di browser Anda (RAM lokal). Dokumen tidak diunggah ke server.'
            : 'Processed 100% locally in browser RAM. Never sent to any server.'}
        </span>
      </div>

      {/* Cross-link to Edit Metadata */}
      <div
        style={{
          paddingTop: 12,
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
        }}
      >
        <a
          href={isId ? '/id/edit-metadata-pdf' : '/edit-pdf-metadata'}
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>
            {isId
              ? 'Ingin mengubah nama penulis atau judul?'
              : 'Want to customize author or title instead?'}
          </span>
          <strong
            style={{
              color: 'var(--brand-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {isId ? 'Edit Metadata' : 'Edit Metadata'} <ArrowRight size={12} />
          </strong>
        </a>
      </div>
    </div>
  );
};

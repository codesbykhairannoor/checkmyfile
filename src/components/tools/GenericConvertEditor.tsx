import React, { useState, useEffect } from 'react';
import { Settings2, Download, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkOcrExcelQuota, type OcrExcelQuotaStatus } from '../../utils/ocrExcelQuota';
import { ProGateModal } from '../common/ProGateModal';

interface GenericConvertEditorProps {
  tUi?: Record<string, string>;
  toolId: string;
  onApply: (options?: any) => void;
  isProcessing: boolean;
  currentLang?: string;
}

export const GenericConvertEditor: React.FC<GenericConvertEditorProps> = ({
  tUi = {},
  toolId,
  onApply,
  isProcessing,
  currentLang = 'en',
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;
  const { user, profile, isPro, openAuthModal } = useAuth();
  const isOcr = toolId === 'ocr-pdf';
  const [ocrFormat, setOcrFormat] = useState<'txt' | 'xlsx'>('txt');
  const [showProGate, setShowProGate] = useState(false);
  const [quota, setQuota] = useState<OcrExcelQuotaStatus>(() => checkOcrExcelQuota(user, isPro, profile));

  useEffect(() => {
    const handleUpdate = () => setQuota(checkOcrExcelQuota(user, isPro, profile));
    window.addEventListener('ocr-excel-quota-updated', handleUpdate);
    setQuota(checkOcrExcelQuota(user, isPro, profile));
    return () => window.removeEventListener('ocr-excel-quota-updated', handleUpdate);
  }, [user, isPro, profile]);

  const handleSelectFormat = (format: 'txt' | 'xlsx') => {
    if (format === 'xlsx') {
      if (!user) {
        openAuthModal();
        return;
      }
      const currentQuota = checkOcrExcelQuota(user, isPro, profile);
      if (!currentQuota.allowed) {
        setShowProGate(true);
        return;
      }
    }
    setOcrFormat(format);
  };

  const handleStart = () => {
    if (isOcr) {
      if (ocrFormat === 'xlsx' && !isPro) {
        if (!user) {
          openAuthModal();
          return;
        }
        const currentQuota = checkOcrExcelQuota(user, isPro, profile);
        if (!currentQuota.allowed) {
          setShowProGate(true);
          return;
        }
      }
      onApply({ extractImageFormat: ocrFormat });
    } else {
      onApply();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 280, maxWidth: '100%', boxSizing: 'border-box' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings2 size={18} className="text-brand-primary" />
          <span>{isOcr ? t("ocr_convert_title", "OCR Document Extraction") : t("generic_convert", "Convert Document")}</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isOcr
            ? t("ocr_convert_desc", "Extract text and tabular data from scanned PDFs or images into structured document formats.")
            : t("generic_convert_desc", "Fast client-side document conversion with preserved fonts and layouts.")}
        </p>
      </div>

      {isOcr && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-input)', padding: 12, borderRadius: 10, border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t("ocr_output_format", "Select Output Format:")}
            </label>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.68rem',
              fontWeight: 700,
              color: isPro ? '#f59e0b' : '#3b82f6',
              background: isPro ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)',
              padding: '2px 8px',
              borderRadius: 12
            }}>
              <Crown size={12} />
              {isPro
                ? 'PRO Active'
                : user
                  ? `${currentLang === 'id' ? 'Trial' : 'Trial'}: ${quota.remaining}/${quota.max}`
                  : 'PRO Feature'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleSelectFormat('txt')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: ocrFormat === 'txt' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                background: ocrFormat === 'txt' ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-card)',
                color: ocrFormat === 'txt' ? 'var(--brand-primary)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              📄 {t("ocr_format_txt", "Plain Text (.txt)")}
            </button>
            <button
              type="button"
              onClick={() => handleSelectFormat('xlsx')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: ocrFormat === 'xlsx' ? '2px solid #10b981' : '1px solid var(--border-color)',
                background: ocrFormat === 'xlsx' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                color: ocrFormat === 'xlsx' ? '#10b981' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              📊 {t("ocr_format_xlsx", "Excel Spreadsheet (.xlsx)")}
            </button>
          </div>

          {ocrFormat === 'xlsx' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                ✨ {t("ocr_table_hint", "AI Table Detector maps scanned columns and rows directly into native Excel cells.")}
              </span>
              {!isPro && user && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentLang === 'id'
                    ? `Sisa uji coba gratis bulan ini: ${quota.remaining} dari ${quota.max}`
                    : `Free trial remaining this month: ${quota.remaining} of ${quota.max}`}
                </span>
              )}
            </div>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {currentLang === 'id' ? 'Ekstraksi teks standar gratis tanpa batas.' : 'Standard text extraction free with zero limits.'}
            </span>
          )}
        </div>
      )}

      <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-accent)' }}>
        {t("local_privacy_badge", "✨ 100% Client-Side Privacy: Your files never leave your device.")}
      </div>

      <button
        onClick={handleStart}
        disabled={isProcessing}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10
        }}
      >
        {isProcessing ? (
          <div style={{ animation: 'spin 1s linear infinite' }}><Settings2 size={18} /></div>
        ) : (
          <Download size={18} />
        )}
        <span>{isProcessing ? t("generic_converting_btn", "Converting...") : (isOcr ? t("start_ocr_btn", "Start OCR Extraction") : t("apply_generic_convert", "Start Conversion"))}</span>
      </button>

      {showProGate && (
        <ProGateModal
          isOpen={showProGate}
          onClose={() => setShowProGate(false)}
          currentLang={currentLang}
          featureName="AI OCR to Excel Table Extraction"
          title={currentLang === 'id' ? 'Buka Fitur OCR ke Excel (PRO)' : 'Unlock OCR to Excel (PRO)'}
          description={currentLang === 'id'
            ? 'Batas uji coba gratis 3x OCR ke Excel bulan ini telah tercapai. Upgrade ke PRO untuk ekstraksi tabel tak terbatas.'
            : 'Your monthly 3 free OCR to Excel trial limit has been reached. Upgrade to PRO for unlimited table extraction.'}
        />
      )}
    </div>
  );
};

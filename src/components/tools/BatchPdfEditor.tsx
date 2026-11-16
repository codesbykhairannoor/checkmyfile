import React, { useState, useRef } from 'react';
import {
  FolderArchive, Files, Play, Download, Trash2, CheckCircle2,
  AlertCircle, Loader2, Minimize2, Contrast, RotateCw, Lock, Stamp, Eraser,
  FolderOpen, Plus, Crown, Sparkles, X
} from 'lucide-react';
import {
  executeBatchProcessing,
  type BatchAction,
  type BatchOptions,
  type BatchFileResult,
  type BatchProcessResult,
} from '../../engines/pdf/batchEngine';
import { editorTranslations } from '../../i18n/editorTranslations';
import { authTranslations } from '../../i18n/authTranslations';
import { useAuth } from '../../context/AuthContext';
import { redirectToLemonSqueezy } from '../../utils/lemonSqueezy';
import { ProGateModal } from '../common/ProGateModal';

interface BatchPdfEditorProps {
  currentLang: string;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  formatSize: (bytes: number) => string;
}

export const BatchPdfEditor: React.FC<BatchPdfEditorProps> = ({
  currentLang,
  files,
  setFiles,
  formatSize,
}) => {
  const t = editorTranslations[currentLang] || editorTranslations['en'] || {};
  const tAuth = authTranslations[currentLang] || authTranslations['en'] || {};
  const { user, isPro, openAuthModal } = useAuth();
  const FREE_BATCH_LIMIT = 10;
  const [showProGateModal, setShowProGateModal] = useState<boolean>(false);

  const [action, setAction] = useState<BatchAction>('compress');
  const [compressQuality, setCompressQuality] = useState<'extreme' | 'balanced' | 'high'>('balanced');
  const [compressPercent, setCompressPercent] = useState<number>(65);
  const [rotateDegrees, setRotateDegrees] = useState<number>(90);
  const [password, setPassword] = useState<string>('');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentProgressText, setCurrentProgressText] = useState<string>('');
  const [itemsResult, setItemsResult] = useState<BatchFileResult[]>([]);
  const [finalResult, setFinalResult] = useState<BatchProcessResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
      setFiles(prev => [...prev, ...selected]);
      setFinalResult(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (itemsResult.length > 0) {
      setItemsResult(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setItemsResult([]);
    setFinalResult(null);
    setProgress(0);
  };

  const handleStartBatch = async (overrideFiles?: File[]) => {
    const targetFiles = overrideFiles || files;
    if (targetFiles.length === 0 || isProcessing) return;

    // Check Free vs PRO Gatekeeper
    if (!overrideFiles && !isPro && targetFiles.length > FREE_BATCH_LIMIT) {
      setShowProGateModal(true);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setFinalResult(null);
    setCurrentProgressText(t.batch_starting || 'Starting batch processing...');

    const initialItems: BatchFileResult[] = targetFiles.map(f => ({
      fileName: f.name,
      outputName: f.name,
      status: 'pending',
      originalSize: f.size,
    }));
    setItemsResult(initialItems);

    const batchOptions: BatchOptions = {
      action,
      compressQuality,
      compressPercent,
      rotateDegrees,
      password: password || '123456',
      watermarkText: watermarkText || 'CONFIDENTIAL',
    };

    try {
      const result = await executeBatchProcessing(
        targetFiles,
        batchOptions,
        (overallPercent, _idx, currentName) => {
          setProgress(overallPercent);
          setCurrentProgressText(currentName);
        },
        (index, updatedItem) => {
          setItemsResult(prev => {
            const next = [...prev];
            next[index] = updatedItem;
            return next;
          });
        }
      );

      setFinalResult(result);
    } catch (err: any) {
      console.error('Batch process failed:', err);
      alert(err?.message || 'Batch process encountered an error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueFreeFirst10 = () => {
    setShowProGateModal(false);
    const sliced = files.slice(0, FREE_BATCH_LIMIT);
    handleStartBatch(sliced);
  };

  const handleDownloadZip = () => {
    if (!finalResult) return;
    const url = URL.createObjectURL(finalResult.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalResult.zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadSingle = (item: BatchFileResult) => {
    if (!item.resultBlob) return;
    const url = URL.createObjectURL(item.resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, padding: '0 8px' }}>
      
      {/* Hidden file & folder inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleAddFiles}
      />
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: '', directory: '' } as any)}
        multiple
        style={{ display: 'none' }}
        onChange={handleAddFiles}
      />

      {/* Header & Controls Bar */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 20,
        padding: 24,
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--brand-primary)', color: '#fff', borderRadius: 100, fontSize: '0.8rem', fontWeight: 800 }}>
                PRO BATCH ENGINE
              </div>
              {isPro ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 100, fontSize: '0.78rem', fontWeight: 800 }}>
                  <Sparkles size={14} />
                  <span>{tAuth.batch_pro_badge || t.batch_pro_badge || 'PRO: Unlimited Batch Active'}</span>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: 100, fontSize: '0.78rem', fontWeight: 800 }}>
                  <span>{tAuth.batch_free_badge || t.batch_free_badge || 'Free: Max 10 Files / Batch'}</span>
                  <span>•</span>
                  <button
                    onClick={() => !user ? openAuthModal() : redirectToLemonSqueezy(user)}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 800, padding: 0, fontSize: '0.78rem' }}
                  >
                    {tAuth.batch_upgrade_btn || t.batch_upgrade_btn || 'Upgrade to PRO'}
                  </button>
                </div>
              )}
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {t.batch_title || 'Ultra-Batch PDF Processing'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '6px 0 0' }}>
              {t.batch_desc || 'Process dozens or hundreds of PDF files simultaneously in browser RAM. Zero server uploads.'}
            </p>
          </div>

          {/* Action buttons to add files or folders */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 12,
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} color="var(--brand-primary)" />
              {t.batch_add_files || 'Add PDF Files'}
            </button>

            <button
              onClick={() => folderInputRef.current?.click()}
              disabled={isProcessing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 12,
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <FolderOpen size={16} color="var(--brand-primary)" />
              {t.batch_add_folder || 'Add Entire Folder'}
            </button>

            {files.length > 0 && !isProcessing && (
              <button
                onClick={handleClearAll}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={15} />
                {t.batch_clear_all || 'Clear All'}
              </button>
            )}
          </div>
        </div>

        {/* Action Type Selection */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
            {t.batch_select_action || 'Select Batch Action to Apply:'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {[
              { id: 'compress', label: t.action_compress || 'Compress PDF', icon: Minimize2 },
              { id: 'grayscale', label: t.action_grayscale || 'Grayscale B&W', icon: Contrast },
              { id: 'rotate', label: t.action_rotate || 'Rotate Pages', icon: RotateCw },
              { id: 'protect', label: t.action_protect || 'Password Protect', icon: Lock },
              { id: 'watermark', label: t.action_watermark || 'Text Watermark', icon: Stamp },
              { id: 'remove-metadata', label: t.action_sanitize || 'Strip Metadata', icon: Eraser },
            ].map(act => {
              const Icon = act.icon;
              const isSelected = action === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => setAction(act.id as BatchAction)}
                  disabled={isProcessing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--bg-app)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={18} />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Specific Controls */}
        <div style={{ background: 'var(--bg-app)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)' }}>
          {action === 'compress' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {t.compress_level_label || 'Compression Preset:'}
              </span>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {(['extreme', 'balanced', 'high'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setCompressQuality(lvl)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: compressQuality === lvl ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                      background: compressQuality === lvl ? 'var(--bg-card)' : 'transparent',
                      color: compressQuality === lvl ? 'var(--brand-primary)' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {action === 'rotate' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {t.rotate_angle_label || 'Rotation Angle:'}
              </span>
              {[90, 180, 270].map(deg => (
                <button
                  key={deg}
                  onClick={() => setRotateDegrees(deg)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: rotateDegrees === deg ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    background: rotateDegrees === deg ? 'var(--bg-card)' : 'transparent',
                    color: rotateDegrees === deg ? 'var(--brand-primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  +{deg}°
                </button>
              ))}
            </div>
          )}

          {action === 'protect' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {t.password_label || 'Set AES-256 Encryption Password:'}
              </span>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password for all documents"
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          )}

          {action === 'watermark' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {t.watermark_text_label || 'Watermark Stamp Text:'}
              </span>
              <input
                type="text"
                value={watermarkText}
                onChange={e => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL / INTERNAL USE ONLY"
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          )}

          {action === 'grayscale' && (
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t.grayscale_batch_info || 'All color elements, charts, and images will be converted to monochromatic grayscale for ink-saving printing.'}
            </p>
          )}

          {action === 'remove-metadata' && (
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t.sanitize_batch_info || 'Author names, software tags, creation dates, and GPS coordinates will be stripped from all documents.'}
            </p>
          )}
        </div>
      </div>

      {/* Progress & Status Card (When Processing or Completed) */}
      {(isProcessing || finalResult) && (
        <div style={{
          background: finalResult ? '#f0fdf4' : 'var(--bg-card)',
          borderRadius: 16,
          padding: 24,
          border: finalResult ? '2px solid #22c55e' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isProcessing ? (
                <Loader2 size={24} className="animate-spin" color="var(--brand-primary)" />
              ) : (
                <CheckCircle2 size={28} color="#16a34a" />
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {isProcessing
                    ? (t.batch_processing_now || `Processing Batch (${progress}%)`)
                    : (t.batch_completed_title || `Batch Complete: ${finalResult?.successCount} Files Ready!`)}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isProcessing ? currentProgressText : `${formatSize(finalResult?.totalOriginalSize || 0)} → ${formatSize(finalResult?.totalProcessedSize || 0)}`}
                </p>
              </div>
            </div>

            {finalResult && (
              <button
                onClick={handleDownloadZip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  borderRadius: 14,
                  background: 'var(--brand-primary)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                }}
              >
                <Download size={20} />
                {t.download_all_zip || 'Download All as ZIP (.zip)'}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: 10, background: 'var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--brand-primary)', transition: 'width 0.2s ease' }}></div>
          </div>
        </div>
      )}

      {/* Files List / Queue */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Files size={18} color="var(--brand-primary)" />
            <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {t.batch_queue_label || 'Documents in Queue'} ({files.length})
            </span>
          </div>

          {files.length > 0 && !finalResult && !isProcessing && (
            <button
              onClick={() => handleStartBatch()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 12,
                background: 'var(--brand-primary)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              <Play size={16} fill="#fff" />
              {t.start_batch_btn || `Start Batch (${files.length} Files)`}
            </button>
          )}
        </div>

        {/* Free Plan Queue Warning Banner */}
        {!isPro && files.length > FREE_BATCH_LIMIT && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              fontSize: '0.86rem',
              color: '#ca8a04',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>
                {t.batch_limit_warning || `Free plan allows max 10 files. First 10 will be processed. Upgrade to PRO to process all ${files.length} files.`}
              </span>
            </div>
            <button
              onClick={() => !user ? openAuthModal() : redirectToLemonSqueezy(user)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: '#eab308',
                color: '#000000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Crown size={14} />
              {t.batch_upgrade_btn || 'Upgrade to PRO'}
            </button>
          </div>
        )}

        {files.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <FolderArchive size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
              {t.no_batch_files_title || 'No files selected yet'}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 20px' }}>
              {t.no_batch_files_desc || 'Drag and drop multiple PDF files or an entire folder to begin high-speed local processing.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--brand-primary)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                {t.selectFilesBtn || 'Select Files'}
              </button>
              <button
                onClick={() => folderInputRef.current?.click()}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--bg-app)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: 700, cursor: 'pointer' }}
              >
                {t.batch_add_folder || 'Select Folder'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: 450, overflowY: 'auto' }}>
            {files.map((file, idx) => {
              const res = itemsResult[idx];
              const status = res?.status || 'pending';

              return (
                <div
                  key={`${file.name}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 24px',
                    borderBottom: idx === files.length - 1 ? 'none' : '1px solid var(--border-color)',
                    background: status === 'processing' ? 'rgba(37,99,235,0.04)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1, paddingRight: 16 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 24 }}>
                      #{idx + 1}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {formatSize(file.size)}
                        {res?.processedSize && (
                          <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 700 }}>
                            → {formatSize(res.processedSize)} ({Math.round(((res.processedSize - file.size) / file.size) * 100)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {status === 'pending' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 8, background: 'var(--bg-app)' }}>
                        Pending
                      </span>
                    )}

                    {status === 'processing' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(37,99,235,0.1)' }}>
                        <Loader2 size={13} className="animate-spin" /> Processing
                      </span>
                    )}

                    {status === 'done' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#dcfce7' }}>
                          <CheckCircle2 size={13} /> Ready
                        </span>
                        {res && (
                          <button
                            onClick={() => handleDownloadSingle(res)}
                            title="Download single file"
                            style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 4 }}
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    )}

                    {status === 'error' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#dc2626', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#fee2e2' }} title={res?.error}>
                        <AlertCircle size={13} /> Failed
                      </span>
                    )}

                    {!isProcessing && !finalResult && (
                      <button
                        onClick={() => handleRemoveFile(idx)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                        title="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Free vs PRO Limit Gatekeeper Modal */}
      <ProGateModal
        isOpen={showProGateModal}
        onClose={() => setShowProGateModal(false)}
        currentLang={currentLang}
        filesCount={files.length}
        onContinueFree={handleContinueFreeFirst10}
        continueFreeLabel={tAuth.batch_continue_free_btn || t.batch_continue_free_btn}
      />

    </div>
  );
};

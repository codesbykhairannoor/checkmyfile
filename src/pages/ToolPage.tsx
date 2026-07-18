import React, { useState, useRef } from 'react';
import { getUiTranslations } from '../i18n/translations';
import { getLocalizedSeo, type ToolDefinition } from '../catalog/toolsCatalog';
import { SeoHead } from '../components/seo/SeoHead';
import { FileDropzone } from '../components/common/FileDropzone';
import { ProgressBar } from '../components/common/ProgressBar';
import { DocumentLivePreview } from '../components/common/DocumentLivePreview';
import { Play, ArrowLeft, HelpCircle, ShieldCheck } from 'lucide-react';
import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';

import { useDocumentProcessor } from '../hooks/useDocumentProcessor';
import { ToolSidebar } from '../components/tools/ToolSidebar';

interface ToolPageProps {
  tool: ToolDefinition;
  currentLang: string;
  onBackToHome: () => void;
  onEditorActive?: (active: boolean) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, currentLang, onBackToHome, onEditorActive }) => {
  const { files, setFiles } = useWorkspaceFiles(tool.id);
  const anotherFileInputRef = useRef<HTMLInputElement>(null);
  const {
    isProcessing, progress, statusText, isCompleted, downloadBlobUrl, downloadFilename, resultFile, errorMessage, ocrTextResult,
    startProcessing, resetProcessor
  } = useDocumentProcessor();

  const isWorkspaceMode = files.length > 0 && ['rotate-pdf', 'watermark-pdf', 'page-numbers', 'split-pdf', 'merge-pdf', 'compress-pdf'].includes(tool.id);

  React.useEffect(() => {
    if (onEditorActive) {
      onEditorActive(isWorkspaceMode);
    }
  }, [isWorkspaceMode, onEditorActive]);

  // Tool Specific Options States
  const [splitRange, setSplitRange] = useState<string>('');
  const [rotateDegrees, setRotateDegrees] = useState<number>(0);
  const [password, setPassword] = useState<string>('');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-center' | 'top-right'>('bottom-center');
  const [watermarkConfig, setWatermarkConfig] = useState({
    text: 'CONFIDENTIAL',
    opacity: 0.22,
    color: '#bf2626',
    scale: 1,
    rotation: 45
  });
  const [compressQuality, setCompressQuality] = useState<'extreme' | 'balanced' | 'high'>('balanced');
  const [extractImageFormat, setExtractImageFormat] = useState<'png' | 'jpg'>('png');


  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const t = getUiTranslations(currentLang);
  const seo = getLocalizedSeo(tool, currentLang);

  const handleStartProcessing = () => {
    startProcessing({
      files, toolId: tool.id, toolCategory: tool.category, currentLang,
      splitRange, rotateDegrees, password, pageNumberPos, watermarkConfig, compressQuality
    });
  };

  const handleDownload = () => {
    if (!downloadBlobUrl) return;
    const a = document.createElement('a');
    a.href = downloadBlobUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFiles([]);
    resetProcessor();
  };

  const isEditorMode = files.length > 0 && !isProcessing && !isCompleted;

  return (
    <main style={{ 
      maxWidth: 1440, 
      margin: '0 auto', 
      padding: isEditorMode ? '24px' : '32px 24px',
      flex: 1,
      minHeight: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <SeoHead tool={tool} lang={currentLang} />

      {/* Back button (Only show on selection screen) */}
      {files.length === 0 && (
        <button
          onClick={onBackToHome}
          className="btn-secondary"
          style={{ marginBottom: 32, padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>{t.backToHome}</span>
        </button>
      )}

      {/* Header - Hidden in Workspace Mode and Result Mode to maximize preview space */}
      {(files.length === 0 || isProcessing) && !isCompleted && (
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            {seo.h1}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 700, margin: '0 auto' }}>
            {seo.description}
          </p>
        </div>
      )}

      {/* Interactive Document Live Preview & Editor */}
      {files.length > 0 && !isProcessing && !isCompleted && (
        <>
          {['rotate-pdf', 'watermark-pdf', 'page-numbers', 'split-pdf', 'merge-pdf', 'compress-pdf'].includes(tool.id) ? (
            <div style={{ display: 'flex', width: '100%', height: '100%', flex: 1, gap: 24, minHeight: 0, justifyContent: 'center' }}>
              {/* Left Workspace */}
              <div style={{ flex: '1 1 680px', maxWidth: 680, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden', paddingRight: 8, paddingBottom: 24 }}>

                <DocumentLivePreview
                  files={files}
                  currentLang={currentLang}
                  externalRotate={tool.id === 'rotate-pdf' ? rotateDegrees : undefined}
                  watermarkConfig={tool.id === 'watermark-pdf' ? watermarkConfig : undefined}
                  pageNumberConfig={tool.id === 'page-numbers' ? { position: pageNumberPos } : undefined}
                  splitRange={tool.id === 'split-pdf' ? splitRange : undefined}
                  compressQuality={tool.id === 'compress-pdf' ? compressQuality : undefined}
                  activeFileIndex={activeFileIndex}
                />
              </div>

              <ToolSidebar
                tool={tool} files={files} setFiles={setFiles} activeFileIndex={activeFileIndex} setActiveFileIndex={setActiveFileIndex}
                isProcessing={isProcessing} handleStartProcessing={handleStartProcessing}
                splitRange={splitRange} setSplitRange={setSplitRange}
                rotateDegrees={rotateDegrees} setRotateDegrees={setRotateDegrees}
                pageNumberPos={pageNumberPos} setPageNumberPos={setPageNumberPos as any}
                watermarkConfig={watermarkConfig} setWatermarkConfig={setWatermarkConfig}
                compressQuality={compressQuality} setCompressQuality={setCompressQuality}
                formatSize={formatSize}
              />
            </div>
          ) : (
            <DocumentLivePreview files={files} currentLang={currentLang} />
          )}
        </>
      )}

      {files.length > 0 && !isProcessing && !isCompleted && !['rotate-pdf', 'watermark-pdf', 'page-numbers', 'split-pdf', 'merge-pdf', 'compress-pdf'].includes(tool.id) && (
        <div className="glass-panel" style={{ padding: 24, marginBottom: 24 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem', color: 'var(--text-accent)' }}>
            Processing Options:
          </h4>

          {tool.id === 'split-pdf' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                Page Range (e.g. `1-3, 5, 8` or leave empty to split every single page):
              </label>
              <input
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                {tool.id === 'protect-pdf' ? 'New Password for Encryption:' : 'Password (if known):'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {tool.id === 'page-numbers' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6, color: 'var(--text-muted)' }}>
                Page Number Position:
              </label>
              <select
                value={pageNumberPos}
                onChange={(e: any) => setPageNumberPos(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                }}
              >
                <option value="bottom-center">Bottom Center (Page X of Y)</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>
          )}

          {tool.id === 'compress-pdf' && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { id: 'balanced', label: 'Balanced (Best for Most PDFs)' },
                { id: 'extreme', label: 'Extreme (Maximum Size Reduction)' },
                { id: 'high', label: 'High Quality (Clean Structural Optimize)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCompressQuality(opt.id as any)}
                  className="btn-secondary"
                  style={{
                    background: compressQuality === opt.id ? 'var(--brand-gradient)' : undefined,
                    color: compressQuality === opt.id ? '#fff' : undefined,
                    border: compressQuality === opt.id ? 'none' : undefined,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {tool.id === 'pdf-to-image' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setExtractImageFormat('png')}
                className="btn-secondary"
                style={{
                  background: extractImageFormat === 'png' ? 'var(--brand-gradient)' : undefined,
                  color: extractImageFormat === 'png' ? '#fff' : undefined,
                  border: extractImageFormat === 'png' ? 'none' : undefined,
                }}
              >
                Extract as PNG Images (Lossless)
              </button>
              <button
                onClick={() => setExtractImageFormat('jpg')}
                className="btn-secondary"
                style={{
                  background: extractImageFormat === 'jpg' ? 'var(--brand-gradient)' : undefined,
                  color: extractImageFormat === 'jpg' ? '#fff' : undefined,
                  border: extractImageFormat === 'jpg' ? 'none' : undefined,
                }}
              >
                Extract as JPG Images (Smaller ZIP)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          <strong>Processing Error:</strong> {errorMessage}
        </div>
      )}

      {/* Dropzone (Hidden when files are already selected to keep UI clean and avoid clutter) */}
      {files.length === 0 && (
        <FileDropzone
          currentLang={currentLang}
          onFilesSelected={(selected) => {
            setFiles(selected);
            resetProcessor();
          }}
          multiple={tool.id === 'merge-pdf' || tool.id === 'image-to-pdf'}
        />
      )}

      {/* Action Buttons when files are selected */}
      {files.length > 0 && !isProcessing && !isCompleted && !['rotate-pdf', 'watermark-pdf', 'page-numbers', 'split-pdf', 'merge-pdf', 'compress-pdf'].includes(tool.id) && (
        <div style={{ textAlign: 'center', margin: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={handleStartProcessing} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
              <Play size={20} />
              <span>{t.processBtn} ({files.length} {files.length === 1 ? 'file' : 'files'})</span>
            </button>

            <button
              onClick={() => anotherFileInputRef.current?.click()}
              className="btn-secondary"
              style={{ padding: '15px 26px', fontSize: '1rem', border: '1.5px solid var(--border-color)' }}
            >
              📁 Pilih / Ganti Dokumen Lain (Change File)
            </button>
          </div>

          <input
            type="file"
            ref={anotherFileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFiles(Array.from(e.target.files));
                resetProcessor();
              }
            }}
            style={{ display: 'none' }}
            multiple={tool.id === 'merge-pdf' || tool.id === 'image-to-pdf'}
          />
        </div>
      )}

      {/* Progress & Result Bar (Moved to top so it's immediately visible) */}
      <ProgressBar
        currentLang={currentLang}
        isProcessing={isProcessing}
        progress={progress}
        statusText={statusText}
        isCompleted={isCompleted}
        onDownload={handleDownload}
        onReset={handleReset}
      />

      {/* Live Preview of the Converted / Processed Result */}
      {isCompleted && resultFile && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DocumentLivePreview files={[resultFile]} currentLang={currentLang} isResult={true} />
        </div>
      )}

      {/* OCR Result Display */}
      {ocrTextResult && (
        <div className="glass-panel" style={{ padding: 24, margin: '28px 0' }}>
          <h4 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-accent)' }}>Extracted OCR Text:</h4>
          <textarea
            readOnly
            value={ocrTextResult}
            style={{
              width: '100%',
              height: 240,
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
            }}
          />
        </div>
      )}

      {/* Localized FAQ Accordion (Programmatic SEO Schema integration) */}
      {(files.length === 0 || isProcessing) && !isCompleted && (
        <section style={{ marginTop: 64 }}>
          <div className="glass-panel" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <HelpCircle size={24} className="text-indigo-400" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {t.faqTitle}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {seo.faqs.map((faq: { q: string; a: string }, index: number) => (
                <div key={index} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, color: 'var(--text-main)' }}>
                    {faq.q}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>All conversions executed inside your browser using WebAssembly. Files never leave your computer.</span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

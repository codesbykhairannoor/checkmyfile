import React, { useState } from 'react';
import { getUiTranslations } from '../../i18n/translations';
import { UploadCloud, FileText, X } from 'lucide-react';

interface FileDropzoneProps {
  currentLang: string;
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  currentLang,
  onFilesSelected,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.csv',
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const t = getUiTranslations(currentLang);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const newFiles = multiple ? [...selectedFiles, ...filesArray] : [filesArray[0]];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newFiles = multiple ? [...selectedFiles, ...filesArray] : [filesArray[0]];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleRemoveFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div style={{ margin: '24px 0' }}>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`dropzone-container ${isDragging ? 'dropzone-active' : ''}`}
        style={{ 
          display: 'block', 
          cursor: 'pointer',
          padding: '48px 32px',
          textAlign: 'center'
        }}
      >
        <div className="dropzone-glow"></div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <UploadCloud 
            size={56} 
            className="animate-float-fast" 
            style={{ margin: '0 auto 20px', color: 'var(--brand-primary)' }} 
          />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            {t.dropzoneTitle}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: 28, fontWeight: 500 }}>
            {t.dropzoneSubtitle}
          </p>
          
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <div className="dropzone-glow" style={{ animation: 'pulse-glow 3s infinite', borderRadius: 9999, opacity: 1, zIndex: -1 }}></div>
            <span className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', pointerEvents: 'none', position: 'relative', zIndex: 2 }}>
              {t.selectFilesBtn}
            </span>
          </div>
        </div>
      </label>

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-accent)' }}>
            Selected Files ({selectedFiles.length}):
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="glass-panel"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                  <FileText size={20} className="text-indigo-400 shrink-0" />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Document'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveFile(i, e)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

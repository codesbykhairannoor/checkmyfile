import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { X, Plus } from 'lucide-react';

interface MergeWorkspaceProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const PdfThumbnail: React.FC<{ file: File; index: number; moveFile: (dragIndex: number, hoverIndex: number) => void; removeFile: (i: number) => void }> = ({ file, index, moveFile, removeFile }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const renderThumb = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });
        
        const canvas = canvasRef.current;
        if (canvas && active) {
          const context = canvas.getContext('2d');
          if (context) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            context.clearRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: context, viewport, canvas } as any).promise;
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error rendering thumbnail:', err);
        setLoading(false);
      }
    };
    renderThumb();
    return () => { active = false; };
  }, [file]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(dragIndex) && dragIndex !== index) {
      moveFile(dragIndex, index);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'grab',
        position: 'relative',
        background: 'var(--bg-card)',
        padding: 12,
        borderRadius: 12,
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
      }}
      onDragEnd={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <div style={{ position: 'relative', width: '100%', minWidth: 0, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading && <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Loading...</div>}
        <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%', display: loading ? 'none' : 'block', pointerEvents: 'none' }} />
        
        <button
          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
          style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Remove File"
        >
          <X size={14} />
        </button>

        <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.4)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem', pointerEvents: 'none' }}>
          {index + 1}
        </div>
      </div>
      <div style={{ fontSize: '0.75rem', width: '100%', minWidth: 0, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600, color: 'var(--text-main)' }}>
        {file.name}
      </div>
    </div>
  );
};

export const MergeWorkspace: React.FC<MergeWorkspaceProps> = ({ files, setFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...files];
    const draggedFile = newFiles[dragIndex];
    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedFile);
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12, alignItems: 'stretch' }}>
        {files.map((file, idx) => (
          <PdfThumbnail key={`${file.name}-${idx}`} file={file} index={idx} moveFile={moveFile} removeFile={removeFile} />
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            minWidth: 0,
            minHeight: 135,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: 'rgba(99, 102, 241, 0.05)',
            border: '2px dashed rgba(99, 102, 241, 0.3)',
            borderRadius: 12,
            cursor: 'pointer',
            color: '#6366f1',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Add More</span>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleAddFiles} accept=".pdf" multiple style={{ width: 0, height: 0, opacity: 0, overflow: 'hidden', position: 'absolute' }} />
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  MousePointer, Type, Eraser, Highlighter, Square, Circle,
  Minus, ArrowRight, PenTool, Image as ImageIcon, Undo2, Redo2,
  ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, Download,
  Layers, Copy, Trash2, AlignLeft, AlignCenter, AlignRight,
  ArrowUp, ArrowDown, FileText, Check, X, Sparkles, RefreshCw,
  FolderOpen, Move, Eye, Info, Palette
} from 'lucide-react';
import type { PdfEditElement } from '../../engines/pdf/editPdf';
import LazyPdfPage from '../preview/LazyPdfPage';
import { DraggableEditElement } from '../preview/PdfPreview';
import { editorTranslations } from '../../i18n/editorTranslations';
import { normalizeImageDataUrl } from '../../utils/imageOrientation';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type StudioToolType = 'select' | 'text' | 'whiteout' | 'highlight' | 'shape' | 'ink' | 'signature' | 'image';

interface PdfStudioWorkspaceProps {
  file: File;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  activeFileIndex: number;
  setActiveFileIndex: (index: number) => void;
  currentLang: string;
  editElements: PdfEditElement[];
  setEditElements: React.Dispatch<React.SetStateAction<PdfEditElement[]>>;
  selectedEditId: string | null;
  setSelectedEditId: (id: string | null) => void;
  isProcessing: boolean;
  onApply: () => void;
  onDownload?: () => void;
  downloadBlobUrl?: string | null;
  downloadFilename?: string;
  isCompleted?: boolean;
  onReset?: () => void;
}

export const PdfStudioWorkspace: React.FC<PdfStudioWorkspaceProps> = ({
  file,
  files,
  setFiles,
  activeFileIndex,
  setActiveFileIndex,
  currentLang,
  editElements,
  setEditElements,
  selectedEditId,
  setSelectedEditId,
  isProcessing,
  onApply,
  onDownload,
  downloadBlobUrl,
  downloadFilename,
  isCompleted,
  onReset
}) => {
  const tUi = editorTranslations[currentLang] || editorTranslations['en'] || {};
  const t = (key: string, fallback: string) => tUi[key] || fallback;

  // ── PDF Loading & Page State ──
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(210 / 297);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // ── Workspace Layout & Tool State ──
  const [activeTool, setActiveTool] = useState<StudioToolType>('select');
  const [selectedShapeType, setSelectedShapeType] = useState<'rectangle' | 'circle' | 'line' | 'arrow'>('rectangle');
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);
  const [isFilmstripOpen, setIsFilmstripOpen] = useState(true);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [paperPixelWidth, setPaperPixelWidth] = useState<number>(680);

  // ── History (Undo / Redo Stack) ──
  const [history, setHistory] = useState<PdfEditElement[][]>([editElements]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  // ── Quick Signature Modal State ──
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [sigPoints, setSigPoints] = useState<{ x: number; y: number }[]>([]);
  const [sigColor, setSigColor] = useState('#1e3a8a');

  // DOM Refs
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load PDF Document ──
  useEffect(() => {
    let isCancelled = false;
    let loadedPdf: any = null;

    const loadPdf = async () => {
      if (!file) return;
      setIsLoadingPdf(true);
      setPdfError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        if (isCancelled) return;

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        loadedPdf = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(loadedPdf);
        setTotalPages(loadedPdf.numPages);

        // Detect true page aspect ratio from Page 1
        const page1 = await loadedPdf.getPage(1);
        const vp = page1.getViewport({ scale: 1.0 });
        if (vp.width && vp.height) {
          setPageAspectRatio(vp.width / vp.height);
        }
        setIsLoadingPdf(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to parse PDF document:', err);
          setPdfError(err?.message || 'Failed to load PDF document.');
          setIsLoadingPdf(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
      if (loadedPdf) {
        try { loadedPdf.destroy(); } catch (_) {}
      }
    };
  }, [file]);

  // ── Responsive Paper Width Measurement ──
  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasViewportRef.current) return;
      const containerW = canvasViewportRef.current.clientWidth;
      const isMobile = window.innerWidth <= 768;
      const padding = isMobile ? 24 : 80;
      const availableW = Math.max(260, containerW - padding);
      // Base paper width clamped between 380px and 850px on desktop
      const baseWidth = Math.min(840, Math.max(340, availableW));
      setPaperPixelWidth(Math.round(baseWidth * zoomScale));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [zoomScale, isFilmstripOpen]);

  // ── History Management ──
  const commitToHistory = useCallback((newElements: PdfEditElement[]) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      const next = [...upToCurrent, newElements];
      if (next.length > 30) next.shift();
      return next;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const target = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setEditElements(target);
      if (selectedEditId && !target.some(el => el.id === selectedEditId)) {
        setSelectedEditId(null);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const target = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setEditElements(target);
    }
  };

  // ── Element Operations ──
  const addElement = (newEl: PdfEditElement) => {
    setEditElements(prev => {
      const next = [...prev, newEl];
      commitToHistory(next);
      return next;
    });
    setSelectedEditId(newEl.id);
    setActiveTool('select');
  };

  const selectedEl = editElements.find(el => el.id === selectedEditId);

  const updateSelected = (updates: Partial<PdfEditElement>) => {
    if (!selectedEditId) return;
    setEditElements(prev => {
      const next = prev.map(el => el.id === selectedEditId ? { ...el, ...updates } : el);
      commitToHistory(next);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedEditId) return;
    setEditElements(prev => {
      const next = prev.filter(el => el.id !== selectedEditId);
      commitToHistory(next);
      return next;
    });
    setSelectedEditId(null);
  };

  const handleDuplicateSelected = () => {
    if (!selectedEl) return;
    const duplicated: PdfEditElement = {
      ...selectedEl,
      id: `${selectedEl.type}-${Date.now()}`,
      x: Math.min(88, selectedEl.x + 3),
      y: Math.min(88, selectedEl.y + 3),
    };
    addElement(duplicated);
  };

  const handleBringToFront = () => {
    if (!selectedEl) return;
    setEditElements(prev => {
      const filtered = prev.filter(el => el.id !== selectedEl.id);
      const next = [...filtered, selectedEl];
      commitToHistory(next);
      return next;
    });
  };

  const handleSendToBack = () => {
    if (!selectedEl) return;
    setEditElements(prev => {
      const filtered = prev.filter(el => el.id !== selectedEl.id);
      const next = [selectedEl, ...filtered];
      commitToHistory(next);
      return next;
    });
  };

  const handleClearCurrentPage = () => {
    const pageEdits = editElements.filter(el => el.pageIndex === currentPageIndex);
    if (pageEdits.length === 0) return;
    if (window.confirm(t('confirm_clear_all', 'Remove all added text, whiteouts, and edits on this page?'))) {
      setEditElements(prev => {
        const next = prev.filter(el => el.pageIndex !== currentPageIndex);
        commitToHistory(next);
        return next;
      });
      setSelectedEditId(null);
    }
  };

  // ── Keyboard Shortcuts (Figma/Canva Standard) ──
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement)?.tagName?.toLowerCase() === 'input' ||
                      (e.target as HTMLElement)?.tagName?.toLowerCase() === 'textarea';

      // Global Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) handleRedo();
          else handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (!isInput && selectedEditId) {
          e.preventDefault();
          handleDuplicateSelected();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isInput && selectedEditId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      } else if (!isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Single Key Tool Shortcuts
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 't': setActiveTool('text'); break;
          case 'e': setActiveTool('whiteout'); break;
          case 'h': setActiveTool('highlight'); break;
          case 'r': setActiveTool('shape'); break;
          case 'p': setActiveTool('ink'); break;
          case 's': setIsSignModalOpen(true); break;
          case 'i': fileInputRef.current?.click(); break;
          case 'escape':
            setSelectedEditId(null);
            setActiveTool('select');
            setIsShapeMenuOpen(false);
            break;
        }

        // Arrow Key Precision Nudging
        if (selectedEl && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          const step = e.shiftKey ? 2 : 0.5;
          let newX = selectedEl.x;
          let newY = selectedEl.y;
          if (e.key === 'ArrowUp') newY = Math.max(0, newY - step);
          if (e.key === 'ArrowDown') newY = Math.min(100 - (selectedEl.height || 10), newY + step);
          if (e.key === 'ArrowLeft') newX = Math.max(0, newX - step);
          if (e.key === 'ArrowRight') newX = Math.min(100 - (selectedEl.width || 20), newX + step);
          updateSelected({ x: newX, y: newY });
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [historyIndex, history, selectedEditId, selectedEl]);

  // ── Canvas Click-to-Place (Canva/Figma Creation Workflow) ──
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'select') return;
    const target = e.target as HTMLElement;
    if (target.closest('.edit-action-handle') || target.closest('textarea') || target.closest('input')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(5, Math.min(85, ((e.clientX - rect.left) / rect.width) * 100));
    const clickY = Math.max(4, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));

    if (activeTool === 'text') {
      const newId = `text-${Date.now()}`;
      addElement({
        id: newId,
        type: 'text',
        pageIndex: currentPageIndex,
        x: clickX,
        y: clickY,
        width: 35,
        height: 6,
        text: t('double_click_to_edit', 'Double click to edit text'),
        fontSize: 16,
        color: '#0f172a',
        fontFamily: 'Helvetica',
        textAlign: 'left',
      });
    } else if (activeTool === 'whiteout') {
      const newId = `whiteout-${Date.now()}`;
      addElement({
        id: newId,
        type: 'whiteout',
        pageIndex: currentPageIndex,
        x: clickX,
        y: clickY,
        width: 30,
        height: 5,
        fillColor: '#ffffff',
        strokeWidth: 0,
        opacity: 1,
      });
    } else if (activeTool === 'highlight') {
      const newId = `highlight-${Date.now()}`;
      addElement({
        id: newId,
        type: 'highlight',
        pageIndex: currentPageIndex,
        x: clickX,
        y: clickY,
        width: 35,
        height: 4,
        fillColor: '#fde047',
        opacity: 0.45,
      });
    } else if (activeTool === 'shape') {
      const newId = `shape-${Date.now()}`;
      addElement({
        id: newId,
        type: 'shape',
        shapeType: selectedShapeType,
        pageIndex: currentPageIndex,
        x: clickX,
        y: clickY,
        width: selectedShapeType === 'line' || selectedShapeType === 'arrow' ? 28 : 22,
        height: selectedShapeType === 'line' || selectedShapeType === 'arrow' ? 10 : 18,
        strokeColor: '#ef4444',
        strokeWidth: 2,
        fillColor: selectedShapeType === 'rectangle' || selectedShapeType === 'circle' ? 'transparent' : undefined,
        opacity: 1,
      });
    }
  };

  // ── Image Upload Placement ──
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    let imageUrl = '';
    try {
      imageUrl = await normalizeImageDataUrl(imgFile);
    } catch {
      const reader = new FileReader();
      imageUrl = await new Promise((res) => {
        reader.onload = (ev) => res((ev.target?.result as string) || '');
        reader.readAsDataURL(imgFile);
      });
    }

    if (imageUrl) {
      const newId = `img-${Date.now()}`;
      addElement({
        id: newId,
        type: 'image',
        pageIndex: currentPageIndex,
        x: 30,
        y: 30,
        width: 25,
        height: 20,
        imageUrl,
        opacity: 1,
      });
    }
    e.target.value = '';
  };

  // ── Signature Drawing Handlers ──
  const startDrawingSig = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawingSig(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    setSigPoints([{ x: xPct, y: yPct }]);
  };

  const drawSigMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const xPct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setSigPoints(prev => [...prev, { x: xPct, y: yPct }]);
  };

  const stopDrawingSig = () => setIsDrawingSig(false);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (sigPoints.length > 1) {
      ctx.strokeStyle = sigColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo((sigPoints[0].x / 100) * canvas.width, (sigPoints[0].y / 100) * canvas.height);
      for (let i = 1; i < sigPoints.length; i++) {
        ctx.lineTo((sigPoints[i].x / 100) * canvas.width, (sigPoints[i].y / 100) * canvas.height);
      }
      ctx.stroke();
    }
  }, [sigPoints, sigColor]);

  const handleSaveSignature = () => {
    if (sigPoints.length < 2) {
      setIsSignModalOpen(false);
      return;
    }
    const newId = `sig-${Date.now()}`;
    addElement({
      id: newId,
      type: 'ink',
      pageIndex: currentPageIndex,
      x: 35,
      y: 40,
      width: 25,
      height: 12,
      strokeColor: sigColor,
      strokeWidth: 2.5,
      points: sigPoints,
      opacity: 1,
    });
    setIsSignModalOpen(false);
    setSigPoints([]);
  };

  // Stats
  const currentPageEdits = editElements.filter(el => el.pageIndex === currentPageIndex);
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="pdf-studio-workspace"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 1600,
        margin: '0 auto',
        height: 'calc(100vh - 100px)',
        minHeight: 650,
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        position: 'relative',
      }}
    >
      {/* Hidden file input for image stamps */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: 'none' }}
        onChange={handleImageFileChange}
      />

      {/* ══════════════════════════════════════════════════════════════
          1. TOP APPLICATION BAR (Canva / Figma Sleek Top Ribbon)
         ══════════════════════════════════════════════════════════════ */}
      <header
        style={{
          height: 60,
          backgroundColor: 'var(--bg-app)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          gap: 12,
          flexShrink: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Document Info & Filmstrip Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <button
            onClick={() => setIsFilmstripOpen(prev => !prev)}
            title={isFilmstripOpen ? t('hide_filmstrip', 'Hide Pages') : t('show_filmstrip', 'Show Pages')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              background: isFilmstripOpen ? 'var(--brand-primary)' : 'var(--bg-card)',
              color: isFilmstripOpen ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Layers size={15} />
            <span className="hide-on-mobile">{t('pages_tab', 'Pages')}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <FileText size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 180,
                }}
                title={file.name}
              >
                {file.name}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {formatSize(file.size)} • {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: The Canva/Figma Floating Tool Palette */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: '4px',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            gap: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          {/* Select / Move Tool (V) */}
          <button
            onClick={() => setActiveTool('select')}
            title={t('select_tool', 'Select / Move (V)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: activeTool === 'select' ? 'var(--brand-primary)' : 'transparent',
              color: activeTool === 'select' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <MousePointer size={15} />
            <span className="hide-on-tablet">{t('select_tool', 'Select')}</span>
          </button>

          {/* Text Tool (T) */}
          <button
            onClick={() => setActiveTool('text')}
            title={t('text', 'Text (T)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: activeTool === 'text' ? 'var(--brand-primary)' : 'transparent',
              color: activeTool === 'text' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <Type size={15} />
            <span className="hide-on-tablet">{t('text', 'Text')}</span>
          </button>

          {/* Whiteout / Mask Tool (E) */}
          <button
            onClick={() => setActiveTool('whiteout')}
            title={t('whiteout', 'Whiteout Mask (E)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: activeTool === 'whiteout' ? 'var(--brand-primary)' : 'transparent',
              color: activeTool === 'whiteout' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <Eraser size={15} />
            <span className="hide-on-tablet">{t('whiteout', 'Whiteout')}</span>
          </button>

          {/* Highlighter Tool (H) */}
          <button
            onClick={() => setActiveTool('highlight')}
            title={t('highlight', 'Highlighter (H)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: activeTool === 'highlight' ? 'var(--brand-primary)' : 'transparent',
              color: activeTool === 'highlight' ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <Highlighter size={15} />
            <span className="hide-on-tablet">{t('highlight', 'Highlight')}</span>
          </button>

          {/* Shapes Tool (R) with Quick Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setActiveTool('shape');
                setIsShapeMenuOpen(prev => !prev);
              }}
              title={t('shape', 'Vector Shapes (R)')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                background: activeTool === 'shape' ? 'var(--brand-primary)' : 'transparent',
                color: activeTool === 'shape' ? '#ffffff' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {selectedShapeType === 'circle' ? <Circle size={15} /> :
               selectedShapeType === 'arrow' ? <ArrowRight size={15} /> :
               selectedShapeType === 'line' ? <Minus size={15} /> : <Square size={15} />}
              <span className="hide-on-tablet">{t('shape', 'Shape')}</span>
            </button>

            {isShapeMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 6,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 100,
                  minWidth: 130,
                }}
              >
                {(['rectangle', 'circle', 'line', 'arrow'] as const).map(shape => (
                  <button
                    key={shape}
                    onClick={() => {
                      setSelectedShapeType(shape);
                      setActiveTool('shape');
                      setIsShapeMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: selectedShapeType === shape ? 'var(--bg-input)' : 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: selectedShapeType === shape ? 800 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {shape === 'circle' ? <Circle size={14} /> :
                     shape === 'arrow' ? <ArrowRight size={14} /> :
                     shape === 'line' ? <Minus size={14} /> : <Square size={14} />}
                    <span style={{ textTransform: 'capitalize' }}>{shape}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Signature / Ink Tool (S) */}
          <button
            onClick={() => setIsSignModalOpen(true)}
            title={t('signature', 'Draw Signature (S)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <PenTool size={15} style={{ color: '#8b5cf6' }} />
            <span className="hide-on-tablet">{t('signature', 'Sign')}</span>
          </button>

          {/* Image Upload Tool (I) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title={t('image', 'Insert Image / Stamp (I)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <ImageIcon size={15} style={{ color: '#10b981' }} />
            <span className="hide-on-tablet">{t('image', 'Image')}</span>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'var(--border-color)', margin: '0 4px' }} />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title={t('undo_shortcut', 'Undo (Ctrl+Z)')}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: historyIndex > 0 ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: historyIndex > 0 ? 'pointer' : 'not-allowed',
              opacity: historyIndex > 0 ? 1 : 0.4,
            }}
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title={t('redo_shortcut', 'Redo (Ctrl+Y)')}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: historyIndex < history.length - 1 ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: historyIndex < history.length - 1 ? 'pointer' : 'not-allowed',
              opacity: historyIndex < history.length - 1 ? 1 : 0.4,
            }}
          >
            <Redo2 size={15} />
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'var(--border-color)', margin: '0 4px' }} />

          {/* Zoom Controls */}
          <button
            onClick={() => setZoomScale(z => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
            title={t('zoom_out', 'Zoom Out')}
            style={{ padding: '6px 6px', borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <ZoomOut size={15} />
          </button>
          <span
            onClick={() => setZoomScale(1.0)}
            title={t('fit_width', 'Reset to 100%')}
            style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 42, textAlign: 'center', cursor: 'pointer' }}
          >
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => setZoomScale(z => Math.min(2.0, Number((z + 0.15).toFixed(2))))}
            title={t('zoom_in', 'Zoom In')}
            style={{ padding: '6px 6px', borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Right: Page Navigation & Primary Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Page Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--bg-card)',
              padding: '4px 8px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => setCurrentPageIndex(p => Math.max(0, p - 1))}
              disabled={currentPageIndex <= 0}
              style={{
                background: 'none',
                border: 'none',
                color: currentPageIndex > 0 ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: currentPageIndex > 0 ? 'pointer' : 'not-allowed',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', minWidth: 54, textAlign: 'center' }}>
              {currentPageIndex + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPageIndex(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPageIndex >= totalPages - 1}
              style={{
                background: 'none',
                border: 'none',
                color: currentPageIndex < totalPages - 1 ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: currentPageIndex < totalPages - 1 ? 'pointer' : 'not-allowed',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Primary Save & Export Button */}
          <button
            onClick={onApply}
            disabled={isProcessing}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: isProcessing ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.25)',
            }}
          >
            {isProcessing ? (
              <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Download size={16} />
            )}
            <span>{isProcessing ? t('processing_wait', 'Processing...') : t('apply_edits', 'Save & Export PDF')}</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. STUDIO BODY (Left Filmstrip + Center Canvas + Right Inspector)
         ══════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        
        {/* ── LEFT PANEL: Page Filmstrip / Thumbnails Rail ── */}
        {isFilmstripOpen && (
          <aside
            style={{
              width: 170,
              backgroundColor: 'var(--bg-app)',
              borderRight: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflowY: 'auto',
              padding: '12px 10px',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('pages_tab', 'Pages')} ({totalPages})
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {editElements.length} {t('total_edits', 'edits')}
              </span>
            </div>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentPageIndex;
              const editsOnThisPage = editElements.filter(el => el.pageIndex === idx).length;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentPageIndex(idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-card)',
                    border: isActive ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Miniature representation */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: `${pageAspectRatio}`,
                      backgroundColor: '#ffffff',
                      borderRadius: 4,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: isActive ? 'var(--brand-primary)' : '#94a3b8' }}>
                      {idx + 1}
                    </span>

                    {/* Annotation indicator dots */}
                    {editsOnThisPage > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          background: 'rgba(59, 130, 246, 0.9)',
                          color: '#fff',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: 8,
                        }}
                      >
                        {editsOnThisPage}
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                    {t('page_number_label', 'Page')} {idx + 1}
                  </span>
                </div>
              );
            })}
          </aside>
        )}

        {/* ── CENTER STAGE: The Canvas Viewport ── */}
        <main
          ref={canvasViewportRef}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '40px 24px',
            position: 'relative',
            cursor: activeTool === 'select' ? 'default' : 'crosshair',
          }}
        >
          {isLoadingPdf ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <div className="spinner" style={{ width: 36, height: 36, border: '3px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {t('processing_wait', 'Rendering PDF Canvas...')}
              </span>
            </div>
          ) : pdfError ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#ef4444' }}>
              <p style={{ fontWeight: 700 }}>{pdfError}</p>
            </div>
          ) : (
            <div
              id={`pdf-studio-page-${currentPageIndex + 1}`}
              onClick={handleCanvasClick}
              style={{
                position: 'relative',
                width: `${paperPixelWidth}px`,
                maxWidth: '100%',
                backgroundColor: '#ffffff',
                boxShadow: '0 14px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)',
                borderRadius: 4,
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              {/* Background PDF Page Rendered via Memory-Efficient LazyPdfPage */}
              <LazyPdfPage
                pdfDoc={pdfDoc}
                pageNum={currentPageIndex + 1}
                zoomScale={1.0}
                totalRotate={0}
                wrapperWidth={paperPixelWidth}
                paperShadow="none"
                defaultRatio={pageAspectRatio}
              />

              {/* Interactive Elements Overlay for Active Page */}
              {currentPageEdits.map(el => (
                <DraggableEditElement
                  key={el.id}
                  element={el}
                  isSelected={selectedEditId === el.id}
                  onClick={() => {
                    setSelectedEditId(el.id);
                    setActiveTool('select');
                  }}
                  onUpdate={(updates) => updateSelected(updates)}
                  onDelete={() => {
                    setEditElements(prev => prev.filter(e => e.id !== el.id));
                    commitToHistory(editElements.filter(e => e.id !== el.id));
                    setSelectedEditId(null);
                  }}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── RIGHT PANEL: Figma / Canva Properties Inspector ── */}
        <aside
          style={{
            width: 310,
            backgroundColor: 'var(--bg-card)',
            borderLeft: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflowY: 'auto',
            padding: 16,
            gap: 16,
          }}
        >
          {selectedEl ? (
            /* ── STATE A: Contextual Element Inspector ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Header with Element Type & Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={15} style={{ color: 'var(--brand-primary)' }} />
                  {selectedEl.type} {t('properties', 'Properties')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={handleBringToFront}
                    title={t('bring_forward', 'Bring Forward')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 4 }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={handleSendToBack}
                    title={t('send_backward', 'Send Backward')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 4 }}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={handleDuplicateSelected}
                    title={t('duplicate', 'Duplicate (Ctrl+D)')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 4 }}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    title={t('delete', 'Delete (Del)')}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* 1. TEXT PROPERTIES */}
              {selectedEl.type === 'text' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {t('text_content', 'Text Content')}
                    </label>
                    <textarea
                      value={selectedEl.text || ''}
                      onChange={e => updateSelected({ text: e.target.value })}
                      placeholder="Type text..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: 8,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        resize: 'vertical',
                        minHeight: 60,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Font Family */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {t('font', 'Font Family')}
                    </label>
                    <select
                      value={selectedEl.fontFamily || 'Helvetica'}
                      onChange={e => updateSelected({ fontFamily: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      <option value="Helvetica">Helvetica (Clean Sans)</option>
                      <option value="Helvetica-Bold">Helvetica Bold</option>
                      <option value="Times-Roman">Times New Roman (Serif)</option>
                      <option value="Times-Roman-Bold">Times Bold</option>
                      <option value="Courier">Courier (Monospace)</option>
                      <option value="Courier-Bold">Courier Bold</option>
                    </select>
                  </div>

                  {/* Alignment & Style */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {t('align', 'Alignment')}
                    </label>
                    <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                      <button
                        onClick={() => updateSelected({ textAlign: 'left' })}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: selectedEl.textAlign === 'left' || !selectedEl.textAlign ? 'var(--brand-primary)' : 'var(--bg-app)',
                          color: selectedEl.textAlign === 'left' || !selectedEl.textAlign ? '#ffffff' : 'var(--text-main)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AlignLeft size={14} />
                      </button>
                      <button
                        onClick={() => updateSelected({ textAlign: 'center' })}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: selectedEl.textAlign === 'center' ? 'var(--brand-primary)' : 'var(--bg-app)',
                          color: selectedEl.textAlign === 'center' ? '#ffffff' : 'var(--text-main)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AlignCenter size={14} />
                      </button>
                      <button
                        onClick={() => updateSelected({ textAlign: 'right' })}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: selectedEl.textAlign === 'right' ? 'var(--brand-primary)' : 'var(--bg-app)',
                          color: selectedEl.textAlign === 'right' ? '#ffffff' : 'var(--text-main)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AlignRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Size Slider & Direct Input */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{t('size', 'Font Size')}</span>
                      <span>{selectedEl.fontSize || 16} pt</span>
                    </div>
                    <input
                      type="range"
                      min="9"
                      max="72"
                      value={selectedEl.fontSize || 16}
                      onChange={e => updateSelected({ fontSize: parseInt(e.target.value) || 16 })}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Text Color Swatches */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {t('color', 'Color')}
                    </label>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {['#0f172a', '#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea'].map(hex => (
                        <div
                          key={hex}
                          onClick={() => updateSelected({ color: hex })}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: hex,
                            border: selectedEl.color === hex ? '2px solid var(--brand-primary)' : '1px solid rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        />
                      ))}
                      <input
                        type="color"
                        value={selectedEl.color || '#0f172a'}
                        onChange={e => updateSelected({ color: e.target.value })}
                        style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 2. WHITEOUT PROPERTIES */}
              {selectedEl.type === 'whiteout' && (
                <>
                  <div style={{ padding: 10, borderRadius: 8, background: 'var(--bg-app)', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    💡 {t('whiteout_tip', 'Opaque mask that completely covers underlying text, errors, or sensitive numbers.')}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {t('mask_color', 'Mask Tone')}
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[
                        { label: 'Pure White (Paper)', hex: '#ffffff' },
                        { label: 'Warm Cream / Ivory', hex: '#fdfbf7' },
                        { label: 'Document Gray', hex: '#f1f5f9' },
                        { label: 'Solid Black Mask', hex: '#0f172a' },
                      ].map(preset => (
                        <button
                          key={preset.hex}
                          onClick={() => updateSelected({ fillColor: preset.hex })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: selectedEl.fillColor === preset.hex ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                            background: preset.hex,
                            color: preset.hex === '#0f172a' ? '#ffffff' : '#0f172a',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <span>{preset.label}</span>
                          {selectedEl.fillColor === preset.hex && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 3. HIGHLIGHT PROPERTIES */}
              {selectedEl.type === 'highlight' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {t('highlight_color', 'Highlighter Tint')}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                      {['#fde047', '#86efac', '#f472b6', '#7dd3fc', '#fdba74'].map(hex => (
                        <div
                          key={hex}
                          onClick={() => updateSelected({ fillColor: hex })}
                          style={{
                            height: 28,
                            borderRadius: 6,
                            background: hex,
                            border: selectedEl.fillColor === hex ? '2px solid #000000' : '1px solid rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{t('opacity', 'Opacity')}</span>
                      <span>{Math.round((selectedEl.opacity !== undefined ? selectedEl.opacity : 0.45) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.15"
                      max="0.80"
                      step="0.05"
                      value={selectedEl.opacity !== undefined ? selectedEl.opacity : 0.45}
                      onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}

              {/* 4. SHAPE PROPERTIES */}
              {selectedEl.type === 'shape' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {t('shape_type', 'Shape Style')}
                    </label>
                    <select
                      value={selectedEl.shapeType || 'rectangle'}
                      onChange={e => updateSelected({ shapeType: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <option value="rectangle">{t('rectangle', 'Rectangle Box')}</option>
                      <option value="circle">{t('circle', 'Circle / Ellipse')}</option>
                      <option value="line">{t('line', 'Straight Line')}</option>
                      <option value="arrow">{t('arrow', 'Directional Arrow')}</option>
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{t('thickness', 'Stroke Width')}</span>
                      <span>{selectedEl.strokeWidth || 2} px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={selectedEl.strokeWidth || 2}
                      onChange={e => updateSelected({ strokeWidth: parseInt(e.target.value) || 2 })}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                        {t('stroke', 'Border Color')}
                      </label>
                      <input
                        type="color"
                        value={selectedEl.strokeColor || '#ef4444'}
                        onChange={e => updateSelected({ strokeColor: e.target.value })}
                        style={{ width: '100%', height: 32, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                      />
                    </div>
                    {(selectedEl.shapeType === 'rectangle' || selectedEl.shapeType === 'circle') && (
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                          {t('transparent_fill', 'Fill')}
                        </label>
                        <button
                          onClick={() => updateSelected({ fillColor: selectedEl.fillColor && selectedEl.fillColor !== 'transparent' ? 'transparent' : '#fee2e2' })}
                          style={{
                            width: '100%',
                            height: 32,
                            borderRadius: 6,
                            border: '1px solid var(--border-color)',
                            background: selectedEl.fillColor && selectedEl.fillColor !== 'transparent' ? selectedEl.fillColor : 'transparent',
                            color: 'var(--text-main)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {selectedEl.fillColor && selectedEl.fillColor !== 'transparent' ? 'Colored' : 'None'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 5. INK / SIGNATURE PROPERTIES */}
              {selectedEl.type === 'ink' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {t('ink_color', 'Ink Tone')}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { label: 'Navy', hex: '#1e3a8a' },
                        { label: 'Black', hex: '#0f172a' },
                        { label: 'Red', hex: '#b91c1c' },
                        { label: 'Green', hex: '#047857' },
                      ].map(c => (
                        <button
                          key={c.hex}
                          onClick={() => updateSelected({ strokeColor: c.hex })}
                          style={{
                            flex: 1,
                            padding: '6px 0',
                            borderRadius: 6,
                            backgroundColor: c.hex,
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            border: selectedEl.strokeColor === c.hex ? '2px solid var(--brand-primary)' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{t('stroke_thickness', 'Pen Thickness')}</span>
                      <span>{selectedEl.strokeWidth || 2.5} px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={selectedEl.strokeWidth || 2.5}
                      onChange={e => updateSelected({ strokeWidth: parseFloat(e.target.value) || 2.5 })}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}

              {/* 6. IMAGE PROPERTIES */}
              {selectedEl.type === 'image' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>{t('opacity', 'Opacity')}</span>
                    <span>{Math.round((selectedEl.opacity !== undefined ? selectedEl.opacity : 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={selectedEl.opacity !== undefined ? selectedEl.opacity : 1}
                    onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* ── STATE B: Canvas & Document Overview (When No Element Selected) ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={16} style={{ color: 'var(--brand-primary)' }} />
                  <span>{t('no_selection_title', 'Document & Canvas')}</span>
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {t('no_selection_desc', 'Select any added element on the page to customize, or pick a tool to start designing.')}
                </p>
              </div>

              {/* Current Page Stats Card */}
              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {t('page_number_label', 'Page')} {currentPageIndex + 1} {t('of_pages', 'of')} {totalPages}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                    {currentPageEdits.length} {t('elements_on_page', 'elements')}
                  </span>
                </div>
                {currentPageEdits.length > 0 && (
                  <button
                    onClick={handleClearCurrentPage}
                    style={{
                      padding: '6px',
                      borderRadius: 6,
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#ef4444',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t('clear_page_edits', 'Clear Page Edits')}
                  </button>
                )}
              </div>

              {/* Quick Add Elements Grid */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  {t('add_element', 'Add To Page')}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  <button
                    onClick={() => setActiveTool('text')}
                    className="btn-secondary"
                    style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, borderRadius: 8 }}
                  >
                    <Type size={16} style={{ color: 'var(--brand-primary)' }} />
                    <span>{t('text', 'Text Box')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTool('whiteout')}
                    className="btn-secondary"
                    style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, borderRadius: 8 }}
                  >
                    <Eraser size={16} style={{ color: '#0ea5e9' }} />
                    <span>{t('whiteout', 'Whiteout')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTool('highlight')}
                    className="btn-secondary"
                    style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, borderRadius: 8 }}
                  >
                    <Highlighter size={16} style={{ color: '#f59e0b' }} />
                    <span>{t('highlight', 'Highlighter')}</span>
                  </button>
                  <button
                    onClick={() => setIsSignModalOpen(true)}
                    className="btn-secondary"
                    style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, borderRadius: 8 }}
                  >
                    <PenTool size={16} style={{ color: '#8b5cf6' }} />
                    <span>{t('signature', 'Signature')}</span>
                  </button>
                </div>
              </div>

              {/* Keyboard Shortcuts Cheat Sheet */}
              <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ⌨️ {t('shortcuts_guide', 'Keyboard Shortcuts')}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>V</kbd> Select</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>T</kbd> Text</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>E</kbd> Whiteout</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>H</kbd> Highlight</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>Ctrl+Z</kbd> Undo</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>Ctrl+D</kbd> Duplicate</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>Del</kbd> Delete</div>
                  <div><kbd style={{ padding: '1px 5px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>Arrows</kbd> Nudge</div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. SIGNATURE & INK DRAWING MODAL
         ══════════════════════════════════════════════════════════════ */}
      {isSignModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 16,
              padding: 20,
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <PenTool size={16} style={{ color: 'var(--brand-primary)' }} />
                <span>{t('draw_signature', 'Draw Signature or Ink')}</span>
              </h5>
              <button
                onClick={() => setIsSignModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 10, background: '#ffffff', touchAction: 'none' }}>
              <canvas
                ref={signatureCanvasRef}
                width={400}
                height={160}
                onMouseDown={startDrawingSig}
                onMouseMove={drawSigMove}
                onMouseUp={stopDrawingSig}
                onTouchStart={startDrawingSig}
                onTouchMove={drawSigMove}
                onTouchEnd={stopDrawingSig}
                style={{ width: '100%', height: 160, display: 'block', cursor: 'crosshair' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {['#1e3a8a', '#0f172a', '#b91c1c', '#047857'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSigColor(color)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: color,
                      border: sigColor === color ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
                <button
                  onClick={() => setSigPoints([])}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', marginLeft: 6 }}
                >
                  {t('clear', 'Clear')}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setIsSignModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 8 }}
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleSaveSignature}
                  disabled={sigPoints.length < 2}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={14} />
                  <span>{t('insert_signature', 'Insert on Page')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

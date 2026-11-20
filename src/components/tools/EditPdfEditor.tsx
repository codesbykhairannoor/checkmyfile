import React, { useState, useEffect, useRef, useCallback } from 'react';
import { normalizeImageDataUrl } from '../../utils/imageOrientation';
import {
  PenTool, Type, Image as ImageIcon, Trash2, Download, RotateCw,
  Eraser, Highlighter, Square, Circle, ArrowRight, Minus, Copy,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Check, X,
  Layers
} from 'lucide-react';
import type { PdfEditElement, EditElementType } from '../../engines/pdf/editPdf';

interface EditPdfEditorProps {
  tUi?: Record<string, string>;
  elements: PdfEditElement[];
  setElements: React.Dispatch<React.SetStateAction<PdfEditElement[]>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  activePageIndex: number;
  onApply: () => void;
  isProcessing: boolean;
}

export const EditPdfEditor: React.FC<EditPdfEditorProps> = ({
  tUi = {},
  elements,
  setElements,
  selectedId,
  setSelectedId,
  activePageIndex,
  onApply,
  isProcessing
}) => {
  const t = (key: string, fallback: string) => tUi[key] || tUi[fallback] || fallback;

  // ── Undo / Redo History Stack ──
  const [history, setHistory] = useState<PdfEditElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  // Quick Signature Modal State
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [sigPoints, setSigPoints] = useState<{ x: number; y: number }[]>([]);
  const [sigColor, setSigColor] = useState('#1e3a8a');

  // Push state to history whenever elements change outside of undo/redo
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
      setElements(target);
      if (selectedId && !target.some(el => el.id === selectedId)) {
        setSelectedId(null);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const target = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setElements(target);
    }
  };

  // Keyboard shortcut for Undo / Redo & Delete
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement)?.tagName?.toLowerCase() === 'input' ||
                      (e.target as HTMLElement)?.tagName?.toLowerCase() === 'textarea';
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
        if (!isInput && selectedId) {
          e.preventDefault();
          handleDuplicateSelected();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [historyIndex, history, selectedId]);

  // ── Helper to push element and commit to history ──
  const addElement = (newEl: PdfEditElement) => {
    setElements(prev => {
      const next = [...prev, newEl];
      commitToHistory(next);
      return next;
    });
    setSelectedId(newEl.id);
  };

  // ── Element Creation Handlers ──
  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    addElement({
      id: newId,
      type: 'text',
      pageIndex: activePageIndex,
      x: 25,
      y: 20,
      width: 45,
      height: 8,
      text: t('double_click_to_edit', 'Double click to edit text'),
      fontSize: 18,
      color: '#0f172a',
      fontFamily: 'Helvetica',
      textAlign: 'left',
    });
  };

  const handleAddWhiteout = () => {
    const newId = `whiteout-${Date.now()}`;
    addElement({
      id: newId,
      type: 'whiteout',
      pageIndex: activePageIndex,
      x: 20,
      y: 20,
      width: 35,
      height: 6,
      fillColor: '#ffffff',
      strokeWidth: 0,
      opacity: 1,
    });
  };

  const handleAddHighlight = () => {
    const newId = `highlight-${Date.now()}`;
    addElement({
      id: newId,
      type: 'highlight',
      pageIndex: activePageIndex,
      x: 20,
      y: 20,
      width: 40,
      height: 5,
      fillColor: '#facc15',
      opacity: 0.4,
    });
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'line' | 'arrow') => {
    const newId = `shape-${Date.now()}`;
    addElement({
      id: newId,
      type: 'shape',
      shapeType,
      pageIndex: activePageIndex,
      x: 25,
      y: 25,
      width: shapeType === 'line' || shapeType === 'arrow' ? 30 : 25,
      height: shapeType === 'line' || shapeType === 'arrow' ? 12 : 20,
      strokeColor: '#ef4444',
      strokeWidth: 2,
      fillColor: shapeType === 'rectangle' || shapeType === 'circle' ? 'transparent' : undefined,
      opacity: 1,
    });
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/jpg, image/webp';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        let imageUrl = '';
        try {
          imageUrl = await normalizeImageDataUrl(file);
        } catch {
          const reader = new FileReader();
          imageUrl = await new Promise((res) => {
            reader.onload = (ev) => res((ev.target?.result as string) || '');
            reader.readAsDataURL(file);
          });
        }
        if (imageUrl) {
          const newId = `img-${Date.now()}`;
          addElement({
            id: newId,
            type: 'image',
            pageIndex: activePageIndex,
            x: 25,
            y: 25,
            width: 25,
            height: 20,
            imageUrl,
            opacity: 1,
          });
        }
      }
    };
    input.click();
  };

  const handleOpenSignatureModal = () => {
    setIsSignModalOpen(true);
    setSigPoints([]);
  };

  const handleSaveSignature = () => {
    if (sigPoints.length < 2) {
      setIsSignModalOpen(false);
      return;
    }
    const newId = `sig-${Date.now()}`;
    addElement({
      id: newId,
      type: 'ink',
      pageIndex: activePageIndex,
      x: 30,
      y: 35,
      width: 25,
      height: 12,
      strokeColor: sigColor,
      strokeWidth: 2.5,
      points: sigPoints,
      opacity: 1,
    });
    setIsSignModalOpen(false);
  };

  // ── Selected Element Operations ──
  const selectedEl = elements.find(el => el.id === selectedId);

  const updateSelected = (updates: Partial<PdfEditElement>) => {
    if (!selectedId) return;
    setElements(prev => {
      const next = prev.map(el => el.id === selectedId ? { ...el, ...updates } : el);
      commitToHistory(next);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setElements(prev => {
      const next = prev.filter(el => el.id !== selectedId);
      commitToHistory(next);
      return next;
    });
    setSelectedId(null);
  };

  const handleDuplicateSelected = () => {
    if (!selectedEl) return;
    const duplicated: PdfEditElement = {
      ...selectedEl,
      id: `${selectedEl.type}-${Date.now()}`,
      x: Math.min(90, selectedEl.x + 3),
      y: Math.min(90, selectedEl.y + 3),
    };
    addElement(duplicated);
  };

  const handleClearAll = () => {
    if (elements.length === 0) return;
    if (window.confirm(t('confirm_clear_all', 'Remove all added text, whiteouts, and edits on this PDF?'))) {
      setElements([]);
      commitToHistory([]);
      setSelectedId(null);
    }
  };

  // Signature canvas drawing listeners
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

  const stopDrawingSig = () => {
    setIsDrawingSig(false);
  };

  // Re-draw signature preview on canvas
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

  const activePageCount = elements.filter(el => el.pageIndex === activePageIndex).length;

  return (
    <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 290 }}>
      {/* ── Header & History Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <PenTool size={18} style={{ color: 'var(--brand-primary)' }} />
            <span>{t('edit_pdf', 'PDF Studio Editor')}</span>
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {activePageCount} {t('elements_on_page', 'elements on page')} {activePageIndex + 1}
          </span>
        </div>

        {/* Undo / Redo buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title={t('undo_shortcut', 'Undo (Ctrl+Z)')}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: historyIndex > 0 ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: historyIndex > 0 ? 'pointer' : 'not-allowed',
              opacity: historyIndex > 0 ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title={t('redo_shortcut', 'Redo (Ctrl+Y)')}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: historyIndex < history.length - 1 ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: historyIndex < history.length - 1 ? 'pointer' : 'not-allowed',
              opacity: historyIndex < history.length - 1 ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Studio Tools Grid (Add Items) ── */}
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>
          {t('add_element', 'Add To Document')}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {/* Text Tool */}
          <button
            onClick={handleAddText}
            className="btn-secondary"
            title="Add text box"
            style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, borderRadius: 8 }}
          >
            <Type size={16} style={{ color: 'var(--brand-primary)' }} />
            <span>{t('text', 'Text')}</span>
          </button>

          {/* Whiteout / Eraser Tool */}
          <button
            onClick={handleAddWhiteout}
            className="btn-secondary"
            title="Cover up text or errors (Whiteout)"
            style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, borderRadius: 8 }}
          >
            <Eraser size={16} style={{ color: '#0ea5e9' }} />
            <span>{t('whiteout', 'Whiteout')}</span>
          </button>

          {/* Highlighter Tool */}
          <button
            onClick={handleAddHighlight}
            className="btn-secondary"
            title="Highlight document area"
            style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, borderRadius: 8 }}
          >
            <Highlighter size={16} style={{ color: '#f59e0b' }} />
            <span>{t('highlight', 'Highlight')}</span>
          </button>

          {/* Signature / Pen Tool */}
          <button
            onClick={handleOpenSignatureModal}
            className="btn-secondary"
            title="Draw luxury signature or freehand ink"
            style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, borderRadius: 8 }}
          >
            <PenTool size={16} style={{ color: '#8b5cf6' }} />
            <span>{t('signature', 'Sign / Ink')}</span>
          </button>

          {/* Image / Stamp Tool */}
          <button
            onClick={handleAddImage}
            className="btn-secondary"
            title="Upload PNG or JPG image"
            style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, borderRadius: 8 }}
          >
            <ImageIcon size={16} style={{ color: '#10b981' }} />
            <span>{t('image', 'Image')}</span>
          </button>

          {/* Shapes Dropdown / Quick Add */}
          <button
            onClick={() => handleAddShape('rectangle')}
            className="btn-secondary"
            title="Add rectangle box"
            style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, borderRadius: 8 }}
          >
            <Square size={16} style={{ color: '#ef4444' }} />
            <span>{t('shape', 'Shape')}</span>
          </button>
        </div>

        {/* Quick Shape Sub-bar */}
        <div style={{ display: 'flex', gap: 6, marginTop: 6, justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleAddShape('circle')}
            title="Circle"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-main)' }}
          >
            <Circle size={11} /> <span>{t('circle', 'Circle')}</span>
          </button>
          <button
            onClick={() => handleAddShape('arrow')}
            title="Arrow"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-main)' }}
          >
            <ArrowRight size={11} /> <span>{t('arrow', 'Arrow')}</span>
          </button>
          <button
            onClick={() => handleAddShape('line')}
            title="Line"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-main)' }}
          >
            <Minus size={11} /> <span>{t('line', 'Line')}</span>
          </button>
        </div>
      </div>

      {/* ── Contextual Inspector (When Element Selected) ── */}
      {selectedEl ? (
        <div style={{ padding: 14, background: 'var(--bg-input)', borderRadius: 12, border: '1.5px solid var(--brand-primary)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Inspector Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} style={{ color: 'var(--brand-primary)' }} />
              {selectedEl.type} {t('properties', 'Properties')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleDuplicateSelected}
                title={t('duplicate', 'Duplicate (Ctrl+D)')}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: 2 }}
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleDeleteSelected}
                title={t('delete', 'Delete (Del)')}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* ── SPECIFIC INSPECTORS BY TYPE ── */}
          {selectedEl.type === 'text' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  {t('text_content', 'Text Content')}
                </label>
                <textarea
                  value={selectedEl.text || ''}
                  onChange={e => updateSelected({ text: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.82rem', resize: 'vertical', minHeight: 50, outline: 'none' }}
                />
              </div>

              {/* Font Family & Alignment */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {t('font', 'Font Family')}
                  </label>
                  <select
                    value={selectedEl.fontFamily || 'Helvetica'}
                    onChange={e => updateSelected({ fontFamily: e.target.value as any })}
                    style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.78rem' }}
                  >
                    <option value="Helvetica">Helvetica (Clean Sans)</option>
                    <option value="Helvetica-Bold">Helvetica Bold</option>
                    <option value="Times-Roman">Times New Roman (Serif)</option>
                    <option value="Times-Roman-Bold">Times Bold</option>
                    <option value="Courier">Courier (Monospace)</option>
                    <option value="Courier-Bold">Courier Bold</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {t('align', 'Align')}
                  </label>
                  <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
                    <button
                      onClick={() => updateSelected({ textAlign: 'left' })}
                      style={{ padding: '6px', background: selectedEl.textAlign === 'left' || !selectedEl.textAlign ? 'var(--brand-primary)' : 'var(--bg-app)', color: selectedEl.textAlign === 'left' || !selectedEl.textAlign ? '#fff' : 'var(--text-main)', border: 'none', cursor: 'pointer' }}
                    >
                      <AlignLeft size={13} />
                    </button>
                    <button
                      onClick={() => updateSelected({ textAlign: 'center' })}
                      style={{ padding: '6px', background: selectedEl.textAlign === 'center' ? 'var(--brand-primary)' : 'var(--bg-app)', color: selectedEl.textAlign === 'center' ? '#fff' : 'var(--text-main)', border: 'none', cursor: 'pointer' }}
                    >
                      <AlignCenter size={13} />
                    </button>
                    <button
                      onClick={() => updateSelected({ textAlign: 'right' })}
                      style={{ padding: '6px', background: selectedEl.textAlign === 'right' ? 'var(--brand-primary)' : 'var(--bg-app)', color: selectedEl.textAlign === 'right' ? '#fff' : 'var(--text-main)', border: 'none', cursor: 'pointer' }}
                    >
                      <AlignRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Font Size & Color */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>{t('size', 'Size')}</span>
                    <span>{selectedEl.fontSize || 18} pt</span>
                  </label>
                  <input
                    type="range"
                    min="9"
                    max="64"
                    value={selectedEl.fontSize || 18}
                    onChange={e => updateSelected({ fontSize: parseInt(e.target.value) || 18 })}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {t('color', 'Color')}
                  </label>
                  <input
                    type="color"
                    value={selectedEl.color || '#000000'}
                    onChange={e => updateSelected({ color: e.target.value })}
                    style={{ width: 36, height: 28, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'none' }}
                  />
                </div>
              </div>
            </>
          )}

          {selectedEl.type === 'whiteout' && (
            <>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {t('whiteout_tip', 'Opaque mask that completely covers underlying text, errors, or sensitive numbers in the PDF.')}
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {t('mask_color', 'Mask Tone')}
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {[
                    { label: 'Pure White', hex: '#ffffff' },
                    { label: 'Ivory / Cream', hex: '#fdfbf7' },
                    { label: 'Document Dark', hex: '#1e293b' },
                  ].map(preset => (
                    <button
                      key={preset.hex}
                      onClick={() => updateSelected({ fillColor: preset.hex })}
                      style={{
                        flex: 1,
                        padding: '5px 6px',
                        borderRadius: 6,
                        border: selectedEl.fillColor === preset.hex ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                        background: preset.hex,
                        color: preset.hex === '#1e293b' ? '#fff' : '#000',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={selectedEl.fillColor || '#ffffff'}
                    onChange={e => updateSelected({ fillColor: e.target.value })}
                    title="Custom match color"
                    style={{ width: 28, height: 26, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'none' }}
                  />
                </div>
              </div>
            </>
          )}

          {selectedEl.type === 'highlight' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {t('highlight_color', 'Highlighter Tint')}
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#facc15', '#4ade80', '#60a5fa', '#f472b6', '#fb923c'].map(hex => (
                    <div
                      key={hex}
                      onClick={() => updateSelected({ fillColor: hex })}
                      style={{
                        flex: 1,
                        height: 24,
                        borderRadius: 4,
                        background: hex,
                        border: selectedEl.fillColor === hex ? '2px solid #000' : '1px solid rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>{t('opacity', 'Opacity')}</span>
                  <span>{Math.round((selectedEl.opacity !== undefined ? selectedEl.opacity : 0.4) * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.8"
                  step="0.05"
                  value={selectedEl.opacity !== undefined ? selectedEl.opacity : 0.4}
                  onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </>
          )}

          {selectedEl.type === 'shape' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  {t('shape_type', 'Shape Style')}
                </label>
                <select
                  value={selectedEl.shapeType || 'rectangle'}
                  onChange={e => updateSelected({ shapeType: e.target.value as any })}
                  style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.78rem' }}
                >
                  <option value="rectangle">{t('rectangle', 'Rectangle Box')}</option>
                  <option value="circle">{t('circle', 'Circle / Ellipse')}</option>
                  <option value="line">{t('line', 'Straight Line')}</option>
                  <option value="arrow">{t('arrow', 'Directional Arrow')}</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>{t('thickness', 'Thickness')}</span>
                    <span>{selectedEl.strokeWidth || 2} px</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedEl.strokeWidth || 2}
                    onChange={e => updateSelected({ strokeWidth: parseInt(e.target.value) || 2 })}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {t('stroke', 'Border')}
                  </label>
                  <input
                    type="color"
                    value={selectedEl.strokeColor || '#ef4444'}
                    onChange={e => updateSelected({ strokeColor: e.target.value })}
                    style={{ width: 32, height: 26, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'none' }}
                  />
                </div>
              </div>
            </>
          )}

          {selectedEl.type === 'image' && (
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>{t('opacity', 'Opacity')}</span>
                <span>{Math.round((selectedEl.opacity !== undefined ? selectedEl.opacity : 1) * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={selectedEl.opacity !== undefined ? selectedEl.opacity : 1}
                onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          )}

          {selectedEl.type === 'ink' && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>{t('stroke_thickness', 'Pen Thickness')}</span>
                  <span>{selectedEl.strokeWidth || 2.5} px</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={selectedEl.strokeWidth || 2.5}
                  onChange={e => updateSelected({ strokeWidth: parseFloat(e.target.value) || 2.5 })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  {t('ink_color', 'Ink')}
                </label>
                <input
                  type="color"
                  value={selectedEl.strokeColor || '#1e3a8a'}
                  onChange={e => updateSelected({ strokeColor: e.target.value })}
                  style={{ width: 32, height: 26, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'none' }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Hint when no element is selected */
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--bg-app)', border: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          💡 {t('select_hint', 'Click any added element on the document canvas to resize, recolor, rotate, or delete it. Double click text to edit in-place.')}
        </div>
      )}

      {/* ── Document Edits Summary & Clear All ── */}
      {elements.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{elements.length} {t('total_edits', 'total edits')}</span>
          <button
            onClick={handleClearAll}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {t('clear_all', 'Clear All')}
          </button>
        </div>
      )}

      {/* ── Bottom Apply Button ── */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '12px 18px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><RotateCw size={16} /></div>
          ) : (
            <Download size={16} />
          )}
          <span>{isProcessing ? t('processing_wait', 'Processing PDF...') : t('apply_edits', 'Save & Export PDF')}</span>
        </button>
      </div>

      {/* ── Quick Signature Modal ── */}
      {isSignModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 20, maxWidth: 440, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <PenTool size={16} style={{ color: 'var(--brand-primary)' }} />
                <span>{t('draw_signature', 'Draw Signature or Ink')}</span>
              </h5>
              <button onClick={() => setIsSignModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
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
                      width: 22, height: 22, borderRadius: '50%', background: color,
                      border: sigColor === color ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.2)',
                      cursor: 'pointer'
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

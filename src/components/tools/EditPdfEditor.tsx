import React from 'react';
import { PenTool, Type, Image as ImageIcon, Trash2, Download, RotateCw } from 'lucide-react';
import type { PdfEditElement } from '../../engines/pdf/editPdf';

interface EditPdfEditorProps {
  elements: PdfEditElement[];
  setElements: React.Dispatch<React.SetStateAction<PdfEditElement[]>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  activePageIndex: number;
  onApply: () => void;
  isProcessing: boolean;
}

export const EditPdfEditor: React.FC<EditPdfEditorProps> = ({
  elements, setElements, selectedId, setSelectedId, activePageIndex, onApply, isProcessing
}) => {
  
  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    setElements(prev => [...prev, {
      id: newId,
      type: 'text',
      pageIndex: activePageIndex,
      x: 50,
      y: 50,
      text: 'Double click to edit',
      fontSize: 24,
      color: '#ef4444',
      fontFamily: 'bold'
    }]);
    setSelectedId(newId);
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/jpg';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const newId = `img-${Date.now()}`;
          setElements(prev => [...prev, {
            id: newId,
            type: 'image',
            pageIndex: activePageIndex,
            x: 50,
            y: 50,
            width: 30,
            height: 30,
            imageUrl: ev.target?.result as string
          }]);
          setSelectedId(newId);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const selectedEl = elements.find(el => el.id === selectedId);

  const updateSelected = (updates: Partial<PdfEditElement>) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, ...updates } : el));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements(prev => prev.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 280 }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenTool size={18} className="text-brand-primary" />
          <span>Edit PDF</span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Tambahkan teks dan gambar ke dalam dokumen Anda. Geser elemen di layar pratinjau.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleAddText} className="btn-secondary" style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
          <Type size={18} />
          <span>Teks</span>
        </button>
        <button onClick={handleAddImage} className="btn-secondary" style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
          <ImageIcon size={18} />
          <span>Gambar</span>
        </button>
      </div>

      {selectedEl && (
        <div style={{ padding: 16, background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Properti {selectedEl.type === 'text' ? 'Teks' : 'Gambar'}
            </span>
            <button onClick={deleteSelected} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700 }}>
              <Trash2 size={14} /> Hapus
            </button>
          </div>
          
          {selectedEl.type === 'text' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Konten Teks</label>
                <textarea 
                  value={selectedEl.text || ''} 
                  onChange={e => updateSelected({ text: e.target.value })} 
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '0.85rem', resize: 'vertical', minHeight: 60 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Warna</label>
                  <input 
                    type="color" 
                    value={selectedEl.color || '#000000'} 
                    onChange={e => updateSelected({ color: e.target.value })} 
                    style={{ width: '100%', height: 32, padding: 0, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Ukuran</label>
                  <input 
                    type="number" 
                    value={selectedEl.fontSize || 16} 
                    onChange={e => updateSelected({ fontSize: parseInt(e.target.value) || 16 })} 
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Gaya Font</label>
                <select 
                  value={selectedEl.fontFamily || 'normal'} 
                  onChange={e => updateSelected({ fontFamily: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '0.85rem' }}
                >
                  <option value="normal">Helvetica Normal</option>
                  <option value="bold">Helvetica Bold</option>
                </select>
              </div>
            </>
          )}

          {selectedEl.type === 'image' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Lebar (%)</label>
                <input 
                  type="number" 
                  value={selectedEl.width || 30} 
                  onChange={e => updateSelected({ width: parseInt(e.target.value) || 10 })} 
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Tinggi (%)</label>
                <input 
                  type="number" 
                  value={selectedEl.height || 30} 
                  onChange={e => updateSelected({ height: parseInt(e.target.value) || 10 })} 
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)' }}
        >
          {isProcessing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}><RotateCw size={18} /></div>
          ) : (
            <Download size={18} />
          )}
          <span>{isProcessing ? 'Memproses...' : 'Terapkan Editan'}</span>
        </button>
      </div>
    </div>
  );
};

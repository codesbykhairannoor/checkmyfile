import React, { useEffect, useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

interface SpreadsheetPreviewProps {
  file: File;
  zoomScale?: number;
}

export const SpreadsheetPreview: React.FC<SpreadsheetPreviewProps> = ({ file, zoomScale = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  useEffect(() => {
    let cancelled = false;
    const loadWorkbook = async () => {
      setLoading(true);
      setError(null);
      try {
        const buffer = await file.arrayBuffer();
        if (cancelled) return;
        const wb = XLSX.read(buffer, { type: 'array' });
        if (cancelled) return;
        setWorkbook(wb);
        setActiveSheetIndex(0);
        setCurrentPage(1);
      } catch (err: any) {
        if (!cancelled) setError('Gagal memuat dokumen spreadsheet. File mungkin rusak atau format tidak didukung.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadWorkbook();
    return () => { cancelled = true; };
  }, [file]);

  const activeSheetData = useMemo(() => {
    if (!workbook || workbook.SheetNames.length === 0) return [];
    const sheetName = workbook.SheetNames[activeSheetIndex];
    const ws = workbook.Sheets[sheetName];
    if (!ws) return [];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][];
    return rows;
  }, [workbook, activeSheetIndex]);

  // Determine max columns for the current sheet to draw the grid accurately
  const maxCols = useMemo(() => {
    if (!activeSheetData || activeSheetData.length === 0) return 10;
    let max = 0;
    for (const row of activeSheetData) {
      if (row.length > max) max = row.length;
    }
    return Math.max(max, 10); // at least 10 columns
  }, [activeSheetData]);

  // Generate column labels (A, B, C ... Z, AA, AB)
  const getColumnLabel = (index: number) => {
    let label = '';
    let curr = index;
    while (curr >= 0) {
      label = String.fromCharCode(65 + (curr % 26)) + label;
      curr = Math.floor(curr / 26) - 1;
    }
    return label;
  };

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', padding: 24, textAlign: 'center', color: '#ef4444' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (loading || !workbook) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Memuat spreadsheet&hellip;</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(activeSheetData.length / rowsPerPage));
  const pagedData = activeSheetData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      
      {/* Zoomable Container */}
      <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc', padding: 16, position: 'relative' }}>
        <div style={{
          transform: `scale(${zoomScale})`,
          transformOrigin: 'top left',
          display: 'inline-block',
          minWidth: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: '13px', fontFamily: 'Calibri, Arial, sans-serif' }}>
            <thead>
              <tr>
                <th style={{ width: 40, background: '#f1f5f9', border: '1px solid #cbd5e1', position: 'sticky', top: 0, left: 0, zIndex: 10 }}></th>
                {Array.from({ length: maxCols }).map((_, cIdx) => (
                  <th key={cIdx} style={{ width: 120, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 600, padding: '4px 8px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
                    {getColumnLabel(cIdx)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan={maxCols + 1} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>Sheet kosong</td>
                </tr>
              ) : (
                pagedData.map((row, rIdx) => {
                  const absoluteRowIndex = (currentPage - 1) * rowsPerPage + rIdx + 1;
                  return (
                    <tr key={rIdx}>
                      <td style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 600, padding: '4px 8px', textAlign: 'center', position: 'sticky', left: 0, zIndex: 5 }}>
                        {absoluteRowIndex}
                      </td>
                      {Array.from({ length: maxCols }).map((_, cIdx) => (
                        <td key={cIdx} style={{ border: '1px solid #e2e8f0', padding: '6px 10px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {row[cIdx] !== undefined && row[cIdx] !== null ? String(row[cIdx]) : ''}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination & Tabs Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderTop: '1px solid var(--border-color)', zIndex: 20 }}>
        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Menampilkan baris {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, activeSheetData.length)} dari {activeSheetData.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentPage} / {totalPages}</span>
            <button
              className="btn-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}
            >
              Selanjutnya <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Sheet Tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', padding: '8px 16px', gap: 8 }}>
          {workbook.SheetNames.map((sheetName, idx) => (
            <button
              key={sheetName}
              onClick={() => { setActiveSheetIndex(idx); setCurrentPage(1); }}
              style={{
                padding: '6px 16px',
                background: activeSheetIndex === idx ? 'var(--bg-card)' : 'transparent',
                border: activeSheetIndex === idx ? '1px solid var(--border-color)' : '1px solid transparent',
                borderBottom: activeSheetIndex === idx ? '2px solid var(--brand-primary)' : '1px solid transparent',
                borderRadius: '6px 6px 0 0',
                color: activeSheetIndex === idx ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontWeight: activeSheetIndex === idx ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <FileSpreadsheet size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              {sheetName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

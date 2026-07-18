import { PDFDocument } from 'pdf-lib';

export const splitPdf = async (
  file: File,
  pagesStr: string,
  onProgress: (progress: number) => void
): Promise<{ name: string; data: Uint8Array }[]> => {
  const arrayBuffer = await file.arrayBuffer();
  onProgress(20);
  let srcPdf: PDFDocument;
  try {
    srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Cannot open PDF: ${err?.message || 'Document is password locked or corrupted.'}`);
  }
  const totalPages = srcPdf.getPageCount();
  onProgress(40);

  const results: { name: string; data: Uint8Array }[] = [];

  // Parse pages string e.g. "1, 3-5, 7" or empty for all individual pages
  if (!pagesStr || pagesStr.trim() === '' || pagesStr.trim().toLowerCase() === 'all') {
    // Split every page into separate file
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
      newPdf.addPage(copiedPage);
      const data = await newPdf.save();
      results.push({ name: `${file.name.replace(/\.[^/.]+$/, '')}_page_${i + 1}.pdf`, data });
      onProgress(40 + Math.round(((i + 1) / totalPages) * 55));
    }
  } else {
    // Custom range or individual extraction
    const newPdf = await PDFDocument.create();
    const parts = pagesStr.split(',');
    const targetIndices: number[] = [];

    parts.forEach((part) => {
      const p = part.trim();
      if (p.includes('-')) {
        const [start, end] = p.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i >= 1 && i <= totalPages && !targetIndices.includes(i - 1)) {
              targetIndices.push(i - 1);
            }
          }
        }
      } else {
        const num = parseInt(p, 10);
        if (!isNaN(num) && num >= 1 && num <= totalPages && !targetIndices.includes(num - 1)) {
          targetIndices.push(num - 1);
        }
      }
    });

    if (targetIndices.length === 0) {
      throw new Error(`Invalid page range "${pagesStr}". Document has ${totalPages} pages (1-${totalPages}).`);
    }

    const copiedPages = await newPdf.copyPages(srcPdf, targetIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    onProgress(90);
    const data = await newPdf.save();
    results.push({ name: `${file.name.replace(/\.[^/.]+$/, '')}_extracted.pdf`, data });
  }

  onProgress(100);
  return results;
};


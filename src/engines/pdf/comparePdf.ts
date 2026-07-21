import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';


pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const comparePdf = async (
  file1: File,
  file2: File,
  onProgress?: (progress: number) => void
): Promise<{ bytes: Uint8Array, accuracy: number }> => {
  const [arrayBuffer1, arrayBuffer2] = await Promise.all([
    file1.arrayBuffer(),
    file2.arrayBuffer()
  ]);

  const [pdfDoc1, pdfDoc2] = await Promise.all([
    pdfjsLib.getDocument({ data: arrayBuffer1 }).promise,
    pdfjsLib.getDocument({ data: arrayBuffer2 }).promise
  ]);

  const newPdf = await PDFDocument.create();
  const maxPages = Math.max(pdfDoc1.numPages, pdfDoc2.numPages);
  const scale = 1.5; // lower scale for diffing to save memory
  
  let totalDiffPixels = 0;
  let totalPixels = 0;

  for (let i = 1; i <= maxPages; i++) {
    let page1, page2;
    try { page1 = await pdfDoc1.getPage(i); } catch (e) {}
    try { page2 = await pdfDoc2.getPage(i); } catch (e) {}

    // Determine target dimensions
    const viewport1 = page1 ? page1.getViewport({ scale }) : null;
    const viewport2 = page2 ? page2.getViewport({ scale }) : null;
    
    const width = Math.ceil(Math.max(viewport1?.width || 0, viewport2?.width || 0) || 800);
    const height = Math.ceil(Math.max(viewport1?.height || 0, viewport2?.height || 0) || 1200);

    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const diffCanvas = document.createElement('canvas');
    
    canvas1.width = width; canvas1.height = height;
    canvas2.width = width; canvas2.height = height;
    diffCanvas.width = width; diffCanvas.height = height;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const diffCtx = diffCanvas.getContext('2d');

    if (!ctx1 || !ctx2 || !diffCtx) throw new Error('Could not create canvas contexts');

    // Fill white backgrounds
    ctx1.fillStyle = '#ffffff'; ctx1.fillRect(0, 0, width, height);
    ctx2.fillStyle = '#ffffff'; ctx2.fillRect(0, 0, width, height);

    if (page1 && viewport1) {
      await page1.render({ canvasContext: ctx1, viewport: viewport1 } as any).promise;
    }
    if (page2 && viewport2) {
      await page2.render({ canvasContext: ctx2, viewport: viewport2 } as any).promise;
    }

    const img1 = ctx1.getImageData(0, 0, width, height);
    const img2 = ctx2.getImageData(0, 0, width, height);


    // Hybrid Semantic + Pixel Highlighter
    // 1. Draw Document 2 as the pristine base
    diffCtx.putImageData(img2, 0, 0);
    
    // --- SEMANTIC TEXT DIFF ENGINE ---
    const text1 = page1 ? await page1.getTextContent() : { items: [] };
    const text2 = page2 ? await page2.getTextContent() : { items: [] };
    
    const orig1: any[] = text1.items.filter((t: any) => 'str' in t && typeof t.str === 'string' && t.str.trim().length > 0);
    const orig2: any[] = text2.items.filter((t: any) => 'str' in t && typeof t.str === 'string' && t.str.trim().length > 0);
    
    // Group items into lines to prevent arbitrary word splitting by pdf.js
    const groupIntoLines = (items: any[]) => {
      const lines: { str: string, items: any[], y: number }[] = [];
      let currentLine = { str: '', items: [] as any[], y: -1000 };
      
      for (const item of items) {
        const y = item.transform[5];
        if (Math.abs(y - currentLine.y) > 4) {
          if (currentLine.items.length > 0) lines.push(currentLine);
          currentLine = { str: '', items: [], y };
        }
        currentLine.items.push(item);
        currentLine.str += item.str.trim();
      }
      if (currentLine.items.length > 0) lines.push(currentLine);
      
      return lines.map(l => ({
        ...l,
        normalized: l.str.replace(/\s+/g, '').toLowerCase()
      })).filter(l => l.normalized.length > 0);
    };

    const lines1 = groupIntoLines(orig1);
    const lines2 = groupIntoLines(orig2);
    
    // Longest Common Subsequence (LCS) for line matching
    const dp = Array(lines1.length + 1).fill(null).map(() => new Int32Array(lines2.length + 1));
    for (let i = 1; i <= lines1.length; i++) {
      for (let j = 1; j <= lines2.length; j++) {
        if (lines1[i-1].normalized === lines2[j-1].normalized) {
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
      }
    }
    
    const addedItems = new Set<any>();
    let i_lcs = lines1.length, j_lcs = lines2.length;
    while (i_lcs > 0 || j_lcs > 0) {
      if (i_lcs > 0 && j_lcs > 0 && lines1[i_lcs-1].normalized === lines2[j_lcs-1].normalized) {
        i_lcs--; j_lcs--;
      } else if (j_lcs > 0 && (i_lcs === 0 || dp[i_lcs][j_lcs-1] >= dp[i_lcs-1][j_lcs])) {
        lines2[j_lcs-1].items.forEach((item: any) => addedItems.add(item));
        j_lcs--;
      } else if (i_lcs > 0 && (j_lcs === 0 || dp[i_lcs][j_lcs-1] < dp[i_lcs-1][j_lcs])) {
        i_lcs--;
      }
    }
    
    let numDiffPixels = 0;

    // Draw semantic highlights for added/modified text
    const drawHighlight = (item: any, vp: any, color: string) => {
      const [a, b, c, d, e, f] = vp.transform;
      const px = item.transform[4];
      const py = item.transform[5];
      const cx = a * px + c * py + e;
      const cy = b * px + d * py + f;
      const cw = item.width * Math.abs(a);
      const ch = (item.transform[3] || item.height || 12) * Math.abs(d);
      
      diffCtx.fillStyle = color;
      diffCtx.fillRect(cx, cy - ch * 0.8, Math.max(cw, 5), ch * 1.2);
      numDiffPixels += Math.max(cw, 5) * (ch * 1.2);
    };
    
    addedItems.forEach(item => drawHighlight(item, viewport2, 'rgba(239, 68, 68, 0.25)'));

    // --- MASKED PIXEL DIFF ENGINE (For Graphics/Images only) ---
    const cellSize = 8;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    const grid = new Uint8Array(cols * rows);
    
    // Mask out text regions so shifted text doesn't trigger pixel diff
    const mask = new Uint8Array(width * height);
    const maskText = (item: any, vp: any) => {
      const [a, b, c, d, e, f] = vp.transform;
      const cx = a * item.transform[4] + c * item.transform[5] + e;
      const cy = b * item.transform[4] + d * item.transform[5] + f;
      const cw = item.width * Math.abs(a);
      const ch = (item.transform[3] || item.height || 12) * Math.abs(d);
      
      const xStart = Math.max(0, Math.floor(cx - 5));
      const yStart = Math.max(0, Math.floor(cy - ch * 1.0));
      const xEnd = Math.min(width, Math.ceil(cx + cw + 5));
      const yEnd = Math.min(height, Math.ceil(cy + ch * 0.4));
      
      for(let y = yStart; y < yEnd; y++) {
         for(let x = xStart; x < xEnd; x++) {
            mask[y * width + x] = 1;
         }
      }
    };
    
    orig1.forEach(item => maskText(item, viewport1));
    orig2.forEach(item => maskText(item, viewport2));

    const img1Data = img1.data;
    const img2Data = img2.data;

    // Detect differences in non-text areas
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (mask[y * width + x] === 1) continue; // Ignore text areas
        
        const i = (y * width + x) * 4;
        const v1 = (img1Data[i] * 0.299 + img1Data[i+1] * 0.587 + img1Data[i+2] * 0.114);
        const v2 = (img2Data[i] * 0.299 + img2Data[i+1] * 0.587 + img2Data[i+2] * 0.114);
        
        if (Math.abs(v1 - v2) > 40) {
           numDiffPixels++;
           grid[Math.floor(y / cellSize) * cols + Math.floor(x / cellSize)]++;
        }
      }
    }
    
    // Dilate non-text grid
    const dilatedGrid = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r * cols + c] > 2) {
           for (let dr = -1; dr <= 1; dr++) {
             for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                   dilatedGrid[nr * cols + nc] = 1;
                }
             }
           }
        }
      }
    }
    
    // Draw non-text graphics highlights
    diffCtx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (dilatedGrid[r * cols + c] === 1) {
           diffCtx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
    
    totalDiffPixels += numDiffPixels;
    totalPixels += width * height;

    const jpegDataUrl = diffCanvas.toDataURL('image/jpeg', 0.85);
    const image = await newPdf.embedJpg(jpegDataUrl);

    const newPage = newPdf.addPage([width / scale, height / scale]);
    newPage.drawImage(image, { x: 0, y: 0, width: width / scale, height: height / scale });

    if (onProgress) {
      onProgress((i / maxPages) * 100);
    }
  }

  const accuracy = totalPixels > 0 ? Math.max(0, 100 - (totalDiffPixels / totalPixels) * 100) : 100;
  return { bytes: await newPdf.save(), accuracy };
};

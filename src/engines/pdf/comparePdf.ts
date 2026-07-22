import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';


pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const comparePdf = async (
  file1: File,
  file2: File,
  onProgress?: (progress: number) => void
): Promise<{ bytes: Uint8Array, originalBytes?: Uint8Array, accuracy: number }> => {
  const [arrayBuffer1, arrayBuffer2] = await Promise.all([
    file1.arrayBuffer(),
    file2.arrayBuffer()
  ]);

  const [pdfDoc1, pdfDoc2] = await Promise.all([
    pdfjsLib.getDocument({ data: arrayBuffer1 }).promise,
    pdfjsLib.getDocument({ data: arrayBuffer2 }).promise
  ]);

  const newPdf1 = await PDFDocument.create();
  const newPdf2 = await PDFDocument.create();
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
    const diffCanvas1 = document.createElement('canvas');
    const diffCanvas2 = document.createElement('canvas');
    
    canvas1.width = width; canvas1.height = height;
    canvas2.width = width; canvas2.height = height;
    diffCanvas1.width = width; diffCanvas1.height = height;
    diffCanvas2.width = width; diffCanvas2.height = height;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const diffCtx1 = diffCanvas1.getContext('2d');
    const diffCtx2 = diffCanvas2.getContext('2d');

    if (!ctx1 || !ctx2 || !diffCtx1 || !diffCtx2) throw new Error('Could not create canvas contexts');

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

    // Draw base images onto diff canvases
    diffCtx1.putImageData(img1, 0, 0);
    diffCtx2.putImageData(img2, 0, 0);
    // --- SEMANTIC TEXT DIFF ENGINE ---
    const text1 = page1 ? await page1.getTextContent() : { items: [] };
    const text2 = page2 ? await page2.getTextContent() : { items: [] };
    
    const orig1: any[] = text1.items.filter((t: any) => 'str' in t && typeof t.str === 'string' && t.str.trim().length > 0);
    const orig2: any[] = text2.items.filter((t: any) => 'str' in t && typeof t.str === 'string' && t.str.trim().length > 0);
    
    // Sort text items geometrically (Top-to-Bottom, Left-to-Right) 
    // to fix content stream order differences between PDF generators (e.g. Canva vs MS Word)
    const sortGeometrically = (items: any[]) => {
      // PDF.js coordinate space: y=0 is at the bottom of the page
      const sortedByY = [...items].sort((a, b) => b.transform[5] - a.transform[5]);
      
      const lines: any[][] = [];
      let currentLine: any[] = [];
      let lineY = -10000;
      
      for (const item of sortedByY) {
        const y = item.transform[5];
        const ch = Math.abs(item.transform[3]) || item.height || 10;
        
        if (currentLine.length === 0 || Math.abs(lineY - y) < ch * 0.5) {
          currentLine.push(item);
          if (currentLine.length === 1) lineY = y;
        } else {
          lines.push(currentLine);
          currentLine = [item];
          lineY = y;
        }
      }
      if (currentLine.length > 0) lines.push(currentLine);
      
      // Sort each line left-to-right
      for (const line of lines) {
        line.sort((a, b) => a.transform[4] - b.transform[4]);
      }
      
      return lines.flat();
    };

    const sorted1 = sortGeometrically(orig1);
    const sorted2 = sortGeometrically(orig2);
    
    // Group items into words and calculate precise bounding boxes for each word.
    // This totally decouples highlighting from PDF.js's arbitrary TextItem chunks!
    const extractWords = (items: any[], vp: any) => {
      const [va, vb, vc, vd, ve, vf] = vp.transform;
      const words: { word: string, box: any }[] = [];
      let currentWord = "";
      let charBoxes: any[] = [];
      
      let lastX = -1000, lastY = -1000, lastW = 0, lastH = 12;
      
      for (const item of items) {
        const px = item.transform ? item.transform[4] : 0;
        const py = item.transform ? item.transform[5] : 0;
        
        const cx = va * px + vc * py + ve;
        const cy = vb * px + vd * py + vf;
        const ch = (item.transform && item.transform[3] ? Math.abs(item.transform[3]) : item.height || 12) * Math.abs(vd) || lastH;
        
        let cw = (item.width || 0) * Math.abs(va);
        const str = item.str || '';
        
        if (cw < str.length * 2) {
           cw = str.length * ch * 0.5; // fallback width
        }
        const avgCharWidth = str.length > 0 ? (cw / str.length) : 0;
        
        // If there's a physical space (different line or large gap), inject a word boundary
        if (currentWord.length > 0) {
          const isDifferentLine = Math.abs(cy - lastY) > ch * 0.5;
          const isLargeGap = (cx - (lastX + lastW)) > ch * 0.25;
          
          if (isDifferentLine || isLargeGap) {
             const clean = currentWord.replace(/[^a-z0-9]/gi, '').toLowerCase();
             if (clean.length > 0 && charBoxes.length > 0) {
                const wCx = charBoxes[0].cx;
                const wCy = charBoxes[0].cy;
                const wCw = (charBoxes[charBoxes.length - 1].cx + charBoxes[charBoxes.length - 1].cw) - wCx;
                const wCh = Math.max(...charBoxes.map(b => b.ch));
                words.push({ word: clean, box: { cx: wCx, cy: wCy, cw: wCw, ch: wCh } });
             }
             currentWord = "";
             charBoxes = [];
          }
        }
        
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          const charCx = cx + (i * avgCharWidth);
          
          if (char.trim() === '') {
            const clean = currentWord.replace(/[^a-z0-9]/gi, '').toLowerCase();
            if (clean.length > 0 && charBoxes.length > 0) {
               const wCx = charBoxes[0].cx;
               const wCy = charBoxes[0].cy;
               const wCw = (charBoxes[charBoxes.length - 1].cx + charBoxes[charBoxes.length - 1].cw) - wCx;
               const wCh = Math.max(...charBoxes.map(b => b.ch));
               words.push({ word: clean, box: { cx: wCx, cy: wCy, cw: wCw, ch: wCh } });
            }
            currentWord = "";
            charBoxes = [];
          } else {
            currentWord += char;
            charBoxes.push({ cx: charCx, cy: cy, cw: avgCharWidth, ch: ch });
          }
        }
        
        lastX = cx;
        lastY = cy;
        lastW = cw;
        lastH = ch;
      }
      
      const clean = currentWord.replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (clean.length > 0 && charBoxes.length > 0) {
         const wCx = charBoxes[0].cx;
         const wCy = charBoxes[0].cy;
         const wCw = (charBoxes[charBoxes.length - 1].cx + charBoxes[charBoxes.length - 1].cw) - wCx;
         const wCh = Math.max(...charBoxes.map(b => b.ch));
         words.push({ word: clean, box: { cx: wCx, cy: wCy, cw: wCw, ch: wCh } });
      }
      return words;
    };

    const words1 = extractWords(sorted1, viewport1);
    const words2 = extractWords(sorted2, viewport2);
    
    let m = words1.length;
    let n = words2.length;
    
    // Longest Common Subsequence (LCS) for word matching (Memory efficient Int32 flat array)
    let dp: Int32Array;
    try {
      dp = new Int32Array((m + 1) * (n + 1));
    } catch (e) {
      dp = new Int32Array(1); // Failsafe
      m = 0; n = 0;
    }
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (words1[i-1].word === words2[j-1].word) {
          dp[i * (n + 1) + j] = dp[(i-1) * (n + 1) + (j-1)] + 1;
        } else {
          dp[i * (n + 1) + j] = Math.max(dp[(i-1) * (n + 1) + j], dp[i * (n + 1) + (j-1)]);
        }
      }
    }
    
    const addedBoxes: any[] = [];
    const removedBoxes: any[] = [];
    let i_lcs = m, j_lcs = n;
    while (i_lcs > 0 || j_lcs > 0) {
      if (i_lcs > 0 && j_lcs > 0 && words1[i_lcs-1].word === words2[j_lcs-1].word) {
        i_lcs--; j_lcs--;
      } else if (j_lcs > 0 && (i_lcs === 0 || dp[i_lcs * (n + 1) + (j_lcs-1)] >= dp[(i_lcs-1) * (n + 1) + j_lcs])) {
        addedBoxes.push(words2[j_lcs-1].box);
        j_lcs--;
      } else if (i_lcs > 0 && (j_lcs === 0 || dp[i_lcs * (n + 1) + (j_lcs-1)] < dp[(i_lcs-1) * (n + 1) + j_lcs])) {
        removedBoxes.push(words1[i_lcs-1].box);
        i_lcs--;
      }
    }
    
    let numDiffPixels = 0;
    let addedArea = 0;
    let removedArea = 0;

    // Draw semantic highlights for added/modified text using precise word boxes
    const drawHighlight = (ctx: any, box: any, color: string, isAdded: boolean) => {
      ctx.fillStyle = color;
      const area = Math.max(box.cw, 5) * (box.ch * 1.2);
      ctx.fillRect(box.cx, box.cy - box.ch * 0.8, Math.max(box.cw, 5), box.ch * 1.2);
      if (isAdded) addedArea += area; else removedArea += area;
    };
    
    removedBoxes.forEach(box => drawHighlight(diffCtx1, box, 'rgba(239, 68, 68, 0.25)', false));
    addedBoxes.forEach(box => drawHighlight(diffCtx2, box, 'rgba(239, 68, 68, 0.25)', true));
    
    numDiffPixels += Math.max(addedArea, removedArea);

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
      
      const ch = (item.transform[3] || item.height || 12) * Math.abs(d);
      let cw = (item.width || 0) * Math.abs(a);
      
      // Failsafe: if PDF.js returns 0 or tiny width, estimate from character count
      if (cw < item.str.length * 2) {
         cw = item.str.length * ch * 0.5;
      }
      
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
    diffCtx1.fillStyle = 'rgba(239, 68, 68, 0.25)';
    diffCtx2.fillStyle = 'rgba(239, 68, 68, 0.25)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (dilatedGrid[r * cols + c] === 1) {
           diffCtx1.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
           diffCtx2.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
    
    totalDiffPixels += numDiffPixels;
    totalPixels += width * height;

    const jpegDataUrl1 = diffCanvas1.toDataURL('image/jpeg', 0.85);
    const jpegDataUrl2 = diffCanvas2.toDataURL('image/jpeg', 0.85);
    const image1 = await newPdf1.embedJpg(jpegDataUrl1);
    const image2 = await newPdf2.embedJpg(jpegDataUrl2);

    const newPage1 = newPdf1.addPage([width / scale, height / scale]);
    newPage1.drawImage(image1, { x: 0, y: 0, width: width / scale, height: height / scale });

    const newPage2 = newPdf2.addPage([width / scale, height / scale]);
    newPage2.drawImage(image2, { x: 0, y: 0, width: width / scale, height: height / scale });

    if (onProgress) {
      onProgress((i / maxPages) * 100);
    }
  }

  const accuracy = totalPixels > 0 ? Math.max(0, 100 - (totalDiffPixels / totalPixels) * 100) : 100;
  return { 
    bytes: await newPdf2.save(), 
    originalBytes: await newPdf1.save(),
    accuracy 
  };
};

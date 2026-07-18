import jsPDF from 'jspdf';
import { unzipSync } from 'fflate';

import html2canvas from 'html2canvas';

export const convertPptxToPdf = async (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
  onProgress(15);
  const unzipped = unzipSync(new Uint8Array(await file.arrayBuffer()));
  onProgress(35);
  const decode = (b: Uint8Array) => new TextDecoder('utf-8').decode(b);
  const slideKeys = Object.keys(unzipped).filter((k) => k.startsWith('ppt/slides/slide') && k.endsWith('.xml')).sort((a, b) => (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0));
  const slides = slideKeys.map((k, idx) => {
    const xml = decode(unzipped[k]);
    const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
    const lines = [...new Set(matches.map((m) => m.replace(/<\/?a:t>/g, '').trim()).filter(Boolean))];
    return { slideIndex: idx + 1, lines: lines.length ? lines : ['(Visual slide element)'] };
  });
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;left:-99999px;top:0;width:1123px;min-height:794px;background:#fff;color:#1F2937;padding:40px;box-sizing:border-box;font-family:Calibri,Arial,sans-serif';
  document.body.appendChild(container);
  try {
    for (let i = 0; i < slides.length; i++) {
      const { slideIndex, lines } = slides[i];
      container.innerHTML = `<div style="border:2px solid #E2E8F0;border-radius:16px;padding:35px;min-height:680px;box-sizing:border-box;display:flex;flex-direction:column">
        <div style="font-size:24px;font-weight:bold;color:#4F46E5;border-bottom:2px solid #EEF2FF;padding-bottom:14px;margin-bottom:24px">Slide ${slideIndex}: ${file.name}</div>
        <div style="flex:1">${lines.map((l) => `<div style="display:flex;align-items:flex-start;margin-bottom:14px;font-size:18px;line-height:1.5;color:#334155"><span style="color:#4F46E5;font-weight:bold;margin-right:14px">•</span><span>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span></div>`).join('')}</div>
      </div>`;
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      if (i > 0) doc.addPage();
      const imgH = canvas.height * (297 / canvas.width);
      doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, Math.min(210, imgH), undefined, 'FAST');
      onProgress(35 + Math.round(((i + 1) / slides.length) * 60));
    }
    return new Uint8Array(doc.output('arraybuffer'));
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
};


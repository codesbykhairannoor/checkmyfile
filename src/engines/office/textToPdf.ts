import jsPDF from 'jspdf';


export const convertTextToPdf = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(20);
  const text = await file.text();
  onProgress(50);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const margin = 18;
  const maxW = doc.internal.pageSize.getWidth() - margin * 2;
  const lineH = 6;
  const lines = doc.splitTextToSize(text, maxW);
  let curY = margin;
  for (let i = 0; i < lines.length; i++) {
    if (curY + lineH > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); curY = margin; }
    doc.text(lines[i], margin, curY);
    curY += lineH;
    if (i % 50 === 0) onProgress(50 + Math.round(((i + 1) / lines.length) * 45));
  }
  onProgress(98);
  return new Uint8Array(doc.output('arraybuffer'));
};

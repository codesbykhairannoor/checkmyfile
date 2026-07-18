import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface PageNumberConfig {
  position: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right';
  format: string;
  startPage: number;
  startNumber: number;
}

export const addPageNumbers = async (
  file: File,
  config: PageNumberConfig,
  onProgress: (progress: number) => void
): Promise<Uint8Array> => {
  onProgress(25);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    // Only apply if the physical page (1-indexed) is >= config.startPage
    if (i + 1 >= config.startPage) {
      const { width, height } = page.getSize();
      
      const currentNumber = config.startNumber + (i + 1 - config.startPage);
      const text = config.format
        .replace('{n}', currentNumber.toString())
        .replace('{p}', totalPages.toString());
        
      const fontSize = 11;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const boxPad = 6;

      let x = width / 2 - textWidth / 2;
      let y = 36;

      if (config.position === 'bottom-right') {
        x = width - textWidth - 36;
        y = 36;
      } else if (config.position === 'top-center') {
        x = width / 2 - textWidth / 2;
        y = height - 44;
      } else if (config.position === 'top-right') {
        x = width - textWidth - 36;
        y = height - 44;
      }

      // Draw subtle white contrast badge behind text to ensure legibility over existing footers/headers
      page.drawRectangle({
        x: x - boxPad,
        y: y - 4,
        width: textWidth + boxPad * 2,
        height: fontSize + 8,
        color: rgb(1, 1, 1),
        opacity: 0.88,
      });

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.18, 0.2, 0.25),
      });
    }
    onProgress(25 + Math.round(((i + 1) / totalPages) * 65));
  }

  const data = await pdf.save();
  onProgress(100);
  return data;
};


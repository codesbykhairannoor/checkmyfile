import { PDFDocument, PDFName } from 'pdf-lib';

export interface PdfMetadataConfig {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  producer?: string;
  creationDate?: string | Date;
  modDate?: string | Date;
  purgeAiManifests?: boolean;
}

export interface ExistingPdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modDate: string;
  creationDateHuman: string;
  modDateHuman: string;
  hasXmp: boolean;
  hasPieceInfo: boolean;
  foundCount: number;
}

/**
 * Reads existing metadata from a PDF file client-side without altering contents.
 */
export const readPdfMetadata = async (file: File, locale: string = 'id'): Promise<ExistingPdfMetadata> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  const creationDateObj = pdfDoc.getCreationDate();
  const modDateObj = pdfDoc.getModificationDate();

  // Format date to YYYY-MM-DDTHH:mm for datetime-local inputs
  const formatDateForInput = (d?: Date): string => {
    if (!d || isNaN(d.getTime())) return '';
    try {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const formatHumanDate = (d?: Date): string => {
    if (!d || isNaN(d.getTime())) return '';
    if (d.getTime() === 0) return locale === 'id' ? '1 Jan 1970 (Epoch 0 / Direset)' : 'Jan 1, 1970 (Epoch 0 / Reset)';
    try {
      const loc = locale === 'id' ? 'id-ID' : (locale === 'en' ? 'en-US' : locale);
      return d.toLocaleString(loc, {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
    } catch {
      return d.toISOString();
    }
  };

  const hasXmp = !!pdfDoc.catalog.get(PDFName.of('Metadata'));
  const hasPieceInfo = !!pdfDoc.catalog.get(PDFName.of('PieceInfo'));

  const title = pdfDoc.getTitle() || '';
  const author = pdfDoc.getAuthor() || '';
  const subject = pdfDoc.getSubject() || '';
  const keywords = (pdfDoc.getKeywords() || '').trim();
  const creator = pdfDoc.getCreator() || '';
  const producer = pdfDoc.getProducer() || '';

  const foundCount = [
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDateObj,
    modDateObj,
    hasXmp ? 'xmp' : '',
    hasPieceInfo ? 'pieceInfo' : '',
  ].filter(Boolean).length;

  return {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDate: formatDateForInput(creationDateObj),
    modDate: formatDateForInput(modDateObj),
    creationDateHuman: formatHumanDate(creationDateObj),
    modDateHuman: formatHumanDate(modDateObj),
    hasXmp,
    hasPieceInfo,
    foundCount,
  };
};

/**
 * Applies custom document metadata properties and saves with zero footprint.
 */
export const editMetadataPdf = async (
  file: File,
  config?: PdfMetadataConfig
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  if (config) {
    if (config.title !== undefined) pdfDoc.setTitle(config.title);
    if (config.author !== undefined) pdfDoc.setAuthor(config.author);
    if (config.subject !== undefined) pdfDoc.setSubject(config.subject);
    if (config.keywords !== undefined) pdfDoc.setKeywords(config.keywords);
    if (config.creator !== undefined) pdfDoc.setCreator(config.creator);
    if (config.producer !== undefined) pdfDoc.setProducer(config.producer);

    if (config.creationDate) {
      const cDate = new Date(config.creationDate);
      if (!isNaN(cDate.getTime())) {
        pdfDoc.setCreationDate(cDate);
      }
    }

    if (config.modDate) {
      const mDate = new Date(config.modDate);
      if (!isNaN(mDate.getTime())) {
        pdfDoc.setModificationDate(mDate);
      }
    } else {
      pdfDoc.setModificationDate(new Date());
    }

    // Optionally purge lingering XMP / C2PA tracking streams
    if (config.purgeAiManifests) {
      try {
        pdfDoc.catalog.delete(PDFName.of('Metadata'));
        pdfDoc.catalog.delete(PDFName.of('PieceInfo'));
      } catch (e) {
        console.warn('Failed to purge C2PA/XMP streams during metadata update:', e);
      }
    }
  }

  // Save with updateMetadata: false so pdf-lib does not inject its default producer
  return await pdfDoc.save({ updateMetadata: false });
};

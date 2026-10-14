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
}

/**
 * Reads existing metadata from a PDF file client-side without altering contents.
 */
export const readPdfMetadata = async (file: File): Promise<ExistingPdfMetadata> => {
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

  return {
    title: pdfDoc.getTitle() || '',
    author: pdfDoc.getAuthor() || '',
    subject: pdfDoc.getSubject() || '',
    keywords: (pdfDoc.getKeywords() || '').trim(),
    creator: pdfDoc.getCreator() || '',
    producer: pdfDoc.getProducer() || '',
    creationDate: formatDateForInput(creationDateObj),
    modDate: formatDateForInput(modDateObj),
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

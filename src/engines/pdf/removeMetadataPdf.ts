import { PDFDocument, PDFName } from 'pdf-lib';

export const removeMetadataPdf = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  // Sanitize all standard metadata dictionary entries
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setCreator('');
  pdfDoc.setProducer('');
  pdfDoc.setKeywords([]);

  // Reset creation and modification dates to epoch 0 (1970-01-01) to eliminate identifying timestamps
  const epoch = new Date(0);
  pdfDoc.setCreationDate(epoch);
  pdfDoc.setModificationDate(epoch);

  // Deep sanitize: purge XML XMP metadata stream from catalog (/Root -> /Metadata)
  // This removes lingering EXIF, camera, author, software, or license XML packets
  try {
    pdfDoc.catalog.delete(PDFName.of('Metadata'));
  } catch (e) {
    console.warn('Failed to delete XMP Metadata stream:', e);
  }

  // Purge application-private metadata (/PieceInfo) commonly left by Illustrator/Photoshop/InDesign
  try {
    pdfDoc.catalog.delete(PDFName.of('PieceInfo'));
  } catch (e) {
    console.warn('Failed to delete PieceInfo dictionary:', e);
  }

  // Save without allowing pdf-lib to re-inject its own producer or current timestamps
  return await pdfDoc.save({ updateMetadata: false });
};

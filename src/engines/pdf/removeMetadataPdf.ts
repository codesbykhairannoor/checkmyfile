import { PDFDocument } from 'pdf-lib';

export const removeMetadataPdf = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Sanitize all metadata
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setCreator('');
  pdfDoc.setProducer('');
  pdfDoc.setKeywords([]);

  // Reset creation and modification dates to epoch 0 to remove identifying timestamps
  const epoch = new Date(0);
  pdfDoc.setCreationDate(epoch);
  pdfDoc.setModificationDate(epoch);

  return await pdfDoc.save();
};

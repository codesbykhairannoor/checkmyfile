/**
 * Normalizes an image file (JPEG, PNG, WebP, GIF) to ensure EXIF orientation is baked
 * directly into the pixel raster data.
 *
 * Why this is needed:
 * Smartphone cameras (iOS / Android) capture photos on physical landscape sensor grids
 * (e.g. 4032x3024) and attach an EXIF Orientation metadata tag (e.g. Orientation 6 = rotate 90° CW).
 * Browser <img> tags and photo galleries read this tag and display the image upright.
 * However, PDF engines (like pdf-lib) and raw PDF XObjects do NOT read EXIF metadata tags;
 * they only read raw frame dimensions. This causes portrait smartphone photos to suddenly turn
 * horizontal/sideways when embedded directly into a PDF.
 *
 * By resolving the orientation via `createImageBitmap({ imageOrientation: 'from-image' })`
 * and rendering onto a canvas, the resulting bytes are physically upright with correct dimensions.
 */

export interface NormalizedImage {
  buffer: ArrayBuffer;
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  isPng: boolean;
}

export async function normalizeImage(file: File | Blob): Promise<NormalizedImage> {
  const fileType = file.type || '';
  const fileName = 'name' in file ? (file as File).name.toLowerCase() : '';
  
  const isJpeg = fileType.includes('jpeg') || fileType.includes('jpg') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
  const isPng = !isJpeg; // PNG, WebP, GIF convert to PNG for lossless alpha preservation
  const targetMime = isPng ? 'image/png' : 'image/jpeg';
  const quality = isPng ? undefined : 0.95;

  // Primary standard method: createImageBitmap with { imageOrientation: 'from-image' }
  if (typeof createImageBitmap !== 'undefined') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close?.();

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, targetMime, quality)
        );

        if (blob) {
          const buffer = await blob.arrayBuffer();
          const dataUrl = canvas.toDataURL(targetMime, quality);
          return {
            buffer,
            dataUrl,
            width: canvas.width,
            height: canvas.height,
            mimeType: targetMime,
            isPng,
          };
        }
      }
    } catch (err) {
      console.warn('[imageOrientation] createImageBitmap with orientation failed, falling back:', err);
    }
  }

  // Fallback method using HTMLImageElement (which also honors EXIF in modern browsers)
  const imgUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
      image.src = imgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, targetMime, quality)
      );
      if (blob) {
        const buffer = await blob.arrayBuffer();
        const dataUrl = canvas.toDataURL(targetMime, quality);
        return {
          buffer,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
          mimeType: targetMime,
          isPng,
        };
      }
    }
  } catch (err) {
    console.warn('[imageOrientation] HTMLImageElement fallback failed:', err);
  } finally {
    URL.revokeObjectURL(imgUrl);
  }

  // Final fallback: raw array buffer
  const buffer = await file.arrayBuffer();
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });

  return {
    buffer,
    dataUrl,
    width: 1000,
    height: 1000,
    mimeType: fileType || targetMime,
    isPng,
  };
}

export async function normalizeImageDataUrl(file: File | Blob): Promise<string> {
  const result = await normalizeImage(file);
  return result.dataUrl;
}

import * as pdfjsLib from 'pdfjs-dist';
import * as fflate from 'fflate';

export async function extractImagesPdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  
  const numPages = pdf.numPages;
  const imageFiles: Record<string, Uint8Array> = {};
  
  let imageCount = 0;
  
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const ops = await page.getOperatorList();
    
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (
        ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject || 
        ops.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject
      ) {
        try {
          let img = null;
          if (ops.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject) {
            img = ops.argsArray[i][0];
          } else {
            const objId = ops.argsArray[i][0];
            try {
              img = page.objs.get(objId);
            } catch (err) {}
            if (!img) {
              try {
                img = page.commonObjs.get(objId);
              } catch (err) {}
            }
          }
          if (img) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let drawn = false;

            if (img.bitmap && ctx) {
              canvas.width = img.bitmap.width;
              canvas.height = img.bitmap.height;
              ctx.drawImage(img.bitmap, 0, 0);
              drawn = true;
            } else if (img.data && img.width && img.height && ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              // Attempt to handle raw data (assuming RGBA)
              try {
                let rgbaData = img.data;
                // If it's RGB (3 channels), convert to RGBA (4 channels)
                if (img.data.length === img.width * img.height * 3) {
                  rgbaData = new Uint8ClampedArray(img.width * img.height * 4);
                  for (let j = 0, k = 0; j < img.data.length; j += 3, k += 4) {
                    rgbaData[k] = img.data[j];
                    rgbaData[k + 1] = img.data[j + 1];
                    rgbaData[k + 2] = img.data[j + 2];
                    rgbaData[k + 3] = 255;
                  }
                }
                const imageData = new ImageData(
                  new Uint8ClampedArray(rgbaData), 
                  img.width, 
                  img.height
                );
                ctx.putImageData(imageData, 0, 0);
                drawn = true;
              } catch (err) {
                console.warn('Could not parse image data format', err);
              }
            }

            if (drawn) {
              const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
              if (blob) {
                imageCount++;
                const imgBuffer = await blob.arrayBuffer();
                imageFiles[`image_page${pageNum}_${imageCount}.png`] = new Uint8Array(imgBuffer);
              }
            }
          }
        } catch (e) {
          console.warn(`Failed to extract image on page ${pageNum}`, e);
        }
      }
    }
    
    if (onProgress) {
      onProgress(Math.round((pageNum / numPages) * 80)); // up to 80%
    }
  }

  if (Object.keys(imageFiles).length === 0) {
    throw new Error('Tidak ada gambar yang ditemukan dalam dokumen PDF ini.');
  }

  // Create ZIP using fflate
  return new Promise((resolve, reject) => {
    fflate.zip(imageFiles, (err, dat) => {
      if (err) {
        reject(err);
      } else {
        if (onProgress) onProgress(100);
        resolve(new Blob([dat], { type: 'application/zip' }));
      }
    });
  });
}

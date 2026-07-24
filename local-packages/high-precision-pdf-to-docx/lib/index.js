import * as pdfjsLib from 'pdfjs-dist';
import wasmUrl from './pdf_converter_wasm.wasm?url';

// Set worker src
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

class HighPrecisionPdfConverter {
    constructor() {
        this.wasmModule = null;
    }

    async initialize() {
        if (this.wasmModule) return;
        try {
            const ModuleInitializer = (await import('./pdf_converter_wasm.js')).default;
            this.wasmModule = await ModuleInitializer({
                locateFile: (path) => {
                    if (path.endsWith('.wasm')) return wasmUrl;
                    return path;
                }
            });
        } catch (error) {
            console.error("WASM Module not found.", error);
            throw error;
        }
    }

    async extractSpatialData(pdfUint8Array) {
        const loadingTask = pdfjsLib.getDocument({ data: pdfUint8Array });
        const pdf = await loadingTask.promise;
        const pages = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.0 });
            const textContent = await page.getTextContent();
            
            // Extract text elements with font styles
            const elements = [];
            for (const item of textContent.items) {
                if (!item.str.trim()) continue;
                const transform = item.transform;
                const font = await Promise.race([
                    new Promise(res => page.commonObjs.get(item.fontName, res)),
                    new Promise(res => setTimeout(() => res(null), 50)) // 50ms timeout for fonts
                ]).catch(() => null);
                
                let isBold = false;
                let isItalic = false;
                if (font && font.name) {
                    const fname = font.name.toLowerCase();
                    if (fname.includes('bold')) isBold = true;
                    if (fname.includes('italic') || fname.includes('oblique')) isItalic = true;
                }
                
                elements.push({
                    text: item.str,
                    x: transform[4],
                    y: viewport.height - transform[5],
                    w: item.width,
                    h: Math.abs(transform[3]),
                    bold: isBold,
                    italic: isItalic,
                    size: Math.abs(transform[3])
                });
            }
            
            // Extract images and vector paths using getOperatorList
            const images = [];
            const paths = [];
            try {
                const ops = await page.getOperatorList();
                let ctm = [1, 0, 0, 1, 0, 0];
                const stack = [];
                const multiply = (m1, m2) => [
                    m1[0]*m2[0] + m1[2]*m2[1], m1[1]*m2[0] + m1[3]*m2[1],
                    m1[0]*m2[2] + m1[2]*m2[3], m1[1]*m2[2] + m1[3]*m2[3],
                    m1[0]*m2[4] + m1[2]*m2[5] + m1[4], m1[1]*m2[4] + m1[3]*m2[5] + m1[5]
                ];
                
                let currentPoint = {x: 0, y: 0};
                let pendingPaths = []; // Buffer for current subpaths

                for (let j = 0; j < ops.fnArray.length; j++) {
                    const fn = ops.fnArray[j];
                    const args = ops.argsArray[j];
                    if (fn === pdfjsLib.OPS.save) stack.push([...ctm]);
                    else if (fn === pdfjsLib.OPS.restore) { if(stack.length) ctm = stack.pop(); }
                    else if (fn === pdfjsLib.OPS.transform) ctm = multiply(ctm, args);
                    else if (fn === pdfjsLib.OPS.moveTo) {
                        currentPoint = {
                            x: ctm[0]*args[0] + ctm[2]*args[1] + ctm[4],
                            y: viewport.height - (ctm[1]*args[0] + ctm[3]*args[1] + ctm[5])
                        };
                    }
                    else if (fn === pdfjsLib.OPS.lineTo) {
                        const endPoint = {
                            x: ctm[0]*args[0] + ctm[2]*args[1] + ctm[4],
                            y: viewport.height - (ctm[1]*args[0] + ctm[3]*args[1] + ctm[5])
                        };
                        pendingPaths.push({
                            x1: currentPoint.x, y1: currentPoint.y,
                            x2: endPoint.x, y2: endPoint.y
                        });
                        currentPoint = endPoint;
                    }
                    else if (fn === pdfjsLib.OPS.rectangle) {
                        const x = ctm[0]*args[0] + ctm[2]*args[1] + ctm[4];
                        const y = viewport.height - (ctm[1]*args[0] + ctm[3]*args[1] + ctm[5]);
                        const w = ctm[0]*args[2];
                        const h = ctm[3]*args[3]; // Flipped
                        
                        pendingPaths.push({ x1: x, y1: y, x2: x + w, y2: y }); // Top
                        pendingPaths.push({ x1: x, y1: y - h, x2: x + w, y2: y - h }); // Bottom
                        pendingPaths.push({ x1: x, y1: y, x2: x, y2: y - h }); // Left
                        pendingPaths.push({ x1: x + w, y1: y, x2: x + w, y2: y - h }); // Right
                    }
                    else if (fn === pdfjsLib.OPS.constructPath) {
                        const opsList = args[0];
                        const argsList = args[1];
                        let argIdx = 0;
                        for (let k = 0; k < opsList.length; k++) {
                            const op = opsList[k];
                            if (op === pdfjsLib.OPS.moveTo) {
                                currentPoint = {
                                    x: ctm[0]*argsList[argIdx] + ctm[2]*argsList[argIdx+1] + ctm[4],
                                    y: viewport.height - (ctm[1]*argsList[argIdx] + ctm[3]*argsList[argIdx+1] + ctm[5])
                                };
                                argIdx += 2;
                            } else if (op === pdfjsLib.OPS.lineTo) {
                                const endPoint = {
                                    x: ctm[0]*argsList[argIdx] + ctm[2]*argsList[argIdx+1] + ctm[4],
                                    y: viewport.height - (ctm[1]*argsList[argIdx] + ctm[3]*argsList[argIdx+1] + ctm[5])
                                };
                                pendingPaths.push({
                                    x1: currentPoint.x, y1: currentPoint.y,
                                    x2: endPoint.x, y2: endPoint.y
                                });
                                currentPoint = endPoint;
                                argIdx += 2;
                            } else if (op === pdfjsLib.OPS.rectangle) {
                                const x = ctm[0]*argsList[argIdx] + ctm[2]*argsList[argIdx+1] + ctm[4];
                                const y = viewport.height - (ctm[1]*argsList[argIdx] + ctm[3]*argsList[argIdx+1] + ctm[5]);
                                const w = ctm[0]*argsList[argIdx+2];
                                const h = ctm[3]*argsList[argIdx+3];
                                pendingPaths.push({ x1: x, y1: y, x2: x + w, y2: y });
                                pendingPaths.push({ x1: x, y1: y - h, x2: x + w, y2: y - h });
                                pendingPaths.push({ x1: x, y1: y, x2: x, y2: y - h });
                                pendingPaths.push({ x1: x + w, y1: y, x2: x + w, y2: y - h });
                                argIdx += 4;
                            }
                        }
                    }
                    else if (fn === pdfjsLib.OPS.stroke || fn === pdfjsLib.OPS.fill || fn === pdfjsLib.OPS.eoFill) {
                        paths.push(...pendingPaths);
                        pendingPaths = [];
                    }
                    else if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintJpegXObject) {
                        const objId = args[0];
                        try {
                            const imgObj = await Promise.race([
                                new Promise(res => page.objs.get(objId, res)),
                                new Promise(res => setTimeout(() => res(null), 200))
                            ]);
                            if (imgObj && imgObj.src && typeof document !== 'undefined') {
                                images.push({
                                    b64: imgObj.src.split(',')[1],
                                    x: ctm[4], y: viewport.height - ctm[5], w: ctm[0], h: ctm[3]
                                });
                            }
                        } catch (e) {}
                    }
                }
            } catch (e) { console.warn("Ops list failed:", e); }

            pages.push({
                width: viewport.width,
                height: viewport.height,
                elements: elements,
                images: images,
                paths: paths
            });
        }
        
        return pages;
    }

    async convertPdfToDocx(pdfUint8Array) {
        await this.initialize();
        
        // 1. Ekstraksi koordinat menggunakan "Mata" JS (pdfjs-dist)
        console.log("Mengekstrak data spasial...");
        const spatialData = await this.extractSpatialData(pdfUint8Array);
        const jsonString = JSON.stringify(spatialData);
        
        const encoder = new TextEncoder();
        const jsonBytes = encoder.encode(jsonString);
        
        let jsonPointer = null;
        let docxPointer = null;

        try {
            // 2. Alokasikan buffer pada heap WASM
            jsonPointer = this.wasmModule._allocate_wasm_buffer(jsonBytes.length);
            if (!jsonPointer) throw new Error("Memory allocation failed.");

            // 3. Salin data JSON ke WASM
            this.wasmModule.HEAPU8.set(jsonBytes, jsonPointer);

            console.log("Menjalankan C++ DLA & DocxGenerator di WebAssembly...");
            // 4. Jalankan analisis tata letak C++
            docxPointer = this.wasmModule._convert_pdf_to_docx(jsonPointer, jsonBytes.length);
            
            const docxSize = this.wasmModule._get_converted_docx_size();
            if (!docxPointer || docxSize === 0) {
                throw new Error("Konversi C++ gagal.");
            }

            // 5. Salin DOCX biner
            const docxResult = new Uint8Array(docxSize);
            docxResult.set(this.wasmModule.HEAPU8.subarray(docxPointer, docxPointer + docxSize));

            return docxResult.buffer;

        } finally {
            if (jsonPointer) this.wasmModule._free_wasm_buffer(jsonPointer);
            if (docxPointer) this.wasmModule._free_wasm_buffer(docxPointer);
        }
    }
}

export { HighPrecisionPdfConverter };

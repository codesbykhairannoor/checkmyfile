# 🔒 HandleMyFile — 100% Private, Client-Side Document & PDF Platform

<p align="center">
  <img src="public/og-image.png" alt="HandleMyFile Banner" width="800" style="border-radius: 12px;" />
</p>

<p align="center">
  <a href="https://handlemyfile.com"><img src="https://img.shields.io/badge/Live_Web_App-handlemyfile.com-2563eb?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live App" /></a>
  <img src="https://img.shields.io/badge/Architecture-WebAssembly_(WASM)-8b5cf6?style=for-the-badge&logo=webassembly&logoColor=white" alt="WebAssembly" />
  <img src="https://img.shields.io/badge/Zero_Uploads-100%25_Local_RAM-10b981?style=for-the-badge&logo=shield&logoColor=white" alt="Privacy First" />
  <img src="https://img.shields.io/badge/Languages-30_Supported-f59e0b?style=for-the-badge" alt="30 Languages" />
  <img src="https://img.shields.io/badge/License-MIT-gray?style=for-the-badge" alt="MIT License" />
</p>

---

## ⚡ The Problem with Traditional PDF & Document SaaS
Every major online PDF tool (Adobe Acrobat, SmallPDF, iLovePDF, DocuSign) shares the same fundamental flaws:
1. **The Privacy Risk**: You are forced to upload confidential invoices, contracts, tax returns, and medical records to remote cloud servers (AWS/GCP buckets) hoping they "actually delete it in 2 hours".
2. **The Artificial Paywall**: They charge $20/month or impose "2 free tasks per day" limits for operations that take 15 milliseconds of CPU time.
3. **The Data Telemetry**: Your document contents and metadata are scanned and logged.

---

## 🛡️ The Solution: [HandleMyFile](https://handlemyfile.com)
**HandleMyFile** completely eliminates the cloud backend. The entire document processing engine is compiled down to **client-side WebAssembly (WASM)** and executed directly inside the user's browser memory (`ArrayBuffer` & `Uint8Array`).

> 🚀 **The Airplane Mode Test**: Load [handlemyfile.com](https://handlemyfile.com), turn off your Wi-Fi, and compress, merge, or sign a 100-page document. It executes 100% offline. Zero network packets leave your machine.

---

## 🛠️ Complete Feature Matrix (49+ Tools)

| Category | Tools Included | Engine |
| :--- | :--- | :--- |
| **PDF Manipulation** | Merge, Split, Reorder (Drag & Drop), Crop Margins, Rotate, Page Numbering | `pdf-lib` (WASM/JS) |
| **Optimization** | Lossless Compression (reduces 100MB files to <5MB in local RAM), Grayscale conversion | Canvas & Web Workers |
| **Sign & Protect** | Vector Canvas e-Signatures, Password Encryption/Decryption, Redaction, Watermarking | Client Crypto & Canvas |
| **Document Conversions** | PDF ⇄ Word (.docx), Excel (.xlsx), PowerPoint (.pptx), Images (PNG/JPG), TXT | Pure In-Browser Parsers |
| **Text Extraction** | Client-side Optical Character Recognition (OCR) for scanned PDFs | `tesseract.js` (WASM Core) |
| **Privacy Sanitizer** | Metadata Scrubber (erases author names, software tags, and GPS exif tags) | Local Buffer Sanitizer |

---

## 🏗️ Architecture Diagram

```
[User Document / File]
          │
          ▼  (0 bytes over the internet)
[Local Browser Memory / ArrayBuffer]
          │
          ├──> [pdf-lib & Web Workers] ──> Vector Page Operations & Slicing
          ├──> [Multi-Threaded Tesseract Core] ──> Client-Side OCR
          ├──> [Canvas Image Quantization] ──> Lossless Compression
          └──> [Binary Parser / Serializer] ──> Word & Excel Generation
          │
          ▼
[Instant Blob Download] (Generated entirely on client CPU)
```

---

## 🌐 30 Localized Languages
The entire suite is fully translated and localized with comprehensive SEO and crawlability across 30 languages:
- English, Indonesian, Spanish, French, German, Japanese, Portuguese, Russian, Chinese, Arabic, Hindi, Italian, Korean, Dutch, Turkish, Polish, Swedish, Vietnamese, Thai, Danish, Finnish, Greek, Hebrew, Hungarian, Norwegian, Romanian, Slovak, Czech, Ukrainian, and Malay.

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/codesbykhairannoor/checkmyfile.git
cd checkmyfile

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
```bash
# Build production bundle with static pre-rendering
npm run build
```

---

## 🤝 Contributing
Contributions, bug reports, and feature requests are welcome! Feel free to check the [issues page](https://github.com/codesbykhairannoor/checkmyfile/issues).

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

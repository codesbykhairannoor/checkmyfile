const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
  const distOutputPath = path.join(__dirname, '..', 'dist', 'og-image.png');

  // Resize logo for crisp display
  const logoBuffer = await sharp(logoPath)
    .resize(110, 110, { fit: 'contain' })
    .toBuffer();

  const svgContent = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.8" opacity="0.45"/>
      </pattern>
      <!-- Linear gradient for top accent border -->
      <linearGradient id="topBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563eb" />
        <stop offset="50%" stop-color="#4f46e5" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
    </defs>

    <!-- Deep Slate Solid Background -->
    <rect width="${width}" height="${height}" fill="#090d16" />
    <rect width="${width}" height="${height}" fill="url(#grid)" />

    <!-- Top Accent Bar (Clean line, NO glow) -->
    <rect x="0" y="0" width="${width}" height="6" fill="url(#topBarGrad)" />

    <!-- Outer Frame Card -->
    <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#1e293b" stroke-width="1.5" />

    <!-- Brand Header -->
    <!-- Logo placeholder frame -->
    <rect x="75" y="68" width="120" height="120" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
    
    <text x="218" y="120" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1px">HandleMyFile</text>
    
    <!-- Security Badge with inline SVG Shield -->
    <rect x="220" y="140" width="375" height="34" rx="8" fill="#0f172a" stroke="#1e3a8a" stroke-width="1.2" />
    <g transform="translate(234, 147)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </g>
    <text x="262" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#60a5fa" letter-spacing="0.6px">100% IN-BROWSER • ZERO SERVER UPLOADS</text>

    <!-- Hero Title -->
    <text x="75" y="254" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="800" fill="#f8fafc" letter-spacing="-0.5px">The All-in-One Private Document &amp; PDF Suite</text>
    
    <!-- Hero Description -->
    <text x="75" y="298" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="21.5" font-weight="400" fill="#94a3b8">Convert, merge, compress, edit, sign, and protect documents directly inside your browser.</text>
    <text x="75" y="328" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="19.5" font-weight="500" fill="#64748b">Hardware-accelerated WebAssembly (WASM) • Maximum Security • No File Tracking</text>

    <!-- 4 Feature Cards (Symmetric & Cohesive with Vector Icons) -->
    <!-- Card 1: Zero Server Uploads -->
    <g transform="translate(75, 375)">
      <rect width="250" height="135" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.2" />
      <!-- Icon Container -->
      <rect x="20" y="20" width="38" height="38" rx="8" fill="#172554" stroke="#1e40af" stroke-width="1" />
      <g transform="translate(29, 29)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </g>
      <text x="68" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#f1f5f9">Zero Uploads</text>
      <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#94a3b8">Files never touch the cloud</text>
      <text x="20" y="108" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#64748b">Processed purely in local RAM</text>
    </g>

    <!-- Card 2: Client-Side WASM -->
    <g transform="translate(345, 375)">
      <rect width="250" height="135" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.2" />
      <!-- Icon Container -->
      <rect x="20" y="20" width="38" height="38" rx="8" fill="#082f49" stroke="#0369a1" stroke-width="1" />
      <g transform="translate(29, 29)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </g>
      <text x="68" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#f1f5f9">In-Browser WASM</text>
      <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#94a3b8">Blazing fast C++ &amp; Rust</text>
      <text x="20" y="108" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#64748b">Works completely offline</text>
    </g>

    <!-- Card 3: 49+ Document Tools -->
    <g transform="translate(615, 375)">
      <rect width="250" height="135" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.2" />
      <!-- Icon Container -->
      <rect x="20" y="20" width="38" height="38" rx="8" fill="#2e1065" stroke="#4c1d95" stroke-width="1" />
      <g transform="translate(29, 29)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </g>
      <text x="68" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#f1f5f9">49+ File Tools</text>
      <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#94a3b8">PDF, Word, Excel, PPTX</text>
      <text x="20" y="108" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#64748b">OCR, Sign, Compress &amp; Edit</text>
    </g>

    <!-- Card 4: 30 Languages -->
    <g transform="translate(885, 375)">
      <rect width="240" height="135" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="1.2" />
      <!-- Icon Container -->
      <rect x="20" y="20" width="38" height="38" rx="8" fill="#064e3b" stroke="#047857" stroke-width="1" />
      <g transform="translate(29, 29)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </g>
      <text x="68" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#f1f5f9">30 Languages</text>
      <text x="20" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#94a3b8">100% Free &amp; Unlimited</text>
      <text x="20" y="108" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="400" fill="#64748b">No signup, no subscription</text>
    </g>

    <!-- Divider Line -->
    <line x1="75" y1="540" x2="1125" y2="540" stroke="#1e293b" stroke-width="1" />

    <!-- Bottom URL & Proof -->
    <text x="75" y="572" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#3b82f6" letter-spacing="0.2px">handlemyfile.com</text>
    <text x="1125" y="572" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#64748b">Private • Fast • In-Browser • Free Forever</text>
  </svg>
  `;

  // Composite SVG background with the logo image
  const svgBuffer = Buffer.from(svgContent);

  const finalImage = await sharp(svgBuffer)
    .composite([
      {
        input: logoBuffer,
        top: 73,
        left: 80,
      }
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`Successfully generated OG image at ${outputPath}:`, finalImage);

  // Also copy to dist if dist exists
  if (fs.existsSync(path.dirname(distOutputPath))) {
    fs.copyFileSync(outputPath, distOutputPath);
    console.log(`Copied OG image to ${distOutputPath}`);
  }
}

createOgImage().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

// Copy of seoData from generate-4-longtail-jsons.cjs
const seoData = {
  "compress-pdf-to-100kb": {
    en: {
      title: "Compress PDF to 100KB - Online PDF Shrinker to 100KB",
      h1: "Compress PDF Files to 100KB Online",
      description: "Shrink your large PDF documents under 100KB for government portals, job applications, or visa forms completely in your browser.",
      heroBadge: "100KB Target",
      heroTitle: "Shrink PDF to 100KB Instantly & Securely",
      heroContent: "Struggling with strict 100KB upload limits on government portals, job sites, or visa applications? Our local compressor optimizes your PDF file under 100KB in seconds.",
      howToBadge: "Quick Guide",
      howToTitle: "How to Compress PDF under 100KB",
      step1Title: "Add PDF Document",
      step1Desc: "Drop your PDF file into the client-side compressor.",
      step2Title: "Select 100KB Target",
      step2Desc: "Choose strong compression to automatically target size under 100KB.",
      step3Title: "Save Optimized PDF",
      step3Desc: "Download your compressed PDF instantly, ready to upload.",
      geoTitle: "Perfect for CPNS, Visa, and Scholarship Portals",
      geoContent: "No need to worry about server-side limits. All compression takes place in your local browser sandbox, ensuring absolute compliance with security rules.",
      geoSubTitle: "Upload with Peace of Mind",
      geoSubContent: "We process your sensitive documents (ID card scan, passport, CV) 100% locally. Zero risk of data leak.",
      privacyTitle: "Lossless Density Management",
      privacyContent: "Optimizes image resolution and DPI scales to hit the 100KB threshold without turning texts into illegible blur.",
      perfTitle: "CPNS Ready",
      perfContent: "Visa Approved",
      perfBadge: "Under 100KB",
      badges: ["100KB Target", "Secure", "Fast"],
      buttonText: "Compress to 100KB",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "How do I ensure the file is under 100KB?", a: "Select the 'Strong' compression preset. Our tool optimizes vectors and rasterizes complex gradients to fit your file under 100KB." },
        { q: "Is there a limit on how many files I can compress?", a: "No. Since processing runs locally in your browser memory, you can compress as many files as you want." },
        { q: "Are my documents safe?", a: "Yes. They are processed entirely offline via WebAssembly. 0 bytes are uploaded." }
      ]
    }
  },
  "compress-pdf-without-losing-quality": {
    en: {
      title: "Compress PDF Without Losing Quality - High Definition Lossless",
      h1: "Compress PDF Documents Online Without Losing Quality",
      description: "Reduce PDF file size while keeping high-resolution vectors and texts perfectly sharp. 100% private client-side processing.",
      heroBadge: "Lossless Quality",
      heroTitle: "Reduce File Size, Maintain HD Quality",
      heroContent: "Don't sacrifice readability for size. Shrink your portfolios, vector drawings, or presentations while keeping texts and graphics perfectly crisp.",
      howToBadge: "Simple Steps",
      howToTitle: "How to Compress PDF Losslessly",
      step1Title: "Select File",
      step1Desc: "Choose the high-quality PDF you want to shrink.",
      step2Title: "Pick Lossless Mode",
      step2Desc: "Select the 'High Quality' compression setting to preserve details.",
      step3Title: "Download File",
      step3Desc: "Get your lighter PDF without any blurry text or pixelated images.",
      geoTitle: "Crisp Texts and Sharp Images",
      geoContent: "We use advanced DPI retention and vector smoothing algorithms locally inside your browser to ensure your documents look exactly the same.",
      geoSubTitle: "Client-Side Processing",
      geoSubContent: "Everything runs in WebAssembly.",
      privacyTitle: "Ideal for Portfolios & Presentations",
      privacyContent: "Keep your professional documents looking professional while cutting down megabytes to make them easily shareable.",
      perfTitle: "Zero Pixelation Guarantee",
      perfContent: "Maintain 100% sharpness on all text nodes.",
      perfBadge: "HD Output",
      badges: ["High Definition", "Lossless", "Fast"],
      buttonText: "Compress Without Losing Quality",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "How is it possible to compress without losing quality?", a: "We optimize PDF structures, remove unused fonts/objects, and smartly downsample unseen image layers." },
        { q: "Will the text become blurry?", a: "No. Vector paths and text elements are retained perfectly, avoiding the blur caused by flat image rasterization." },
        { q: "Is this tool free?", a: "Yes, completely free and runs offline." }
      ]
    }
  },
  "combine-multiple-pdf-files": {
    en: {
      title: "Combine Multiple PDF Files - Merge PDFs Online Free",
      h1: "Combine Multiple PDF Files Online (Free & Client-Side)",
      description: "Merge and combine multiple PDF files into one single document. Instant local processing, 100% private, no limit.",
      heroBadge: "Unlimited Merging",
      heroTitle: "Combine Multiple PDF Files into One",
      heroContent: "Organize your workflow by merging invoices, reports, or chapters into a single PDF file instantly. No upload required.",
      howToBadge: "Easy Guide",
      howToTitle: "How to Combine PDF Files",
      step1Title: "Upload Files",
      step1Desc: "Drag and drop all the PDFs you want to merge.",
      step2Title: "Reorder Pages",
      step2Desc: "Drag to rearrange the order of the documents as you see fit.",
      step3Title: "Merge & Download",
      step3Desc: "Click merge and download your combined PDF immediately.",
      geoTitle: "Combine Dozens of Files Securely",
      geoContent: "Because we process everything in your browser, you can merge gigabytes of PDFs without waiting for slow internet uploads.",
      geoSubTitle: "Zero Server Uploads",
      geoSubContent: "All merging is done using your computer's RAM.",
      privacyTitle: "Keep Your Invoices & Reports Organized",
      privacyContent: "Whether you are a student submitting assignments or a freelancer sending invoices, merging them into one file makes it much cleaner.",
      perfTitle: "Instant Merging Speed",
      perfContent: "Combine 50 files in under 2 seconds.",
      perfBadge: "Lightning Fast",
      badges: ["No Uploads", "Merge PDFs", "Unlimited"],
      buttonText: "Combine PDF Files",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Is there a limit to how many files I can combine?", a: "No. Since it's processed on your device, the only limit is your computer's memory." },
        { q: "Can I rearrange the order?", a: "Yes, you can easily drag and drop the files into your desired order before merging." },
        { q: "Do my files go to a server?", a: "Absolutely not. The merging happens 100% offline within your browser." }
      ]
    }
  },
  "sign-pdf-without-registration": {
    en: {
      title: "Sign PDF Online Without Registration - Free E-Sign",
      h1: "E-Sign PDF Documents Online Without Registration",
      description: "Place your electronic signature on any PDF file instantly. No account required, no signup, 100% private and free.",
      heroBadge: "No Registration Required",
      heroTitle: "Sign PDF Documents Instantly Without Creating an Account",
      heroContent: "Annoyed by online sign tools that force you to register, confirm emails, or pay subscriptions just to sign a single paper? HandleMyFile lets you add signatures to contracts completely free without signup.",
      howToBadge: "Quick Steps",
      howToTitle: "How to Sign PDF Without Signup",
      step1Title: "Upload Document",
      step1Desc: "Drop your PDF file into our registration-free workspace.",
      step2Title: "Draw or Type Signature",
      step2Desc: "Create your signature with your mouse/touchpad, or upload an image.",
      step3Title: "Download Signed PDF",
      step3Desc: "Download your signed document instantly. Zero data is saved.",
      geoTitle: "Your Signature is Secure and Stays in Your Browser",
      geoContent: "Biometric and graphical signature drawings are processed entirely in RAM. We do not store your signature or documents on any server, providing maximum fraud prevention.",
      geoSubTitle: "Cryptographically Safe",
      geoSubContent: "Vectors are flattened directly on the client canvas.",
      privacyTitle: "Frictionless NDA & Contract Signing",
      privacyContent: "Perfect for freelancers and business professionals who want to execute agreements, job offers, or NDAs on the spot without any onboarding friction.",
      perfTitle: "Sign and Send in 15 Seconds",
      perfContent: "With zero registration forms, email verification, or loading screens, you can sign any document and send it back immediately.",
      perfBadge: "Speedy E-Sign",
      badges: ["No Registration", "100% Free", "Zero Footprint"],
      buttonText: "Sign PDF Free",
      supportCenter: "Support Center",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Do I need to sign up or input my email to download?", a: "No. You can download your signed PDF immediately with zero onboarding steps." },
        { q: "Is the signature legally binding?", a: "Yes, our e-signature complies with general electronic transaction laws for basic electronic signatures." },
        { q: "Does HandleMyFile store my signature graphic?", a: "No. The signature graphics are processed strictly in browser memory and wiped clean on page reload." }
      ]
    }
  }
};

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Helper to batch text arrays
async function translateArray(texts, targetLang) {
  try {
    const apiLang = targetLang === 'zh' ? 'zh-CN' : targetLang;
    const res = await translate(texts, { to: apiLang });
    return Array.isArray(res) ? res.map(r => r.text) : [res.text];
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error.message);
    return texts;
  }
}

async function run() {
  for (const toolId of Object.keys(seoData)) {
    const targetToolDir = path.join(__dirname, '..', 'src', 'locales', 'seo', toolId);
    if (!fs.existsSync(targetToolDir)) {
      fs.mkdirSync(targetToolDir, { recursive: true });
    }
    
    let layoutConfig = [];
    if (toolId === "compress-pdf-to-100kb") {
      layoutConfig = ["resize_hero_features", "split_how_to_steps", "protect_geo_targeting", "compare_privacy_security", "watermark_performance"];
    } else if (toolId === "compress-pdf-without-losing-quality") {
      layoutConfig = ["word_hero_features", "merge_how_to_steps", "watermark_geo_targeting", "unlock_privacy_security", "ocr_performance"];
    } else if (toolId === "combine-multiple-pdf-files") {
      layoutConfig = ["split_hero_features", "protect_how_to_steps", "rotate_geo_targeting", "sign_privacy_security", "resize_performance"];
    } else if (toolId === "sign-pdf-without-registration") {
      layoutConfig = ["watermark_hero_features", "ocr_how_to_steps", "excel_geo_targeting", "redact_privacy_security", "split_performance"];
    }

    const en = seoData[toolId].en;
    
    for (const lang of langs) {
      if (lang === 'en') {
        const data = generateLayoutData(en, layoutConfig);
        fs.writeFileSync(path.join(targetToolDir, `${lang}.json`), JSON.stringify(data, null, 2), 'utf8');
        continue;
      }
      
      console.log(`Translating ${toolId} to ${lang}...`);
      
      // We will batch all texts into a single array
      const textArray = [
        en.title, en.h1, en.description,
        en.heroBadge, en.heroTitle, en.heroContent,
        en.howToBadge, en.howToTitle,
        en.step1Title, en.step1Desc,
        en.step2Title, en.step2Desc,
        en.step3Title, en.step3Desc,
        en.geoTitle, en.geoContent,
        en.geoSubTitle, en.geoSubContent,
        en.privacyTitle, en.privacyContent,
        en.perfTitle, en.perfContent, en.perfBadge,
        ...en.badges,
        en.buttonText, en.supportCenter, en.faqTitle,
        ...en.faqs.map(f => f.q),
        ...en.faqs.map(f => f.a)
      ];

      const tr = await translateArray(textArray, lang);

      let offset = 0;
      const t = {
        title: tr[offset++],
        h1: tr[offset++],
        description: tr[offset++],
        heroBadge: tr[offset++],
        heroTitle: tr[offset++],
        heroContent: tr[offset++],
        howToBadge: tr[offset++],
        howToTitle: tr[offset++],
        step1Title: tr[offset++],
        step1Desc: tr[offset++],
        step2Title: tr[offset++],
        step2Desc: tr[offset++],
        step3Title: tr[offset++],
        step3Desc: tr[offset++],
        geoTitle: tr[offset++],
        geoContent: tr[offset++],
        geoSubTitle: tr[offset++],
        geoSubContent: tr[offset++],
        privacyTitle: tr[offset++],
        privacyContent: tr[offset++],
        perfTitle: tr[offset++],
        perfContent: tr[offset++],
        perfBadge: tr[offset++],
        badges: [tr[offset++], tr[offset++], tr[offset++]],
        buttonText: tr[offset++],
        supportCenter: tr[offset++],
        faqTitle: tr[offset++]
      };
      t.faqs = [
        { q: tr[offset++], a: tr[offset + 2] },
        { q: tr[offset++], a: tr[offset + 2] },
        { q: tr[offset++], a: tr[offset + 2] }
      ];

      const data = generateLayoutData(t, layoutConfig);
      fs.writeFileSync(path.join(targetToolDir, `${lang}.json`), JSON.stringify(data, null, 2), 'utf8');
      
      // Delay to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log('✅ Done translating all tools to 30 languages!');
}

function generateLayoutData(t, layoutConfig) {
  return {
    title: t.title,
    h1: t.h1,
    description: t.description,
    sections: [
      {
        type: layoutConfig[0],
        title: t.heroTitle,
        content: t.heroContent,
        badgeText: t.heroBadge
      },
      {
        type: layoutConfig[1],
        title: t.howToTitle,
        badgeText: t.howToBadge,
        steps: [
          { title: t.step1Title, description: t.step1Desc },
          { title: t.step2Title, description: t.step2Desc },
          { title: t.step3Title, description: t.step3Desc }
        ]
      },
      {
        type: layoutConfig[2],
        title: t.geoTitle,
        content: t.geoContent,
        subTitle: t.geoSubTitle,
        subContent: t.geoSubContent,
        badgeText: t.geoSubTitle
      },
      {
        type: layoutConfig[3],
        title: t.privacyTitle,
        content: t.privacyContent
      },
      {
        type: layoutConfig[4],
        title: t.perfTitle,
        content: t.perfContent,
        badgeText: t.perfBadge
      }
    ],
    faqs: t.faqs,
    badges: t.badges,
    stats: ["Client-Side", "Fast", "Secure", "Private"],
    buttonText: t.buttonText,
    supportCenter: t.supportCenter,
    faqTitle: t.faqTitle
  };
}

run();

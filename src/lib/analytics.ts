/**
 * analytics.ts
 * Centralized GA4 Custom Event Tracking for HandleMyFile
 * 
 * GA4 Measurement ID: G-MQEME9ME2B
 * 
 * Events fired:
 * - tool_started       : When user clicks Apply/Process
 * - tool_completed     : When WASM finishes successfully
 * - tool_failed        : When WASM throws an error
 * - file_downloaded    : When user clicks Download button
 * - page_navigated     : When user navigates to a static page
 * - tool_page_viewed   : When user opens a specific tool
 * - language_switched  : When user changes UI language
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Safely fires a GA4 custom event. No-ops if gtag is unavailable.
function fireEvent(eventName: string, params: Record<string, string | number | boolean>) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...params,
        send_to: 'G-MQEME9ME2B',
      });
    }
  } catch (_) {
    // Silently fail — analytics must never crash the app
  }
}

// ─────────────────────────────────────────────────────────────
// TOOL LIFECYCLE EVENTS
// ─────────────────────────────────────────────────────────────

/**
 * Fired when user clicks "Apply" / "Process" on any tool.
 * Tells GA4: which tool was used, which engine (WASM), language, and file details.
 */
export function trackToolStarted(params: {
  tool_id: string;
  tool_category: string;
  engine_type: string; // 'pdf', 'office', 'image', 'ocr', 'compress', 'sign'
  file_count: number;
  file_size_kb: number;
  language: string;
}) {
  fireEvent('tool_started', {
    tool_id: params.tool_id,
    tool_category: params.tool_category,
    engine_type: params.engine_type,
    file_count: params.file_count,
    file_size_kb: Math.round(params.file_size_kb),
    language: params.language,
    // GEO signal: tell GA4 this is an in-browser (client-side) processing event
    processing_location: 'client_wasm',
  });
}

/**
 * Fired when the WASM processing finishes successfully.
 * Includes processing duration for performance insights.
 */
export function trackToolCompleted(params: {
  tool_id: string;
  tool_category: string;
  engine_type: string;
  duration_ms: number;
  output_size_kb: number;
  language: string;
}) {
  fireEvent('tool_completed', {
    tool_id: params.tool_id,
    tool_category: params.tool_category,
    engine_type: params.engine_type,
    duration_ms: Math.round(params.duration_ms),
    output_size_kb: Math.round(params.output_size_kb),
    language: params.language,
    processing_location: 'client_wasm',
  });
}

/**
 * Fired when a WASM operation fails.
 * Helps identify which tools have the most errors.
 */
export function trackToolFailed(params: {
  tool_id: string;
  tool_category: string;
  error_message: string;
  language: string;
}) {
  fireEvent('tool_failed', {
    tool_id: params.tool_id,
    tool_category: params.tool_category,
    // Truncate error message to 100 chars to avoid hitting GA4 param limits
    error_message: params.error_message.substring(0, 100),
    language: params.language,
  });
}

// ─────────────────────────────────────────────────────────────
// DOWNLOAD EVENT
// ─────────────────────────────────────────────────────────────

/**
 * Fired when user downloads the processed output file.
 * This is the most important SEO conversion signal.
 */
export function trackFileDownloaded(params: {
  tool_id: string;
  filename: string;
  file_type: string;
  file_size_kb: number;
  language: string;
}) {
  fireEvent('file_downloaded', {
    tool_id: params.tool_id,
    filename: params.filename.substring(0, 100),
    file_type: params.file_type,
    file_size_kb: Math.round(params.file_size_kb),
    language: params.language,
    // GA4 treats 'file_download' as an enhanced measurement event.
    // Firing our own lets us track blob URL downloads GA4 misses.
  });
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION & UX EVENTS (SEO/GEO SIGNALS)
// ─────────────────────────────────────────────────────────────

/**
 * Fired when user navigates to a tool page (opens tool sidebar).
 * Equivalent of a "page_view" for tool pages — key for SEO.
 */
export function trackToolPageViewed(params: {
  tool_id: string;
  tool_category: string;
  language: string;
  slug: string;
}) {
  fireEvent('tool_page_viewed', {
    tool_id: params.tool_id,
    tool_category: params.tool_category,
    language: params.language,
    page_slug: params.slug,
  });
}

/**
 * Fired when user navigates to a static page (About, Privacy, Pricing, etc.)
 */
export function trackPageNavigated(params: {
  page_slug: string;
  language: string;
}) {
  fireEvent('page_navigated', {
    page_slug: params.page_slug,
    language: params.language,
  });
}

/**
 * Fired when user changes the UI language.
 * Powerful GEO signal: tells GA4 which markets are using the product.
 */
export function trackLanguageSwitched(params: {
  from_language: string;
  to_language: string;
}) {
  fireEvent('language_switched', {
    from_language: params.from_language,
    to_language: params.to_language,
  });
}

/**
 * Derives the engine type string from a tool ID.
 * Used internally to populate the `engine_type` param.
 */
export function getEngineTypeFromToolId(toolId: string, toolCategory: string): string {
  if (toolId === 'ocr-pdf') return 'tesseract_wasm';
  if (toolId === 'sign-pdf') return 'node_forge_pdf';
  if (toolId === 'compress-pdf') return 'compress_wasm';
  if (toolId === 'pdf-to-word' || toolId === 'word-to-pdf') return 'office_wasm';
  if (toolCategory === 'office') return 'office_wasm';
  if (toolCategory === 'image') return 'image_wasm';
  if (toolCategory === 'pdf') return 'pdf_lib_wasm';
  return 'wasm';
}

/**
 * SECTION COMPONENT REGISTRY
 * ─────────────────────────────────────────────────────────
 * ARCHITECTURE: Per-tool unique sections (NO shared group templates)
 *
 * Each tool has its own unique prefix + 5 section components:
 *   hero_features | how_to_steps | geo_targeting | privacy_security | performance
 *
 * To add a new tool:
 *   1. Create src/components/seo-sections/tools/MyToolSections.tsx
 *   2. Add 5 entries here with your_tool_* prefix
 *   3. Use your_tool_* in the JSON section type field
 *   4. Done — SeoRichSections.tsx needs ZERO changes.
 *
 * SHARED (legacy merge/compress only — strip prefix before lookup):
 *   hero_features | how_to_steps | geo_targeting | privacy_security | performance
 *
 * PER-TOOL (each totally unique):
 *   protect_*   unlock_*   redact_*   sign_*   metadata_*
 *   split_*     combiner_* transform_* organizer_*
 * ─────────────────────────────────────────────────────────
 */
import React from 'react';
import type { SectionProps } from './types';

// ── Existing shared sections (merge/compress use these via prefix strip) ──
import { HeroFeaturesSection } from './HeroFeaturesSection';
import { HowToStepsSection } from './HowToStepsSection';
import { GeoTargetingSection } from './GeoTargetingSection';
import { PrivacySecuritySection } from './PrivacySecuritySection';
import { PerformanceSection } from './PerformanceSection';



// ── Group A — Combiner (Blue/Indigo -> Rose/Purple) ──
import { WordToPdfHeroSection, WordToPdfHowToSection, WordToPdfGeoSection, WordToPdfPrivacySection, WordToPdfPerformanceSection } from './tools/WordToPdfSections';
import { ExcelToPdfHeroSection, ExcelToPdfHowToSection, ExcelToPdfGeoSection, ExcelToPdfPrivacySection, ExcelToPdfPerformanceSection } from './tools/ExcelToPdfSections';
import { PptToPdfHeroSection, PptToPdfHowToSection, PptToPdfGeoSection, PptToPdfPrivacySection, PptToPdfPerformanceSection } from './tools/PptToPdfSections';
import { ImageToPdfHeroSection, ImageToPdfHowToSection, ImageToPdfGeoSection, ImageToPdfPrivacySection, ImageToPdfPerformanceSection } from './tools/ImageToPdfSections';
import { TxtToPdfHeroSection, TxtToPdfHowToSection, TxtToPdfGeoSection, TxtToPdfPrivacySection, TxtToPdfPerformanceSection } from './tools/TxtToPdfSections';

// ── Security — PER-TOOL unique (each totally different design) ──
import { ProtectHeroSection, ProtectHowToSection, ProtectGeoSection, ProtectPrivacySection, ProtectPerformanceSection } from './tools/ProtectPdfSections';
import { UnlockHeroSection, UnlockHowToSection, UnlockGeoSection, UnlockPrivacySection, UnlockPerformanceSection } from './tools/UnlockPdfSections';
import { RedactHeroSection, RedactHowToSection, RedactGeoSection, RedactPrivacySection, RedactPerformanceSection } from './tools/RedactPdfSections';
import { SignHeroSection, SignHowToSection, SignGeoSection, SignPrivacySection, SignPerformanceSection } from './tools/SignPdfSections';
import { MetadataHeroSection, MetadataHowToSection, MetadataGeoSection, MetadataPrivacySection, MetadataPerformanceSection } from './tools/RemoveMetadataSections';

// ── Group D — Transformer (Unique Designs) ──
import { RotateHeroSection, RotateHowToSection, RotateGeoSection, RotatePrivacySection, RotatePerformanceSection } from './tools/RotatePdfSections';
import { WatermarkHeroSection, WatermarkHowToSection, WatermarkGeoSection, WatermarkPrivacySection, WatermarkPerformanceSection } from './tools/WatermarkPdfSections';
import { GrayscaleHeroSection, GrayscaleHowToSection, GrayscaleGeoSection, GrayscalePrivacySection, GrayscalePerformanceSection } from './tools/GrayscalePdfSections';
import { ReverseHeroSection, ReverseHowToSection, ReverseGeoSection, ReversePrivacySection, ReversePerformanceSection } from './tools/ReversePdfSections';
import { ResizeHeroSection, ResizeHowToSection, ResizeGeoSection, ResizePrivacySection, ResizePerformanceSection } from './tools/ResizePdfSections';
// ── Group E — Organizer (Unique Designs) ──
import { PageNumbersHeroSection, PageNumbersHowToSection, PageNumbersGeoSection, PageNumbersPrivacySection, PageNumbersPerformanceSection } from './tools/PageNumbersSections';
import { OrganizeHeroSection, OrganizeHowToSection, OrganizeGeoSection, OrganizePrivacySection, OrganizePerformanceSection } from './tools/OrganizePdfSections';
import { ScanHeroSection, ScanHowToSection, ScanGeoSection, ScanPrivacySection, ScanPerformanceSection } from './tools/ScanToPdfSections';
import { OcrHeroSection, OcrHowToSection, OcrGeoSection, OcrPrivacySection, OcrPerformanceSection } from './tools/OcrPdfSections';
import { CompareHeroSection, CompareHowToSection, CompareGeoSection, ComparePrivacySection, ComparePerformanceSection } from './tools/ComparePdfSections';
import { CsvToExcelHeroSection, CsvToExcelHowToSection, CsvToExcelGeoSection, CsvToExcelPrivacySection, CsvToExcelPerformanceSection } from './tools/CsvToExcelSections';
import { ExcelToCsvHeroSection, ExcelToCsvHowToSection, ExcelToCsvGeoSection, ExcelToCsvPrivacySection, ExcelToCsvPerformanceSection } from './tools/ExcelToCsvSections';

// ── Legacy Decoupled (Merge, Compress, Split, Crop, dll.) ──
import { MergeHeroSection, MergeHowToSection, MergeGeoSection, MergePrivacySection, MergePerformanceSection } from './tools/MergePdfSections';
import { CompressHeroSection, CompressHowToSection, CompressGeoSection, CompressPrivacySection, CompressPerformanceSection } from './tools/CompressPdfSections';
import { SplitHeroSection, SplitHowToSection, SplitGeoSection, SplitPrivacySection, SplitPerformanceSection } from './tools/SplitPdfSections';
import { CropHeroSection, CropHowToSection, CropGeoSection, CropPrivacySection, CropPerformanceSection } from './tools/CropPdfSections';
import { RemoveHeroSection, RemoveHowToSection, RemoveGeoSection, RemovePrivacySection, RemovePerformanceSection } from './tools/RemovePdfSections';
import { PdfToImageHeroSection, PdfToImageHowToSection, PdfToImageGeoSection, PdfToImagePrivacySection, PdfToImagePerformanceSection } from './tools/PdfToImageSections';
import { ExtractImagesHeroSection, ExtractImagesHowToSection, ExtractImagesGeoSection, ExtractImagesPrivacySection, ExtractImagesPerformanceSection } from './tools/ExtractImagesSections';
import { EditHeroSection, EditHowToSection, EditGeoSection, EditPrivacySection, EditPerformanceSection } from './tools/EditPdfSections';

type SectionComponent = React.FC<SectionProps>;

export const SECTION_REGISTRY: Record<string, SectionComponent> = {
  // ── Decoupled Legacy Tools ──
  merge_hero_features: MergeHeroSection,
  merge_how_to_steps: MergeHowToSection,
  merge_geo_targeting: MergeGeoSection,
  merge_privacy_security: MergePrivacySection,
  merge_performance: MergePerformanceSection,

  compress_hero_features: CompressHeroSection,
  compress_how_to_steps: CompressHowToSection,
  compress_geo_targeting: CompressGeoSection,
  compress_privacy_security: CompressPrivacySection,
  compress_performance: CompressPerformanceSection,

  split_hero_features: SplitHeroSection,
  split_how_to_steps: SplitHowToSection,
  split_geo_targeting: SplitGeoSection,
  split_privacy_security: SplitPrivacySection,
  split_performance: SplitPerformanceSection,
  
  crop_hero_features: CropHeroSection,
  crop_how_to_steps: CropHowToSection,
  crop_geo_targeting: CropGeoSection,
  crop_privacy_security: CropPrivacySection,
  crop_performance: CropPerformanceSection,

  remove_hero_features: RemoveHeroSection,
  remove_how_to_steps: RemoveHowToSection,
  remove_geo_targeting: RemoveGeoSection,
  remove_privacy_security: RemovePrivacySection,
  remove_performance: RemovePerformanceSection,

  pdf_image_hero_features: PdfToImageHeroSection,
  pdf_image_how_to_steps: PdfToImageHowToSection,
  pdf_image_geo_targeting: PdfToImageGeoSection,
  pdf_image_privacy_security: PdfToImagePrivacySection,
  pdf_image_performance: PdfToImagePerformanceSection,

  extract_images_hero_features: ExtractImagesHeroSection,
  extract_images_how_to_steps: ExtractImagesHowToSection,
  extract_images_geo_targeting: ExtractImagesGeoSection,
  extract_images_privacy_security: ExtractImagesPrivacySection,
  extract_images_performance: ExtractImagesPerformanceSection,

  // ── Generic Fallback (Just in case) ──
  hero_features: HeroFeaturesSection,
  how_to_steps: HowToStepsSection,
  geo_targeting: GeoTargetingSection,
  privacy_security: PrivacySecuritySection,
  performance: PerformanceSection,

  // ── Group A — Combiner: word-to-pdf, excel-to-pdf, image-to-pdf, txt-to-pdf ──
  word_hero_features: WordToPdfHeroSection,
  word_how_to_steps: WordToPdfHowToSection,
  word_geo_targeting: WordToPdfGeoSection,
  word_privacy_security: WordToPdfPrivacySection,
  word_performance: WordToPdfPerformanceSection,

  excel_hero_features: ExcelToPdfHeroSection,
  excel_how_to_steps: ExcelToPdfHowToSection,
  excel_geo_targeting: ExcelToPdfGeoSection,
  excel_privacy_security: ExcelToPdfPrivacySection,
  excel_performance: ExcelToPdfPerformanceSection,

  ppt_hero_features: PptToPdfHeroSection,
  ppt_how_to_steps: PptToPdfHowToSection,
  ppt_geo_targeting: PptToPdfGeoSection,
  ppt_privacy_security: PptToPdfPrivacySection,
  ppt_performance: PptToPdfPerformanceSection,

  image_hero_features: ImageToPdfHeroSection,
  image_how_to_steps: ImageToPdfHowToSection,
  image_geo_targeting: ImageToPdfGeoSection,
  image_privacy_security: ImageToPdfPrivacySection,
  image_performance: ImageToPdfPerformanceSection,

  txt_hero_features: TxtToPdfHeroSection,
  txt_how_to_steps: TxtToPdfHowToSection,
  txt_geo_targeting: TxtToPdfGeoSection,
  txt_privacy_security: TxtToPdfPrivacySection,
  txt_performance: TxtToPdfPerformanceSection,

  // ── Security — protect-pdf (Dark Green + Gold, Vault) ──
  protect_hero_features: ProtectHeroSection,
  protect_how_to_steps: ProtectHowToSection,
  protect_geo_targeting: ProtectGeoSection,
  protect_privacy_security: ProtectPrivacySection,
  protect_performance: ProtectPerformanceSection,

  // ── Security — unlock-pdf (Amber, Key/Open) ──
  unlock_hero_features: UnlockHeroSection,
  unlock_how_to_steps: UnlockHowToSection,
  unlock_geo_targeting: UnlockGeoSection,
  unlock_privacy_security: UnlockPrivacySection,
  unlock_performance: UnlockPerformanceSection,

  // ── Security — redact-pdf (Noir Black + Red, Classified) ──
  redact_hero_features: RedactHeroSection,
  redact_how_to_steps: RedactHowToSection,
  redact_geo_targeting: RedactGeoSection,
  redact_privacy_security: RedactPrivacySection,
  redact_performance: RedactPerformanceSection,

  // ── Security — sign-pdf (Deep Blue + Purple, Signature) ──
  sign_hero_features: SignHeroSection,
  sign_how_to_steps: SignHowToSection,
  sign_geo_targeting: SignGeoSection,
  sign_privacy_security: SignPrivacySection,
  sign_performance: SignPerformanceSection,

  // ── Security — remove-pdf-metadata (Slate + Cyan, Cleanse) ──
  metadata_hero_features: MetadataHeroSection,
  metadata_how_to_steps: MetadataHowToSection,
  metadata_geo_targeting: MetadataGeoSection,
  metadata_privacy_security: MetadataPrivacySection,
  metadata_performance: MetadataPerformanceSection,

  // ── Group D — Transformer: Unique Prefixes ──
  rotate_hero_features: RotateHeroSection,
  rotate_how_to_steps: RotateHowToSection,
  rotate_geo_targeting: RotateGeoSection,
  rotate_privacy_security: RotatePrivacySection,
  rotate_performance: RotatePerformanceSection,

  watermark_hero_features: WatermarkHeroSection,
  watermark_how_to_steps: WatermarkHowToSection,
  watermark_geo_targeting: WatermarkGeoSection,
  watermark_privacy_security: WatermarkPrivacySection,
  watermark_performance: WatermarkPerformanceSection,

  grayscale_hero_features: GrayscaleHeroSection,
  grayscale_how_to_steps: GrayscaleHowToSection,
  grayscale_geo_targeting: GrayscaleGeoSection,
  grayscale_privacy_security: GrayscalePrivacySection,
  grayscale_performance: GrayscalePerformanceSection,

  reverse_hero_features: ReverseHeroSection,
  reverse_how_to_steps: ReverseHowToSection,
  reverse_geo_targeting: ReverseGeoSection,
  reverse_privacy_security: ReversePrivacySection,
  reverse_performance: ReversePerformanceSection,

  resize_hero_features: ResizeHeroSection,
  resize_how_to_steps: ResizeHowToSection,
  resize_geo_targeting: ResizeGeoSection,
  resize_privacy_security: ResizePrivacySection,
  resize_performance: ResizePerformanceSection,

  // ── Group E — Organizer: Unique Prefixes ──
  pagenum_hero_features: PageNumbersHeroSection,
  pagenum_how_to_steps: PageNumbersHowToSection,
  pagenum_geo_targeting: PageNumbersGeoSection,
  pagenum_privacy_security: PageNumbersPrivacySection,
  pagenum_performance: PageNumbersPerformanceSection,

  organize_hero_features: OrganizeHeroSection,
  organize_how_to_steps: OrganizeHowToSection,
  organize_geo_targeting: OrganizeGeoSection,
  organize_privacy_security: OrganizePrivacySection,
  organize_performance: OrganizePerformanceSection,

  scan_hero_features: ScanHeroSection,
  scan_how_to_steps: ScanHowToSection,
  scan_geo_targeting: ScanGeoSection,
  scan_privacy_security: ScanPrivacySection,
  scan_performance: ScanPerformanceSection,

  ocr_hero_features: OcrHeroSection,
  ocr_how_to_steps: OcrHowToSection,
  ocr_geo_targeting: OcrGeoSection,
  ocr_privacy_security: OcrPrivacySection,
  ocr_performance: OcrPerformanceSection,

  compare_hero_features: CompareHeroSection,
  compare_how_to_steps: CompareHowToSection,
  compare_geo_targeting: CompareGeoSection,
  compare_privacy_security: ComparePrivacySection,
  compare_performance: ComparePerformanceSection,

  edit_hero_features: EditHeroSection,
  edit_how_to_steps: EditHowToSection,
  edit_geo_targeting: EditGeoSection,
  edit_privacy_security: EditPrivacySection,
  edit_performance: EditPerformanceSection,

  csv_excel_hero_features: CsvToExcelHeroSection,
  csv_excel_how_to_steps: CsvToExcelHowToSection,
  csv_excel_geo_targeting: CsvToExcelGeoSection,
  csv_excel_privacy_security: CsvToExcelPrivacySection,
  csv_excel_performance: CsvToExcelPerformanceSection,

  excel_csv_hero_features: ExcelToCsvHeroSection,
  excel_csv_how_to_steps: ExcelToCsvHowToSection,
  excel_csv_geo_targeting: ExcelToCsvGeoSection,
  excel_csv_privacy_security: ExcelToCsvPrivacySection,
  excel_csv_performance: ExcelToCsvPerformanceSection,
};

/** No prefix stripping needed since every tool has a unique prefix mapping */
export const resolveType = (rawType: string): string => rawType;

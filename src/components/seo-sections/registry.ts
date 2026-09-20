/**
 * SECTION COMPONENT REGISTRY (Lazy Loaded)
 * ─────────────────────────────────────────────────────────
 * ARCHITECTURE: Per-tool unique sections dynamically loaded on-demand.
 * Zero bundle bloat for the initial page load.
 * ─────────────────────────────────────────────────────────
 */
import React from 'react';
import type { SectionProps } from './types';

type SectionComponent = React.ComponentType<SectionProps>;

const lazy = (importer: () => Promise<any>, exportName: string): SectionComponent => {
  return React.lazy(() => importer().then(mod => ({ default: mod[exportName] })));
};

// ── Shared Decoupled Legacy Sections ──
const importShared = () => import('./HeroFeaturesSection');
const importHowTo = () => import('./HowToStepsSection');
const importGeo = () => import('./GeoTargetingSection');
const importPrivacy = () => import('./PrivacySecuritySection');
const importPerf = () => import('./PerformanceSection');

const HeroFeaturesSection = lazy(importShared, 'HeroFeaturesSection');
const HowToStepsSection = lazy(importHowTo, 'HowToStepsSection');
const GeoTargetingSection = lazy(importGeo, 'GeoTargetingSection');
const PrivacySecuritySection = lazy(importPrivacy, 'PrivacySecuritySection');
const PerformanceSection = lazy(importPerf, 'PerformanceSection');

// ── Per-Tool Section Importers ──
const importWord = () => import('./tools/WordToPdfSections');
const importExcel = () => import('./tools/ExcelToPdfSections');
const importPpt = () => import('./tools/PptToPdfSections');
const importImage = () => import('./tools/ImageToPdfSections');
const importTxt = () => import('./tools/TxtToPdfSections');

const importProtect = () => import('./tools/ProtectPdfSections');
const importUnlock = () => import('./tools/UnlockPdfSections');
const importRedact = () => import('./tools/RedactPdfSections');
const importSign = () => import('./tools/SignPdfSections');
const importMetadata = () => import('./tools/RemoveMetadataSections');

const importRotate = () => import('./tools/RotatePdfSections');
const importWatermark = () => import('./tools/WatermarkPdfSections');
const importGrayscale = () => import('./tools/GrayscalePdfSections');
const importReverse = () => import('./tools/ReversePdfSections');
const importResize = () => import('./tools/ResizePdfSections');

const importPageNumbers = () => import('./tools/PageNumbersSections');
const importOrganize = () => import('./tools/OrganizePdfSections');
const importScan = () => import('./tools/ScanToPdfSections');
const importOcr = () => import('./tools/OcrPdfSections');
const importCompare = () => import('./tools/ComparePdfSections');
const importCsvToExcel = () => import('./tools/CsvToExcelSections');
const importExcelToCsv = () => import('./tools/ExcelToCsvSections');

const importMerge = () => import('./tools/MergePdfSections');
const importCompress = () => import('./tools/CompressPdfSections');
const importSplit = () => import('./tools/SplitPdfSections');
const importCrop = () => import('./tools/CropPdfSections');
const importRemove = () => import('./tools/RemovePdfSections');
const importPdfToImage = () => import('./tools/PdfToImageSections');
const importExtractImages = () => import('./tools/ExtractImagesSections');
const importEdit = () => import('./tools/EditPdfSections');
const importLongTail = () => import('./LongTailHowToSections');

export const SECTION_REGISTRY: Record<string, SectionComponent> = {
  // ── Decoupled Legacy Tools ──
  merge_hero_features: lazy(importMerge, 'MergeHeroSection'),
  merge_how_to_steps: lazy(importMerge, 'MergeHowToSection'),
  merge_geo_targeting: lazy(importMerge, 'MergeGeoSection'),
  merge_privacy_security: lazy(importMerge, 'MergePrivacySection'),
  merge_performance: lazy(importMerge, 'MergePerformanceSection'),

  compress_hero_features: lazy(importCompress, 'CompressHeroSection'),
  compress_how_to_steps: lazy(importCompress, 'CompressHowToSection'),
  compress_geo_targeting: lazy(importCompress, 'CompressGeoSection'),
  compress_privacy_security: lazy(importCompress, 'CompressPrivacySection'),
  compress_performance: lazy(importCompress, 'CompressPerformanceSection'),

  split_hero_features: lazy(importSplit, 'SplitHeroSection'),
  split_how_to_steps: lazy(importSplit, 'SplitHowToSection'),
  split_geo_targeting: lazy(importSplit, 'SplitGeoSection'),
  split_privacy_security: lazy(importSplit, 'SplitPrivacySection'),
  split_performance: lazy(importSplit, 'SplitPerformanceSection'),
  
  crop_hero_features: lazy(importCrop, 'CropHeroSection'),
  crop_how_to_steps: lazy(importCrop, 'CropHowToSection'),
  crop_geo_targeting: lazy(importCrop, 'CropGeoSection'),
  crop_privacy_security: lazy(importCrop, 'CropPrivacySection'),
  crop_performance: lazy(importCrop, 'CropPerformanceSection'),

  // ── Long-Tail SEO Tools ──
  lt_crop_margins_how_to_steps: lazy(importLongTail, 'LtCropMarginsHowToSection'),
  lt_grayscale_how_to_steps: lazy(importLongTail, 'LtGrayscaleHowToSection'),
  lt_remove_metadata_how_to_steps: lazy(importLongTail, 'LtRemoveMetadataHowToSection'),
  lt_extract_images_how_to_steps: lazy(importLongTail, 'LtExtractImagesHowToSection'),
  lt_compare_pdf_how_to_steps: lazy(importLongTail, 'LtComparePdfHowToSection'),

  remove_hero_features: lazy(importRemove, 'RemoveHeroSection'),
  remove_how_to_steps: lazy(importRemove, 'RemoveHowToSection'),
  remove_geo_targeting: lazy(importRemove, 'RemoveGeoSection'),
  remove_privacy_security: lazy(importRemove, 'RemovePrivacySection'),
  remove_performance: lazy(importRemove, 'RemovePerformanceSection'),

  pdf_image_hero_features: lazy(importPdfToImage, 'PdfToImageHeroSection'),
  pdf_image_how_to_steps: lazy(importPdfToImage, 'PdfToImageHowToSection'),
  pdf_image_geo_targeting: lazy(importPdfToImage, 'PdfToImageGeoSection'),
  pdf_image_privacy_security: lazy(importPdfToImage, 'PdfToImagePrivacySection'),
  pdf_image_performance: lazy(importPdfToImage, 'PdfToImagePerformanceSection'),

  extract_images_hero_features: lazy(importExtractImages, 'ExtractImagesHeroSection'),
  extract_images_how_to_steps: lazy(importExtractImages, 'ExtractImagesHowToSection'),
  extract_images_geo_targeting: lazy(importExtractImages, 'ExtractImagesGeoSection'),
  extract_images_privacy_security: lazy(importExtractImages, 'ExtractImagesPrivacySection'),
  extract_images_performance: lazy(importExtractImages, 'ExtractImagesPerformanceSection'),

  // ── Generic Fallback ──
  hero_features: HeroFeaturesSection,
  how_to_steps: HowToStepsSection,
  geo_targeting: GeoTargetingSection,
  privacy_security: PrivacySecuritySection,
  performance: PerformanceSection,

  // ── Group A — Combiner ──
  word_hero_features: lazy(importWord, 'WordToPdfHeroSection'),
  word_how_to_steps: lazy(importWord, 'WordToPdfHowToSection'),
  word_geo_targeting: lazy(importWord, 'WordToPdfGeoSection'),
  word_privacy_security: lazy(importWord, 'WordToPdfPrivacySection'),
  word_performance: lazy(importWord, 'WordToPdfPerformanceSection'),

  excel_hero_features: lazy(importExcel, 'ExcelToPdfHeroSection'),
  excel_how_to_steps: lazy(importExcel, 'ExcelToPdfHowToSection'),
  excel_geo_targeting: lazy(importExcel, 'ExcelToPdfGeoSection'),
  excel_privacy_security: lazy(importExcel, 'ExcelToPdfPrivacySection'),
  excel_performance: lazy(importExcel, 'ExcelToPdfPerformanceSection'),

  ppt_hero_features: lazy(importPpt, 'PptToPdfHeroSection'),
  ppt_how_to_steps: lazy(importPpt, 'PptToPdfHowToSection'),
  ppt_geo_targeting: lazy(importPpt, 'PptToPdfGeoSection'),
  ppt_privacy_security: lazy(importPpt, 'PptToPdfPrivacySection'),
  ppt_performance: lazy(importPpt, 'PptToPdfPerformanceSection'),

  image_hero_features: lazy(importImage, 'ImageToPdfHeroSection'),
  image_how_to_steps: lazy(importImage, 'ImageToPdfHowToSection'),
  image_geo_targeting: lazy(importImage, 'ImageToPdfGeoSection'),
  image_privacy_security: lazy(importImage, 'ImageToPdfPrivacySection'),
  image_performance: lazy(importImage, 'ImageToPdfPerformanceSection'),

  txt_hero_features: lazy(importTxt, 'TxtToPdfHeroSection'),
  txt_how_to_steps: lazy(importTxt, 'TxtToPdfHowToSection'),
  txt_geo_targeting: lazy(importTxt, 'TxtToPdfGeoSection'),
  txt_privacy_security: lazy(importTxt, 'TxtToPdfPrivacySection'),
  txt_performance: lazy(importTxt, 'TxtToPdfPerformanceSection'),

  // ── Security ──
  protect_hero_features: lazy(importProtect, 'ProtectHeroSection'),
  protect_how_to_steps: lazy(importProtect, 'ProtectHowToSection'),
  protect_geo_targeting: lazy(importProtect, 'ProtectGeoSection'),
  protect_privacy_security: lazy(importProtect, 'ProtectPrivacySection'),
  protect_performance: lazy(importProtect, 'ProtectPerformanceSection'),

  unlock_hero_features: lazy(importUnlock, 'UnlockHeroSection'),
  unlock_how_to_steps: lazy(importUnlock, 'UnlockHowToSection'),
  unlock_geo_targeting: lazy(importUnlock, 'UnlockGeoSection'),
  unlock_privacy_security: lazy(importUnlock, 'UnlockPrivacySection'),
  unlock_performance: lazy(importUnlock, 'UnlockPerformanceSection'),

  redact_hero_features: lazy(importRedact, 'RedactHeroSection'),
  redact_how_to_steps: lazy(importRedact, 'RedactHowToSection'),
  redact_geo_targeting: lazy(importRedact, 'RedactGeoSection'),
  redact_privacy_security: lazy(importRedact, 'RedactPrivacySection'),
  redact_performance: lazy(importRedact, 'RedactPerformanceSection'),

  sign_hero_features: lazy(importSign, 'SignHeroSection'),
  sign_how_to_steps: lazy(importSign, 'SignHowToSection'),
  sign_geo_targeting: lazy(importSign, 'SignGeoSection'),
  sign_privacy_security: lazy(importSign, 'SignPrivacySection'),
  sign_performance: lazy(importSign, 'SignPerformanceSection'),

  metadata_hero_features: lazy(importMetadata, 'MetadataHeroSection'),
  metadata_how_to_steps: lazy(importMetadata, 'MetadataHowToSection'),
  metadata_geo_targeting: lazy(importMetadata, 'MetadataGeoSection'),
  metadata_privacy_security: lazy(importMetadata, 'MetadataPrivacySection'),
  metadata_performance: lazy(importMetadata, 'MetadataPerformanceSection'),

  // ── Group D — Transformer ──
  rotate_hero_features: lazy(importRotate, 'RotateHeroSection'),
  rotate_how_to_steps: lazy(importRotate, 'RotateHowToSection'),
  rotate_geo_targeting: lazy(importRotate, 'RotateGeoSection'),
  rotate_privacy_security: lazy(importRotate, 'RotatePrivacySection'),
  rotate_performance: lazy(importRotate, 'RotatePerformanceSection'),

  watermark_hero_features: lazy(importWatermark, 'WatermarkHeroSection'),
  watermark_how_to_steps: lazy(importWatermark, 'WatermarkHowToSection'),
  watermark_geo_targeting: lazy(importWatermark, 'WatermarkGeoSection'),
  watermark_privacy_security: lazy(importWatermark, 'WatermarkPrivacySection'),
  watermark_performance: lazy(importWatermark, 'WatermarkPerformanceSection'),

  grayscale_hero_features: lazy(importGrayscale, 'GrayscaleHeroSection'),
  grayscale_how_to_steps: lazy(importGrayscale, 'GrayscaleHowToSection'),
  grayscale_geo_targeting: lazy(importGrayscale, 'GrayscaleGeoSection'),
  grayscale_privacy_security: lazy(importGrayscale, 'GrayscalePrivacySection'),
  grayscale_performance: lazy(importGrayscale, 'GrayscalePerformanceSection'),

  reverse_hero_features: lazy(importReverse, 'ReverseHeroSection'),
  reverse_how_to_steps: lazy(importReverse, 'ReverseHowToSection'),
  reverse_geo_targeting: lazy(importReverse, 'ReverseGeoSection'),
  reverse_privacy_security: lazy(importReverse, 'ReversePrivacySection'),
  reverse_performance: lazy(importReverse, 'ReversePerformanceSection'),

  resize_hero_features: lazy(importResize, 'ResizeHeroSection'),
  resize_how_to_steps: lazy(importResize, 'ResizeHowToSection'),
  resize_geo_targeting: lazy(importResize, 'ResizeGeoSection'),
  resize_privacy_security: lazy(importResize, 'ResizePrivacySection'),
  resize_performance: lazy(importResize, 'ResizePerformanceSection'),

  // ── Group E — Organizer ──
  pagenum_hero_features: lazy(importPageNumbers, 'PageNumbersHeroSection'),
  pagenum_how_to_steps: lazy(importPageNumbers, 'PageNumbersHowToSection'),
  pagenum_geo_targeting: lazy(importPageNumbers, 'PageNumbersGeoSection'),
  pagenum_privacy_security: lazy(importPageNumbers, 'PageNumbersPrivacySection'),
  pagenum_performance: lazy(importPageNumbers, 'PageNumbersPerformanceSection'),

  organize_hero_features: lazy(importOrganize, 'OrganizeHeroSection'),
  organize_how_to_steps: lazy(importOrganize, 'OrganizeHowToSection'),
  organize_geo_targeting: lazy(importOrganize, 'OrganizeGeoSection'),
  organize_privacy_security: lazy(importOrganize, 'OrganizePrivacySection'),
  organize_performance: lazy(importOrganize, 'OrganizePerformanceSection'),

  scan_hero_features: lazy(importScan, 'ScanHeroSection'),
  scan_how_to_steps: lazy(importScan, 'ScanHowToSection'),
  scan_geo_targeting: lazy(importScan, 'ScanGeoSection'),
  scan_privacy_security: lazy(importScan, 'ScanPrivacySection'),
  scan_performance: lazy(importScan, 'ScanPerformanceSection'),

  ocr_hero_features: lazy(importOcr, 'OcrHeroSection'),
  ocr_how_to_steps: lazy(importOcr, 'OcrHowToSection'),
  ocr_geo_targeting: lazy(importOcr, 'OcrGeoSection'),
  ocr_privacy_security: lazy(importOcr, 'OcrPrivacySection'),
  ocr_performance: lazy(importOcr, 'OcrPerformanceSection'),

  compare_hero_features: lazy(importCompare, 'CompareHeroSection'),
  compare_how_to_steps: lazy(importCompare, 'CompareHowToSection'),
  compare_geo_targeting: lazy(importCompare, 'CompareGeoSection'),
  compare_privacy_security: lazy(importCompare, 'ComparePrivacySection'),
  compare_performance: lazy(importCompare, 'ComparePerformanceSection'),

  edit_hero_features: lazy(importEdit, 'EditHeroSection'),
  edit_how_to_steps: lazy(importEdit, 'EditHowToSection'),
  edit_geo_targeting: lazy(importEdit, 'EditGeoSection'),
  edit_privacy_security: lazy(importEdit, 'EditPrivacySection'),
  edit_performance: lazy(importEdit, 'EditPerformanceSection'),

  csv_excel_hero_features: lazy(importCsvToExcel, 'CsvToExcelHeroSection'),
  csv_excel_how_to_steps: lazy(importCsvToExcel, 'CsvToExcelHowToSection'),
  csv_excel_geo_targeting: lazy(importCsvToExcel, 'CsvToExcelGeoSection'),
  csv_excel_privacy_security: lazy(importCsvToExcel, 'CsvToExcelPrivacySection'),
  csv_excel_performance: lazy(importCsvToExcel, 'CsvToExcelPerformanceSection'),

  excel_csv_hero_features: lazy(importExcelToCsv, 'ExcelToCsvHeroSection'),
  excel_csv_how_to_steps: lazy(importExcelToCsv, 'ExcelToCsvHowToSection'),
  excel_csv_geo_targeting: lazy(importExcelToCsv, 'ExcelToCsvGeoSection'),
  excel_csv_privacy_security: lazy(importExcelToCsv, 'ExcelToCsvPrivacySection'),
  excel_csv_performance: lazy(importExcelToCsv, 'ExcelToCsvPerformanceSection'),

  // ── Long-Tail SEO Pages ──
  crop_margins_hero_features: lazy(importUnlock, 'UnlockHeroSection'),
  crop_margins_how_to_steps: lazy(importSplit, 'SplitHowToSection'),
  crop_margins_geo_targeting: lazy(importImage, 'ImageToPdfGeoSection'),
  crop_margins_privacy_security: lazy(importSign, 'SignPrivacySection'),
  crop_margins_performance: lazy(importWatermark, 'WatermarkPerformanceSection'),

  grayscale_print_hero_features: lazy(importMerge, 'MergeHeroSection'),
  grayscale_print_how_to_steps: lazy(importRedact, 'RedactHowToSection'),
  grayscale_print_geo_targeting: lazy(importExcelToCsv, 'ExcelToCsvGeoSection'),
  grayscale_print_privacy_security: lazy(importCompress, 'CompressPrivacySection'),
  grayscale_print_performance: lazy(importProtect, 'ProtectPerformanceSection'),

  remove_author_hero_features: lazy(importScan, 'ScanHeroSection'),
  remove_author_how_to_steps: lazy(importWord, 'WordToPdfHowToSection'),
  remove_author_geo_targeting: lazy(importResize, 'ResizeGeoSection'),
  remove_author_privacy_security: lazy(importRotate, 'RotatePrivacySection'),
  remove_author_performance: lazy(importOcr, 'OcrPerformanceSection'),

  extract_highres_hero_features: lazy(importCsvToExcel, 'CsvToExcelHeroSection'),
  extract_highres_how_to_steps: lazy(importExtractImages, 'ExtractImagesHowToSection'),
  extract_highres_geo_targeting: lazy(importProtect, 'ProtectGeoSection'),
  extract_highres_privacy_security: lazy(importEdit, 'EditPrivacySection'),
  extract_highres_performance: lazy(importReverse, 'ReversePerformanceSection'),

  compare_visual_hero_features: lazy(importMetadata, 'MetadataHeroSection'),
  compare_visual_how_to_steps: lazy(importOrganize, 'OrganizeHowToSection'),
  compare_visual_geo_targeting: lazy(importPpt, 'PptToPdfGeoSection'),
  compare_visual_privacy_security: lazy(importRemove, 'RemovePrivacySection'),
  compare_visual_performance: lazy(importPageNumbers, 'PageNumbersPerformanceSection'),
};

/** No prefix stripping needed since every tool has a unique prefix mapping */
export const resolveType = (rawType: string): string => rawType;

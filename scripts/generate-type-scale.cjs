/**
 * Utopia Fluid Type Scale Generator
 * Generates mathematically harmonious fluid typography CSS tokens based on utopia-core.
 */
const fs = require('fs');
const path = require('path');
const utopia = require('utopia-core');

// Configuration aligned with Utopia & AGENTS.md Standards
// Min viewport: 360px (Mobile), Max viewport: 1440px (Desktop standard)
const typeScale = utopia.calculateTypeScale({
  minWidth: 360,
  maxWidth: 1440,
  minFontSize: 16,
  maxFontSize: 18,
  minTypeScale: 1.2,    // Minor Third on mobile for comfortable density
  maxTypeScale: 1.25,   // Major Third on desktop for punchy contrast
  negativeSteps: 2,
  positiveSteps: 6,
  prefix: 'step',
  relativeTo: 'viewport'
});

console.log('✅ Generated Utopia Fluid Type Scale:');
typeScale.forEach(item => {
  console.log(`--step-${item.label}: ${item.clamp} /* ${Math.round(item.minFontSize)}px -> ${Math.round(item.maxFontSize)}px */`);
});

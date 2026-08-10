import sharp from 'sharp';
import fs from 'fs';

async function crop() {
  try {
    await sharp('public/logo.png')
      .trim()
      .toFile('public/logo_cropped.png');
    console.log('Cropped logo.png to logo_cropped.png');
    
    await sharp('public/favicon.png')
      .trim()
      .toFile('public/favicon_cropped.png');
    console.log('Cropped favicon.png to favicon_cropped.png');
    
    // Replace originals
    fs.renameSync('public/logo_cropped.png', 'public/logo.png');
    fs.renameSync('public/favicon_cropped.png', 'public/favicon.png');
    console.log('Replaced originals.');
  } catch (err) {
    console.error('Error cropping images:', err);
  }
}

crop();

import fs from 'fs';
import path from 'path';
import https from 'https';

const TESSDATA_DIR = path.join(process.cwd(), 'public', 'tessdata');
const BASE_URL = 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_fast';

const langs = [
  'eng', 'ind', 'spa', 'fra', 'deu', 'jpn', 'por', 'rus', 
  'chi_sim', 'ara', 'hin', 'ita', 'kor', 'nld', 'tur', 'pol', 'vie', 'tha'
];

if (!fs.existsSync(TESSDATA_DIR)) {
  fs.mkdirSync(TESSDATA_DIR, { recursive: true });
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`Skipping (already exists): ${path.basename(dest)}`);
      return resolve();
    }
    
    console.log(`Downloading: ${url}`);
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 302 || response.statusCode === 301) {
        if (response.statusCode === 302 || response.statusCode === 301) {
            return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        fs.unlink(dest, () => reject(new Error(`Failed to download ${url}: ${response.statusCode}`)));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  console.log('Downloading Tessdata Fast models...');
  for (const lang of langs) {
    const filename = `${lang}.traineddata.gz`;
    const url = `${BASE_URL}/${filename}`;
    const dest = path.join(TESSDATA_DIR, filename);
    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`Error downloading ${lang}:`, err.message);
    }
  }
  console.log('Finished downloading Tessdata Fast models.');
}

main();

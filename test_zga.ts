import { PDFDocument } from 'pdf-lib';
import * as Zga from 'zgapdfsigner';
import fs from 'fs';

async function testSign() {
  const pdfBytes = fs.readFileSync('test_in.pdf');
  const p12Bytes = fs.readFileSync('test.p12');
  const imgBytes = fs.readFileSync('test.png');
  
  const sopt = {
    p12cert: p12Bytes,
    pwd: 'password',
    drawinf: {
      area: { x: 50, y: 50, w: 100, h: 100 },
      pageidx: "0",
      imgInfo: { imgData: imgBytes, imgType: "png" }
    }
  };
  
  const signer = new Zga.PdfSigner(sopt);
  const outBytes = await signer.sign(pdfBytes);
  fs.writeFileSync('test_out.pdf', outBytes);
  console.log('done');
}
testSign();

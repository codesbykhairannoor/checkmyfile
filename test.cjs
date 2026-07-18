const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to a common laptop size
  await page.setViewport({ width: 1366, height: 768 });
  
  await page.goto('http://localhost:3020/id/merge-pdf');
  
  // Upload the test.pdf
  const elementHandle = await page.$('input[type=file]');
  await elementHandle.uploadFile('./test.pdf');
  
  // Wait for it to be processed
  await page.waitForTimeout(1000); // Give React time to update state
  
  // Click merge button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Gabungkan')) {
      await btn.click();
      break;
    }
  }
  
  // Wait for result page
  await page.waitForFunction(() => {
    return document.querySelector('.glass-panel') !== null;
  });
  await page.waitForTimeout(1000); // Wait for transition
  
  // Evaluate heights
  const heights = await page.evaluate(() => {
    const main = document.querySelector('main');
    const lp = document.querySelector('.glass-panel');
    return {
      bodyHeight: document.body.clientHeight,
      mainHeight: main.clientHeight,
      mainScrollHeight: main.scrollHeight,
      mainHasOverflow: main.scrollHeight > main.clientHeight,
      lpHeight: lp ? lp.clientHeight : 0,
    };
  });
  
  console.log(heights);
  await browser.close();
})();

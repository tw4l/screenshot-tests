const playwright = require('playwright');
var fs = require('fs');

(async () => {
  const browser = await playwright.chromium.launch();

  const imageDir = "./screenshots";
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }
  
  async function takeScreenshot(browser, url, path) {
    let page = await browser.newPage();
    try {
      await page.setViewportSize({ width: 1920, height: 1080});
      await page.goto(url, {waitUntil: 'load'});
      console.log(`About to take screenshot of ${url}`);
      await page.screenshot({path: path});
      console.log(`Screenshot of ${url} saved to ${path}`);
    } catch (e) {
      console.log(`Error taking screenshot of url ${url}: ${e}`);
    }
  }

  await takeScreenshot(browser, 'https://webrecorder.net/', 'screenshots/webrecorder.png');
  await takeScreenshot(browser, 'https://inkdroid.org/', 'screenshots/inkdroid.png');
  await takeScreenshot(browser, 'https://bitarchivist.net', 'screenshots/bitarchivist.png');
  await takeScreenshot(browser, 'https://bitarchivist.net/about', 'screenshots/bitarchivist-about.png');
  await takeScreenshot(browser, 'https://bitarchivist.net/cv', 'screenshots/bitarchivist-cv.png');
  await takeScreenshot(browser, 'https://bitarchivist.net/projects', 'screenshots/bitarchivist-projects.png');

  await browser.close();
})();

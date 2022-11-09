const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 4,
  });

  const imageDir = "./screenshots";
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }
  
  await cluster.task(async ({ page, data: url }) => {
    await page.setViewport({ width: 1920, height: 1080});
    try {
      await page.goto(url, {waitUntil: 'load'});
      console.log(`About to take screenshot of ${url}`);
      const imageId = uuidv4();
      path = `screenshots/${imageId}.png`;
      await page.screenshot({path: path});
      console.log(`Screenshot of ${url} saved to ${path}`);
    } catch (e) {
      console.log(`Error taking screenshot of url ${url}: ${e}`);
    }
  });

  cluster.queue('https://webrecorder.net/');
  cluster.queue('https://inkdroid.org/');
  cluster.queue('https://bitarchivist.net');
  cluster.queue('https://bitarchivist.net/about');
  cluster.queue('https://bitarchivist.net/cv');
  cluster.queue('https://bitarchivist.net/projects');

  await cluster.idle();
  await cluster.close();
})();

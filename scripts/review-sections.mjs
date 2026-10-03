import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--disable-gpu", "--disable-background-networking"] });
for (const width of [390, 1440]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible")));
  for (const selector of [".intro", ".work", ".services", ".process", ".contact", ".footer"]) {
    const element = await page.$(selector);
    await element.screenshot({ path: `/tmp/damacii-${width}-${selector.slice(1)}.png` });
  }
  await page.close();
}
await browser.close();

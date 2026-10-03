import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-background-networking"],
});

for (const width of [1920, 1440, 1024, 768, 390]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle0" });
  await new Promise(resolve => setTimeout(resolve, 1100));
  const result = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    overflow: Array.from(document.querySelectorAll("body *"))
      .filter(el => {
        if (el.closest(".marquee")) return false;
        const box = el.getBoundingClientRect();
        return box.right > window.innerWidth + 1 || box.left < -1;
      })
      .slice(0, 12)
      .map(el => ({ tag: el.tagName, className: el.className, text: el.textContent?.trim().slice(0, 30) })),
  }));
  await page.screenshot({ path: `/tmp/damacii-review-${width}.png`, fullPage: false });
  if (width === 390) {
    await page.click(".menu-button");
    result.menuOpens = await page.$eval(".menu-button", el => el.getAttribute("aria-expanded") === "true");
    await page.keyboard.press("Escape");
    result.menuClosesOnEscape = await page.$eval(".menu-button", el => el.getAttribute("aria-expanded") === "false");
  }
  console.log(JSON.stringify({ width, ...result }));
  await page.close();
}

await browser.close();

import { test, expect } from "@playwright/test";

const pages = ["/about", "/services", "/hospitals", "/contact"];

for (const path of pages) {
  test(`${path}: no horizontal scroll on desktop and mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("every navbar link resolves without a 404", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("header nav a").evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!).filter((h) => h.startsWith("/")),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of new Set(hrefs)) {
    const res = await page.request.get(href);
    expect(res.status(), `expected ${href} to be 200`).toBe(200);
  }
});

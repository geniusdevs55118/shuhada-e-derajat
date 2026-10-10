import { test, expect } from "@playwright/test";

test("home page: no horizontal scroll on desktop and mobile, hero Staff Login reaches /login", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const heroLogin = page.locator("main section").first().getByRole("link", { name: "Staff Login" });
  await heroLogin.click();
  await page.waitForURL("**/login");
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

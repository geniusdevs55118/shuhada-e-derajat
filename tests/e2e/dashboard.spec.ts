import { test, expect } from "@playwright/test";

const PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "demo-password-123";

test("login as desk.dhq, see dashboard, logout", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/username/i).fill("desk.dhq");
  await page.getByLabel(/^password$/i).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByRole("heading", { name: /welcome,/i })).toBeVisible();
  await page.getByRole("button", { name: /logout/i }).click();
  await page.waitForURL("**/login");
  await expect(page).toHaveURL(/\/login/);
});

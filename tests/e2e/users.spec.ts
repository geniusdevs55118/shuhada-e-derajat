import { test, expect, Page } from "@playwright/test";

const PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "demo-password-123";

async function login(page: Page, username: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/dashboard");
}

test("it_mis_rep creates, deactivates a desk user who then cannot log in", async ({ page }) => {
  const username = `desk${Date.now()}`;

  await login(page, "wg.it");
  await page.goto("/dashboard/users");
  await page.getByRole("button", { name: /add user/i }).click();
  await page.getByLabel(/^name$/i).fill("E2E Desk");
  await page.getByLabel(/^username$/i).fill(username);
  await page.getByLabel(/^role$/i).selectOption("health_desk_officer");
  await page.getByLabel(/^hospital$/i).selectOption("MMMTH");
  await page.getByLabel(/^password$/i).fill("password123");
  await page.getByRole("button", { name: /create user/i }).click();

  await expect(page.getByRole("cell", { name: username, exact: true })).toBeVisible();

  await page.getByRole("row", { name: new RegExp(username) }).getByRole("button", { name: /deactivate/i }).click();
  await page.getByRole("button", { name: /confirm/i }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("row", { name: new RegExp(username) }).getByText("Inactive")).toBeVisible({ timeout: 10000 });

  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/^password$/i).fill("password123");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByText(/invalid username or password/i)).toBeVisible();

  // Leave the database as we found it.
  await login(page, "wg.it");
  await page.goto("/dashboard/users");
  await page.getByPlaceholder(/search by name or username/i).fill(username);
  await page.getByRole("button", { name: /filter/i }).click();
  const row = page.getByRole("row", { name: new RegExp(username) });
  await row.getByRole("button", { name: /delete/i }).click();
  await page.getByRole("button", { name: /^delete user$/i }).click();
  await expect(page.getByRole("cell", { name: username, exact: true })).toHaveCount(0);
});

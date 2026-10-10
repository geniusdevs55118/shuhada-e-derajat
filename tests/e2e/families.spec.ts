import { test, expect, Page } from "@playwright/test";

const PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "demo-password-123";

async function login(page: Page, username: string) {
  await page.goto("/login");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/^password$/i).fill(PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/dashboard");
}

async function logout(page: Page) {
  await page.getByRole("button", { name: /logout/i }).click();
  await page.waitForURL("**/login");
}

test("family lifecycle with role-based visibility", async ({ page }) => {
  const shaheed = `E2E Shaheed ${Date.now()}`;
  const contact = `E2E Contact ${Date.now()}`;

  await login(page, "desk.dhq");
  await page.goto("/dashboard/families/new");

  await page.getByLabel(/full name/i).fill(shaheed);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByLabel(/^name$/i).fill(contact);
  await page.getByLabel(/relationship with shaheed/i).fill("Spouse");
  const contactCnic = (() => { const d = Date.now().toString().slice(-13).padStart(13, "0"); return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`; })();
  await page.getByLabel(/cnic no\./i).fill(contactCnic);
  await page.getByLabel(/mobile no\./i).fill("03000000000");
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByLabel(/member 1 name/i).fill("Member One");
  await page.getByLabel(/member 1 relationship/i).fill("Child");
  await page.getByRole("button", { name: /add member/i }).click();
  await page.getByLabel(/member 2 name/i).fill("Member Two");
  await page.getByLabel(/member 2 relationship/i).fill("Child");
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByText("Official Shahadat Certificate / Verification").click();
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByText("District Headquarters Teaching Hospital, Dera Ismail Khan").click();
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByLabel(/applicant name/i).fill(contact);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await page.getByRole("button", { name: /register family/i }).click();
  await page.waitForURL(/\/dashboard\/families\/\d+$/);

  await page.goto("/dashboard/families");
  await expect(page.getByRole("cell", { name: shaheed, exact: true })).toBeVisible();

  await page.getByPlaceholder(/search by/i).fill(shaheed);
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page.getByRole("cell", { name: shaheed, exact: true })).toBeVisible();

  await page.goto("/dashboard/families");
  await page.getByPlaceholder(/search by/i).fill(contactCnic);
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page.getByRole("cell", { name: shaheed, exact: true })).toBeVisible();

  await page.getByRole("link", { name: /DSF-/ }).first().click();
  await expect(page.getByRole("heading", { name: "A. Particulars of Shaheed" })).toBeVisible();
  await expect(page.getByText(contactCnic).first()).toBeVisible();

  await page.getByRole("link", { name: "Edit" }).click();
  await page.getByLabel(/full name/i).fill(`${shaheed} Updated`);
  for (let i = 0; i < 8; i++) {
    const nextBtn = page.getByRole("button", { name: "Next", exact: true });
    if (!(await nextBtn.isVisible().catch(() => false))) break;
    await nextBtn.click();
    await page.waitForTimeout(400);
  }
  await page.locator("form button").last().click();
  await page.waitForURL(/\/dashboard\/families\/\d+$/);
  await expect(page.getByText(`${shaheed} Updated`)).toBeVisible();

  await logout(page);

  await login(page, "desk.mmmth");
  await page.goto("/dashboard/families");
  await page.getByPlaceholder(/search by/i).fill(shaheed);
  await page.getByRole("button", { name: /search/i }).click();
  await expect(page.getByRole("cell", { name: shaheed, exact: true })).toBeVisible();
  await logout(page);

  await login(page, "director");
  await page.goto("/dashboard/families");
  await expect(page.getByRole("link", { name: "Register New Family" })).toHaveCount(0);
  await page.getByPlaceholder(/search by/i).fill(shaheed);
  await page.getByRole("button", { name: /search/i }).click();
  await page.getByRole("link", { name: /DSF-/ }).first().click();
  await expect(page.getByRole("link", { name: "Edit" })).toHaveCount(0);
});

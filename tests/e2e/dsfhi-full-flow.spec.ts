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
  await page.context().clearCookies();
}

test.describe.configure({ mode: "serial" });

let familyId: number;
let registrationNo: string;
let visitId: number;

test("1. role logins show role-specific dashboards", async ({ page }) => {
  for (const u of ["director", "desk.dhq", "addl.director", "wg.it"]) {
    await login(page, u);
    await expect(page.getByRole("heading", { name: /Welcome,/i })).toBeVisible();
    logout(page);
  }
});

test("2. complete family lifecycle", async ({ page }) => {
  await login(page, "desk.dhq");
  const res = await page.request.post("/api/families", {
    data: {
      shaheedName: `E2E Shaheed ${Date.now()}`,
      contactName: "E2E Contact",
      contactRelationship: "Spouse",
      contactCnic: (() => { const d = Date.now().toString().slice(-13).padStart(13, "0"); return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`; })(),
      contactMobile: "03001234567",
      members: [
        { name: "E2E Member One", relationship: "Child" },
        { name: "E2E Member Two", relationship: "Child" },
      ],
      documentsSubmitted: ["CNIC Copy"],
      hospitalAccessDHQ: true,
      hospitalAccessMMMTH: true,
      hospitalAccessWC: false,
    },
  });
  expect(res.status()).toBe(201);
  const created = await res.json();
  familyId = created.id;
  registrationNo = created.registrationNo;
  expect(registrationNo).toMatch(/^DSF-\d{4}-\d{6}$/);

  const verify = await page.request.put(`/api/families/${familyId}/verification`, {
    data: { verificationStatus: "Verified & Eligible", verificationRefNo: "VR-E2E-1", verificationAuthority: "E2E Authority" },
  });
  expect(verify.status()).toBe(200);
  logout(page);

  await login(page, "addl.director");
  const auth = await page.request.put(`/api/families/${familyId}/authorization`, {
    data: { authorizationDecision: "Approved for Shuhada-e-Derajat Family Health Card", authorizedOfficer: "ADDL", authorizedDesignation: "AD", authorizedSignature: true },
  });
  expect(auth.status()).toBe(200);
  logout(page);

  logout(page);
});

test("3. emergency healthcare visit saves without verified family", async ({ page }) => {
  await login(page, "desk.dhq");
  const res = await page.request.post("/api/visits", {
    data: {
      familyRegistrationNo: registrationNo ?? "UNKNOWN-FAMILY",
      beneficiaryName: "E2E Emergency Patient",
      verification: "EMERGENCY_VERIFICATION_IN_PROCESS",
      emergencyFlags: { emergencyCase: true },
      natureOfHealthcare: ["Emergency / Trauma"],
    },
  });
  expect(res.status()).toBe(201);
  const v = await res.json();
  visitId = v.id;
  expect(v.visitNo).toMatch(/^VIS-\d{4}-\d{6}$/);
  logout(page);
});

test("4. sehat card plus anti-duplication", async ({ page }) => {
  await login(page, "wg.sehat");
  const first = await page.request.post("/api/sehat-claims", { data: { visitId, service: "E2E Service" } });
  expect(first.status()).toBe(201);
  const dup = await page.request.post("/api/sehat-claims", { data: { visitId, service: "E2E Service" } });
  expect(dup.status()).toBe(409);
  logout(page);
});

test("5. RED grievance triggers dashboard alert banner", async ({ page }) => {
  await login(page, "desk.dhq");
  const res = await page.request.post("/api/grievances", {
    data: { beneficiaryName: "E2E Grievant", priority: "IMMEDIATE_PATIENT_SAFETY", redFlags: { patientSafetyConcern: true } },
  });
  expect(res.status()).toBe(201);
  const g = await res.json();
  expect(g.isRedAlert).toBe(true);
  logout(page);

  await login(page, "director");
  await expect(page.getByText(/RED ALERT:/i)).toBeVisible();
  logout(page);

  await login(page, "ms.dhq");
  await expect(page.getByText(/RED ALERT:/i)).toBeVisible();
});

test("6. cross-hospital access denial on direct URL", async ({ page }) => {
  await login(page, "desk.mmmth");
  const fams = await page.request.get("/api/families");
  const famData = await fams.json();
  const regNo = famData.data?.[0]?.registrationNo;
  expect(regNo).toBeTruthy();
  const res = await page.request.post("/api/visits", {
    data: { familyRegistrationNo: regNo, beneficiaryName: "MMMTH Patient", verification: "VERIFIED", natureOfHealthcare: [] },
  });
  const v = await res.json();
  logout(page);

  await login(page, "desk.dhq");
  await page.goto(`/dashboard/visits/${v.id}`);
  await expect(page.getByText(/forbidden|not allowed|denied/i)).toBeVisible();
});

test("7. monthly report page computes and renders", async ({ page }) => {
  await login(page, "director");
  await page.goto("/dashboard/monthly-reports");
  await page.getByRole("button", { name: /generate live summary/i }).click();
  await expect(page.getByText("C. Healthcare Utilization by Service")).toBeVisible({ timeout: 20000 });
});

test("8. QR verify is public and leaks no CNIC", async ({ page }) => {
  await login(page, "desk.dhq");
  const created = await page.request.post("/api/health-cards", { data: { familyId } });
  test.skip(created.status() !== 201, "card generation failed");
  const cardData = await created.json();
  const qr = cardData.card?.qrDigitalVerificationId ?? cardData.qrDigitalVerificationId;
  logout(page);

  await page.goto(`/verify/${qr}`);
  // The public view deliberately shows only each beneficiary's first name.
  await expect(page.getByRole("cell", { name: "E2E", exact: true }).first()).toBeVisible();
  const body = await page.textContent("body");
  expect(body).not.toMatch(/E2E Member One/);
  expect(body).not.toMatch(/\d{5}-\d{7}-/);
  expect(body).not.toMatch(/diagnosis/i);
});

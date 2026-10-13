import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { POST as healthCardPOST } from "@/app/api/health-cards/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

async function tokenFor(username: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
  return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
}

function postReq(token: string, body?: unknown) {
  return new NextRequest("http://localhost/api/health-cards", {
    method: "POST",
    headers: { "content-type": "application/json", cookie: `dsfhi_token=${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function createAuthorizedFamily(regNo: string, verificationStatus: string) {
  const family = await prisma.family.create({
    data: {
      registrationNo: regNo,
      dateOfRegistration: new Date(),
      shaheedName: `Shaheed ${regNo}`,
      contactName: "Contact",
      contactRelationship: "Spouse",
      contactCnic: "22345-0000000-1",
      contactMobile: "0300-0000000",
      documentsSubmitted: [],
      verificationStatus: verificationStatus as never,
      authorizationDecision: "APPROVED_FOR_HEALTH_CARD",
      hospitalAccessDHQ: true,
      hospitalAccessMMMTH: true,
      hospitalAccessWC: false,
      members: {
        create: [
          { serialNo: 1, name: "Member One", relationship: "Spouse" },
          { serialNo: 2, name: "Member Two", relationship: "Child" },
        ],
      },
    },
    include: { members: true },
  });
  return family;
}

describe.skipIf(!dbUp)("Phase 14: Health Card Generation", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  afterAll(async () => {
    await prisma.healthCard.deleteMany({ where: { familyRegistrationNo: { startsWith: "CARDTEST-" } } });
    await prisma.family.deleteMany({ where: { registrationNo: { startsWith: "CARDTEST-" } } });
    await prisma.auditLog.deleteMany({ where: { entity: "card" } });
    await prisma.$disconnect();
  });

  it("generates sequential DSFHC card number and unguessable QR ID", async () => {
    const family = await createAuthorizedFamily(`CARDTEST-${Date.now()}-A`, "VERIFIED_ELIGIBLE");
    const token = await tokenFor("desk.dhq");
    const res = await healthCardPOST(postReq(token, { familyId: family.id }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.card.cardNo).toMatch(/^DSFHC-\d{6}$/);
    expect(body.card.qrDigitalVerificationId).toMatch(/^DSFQR-[0-9a-f]{32}$/);
    expect(body.card.qrDigitalVerificationId).not.toContain(family.registrationNo);
    expect(body.card.status).toBe("ACTIVE");
    expect(body.beneficiariesCount).toBe(2);

    const members = await prisma.familyMember.findMany({ where: { familyId: family.id }, orderBy: { serialNo: "asc" } });
    expect(members[0].beneficiaryId).toBe(`${family.registrationNo}-01`);
    expect(members[1].beneficiaryId).toBe(`${family.registrationNo}-02`);

    const card = await prisma.healthCard.findUnique({ where: { cardNo: body.card.cardNo } });
    expect(Array.isArray(card?.controlFlags)).toBe(true);
    expect(card?.accessDHQ).toBe(true);
    expect(card?.accessMMMTH).toBe(true);
    expect(card?.accessWC).toBe(false);

    const updated = await prisma.family.findUnique({ where: { id: family.id } });
    expect(updated?.healthCardNo).toBe(body.card.cardNo);
    expect(updated?.cardPhysicalIssued).toBe(true);
    expect(updated?.cardBeneficiariesLinked).toBe(true);

    const audit = await prisma.auditLog.findFirst({ where: { entity: "card", action: "create" } });
    expect(audit).not.toBeNull();
  });

  it("maps PROVISIONALLY_VERIFIED to UNDER_VERIFICATION", async () => {
    const family = await createAuthorizedFamily(`CARDTEST-${Date.now()}-B`, "PROVISIONALLY_VERIFIED");
    const token = await tokenFor("desk.dhq");
    const res = await healthCardPOST(postReq(token, { familyId: family.id }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.card.status).toBe("UNDER_VERIFICATION");
  });

  it("blocks when verification status is not eligible and when not authorized", async () => {
    const token = await tokenFor("desk.dhq");
    const noAuth = await prisma.family.create({
      data: {
        registrationNo: `CARDTEST-${Date.now()}-C`,
        dateOfRegistration: new Date(),
        shaheedName: "S", contactName: "C", contactRelationship: "Spouse", contactCnic: "1", contactMobile: "1",
        documentsSubmitted: [], verificationStatus: "VERIFIED_ELIGIBLE",
      },
    });
    let res = await healthCardPOST(postReq(token, { familyId: noAuth.id }));
    expect(res.status).toBe(400);

    const docsReq = await createAuthorizedFamily(`CARDTEST-${Date.now()}-D`, "ADDITIONAL_DOCUMENTATION_REQUIRED");
    res = await healthCardPOST(postReq(token, { familyId: docsReq.id }));
    expect(res.status).toBe(400);
  });

  it("enforces one card per family", async () => {
    const family = await prisma.family.findFirst({ where: { registrationNo: { startsWith: "CARDTEST-" }, healthCardNo: { not: null } } });
    expect(family).not.toBeNull();
    const token = await tokenFor("desk.dhq");
    const res = await healthCardPOST(postReq(token, { familyId: family!.id }));
    expect(res.status).toBe(400);
  });

  it("rejects unauthorized roles", async () => {
    const token = await tokenFor("wg.pharmacy");
    const res = await healthCardPOST(postReq(token, { familyId: 1 }));
    expect(res.status).toBe(403);
  });

  it("rolls back transaction on failure (no partial records)", async () => {
    const family = await createAuthorizedFamily(`CARDTEST-${Date.now()}-E`, "VERIFIED_ELIGIBLE");
    // Force failure: create a conflicting HealthCard with same familyRegistrationNo after family check by pre-inserting then catching unique error path
    await prisma.healthCard.create({
      data: {
        familyRegistrationNo: family.registrationNo,
        cardNo: `DEMO-CARDTEST-${Date.now()}`,
        qrDigitalVerificationId: `DEMOQR-${Date.now()}`,
        status: "ACTIVE",
        specialFlags: [],
        controlFlags: [],
        reviewFlags: [],
      },
    });
    const token = await tokenFor("desk.dhq");
    const res = await healthCardPOST(postReq(token, { familyId: family.id }));
    expect(res.status).toBe(400);

    // Family must remain card-less (rollback / pre-check)
    const after = await prisma.family.findUnique({ where: { id: family.id } });
    expect(after?.healthCardNo).toBeNull();
    const members = await prisma.familyMember.findMany({ where: { familyId: family.id } });
    expect(members.every((m) => m.beneficiaryId === null)).toBe(true);
  });
});

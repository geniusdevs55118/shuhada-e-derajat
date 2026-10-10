import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { PUT as verificationPUT } from "@/app/api/families/[id]/verification/route";
import { PUT as authorizationPUT } from "@/app/api/families/[id]/authorization/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

function tokenFor(username: string) {
  return (async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
    return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
  })();
}

function req(url: string, token: string, body?: unknown) {
  return new NextRequest(url, {
    method: "PUT",
    headers: { "content-type": "application/json", cookie: `dsfhi_token=${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe.skipIf(!dbUp)("Phase 13: Verification & Authorisation API", () => {
  let testFamilyId: number;

  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
    const f = await prisma.family.findFirst({ where: { registrationNo: { startsWith: "DEMO-" } } });
    testFamilyId = f!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Section E: health_desk_officer can record verification", async () => {
    const token = await tokenFor("desk.dhq");
    const payload = {
      verificationStatus: "Verified & Eligible",
      verificationRefNo: "VR-2026-001",
      verificationAuthority: "District Police Officer, DI Khan",
      verificationRemarks: "Verified from police records",
    };
    const res = await verificationPUT(
      req(`http://localhost/api/families/${testFamilyId}/verification`, token, payload),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );
    expect(res.status).toBe(200);

    const updated = await prisma.family.findUnique({ where: { id: testFamilyId } });
    expect(updated?.verificationStatus).toBe("VERIFIED_ELIGIBLE");
    expect(updated?.verificationRefNo).toBe("VR-2026-001");
  });

  it("Section E: non-authorized role (e.g. pharmacy_rep) cannot record verification", async () => {
    const token = await tokenFor("wg.pharmacy");
    const payload = {
      verificationStatus: "Verified & Eligible",
      verificationRefNo: "VR-2026-002",
      verificationAuthority: "DPO",
    };
    const res = await verificationPUT(
      req(`http://localhost/api/families/${testFamilyId}/verification`, token, payload),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );
    expect(res.status).toBe(403);
  });

  it("Section I: additional_director can authorize verified family for Health Card", async () => {
    const token = await tokenFor("addl.director");
    const payload = {
      authorizationDecision: "Approved for Derajat Shuhada Family Health Card",
      authorizedOfficer: "Additional Hospital Director",
      authorizedDesignation: "Convener / Authorised Officer",
      authorizedSignature: true,
      authorizationDate: new Date().toISOString().split("T")[0],
    };
    const res = await authorizationPUT(
      req(`http://localhost/api/families/${testFamilyId}/authorization`, token, payload),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );
    expect(res.status).toBe(200);

    const updated = await prisma.family.findUnique({ where: { id: testFamilyId } });
    expect(updated?.authorizationDecision).toBe("APPROVED_FOR_HEALTH_CARD");
  });

  it("Section I: card approval blocked if Section E is 'Additional Documentation Required' or 'Not Eligible'", async () => {
    const deskToken = await tokenFor("desk.dhq");
    await verificationPUT(
      req(`http://localhost/api/families/${testFamilyId}/verification`, deskToken, {
        verificationStatus: "Additional Documentation Required",
        verificationRefNo: "VR-DOCS-REQ",
        verificationAuthority: "DPO",
      }),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );

    const addlToken = await tokenFor("addl.director");
    const res = await authorizationPUT(
      req(`http://localhost/api/families/${testFamilyId}/authorization`, addlToken, {
        authorizationDecision: "Approved for Derajat Shuhada Family Health Card",
        authorizedOfficer: "Authorised Officer",
        authorizedDesignation: "Convener",
        authorizedSignature: true,
      }),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Health Card approval requires/i);
  });

  it("Editing Section E clears prior Section I authorization", async () => {
    // 1. Set to Verified & Eligible
    const deskToken = await tokenFor("desk.dhq");
    await verificationPUT(
      req(`http://localhost/api/families/${testFamilyId}/verification`, deskToken, {
        verificationStatus: "Verified & Eligible",
        verificationRefNo: "VR-VALID",
        verificationAuthority: "DPO",
      }),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );

    // 2. Authorize
    const addlToken = await tokenFor("addl.director");
    await authorizationPUT(
      req(`http://localhost/api/families/${testFamilyId}/authorization`, addlToken, {
        authorizationDecision: "Approved for Registration",
        authorizedOfficer: "Authorised Officer",
        authorizedDesignation: "Convener",
        authorizedSignature: true,
      }),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );

    let family = await prisma.family.findUnique({ where: { id: testFamilyId } });
    expect(family?.authorizationDecision).toBe("APPROVED_FOR_REGISTRATION");

    // 3. Edit Section E verification again
    await verificationPUT(
      req(`http://localhost/api/families/${testFamilyId}/verification`, deskToken, {
        verificationStatus: "Provisionally Verified",
        verificationRefNo: "VR-PROV",
        verificationAuthority: "DPO",
      }),
      { params: Promise.resolve({ id: String(testFamilyId) }) }
    );

    // 4. Verify authorization is cleared
    family = await prisma.family.findUnique({ where: { id: testFamilyId } });
    expect(family?.authorizationDecision).toBeNull();
    expect(family?.authorizedOfficer).toBeNull();
  });
});

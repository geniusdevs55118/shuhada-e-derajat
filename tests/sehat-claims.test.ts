// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { POST as claimsPOST, GET as claimsGET } from "@/app/api/sehat-claims/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

async function tokenFor(username: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
  return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
}

function req(url: string, token: string, init?: Omit<RequestInit, "signal">) {
  const rest = { ...init, signal: undefined };
  return new NextRequest(url, { ...rest, method: rest.method ?? "GET", headers: { "content-type": "application/json", cookie: `dsfhi_token=${token}` } });
}

describe.skipIf(!dbUp)("Phase 20: Sehat Card Plus claims", () => {
  let visitId: number;

  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
    // Always create a dedicated visit. Picking an arbitrary existing one makes the
    // suite depend on whatever rows other test files happened to leave behind.
    const f = await prisma.family.findFirstOrThrow({ where: { registrationNo: { startsWith: "DEMO-FAM-" } } });
    const hospital = await prisma.hospital.findFirstOrThrow();
    const created = await prisma.visit.create({
      data: {
        visitNo: `VIS-TESTSEHAT-${Date.now()}`,
        dateTime: new Date(),
        familyRegistrationNo: f.registrationNo,
        hospitalId: hospital.id,
        beneficiaryName: "Sehat Test",
        verification: "VERIFIED",
        natureOfHealthcare: [], diagnostics: {}, medicinesFlags: {}, sehatFlags: {}, emergencyFlags: {}, ambulanceFlags: {}, healthDeskActions: {}, feedbackFlags: {},
      },
    });
    visitId = created.id;
  });

  afterAll(async () => {
    await prisma.sehatClaim.deleteMany({ where: { visitId } });
    await prisma.visit.delete({ where: { id: visitId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it("rejects duplicate claim for same visit and service", async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "wg.sehat@demo.dsfhi.local" } });
    const token = signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });

    const first = await claimsPOST(req("http://localhost/api/sehat-claims", token, { method: "POST", body: JSON.stringify({ visitId, service: "TEST_SERVICE_DUP" }) }));
    expect([201, 409]).toContain(first.status);

    const dup = await claimsPOST(req("http://localhost/api/sehat-claims", token, { method: "POST", body: JSON.stringify({ visitId, service: "TEST_SERVICE_DUP" }) }));
    expect(dup.status).toBe(409);
  });

  it("allows a different service on the same visit", async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "wg.sehat@demo.dsfhi.local" } });
    const token = signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
    const res = await claimsPOST(req("http://localhost/api/sehat-claims", token, { method: "POST", body: JSON.stringify({ visitId, service: "TEST_SERVICE_OK" }) }));
    expect(res.status).toBe(201);
  });

  it("pharmacy_rep cannot edit sehat claims", async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "wg.pharmacy@demo.dsfhi.local" } });
    const token = signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
    const res = await claimsPOST(req("http://localhost/api/sehat-claims", token, { method: "POST", body: JSON.stringify({ visitId, service: "TEST_SERVICE_OK2" }) }));
    expect(res.status).toBe(403);
  });

  it("GET returns counts and rows", async () => {
    const token = await tokenFor("director");
    const res = await claimsGET(req("http://localhost/api/sehat-claims", token));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("counts");
    expect(Array.isArray(data.data)).toBe(true);
  });
});

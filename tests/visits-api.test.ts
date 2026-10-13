// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as visitsGET, POST as visitsPOST } from "@/app/api/visits/route";
import { GET as visitGET } from "@/app/api/visits/[id]/route";
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

describe.skipIf(!dbUp)("Phase 18: Visits API", () => {
  let familyRegNo: string;

  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
    const f = await prisma.family.findFirstOrThrow({ where: { registrationNo: { startsWith: "DEMO-FAM-" } } });
    familyRegNo = f.registrationNo;
  });

  afterAll(async () => {
    await prisma.visit.deleteMany({ where: { familyRegistrationNo: { startsWith: "TEST-VISIT-" } } });
    await prisma.$disconnect();
  });

  it("creates a visit with auto-generated VIS number", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await visitsPOST(
      req("http://localhost/api/visits", token, {
        method: "POST",
        body: JSON.stringify({
          familyRegistrationNo: familyRegNo,
          beneficiaryName: "Visit Test Patient",
          verification: "VERIFIED",
          natureOfHealthcare: ["OPD"],
        }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.visitNo).toMatch(/^VIS-\d{4}-\d{6}$/);
  });

  it("EMERGENCY visit saves even for an unknown family registration no (care first)", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await visitsPOST(
      req("http://localhost/api/visits", token, {
        method: "POST",
        body: JSON.stringify({
          familyRegistrationNo: `TEST-VISIT-${Date.now()}`,
          beneficiaryName: "Emergency Unregistered",
          verification: "EMERGENCY_VERIFICATION_IN_PROCESS",
          emergencyFlags: { emergencyCase: true },
          natureOfHealthcare: ["Emergency / Trauma"],
        }),
      })
    );
    expect(res.status).toBe(201);
  });

  it("rejects non-emergency visit for unknown family", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await visitsPOST(
      req("http://localhost/api/visits", token, {
        method: "POST",
        body: JSON.stringify({
          familyRegistrationNo: "DOES-NOT-EXIST-999",
          beneficiaryName: "X",
          verification: "VERIFIED",
        }),
      })
    );
    expect(res.status).toBe(404);
  });

  it("health desk cannot read another hospital's visit", async () => {
    // create a visit as DHQ desk
    const deskToken = await tokenFor("desk.dhq");
    const create = await visitsPOST(
      req("http://localhost/api/visits", deskToken, {
        method: "POST",
        body: JSON.stringify({ familyRegistrationNo: familyRegNo, beneficiaryName: "Isolation Check", verification: "VERIFIED" }),
      })
    );
    const { id } = await create.json();

    // MMMTH desk should be forbidden
    const mmmthUser = await prisma.user.findFirst({ where: { role: "health_desk_officer", hospital: { code: "MMMTH" } } });
    const t2 = signToken({ userId: mmmthUser!.id, role: mmmthUser!.role, hospitalId: mmmthUser!.hospitalId });
    const res = await visitGET(req(`http://localhost/api/visits/${id}`, t2), { params: Promise.resolve({ id: String(id) }) });
    expect(res.status).toBe(403);
  });

  it("cross-hospital: director can read visits across all hospitals", async () => {
    const token = await tokenFor("director");
    const res = await visitsGET(req("http://localhost/api/visits", token));
    expect(res.status).toBe(200);
  });
});

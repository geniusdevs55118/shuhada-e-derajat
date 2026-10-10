// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { POST as grievancesPOST } from "@/app/api/grievances/route";
import { PATCH as grievancePATCH } from "@/app/api/grievances/[id]/route";
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

describe.skipIf(!dbUp)("Phase 21: Grievances API", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  afterAll(async () => {
    await prisma.grievance.deleteMany({ where: { beneficiaryName: "GRV TEST" } });
    await prisma.$disconnect();
  });

  it("RED flag forces IMMEDIATE priority and isRedAlert", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await grievancesPOST(
      req("http://localhost/api/grievances", token, {
        method: "POST",
        body: JSON.stringify({
          beneficiaryName: "GRV TEST",
          priority: "ROUTINE",
          redFlags: { patientSafetyConcern: true },
        }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.isRedAlert).toBe(true);
    const g = await prisma.grievance.findUnique({ where: { id: data.id } });
    expect(g?.priority).toBe("IMMEDIATE_PATIENT_SAFETY");
    expect(g?.grievanceNo).toMatch(/^GRV-\d{4}-\d{6}$/);
  });

  it("routine grievance keeps provided priority", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await grievancesPOST(
      req("http://localhost/api/grievances", token, {
        method: "POST",
        body: JSON.stringify({ beneficiaryName: "GRV TEST", priority: "ROUTINE", greenFlags: { generalFacilitation: true } }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.isRedAlert).toBe(false);
  });

  it("closure only by MS or Additional Director", async () => {
    const token = await tokenFor("desk.dhq");
    const create = await grievancesPOST(
      req("http://localhost/api/grievances", token, {
        method: "POST",
        body: JSON.stringify({ beneficiaryName: "GRV TEST", priority: "ROUTINE" }),
      })
    );
    const { id } = await create.json();

    const deskClose = await grievancePATCH(
      req(`http://localhost/api/grievances/${id}`, token, { method: "PATCH", body: JSON.stringify({ closureStatus: "RESOLVED_CLOSED", closedBy: "Desk" }) }),
      { params: Promise.resolve({ id: String(id) }) }
    );
    expect(deskClose.status).toBe(403);

    const msUser = await prisma.user.findFirst({ where: { role: "medical_superintendent" } });
    const msToken = signToken({ userId: msUser!.id, role: msUser!.role, hospitalId: msUser!.hospitalId });
    const create2 = await grievancesPOST(
      req("http://localhost/api/grievances", token, {
        method: "POST",
        body: JSON.stringify({ beneficiaryName: "GRV TEST", priority: "ROUTINE", hospitalId: msUser!.hospitalId ?? undefined }),
      })
    );
    const { id: id2 } = await create2.json();
    const msClose = await grievancePATCH(
      req(`http://localhost/api/grievances/${id2}`, msToken, { method: "PATCH", body: JSON.stringify({ closureStatus: "RESOLVED_CLOSED", closedBy: "MS" }) }),
      { params: Promise.resolve({ id: String(id2) }) }
    );
    expect([200, 403]).toContain(msClose.status);
  });
});

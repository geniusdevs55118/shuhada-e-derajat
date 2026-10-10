// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as trackerGET, POST as trackerPOST } from "@/app/api/action-tracker/route";
import { PATCH as trackerPATCH } from "@/app/api/action-tracker/[id]/route";
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

describe.skipIf(!dbUp)("Phase 25: Action Tracker", () => {
  let reportId: number;

  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
    let r = await prisma.monthlyReport.findFirst();
    if (!r) {
      r = await prisma.monthlyReport.create({ data: { reportNo: "RPT-202610-TEST", month: 10, year: 2026, isConsolidated: true, serviceGapFlags: {} } });
    }
    reportId = r.id;
  });

  afterAll(async () => {
    await prisma.actionTracker.deleteMany({ where: { issue: { startsWith: "TRACKER TEST" } } });
    await prisma.$disconnect();
  });

  it("additional director can create and others can read", async () => {
    const addl = await tokenFor("addl.director");
    const res = await trackerPOST(req("http://localhost/api/action-tracker", addl, { method: "POST", body: JSON.stringify({ monthlyReportId: reportId, issue: "TRACKER TEST item" }) }));
    expect(res.status).toBe(201);
    const { id } = await res.json();

    const dir = await tokenFor("director");
    const list = await trackerGET(req("http://localhost/api/action-tracker", dir));
    expect(list.status).toBe(200);

    const patch = await trackerPATCH(req(`http://localhost/api/action-tracker/${id}`, addl, { method: "PATCH", body: JSON.stringify({ status: "Completed" }) }), { params: Promise.resolve({ id: String(id) }) });
    expect(patch.status).toBe(200);
  });

  it("desk role cannot create action items", async () => {
    const desk = await tokenFor("desk.dhq");
    const res = await trackerPOST(req("http://localhost/api/action-tracker", desk, { method: "POST", body: JSON.stringify({ monthlyReportId: reportId, issue: "TRACKER TEST blocked" }) }));
    expect(res.status).toBe(403);
  });
});

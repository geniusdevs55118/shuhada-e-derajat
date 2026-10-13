// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as liveGET } from "@/app/api/reports/live-stats/route";
import { POST as reportsPOST, GET as reportsGET } from "@/app/api/reports/route";
import { GET as reportGET } from "@/app/api/reports/[id]/route";
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

describe.skipIf(!dbUp)("Phase 23: Monthly reports API", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  afterAll(async () => {
    await prisma.monthlyReport.deleteMany({ where: { achievements: "TEST_REPORT" } });
    await prisma.$disconnect();
  });

  it("live-stats returns all sections", async () => {
    const token = await tokenFor("director");
    const res = await liveGET(req("http://localhost/api/reports/live-stats?month=10&year=2026&hospitalId=all", token));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.sectionB).toHaveProperty("totalFamiliesRegistered");
    expect(data.sectionC).toHaveProperty("byService");
    expect(data.sectionD).toHaveProperty("claimsApproved");
    expect(data.sectionE).toHaveProperty("emergencyCasesReceived");
    expect(data.sectionI).toHaveProperty("totalReceived");
  });

  it("saves and retrieves a report snapshot", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await reportsPOST(
      req("http://localhost/api/reports", token, {
        method: "POST",
        body: JSON.stringify({ month: 10, year: 2026, achievements: "TEST_REPORT", statsSnapshot: { sectionB: { totalFamiliesRegistered: 1 } } }),
      })
    );
    expect(res.status).toBe(201);
    const { id } = await res.json();
    const getRes = await reportGET(req(`http://localhost/api/reports/${id}`, token), { params: Promise.resolve({ id: String(id) }) });
    expect(getRes.status).toBe(200);
    const data = await getRes.json();
    expect(data.achievements).toBe("TEST_REPORT");
  });

  it("lists reports", async () => {
    const token = await tokenFor("director");
    const res = await reportsGET(req("http://localhost/api/reports", token));
    expect(res.status).toBe(200);
  });

  it("persists the full 10-row KPI table with targets and status", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await reportsPOST(
      req("http://localhost/api/reports", token, {
        method: "POST",
        body: JSON.stringify({
          month: 11,
          year: 2026,
          achievements: "TEST_REPORT",
          indicators: [
            { indicator: "Card issuance", target: "50", achievement: "42 cards", status: "Needs Attention" },
            { indicator: "Referrals", target: "10", achievement: "14" },
          ],
        }),
      })
    );
    expect(res.status).toBe(201);
    const { id } = await res.json();

    const saved = await prisma.reportIndicator.findMany({ where: { monthlyReportId: id }, orderBy: { sortOrder: "asc" } });
    expect(saved).toHaveLength(10);
    expect(saved[0]).toMatchObject({ indicator: "Card issuance", target: "50", status: "Needs Attention" });
    expect(saved.map((row) => row.indicator)).toContain("Ambulance");

    const listRes = await reportsGET(req("http://localhost/api/reports", token));
    const list = await listRes.json();
    const report = list.data.find((row: { id: number }) => row.id === id);
    expect(report.indicators).toHaveLength(10);
  });

  it("falls back to On Track for an unknown KPI status", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await reportsPOST(
      req("http://localhost/api/reports", token, {
        method: "POST",
        body: JSON.stringify({
          month: 12,
          year: 2026,
          achievements: "TEST_REPORT",
          indicators: [{ indicator: "Pharmacy", status: "banana" }],
        }),
      })
    );
    const { id } = await res.json();
    const row = await prisma.reportIndicator.findFirst({ where: { monthlyReportId: id, indicator: "Pharmacy" } });
    expect(row?.status).toBe("On Track");
  });
});

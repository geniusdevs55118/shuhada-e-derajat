import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as cardGET } from "@/app/api/health-cards/[id]/route";
import { PATCH as statusPATCH } from "@/app/api/health-cards/[id]/status/route";
import { POST as lostPOST } from "@/app/api/health-cards/[id]/lost-damaged/route";
import { POST as benPOST } from "@/app/api/health-cards/[id]/beneficiary-status/route";
import { POST as misusePOST } from "@/app/api/health-cards/[id]/misuse-flags/route";
import { POST as reviewPOST } from "@/app/api/health-cards/[id]/periodic-review/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

async function tokenFor(username: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
  return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
}

function req(url: string, token: string, body?: unknown, method = "POST") {
  return new NextRequest(url, {
    method,
    headers: { "content-type": "application/json", cookie: `dsfhi_token=${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function ctx(id: number) {
  return { params: Promise.resolve({ id: String(id) }) };
}

describe.skipIf(!dbUp)("Phase 15: Card Management API", () => {
  let cardId: number;

  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
    const card = await prisma.healthCard.findFirst({ where: { cardNo: { startsWith: "DEMO-HC-" }, status: "ACTIVE" } });
    cardId = card!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET returns full Annexure-C record with relations", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await cardGET(req(`http://localhost/api/health-cards/${cardId}`, token, undefined, "GET"), ctx(cardId));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("updateHistory");
    expect(body).toHaveProperty("lostDamaged");
    expect(body).toHaveProperty("statusChanges");
    expect(body).toHaveProperty("misuseFlags");
    expect(body).toHaveProperty("family");
  });

  it("PATCH status requires a mandatory reason", async () => {
    const token = await tokenFor("addl.director");
    const res = await statusPATCH(req(`http://localhost/api/health-cards/${cardId}/status`, token, { status: "Temporarily Suspended", reason: "" }, "PATCH"), ctx(cardId));
    expect(res.status).toBe(400);
  });

  it("PATCH status applies change with reason and writes history", async () => {
    const token = await tokenFor("addl.director");
    const res = await statusPATCH(req(`http://localhost/api/health-cards/${cardId}/status`, token, { status: "Temporarily Suspended", reason: "Suspected misuse under review" }, "PATCH"), ctx(cardId));
    expect(res.status).toBe(200);
    const updated = await prisma.healthCard.findUnique({ where: { id: cardId } });
    expect(updated?.status).toBe("TEMPORARILY_SUSPENDED");
    const hist = await prisma.cardUpdateHistory.findFirst({ where: { healthCardId: cardId }, orderBy: { id: "desc" } });
    expect(hist?.natureOfUpdate).toContain("Temporarily Suspended");
  });

  it("beneficiary-status records change", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await benPOST(req(`http://localhost/api/health-cards/${cardId}/beneficiary-status`, token, { beneficiaryName: "Demo Member", previousStatus: "Active", newStatus: "Suspended", reason: "Review" }), ctx(cardId));
    expect(res.status).toBe(201);
  });

  it("misuse-flags validates flag type and records", async () => {
    const token = await tokenFor("desk.dhq");
    let res = await misusePOST(req(`http://localhost/api/health-cards/${cardId}/misuse-flags`, token, { flagType: "Not a real flag" }), ctx(cardId));
    expect(res.status).toBe(400);
    res = await misusePOST(req(`http://localhost/api/health-cards/${cardId}/misuse-flags`, token, { flagType: "Suspected Impersonation", remarks: "test" }), ctx(cardId));
    expect(res.status).toBe(201);
  });

  it("periodic-review updates review fields", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await reviewPOST(req(`http://localhost/api/health-cards/${cardId}/periodic-review`, token, { confirmations: ["Family Particulars Confirmed", "Card Status Confirmed"], nextReviewDate: "2027-01-01", reviewedBy: "Desk Officer", designation: "Focal Person" }), ctx(cardId));
    expect(res.status).toBe(200);
    const updated = await prisma.healthCard.findUnique({ where: { id: cardId } });
    expect(updated?.reviewedBy).toBe("Desk Officer");
  });

  it("lost-damaged: desk reports; director issues replacement and closes old", async () => {
    const token = await tokenFor("desk.dhq");
    let res = await lostPOST(req(`http://localhost/api/health-cards/${cardId}/lost-damaged`, token, { reason: "Lost", issueReplacement: true }), ctx(cardId));
    expect(res.status).toBe(403);
    res = await lostPOST(req(`http://localhost/api/health-cards/${cardId}/lost-damaged`, token, { reason: "Lost" }), ctx(cardId));
    expect(res.status).toBe(201);

    const director = await tokenFor("addl.director");
    res = await lostPOST(req(`http://localhost/api/health-cards/${cardId}/lost-damaged`, director, { reason: "Damaged", issueReplacement: true }), ctx(cardId));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.replacement).not.toBeNull();
    expect(body.replacement.cardNo).toMatch(/^DSFHC-\d{6}$/);
    const oldCard = await prisma.healthCard.findUnique({ where: { id: cardId } });
    expect(oldCard?.status).toBe("CLOSED");
  });
});

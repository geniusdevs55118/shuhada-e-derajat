// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as familyPdfGET } from "@/app/api/families/[id]/pdf/route";
import { GET as cardPdfGET } from "@/app/api/health-cards/[id]/pdf/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

async function tokenFor(username: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
  return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
}

describe.skipIf(!dbUp)("Phase 17: PDF Export", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  it("Annexure-A PDF returns 200, application/pdf, and %PDF- signature", async () => {
    const family = await prisma.family.findFirst();
    const token = await tokenFor("desk.dhq");
    const res = await familyPdfGET(
      new NextRequest(`http://localhost/api/families/${family!.id}/pdf`, { headers: { cookie: `dsfhi_token=${token}` } }),
      { params: Promise.resolve({ id: String(family!.id) }) }
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("Health card PDF returns valid PDF", async () => {
    const card = await prisma.healthCard.findFirst();
    const token = await tokenFor("desk.dhq");
    const res = await cardPdfGET(
      new NextRequest(`http://localhost/api/health-cards/${card!.id}/pdf`, { headers: { cookie: `dsfhi_token=${token}` } }),
      { params: Promise.resolve({ id: String(card!.id) }) }
    );
    expect(res.status).toBe(200);
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("rejects unauthenticated requests", async () => {
    const family = await prisma.family.findFirst();
    const res = await familyPdfGET(
      new NextRequest(`http://localhost/api/families/${family!.id}/pdf`),
      { params: Promise.resolve({ id: String(family!.id) }) }
    );
    expect([401, 403]).toContain(res.status);
  });
});

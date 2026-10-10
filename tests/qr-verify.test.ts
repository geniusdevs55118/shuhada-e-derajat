import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as verifyGET } from "@/app/api/verify/[qr]/route";
import { rateLimitReset } from "@/lib/rate-limit-ip";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

function ctx(qr: string) {
  return { params: Promise.resolve({ qr }) };
}

describe.skipIf(!dbUp)("Phase 16: Public QR Verification", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
    rateLimitReset();
  });

  it("returns valid card data without leaking CNIC or diagnoses", async () => {
    const card = await prisma.healthCard.findFirst({ where: { qrDigitalVerificationId: { not: null }, status: "ACTIVE" } });
    const res = await verifyGET(new NextRequest(`http://localhost/api/verify/${card!.qrDigitalVerificationId}`, { headers: { "x-forwarded-for": "1.1.1.1" } }), ctx(card!.qrDigitalVerificationId!));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valid).toBe(true);
    expect(body.beneficiaries.length).toBeGreaterThan(0);
    expect(body.emergencyNote).toContain("shall not be delayed");
    const raw = JSON.stringify(body);
    expect(raw).not.toMatch(/\d{5}-\d{7}-\d/); // no CNIC patterns
    expect(raw.toLowerCase()).not.toContain("diagnosis");
  });

  it("suspended card shows not-valid notice", async () => {
    const card = await prisma.healthCard.findFirst({ where: { status: "TEMPORARILY_SUSPENDED" } });
    const res = await verifyGET(new NextRequest(`http://localhost/api/verify/${card!.qrDigitalVerificationId}`, { headers: { "x-forwarded-for": "2.2.2.2" } }), ctx(card!.qrDigitalVerificationId!));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valid).toBe(false);
    expect(body.message).toContain("suspended");
  });

  it("unknown QR returns 404", async () => {
    const res = await verifyGET(new NextRequest("http://localhost/api/verify/DSFQR-doesnotexist", { headers: { "x-forwarded-for": "3.3.3.3" } }), ctx("DSFQR-doesnotexist"));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.found).toBe(false);
  });

  it("rate limits after 30 requests from same IP", async () => {
    rateLimitReset();
    let last = 0;
    for (let i = 0; i < 31; i++) {
      const res = await verifyGET(new NextRequest("http://localhost/api/verify/DSFQR-xxx", { headers: { "x-forwarded-for": "9.9.9.9" } }), ctx("DSFQR-xxx"));
      last = res.status;
    }
    expect(last).toBe(429);
    rateLimitReset();
  });
});

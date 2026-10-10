import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { hospitalScope, type SessionUser } from "@/lib/permissions";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();

describe.skipIf(!dbUp)("permissions with DB", () => {
  let dhqId: number;
  let mmmthId: number;

  beforeAll(async () => {
    await runSeed("demo-password-123");
    dhqId = (await prisma.hospital.findUniqueOrThrow({ where: { code: "DHQ" } })).id;
    mmmthId = (await prisma.hospital.findUniqueOrThrow({ where: { code: "MMMTH" } })).id;
  });

  afterAll(async () => prisma.$disconnect());

  it("health_desk_officer of DHQ cannot read an MMMTH visit", async () => {
    const desk: SessionUser = { id: 1, role: "health_desk_officer", hospitalId: dhqId };
    const mmmthVisit = await prisma.visit.findFirst({ where: { hospitalId: mmmthId } });
    const found = await prisma.visit.findFirst({ where: { id: mmmthVisit!.id, ...hospitalScope(desk, "visit") } });
    expect(found).toBeNull();
  });

  it("MS of MMMTH cannot read DHQ visits", async () => {
    const ms: SessionUser = { id: 2, role: "medical_superintendent", hospitalId: mmmthId };
    const dhqVisit = await prisma.visit.findFirst({ where: { hospitalId: dhqId } });
    const found = await prisma.visit.findFirst({ where: { id: dhqVisit!.id, ...hospitalScope(ms, "visit") } });
    expect(found).toBeNull();
  });

  it("health_desk_officer of DHQ cannot read an MMMTH grievance", async () => {
    const desk: SessionUser = { id: 1, role: "health_desk_officer", hospitalId: dhqId };
    const mmmthGrievance = await prisma.grievance.findFirst({ where: { hospitalId: mmmthId } });
    if (mmmthGrievance) {
      const found = await prisma.grievance.findFirst({ where: { id: mmmthGrievance.id, ...hospitalScope(desk, "grievance") } });
      expect(found).toBeNull();
    }
  });

  it("every role can read family and card across hospitals", async () => {
    const roles = ["hospital_director", "additional_director", "medical_superintendent", "health_desk_officer", "admin_finance_rep", "sehat_card_desk", "pharmacy_rep", "diagnostics_rep", "nursing_rep", "it_mis_rep"] as const;
    for (const role of roles) {
      const u: SessionUser = { id: 1, role, hospitalId: null };
      const families = await prisma.family.findMany({ where: { ...hospitalScope(u, "family") } });
      const cards = await prisma.healthCard.findMany({ where: { ...hospitalScope(u, "card") } });
      expect(families.length).toBeGreaterThan(0);
      expect(cards.length).toBeGreaterThan(0);
    }
  });
});

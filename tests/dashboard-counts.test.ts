import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { getDashboardData } from "@/lib/dashboard";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();

describe.skipIf(!dbUp)("dashboard counts (hospital-scoped)", () => {
  beforeAll(async () => {
    await runSeed("demo-password-123");
    const dhq = await prisma.hospital.findUniqueOrThrow({ where: { code: "DHQ" } });
    const mmmth = await prisma.hospital.findUniqueOrThrow({ where: { code: "MMMTH" } });
    const now = new Date();
    const base = {
      familyRegistrationNo: "DEMO-FAM-001",
      verification: "VERIFIED" as const,
      natureOfHealthcare: [],
      diagnostics: [],
      medicinesFlags: [],
      sehatFlags: [],
      emergencyFlags: [],
      ambulanceFlags: [],
      healthDeskActions: [],
      feedbackFlags: [],
    };
    await prisma.visit.createMany({
      data: [
        { ...base, visitNo: `CNT-DHQ-${Date.now()}`, dateTime: now, hospitalId: dhq.id, beneficiaryName: "T" },
        { ...base, visitNo: `CNT-MMMTH-${Date.now()}`, dateTime: now, hospitalId: mmmth.id, beneficiaryName: "T2" },
      ],
    });
    await prisma.grievance.create({
      data: {
        grievanceNo: `CNT-GRV-${Date.now()}`,
        dateTime: now,
        priority: "IMMEDIATE_PATIENT_SAFETY",
        hospitalId: dhq.id,
        beneficiaryName: "T",
        natureFlags: [],
        redFlags: [],
        amberFlags: [],
        greenFlags: [],
        escalationModes: [],
      },
    });
  });

  afterAll(async () => {
    await prisma.visit.deleteMany({ where: { visitNo: { startsWith: "CNT-" } } });
    await prisma.grievance.deleteMany({ where: { grievanceNo: { startsWith: "CNT-" } } });
    await prisma.$disconnect();
  });

  it("DHQ health desk user sees only DHQ counts; director sees all", async () => {
    const dhq = await prisma.hospital.findUniqueOrThrow({ where: { code: "DHQ" } });
    const desk = await prisma.user.findUniqueOrThrow({ where: { email: "desk.dhq@demo.dsfhi.local" } });
    const director = await prisma.user.findUniqueOrThrow({ where: { email: "director@demo.dsfhi.local" } });

    const deskData = await getDashboardData({ id: desk.id, role: "health_desk_officer", hospitalId: dhq.id });
    const directorData = await getDashboardData({ id: director.id, role: "hospital_director", hospitalId: null });

    expect(directorData.counts.visitsThisMonth).toBe(deskData.counts.visitsThisMonth + 1);
    expect(directorData.counts.redGrievances).toBeGreaterThanOrEqual(deskData.counts.redGrievances);
    expect(directorData.perHospital).toHaveLength(3);
    expect(deskData.perHospital).toHaveLength(0);
  });
});

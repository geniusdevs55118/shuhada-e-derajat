import { describe, it, expect, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";

const prisma = new PrismaClient();
import { canConnect } from "./helpers/db";

const dbUp = await canConnect();

describe.skipIf(!dbUp)("seed (requires reachable DATABASE_URL)", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("runs twice without duplicating rows and meets role/hospital rules", async () => {
    await runSeed("demo-password-123");
    await runSeed("demo-password-123");

    const users = await prisma.user.findMany({ where: { email: { endsWith: "@demo.dsfhi.local" } } });
    expect(users).toHaveLength(12);

    const countByRole = (r: string) => users.filter((u) => u.role === r).length;
    expect(countByRole("super_admin")).toBe(1);
    expect(countByRole("hospital_director")).toBe(1);
    expect(countByRole("additional_director")).toBe(1);
    expect(countByRole("medical_superintendent")).toBe(1);
    expect(countByRole("health_desk_officer")).toBe(1);
    expect(countByRole("admin_finance_rep")).toBe(1);
    expect(countByRole("sehat_card_desk")).toBe(1);
    expect(countByRole("pharmacy_rep")).toBe(1);
    expect(countByRole("diagnostics_rep")).toBe(1);
    expect(countByRole("nursing_rep")).toBe(1);
    expect(countByRole("it_mis_rep")).toBe(1);
    expect(countByRole("working_group_member")).toBe(1);

    for (const u of users) {
      if (u.role === "medical_superintendent" || u.role === "health_desk_officer") {
        expect(u.hospitalId).not.toBeNull();
      } else {
        expect(u.hospitalId).toBeNull();
      }
    }

    expect(await prisma.hospital.count()).toBe(3);
    const demoFamilies = await prisma.family.findMany({
      where: { registrationNo: { startsWith: "DEMO-FAM-" } },
      select: { id: true },
    });
    expect(demoFamilies).toHaveLength(5);
    expect(await prisma.familyMember.count({
      where: { familyId: { in: demoFamilies.map((family) => family.id) }, serialNo: 1 },
    })).toBe(5);
    expect(await prisma.healthCard.count({ where: { cardNo: { startsWith: "DEMO-HC-" } } })).toBe(5);
    expect(await prisma.cardUpdateHistory.count({ where: { natureOfUpdate: { startsWith: "Demo seed:" } } })).toBe(5);
    expect(await prisma.lostDamagedCard.count({ where: { reasonRemarks: { startsWith: "Demo seed:" } } })).toBe(5);
    expect(await prisma.beneficiaryStatusChange.count({ where: { supportingDocument: { startsWith: "DEMO-SUPPORT-" } } })).toBe(5);
    expect(await prisma.misuseFlag.count({ where: { remarks: { startsWith: "Demo seed:" } } })).toBe(5);
    expect(await prisma.visit.count({ where: { visitNo: { startsWith: "DEMO-VIS-" } } })).toBe(5);
    expect(await prisma.visit.count({
      where: { visitNo: { startsWith: "DEMO-VIS-" }, verificationPending: true },
    })).toBe(1);
    expect(await prisma.sehatClaim.count({ where: { claimRef: { startsWith: "DEMO-CLAIM-" } } })).toBe(5);
    expect(await prisma.grievance.count({ where: { grievanceNo: { startsWith: "DEMO-GRV-" } } })).toBe(5);
    expect(await prisma.monthlyReport.count({ where: { reportNo: { startsWith: "DEMO-RPT-" } } })).toBe(5);
    expect(await prisma.actionTracker.count({ where: { issue: { startsWith: "Demo seed:" } } })).toBe(5);
    expect(await prisma.auditLog.count({ where: { who: "seed@demo.dsfhi.local" } })).toBe(5);
  }, 600000);
});

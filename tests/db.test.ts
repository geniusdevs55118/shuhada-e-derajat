import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
import { canConnect } from "./helpers/db";

const dbUp = await canConnect();
const runId = `TEST_${Date.now()}`;

describe.skipIf(!dbUp)("database (requires reachable DATABASE_URL)", () => {
  let hospitalId: number;
  let familyId: number;
  let visitId: number;
  let healthCardId: number;

  beforeAll(async () => {
    const hospital = await prisma.hospital.upsert({
      where: { code: "DHQ" },
      update: {},
      create: { code: "DHQ", name: "District Headquarters Teaching Hospital" },
    });
    hospitalId = hospital.id;

    const family = await prisma.family.create({
      data: {
        registrationNo: `${runId}_FAM`,
        dateOfRegistration: new Date(),
        healthCardNo: `${runId}_CARD`,
        shaheedName: "Test Shaheed",
        contactName: "Test Contact",
        contactRelationship: "Spouse",
        contactCnic: `${runId}_CNIC`,
        contactMobile: "03000000000",
        documentsSubmitted: ["CNIC of Applicant"],
        hospitalId,
      },
    });
    familyId = family.id;

    const card = await prisma.healthCard.create({
      data: {
        familyRegistrationNo: family.registrationNo,
        cardNo: `${runId}_HC`,
        qrDigitalVerificationId: `${runId}_QR`,
        status: "ACTIVE",
        specialFlags: [],
        controlFlags: [],
        reviewFlags: [],
      },
    });
    healthCardId = card.id;

    const visit = await prisma.visit.create({
      data: {
        visitNo: `${runId}_VISIT`,
        dateTime: new Date(),
        familyRegistrationNo: family.registrationNo,
        hospitalId,
        beneficiaryName: "Test Beneficiary",
        verification: "VERIFIED",
        natureOfHealthcare: [],
        diagnostics: [],
        medicinesFlags: [],
        sehatFlags: [],
        emergencyFlags: [],
        ambulanceFlags: [],
        healthDeskActions: [],
        feedbackFlags: [],
      },
    });
    visitId = visit.id;
  });

  afterAll(async () => {
    await prisma.sehatClaim.deleteMany({ where: { visitId } });
    await prisma.visit.deleteMany({ where: { id: visitId } });
    await prisma.healthCard.deleteMany({ where: { id: healthCardId } });
    await prisma.familyMember.deleteMany({ where: { familyId } });
    await prisma.family.deleteMany({ where: { id: familyId } });
    await prisma.$disconnect();
  });

  it("migration applied — Prisma client can query the database", async () => {
    const result = await prisma.$queryRaw`SELECT 1 AS one`;
    expect(result).toBeDefined();
  });

  it("required relations work: Family -> FamilyMember", async () => {
    const member = await prisma.familyMember.create({
      data: {
        familyId,
        serialNo: 1,
        name: "Test Member",
        relationship: "Son",
      },
    });
    const found = await prisma.familyMember.findFirst({ where: { familyId } });
    expect(found?.id).toBe(member.id);
  });

  it("enforces unique card no", async () => {
    await expect(
      prisma.healthCard.create({
        data: {
          familyRegistrationNo: "X",
          cardNo: `${runId}_HC`,
          status: "ACTIVE",
          specialFlags: [],
          controlFlags: [],
          reviewFlags: [],
        },
      })
    ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
  });

  it("enforces unique Sehat claim per visit+service", async () => {
    await prisma.sehatClaim.create({ data: { visitId, service: "OPD Consultation" } });
    await expect(
      prisma.sehatClaim.create({ data: { visitId, service: "OPD Consultation" } })
    ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
  });
});

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database connection and hospitals...");
  const hospital = await prisma.hospital.findFirst({
    orderBy: { id: "asc" },
  });

  const hospitalId = hospital ? hospital.id : 1;

  console.log("Upserting Ghazi Family (GZ-FAM-101)...");
  const familyData = {
    registrationNo: "GZ-FAM-101",
    dateOfRegistration: new Date("2024-01-10"),
    healthCardNo: "DG-HC-8801",
    qrDigitalId: "DG-HCQR-8801",

    shaheedName: "Sub-Inspector Tariq Khan (Ghazi)",
    shaheedFatherName: "Ghulam Rasool Khan",
    shaheedCnic: "12101-9876543-1",
    shaheedServiceNo: "KP-POL-5542",
    shaheedRank: "Sub-Inspector",
    shaheedDepartment: "Khyber Pakhtunkhwa Police (Derajat Division)",
    shaheedUnit: "Counter Terrorism Department (CTD)",
    shaheedDateOfShahadat: new Date("2023-08-14"),
    shaheedPlaceOfShahadat: "Dera Ismail Khan",
    shaheedPermanentDistrict: "Dera Ismail Khan",
    shaheedPermanentAddress: "Mohallah Qasaban, Circular Road, D.I. Khan",
    shahadatCertificateNo: "GZ-DISAB-2023-88",
    shahadatIssuingAuthority: "Medical Board & District Police Officer D.I. Khan",

    contactName: "Tariq Khan",
    contactRelationship: "Self (Ghazi Veteran)",
    contactCnic: "12101-9876543-1",
    contactMobile: "0301-8765432",
    contactAltContact: "0345-7654321",
    contactPresentAddress: "House 14, Street 3, Saddar Bazar, D.I. Khan",
    contactDistrict: "Dera Ismail Khan",
    specialDependencyDisability: "Ghazi Veteran - Service Disability / Splinter Injury, Priority Healthcare Access",

    documentsSubmitted: [
      "Official Ghazi Recognition Certificate",
      "Disability Medical Board Order",
      "CNIC",
      "Departmental Verification Letter",
    ],
    documentsOther: "Hospital Medical Category Board Order",

    verificationStatus: "VERIFIED_ELIGIBLE" as const,
    verificationRefNo: "DG-VR-101",
    verificationAuthority: "Derajat Ghazis Welfare Board",
    verificationRemarks: "Verified and approved under Derajat Ghazis healthcare honor initiative.",
    verifiedBy: "DSP Headquarters D.I. Khan",
    verifiedByDesignation: "Welfare Officer",
    verifiedSignatureDate: "2024-01-15",

    cardRegistrationId: "REG-GZ-101",
    cardQrVerificationId: "DG-HCQR-8801",
    cardDateOfIssue: new Date("2024-01-20"),
    cardPhysicalIssued: true,
    cardDigitalRecordCreated: true,
    cardBeneficiariesLinked: true,
    cardSystemUpdated: true,

    hospitalAccessDHQ: true,
    hospitalAccessMMMTH: true,
    hospitalAccessWC: true,
    hospitalId: hospitalId,

    applicantName: "Tariq Khan",
    applicantRelationship: "Self (Ghazi)",
    applicantCnic: "12101-9876543-1",
    applicantSignature: "Tariq Khan (Ghazi)",
    declarationDate: new Date("2024-01-10"),

    authorizationDecision: "APPROVED_FOR_HEALTH_CARD" as const,
    authorizedOfficer: "Medical Superintendent DHQ / DPO D.I. Khan",
    authorizedDesignation: "Hospital Director",
    authorizedSignature: "Official Authorized",
    authorizationDate: new Date("2024-01-20"),
    authorizationRemarks: "Priority healthcare access granted under Ghazis of Derajat scheme.",
  };

  const family = await prisma.family.upsert({
    where: { registrationNo: "GZ-FAM-101" },
    update: familyData,
    create: familyData,
  });
  console.log("Family upserted:", family.id, family.registrationNo);

  // Members
  const members = [
    {
      serialNo: 1,
      name: "Tariq Khan (Ghazi)",
      relationship: "Self (Ghazi)",
      cnicBForm: "12101-9876543-1",
      dobAge: "42",
      mobile: "0301-8765432",
      status: "Active",
      specialDependencyDisability: "Combat Trauma / Mobility Assistance",
      beneficiaryId: "DG-BEN-101-01",
      cardStatus: "Active",
    },
    {
      serialNo: 2,
      name: "Bibi Razia",
      relationship: "Spouse",
      cnicBForm: "12101-2345678-2",
      dobAge: "38",
      mobile: "0301-8765432",
      status: "Active",
      specialDependencyDisability: null,
      beneficiaryId: "DG-BEN-101-02",
      cardStatus: "Active",
    },
    {
      serialNo: 3,
      name: "Hamza Tariq",
      relationship: "Son",
      cnicBForm: "12101-3456789-3",
      dobAge: "16",
      mobile: "0301-8765432",
      status: "Active",
      specialDependencyDisability: null,
      beneficiaryId: "DG-BEN-101-03",
      cardStatus: "Active",
    },
  ];

  for (const m of members) {
    const existing = await prisma.familyMember.findFirst({
      where: { familyId: family.id, serialNo: m.serialNo },
    });
    if (existing) {
      await prisma.familyMember.update({
        where: { id: existing.id },
        data: m,
      });
    } else {
      await prisma.familyMember.create({
        data: { familyId: family.id, ...m },
      });
    }
  }
  console.log("Members added/updated for family.");

  // HealthCard
  const cardData = {
    familyRegistrationNo: "GZ-FAM-101",
    qrDigitalVerificationId: "DG-HCQR-8801",
    dateOfRegistration: new Date("2024-01-10"),
    dateOfCardIssue: new Date("2024-01-20"),
    reviewRevalidationDate: new Date("2025-01-20"),
    status: "ACTIVE" as const,
    specialFlags: [
      "Ghazi Veteran",
      "Priority Combat Care",
      "Prosthetic & Surgical Facilitation",
    ],
    controlFlags: ["Derajat Ghazis Honour Card", "QR / digital record activated"],
    issuedBy: "Derajat Ghazis Desk",
    issuedByDesignation: "Health Desk Focal Person",
    issuedSignatureDate: "2024-01-20",
    accessDHQ: true,
    accessMMMTH: true,
    accessWC: true,
    reviewFlags: ["Verified Ghazi Veteran Record"],
    nextReviewDate: new Date("2027-01-20"),
    reviewedBy: "Medical Superintendent",
    reviewDesignation: "MS DHQ Hospital",
    reviewSignature: "Verified & Authorized",
    authorisedOfficer: "Hospital Director",
    authorisedDesignation: "Hospital Director",
    authorisedSignature: "Authorized",
    authorisedStamp: "DERAJAT GHAZIS",
    authorisedDate: new Date("2024-01-20"),
  };

  const card = await prisma.healthCard.upsert({
    where: { cardNo: "DG-HC-8801" },
    update: cardData,
    create: { cardNo: "DG-HC-8801", ...cardData },
  });
  console.log("HealthCard upserted:", card.id, card.cardNo);

  console.log("SUCCESS! Ghazi Family & Ghazi Card added.");
}

main()
  .catch((e) => {
    console.error("Error adding Ghazi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

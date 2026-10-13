import "dotenv/config";
import {
  Prisma,
  PrismaClient,
  type GrievancePriority,
  type Role,
  type VerificationStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const DEMO_DOMAIN = "@demo.dsfhi.local";
const SEED_MARKER = "Demo seed:";
type Db = Prisma.TransactionClient;
type HospitalCode = "DHQ" | "MMMTH" | "WC";

const HOSPITALS: { code: HospitalCode; name: string }[] = [
  { code: "DHQ", name: "District Headquarters Teaching Hospital, Dera Ismail Khan" },
  { code: "MMMTH", name: "Mufti Mehmood Memorial Teaching Hospital" },
  { code: "WC", name: "Derajat Women & Children Hospital" },
];

// One demo login for each role in the schema.
const DEMO_USERS: {
  username: string;
  role: Role;
  hospitalCode?: HospitalCode;
  name: string;
  designation: string;
}[] = [
  { username: "director", role: "hospital_director", name: "Demo Hospital Director", designation: "Hospital Director" },
  { username: "ms.dhq", role: "medical_superintendent", hospitalCode: "DHQ", name: "Demo Medical Superintendent", designation: "Medical Superintendent" },
  { username: "desk.dhq", role: "health_desk_officer", hospitalCode: "DHQ", name: "Demo Health Desk Officer", designation: "Health Desk Focal Person" },
  { username: "desk.mmmth", role: "health_desk_officer", hospitalCode: "MMMTH", name: "Demo MMMTH Health Desk Officer", designation: "Health Desk Focal Person" },
  { username: "desk.wc", role: "health_desk_officer", hospitalCode: "WC", name: "Demo W&C Health Desk Officer", designation: "Health Desk Focal Person" },
  { username: "wg.admin", role: "admin_finance_rep", name: "Demo Administration Officer", designation: "Administration / Finance Representative" },
  { username: "wg.sehat", role: "sehat_card_desk", name: "Demo Sehat Card Officer", designation: "Sehat Card Plus Representative" },
  { username: "wg.pharmacy", role: "pharmacy_rep", name: "Demo Pharmacy Officer", designation: "Pharmacy Representative" },
  { username: "wg.diagnostics", role: "diagnostics_rep", name: "Demo Diagnostics Officer", designation: "Diagnostics / Radiology Representative" },
  { username: "wg.nursing", role: "nursing_rep", name: "Demo Nursing Officer", designation: "Nursing Representative" },
  { username: "wg.it", role: "it_mis_rep", name: "Demo IT Officer", designation: "IT / MIS Representative" },
  { username: "addl.director", role: "additional_director", name: "Demo Additional Director", designation: "Additional Hospital Director" },
  { username: "super.admin", role: "super_admin", name: "Demo Super Administrator", designation: "Chief System Administrator" },
  { username: "wg.member", role: "working_group_member", name: "Demo Working Group Member", designation: "Working Group General Member" },
];

const PEOPLE = [
  { name: "Ayesha Bibi", father: "Gul Nawaz", relationship: "Spouse", district: "Dera Ismail Khan" },
  { name: "Sanaullah Khan", father: "Akbar Khan", relationship: "Son", district: "Tank" },
  { name: "Nazia Bibi", father: "Rahmatullah", relationship: "Daughter", district: "Bannu" },
  { name: "Faisal Mehmood", father: "Sher Zaman", relationship: "Son", district: "Lakki Marwat" },
  { name: "Shabana Gul", father: "Mian Khan", relationship: "Spouse", district: "Dera Ismail Khan" },
  { name: "Imran Ali", father: "Noor Muhammad", relationship: "Son", district: "Peshawar" },
  { name: "Farzana Begum", father: "Abdul Wali", relationship: "Spouse", district: "Karak" },
  { name: "Javed Iqbal", father: "Nawab Khan", relationship: "Son", district: "Dera Ismail Khan" },
  { name: "Samina Parveen", father: "Fazal Karim", relationship: "Spouse", district: "Kohat" },
  { name: "Bilal Ahmad", father: "Sardar Ali", relationship: "Son", district: "Tank" },
] as const;

const VERIFICATION_STATUSES: VerificationStatus[] = [
  "VERIFIED_ELIGIBLE",
  "PROVISIONALLY_VERIFIED",
  "ADDITIONAL_DOCUMENTATION_REQUIRED",
  "NOT_ELIGIBLE",
  "VERIFIED_ELIGIBLE",
  "VERIFIED_ELIGIBLE",
  "PROVISIONALLY_VERIFIED",
  "VERIFIED_ELIGIBLE",
  "ADDITIONAL_DOCUMENTATION_REQUIRED",
  "VERIFIED_ELIGIBLE",
];

const CARD_STATUSES = [
  "ACTIVE",
  "UNDER_VERIFICATION",
  "ACTIVE",
  "TEMPORARILY_SUSPENDED",
  "ACTIVE",
  "CLOSED",
  "ACTIVE",
  "UNDER_VERIFICATION",
  "ACTIVE",
  "TEMPORARILY_SUSPENDED",
] as const;

const GRIEVANCE_PRIORITIES: GrievancePriority[] = [
  "IMMEDIATE_PATIENT_SAFETY",
  "URGENT",
  "ROUTINE",
  "ROUTINE",
  "URGENT",
  "ROUTINE",
  "IMMEDIATE_PATIENT_SAFETY",
  "ROUTINE",
  "URGENT",
  "ROUTINE",
];

const HEALTHCARE_SERVICES = [
  "OPD Consultation",
  "Pharmacy Medicines",
  "Laboratory Investigations",
  "Emergency Care",
  "Radiology / Imaging",
  "Specialist Consultation",
  "Inpatient Admission",
  "Maternal Healthcare",
  "Follow-up Visit",
  "Sehat Card Plus Facilitation",
] as const;

function id3(value: number) {
  return String(value).padStart(3, "0");
}

function dateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(10, 0, 0, 0);
  return date;
}

function fakeCnic(group: number) {
  // 99999-prefixed identifiers are synthetic demo values, not beneficiary CNICs.
  return "99999-" + String(1_000_000 + group).padStart(7, "0") + "-9";
}

function mobile(index: number) {
  return "0300-" + String(100_0000 + index).padStart(7, "0");
}

async function upsertDemoChild<T extends { id: number }>(
  existing: T | null,
  update: (id: number) => Promise<unknown>,
  create: () => Promise<unknown>,
) {
  if (existing) await update(existing.id);
  else await create();
}

async function deleteAllApplicationData(db: Db) {
  // Delete children first so this works with MySQL foreign-key checks enabled.
  await db.actionTracker.deleteMany();
  await db.monthlyReport.deleteMany();
  await db.sehatClaim.deleteMany();
  await db.visit.deleteMany();
  await db.grievance.deleteMany();
  await db.cardUpdateHistory.deleteMany();
  await db.lostDamagedCard.deleteMany();
  await db.beneficiaryStatusChange.deleteMany();
  await db.misuseFlag.deleteMany();
  await db.healthCard.deleteMany();
  await db.familyMember.deleteMany();
  await db.family.deleteMany();
  await db.user.deleteMany();
  await db.auditLog.deleteMany();
  await db.hospital.deleteMany();
}

async function populateDemoData(db: Db, passwordHash: string) {
  const hospitals: Record<HospitalCode, number> = { DHQ: 0, MMMTH: 0, WC: 0 };
  for (const hospital of HOSPITALS) {
    const row = await db.hospital.upsert({
      where: { code: hospital.code },
      update: { name: hospital.name },
      create: hospital,
    });
    hospitals[hospital.code] = row.id;
  }

  // Remove only the four extra accounts created by the older demo seed.
  await db.user.deleteMany({
    where: {
      email: {
        in: [
          "ms.mmmth" + DEMO_DOMAIN,
          "ms.wc" + DEMO_DOMAIN,
          "desk.mmmth" + DEMO_DOMAIN,
          "desk.wc" + DEMO_DOMAIN,
        ],
      },
    },
  });

  for (const user of DEMO_USERS) {
    const email = user.username + DEMO_DOMAIN;
    await db.user.upsert({
      where: { email },
      update: {
        name: user.name,
        role: user.role,
        hospitalId: user.hospitalCode ? hospitals[user.hospitalCode] : null,
        designation: user.designation,
        isActive: true,
        // Demo accounts sign straight in; never strand them on the change-password page.
        mustChangePassword: false,
      },
      create: {
        name: user.name,
        email,
        passwordHash,
        role: user.role,
        hospitalId: user.hospitalCode ? hospitals[user.hospitalCode] : null,
        designation: user.designation,
        isActive: true,
        mustChangePassword: false,
      },
    });
  }

  const familyIds: number[] = [];
  const familyNumbers: string[] = [];
  const cardNumbers: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const suffix = id3(i);
    const person = PEOPLE[i - 1];
    const registrationNo = "DEMO-FAM-" + suffix;
    const cardNo = "DEMO-HC-" + suffix;
    familyNumbers.push(registrationNo);
    cardNumbers.push(cardNo);

    const verificationStatus = VERIFICATION_STATUSES[i - 1];
    const approved = verificationStatus === "VERIFIED_ELIGIBLE";
    const familyData = {
      dateOfRegistration: dateDaysAgo(35 - i * 2),
      healthCardNo: cardNo,
      qrDigitalId: "DEMO-QR-" + suffix,
      shaheedName: "Late " + person.father + " Khan",
      shaheedFatherName: "Muhammad " + person.father,
      shaheedCnic: fakeCnic(i),
      shaheedServiceNo: "DSF-" + String(43000 + i),
      shaheedRank: ["Sepoy", "Lance Naik", "Naik", "Havildar"][i % 4],
      shaheedDepartment: "Security Services",
      shaheedUnit: "Regional Unit " + (i % 3 + 1),
      shaheedDateOfShahadat: dateDaysAgo(400 + i * 28),
      shaheedPlaceOfShahadat: person.district + " District",
      shaheedPermanentDistrict: person.district,
      shaheedPermanentAddress: "House " + (20 + i) + ", Main Road, " + person.district,
      shahadatCertificateNo: "SC-" + suffix + "-2025",
      shahadatIssuingAuthority: "District Verification Office",
      contactName: person.name,
      contactRelationship: person.relationship,
      contactCnic: fakeCnic(i + 20),
      contactMobile: mobile(i),
      contactAltContact: mobile(i + 30),
      contactPresentAddress: "Street " + (i + 2) + ", " + person.district,
      contactDistrict: person.district,
      specialDependencyDisability: i % 4 === 0 ? "Dependent parent requiring mobility assistance" : null,
      documentsSubmitted: [
        "Official Shahadat Certificate / Verification",
        "CNIC of Applicant",
        "Family Registration Certificate",
      ],
      documentsOther: i % 3 === 0 ? "Recent hospital referral letter" : null,
      verificationStatus,
      verificationRefNo: "DEMO-VR-" + suffix,
      verificationAuthority: "DSFHI District Review Committee",
      verificationRemarks: approved ? "Documents checked and verified." : "Follow-up review recorded for demonstration.",
      verifiedBy: "Demo Verification Officer " + (i % 3 + 1),
      verifiedByDesignation: "Verification Officer",
      verifiedSignatureDate: dateDaysAgo(30 - i).toISOString().slice(0, 10),
      cardRegistrationId: approved ? "REG-" + suffix : null,
      cardQrVerificationId: approved ? "DEMO-HCQR-" + suffix : null,
      cardDateOfIssue: approved ? dateDaysAgo(20 - i) : null,
      cardPhysicalIssued: approved && i % 2 === 0,
      cardDigitalRecordCreated: approved,
      cardBeneficiariesLinked: approved,
      cardSystemUpdated: approved,
      hospitalAccessDHQ: true,
      hospitalAccessMMMTH: i % 2 === 0,
      hospitalAccessWC: i % 3 === 0,
      hospitalId: hospitals[HOSPITALS[(i - 1) % HOSPITALS.length].code],
      applicantName: person.name,
      applicantRelationship: person.relationship,
      applicantCnic: fakeCnic(i + 20),
      applicantSignature: "Demo signature: " + person.name,
      declarationDate: dateDaysAgo(38 - i * 2),
      authorizationDecision: approved ? "APPROVED_FOR_HEALTH_CARD" as const : "RETURNED_FOR_COMPLETION" as const,
      authorizedOfficer: approved ? "Demo Authorizing Officer" : null,
      authorizedDesignation: approved ? "Hospital Director" : null,
      authorizedSignature: approved ? "Demo authorization signature" : null,
      authorizationDate: approved ? dateDaysAgo(18 - i) : null,
    };

    const family = await db.family.upsert({
      where: { registrationNo },
      update: familyData,
      create: { registrationNo, ...familyData },
    });
    familyIds.push(family.id);

    const memberData = {
      serialNo: 1,
      name: person.name,
      relationship: person.relationship,
      cnicBForm: fakeCnic(i + 40),
      dobAge: String(24 + (i * 3) % 45),
      mobile: mobile(i),
      status: i === 10 ? "Pending Review" : "Active",
      specialDependencyDisability: i % 4 === 0 ? "Mobility assistance required" : null,
      beneficiaryId: "DEMO-BEN-" + suffix,
      cardStatus: CARD_STATUSES[i - 1],
    };
    const existingMember = await db.familyMember.findFirst({
      where: { familyId: family.id, serialNo: 1 },
    });
    if (existingMember) {
      await db.familyMember.update({ where: { id: existingMember.id }, data: memberData });
    } else {
      await db.familyMember.create({ data: { familyId: family.id, ...memberData } });
    }
  }

  // Convert the older demo seed's extra sample members to ten consistent family records.
  await db.familyMember.deleteMany({
    where: {
      familyId: { in: familyIds },
      name: { startsWith: "Demo Member " },
      serialNo: { not: 1 },
    },
  });

  const cardIds: number[] = [];
  for (let i = 1; i <= 5; i++) {
    const suffix = id3(i);
    const person = PEOPLE[i - 1];
    const status = CARD_STATUSES[i - 1];
    const cardNo = cardNumbers[i - 1];
    const cardData = {
      familyRegistrationNo: familyNumbers[i - 1],
      qrDigitalVerificationId: "DEMO-HCQR-" + suffix,
      dateOfRegistration: dateDaysAgo(35 - i * 2),
      dateOfCardIssue: status === "ACTIVE" ? dateDaysAgo(18 - (i % 8)) : null,
      reviewRevalidationDate: dateDaysAgo(2 - i),
      status,
      specialFlags: i % 3 === 0 ? ["Elderly dependant", "Priority facilitation"] : ["Family card"],
      controlFlags: ["Family card", "QR / digital record activated"],
      issuedBy: "Demo Card Desk",
      issuedByDesignation: "Health Desk Focal Person",
      issuedSignatureDate: dateDaysAgo(18 - (i % 8)).toISOString().slice(0, 10),
      accessDHQ: true,
      accessMMMTH: i % 2 === 0,
      accessWC: i % 3 === 0,
      reviewFlags: i % 4 === 0 ? ["Updated family particulars", "Revalidation required"] : ["Family particulars confirmed"],
      nextReviewDate: dateDaysAgo(-180),
      reviewedBy: "Demo Reviewer " + (i % 3 + 1),
      reviewDesignation: "Medical Superintendent",
      reviewSignature: "Demo review signature",
      authorisedOfficer: "Demo Hospital Director",
      authorisedDesignation: "Hospital Director",
      authorisedSignature: "Demo approval signature",
      authorisedStamp: "DEMO",
      authorisedDate: dateDaysAgo(16 - (i % 8)),
    };
    const card = await db.healthCard.upsert({
      where: { cardNo },
      update: cardData,
      create: { cardNo, ...cardData },
    });
    cardIds.push(card.id);

    const historyData = {
      healthCardId: card.id,
      date: dateDaysAgo(i + 1),
      natureOfUpdate: SEED_MARKER + " periodic review " + suffix,
      beneficiaryAffected: person.name,
      reason: "Annual family particulars review",
      verifiedBy: "Demo Card Reviewer",
    };
    const oldHistory = await db.cardUpdateHistory.findFirst({
      where: { healthCardId: card.id, natureOfUpdate: historyData.natureOfUpdate },
    });
    await upsertDemoChild(
      oldHistory,
      (id) => db.cardUpdateHistory.update({ where: { id }, data: historyData }),
      () => db.cardUpdateHistory.create({ data: historyData }),
    );

    const lostData = {
      healthCardId: card.id,
      dateReported: dateDaysAgo(12 + i),
      previousCardNo: "DEMO-OLD-" + suffix,
      replacementCardNo: i % 2 === 0 ? cardNo : null,
      replacementDate: i % 2 === 0 ? dateDaysAgo(8 + i) : null,
      reasonRemarks: SEED_MARKER + (i % 2 === 0 ? " replacement issued after reported loss" : " damaged card awaiting replacement"),
      authorisedBy: i % 2 === 0 ? "Demo Authorizing Officer" : null,
    };
    const oldLost = await db.lostDamagedCard.findFirst({
      where: { healthCardId: card.id, previousCardNo: lostData.previousCardNo },
    });
    await upsertDemoChild(
      oldLost,
      (id) => db.lostDamagedCard.update({ where: { id }, data: lostData }),
      () => db.lostDamagedCard.create({ data: lostData }),
    );

    const statusChangeData = {
      healthCardId: card.id,
      beneficiaryName: person.name,
      previousStatus: "Pending",
      newStatus: "Active",
      effectiveDate: dateDaysAgo(10 + i),
      reason: "Eligibility documents reviewed",
      supportingDocument: "DEMO-SUPPORT-" + suffix,
      verifiedBy: "Demo Status Officer",
    };
    const oldStatusChange = await db.beneficiaryStatusChange.findFirst({
      where: { healthCardId: card.id, beneficiaryName: person.name },
    });
    await upsertDemoChild(
      oldStatusChange,
      (id) => db.beneficiaryStatusChange.update({ where: { id }, data: statusChangeData }),
      () => db.beneficiaryStatusChange.create({ data: statusChangeData }),
    );

    const misuseData = {
      healthCardId: card.id,
      flagType: [
        "Suspected Impersonation",
        "Duplicate Beneficiary Registration",
        "Altered / Fraudulent Documentation",
        "Duplicate Healthcare Claim",
        "Other Suspected Misuse",
      ][(i - 1) % 5],
      remarks: SEED_MARKER + " review sample " + suffix + "; follow-up recorded for testing.",
      createdAt: dateDaysAgo(i),
    };
    const oldMisuse = await db.misuseFlag.findFirst({
      where: { healthCardId: card.id, remarks: misuseData.remarks },
    });
    await upsertDemoChild(
      oldMisuse,
      (id) => db.misuseFlag.update({ where: { id }, data: misuseData }),
      () => db.misuseFlag.create({ data: misuseData }),
    );
  }

  const visitIds: number[] = [];
  for (let i = 1; i <= 5; i++) {
    const suffix = id3(i);
    const person = PEOPLE[i - 1];
    const hospitalCode = HOSPITALS[(i - 1) % HOSPITALS.length].code;
    const emergency = i === 4 || i === 9;
    const visitNo = "DEMO-VIS-" + suffix;
    const service = HEALTHCARE_SERVICES[i - 1];
    const visitData = {
      dateTime: dateDaysAgo(i - 1),
      familyRegistrationNo: familyNumbers[i - 1],
      healthCardNo: cardNumbers[i - 1],
      hospitalId: hospitals[hospitalCode],
      beneficiaryName: person.name,
      beneficiaryFatherHusbandGuardian: person.father,
      beneficiaryCnicBForm: fakeCnic(i + 40),
      beneficiaryRelationship: person.relationship,
      beneficiaryMobile: mobile(i),
      shaheedName: "Late " + person.father + " Khan",
      verification: emergency
        ? "EMERGENCY_VERIFICATION_IN_PROCESS" as const
        : i % 3 === 0
          ? "VERIFICATION_CONFIRMED_DIGITALLY" as const
          : "VERIFIED" as const,
      verificationPending: emergency,
      facilitationOfficer: "Demo Health Desk Officer",
      natureOfHealthcare: [service],
      natureOther: i === 10 ? "Follow-up coordination" : null,
      department: ["Medicine", "Paediatrics", "Surgery", "Radiology", "Emergency"][i % 5],
      consultant: "Dr. Demo Consultant " + (i % 4 + 1),
      opdMrNo: "MR-" + suffix + "-26",
      diagnosis: ["Seasonal infection", "Follow-up assessment", "Diagnostic review", "Routine consultation"][i % 4],
      treatmentPlan: "Assessment completed and follow-up guidance provided.",
      followUpDate: dateDaysAgo(-14),
      diagnostics: i % 3 === 0 ? ["Complete blood count", "Basic chemistry"] : [],
      investigationsStatus: i % 3 === 0 ? "COMPLETED" as const : "PENDING" as const,
      medicinesFlags: i % 2 === 0 ? ["Prescription issued"] : ["No medicine required"],
      medicinesRemarks: i % 2 === 0 ? "Demo prescription recorded." : null,
      ward: i === 7 ? "Medical Ward" : null,
      admissionDate: i === 7 ? dateDaysAgo(1) : null,
      procedureName: i === 7 ? "Clinical assessment" : null,
      consultantUnit: i === 7 ? "Demo Medical Unit" : null,
      procedureDate: i === 7 ? dateDaysAgo(1) : null,
      procedureStatus: i === 7 ? "COMPLETED" as const : null,
      sehatFlags: i % 2 === 0 ? ["Sehat Card Plus eligibility checked"] : [],
      sehatCaseRef: i % 2 === 0 ? "DEMO-SEHAT-" + suffix : null,
      emergencyFlags: emergency ? ["Emergency case", "Verification undertaken concurrently"] : [],
      ambulanceFromTo: i === 9 ? "Residence to DHQ Emergency" : null,
      ambulanceDateTime: i === 9 ? dateDaysAgo(1) : null,
      referralFacility: i === 10 ? "Mufti Mehmood Memorial Teaching Hospital" : null,
      referralReason: i === 10 ? "Specialist assessment requested" : null,
      referringConsultant: i === 10 ? "Dr. Demo Referring Consultant" : null,
      ambulanceFlags: i === 9 ? ["Ambulance facilitated"] : [],
      healthDeskActions: ["Registration", "Eligibility check", "Service coordination"],
      issueEncountered: i % 4 === 0 ? "Verification document follow-up" : null,
      actionTaken: "Beneficiary guided to the appropriate service desk.",
      finalStatus: emergency ? "Emergency care initiated" : "Facilitation completed",
      feedbackFlags: i % 3 === 0 ? ["Satisfied with guidance"] : [],
      feedbackComments: "Demo feedback recorded after the visit.",
      feedbackSignature: "Demo beneficiary signature",
      certOfficer: "Demo Health Desk Officer",
      certDesignation: "Health Desk Focal Person",
      certSignatureDate: dateDaysAgo(i - 1).toISOString().slice(0, 10),
      escalatedTo: emergency ? "Medical Superintendent" : null,
      actionDecision: emergency ? "Emergency care first; verify concurrently" : "Facilitation completed",
      authorisedOfficerSignature: emergency ? "Demo MS signature" : null,
    };
    const visit = await db.visit.upsert({
      where: { visitNo },
      update: visitData,
      create: { visitNo, ...visitData },
    });
    visitIds.push(visit.id);

    const claimData = {
      visitId: visit.id,
      service,
      claimRef: "DEMO-CLAIM-" + suffix,
      serviceDate: dateDaysAgo(i - 1),
      status: ["Submitted", "Approved", "Under review", "Paid"][i % 4],
      familyRegistrationNo: familyNumbers[i - 1],
    };
    await db.sehatClaim.upsert({
      where: { visitId_service: { visitId: visit.id, service } },
      update: claimData,
      create: claimData,
    });
  }

  for (let i = 1; i <= 5; i++) {
    const suffix = id3(i);
    const person = PEOPLE[i - 1];
    const priority = GRIEVANCE_PRIORITIES[i - 1];
    const isRedAlert = priority === "IMMEDIATE_PATIENT_SAFETY";
    const grievanceNo = "DEMO-GRV-" + suffix;
    const grievanceData = {
      dateTime: dateDaysAgo(i + 1),
      priority,
      hospitalId: hospitals[HOSPITALS[(i - 1) % HOSPITALS.length].code],
      beneficiaryName: person.name,
      familyRegistrationNo: familyNumbers[i - 1],
      healthCardNo: cardNumbers[i - 1],
      cnicBForm: fakeCnic(i + 40),
      relationshipWithShaheed: person.relationship,
      shaheedName: "Late " + person.father + " Khan",
      contactNo: mobile(i),
      department: ["Emergency", "Medicine", "Pharmacy", "Registration"][i % 4],
      healthDesk: "Demo Health Desk",
      incidentDateTime: dateDaysAgo(i + 2),
      natureFlags: ["Registration / Verification Delay", "Service Coordination"],
      natureOther: i % 3 === 0 ? "Follow-up requested" : null,
      issueDescription: isRedAlert
        ? "Demo urgent case: emergency assessment started while verification continued."
        : "Demo case: beneficiary requested help with service coordination and follow-up.",
      immediateHealthcareNeed: isRedAlert,
      delayMayAffectCare: isRedAlert,
      redFlags: isRedAlert ? ["Emergency treatment needs prompt coordination"] : [],
      isRedAlert,
      amberFlags: priority === "URGENT" ? ["Significant avoidable delay"] : [],
      greenFlags: priority === "ROUTINE" ? ["General facilitation issue"] : [],
      complaintReceivedBy: "Demo Desk Officer",
      receivedByDesignation: "Health Desk Focal Person",
      timeReceived: "10:" + String(i * 4).padStart(2, "0"),
      immediateActionTaken: "Case acknowledged and routed to the responsible department.",
      resolvedAtHealthDesk: i % 2 === 0 ? "Initial guidance provided; follow-up recorded." : null,
      escalatedTo: isRedAlert || priority === "URGENT" ? "Medical Superintendent" : null,
      escalationDesignation: isRedAlert || priority === "URGENT" ? "Medical Superintendent" : null,
      escalatedDateTime: isRedAlert || priority === "URGENT" ? dateDaysAgo(i).toISOString() : null,
      escalationReason: isRedAlert ? "Immediate patient safety review" : priority === "URGENT" ? "Urgent service delay review" : null,
      escalationModes: isRedAlert ? ["Telephone", "Written referral"] : priority === "URGENT" ? ["Written referral"] : [],
      actionTaken: "Department contacted and beneficiary updated.",
      responsibleDeptOfficer: "Demo Department Officer",
      resolutionDateTime: i % 3 === 0 ? dateDaysAgo(0).toISOString() : null,
      outcome: i % 3 === 0 ? "FULLY_RESOLVED" as const : "FURTHER_ACTION_REQUIRED" as const,
      remarks: "Synthetic demo grievance for interface and endpoint checks.",
      issueExplainedAppropriately: true,
      facilitationProvided: i % 2 === 0 ? "YES" as const : "PARTIALLY" as const,
      furtherAssistanceRequired: i % 3 !== 0,
      beneficiaryComments: "Demo beneficiary feedback recorded.",
      beneficiaryNameSignature: "Demo signature: " + person.name,
      beneficiarySignatureDate: dateDaysAgo(0).toISOString().slice(0, 10),
      rootCause: "Documentation follow-up or inter-department coordination.",
      correctiveAction: "Review the case and confirm the next service step.",
      preventiveActionRequired: "Keep the beneficiary informed during follow-up.",
      responsibleOfficerDept: "Health Desk",
      targetCompletionDate: dateDaysAgo(-5),
      actionCompleted: i % 3 === 0 ? "YES" as const : "IN_PROGRESS" as const,
      requiresWorkingGroupReview: isRedAlert,
      reviewedBy: isRedAlert ? "Demo Working Group Convener" : null,
      observations: isRedAlert ? "Emergency pathway reviewed." : null,
      furtherDirections: isRedAlert ? "Continue care first and document verification." : null,
      reviewSignatureDate: isRedAlert ? dateDaysAgo(0).toISOString().slice(0, 10) : null,
      closureStatus: i % 3 === 0 ? "RESOLVED_CLOSED" as const : "PENDING_FOLLOW_UP" as const,
      closedBy: i % 3 === 0 ? "Demo Desk Officer" : null,
      closedByDesignation: i % 3 === 0 ? "Health Desk Focal Person" : null,
      closureSignature: i % 3 === 0 ? "Demo closure signature" : null,
      closureDate: i % 3 === 0 ? dateDaysAgo(0).toISOString().slice(0, 10) : null,
    };
    await db.grievance.upsert({
      where: { grievanceNo },
      update: grievanceData,
      create: { grievanceNo, ...grievanceData },
    });
  }

  const reportIds: number[] = [];
  for (let i = 1; i <= 5; i++) {
    const suffix = id3(i);
    const reportDate = dateDaysAgo((i - 1) * 28 + 3);
    const reportData = {
      month: reportDate.getMonth() + 1,
      year: reportDate.getFullYear(),
      dateOfSubmission: reportDate,
      hospitalId: hospitals[HOSPITALS[(i - 1) % HOSPITALS.length].code],
      isConsolidated: false,
      healthDeskFocalPerson: "Demo Health Desk Officer",
      contactNo: mobile(i),
      sehatMajorIssues: "Periodic authorization follow-up for eligible families.",
      sehatCorrectiveAction: "Coordinate outstanding cases with the Sehat Card Plus desk.",
      emergencyDelayReason: i % 3 === 0 ? "Referral coordination required additional time." : null,
      emergencyCorrectiveAction: "Emergency stabilization remained the first priority.",
      majorOperationalIssues: i % 2 === 0 ? "Peak-hour registration workload." : "No major operational issue reported.",
      dignityComplaintsActionTaken: "Beneficiary privacy and respectful communication reviewed.",
      majorGrievanceNature: "Service coordination and verification follow-up.",
      grievanceCorrectiveAction: "Track each open issue through the action tracker.",
      serviceGapFlags: i % 2 === 0 ? ["Referral coordination", "Peak-hour staffing"] : ["Documentation follow-up"],
      rootCauseExplanation: "Variation in documentation completeness and service demand.",
      correctiveActionRequired: "Continue inter-department follow-up and staff coordination.",
      exceptionalCaseReported: i % 4 === 0,
      exceptionalCaseReferenceNo: i % 4 === 0 ? "DEMO-EXC-" + suffix : null,
      exceptionalCaseDescription: i % 4 === 0 ? "Synthetic report example for an urgent referral." : null,
      exceptionalCaseImmediateAction: i % 4 === 0 ? "Emergency team was notified." : null,
      exceptionalCaseFurtherAction: i % 4 === 0 ? "Review the case at the next working group meeting." : null,
      achievements: "Improved beneficiary guidance and digital record completion.",
      challenges: "Follow-up workload and occasional incomplete documents.",
      correctiveMeasures: "Use the shared tracker and confirm ownership of each action.",
      recommendationsForHospitalDirector: "Continue regular review of open cases.",
      focalPersonSignature: "Demo focal person signature",
      hospitalRepresentativeSignature: "Demo hospital representative signature",
      chairmanComments: "Review completed for demonstration data.",
      directorDirectionsSignature: "Demo director directions signature",
      statsSnapshot: {
        registrations: 10 + i * 2,
        verifiedFamilies: 6 + (i % 5),
        visits: 12 + i * 3,
        openGrievances: i % 4,
      },
    };
    const reportNo = "DEMO-RPT-" + suffix;
    const report = await db.monthlyReport.upsert({
      where: { reportNo },
      update: reportData,
      create: { reportNo, ...reportData },
    });
    reportIds.push(report.id);

    const actionData = {
      monthlyReportId: report.id,
      issue: SEED_MARKER + " service coordination follow-up " + suffix,
      responsibleOfficerDepartment: ["Health Desk", "Pharmacy", "Radiology", "Administration"][i % 4],
      targetDate: dateDaysAgo(-5 - i),
      status: ["In progress", "Completed", "Pending department response"][i % 3],
    };
    const oldAction = await db.actionTracker.findFirst({
      where: { monthlyReportId: report.id, issue: actionData.issue },
    });
    await upsertDemoChild(
      oldAction,
      (id) => db.actionTracker.update({ where: { id }, data: actionData }),
      () => db.actionTracker.create({ data: actionData }),
    );
  }

  for (let i = 1; i <= 5; i++) {
    const entity = ["Family", "HealthCard", "Visit", "SehatClaim", "Grievance"][i % 5];
    const entityIds = [familyIds[i - 1], cardIds[i - 1], visitIds[i - 1], visitIds[i - 1], i];
    const auditData = {
      who: "seed" + DEMO_DOMAIN,
      role: DEMO_USERS[i % DEMO_USERS.length].role,
      action: "Seeded demo record",
      entity,
      entityId: String(entityIds[i % 5]),
      hospitalId: hospitals[HOSPITALS[(i - 1) % HOSPITALS.length].code],
      createdAt: dateDaysAgo(i),
    };
    const existingAudit = await db.auditLog.findFirst({
      where: {
        who: auditData.who,
        action: auditData.action,
        entity: auditData.entity,
        entityId: auditData.entityId,
      },
    });
    await upsertDemoChild(
      existingAudit,
      (id) => db.auditLog.update({ where: { id }, data: auditData }),
      () => db.auditLog.create({ data: auditData }),
    );
  }

  const counts = {
    Hospital: await db.hospital.count(),
    User: await db.user.count({ where: { email: { endsWith: DEMO_DOMAIN } } }),
    Family: await db.family.count({ where: { registrationNo: { startsWith: "DEMO-FAM-" } } }),
    FamilyMember: await db.familyMember.count({ where: { familyId: { in: familyIds }, serialNo: 1 } }),
    HealthCard: await db.healthCard.count({ where: { cardNo: { startsWith: "DEMO-HC-" } } }),
    CardUpdateHistory: await db.cardUpdateHistory.count({ where: { natureOfUpdate: { startsWith: SEED_MARKER } } }),
    LostDamagedCard: await db.lostDamagedCard.count({ where: { reasonRemarks: { startsWith: SEED_MARKER } } }),
    BeneficiaryStatusChange: await db.beneficiaryStatusChange.count({ where: { supportingDocument: { startsWith: "DEMO-SUPPORT-" } } }),
    MisuseFlag: await db.misuseFlag.count({ where: { remarks: { startsWith: SEED_MARKER } } }),
    Visit: await db.visit.count({ where: { visitNo: { startsWith: "DEMO-VIS-" } } }),
    SehatClaim: await db.sehatClaim.count({ where: { claimRef: { startsWith: "DEMO-CLAIM-" } } }),
    Grievance: await db.grievance.count({ where: { grievanceNo: { startsWith: "DEMO-GRV-" } } }),
    MonthlyReport: await db.monthlyReport.count({ where: { reportNo: { startsWith: "DEMO-RPT-" } } }),
    ActionTracker: await db.actionTracker.count({ where: { issue: { startsWith: SEED_MARKER } } }),
    AuditLog: await db.auditLog.count({ where: { who: "seed" + DEMO_DOMAIN } }),
  };

  console.log("\n=== DSFHI DEMO SEED SUMMARY ===");
  for (const [model, count] of Object.entries(counts)) {
    console.log(model.padEnd(26) + count);
  }
  console.log("\nDemo password: value of SEED_DEMO_PASSWORD");
  console.log("Demo usernames: " + DEMO_USERS.map((user) => user.username).join(", "));
}

export async function runSeed(password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  await populateDemoData(prisma, passwordHash);
}

export async function resetAndSeed(password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction(
    async (tx) => {
      await deleteAllApplicationData(tx);
      await populateDemoData(tx, passwordHash);
    },
    { maxWait: 10_000, timeout: 120_000 },
  );
}

async function main() {
  const password = process.env.SEED_DEMO_PASSWORD;
  if (!password) {
    console.error("ERROR: SEED_DEMO_PASSWORD is not set. Add it to .env and re-run.");
    process.exitCode = 1;
    return;
  }

  if (process.argv.includes("--reset")) {
    console.warn("FULL RESET: every row in every application table will be deleted before seeding.");
    await resetAndSeed(password);
  } else {
    await runSeed(password);
  }
}

if (process.argv[1] && process.argv[1].toLowerCase().endsWith("seed.ts")) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

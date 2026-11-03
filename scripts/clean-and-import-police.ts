import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";
import * as fs from "fs";
import * as path from "path";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function cleanText(val: unknown): string {
  if (val === undefined || val === null) return "";
  return String(val).trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function parseLines(val: unknown): string[] {
  const text = cleanText(val);
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.replace(/^\d+[\.\)\-]?\s*/, "").trim())
    .filter(Boolean);
}

function extractCnic(str: string): string | null {
  const match = str.match(/\d{5}-\d{7}-\d/);
  return match ? match[0] : null;
}

async function runInChunks<T>(items: T[], chunkSize: number, fn: (item: T, idx: number) => Promise<void>) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await Promise.all(chunk.map((item, index) => fn(item, i + index)));
    process.stdout.write(`\r  → Processed ${Math.min(i + chunkSize, items.length)} / ${items.length} records...`);
  }
  console.log("");
}

async function main() {
  console.log("==================================================");
  console.log("   SHUHADA & GHAZIAN POLICE DATA CLEAN & IMPORT   ");
  console.log("==================================================");

  // 1. CLEAN EXISTING DATA (Keep Users and Hospitals!)
  console.log("\n[1/4] Cleaning existing application data (keeping Users & Hospitals)...");
  await prisma.actionTracker.deleteMany();
  await prisma.reportIndicator.deleteMany();
  await prisma.monthlyReport.deleteMany();
  await prisma.sehatClaim.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.cardUpdateHistory.deleteMany();
  await prisma.lostDamagedCard.deleteMany();
  await prisma.beneficiaryStatusChange.deleteMany();
  await prisma.misuseFlag.deleteMany();
  await prisma.healthCard.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.document.deleteMany();
  await prisma.family.deleteMany();
  await prisma.auditLog.deleteMany();
  console.log("✓ Application tables cleaned successfully.");

  const dhq = (await prisma.hospital.findFirst({ where: { code: "DHQ" } })) || (await prisma.hospital.findFirst());
  const hospitalId = dhq ? dhq.id : null;

  const shaheedDir = path.join(process.cwd(), "public", "images", "police", "shaheed");
  const ghaziDir = path.join(process.cwd(), "public", "images", "police", "ghazi");
  const sFiles = fs.existsSync(shaheedDir) ? fs.readdirSync(shaheedDir) : [];
  const gFiles = fs.existsSync(ghaziDir) ? fs.readdirSync(ghaziDir) : [];

  // 2. IMPORT SHUHADA (252 Records)
  console.log("\n[2/4] Reading Shuhada Police Excel file...");
  const sWb = xlsx.readFile(
    path.join(process.cwd(), "Police", "Shuhada E Police DIKhan Detail for PVC Health Card Final Setting.xlsx")
  );
  const sSheet = sWb.Sheets[sWb.SheetNames[0]];
  const sRows: any[] = xlsx.utils.sheet_to_json(sSheet);

  const shuhadaData = sRows
    .slice(2)
    .filter((r) => r["Name of Shaheed"] && cleanText(r["Name of Shaheed"]).toLowerCase() !== "name of shaheed");
  console.log(`✓ Found ${shuhadaData.length} valid Shuhada records to import.`);

  let totalMembers = 0;

  await runInChunks(shuhadaData, 12, async (row, i) => {
    const index = i + 1;
    const regNo = `DS-2024-${String(index).padStart(4, "0")}`;
    const cardNo = `DSFHC-${String(index).padStart(6, "0")}`;
    const qrId = `DSFQR-${randomBytes(16).toString("hex")}`;

    const rawName = cleanText(row["Name of Shaheed"]);
    const rawBelt = cleanText(row["I-Card No / Belt No:"]);
    const rawDept = cleanText(row["Department"]) || "Police";
    const rawDistrict = cleanText(row["District"]) || "Dera Ismail Khan";

    const heirs = parseLines(row["LEGAL HEIRS OF SHAHEED"]);
    const relations = parseLines(row["RELATION"]);
    const cnics = parseLines(row["CNIC"]);

    const primaryHeir = heirs[0] || `Family of ${rawName}`;
    const primaryRel = relations[0] || "Next of Kin";
    const primaryCnic =
      extractCnic(cnics[0] || "") ||
      (cnics[0] ? cnics[0].replace(/[^0-9\-]/g, "").slice(0, 15) : "12101-0000000-1");

    const photoField = cleanText(row["Photo"]);
    const numMatch = photoField.match(/\d+/);
    let photoFilename: string | null = null;
    if (numMatch) {
      const matchFile = sFiles.find((f) => f.toLowerCase().includes(`shaheed_${numMatch[0]}.`));
      if (matchFile) photoFilename = matchFile;
    }

    const shaheedCnic = extractCnic(rawBelt);

    // Prepare members
    const membersToInsert = [];
    if (heirs.length === 0) {
      membersToInsert.push({
        serialNo: 1,
        name: primaryHeir,
        relationship: primaryRel,
        cnicBForm: primaryCnic,
        status: "Active",
        beneficiaryId: `${regNo}-01`,
        cardStatus: "ACTIVE",
      });
    } else {
      for (let h = 0; h < heirs.length; h++) {
        const heirName = heirs[h];
        const rel = relations[h] || "Dependent";
        const rawC = cnics[h] || "";
        const cnic = extractCnic(rawC) || (rawC.trim() ? rawC.trim().slice(0, 15) : null);
        membersToInsert.push({
          serialNo: h + 1,
          name: heirName,
          relationship: rel,
          cnicBForm: cnic,
          status: "Active",
          beneficiaryId: `${regNo}-${String(h + 1).padStart(2, "0")}`,
          cardStatus: "ACTIVE",
        });
      }
    }
    totalMembers += membersToInsert.length;

    // Single nested insert for Family + Members + Document
    await prisma.family.create({
      data: {
        registrationNo: regNo,
        dateOfRegistration: new Date("2024-01-15T00:00:00Z"),
        healthCardNo: cardNo,
        qrDigitalId: qrId,
        shaheedName: rawName,
        shaheedDepartment: rawDept,
        shaheedServiceNo: rawBelt,
        shaheedCnic: shaheedCnic,
        shaheedPermanentDistrict: rawDistrict,
        contactName: primaryHeir,
        contactRelationship: primaryRel,
        contactCnic: primaryCnic,
        contactMobile: "0300-0000000",
        documentsSubmitted: ["Shahadat Certificate", "Service Record", "Family CNIC Verification"],
        verificationStatus: "VERIFIED_ELIGIBLE",
        verificationAuthority: "District Police Office / Shuhada Cell",
        verifiedBy: "Superintendent of Police",
        verifiedByDesignation: "SP Headquarters / Shuhada Focal Person",
        verifiedSignatureDate: "15-01-2024",
        authorizationDecision: "APPROVED_FOR_HEALTH_CARD",
        authorizedOfficer: "Hospital Director / Medical Superintendent",
        authorizedDesignation: "Designated Healthcare Authority",
        cardPhysicalIssued: true,
        cardDigitalRecordCreated: true,
        cardBeneficiariesLinked: true,
        cardSystemUpdated: true,
        hospitalAccessDHQ: true,
        hospitalAccessMMMTH: true,
        hospitalAccessWC: true,
        hospitalId: hospitalId,
        members: {
          create: membersToInsert,
        },
        documents: photoFilename
          ? {
              create: [
                {
                  publicId: `police-shaheed-${regNo}`,
                  secureUrl: `/images/police/shaheed/${photoFilename}`,
                  resourceType: "image",
                  docType: "Beneficiary Photographs",
                  originalFilename: photoFilename,
                },
              ],
            }
          : undefined,
      },
    });

    await prisma.healthCard.create({
      data: {
        familyRegistrationNo: regNo,
        cardNo: cardNo,
        qrDigitalVerificationId: qrId,
        dateOfRegistration: new Date("2024-01-15T00:00:00Z"),
        dateOfCardIssue: new Date("2024-01-15T00:00:00Z"),
        status: "ACTIVE",
        specialFlags: [
          "District Police Shuhada Cell Verified",
          "Priority Healthcare Access",
          "100% Diagnostic & Pharmacy Support",
        ],
        controlFlags: ["Valid Shuhada Health Card", "Verified Heir Records"],
        issuedBy: "District Police Shuhada Cell / DSFHI Desk",
        issuedByDesignation: "Focal Person DSFHI",
        accessDHQ: true,
        accessMMMTH: true,
        accessWC: true,
        reviewFlags: ["Verified"],
        authorisedOfficer: "Medical Superintendent / Hospital Director",
        authorisedDesignation: "Hospital Director",
      },
    });
  });

  console.log(`✓ Successfully imported ${shuhadaData.length} Shuhada families!`);

  // 3. IMPORT GHAZIAN (132 Records)
  console.log("\n[3/4] Reading Ghazian Police Excel file...");
  const gWb = xlsx.readFile(
    path.join(process.cwd(), "Police", "Ghazian Police Detail for PVC Health Card Final Setting.xlsx")
  );
  const gSheet = gWb.Sheets[gWb.SheetNames[0]];
  const gRows: any[] = xlsx.utils.sheet_to_json(gSheet);

  const ghazianData = gRows
    .slice(2)
    .filter((r) => r["Name of Ghazi"] && cleanText(r["Name of Ghazi"]).toLowerCase() !== "rank / name of injured");
  console.log(`✓ Found ${ghazianData.length} valid Ghazian records to import.`);

  await runInChunks(ghazianData, 12, async (row, i) => {
    const index = i + 1;
    const regNo = `DG-2024-${String(index).padStart(4, "0")}`;
    const cardNo = `DGFHC-${String(index).padStart(6, "0")}`;
    const qrId = `DGFQR-${randomBytes(16).toString("hex")}`;

    const rawName = cleanText(row["Name of Ghazi"]);
    const rawBelt = cleanText(row["Belt No / I-Card No."]);
    const rawDept = cleanText(row["Department"]) || "Police";
    const rawUnit = cleanText(row["Unit / District"]) || "District Police D.I. Khan";

    const ghaziCnic = extractCnic(rawBelt) || "12101-0000000-9";

    const photoField = cleanText(row["Photo"]);
    const numMatch = photoField.match(/\d+/);
    let photoFilename: string | null = null;
    if (numMatch) {
      const matchFile = gFiles.find((f) => f.toLowerCase().includes(`ghazi_${numMatch[0]}.`));
      if (matchFile) photoFilename = matchFile;
    }

    totalMembers++;

    await prisma.family.create({
      data: {
        registrationNo: regNo,
        dateOfRegistration: new Date("2024-01-15T00:00:00Z"),
        healthCardNo: cardNo,
        qrDigitalId: qrId,
        shaheedName: rawName,
        shaheedDepartment: rawDept,
        shaheedServiceNo: rawBelt,
        shaheedCnic: ghaziCnic,
        shaheedUnit: rawUnit,
        shaheedPermanentDistrict: "Dera Ismail Khan",
        specialDependencyDisability: "Living Valor / Police Ghazi",
        contactName: rawName,
        contactRelationship: "Self (Ghazi)",
        contactCnic: ghaziCnic,
        contactMobile: "0300-0000000",
        documentsSubmitted: ["Ghazi Medical Board Certificate", "Police Service Record", "CNIC"],
        verificationStatus: "VERIFIED_ELIGIBLE",
        verificationAuthority: "District Police Office / Ghazian Cell",
        verifiedBy: "Superintendent of Police",
        verifiedByDesignation: "SP Headquarters / Shuhada & Ghazian Cell",
        verifiedSignatureDate: "15-01-2024",
        authorizationDecision: "APPROVED_FOR_HEALTH_CARD",
        authorizedOfficer: "Hospital Director / Medical Superintendent",
        authorizedDesignation: "Designated Healthcare Authority",
        cardPhysicalIssued: true,
        cardDigitalRecordCreated: true,
        cardBeneficiariesLinked: true,
        cardSystemUpdated: true,
        hospitalAccessDHQ: true,
        hospitalAccessMMMTH: true,
        hospitalAccessWC: true,
        hospitalId: hospitalId,
        members: {
          create: [
            {
              serialNo: 1,
              name: rawName,
              relationship: "Self (Ghazi)",
              cnicBForm: ghaziCnic,
              status: "Active",
              specialDependencyDisability: "Living Valor / Police Ghazi",
              beneficiaryId: `${regNo}-01`,
              cardStatus: "ACTIVE",
            },
          ],
        },
        documents: photoFilename
          ? {
              create: [
                {
                  publicId: `police-ghazi-${regNo}`,
                  secureUrl: `/images/police/ghazi/${photoFilename}`,
                  resourceType: "image",
                  docType: "Beneficiary Photographs",
                  originalFilename: photoFilename,
                },
              ],
            }
          : undefined,
      },
    });

    await prisma.healthCard.create({
      data: {
        familyRegistrationNo: regNo,
        cardNo: cardNo,
        qrDigitalVerificationId: qrId,
        dateOfRegistration: new Date("2024-01-15T00:00:00Z"),
        dateOfCardIssue: new Date("2024-01-15T00:00:00Z"),
        status: "ACTIVE",
        specialFlags: [
          "Police Ghazi Living Valor",
          "Priority Healthcare Access",
          "100% Diagnostic & Pharmacy Support",
        ],
        controlFlags: ["Valid Ghazi Health Card", "Verified Living Valor Record"],
        issuedBy: "District Police Ghazian Cell / DSFHI Desk",
        issuedByDesignation: "Focal Person DSFHI",
        accessDHQ: true,
        accessMMMTH: true,
        accessWC: true,
        reviewFlags: ["Verified"],
        authorisedOfficer: "Medical Superintendent / Hospital Director",
        authorisedDesignation: "Hospital Director",
      },
    });
  });

  console.log(`✓ Successfully imported ${ghazianData.length} Ghazian heroes!`);

  // 4. VERIFY FINAL DATABASE COUNTS
  console.log("\n[4/4] Verifying final database records...");
  const totalFamilies = await prisma.family.count();
  const dbMembers = await prisma.familyMember.count();
  const totalCards = await prisma.healthCard.count();
  const totalDocs = await prisma.document.count();
  const totalUsers = await prisma.user.count();
  const totalHospitals = await prisma.hospital.count();

  console.log("\n==================================================");
  console.log("   🎉 CLEAN & IMPORT COMPLETED SUCCESSFULLY!      ");
  console.log("==================================================");
  console.log(`• Total Families (Shuhada + Ghazian): ${totalFamilies}`);
  console.log(`• Total Family Members & Heirs:       ${dbMembers}`);
  console.log(`• Total Active Health Cards:          ${totalCards}`);
  console.log(`• Total Documents/Photos Linked:      ${totalDocs}`);
  console.log(`• Total Staff Users Preserved:        ${totalUsers}`);
  console.log(`• Total Hospitals Preserved:          ${totalHospitals}`);
  console.log("==================================================\n");
}

main()
  .catch((e) => {
    console.error("Import failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

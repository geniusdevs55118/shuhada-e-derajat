import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Issue {
  severity: "ERROR" | "WARN" | "INFO";
  recordId?: string;
  field?: string;
  message: string;
}

const issues: Issue[] = [];

function log(severity: Issue["severity"], recordId: string | undefined, field: string | undefined, message: string) {
  issues.push({ severity, recordId, field, message });
}

async function main() {
  console.log("=== DEEP VALIDATION REPORT ===\n");

  // ─────────────────────────────────────────────
  // 1. COUNTS
  // ─────────────────────────────────────────────
  const familyCount = await prisma.family.count();
  const cardCount = await prisma.healthCard.count();
  const memberCount = await prisma.familyMember.count();
  const userCount = await prisma.user.count();
  const visitCount = await prisma.visit.count();

  console.log("COUNTS");
  console.log(`  Families:       ${familyCount}  (expected: 269)`);
  console.log(`  HealthCards:    ${cardCount}   (expected: 269)`);
  console.log(`  FamilyMembers:  ${memberCount}   (expected: 269)`);
  console.log(`  Users:          ${userCount}    (expected: 14)`);
  console.log(`  Visits:         ${visitCount}    (expected: 0)\n`);

  if (familyCount !== 269) log("ERROR", undefined, "count", `Family count is ${familyCount}, expected 269`);
  if (cardCount !== 269)   log("ERROR", undefined, "count", `HealthCard count is ${cardCount}, expected 269`);
  if (memberCount !== 269) log("WARN",  undefined, "count", `FamilyMember count is ${memberCount}, expected 269 (one per family)`);
  if (visitCount !== 0)    log("WARN",  undefined, "count", `Visit count is ${visitCount}, expected 0`);

  // ─────────────────────────────────────────────
  // 2. ALL FAMILIES – FIELD CHECKS
  // ─────────────────────────────────────────────
  const families = await prisma.family.findMany({
    orderBy: { registrationNo: "asc" },
    include: { members: true },
  });

  const regNos = new Set<string>();
  const cardNos = new Set<string>();
  const qrIds = new Set<string>();

  for (const f of families) {
    const id = f.registrationNo;

    // Uniqueness
    if (regNos.has(id)) log("ERROR", id, "registrationNo", "Duplicate registrationNo");
    regNos.add(id);

    if (f.healthCardNo) {
      if (cardNos.has(f.healthCardNo)) log("ERROR", id, "healthCardNo", `Duplicate healthCardNo: ${f.healthCardNo}`);
      cardNos.add(f.healthCardNo);
    } else {
      log("ERROR", id, "healthCardNo", "Missing healthCardNo");
    }

    if (f.qrDigitalId) {
      if (qrIds.has(f.qrDigitalId)) log("ERROR", id, "qrDigitalId", `Duplicate qrDigitalId: ${f.qrDigitalId}`);
      qrIds.add(f.qrDigitalId);
    } else {
      log("WARN", id, "qrDigitalId", "Missing qrDigitalId");
    }

    // Registration number format SH-DIK-NNN
    if (!/^SH-DIK-\d{3}$/.test(id)) log("ERROR", id, "registrationNo", `Bad format: ${id}`);

    // Required fields
    if (!f.shaheedName || f.shaheedName.trim() === "")
      log("ERROR", id, "shaheedName", "Missing shaheedName");

    if (!f.shaheedRank || f.shaheedRank.trim() === "")
      log("WARN", id, "shaheedRank", "Missing shaheedRank");

    if (!f.shaheedDateOfShahadat)
      log("ERROR", id, "shaheedDateOfShahadat", "Missing date of Shahadat");
    else {
      const year = f.shaheedDateOfShahadat.getUTCFullYear();
      if (year < 1980 || year > 2027)
        log("WARN", id, "shaheedDateOfShahadat", `Suspicious year: ${year}`);
    }

    if (!f.shaheedUnit || f.shaheedUnit.trim() === "")
      log("WARN", id, "shaheedUnit", "Missing unit");

    if (!f.contactMobile || f.contactMobile.trim() === "")
      log("WARN", id, "contactMobile", "Missing contact mobile");
    else if (!/^0[3][0-9]{2}-[0-9]{3}-[0-9]{4}$/.test(f.contactMobile.trim()))
      log("WARN", id, "contactMobile", `Non-standard phone format: ${f.contactMobile}`);

    if (!f.contactPresentAddress || f.contactPresentAddress.trim() === "")
      log("WARN", id, "contactPresentAddress", "Missing address/residency");

    if (f.verificationStatus !== "VERIFIED_ELIGIBLE")
      log("WARN", id, "verificationStatus", `Status is ${f.verificationStatus}, expected VERIFIED_ELIGIBLE`);

    if (!f.hospitalAccessDHQ || !f.hospitalAccessMMMTH || !f.hospitalAccessWC)
      log("WARN", id, "hospitalAccess", "Not all 3 hospitals flagged as accessible");

    // Members
    if (f.members.length === 0)
      log("ERROR", id, "members", "No FamilyMember rows attached");
    else if (f.members.length > 1)
      log("WARN", id, "members", `${f.members.length} member rows (expected 1 placeholder)`);
  }

  // ─────────────────────────────────────────────
  // 3. HEALTH CARDS – LINKAGE CHECKS
  // ─────────────────────────────────────────────
  const cards = await prisma.healthCard.findMany();

  const cardFamilyNos = new Set<string>();

  for (const c of cards) {
    if (cardFamilyNos.has(c.familyRegistrationNo))
      log("ERROR", c.cardNo, "familyRegistrationNo", `Duplicate familyRegistrationNo on card: ${c.familyRegistrationNo}`);
    cardFamilyNos.add(c.familyRegistrationNo);

    if (!/^HC-DIK-\d{3}$/.test(c.cardNo))
      log("ERROR", c.cardNo, "cardNo", `Bad card number format: ${c.cardNo}`);

    if (c.status !== "ACTIVE")
      log("WARN", c.cardNo, "status", `Card status is ${c.status}, expected ACTIVE`);

    if (!c.accessDHQ || !c.accessMMMTH || !c.accessWC)
      log("WARN", c.cardNo, "access", "Not all 3 hospital access flags set on card");

    // Cross-check: does a Family row exist for this card?
    if (!regNos.has(c.familyRegistrationNo))
      log("ERROR", c.cardNo, "familyRegistrationNo", `Card references non-existent family: ${c.familyRegistrationNo}`);
  }

  // Every family must have a matching card
  for (const f of families) {
    const expectedCardNo = f.healthCardNo;
    if (expectedCardNo && !cardFamilyNos.has(f.registrationNo))
      log("ERROR", f.registrationNo, "healthCard", `No HealthCard row found for family ${f.registrationNo}`);
  }

  // ─────────────────────────────────────────────
  // 4. SEQUENCE GAP CHECK (S# 1–269)
  // ─────────────────────────────────────────────
  const allRegNos = families.map(f => f.registrationNo).sort();
  const expected = Array.from({ length: 269 }, (_, i) => `SH-DIK-${String(i + 1).padStart(3, "0")}`);
  const missingNos = expected.filter(e => !allRegNos.includes(e));
  const extraNos   = allRegNos.filter(r => !expected.includes(r));

  if (missingNos.length > 0) log("ERROR", undefined, "sequence", `Missing Shuhada records: ${missingNos.join(", ")}`);
  if (extraNos.length > 0)   log("WARN",  undefined, "sequence", `Extra/unexpected records: ${extraNos.join(", ")}`);

  // ─────────────────────────────────────────────
  // 5. USERS – STILL ALL INTACT
  // ─────────────────────────────────────────────
  const users = await prisma.user.findMany({ select: { email: true, role: true, isActive: true } });
  for (const u of users) {
    if (!u.isActive) log("WARN", u.email, "isActive", "User is marked inactive");
  }

  // ─────────────────────────────────────────────
  // 6. REPORT
  // ─────────────────────────────────────────────
  const errors = issues.filter(i => i.severity === "ERROR");
  const warns  = issues.filter(i => i.severity === "WARN");
  const infos  = issues.filter(i => i.severity === "INFO");

  console.log("\n────────────────────────────────────────────");
  console.log(`ISSUES FOUND: ${issues.length} total  |  ${errors.length} ERRORs  |  ${warns.length} WARNs  |  ${infos.length} INFO`);
  console.log("────────────────────────────────────────────");

  if (errors.length === 0 && warns.length === 0) {
    console.log("\n✅  PERFECT — No errors or warnings found. Data is clean.");
  }

  if (errors.length > 0) {
    console.log("\n🔴  ERRORS:");
    for (const e of errors)
      console.log(`   [${e.recordId ?? "global"}] ${e.field ?? ""} → ${e.message}`);
  }

  if (warns.length > 0) {
    console.log("\n🟡  WARNINGS:");
    for (const w of warns)
      console.log(`   [${w.recordId ?? "global"}] ${w.field ?? ""} → ${w.message}`);
  }

  console.log("\n=== VALIDATION COMPLETE ===");
}

main()
  .catch(e => { console.error("Validation failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());

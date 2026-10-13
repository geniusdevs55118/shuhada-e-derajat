import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";

export function monthBounds(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
}

const SERVICES = [
  "OPD", "Specialist Consultation", "Emergency / Trauma", "Laboratory", "Radiology",
  "Medicines", "Admission", "Medical Treatment", "Surgical Consultation", "Operation / Procedure",
  "ICU", "Maternal Health", "Paediatric Care", "Neonatal Care", "Rehabilitation",
  "Follow-up", "Sehat Card Plus Facilitation", "Ambulance", "Referral", "Other",
];

export async function computeLiveStats(year: number, month: number, hospitalId: number | null) {
  const { start, end } = monthBounds(year, month);
  const hWhere = hospitalId ? { hospitalId } : {};

  const hospitalFamilyRegNos = hospitalId
    ? (await prisma.family.findMany({ where: hWhere, select: { registrationNo: true } })).map((f) => f.registrationNo)
    : null;

  const [familiesTotal, familiesNew, verifiedBeneficiaries, familiesPending, cardsIssued, cardsActive, visits] = await Promise.all([
    prisma.family.count({ where: hWhere }),
    prisma.family.count({ where: { ...hWhere, dateOfRegistration: { gte: start, lt: end } } }),
    prisma.family.count({ where: { ...hWhere, verificationStatus: "VERIFIED_ELIGIBLE" } }),
    prisma.family.count({ where: { ...hWhere, verificationStatus: null } }),
    prisma.healthCard.count({ where: { dateOfCardIssue: { gte: start, lt: end }, ...(hospitalFamilyRegNos ? { familyRegistrationNo: { in: hospitalFamilyRegNos } } : {}) } }),
    prisma.healthCard.count({ where: { status: "ACTIVE" } }),
    prisma.visit.findMany({ where: { ...hWhere, dateTime: { gte: start, lt: end } }, include: { sehatClaims: true } }),
  ]);

  const serviceCounts: Record<string, number> = {};
  for (const s of SERVICES) serviceCounts[s] = 0;
  for (const v of visits) {
    const natures = Array.isArray(v.natureOfHealthcare) ? (v.natureOfHealthcare as string[]) : [];
    for (const n of natures) {
      if (serviceCounts[n] !== undefined) serviceCounts[n]++;
      else serviceCounts["Other"]++;
    }
  }

  const claims = visits.flatMap((v) => v.sehatClaims.map((c) => ({ ...c, hospitalId: v.hospitalId })));
  const sehat = {
    beneficiariesFacilitated: new Set(claims.map((c) => c.familyRegistrationNo)).size,
    claimsApproved: claims.filter((c) => c.status === "APPROVED").length,
    claimsPending: claims.filter((c) => c.status === "UNDER_PROCESS").length,
    notCovered: claims.filter((c) => c.status === "NOT_COVERED").length,
    ineligible: claims.filter((c) => c.status === "INELIGIBLE").length,
  };

  const emergencyVisits = visits.filter((v) => {
    const f = (v.emergencyFlags ?? {}) as Record<string, unknown>;
    return f.emergencyCase === true || v.verification === "EMERGENCY_VERIFICATION_IN_PROCESS";
  });
  const emergency = {
    emergencyCasesReceived: emergencyVisits.length,
    treatedBeforeVerification: emergencyVisits.filter((v) => v.verificationPending || v.verification === "EMERGENCY_VERIFICATION_IN_PROCESS").length,
    delaysReported: emergencyVisits.filter((v) => Boolean((v.issueEncountered ?? "").trim())).length,
  };

  const ambulanceReferral = {
    ambulanceCases: visits.filter((v) => v.ambulanceFromTo || v.ambulanceDateTime).length,
    referrals: visits.filter((v) => v.referralFacility).length,
  };

  const healthDesk = {
    beneficiariesApproached: visits.length,
    casesResolved: visits.filter((v) => (v.finalStatus ?? "").toLowerCase().match(/resolved|closed|facilitated/)).length,
    casesEscalated: visits.filter((v) => v.escalatedTo).length,
    casesPending: visits.filter((v) => !(v.finalStatus ?? "").toLowerCase().match(/resolved|closed|facilitated/) && !v.escalatedTo).length,
  };

  const grievances = await prisma.grievance.findMany({ where: { ...hWhere, dateTime: { gte: start, lt: end } } });
  const grievanceStats = {
    totalReceived: grievances.length,
    resolved: grievances.filter((g) => g.closureStatus && /RESOLVED|CLOSED/.test(g.closureStatus) && !/REFERRED/.test(g.closureStatus)).length,
    pending: grievances.filter((g) => !g.closureStatus).length,
    urgentCases: grievances.filter((g) => g.priority === "URGENT" || g.priority === "IMMEDIATE_PATIENT_SAFETY").length,
    redAlerts: grievances.filter((g) => g.isRedAlert).length,
  };

  // Beneficiaries onboarded this month = eligible members of families registered this month.
  const newFamilies = await prisma.family.findMany({
    where: { ...hWhere, dateOfRegistration: { gte: start, lt: end } },
    select: { id: true, dateOfRegistration: true, verifiedSignatureDate: true },
  });
  const newBeneficiaries = newFamilies.length
    ? await prisma.familyMember.count({ where: { familyId: { in: newFamilies.map((f) => f.id) } } })
    : 0;

  // Average days from registration to official verification, across verified families.
  const verifiedFamilies = await prisma.family.findMany({
    where: { ...hWhere, verificationStatus: { not: null }, verifiedSignatureDate: { not: null } },
    select: { dateOfRegistration: true, verifiedSignatureDate: true },
  });
  const verificationDays = verifiedFamilies
    .map((f) => {
      const verifiedAt = f.verifiedSignatureDate ? new Date(f.verifiedSignatureDate) : null;
      if (!verifiedAt || isNaN(verifiedAt.getTime())) return null;
      return (verifiedAt.getTime() - f.dateOfRegistration.getTime()) / 86_400_000;
    })
    .filter((days): days is number => days !== null && days >= 0);
  const averageVerificationTimeDays = verificationDays.length
    ? Math.round((verificationDays.reduce((sum, d) => sum + d, 0) / verificationDays.length) * 10) / 10
    : null;

  return {
    period: { month, year },
    hospitalId,
    sectionB: {
      totalFamiliesRegistered: familiesTotal,
      newFamiliesThisMonth: familiesNew,
      totalVerifiedBeneficiaries: verifiedBeneficiaries,
      newBeneficiariesThisMonth: newBeneficiaries,
      healthCardsIssuedThisMonth: cardsIssued,
      digitalQrRecordsActive: cardsActive,
      casesPendingVerification: familiesPending,
      averageVerificationTimeDays,
    },
    sectionC: { totalVisits: visits.length, byService: serviceCounts },
    sectionD: sehat,
    sectionE: emergency,
    sectionF: ambulanceReferral,
    sectionG: healthDesk,
    sectionI: grievanceStats,
  };
}

export async function GET(req: NextRequest) {
  try {
    await requirePermission("monthly_report", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const sp = new URL(req.url).searchParams;
  const month = Number(sp.get("month") ?? new Date().getMonth() + 1);
  const year = Number(sp.get("year") ?? new Date().getFullYear());
  const hospitalIdParam = sp.get("hospitalId");
  const hospitalId = hospitalIdParam && hospitalIdParam !== "all" && hospitalIdParam !== "consolidated" ? Number(hospitalIdParam) : null;
  const stats = await computeLiveStats(year, month, hospitalId);
  return NextResponse.json(stats);
}

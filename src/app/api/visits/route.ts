import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";
import { visitSchema } from "@/lib/visit-schemas";

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("visit", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const hospitalId = searchParams.get("hospitalId");
  const emergencyOnly = searchParams.get("emergency") === "true";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = 10;

  const where: Record<string, unknown> = { ...hospitalScope(session, "visit") };
  if (hospitalId && hospitalId !== "all") where.hospitalId = Number(hospitalId);
  if (search) {
    where.OR = [
      { visitNo: { contains: search } },
      { beneficiaryName: { contains: search } },
      { beneficiaryCnicBForm: { contains: search } },
      { familyRegistrationNo: { contains: search } },
      { healthCardNo: { contains: search } },
    ];
  }

  const [total, visits] = await Promise.all([
    prisma.visit.count({ where }),
    prisma.visit.findMany({ where, orderBy: { dateTime: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  let data = visits.map((v) => {
    const flags = (v.emergencyFlags ?? {}) as Record<string, unknown>;
    const isEmergency = flags.emergencyCase === true || v.verification === "EMERGENCY_VERIFICATION_IN_PROCESS";
    return { ...v, isEmergency };
  });
  if (emergencyOnly) data = data.filter((v) => v.isEmergency);

  const hospitalIds = [...new Set(visits.map((v) => v.hospitalId))];
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } } });
  const hMap = new Map(hospitals.map((h) => [h.id, h]));

  return NextResponse.json({
    total,
    page,
    pageSize,
    data: data.map((v) => ({ ...v, hospitalCode: hMap.get(v.hospitalId)?.code ?? null, hospitalName: hMap.get(v.hospitalId)?.name ?? null })),
  });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("visit", "create", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const body = await req.json();
  const parsed = visitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const hospitalId = session.hospitalId ?? values.hospitalId;
  if (!hospitalId) {
    return NextResponse.json({ error: "hospitalId is required" }, { status: 400 });
  }
  if (session.hospitalId && values.hospitalId && values.hospitalId !== session.hospitalId) {
    return NextResponse.json({ error: "Cannot record a visit for another hospital" }, { status: 403 });
  }

  const emergencyFlags = values.emergencyFlags ?? {};
  const isEmergency =
    emergencyFlags.emergencyCase === true || values.verification === "EMERGENCY_VERIFICATION_IN_PROCESS";

  // EMERGENCY CARE FIRST: an emergency visit saves even if the family is
  // unverified / card suspended. Care is never blocked by verification.
  const family = await prisma.family.findUnique({ where: { registrationNo: values.familyRegistrationNo } });
  if (!family && !isEmergency) {
    return NextResponse.json({ error: "Family not found for this registration number" }, { status: 404 });
  }

  const visitNo = await generateVisitNo();

  const visit = await prisma.visit.create({
    data: {
      visitNo,
      dateTime: toDate(values.dateTime) ?? new Date(),
      familyRegistrationNo: values.familyRegistrationNo,
      healthCardNo: values.healthCardNo || null,
      hospitalId,
      beneficiaryName: values.beneficiaryName,
      beneficiaryFatherHusbandGuardian: values.beneficiaryFatherHusbandGuardian || null,
      beneficiaryCnicBForm: values.beneficiaryCnicBForm || null,
      beneficiaryRelationship: values.beneficiaryRelationship || null,
      beneficiaryMobile: values.beneficiaryMobile || null,
      shaheedName: values.shaheedName || null,
      verification: values.verification,
      verificationPending: values.verificationPending ?? (isEmergency ? true : false),
      facilitationOfficer: values.facilitationOfficer || null,
      natureOfHealthcare: values.natureOfHealthcare as unknown as object,
      natureOther: values.natureOther || null,
      department: values.department || null,
      consultant: values.consultant || null,
      opdMrNo: values.opdMrNo || null,
      diagnosis: values.diagnosis || null,
      treatmentPlan: values.treatmentPlan || null,
      followUpDate: toDate(values.followUpDate),
      diagnostics: values.diagnostics,
      investigationsStatus: values.investigationsStatus ?? null,
      medicinesFlags: values.medicinesFlags,
      medicinesRemarks: values.medicinesRemarks || null,
      ward: values.ward || null,
      admissionDate: toDate(values.admissionDate),
      procedureName: values.procedureName || null,
      consultantUnit: values.consultantUnit || null,
      procedureDate: toDate(values.procedureDate),
      procedureStatus: values.procedureStatus ?? null,
      sehatFlags: values.sehatFlags,
      sehatCaseRef: values.sehatCaseRef || null,
      emergencyFlags: emergencyFlags as unknown as object,
      ambulanceFromTo: values.ambulanceFromTo || null,
      ambulanceDateTime: toDate(values.ambulanceDateTime),
      referralFacility: values.referralFacility || null,
      referralReason: values.referralReason || null,
      referringConsultant: values.referringConsultant || null,
      ambulanceFlags: values.ambulanceFlags,
      healthDeskActions: values.healthDeskActions,
      issueEncountered: values.issueEncountered || null,
      actionTaken: values.actionTaken || null,
      finalStatus: values.finalStatus || null,
      feedbackFlags: values.feedbackFlags,
      feedbackComments: values.feedbackComments || null,
      feedbackSignature: values.feedbackSignature || null,
      certOfficer: values.certOfficer || null,
      certDesignation: values.certDesignation || null,
      certSignatureDate: values.certSignatureDate || null,
      escalatedTo: values.escalatedTo || null,
      actionDecision: values.actionDecision || null,
      authorisedOfficerSignature: values.authorisedOfficerSignature || null,
    },
  });

  await prisma.auditLog.create({
    data: { who: session.email ?? "unknown", role: session.role, action: isEmergency ? "create_emergency_visit" : "create", entity: "visit", entityId: String(visit.id), hospitalId },
  }).catch(() => {});

  return NextResponse.json({ id: visit.id, visitNo: visit.visitNo }, { status: 201 });
}

export async function generateVisitNo(): Promise<string> {
  const year = new Date().getFullYear();
  const latest = await prisma.visit.findFirst({
    where: { visitNo: { startsWith: `VIS-${year}-` } },
    orderBy: { visitNo: "desc" },
    select: { visitNo: true },
  });
  const n = latest ? Number(latest.visitNo.split("-")[2]) + 1 : 1;
  return `VIS-${year}-${String(n).padStart(6, "0")}`;
}

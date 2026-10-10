import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";
import { grievanceSchema, hasAnyTrue } from "@/lib/grievance-schemas";
import { notifyRedGrievance } from "@/lib/notifications";

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("grievance", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const priority = searchParams.get("priority")?.trim();
  const status = searchParams.get("status")?.trim();
  const hospitalId = searchParams.get("hospitalId");
  const redOnly = searchParams.get("red") === "true";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = 10;

  const where: Record<string, unknown> = { ...hospitalScope(session, "grievance") };
  if (hospitalId && hospitalId !== "all") where.hospitalId = Number(hospitalId);
  if (priority && priority !== "all") where.priority = priority;
  if (status && status !== "all") where.closureStatus = status === "open" ? null : status;
  if (redOnly) where.isRedAlert = true;
  if (search) {
    where.OR = [
      { grievanceNo: { contains: search } },
      { beneficiaryName: { contains: search } },
      { familyRegistrationNo: { contains: search } },
      { healthCardNo: { contains: search } },
      { cnicBForm: { contains: search } },
    ];
  }

  const [total, grievances] = await Promise.all([
    prisma.grievance.count({ where }),
    prisma.grievance.findMany({ where, orderBy: { dateTime: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  const hospitalIds = [...new Set(grievances.map((g) => g.hospitalId))];
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } } });
  const hMap = new Map(hospitals.map((h) => [h.id, h]));

  return NextResponse.json({
    total,
    page,
    pageSize,
    data: grievances.map((g) => ({ ...g, hospitalCode: hMap.get(g.hospitalId)?.code ?? null })),
  });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("grievance", "create", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const body = await req.json();
  const parsed = grievanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const hospitalId = session.hospitalId ?? values.hospitalId;
  if (!hospitalId) return NextResponse.json({ error: "hospitalId is required" }, { status: 400 });
  if (session.hospitalId && values.hospitalId && values.hospitalId !== session.hospitalId) {
    return NextResponse.json({ error: "Cannot lodge a grievance for another hospital" }, { status: 403 });
  }

  const isRedAlert = hasAnyTrue(values.redFlags) || values.priority === "IMMEDIATE_PATIENT_SAFETY";
  const priority = isRedAlert ? "IMMEDIATE_PATIENT_SAFETY" : values.priority;

  const grievanceNo = await generateGrievanceNo();

  const grievance = await prisma.grievance.create({
    data: {
      grievanceNo,
      dateTime: toDate(values.dateTime) ?? new Date(),
      priority,
      isRedAlert,
      hospitalId,
      beneficiaryName: values.beneficiaryName,
      familyRegistrationNo: values.familyRegistrationNo || null,
      healthCardNo: values.healthCardNo || null,
      cnicBForm: values.cnicBForm || null,
      relationshipWithShaheed: values.relationshipWithShaheed || null,
      shaheedName: values.shaheedName || null,
      contactNo: values.contactNo || null,
      department: values.department || null,
      healthDesk: values.healthDesk || null,
      incidentDateTime: toDate(values.incidentDateTime),
      natureFlags: values.natureFlags,
      natureOther: values.natureOther || null,
      issueDescription: values.issueDescription || null,
      immediateHealthcareNeed: values.immediateHealthcareNeed ?? null,
      delayMayAffectCare: values.delayMayAffectCare ?? null,
      redFlags: values.redFlags,
      amberFlags: values.amberFlags,
      greenFlags: values.greenFlags,
      complaintReceivedBy: values.complaintReceivedBy || null,
      receivedByDesignation: values.receivedByDesignation || null,
      timeReceived: values.timeReceived || null,
      immediateActionTaken: values.immediateActionTaken || null,
      resolvedAtHealthDesk: values.resolvedAtHealthDesk || null,
      escalatedTo: values.escalatedTo || null,
      escalationDesignation: values.escalationDesignation || null,
      escalatedDateTime: values.escalatedDateTime || null,
      escalationReason: values.escalationReason || null,
      escalationModes: values.escalationModes,
      actionTaken: values.actionTaken || null,
      responsibleDeptOfficer: values.responsibleDeptOfficer || null,
      resolutionDateTime: values.resolutionDateTime || null,
      outcome: values.outcome ?? null,
      remarks: values.remarks || null,
      issueExplainedAppropriately: values.issueExplainedAppropriately ?? null,
      facilitationProvided: values.facilitationProvided ?? null,
      furtherAssistanceRequired: values.furtherAssistanceRequired ?? null,
      beneficiaryComments: values.beneficiaryComments || null,
      beneficiaryNameSignature: values.beneficiaryNameSignature || null,
      beneficiarySignatureDate: values.beneficiarySignatureDate || null,
      rootCause: values.rootCause || null,
      correctiveAction: values.correctiveAction || null,
      preventiveActionRequired: values.preventiveActionRequired || null,
      responsibleOfficerDept: values.responsibleOfficerDept || null,
      targetCompletionDate: toDate(values.targetCompletionDate),
      actionCompleted: values.actionCompleted ?? null,
      requiresWorkingGroupReview: values.requiresWorkingGroupReview ?? null,
      reviewedBy: values.reviewedBy || null,
      observations: values.observations || null,
      furtherDirections: values.furtherDirections || null,
      reviewSignatureDate: values.reviewSignatureDate || null,
      closureStatus: values.closureStatus ?? null,
      closedBy: values.closedBy || null,
      closedByDesignation: values.closedByDesignation || null,
      closureSignature: values.closureSignature || null,
      closureDate: values.closureDate || null,
    },
  });

  if (isRedAlert) {
    await notifyRedGrievance({ id: grievance.id, grievanceNo: grievance.grievanceNo, beneficiaryName: grievance.beneficiaryName, hospitalId });
    await prisma.auditLog.create({
      data: { who: session.email ?? "unknown", role: session.role, action: "RED_ALERT_grievance", entity: "grievance", entityId: String(grievance.id), hospitalId },
    }).catch(() => {});
  }
  await prisma.auditLog.create({
    data: { who: session.email ?? "unknown", role: session.role, action: "create", entity: "grievance", entityId: String(grievance.id), hospitalId },
  }).catch(() => {});

  return NextResponse.json({ id: grievance.id, grievanceNo: grievance.grievanceNo, isRedAlert }, { status: 201 });
}

export async function generateGrievanceNo(): Promise<string> {
  const year = new Date().getFullYear();
  const latest = await prisma.grievance.findFirst({
    where: { grievanceNo: { startsWith: `GRV-${year}-` } },
    orderBy: { grievanceNo: "desc" },
    select: { grievanceNo: true },
  });
  const n = latest ? Number(latest.grievanceNo.split("-")[2]) + 1 : 1;
  return `GRV-${year}-${String(n).padStart(6, "0")}`;
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope, logForbidden } from "@/lib/permissions";
import { visitSchema } from "@/lib/visit-schemas";
import { getCurrentUser, getCookieName } from "@/lib/auth";

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("visit", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const visit = await prisma.visit.findUnique({ where: { id: Number(id) } });
  if (!visit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const scope = hospitalScope(session, "visit");
  if (scope.hospitalId && typeof scope.hospitalId === "number" && visit.hospitalId !== scope.hospitalId) {
    await logForbidden(session, "visit");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(visit);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("visit", "edit", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const existing = await prisma.visit.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.hospitalId && existing.hospitalId !== session.hospitalId) {
    await logForbidden(session, "visit");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = visitSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const updated = await prisma.visit.update({
    where: { id: existing.id },
    data: {
      ...(values.beneficiaryName !== undefined ? { beneficiaryName: values.beneficiaryName } : {}),
      ...(values.diagnosis !== undefined ? { diagnosis: values.diagnosis || null } : {}),
      ...(values.treatmentPlan !== undefined ? { treatmentPlan: values.treatmentPlan || null } : {}),
      ...(values.department !== undefined ? { department: values.department || null } : {}),
      ...(values.consultant !== undefined ? { consultant: values.consultant || null } : {}),
      ...(values.natureOfHealthcare !== undefined ? { natureOfHealthcare: values.natureOfHealthcare as unknown as object } : {}),
      ...(values.diagnostics !== undefined ? { diagnostics: values.diagnostics } : {}),
      ...(values.medicinesFlags !== undefined ? { medicinesFlags: values.medicinesFlags } : {}),
      ...(values.sehatFlags !== undefined ? { sehatFlags: values.sehatFlags } : {}),
      ...(values.emergencyFlags !== undefined ? { emergencyFlags: values.emergencyFlags as unknown as object } : {}),
      ...(values.ambulanceFlags !== undefined ? { ambulanceFlags: values.ambulanceFlags } : {}),
      ...(values.ambulanceFromTo !== undefined ? { ambulanceFromTo: values.ambulanceFromTo || null } : {}),
      ...(values.ambulanceDateTime !== undefined ? { ambulanceDateTime: toDate(values.ambulanceDateTime) } : {}),
      ...(values.ambulanceStatus !== undefined ? { ambulanceStatus: values.ambulanceStatus } : {}),
      ...(values.referralFacility !== undefined ? { referralFacility: values.referralFacility || null } : {}),
      ...(values.referralReason !== undefined ? { referralReason: values.referralReason || null } : {}),
      ...(values.referringConsultant !== undefined ? { referringConsultant: values.referringConsultant || null } : {}),
      ...(values.healthDeskActions !== undefined ? { healthDeskActions: values.healthDeskActions } : {}),
      ...(values.feedbackFlags !== undefined ? { feedbackFlags: values.feedbackFlags } : {}),
      ...(values.finalStatus !== undefined ? { finalStatus: values.finalStatus || null } : {}),
      ...(values.actionTaken !== undefined ? { actionTaken: values.actionTaken || null } : {}),
      ...(values.issueEncountered !== undefined ? { issueEncountered: values.issueEncountered || null } : {}),
      ...(values.followUpDate !== undefined ? { followUpDate: toDate(values.followUpDate) } : {}),
      ...(values.ward !== undefined ? { ward: values.ward || null } : {}),
      ...(values.procedureStatus !== undefined ? { procedureStatus: values.procedureStatus ?? null } : {}),
      ...(values.sehatCaseRef !== undefined ? { sehatCaseRef: values.sehatCaseRef || null } : {}),
      ...(values.verificationPending !== undefined ? { verificationPending: values.verificationPending } : {}),
      ...(values.beneficiaryFatherHusbandGuardian !== undefined ? { beneficiaryFatherHusbandGuardian: values.beneficiaryFatherHusbandGuardian || null } : {}),
      ...(values.beneficiaryRelationship !== undefined ? { beneficiaryRelationship: values.beneficiaryRelationship || null } : {}),
      ...(values.beneficiaryMobile !== undefined ? { beneficiaryMobile: values.beneficiaryMobile || null } : {}),
      ...(values.shaheedName !== undefined ? { shaheedName: values.shaheedName || null } : {}),
      ...(values.facilitationOfficer !== undefined ? { facilitationOfficer: values.facilitationOfficer || null } : {}),
      ...(values.opdMrNo !== undefined ? { opdMrNo: values.opdMrNo || null } : {}),
      ...(values.investigationsStatus !== undefined ? { investigationsStatus: values.investigationsStatus ?? null } : {}),
      ...(values.medicinesRemarks !== undefined ? { medicinesRemarks: values.medicinesRemarks || null } : {}),
      ...(values.admissionDate !== undefined ? { admissionDate: toDate(values.admissionDate) } : {}),
      ...(values.procedureName !== undefined ? { procedureName: values.procedureName || null } : {}),
      ...(values.consultantUnit !== undefined ? { consultantUnit: values.consultantUnit || null } : {}),
      ...(values.procedureDate !== undefined ? { procedureDate: toDate(values.procedureDate) } : {}),
      ...(values.feedbackComments !== undefined ? { feedbackComments: values.feedbackComments || null } : {}),
      ...(values.escalatedTo !== undefined ? { escalatedTo: values.escalatedTo || null } : {}),
      ...(values.actionDecision !== undefined ? { actionDecision: values.actionDecision || null } : {}),
    },
  });

  const current = await getCurrentUser(req.cookies.get(getCookieName())?.value);
  await prisma.auditLog.create({
    data: { who: current?.email ?? "unknown", role: current?.role ?? "unknown", action: "update", entity: "visit", entityId: String(existing.id), hospitalId: existing.hospitalId },
  }).catch(() => {});

  return NextResponse.json(updated);
}

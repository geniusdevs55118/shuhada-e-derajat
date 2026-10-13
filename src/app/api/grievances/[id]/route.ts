import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope, logForbidden } from "@/lib/permissions";
import { grievanceSchema } from "@/lib/grievance-schemas";
import { getCurrentUser, getCookieName } from "@/lib/auth";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("grievance", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const grievance = await prisma.grievance.findUnique({ where: { id: Number(id) } });
  if (!grievance) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const scope = hospitalScope(session, "grievance");
  if (typeof scope.hospitalId === "number" && grievance.hospitalId !== scope.hospitalId) {
    await logForbidden(session, "grievance");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(grievance);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = await prisma.grievance.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const isClosure = body.closureStatus !== undefined || body.closedBy !== undefined;
  const isWgReview = body.requiresWorkingGroupReview !== undefined || body.reviewedBy !== undefined || body.observations !== undefined;

  let session;
  try {
    if (isClosure) {
      session = await requirePermission("grievance", "closure", req);
    } else if (isWgReview) {
      session = await requirePermission("grievance", "working_group_review", req);
    } else {
      session = await requirePermission("grievance", "create", req);
    }
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  if (session.hospitalId && existing.hospitalId !== session.hospitalId) {
    await logForbidden(session, "grievance");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = grievanceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const v = parsed.data;

  const updated = await prisma.grievance.update({
    where: { id: existing.id },
    data: {
      ...(v.closureStatus !== undefined ? { closureStatus: v.closureStatus ?? null } : {}),
      ...(v.closedBy !== undefined ? { closedBy: v.closedBy || null } : {}),
      ...(v.closedByDesignation !== undefined ? { closedByDesignation: v.closedByDesignation || null } : {}),
      ...(v.closureSignature !== undefined ? { closureSignature: v.closureSignature || null } : {}),
      ...(v.closureDate !== undefined ? { closureDate: v.closureDate || null } : {}),
      ...(v.reviewedBy !== undefined ? { reviewedBy: v.reviewedBy || null } : {}),
      ...(v.observations !== undefined ? { observations: v.observations || null } : {}),
      ...(v.furtherDirections !== undefined ? { furtherDirections: v.furtherDirections || null } : {}),
      ...(v.requiresWorkingGroupReview !== undefined ? { requiresWorkingGroupReview: v.requiresWorkingGroupReview ?? null } : {}),
      ...(v.actionTaken !== undefined ? { actionTaken: v.actionTaken || null } : {}),
      ...(v.outcome !== undefined ? { outcome: v.outcome ?? null } : {}),
      ...(v.remarks !== undefined ? { remarks: v.remarks || null } : {}),
      ...(v.rootCause !== undefined ? { rootCause: v.rootCause || null } : {}),
      ...(v.correctiveAction !== undefined ? { correctiveAction: v.correctiveAction || null } : {}),
      ...(v.actionCompleted !== undefined ? { actionCompleted: v.actionCompleted ?? null } : {}),
      ...(v.immediateActionTaken !== undefined ? { immediateActionTaken: v.immediateActionTaken || null } : {}),
      ...(v.resolvedAtHealthDesk !== undefined ? { resolvedAtHealthDesk: v.resolvedAtHealthDesk || null } : {}),
      ...(v.complaintReceivedBy !== undefined ? { complaintReceivedBy: v.complaintReceivedBy || null } : {}),
      ...(v.receivedByDesignation !== undefined ? { receivedByDesignation: v.receivedByDesignation || null } : {}),
      ...(v.timeReceived !== undefined ? { timeReceived: v.timeReceived || null } : {}),
      ...(v.escalatedTo !== undefined ? { escalatedTo: v.escalatedTo || null } : {}),
      ...(v.escalationDesignation !== undefined ? { escalationDesignation: v.escalationDesignation || null } : {}),
      ...(v.escalatedDateTime !== undefined ? { escalatedDateTime: v.escalatedDateTime || null } : {}),
      ...(v.escalationReason !== undefined ? { escalationReason: v.escalationReason || null } : {}),
      ...(v.escalationModes !== undefined ? { escalationModes: v.escalationModes } : {}),
      ...(v.responsibleDeptOfficer !== undefined ? { responsibleDeptOfficer: v.responsibleDeptOfficer || null } : {}),
      ...(v.resolutionDateTime !== undefined ? { resolutionDateTime: v.resolutionDateTime || null } : {}),
      ...(v.issueExplainedAppropriately !== undefined ? { issueExplainedAppropriately: v.issueExplainedAppropriately ?? null } : {}),
      ...(v.facilitationProvided !== undefined ? { facilitationProvided: v.facilitationProvided ?? null } : {}),
      ...(v.furtherAssistanceRequired !== undefined ? { furtherAssistanceRequired: v.furtherAssistanceRequired ?? null } : {}),
      ...(v.beneficiaryComments !== undefined ? { beneficiaryComments: v.beneficiaryComments || null } : {}),
      ...(v.beneficiaryNameSignature !== undefined ? { beneficiaryNameSignature: v.beneficiaryNameSignature || null } : {}),
      ...(v.beneficiarySignatureDate !== undefined ? { beneficiarySignatureDate: v.beneficiarySignatureDate || null } : {}),
      ...(v.preventiveActionRequired !== undefined ? { preventiveActionRequired: v.preventiveActionRequired || null } : {}),
      ...(v.responsibleOfficerDept !== undefined ? { responsibleOfficerDept: v.responsibleOfficerDept || null } : {}),
      ...(v.targetCompletionDate !== undefined ? { targetCompletionDate: v.targetCompletionDate || null } : {}),
      ...(v.reviewSignatureDate !== undefined ? { reviewSignatureDate: v.reviewSignatureDate || null } : {}),
    },
  });

  const current = await getCurrentUser(req.cookies.get(getCookieName())?.value);
  await prisma.auditLog.create({
    data: { who: current?.email ?? "unknown", role: current?.role ?? "unknown", action: "update", entity: "grievance", entityId: String(existing.id), hospitalId: existing.hospitalId },
  }).catch(() => {});

  return NextResponse.json(updated);
}

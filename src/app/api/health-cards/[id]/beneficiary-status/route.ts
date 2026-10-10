import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, AuthError, can } from "@/lib/permissions";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireUser(req);
    if (!can(session, "card", "edit") && !can(session, "card", "authorize_status_change")) throw new AuthError(403, "Forbidden");
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const beneficiaryName = typeof body?.beneficiaryName === "string" ? body.beneficiaryName.trim() : "";
  const newStatus = typeof body?.newStatus === "string" ? body.newStatus.trim() : "";
  if (!beneficiaryName || !newStatus) {
    return NextResponse.json({ error: "beneficiaryName and newStatus are required" }, { status: 400 });
  }

  const card = await prisma.healthCard.findUnique({ where: { id: Number(id) } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const record = await prisma.beneficiaryStatusChange.create({
    data: {
      healthCardId: card.id,
      beneficiaryName,
      previousStatus: body?.previousStatus ?? null,
      newStatus,
      effectiveDate: body?.effectiveDate ? new Date(body.effectiveDate) : new Date(),
      reason: body?.reason ?? null,
      supportingDocument: body?.supportingDocument ?? null,
      verifiedBy: session.email ?? String(session.id),
    },
  });
  await prisma.cardUpdateHistory.create({
    data: {
      healthCardId: card.id,
      date: new Date(),
      natureOfUpdate: `Beneficiary status change: ${beneficiaryName} -> ${newStatus}`,
      reason: body?.reason ?? null,
      verifiedBy: session.email ?? String(session.id),
    },
  });
  await prisma.auditLog.create({ data: { who: session.email ?? String(session.id), role: session.role, action: "beneficiary_status_change", entity: "card", entityId: String(card.id), hospitalId: session.hospitalId } });
  return NextResponse.json(record, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, AuthError, can } from "@/lib/permissions";
import { CardStatus } from "@prisma/client";

const STATUS_MAP: Record<string, CardStatus> = {
  "Active": "ACTIVE",
  "Under Verification": "UNDER_VERIFICATION",
  "Temporarily Suspended": "TEMPORARILY_SUSPENDED",
  "Closed": "CLOSED",
};

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireUser(req);
    const allowed = can(session, "card", "propose_status_change") || can(session, "card", "authorize_status_change");
    if (!allowed) throw new AuthError(403, "Forbidden");
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const status = typeof body?.status === "string" ? STATUS_MAP[body.status] : undefined;
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  if (!status || !reason) {
    return NextResponse.json({ error: "status and mandatory reason are required" }, { status: 400 });
  }

  const card = await prisma.healthCard.findUnique({ where: { id: Number(id) } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.healthCard.update({ where: { id: card.id }, data: { status } });
  await prisma.cardUpdateHistory.create({
    data: {
      healthCardId: card.id,
      date: new Date(),
      natureOfUpdate: `Status changed to ${body.status}`,
      reason,
      verifiedBy: session.email ?? String(session.id),
    },
  });
  await prisma.auditLog.create({
    data: { who: session.email ?? String(session.id), role: session.role, action: "status_change", entity: "card", entityId: String(card.id), hospitalId: session.hospitalId },
  });
  return NextResponse.json(updated);
}

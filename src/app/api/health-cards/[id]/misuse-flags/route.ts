import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, AuthError, can } from "@/lib/permissions";
import { MISUSE_CONTROL_FLAGS } from "@/lib/card-schemas";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireUser(req);
    const allowed = can(session, "card", "propose_misuse_flag") || can(session, "card", "authorize_misuse_flag");
    if (!allowed) throw new AuthError(403, "Forbidden");
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const flagType = typeof body?.flagType === "string" ? body.flagType : "";
  if (!(MISUSE_CONTROL_FLAGS as readonly string[]).includes(flagType)) {
    return NextResponse.json({ error: "Invalid flagType", allowed: MISUSE_CONTROL_FLAGS }, { status: 400 });
  }

  const card = await prisma.healthCard.findUnique({ where: { id: Number(id) } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const record = await prisma.misuseFlag.create({
    data: { healthCardId: card.id, flagType, remarks: body?.remarks ?? null },
  });
  await prisma.auditLog.create({ data: { who: session.email ?? String(session.id), role: session.role, action: "misuse_flag", entity: "card", entityId: String(card.id), hospitalId: session.hospitalId } });
  return NextResponse.json(record, { status: 201 });
}

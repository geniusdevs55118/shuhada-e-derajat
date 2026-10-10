import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, type SessionUser } from "@/lib/permissions";
import { statusSchema } from "@/lib/user-schemas";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session: SessionUser;
  try {
    session = await requirePermission("user", "edit", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;

  const target = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  const { isActive } = parsed.data;

  if (target.id === session.id && !isActive) {
    return NextResponse.json({ error: "You cannot deactivate your own account" }, { status: 400 });
  }

  if (target.role === "it_mis_rep" && !isActive && target.isActive) {
    const activeItMis = await prisma.user.count({ where: { role: "it_mis_rep", isActive: true } });
    if (activeItMis <= 1) {
      return NextResponse.json({ error: "There must always be at least one active it_mis_rep user" }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({ where: { id: target.id }, data: { isActive } });

  await prisma.auditLog.create({
    data: { who: session.email ?? String(session.id), role: session.role, action: isActive ? "activate" : "deactivate", entity: "user", entityId: String(updated.id), hospitalId: updated.hospitalId },
  }).catch(() => {});

  return NextResponse.json({ id: updated.id, isActive: updated.isActive });
}

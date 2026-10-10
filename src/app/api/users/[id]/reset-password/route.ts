import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, type SessionUser } from "@/lib/permissions";
import { resetPasswordSchema } from "@/lib/user-schemas";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
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
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: target.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 12), mustChangePassword: true },
  });

  await prisma.auditLog.create({
    data: { who: session.email ?? String(session.id), role: session.role, action: "reset_password", entity: "user", entityId: String(target.id), hospitalId: target.hospitalId },
  }).catch(() => {});

  return NextResponse.json({ id: target.id, ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, type SessionUser } from "@/lib/permissions";
import { updateUserSchema } from "@/lib/user-schemas";

async function activeItMisCount(): Promise<number> {
  return prisma.user.count({ where: { role: "it_mis_rep", isActive: true } });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("user", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) }, include: { hospital: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    id: user.id,
    name: user.name,
    username: user.email.replace("@demo.dsfhi.local", ""),
    role: user.role,
    designation: user.designation,
    hospital: user.hospital ? { code: user.hospital.code, name: user.hospital.name } : null,
    isActive: user.isActive,
  });
}

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
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  if (target.id === session.id && values.role !== target.role) {
    return NextResponse.json({ error: "You cannot change the role of your own account" }, { status: 400 });
  }

  if (target.role === "it_mis_rep" && values.role !== "it_mis_rep" && target.isActive && (await activeItMisCount()) <= 1) {
    return NextResponse.json({ error: "There must always be at least one active it_mis_rep user" }, { status: 400 });
  }

  const hospital = values.hospitalCode ? await prisma.hospital.findUnique({ where: { code: values.hospitalCode } }) : null;
  const updated = await prisma.user.update({
    where: { id: target.id },
    data: {
      name: values.name,
      role: values.role,
      designation: values.designation || null,
      hospitalId: hospital?.id ?? null,
    },
  });

  await prisma.auditLog.create({
    data: { who: session.email ?? String(session.id), role: session.role, action: "edit", entity: "user", entityId: String(updated.id), hospitalId: updated.hospitalId },
  }).catch(() => {});

  return NextResponse.json({ id: updated.id, name: updated.name, username: updated.email.replace("@demo.dsfhi.local", ""), role: updated.role, designation: updated.designation, isActive: updated.isActive });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session: SessionUser;
  try {
    session = await requirePermission("user", "manage", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;

  const target = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.id === session.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }
  if (target.role === "it_mis_rep" && target.isActive && (await activeItMisCount()) <= 1) {
    return NextResponse.json({ error: "There must always be at least one active it_mis_rep user" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: target.id } });

  await prisma.auditLog.create({
    data: { who: session.email ?? String(session.id), role: session.role, action: "delete", entity: "user", entityId: String(target.id), hospitalId: target.hospitalId },
  }).catch(() => {});

  return NextResponse.json({ deleted: true, id: target.id });
}

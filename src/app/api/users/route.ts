import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { createUserSchema, emailForUsername } from "@/lib/user-schemas";

export async function GET(req: NextRequest) {
  try {
    await requirePermission("user", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const role = searchParams.get("role")?.trim();
  const hospital = searchParams.get("hospital")?.trim();

  const where: Record<string, unknown> = {};
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
  if (role && role !== "all") where.role = role;
  if (hospital && hospital !== "all") where.hospital = { code: hospital };

  const users = await prisma.user.findMany({
    where,
    include: { hospital: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.email.replace("@demo.dsfhi.local", ""),
      role: u.role,
      designation: u.designation,
      hospital: u.hospital ? { code: u.hospital.code, name: u.hospital.name } : null,
      isActive: u.isActive,
    })),
  });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("user", "create", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const body = await req.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const email = emailForUsername(values.username);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: `Username "${values.username}" is already taken` }, { status: 409 });
  }

  const hospital = values.hospitalCode ? await prisma.hospital.findUnique({ where: { code: values.hospitalCode } }) : null;
  const user = await prisma.user.create({
    data: {
      name: values.name,
      email,
      passwordHash: await bcrypt.hash(values.password, 12),
      role: values.role,
      designation: values.designation || null,
      hospitalId: hospital?.id ?? null,
      isActive: true,
      mustChangePassword: true,
    },
  });

  await prisma.auditLog.create({
    data: { who: session.email ?? String(session.id), role: session.role, action: "create", entity: "user", entityId: String(user.id), hospitalId: user.hospitalId },
  }).catch(() => {});

  return NextResponse.json({ id: user.id, name: user.name, username: values.username }, { status: 201 });
}

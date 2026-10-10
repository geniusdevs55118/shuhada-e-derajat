import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { signToken, getCookieName } from "@/lib/auth";
import { keyFor, isRateLimited, recordFailure, resetFailures } from "@/lib/rate-limit";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const GENERIC_ERROR = "Invalid username or password";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const { username, password } = parsed.data;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = keyFor(username, ip);

  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Too many failed attempts. Try again later." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({
    where: { email: `${username}@demo.dsfhi.local` },
    include: { hospital: true },
  }).catch(() => null);

  const fallback = await prisma.user.findUnique({
    where: { email: username },
    include: { hospital: true },
  }).catch(() => null);

  const found = user ?? fallback;

  if (!found || !found.isActive) {
    recordFailure(key);
    await prisma.auditLog.create({
      data: { who: username, role: found?.role ?? "unknown", action: "login_failure", entity: "User", entityId: found ? String(found.id) : null, hospitalId: found?.hospitalId ?? null },
    }).catch(() => {});
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, found.passwordHash);
  if (!ok) {
    recordFailure(key);
    await prisma.auditLog.create({
      data: { who: username, role: found.role, action: "login_failure", entity: "User", entityId: String(found.id), hospitalId: found.hospitalId },
    }).catch(() => {});
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  resetFailures(key);
  const token = signToken({ userId: found.id, role: found.role, hospitalId: found.hospitalId });

  await prisma.auditLog.create({
    data: { who: found.email, role: found.role, action: "login_success", entity: "User", entityId: String(found.id), hospitalId: found.hospitalId },
  }).catch(() => {});

  const res = NextResponse.json({
    user: {
      id: found.id,
      name: found.name,
      role: found.role,
      hospital: found.hospital ? { code: found.hospital.code, name: found.hospital.name } : null,
      designation: found.designation,
      mustChangePassword: found.mustChangePassword,
    },
  });
  res.cookies.set(getCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60,
    path: "/",
  });
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { getCurrentUser, getCookieName } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req.cookies.get(getCookieName())?.value);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Use a password of 12–128 characters with upper case, lower case, and a number." }, { status: 400 });
  if (!(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  if (await bcrypt.compare(parsed.data.newPassword, user.passwordHash)) return NextResponse.json({ error: "Choose a password you have not used before" }, { status: 400 });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12), mustChangePassword: false } });
  await prisma.auditLog.create({ data: { who: user.email, role: user.role, action: "change_password", entity: "user", entityId: String(user.id), hospitalId: user.hospitalId } }).catch(() => {});
  return NextResponse.json({ ok: true });
}

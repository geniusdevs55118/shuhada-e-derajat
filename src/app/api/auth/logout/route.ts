import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getCookieName } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(getCookieName())?.value;
  const user = await getCurrentUser(token);

  if (user) {
    await prisma.auditLog.create({
      data: { who: user.email, role: user.role, action: "logout", entity: "User", entityId: String(user.id), hospitalId: user.hospitalId },
    }).catch(() => {});
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}

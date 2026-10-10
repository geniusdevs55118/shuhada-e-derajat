import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getCookieName } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(getCookieName())?.value;
  const user = await getCurrentUser(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      hospital: user.hospital ? { code: user.hospital.code, name: user.hospital.name } : null,
      designation: user.designation,
      mustChangePassword: user.mustChangePassword,
    },
  });
}

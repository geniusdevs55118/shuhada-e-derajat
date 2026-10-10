import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("action_tracker", "edit", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const item = await prisma.actionTracker.update({
    where: { id: Number(id) },
    data: {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.issue !== undefined ? { issue: body.issue } : {}),
      ...(body.responsibleOfficerDepartment !== undefined ? { responsibleOfficerDepartment: body.responsibleOfficerDepartment } : {}),
      ...(body.targetDate !== undefined ? { targetDate: body.targetDate ? new Date(body.targetDate) : null } : {}),
    },
  });
  return NextResponse.json(item);
}

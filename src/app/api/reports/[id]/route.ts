import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("monthly_report", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const report = await prisma.monthlyReport.findUnique({
    where: { id: Number(id) },
    include: { hospital: { select: { code: true, name: true } }, actionTracker: true },
  });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const scope = hospitalScope(session, "monthly_report");
  if (typeof scope.hospitalId === "number" && report.hospitalId !== scope.hospitalId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ ...report, hospitalName: report.hospital?.name ?? null, hospitalCode: report.hospital?.code ?? null });
}

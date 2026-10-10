import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, WG_ROLES } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("action_tracker", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status")?.trim();
  const where: Record<string, unknown> = {};
  if (session.hospitalId && session.role !== "hospital_director" && session.role !== "additional_director" && !WG_ROLES.includes(session.role)) {
    where.monthlyReport = { hospitalId: session.hospitalId };
  }
  if (status && status !== "all") where.status = status;

  const items = await prisma.actionTracker.findMany({
    where,
    include: { monthlyReport: { select: { reportNo: true, month: true, year: true, hospitalId: true, isConsolidated: true } } },
    orderBy: { targetDate: "asc" },
    take: 200,
  });
  return NextResponse.json({ data: items });
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("action_tracker", "create", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const body = await req.json();
  if (!body.monthlyReportId || !body.issue) {
    return NextResponse.json({ error: "monthlyReportId and issue are required" }, { status: 400 });
  }
  const item = await prisma.actionTracker.create({
    data: {
      monthlyReportId: Number(body.monthlyReportId),
      issue: String(body.issue),
      responsibleOfficerDepartment: body.responsibleOfficerDepartment || null,
      targetDate: body.targetDate ? new Date(body.targetDate) : null,
      status: body.status || "Open",
    },
  });
  return NextResponse.json(item, { status: 201 });
}
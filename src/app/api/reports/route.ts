import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("monthly_report", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const where: Record<string, unknown> = { ...hospitalScope(session, "monthly_report") };
  const reports = await prisma.monthlyReport.findMany({ where, orderBy: [{ year: "desc" }, { month: "desc" }], take: 50, include: { hospital: { select: { code: true, name: true } } } });
  return NextResponse.json({ data: reports });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("monthly_report", "create", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const body = await req.json();
  const month = Number(body.month);
  const year = Number(body.year);
  if (!month || !year || month < 1 || month > 12) {
    return NextResponse.json({ error: "Valid month and year are required" }, { status: 400 });
  }

  const hospitalId = session.hospitalId ?? (body.hospitalId ? Number(body.hospitalId) : null);
  const isConsolidated = body.isConsolidated === true || hospitalId === null;

  const latest = await prisma.monthlyReport.findFirst({
    where: { reportNo: { startsWith: `RPT-${year}${String(month).padStart(2, "0")}-` } },
    orderBy: { reportNo: "desc" },
    select: { reportNo: true },
  });
  const n = latest ? Number(latest.reportNo.split("-")[2]) + 1 : 1;
  const reportNo = `RPT-${year}${String(month).padStart(2, "0")}-${String(n).padStart(4, "0")}`;

  const report = await prisma.monthlyReport.create({
    data: {
      reportNo,
      month,
      year,
      hospitalId: isConsolidated ? null : hospitalId,
      isConsolidated,
      dateOfSubmission: new Date(),
      healthDeskFocalPerson: body.healthDeskFocalPerson || null,
      contactNo: body.contactNo || null,
      sehatMajorIssues: body.sehatMajorIssues || null,
      sehatCorrectiveAction: body.sehatCorrectiveAction || null,
      emergencyDelayReason: body.emergencyDelayReason || null,
      emergencyCorrectiveAction: body.emergencyCorrectiveAction || null,
      majorOperationalIssues: body.majorOperationalIssues || null,
      dignityComplaintsActionTaken: body.dignityComplaintsActionTaken || null,
      majorGrievanceNature: body.majorGrievanceNature || null,
      grievanceCorrectiveAction: body.grievanceCorrectiveAction || null,
      serviceGapFlags: body.serviceGapFlags ?? {},
      rootCauseExplanation: body.rootCauseExplanation || null,
      correctiveActionRequired: body.correctiveActionRequired || null,
      exceptionalCaseReported: body.exceptionalCaseReported ?? null,
      exceptionalCaseReferenceNo: body.exceptionalCaseReferenceNo || null,
      exceptionalCaseDescription: body.exceptionalCaseDescription || null,
      exceptionalCaseImmediateAction: body.exceptionalCaseImmediateAction || null,
      exceptionalCaseFurtherAction: body.exceptionalCaseFurtherAction || null,
      achievements: body.achievements || null,
      challenges: body.challenges || null,
      correctiveMeasures: body.correctiveMeasures || null,
      recommendationsForHospitalDirector: body.recommendationsForHospitalDirector || null,
      focalPersonSignature: body.focalPersonSignature || null,
      hospitalRepresentativeSignature: body.hospitalRepresentativeSignature || null,
      chairmanComments: body.chairmanComments || null,
      directorDirectionsSignature: body.directorDirectionsSignature || null,
      statsSnapshot: body.statsSnapshot ?? undefined,
    },
  });

  return NextResponse.json({ id: report.id, reportNo: report.reportNo }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope, logForbidden } from "@/lib/permissions";
import { MonthlyReportAnnexureDPdf } from "@/lib/pdf/report-annexure-d";


export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("monthly_report", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const report = await prisma.monthlyReport.findUnique({ where: { id: Number(id) }, include: { hospital: true, indicators: { orderBy: { sortOrder: "asc" } } } });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const scope = hospitalScope(session, "monthly_report");
  if (typeof scope.hospitalId === "number" && report.hospitalId !== scope.hospitalId) {
    await logForbidden(session, "monthly_report");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const buffer = await renderToBuffer(<MonthlyReportAnnexureDPdf report={{ ...report, hospitalName: report.hospital?.name }} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="Annexure-D-${report.reportNo}.pdf"` },
  });
}

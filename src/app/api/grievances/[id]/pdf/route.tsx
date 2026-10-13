import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope, logForbidden } from "@/lib/permissions";
import { GrievanceAnnexureEPdf } from "@/lib/pdf/grievance-annexure-e";


export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requirePermission("grievance", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const grievance = await prisma.grievance.findUnique({ where: { id: Number(id) } });
  if (!grievance) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const scope = hospitalScope(session, "grievance");
  if (typeof scope.hospitalId === "number" && grievance.hospitalId !== scope.hospitalId) {
    await logForbidden(session, "grievance");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const buffer = await renderToBuffer(<GrievanceAnnexureEPdf grievance={grievance} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="Annexure-E-${grievance.grievanceNo}.pdf"` },
  });
}

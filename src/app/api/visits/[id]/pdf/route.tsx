import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { VisitAnnexureBPdf } from "@/lib/pdf/visit-annexure-b";


export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("visit", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const visit = await prisma.visit.findUnique({ where: { id: Number(id) } });
  if (!visit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const buffer = await renderToBuffer(<VisitAnnexureBPdf visit={visit} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="Annexure-B-${visit.visitNo}.pdf"` },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { FamilyRegistrationPdf } from "@/lib/pdf/family-annexure-a";


export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("family", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const family = await prisma.family.findUnique({ where: { id: Number(id) }, include: { members: { orderBy: { serialNo: "asc" } } } }).catch(() => null);
  if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await renderToBuffer(<FamilyRegistrationPdf family={family} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Annexure-A-${family.registrationNo}.pdf"`,
    },
  });
}

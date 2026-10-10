import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { HealthCardPdf } from "@/lib/pdf/health-card";
import { publicVerifyUrl } from "@/lib/qr";


export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("card", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const card = await prisma.healthCard.findUnique({ where: { id: Number(id) } }).catch(() => null);
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const family = await prisma.family.findFirst({ where: { registrationNo: card.familyRegistrationNo }, include: { members: { orderBy: { serialNo: "asc" } } } });
  if (!card.qrDigitalVerificationId) {
    return NextResponse.json({ error: "Card has no QR verification ID" }, { status: 400 });
  }
  const verifyUrl = publicVerifyUrl(card.qrDigitalVerificationId);
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 256 });
  const buffer = await renderToBuffer(<HealthCardPdf card={card} family={family} qrSrc={qrDataUrl} />);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="HealthCard-${card.cardNo}.pdf"`,
    },
  });
}

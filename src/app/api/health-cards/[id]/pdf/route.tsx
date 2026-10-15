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

  const family = await prisma.family.findFirst({
    where: {
      OR: [
        { registrationNo: card.familyRegistrationNo },
        { healthCardNo: card.cardNo },
      ],
    },
    include: { members: { orderBy: { serialNo: "asc" } } },
  });

  if (!family) {
    return NextResponse.json(
      { error: "Family record associated with this health card could not be found." },
      { status: 404 }
    );
  }
  if (!card.qrDigitalVerificationId) {
    return NextResponse.json({ error: "Card has no QR verification ID" }, { status: 400 });
  }
  const verifyUrl = publicVerifyUrl(card.qrDigitalVerificationId);
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 256 });

  // Optional card photo and the Health Desk contact printed on the card face.
  const photo = await prisma.document
    .findFirst({ where: { familyId: family?.id ?? -1, docType: "photograph" }, orderBy: { createdAt: "asc" } })
    .catch(() => null);
  const hospital = await prisma.hospital.findFirst({ where: { id: family?.hospitalId ?? -1 }, select: { healthDeskContact: true } }).catch(() => null);
  const healthDeskContact = hospital?.healthDeskContact ?? card.issuedBy ?? null;

  const lang = req.nextUrl.searchParams.get("lang") || "en";

  const buffer = await renderToBuffer(
    <HealthCardPdf
      card={card}
      family={family}
      qrSrc={qrDataUrl}
      photoSrc={photo?.secureUrl ?? null}
      healthDeskContact={healthDeskContact}
      lang={lang}
    />
  );
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="HealthCard-${card.cardNo}${lang === "ur" ? "-Urdu" : ""}.pdf"`,
    },
  });
}

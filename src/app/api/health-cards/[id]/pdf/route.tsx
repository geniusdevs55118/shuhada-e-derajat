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
  // QR verification code on card back for facilitation desks
  const qrIdentifier = card.qrDigitalVerificationId || card.cardNo;
  const verifyUrl = publicVerifyUrl(qrIdentifier);
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 256, margin: 1 });

  // Optional card photo
  const photo = await prisma.document
    .findFirst({
      where: {
        familyId: family?.id ?? -1,
        OR: [
          { docType: "photograph" },
          { docType: "Beneficiary Photographs" },
          { resourceType: "image" },
          { originalFilename: { endsWith: ".jpg" } },
          { originalFilename: { endsWith: ".jpeg" } },
          { originalFilename: { endsWith: ".png" } },
        ],
      },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => null);

  const categoryParam = req.nextUrl.searchParams.get("category");
  const category = categoryParam === "ghazi" ? "ghazi" : categoryParam === "shaheed" ? "shaheed" : undefined;

  const buffer = await renderToBuffer(
    <HealthCardPdf
      card={card}
      family={family}
      qrSrc={qrDataUrl}
      photoSrc={photo?.secureUrl ?? null}
      category={category}
    />
  );
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="HealthCard-${card.cardNo}.pdf"`,
    },
  });
}

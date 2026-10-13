import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimitCheck } from "@/lib/rate-limit-ip";
import { getCurrentUser, getCookieName } from "@/lib/auth";

export async function GET(req: NextRequest, ctx: { params: Promise<{ qr: string }> }) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitCheck(`verify:${ip}`, 30, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { qr } = await ctx.params;
  const user = await getCurrentUser(req.cookies.get(getCookieName())?.value);
  const card = await prisma.healthCard.findFirst({ where: { qrDigitalVerificationId: qr } }).catch(() => null);
  if (!card) {
    await prisma.auditLog.create({ data: { who: user?.email ?? "public", role: user?.role ?? "public", action: "qr_scan_invalid", entity: "health_card", entityId: null, hospitalId: user?.hospitalId ?? null } }).catch(() => {});
    return NextResponse.json({ found: false, error: "This card could not be found. It may be invalid." }, { status: 404 });
  }

  await prisma.auditLog.create({ data: { who: user?.email ?? "public", role: user?.role ?? "public", action: "qr_scan", entity: "health_card", entityId: String(card.id), hospitalId: user?.hospitalId ?? null } }).catch(() => {});

  if (card.status !== "ACTIVE") {
    return NextResponse.json({
      found: true,
      status: card.status,
      cardNo: card.cardNo,
      familyRegistrationId: card.familyRegistrationNo,
      allowedHospitals: [card.accessDHQ && "DHQ", card.accessMMMTH && "MMMTH", card.accessWC && "Derajat Women & Children Hospital"].filter(Boolean),
      valid: false,
      message: card.status === "UNDER_VERIFICATION" ? "This card is still under verification. Please visit a Family Health Desk." : "This card is temporarily suspended / no longer valid. Please visit the nearest Derajat Shuhada Family Health Desk.",
    });
  }

  const family = await prisma.family.findFirst({
    where: {
      OR: [
        { registrationNo: card.familyRegistrationNo },
        { healthCardNo: card.cardNo },
      ],
    },
    include: { members: { orderBy: { serialNo: "asc" } } },
  });

  return NextResponse.json({
    found: true,
    valid: true,
    status: card.status,
    cardNo: card.cardNo,
    familyRegistrationId: family?.registrationNo ?? card.familyRegistrationNo,
    allowedHospitals: [card.accessDHQ && "DHQ", card.accessMMMTH && "MMMTH", card.accessWC && "Derajat Women & Children Hospital"].filter(Boolean),
    beneficiaries: (family?.members ?? []).map((m) => ({
      name: user ? m.name : m.name.split(/\s+/)[0],
      relationship: m.relationship,
      ...(user ? { beneficiaryId: m.beneficiaryId } : {}),
      eligibility: m.cardStatus ?? "Active",
    })),
    emergencyNote: "Emergency assessment and medically necessary immediate care shall not be delayed solely on account of routine administrative verification or documentation.",
  });
}

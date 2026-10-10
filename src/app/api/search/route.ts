import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthError, auditCrossHospitalRead, hospitalScope, requireUser } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  let user;
  try { user = await requireUser(req); }
  catch (error) { if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status }); throw error; }
  const q = new URL(req.url).searchParams.get("q")?.trim().slice(0, 64) ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });
  const [families, cards, visits] = await Promise.all([
    prisma.family.findMany({ where: { OR: [{ registrationNo: { contains: q } }, { healthCardNo: { contains: q } }, { shaheedName: { contains: q } }, { contactName: { contains: q } }, { contactCnic: { contains: q } }, { shaheedCnic: { contains: q } }, { contactMobile: { contains: q } }, { members: { some: { OR: [{ name: { contains: q } }, { cnicBForm: { contains: q } }] } } }] }, select: { id: true, registrationNo: true, shaheedName: true, contactName: true, hospitalId: true }, take: 6 }),
    prisma.healthCard.findMany({ where: { OR: [{ cardNo: { contains: q } }, { familyRegistrationNo: { contains: q } }] }, select: { id: true, cardNo: true, familyRegistrationNo: true }, take: 6 }),
    prisma.visit.findMany({ where: { ...hospitalScope(user, "visit"), OR: [{ visitNo: { contains: q } }, { beneficiaryName: { contains: q } }, { familyRegistrationNo: { contains: q } }, { healthCardNo: { contains: q } }, { beneficiaryCnicBForm: { contains: q } }] }, select: { id: true, visitNo: true, beneficiaryName: true, hospitalId: true }, take: 6 }),
  ]);
  await Promise.all(families.map((family) => auditCrossHospitalRead(user, "family", family.hospitalId)));
  await prisma.auditLog.create({ data: { who: user.email ?? String(user.id), role: user.role, action: "global_search", entity: "records", entityId: null, hospitalId: user.hospitalId } }).catch(() => {});
  const results = [
    ...families.map((family) => ({ kind: "Family", title: family.registrationNo, detail: `${family.shaheedName} · Contact ${family.contactName}`, href: `/dashboard/families/${family.id}` })),
    ...cards.map((card) => ({ kind: "Health card", title: card.cardNo, detail: `Family ${card.familyRegistrationNo}`, href: `/dashboard/health-cards/${card.id}` })),
    ...visits.map((visit) => ({ kind: "Visit", title: visit.visitNo, detail: visit.beneficiaryName, href: `/dashboard/visits/${visit.id}` })),
  ].slice(0, 15);
  return NextResponse.json({ results });
}

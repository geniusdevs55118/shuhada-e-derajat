import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError, hospitalScope } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("sehat_claim", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status")?.trim();
  const hospitalId = searchParams.get("hospitalId");

  const where: Record<string, unknown> = {};
  // scope via visit's hospital
  if (hospitalScope(session, "sehat_claim").hospitalId) {
    where.visit = { hospitalId: session.hospitalId };
  }
  if (hospitalId && hospitalId !== "all") {
    where.visit = { hospitalId: Number(hospitalId) };
  }
  if (status && status !== "all") where.status = status;

  const claims = await prisma.sehatClaim.findMany({
    where,
    include: { visit: { select: { visitNo: true, beneficiaryName: true, hospitalId: true, dateTime: true } } },
    orderBy: { id: "desc" },
    take: 200,
  });

  const hospitalIds = [...new Set(claims.map((c) => c.visit.hospitalId))];
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } } });
  const hMap = new Map(hospitals.map((h) => [h.id, h]));

  const counts = { APPROVED: 0, UNDER_PROCESS: 0, NOT_COVERED: 0, INELIGIBLE: 0 } as Record<string, number>;
  for (const c of claims) if (c.status && counts[c.status] !== undefined) counts[c.status]++;

  return NextResponse.json({
    counts,
    data: claims.map((c) => ({
      id: c.id,
      visitId: c.visitId,
      visitNo: c.visit.visitNo,
      beneficiaryName: c.visit.beneficiaryName,
      hospitalCode: hMap.get(c.visit.hospitalId)?.code ?? null,
      service: c.service,
      claimRef: c.claimRef,
      serviceDate: c.serviceDate,
      status: c.status,
      familyRegistrationNo: c.familyRegistrationNo,
    })),
  });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requirePermission("sehat_claim", "edit_sehat_section", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const body = await req.json();
  const visitId = Number(body.visitId);
  const service = String(body.service ?? "").trim();
  const claimRef = body.claimRef ? String(body.claimRef) : null;
  const status = body.status ? String(body.status) : null;
  const serviceDate = body.serviceDate ? new Date(body.serviceDate) : null;

  if (!visitId || !service) {
    return NextResponse.json({ error: "visitId and service are required" }, { status: 400 });
  }

  const visit = await prisma.visit.findUnique({ where: { id: visitId } });
  if (!visit) return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  if (session.hospitalId && visit.hospitalId !== session.hospitalId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Duplicate control 1: same visit + same service (also DB-unique)
  const dup1 = await prisma.sehatClaim.findUnique({ where: { visitId_service: { visitId, service } } });
  if (dup1) {
    return NextResponse.json({ error: "Duplicate claim: this service is already registered for this visit.", duplicateOf: dup1.id }, { status: 409 });
  }

  // Duplicate control 2: same family + same service + same service date
  if (serviceDate) {
    const dayStart = new Date(serviceDate.getFullYear(), serviceDate.getMonth(), serviceDate.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dup2 = await prisma.sehatClaim.findFirst({
      where: {
        familyRegistrationNo: visit.familyRegistrationNo,
        service,
        serviceDate: { gte: dayStart, lt: dayEnd },
      },
    });
    if (dup2) {
      return NextResponse.json({ error: "Duplicate claim: same beneficiary family, service and date already claimed.", duplicateOf: dup2.id }, { status: 409 });
    }
  }

  const claim = await prisma.sehatClaim.create({
    data: { visitId, service, claimRef, status, serviceDate: serviceDate ?? visit.dateTime, familyRegistrationNo: visit.familyRegistrationNo },
  });

  await prisma.auditLog.create({
    data: { who: session.email ?? "unknown", role: session.role, action: "create", entity: "sehat_claim", entityId: String(claim.id), hospitalId: visit.hospitalId },
  }).catch(() => {});

  return NextResponse.json(claim, { status: 201 });
}

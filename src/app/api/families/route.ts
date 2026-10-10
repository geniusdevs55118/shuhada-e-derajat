import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { familySchema, type FamilyFormValues } from "@/lib/family-schemas";
import { maskCnic } from "@/lib/cnic";
import { getCurrentUser, getCookieName } from "@/lib/auth";

function toDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

async function findDuplicateCnic(values: { shaheedCnic?: string; contactCnic: string }, excludeId?: number) {
  if (values.shaheedCnic) {
    const found = await prisma.family.findFirst({
      where: { shaheedCnic: values.shaheedCnic, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true, registrationNo: true },
    });
    if (found) return found;
  }
  const byContact = await prisma.family.findFirst({
    where: { contactCnic: values.contactCnic, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true, registrationNo: true },
  });
  return byContact;
}

export async function GET(req: NextRequest) {
  try {
    await requirePermission("family", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status")?.trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = 10;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { shaheedName: { contains: search } },
      { shaheedCnic: { contains: search } },
      { contactCnic: { contains: search } },
      { registrationNo: { contains: search } },
      { healthCardNo: { contains: search } },
      { contactMobile: { contains: search } },
    ];
  }
  if (status && status !== "all") where.verificationStatus = status;

  const [total, families] = await Promise.all([
    prisma.family.count({ where }),
    prisma.family.findMany({
      where,
      include: { _count: { select: { members: true } } },
      orderBy: { dateOfRegistration: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const cardNos = families.map((f) => f.healthCardNo).filter((x): x is string => Boolean(x));
  const cards = cardNos.length
    ? await prisma.healthCard.findMany({ where: { cardNo: { in: cardNos } }, select: { cardNo: true, status: true } })
    : [];
  const cardStatusByNo = new Map(cards.map((c) => [c.cardNo, c.status]));

  return NextResponse.json({
    total,
    page,
    pageSize,
    data: families.map((f) => ({
      id: f.id,
      registrationNo: f.registrationNo,
      dateOfRegistration: f.dateOfRegistration,
      shaheedName: f.shaheedName,
      contactName: f.contactName,
      contactCnicMasked: maskCnic(f.contactCnic),
      membersCount: f._count.members,
      verificationStatus: f.verificationStatus,
      cardStatus: f.healthCardNo ? cardStatusByNo.get(f.healthCardNo) ?? null : null,
      healthCardNo: f.healthCardNo,
    })),
  });
}

export async function POST(req: NextRequest) {
  let values: FamilyFormValues;
  try {
    await requirePermission("family", "create", req);
    const body = await req.json();
    const parsed = familySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
    }
    values = parsed.data;
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }

  const duplicate = await findDuplicateCnic(values);
  if (duplicate) {
    return NextResponse.json(
      { error: "A family is already registered with this CNIC.", existingFamilyId: duplicate.id, registrationNo: duplicate.registrationNo },
      { status: 409 },
    );
  }

  const regNo = await generateRegistrationNo();

  const family = await prisma.family.create({
    data: {
      registrationNo: regNo,
      dateOfRegistration: new Date(),
      shaheedName: values.shaheedName,
      shaheedFatherName: values.shaheedFatherName || null,
      shaheedCnic: values.shaheedCnic || null,
      shaheedServiceNo: values.shaheedServiceNo || null,
      shaheedRank: values.shaheedRank || null,
      shaheedDepartment: values.shaheedDepartment || null,
      shaheedUnit: values.shaheedUnit || null,
      shaheedDateOfShahadat: toDate(values.shaheedDateOfShahadat),
      shaheedPlaceOfShahadat: values.shaheedPlaceOfShahadat || null,
      shaheedPermanentDistrict: values.shaheedPermanentDistrict || null,
      shaheedPermanentAddress: values.shaheedPermanentAddress || null,
      shahadatCertificateNo: values.shahadatCertificateNo || null,
      shahadatIssuingAuthority: values.shahadatIssuingAuthority || null,
      contactName: values.contactName,
      contactRelationship: values.contactRelationship,
      contactCnic: values.contactCnic,
      contactMobile: values.contactMobile,
      contactAltContact: values.contactAltContact || null,
      contactPresentAddress: values.contactPresentAddress || null,
      contactDistrict: values.contactDistrict || null,
      specialDependencyDisability: values.specialDependencyDisability || null,
      documentsSubmitted: values.documentsSubmitted as unknown as object,
      documentsOther: values.documentsOtherChecked ? values.documentsOther : null,
      hospitalAccessDHQ: values.hospitalAccessDHQ,
      hospitalAccessMMMTH: values.hospitalAccessMMMTH,
      hospitalAccessWC: values.hospitalAccessWC,
      applicantName: values.applicantName || null,
      applicantRelationship: values.applicantRelationship || null,
      applicantCnic: values.applicantCnic || null,
      applicantSignature: values.applicantSignature || null,
      declarationDate: toDate(values.declarationDate),
      members: {
        create: values.members.map((m, i) => ({
          serialNo: i + 1,
          name: m.name,
          relationship: m.relationship,
          cnicBForm: m.cnicBForm || null,
          dobAge: m.dobAge || null,
          mobile: m.mobile || null,
          status: m.status || null,
        })),
      },
    },
    include: { members: true },
  });

  const current = await getCurrentUser(req.cookies.get(getCookieName())?.value);
  await prisma.auditLog.create({
    data: { who: current?.email ?? "unknown", role: current?.role ?? "unknown", action: "create", entity: "family", entityId: String(family.id), hospitalId: current?.hospitalId ?? null },
  }).catch(() => {});

  return NextResponse.json({ id: family.id, registrationNo: family.registrationNo }, { status: 201 });
}

async function generateRegistrationNo(): Promise<string> {
  const year = new Date().getFullYear();
  const latest = await prisma.family.findFirst({
    where: { registrationNo: { startsWith: `DSF-${year}-` } },
    orderBy: { registrationNo: "desc" },
    select: { registrationNo: true },
  });
  const n = latest ? Number(latest.registrationNo.split("-")[2]) + 1 : 1;
  return `DSF-${year}-${String(n).padStart(6, "0")}`;
}

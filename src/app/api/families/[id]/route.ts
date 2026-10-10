import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePermission, AuthError } from "@/lib/permissions";
import { familySchema } from "@/lib/family-schemas";
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
  return prisma.family.findFirst({
    where: { contactCnic: values.contactCnic, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true, registrationNo: true },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("family", "read", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const family = await prisma.family.findUnique({ where: { id: Number(id) }, include: { members: true } });
  if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(family);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("family", "edit", req);
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = familySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }
  const values = parsed.data;

  const duplicate = await findDuplicateCnic(values, Number(id));
  if (duplicate) {
    return NextResponse.json(
      { error: "A family is already registered with this CNIC.", existingFamilyId: duplicate.id, registrationNo: duplicate.registrationNo },
      { status: 409 },
    );
  }

  const family = await prisma.family.update({
    where: { id: Number(id) },
    data: {
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
      // Editing details clears authorization per Phase 13 rules
      authorizationDecision: null,
      authorizedOfficer: null,
      authorizedDesignation: null,
      authorizedSignature: null,
      authorizationDate: null,
      members: {
        deleteMany: {},
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
  });

  const current = await getCurrentUser(req.cookies.get(getCookieName())?.value);
  await prisma.auditLog.create({
    data: { who: current?.email ?? "unknown", role: current?.role ?? "unknown", action: "edit", entity: "family", entityId: String(family.id), hospitalId: current?.hospitalId ?? null },
  }).catch(() => {});

  return NextResponse.json({ id: family.id, registrationNo: family.registrationNo });
}

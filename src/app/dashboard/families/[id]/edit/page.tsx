import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { Forbidden } from "@/components/dashboard/forbidden";
import { FamilyForm } from "@/components/families/family-form";
import type { FamilyFormValues } from "@/lib/family-schemas";

export const instant = false;

function toInputDate(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export default async function EditFamilyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  if (!can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "family", "edit")) {
    return <Forbidden />;
  }

  const family = await prisma.family
    .findUnique({ where: { id: Number(id) }, include: { members: true } })
    .catch(() => null);
  if (!family) notFound();

  const docs = Array.isArray(family.documentsSubmitted) ? (family.documentsSubmitted as string[]) : [];
  const { DOCUMENT_OPTIONS } = await import("@/lib/family-schemas");
  const otherChecked = docs.some((d) => !(DOCUMENT_OPTIONS as readonly string[]).includes(d)) || Boolean(family.documentsOther);

  const initial: FamilyFormValues = {
    shaheedName: family.shaheedName,
    shaheedFatherName: family.shaheedFatherName ?? "",
    shaheedCnic: family.shaheedCnic ?? "",
    shaheedServiceNo: family.shaheedServiceNo ?? "",
    shaheedRank: family.shaheedRank ?? "",
    shaheedDepartment: family.shaheedDepartment ?? "",
    shaheedUnit: family.shaheedUnit ?? "",
    shaheedDateOfShahadat: toInputDate(family.shaheedDateOfShahadat),
    shaheedPlaceOfShahadat: family.shaheedPlaceOfShahadat ?? "",
    shaheedPermanentDistrict: family.shaheedPermanentDistrict ?? "",
    shaheedPermanentAddress: family.shaheedPermanentAddress ?? "",
    shahadatCertificateNo: family.shahadatCertificateNo ?? "",
    shahadatIssuingAuthority: family.shahadatIssuingAuthority ?? "",
    contactName: family.contactName,
    contactRelationship: family.contactRelationship,
    contactCnic: family.contactCnic,
    contactMobile: family.contactMobile,
    contactAltContact: family.contactAltContact ?? "",
    contactPresentAddress: family.contactPresentAddress ?? "",
    contactDistrict: family.contactDistrict ?? "",
    members: family.members.map((m) => ({ name: m.name, relationship: m.relationship, cnicBForm: m.cnicBForm ?? "", dobAge: m.dobAge ?? "", mobile: m.mobile ?? "", status: m.status ?? "" })),
    specialDependencyDisability: family.specialDependencyDisability ?? "",
    documentsSubmitted: docs,
    documentsOther: family.documentsOther ?? "",
    documentsOtherChecked: otherChecked,
    hospitalAccessDHQ: family.hospitalAccessDHQ,
    hospitalAccessMMMTH: family.hospitalAccessMMMTH,
    hospitalAccessWC: family.hospitalAccessWC,
    applicantName: family.applicantName ?? "",
    applicantRelationship: family.applicantRelationship ?? "",
    applicantCnic: family.applicantCnic ?? "",
    applicantSignature: family.applicantSignature ?? "",
    declarationDate: toInputDate(family.declarationDate),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">Edit Family — {family.registrationNo}</h1>
      <FamilyForm mode="edit" initial={initial} familyId={family.id} />
    </div>
  );
}

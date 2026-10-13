import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { FamilyDetail } from "@/components/families/family-detail";

export const instant = false;

export default async function FamilyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const family = await prisma.family
    .findUnique({ where: { id: Number(id) }, include: { members: true, documents: { orderBy: { createdAt: "desc" }, select: { id: true, docType: true, originalFilename: true, isSensitive: true, createdAt: true } } } })
    .catch(() => null);
  if (!family) notFound();

  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  const canEdit = can(session, "family", "edit");
  const canRecordVerification = can(session, "family", "record_verification");
  const canAuthorize = can(session, "family", "authorize");

  const history = await prisma.auditLog
    .findMany({ where: { entity: "family", entityId: String(family.id) }, orderBy: { createdAt: "desc" }, take: 25 })
    .catch(() => []);

  return (
    <FamilyDetail
      family={{ ...family, role: user.role }}
      canEdit={canEdit}
      canRecordVerification={canRecordVerification}
      canAuthorize={canAuthorize}
      history={history.map((entry) => ({ ...entry, createdAt: entry.createdAt.toISOString() }))}
    />
  );
}

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

  const canEdit = can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "family", "edit");
  return <FamilyDetail family={{ ...family, role: user.role }} canEdit={canEdit} />;
}

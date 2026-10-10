import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { SehatClaimsView, type ClaimRow } from "@/components/sehat/sehat-claims-view";

export const instant = false;

export default async function SehatCardPlusPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "sehat_claim", "read")) redirect("/dashboard");

  const scoped = hospitalScope(session, "sehat_claim");
  const where = typeof scoped.hospitalId === "number" ? { visit: { hospitalId: scoped.hospitalId } } : {};
  const claims = await prisma.sehatClaim.findMany({
    where,
    include: { visit: { select: { visitNo: true, beneficiaryName: true, hospitalId: true, dateTime: true } } },
    orderBy: { id: "desc" },
    take: 200,
  });
  const hospitalIds = [...new Set(claims.map((c) => c.visit.hospitalId))];
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } } });
  const hMap = new Map(hospitals.map((h) => [h.id, h]));

  const counts: Record<string, number> = { APPROVED: 0, UNDER_PROCESS: 0, NOT_COVERED: 0, INELIGIBLE: 0 };
  for (const c of claims) if (c.status && counts[c.status] !== undefined) counts[c.status]++;

  const rows: ClaimRow[] = claims.map((c) => ({
    id: c.id,
    visitId: c.visitId,
    visitNo: c.visit.visitNo,
    beneficiaryName: c.visit.beneficiaryName,
    hospitalCode: hMap.get(c.visit.hospitalId)?.code ?? null,
    service: c.service,
    claimRef: c.claimRef,
    serviceDate: c.serviceDate,
    status: c.status,
  }));

  return <SehatClaimsView rows={rows} counts={counts} canEdit={can(session, "sehat_claim", "edit_sehat_section")} hospital={user.hospital?.code ?? "All"} />;
}

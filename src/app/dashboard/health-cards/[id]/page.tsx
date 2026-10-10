import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { HealthCardDetail } from "@/components/health-cards/health-card-detail";

export const instant = false;

export default async function HealthCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const card = await prisma.healthCard
    .findUnique({
      where: { id: Number(id) },
      include: {
        updateHistory: { orderBy: { date: "desc" } },
        lostDamaged: { orderBy: { dateReported: "desc" } },
        statusChanges: { orderBy: { effectiveDate: "desc" } },
        misuseFlags: { orderBy: { createdAt: "desc" } },
      },
    })
    .catch(() => null);
  if (!card) notFound();

  const family = await prisma.family.findFirst({
    where: { registrationNo: card.familyRegistrationNo },
    include: { members: { orderBy: { serialNo: "asc" } } },
  });

  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  return (
    <HealthCardDetail
      card={JSON.parse(JSON.stringify(card))}
      family={family ? JSON.parse(JSON.stringify(family)) : null}
      role={user.role}
      canProposeStatus={can(session, "card", "propose_status_change")}
      canAuthorizeStatus={can(session, "card", "authorize_status_change")}
      canProposeLost={can(session, "card", "propose_lost_replacement")}
      canAuthorizeLost={can(session, "card", "authorize_lost_replacement")}
      canEditCard={can(session, "card", "edit")}
      canFlagMisuse={can(session, "card", "propose_misuse_flag") || can(session, "card", "authorize_misuse_flag")}
    />
  );
}

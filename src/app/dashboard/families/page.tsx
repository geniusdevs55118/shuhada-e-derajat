import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { FamiliesView } from "@/components/families/families-view";
import { maskCnic } from "@/lib/cnic";

export const instant = false;

export default async function FamiliesPage({ searchParams }: { searchParams: Promise<{ search?: string; status?: string; page?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = params.status ?? "all";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
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

  let rows: Parameters<typeof FamiliesView>[0]["rows"] = [];
  let total = 0;
  let error: string | undefined;

  try {
    total = await prisma.family.count({ where });
    const families = await prisma.family.findMany({
      where,
      include: { _count: { select: { members: true } } },
      orderBy: { dateOfRegistration: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const cardNos = families.map((f) => f.healthCardNo).filter((x): x is string => Boolean(x));
    const cards = cardNos.length
      ? await prisma.healthCard.findMany({ where: { cardNo: { in: cardNos } }, select: { cardNo: true, status: true } })
      : [];
    const cardStatusByNo = new Map(cards.map((c) => [c.cardNo, c.status]));
    rows = families.map((f) => ({
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
    }));
  } catch {
    error = "Could not load families. Please try again.";
  }

  const canCreate = can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "family", "create");

  return (
    <FamiliesView
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
      status={status}
      canCreate={canCreate}
      error={error}
    />
  );
}

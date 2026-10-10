import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { GrievancesView, type GrievanceRow } from "@/components/grievances/grievances-view";

export const instant = false;

export default async function GrievancesPage({ searchParams }: { searchParams: Promise<{ search?: string; priority?: string; hospitalId?: string; page?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "grievance", "read")) redirect("/dashboard");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const priority = params.priority ?? "all";
  const hospitalId = params.hospitalId ?? "all";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 10;

  const where: Record<string, unknown> = { ...hospitalScope(session, "grievance") };
  if (priority !== "all") where.priority = priority;
  if (hospitalId !== "all") where.hospitalId = Number(hospitalId);
  if (search) {
    where.OR = [
      { grievanceNo: { contains: search } },
      { beneficiaryName: { contains: search } },
      { familyRegistrationNo: { contains: search } },
      { healthCardNo: { contains: search } },
    ];
  }

  const [total, grievances] = await Promise.all([
    prisma.grievance.count({ where }),
    prisma.grievance.findMany({ where, orderBy: { dateTime: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  const hospitalIds = [...new Set(grievances.map((g) => g.hospitalId))];
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } } });
  const hMap = new Map(hospitals.map((h) => [h.id, h]));
  const allHospitals = await prisma.hospital.findMany({ orderBy: { id: "asc" } });

  const rows: GrievanceRow[] = grievances.map((g) => ({
    id: g.id,
    grievanceNo: g.grievanceNo,
    dateTime: g.dateTime,
    priority: g.priority,
    isRedAlert: g.isRedAlert,
    beneficiaryName: g.beneficiaryName,
    hospitalCode: hMap.get(g.hospitalId)?.code ?? null,
    closureStatus: g.closureStatus,
  }));

  return (
    <GrievancesView
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
      priority={priority}
      hospitalId={hospitalId}
      hospitals={allHospitals}
      canCreate={can(session, "grievance", "create")}
    />
  );
}

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { VisitsView, type VisitRow } from "@/components/visits/visits-view";

export const instant = false;

export default async function VisitsPage({ searchParams }: { searchParams: Promise<{ search?: string; hospitalId?: string; page?: string; emergency?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "visit", "read")) redirect("/dashboard");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const hospitalId = params.hospitalId ?? "all";
  const emergency = params.emergency ?? "";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 10;

  const where: Record<string, unknown> = { ...hospitalScope(session, "visit") };
  if (hospitalId !== "all") where.hospitalId = Number(hospitalId);
  if (search) {
    where.OR = [
      { visitNo: { contains: search } },
      { beneficiaryName: { contains: search } },
      { beneficiaryCnicBForm: { contains: search } },
      { familyRegistrationNo: { contains: search } },
    ];
  }

  const [total, visits] = await Promise.all([
    prisma.visit.count({ where }),
    prisma.visit.findMany({ where, orderBy: { dateTime: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  const hospitalIds = [...new Set(visits.map((v) => v.hospitalId))];
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: hospitalIds } } });
  const hMap = new Map(hospitals.map((h) => [h.id, h]));
  const allHospitals = await prisma.hospital.findMany({ orderBy: { id: "asc" } });

  let rows: VisitRow[] = visits.map((v) => {
    const flags = (v.emergencyFlags ?? {}) as Record<string, unknown>;
    return {
      id: v.id,
      visitNo: v.visitNo,
      dateTime: v.dateTime,
      beneficiaryName: v.beneficiaryName,
      familyRegistrationNo: v.familyRegistrationNo,
      healthCardNo: v.healthCardNo,
      hospitalCode: hMap.get(v.hospitalId)?.code ?? null,
      isEmergency: flags.emergencyCase === true || v.verification === "EMERGENCY_VERIFICATION_IN_PROCESS",
      finalStatus: v.finalStatus,
      verification: v.verification,
    };
  });
  if (emergency === "true") rows = rows.filter((v) => v.isEmergency);

  return (
    <VisitsView
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
      hospitalId={hospitalId}
      hospitals={allHospitals}
      canCreate={can(session, "visit", "create")}
      emergencyOnly={emergency}
    />
  );
}

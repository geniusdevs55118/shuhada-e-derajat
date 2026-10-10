import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { MonthlyReportsView } from "@/components/reports/monthly-reports-view";

export const instant = false;

export default async function MonthlyReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "monthly_report", "read")) redirect("/dashboard");

  const hospitals = await prisma.hospital.findMany({ orderBy: { id: "asc" } });
  const scoped = hospitalScope(session, "monthly_report");
  const reports = await prisma.monthlyReport.findMany({
    where: typeof scoped.hospitalId === "number" ? { hospitalId: scoped.hospitalId } : {},
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 50,
    include: { hospital: { select: { name: true } } },
  });

  return (
    <MonthlyReportsView
      hospitals={hospitals}
      reports={reports.map((r) => ({ id: r.id, reportNo: r.reportNo, month: r.month, year: r.year, isConsolidated: r.isConsolidated, hospitalName: r.hospital?.name ?? null }))}
      defaultMonth={new Date().getMonth() + 1}
      defaultYear={new Date().getFullYear()}
      canCreate={can(session, "monthly_report", "create")}
    />
  );
}

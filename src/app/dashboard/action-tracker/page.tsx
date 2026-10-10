import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { ActionTrackerView, type ActionRow } from "@/components/action-tracker/action-tracker-view";

export const instant = false;

export default async function ActionTrackerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "action_tracker", "read")) redirect("/dashboard");

  const where = session.hospitalId && session.role === "medical_superintendent" ? { monthlyReport: { hospitalId: session.hospitalId } } : {};
  const items = await prisma.actionTracker.findMany({
    where,
    include: { monthlyReport: { select: { reportNo: true } } },
    orderBy: { targetDate: "asc" },
    take: 200,
  });
  const reports = await prisma.monthlyReport.findMany({ orderBy: [{ year: "desc" }, { month: "desc" }], take: 50 });

  const rows: ActionRow[] = items.map((i) => ({
    id: i.id,
    issue: i.issue,
    responsibleOfficerDepartment: i.responsibleOfficerDepartment,
    targetDate: i.targetDate,
    status: i.status,
    reportNo: i.monthlyReport.reportNo,
  }));

  return <ActionTrackerView rows={rows} canManage={can(session, "action_tracker", "edit")} reports={reports.map((r) => ({ id: r.id, reportNo: r.reportNo }))} />;
}

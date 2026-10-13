import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { DepartmentReceptionView, DepartmentQueueItem } from "@/components/visits/department-reception-view";

export const instant = false;

export default async function DepartmentReceptionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "visit", "read")) {
    redirect("/dashboard");
  }

  const where: Record<string, unknown> = {
    ...hospitalScope(session, "visit"),
  };

  const visits = await prisma.visit.findMany({
    where,
    orderBy: { dateTime: "desc" },
    take: 50,
    include: {
      hospital: { select: { id: true, name: true, code: true } },
    },
  });

  const queueItems: DepartmentQueueItem[] = visits.map((v) => ({
    id: v.id,
    visitNo: v.visitNo,
    dateTime: v.dateTime,
    beneficiaryName: v.beneficiaryName,
    beneficiaryRelationship: v.beneficiaryRelationship,
    beneficiaryCnic: v.beneficiaryCnicBForm,
    shaheedName: v.shaheedName,
    familyRegistrationNo: v.familyRegistrationNo,
    healthCardNo: v.healthCardNo,
    hospitalName: v.hospital?.name ?? "Hospital Desk",
    department: v.department,
    consultant: v.consultant,
    treatmentPlan: v.treatmentPlan,
    finalStatus: v.finalStatus,
  }));

  const userHospitalName = user.hospital?.name ?? "All Hospital Counters";

  return (
    <DepartmentReceptionView
      initialQueue={queueItems}
      userHospitalName={userHospitalName}
      canManage={can(session, "visit", "edit")}
      role={user.role}
    />
  );
}

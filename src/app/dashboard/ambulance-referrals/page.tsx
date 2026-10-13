import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { can, hospitalScope } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/auth";
import { AmbulanceReferralsView } from "@/components/dashboard/ambulance-referrals-view";

export const instant = false;

export default async function AmbulanceReferralsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "visit", "read")) redirect("/dashboard");
  const rows = await prisma.visit.findMany({ where: { ...hospitalScope(session, "visit"), OR: [{ ambulanceFromTo: { not: null } }, { referralFacility: { not: null } }] }, orderBy: { dateTime: "desc" }, take: 200, select: { id: true, visitNo: true, dateTime: true, beneficiaryName: true, hospitalId: true, ambulanceFromTo: true, ambulanceDateTime: true, ambulanceStatus: true, referralFacility: true, referralReason: true, referringConsultant: true, verificationPending: true } });
  const names = await prisma.hospital.findMany({ where: { id: { in: [...new Set(rows.map((row) => row.hospitalId))] } }, select: { id: true, code: true } });
  const hospitalById = new Map(names.map((hospital) => [hospital.id, hospital.code]));
  return <AmbulanceReferralsView rows={rows.map((row) => ({ ...row, hospitalCode: hospitalById.get(row.hospitalId) ?? "—" }))} canEdit={can(session, "visit", "edit")} />;
}

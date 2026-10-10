import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { WorkingGroupView } from "@/components/dashboard/working-group-view";

export const instant = false;

export default async function WorkingGroupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "working_group", "read")) redirect("/dashboard");
  return <WorkingGroupView canManage={["additional_director", "hospital_director", "it_mis_rep"].includes(user.role)} />;
}

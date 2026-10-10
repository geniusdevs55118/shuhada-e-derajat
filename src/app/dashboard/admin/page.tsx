import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { AdminSettings } from "@/components/dashboard/admin-settings";

export const instant = false;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "user", "manage")) redirect("/dashboard");
  return <AdminSettings />;
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { Forbidden } from "@/components/dashboard/forbidden";
import { UsersAdmin } from "@/components/dashboard/users-admin";

export const instant = false;

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "user", "read")) {
    return <Forbidden />;
  }
  return <UsersAdmin />;
}

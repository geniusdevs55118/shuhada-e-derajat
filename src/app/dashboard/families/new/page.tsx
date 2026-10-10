import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { Forbidden } from "@/components/dashboard/forbidden";
import { FamilyForm } from "@/components/families/family-form";

export const instant = false;

export default async function NewFamilyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!can({ id: user.id, role: user.role, hospitalId: user.hospitalId }, "family", "create")) {
    return <Forbidden />;
  }
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">Register New Family</h1>
      <FamilyForm mode="create" />
    </div>
  );
}

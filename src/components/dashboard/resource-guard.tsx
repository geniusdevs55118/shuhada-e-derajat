import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can, type Resource } from "@/lib/permissions";
import { Forbidden } from "./forbidden";
import { ComingSoon } from "./coming-soon";

export async function ResourceGuard({ resource, title }: { resource: Resource; title: string }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  const allowed = can(session, resource, "read") || can(session, resource, "create");
  if (!allowed) return <Forbidden />;
  return <ComingSoon title={title} />;
}

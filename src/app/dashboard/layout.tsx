import { Suspense } from "react";

// The dashboard layout performs auth redirects which are inherently dynamic.
// Opt the entire dashboard segment out of instant-navigation validation so
// Next.js does not repeatedly re-request routes trying to build a static shell.
export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { headers } from "next/headers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { getMenuForRole, ROLE_LABELS } from "@/lib/menu";

async function ShellForUser({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const rawHeaders = await headers();
  const nextUrl = rawHeaders.get("next-url") ?? "";
  const parsedPathname = nextUrl ? new URL(nextUrl, "http://localhost").pathname : "";
  const pathname =
    rawHeaders.get("x-pathname") ??
    rawHeaders.get("x-invoke-path") ??
    rawHeaders.get("x-forwarded-uri") ??
    parsedPathname;
  const onChangePassword = pathname === "/dashboard/change-password";
  if (user.mustChangePassword && !onChangePassword) redirect("/dashboard/change-password");
  if (!user.mustChangePassword && onChangePassword) redirect("/dashboard");

  const menu = getMenuForRole(user.role, user.hospitalId);
  const hospital = user.hospitalId === null ? "All Hospitals" : (user.hospital?.code ?? "Unknown");

  return (
    <DashboardShell
      menu={menu}
      user={{ id: user.id, name: user.name, role: ROLE_LABELS[user.role], hospital }}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ShellForUser>{children}</ShellForUser>
    </Suspense>
  );
}

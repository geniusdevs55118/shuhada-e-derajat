import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMenuForRole, ROLE_LABELS } from "@/lib/menu";
import { getDashboardData } from "@/lib/dashboard";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { prisma } from "@/lib/db";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export const instant = false;

async function RedAlertBanner({ user }: { user: { role: string; hospitalId: number | null } }) {
  const show =
    user.role === "hospital_director" || user.role === "additional_director" || user.role === "medical_superintendent";
  if (!show) return null;
  const where: Record<string, unknown> = { isRedAlert: true, closureStatus: null };
  if (user.role === "medical_superintendent" && user.hospitalId) where.hospitalId = user.hospitalId;
  const alerts = await prisma.grievance.findMany({ where, orderBy: { dateTime: "desc" }, take: 20 });
  if (alerts.length === 0) return null;
  return (
    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 shadow-sm">
      <h2 className="text-lg font-bold text-red-800">RED ALERT: {alerts.length} open immediate-attention grievance(s)</h2>
      <ul className="mt-2 space-y-1">
        {alerts.map((g) => (
          <li key={g.id} className="flex items-center justify-between text-sm text-red-900">
            <span>{g.grievanceNo} - {g.beneficiaryName} (Hospital #{g.hospitalId})</span>
            <a href={`/dashboard/grievances/${g.id}`} className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700">Take Immediate Action</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function DashboardContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const role = user.role;
  const menu = getMenuForRole(role, user.hospitalId);
  const data = await getDashboardData({ id: user.id, role, hospitalId: user.hospitalId });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid overflow-hidden border-l-4 border-emerald-400 bg-blue-950 text-white lg:grid-cols-[1fr_19rem]">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <div className="mb-1">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-200">Official Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Welcome, {user.name}</h1>
            <p className="text-xs sm:text-sm text-blue-100/90">{user.designation ?? ROLE_LABELS[role]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              {ROLE_LABELS[role]}
            </span>
            <span className="rounded-sm bg-emerald-600 px-3 py-1 text-xs font-semibold">
              {user.hospitalId === null ? "All 3 Hospitals" : user.hospital?.name ?? "Hospital"}
            </span>
          </div>
        </div>
        <div className="relative min-h-40 lg:min-h-0">
          <Image
            src="/images/services.jpg"
            alt="Hospital staff supporting patients through care"
            fill
            sizes="(max-width: 1024px) 100vw, 304px"
            className="object-cover"
          />
        </div>
      </div>

      <RedAlertBanner user={{ role, hospitalId: user.hospitalId }} />

      <DashboardCards role={role} data={data} />

      <DashboardCharts data={data.chartData} />

      <section className="border-y border-border bg-white px-4 py-5 sm:px-5">
        <h2 className="mb-3 font-heading text-2xl text-blue-950">Quick actions</h2>
        <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {menu.filter((m) => m.href !== "/dashboard").map((m) => (
            <li key={m.href}>
              <a href={m.href} className="block border-t border-border px-1 py-3 text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
                {m.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

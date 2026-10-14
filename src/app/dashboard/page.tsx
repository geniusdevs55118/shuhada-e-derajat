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
      {/* Official Shuhada Portal Header - Pakistani Green & Gold Theme */}
      <div className="overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#013817] text-white shadow-xl">
        <div className="grid lg:grid-cols-[1fr_20rem] items-stretch">
          <div className="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  ★ Shuhada Healthcare Portal
                </span>
                <span className="text-xs font-semibold text-emerald-200">
                  Mufti Mehmood Memorial MTI • DHQ • DWCH
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                Welcome, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                {user.designation ?? ROLE_LABELS[role]}
              </p>
            </div>

            {/* Martyr Poetic Quotation in Urdu & English */}
            <div className="my-4 rounded-xl border border-amber-400/30 bg-black/25 p-3.5 backdrop-blur-sm">
              <p dir="rtl" className="font-serif text-sm sm:text-base md:text-lg font-bold text-amber-300">
                شہید کی جو موت ہے، وہ قوم کی حیات ہے • لہو جو ہے شہید کا، وہ قوم کی زکوٰۃ ہے
              </p>
              <p className="mt-1 text-[11px] sm:text-xs text-emerald-100 italic">
                &ldquo;Their sacrifice is our enduring responsibility. Honouring the Shuhada by caring for their families.&rdquo;
              </p>
            </div>

            {/* Badges & 4 Hospital Categories */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-700/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                  {ROLE_LABELS[role]}
                </span>
                <span className="rounded-md bg-amber-400 text-slate-950 px-3 py-1 text-xs font-bold shadow-sm">
                  {user.hospitalId === null ? "All 3 Network Hospitals" : user.hospital?.name ?? "Hospital"}
                </span>
              </div>

              {/* 4 Logos Mini Strip */}
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1 border border-white/10">
                <div title="Mufti Mehmood Memorial MTI" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-mmmti.svg" alt="MMMTI" width={24} height={24} className="object-contain" />
                </div>
                <div title="DHQ Teaching Hospital" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-dhq.svg" alt="DHQ" width={24} height={24} className="object-contain" />
                </div>
                <div title="Derajat Women & Children Hospital" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-dwch.svg" alt="DWCH" width={24} height={24} className="object-contain" />
                </div>
                <div title="Central Shuhada Directorate" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-dsfhi.svg" alt="DSFHI" width={24} height={24} className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Banner Artwork */}
          <div className="relative min-h-44 lg:min-h-0 border-t lg:border-t-0 lg:border-l border-amber-500/30">
            <Image
              src="/images/derajat-shuhada-banner.jpg"
              alt="Shuhada-e-Derajat Memorial Artwork"
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#01411c]/60" />
          </div>
        </div>
      </div>

      <RedAlertBanner user={{ role, hospitalId: user.hospitalId }} />

      <DashboardCards role={role} data={data} />

      <DashboardCharts data={data.chartData} />

      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
              Priority Shortcuts & Operational Actions
            </h2>
            <p className="text-xs text-slate-500">Direct access to daily hospital facilitation and beneficiary services</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            Ordered by priority
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menu.filter((m) => m.href !== "/dashboard").map((m, idx) => (
            <a
              key={m.href}
              href={m.href}
              className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-xs hover:-translate-y-0.5"
            >
              <div className="min-w-0 pr-2">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-900 truncate">
                  {m.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 group-hover:text-blue-700/80">
                  {idx < 5 ? "Daily Operational Task" : idx < 9 ? "Hospital Clinical Desk" : "System & Oversight"}
                </p>
              </div>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-400 transition-colors group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white">
                &rarr;
              </span>
            </a>
          ))}
        </div>
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

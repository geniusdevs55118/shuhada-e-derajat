import Link from "next/link";
import type { DashboardData } from "@/lib/dashboard";
import type { Role } from "@prisma/client";
import { Users, CalendarCheck, AlertTriangle, ShieldAlert, UserCog, ArrowUpRight } from "lucide-react";

function Metric({
  label,
  value,
  sub,
  icon: Icon,
  variant = "blue",
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "blue" | "emerald" | "amber" | "red";
}) {
  const styles = {
    blue: {
      border: "border-blue-600",
      bg: "bg-blue-50/50",
      iconBg: "bg-blue-100 text-blue-700",
      valColor: "text-blue-950",
    },
    emerald: {
      border: "border-emerald-600",
      bg: "bg-emerald-50/50",
      iconBg: "bg-emerald-100 text-emerald-700",
      valColor: "text-emerald-950",
    },
    amber: {
      border: "border-amber-500",
      bg: "bg-amber-50/50",
      iconBg: "bg-amber-100 text-amber-700",
      valColor: "text-amber-950",
    },
    red: {
      border: "border-red-600",
      bg: "bg-red-50/50",
      iconBg: "bg-red-100 text-red-700",
      valColor: "text-red-950",
    },
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 border-t-4 ${styles.border}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className={`mt-1.5 text-3xl font-extrabold tabular-nums tracking-tight ${styles.valColor}`}>
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${styles.iconBg}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCards({ role, data }: { role: Role; data: DashboardData }) {
  const { counts, perHospital, userCount } = data;

  if (role === "it_mis_rep") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Metric label="Registered Users" value={userCount ?? 0} icon={UserCog} variant="blue" sub="System staff accounts" />
        <Link
          href="/dashboard/users"
          className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-xs transition-all hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5 border-t-4 border-t-emerald-600"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">User Management</p>
              <ArrowUpRight className="size-4 text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-1 text-xs text-slate-500">Manage portal accounts, role-based access, and reset staff credentials.</p>
          </div>
          <span className="mt-3 text-xs font-semibold text-emerald-700">Open User Directory &rarr;</span>
        </Link>
      </div>
    );
  }

  if (role === "health_desk_officer") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Families Registered" value={counts.families} icon={Users} variant="blue" sub="Shuhada beneficiary network" />
        <Metric label="Visits This Month" value={counts.visitsThisMonth} icon={CalendarCheck} variant="emerald" sub="Facilitated clinical visits" />
        <Metric label="Open Grievances" value={counts.openGrievances} icon={AlertTriangle} variant="amber" sub="Awaiting desk resolution" />
      </div>
    );
  }

  if (role === "medical_superintendent") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Visits This Month" value={counts.visitsThisMonth} icon={CalendarCheck} variant="blue" sub="Hospital clinical load" />
        <Metric label="Open Grievances" value={counts.openGrievances} icon={AlertTriangle} variant="amber" sub="Active hospital issues" />
        <Metric label="Immediate Attention" value={counts.redGrievances} icon={ShieldAlert} variant="red" sub="Critical red alerts" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Families Registered" value={counts.families} icon={Users} variant="blue" sub="Enrolled Shuhada families" />
        <Metric label="Visits This Month" value={counts.visitsThisMonth} icon={CalendarCheck} variant="emerald" sub="Facilitated patient visits" />
        <Metric label="Open Grievances" value={counts.openGrievances} icon={AlertTriangle} variant="amber" sub="Under review / pending action" />
        <Metric label="Immediate Attention" value={counts.redGrievances} icon={ShieldAlert} variant="red" sub="Patient safety red alerts" />
      </div>

      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-heading text-2xl text-blue-950">Hospital overview</h2>
          <p className="text-sm text-gray-500">Current workload across the network</p>
        </div>
        <div className="divide-y divide-border border-y border-border bg-white">
          {perHospital.map((hospital) => (
            <article key={hospital.hospitalId} className="grid gap-4 px-4 py-5 lg:grid-cols-[minmax(15rem,1fr)_2fr] lg:items-center">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 min-w-16 text-xs font-bold tracking-wider text-emerald-800">{hospital.code}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">Dera Ismail Khan</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-4">
                <div><dt className="text-xs text-gray-500">Families</dt><dd className="mt-0.5 font-semibold tabular-nums">{hospital.families}</dd></div>
                <div><dt className="text-xs text-gray-500">Visits this month</dt><dd className="mt-0.5 font-semibold tabular-nums">{hospital.visitsThisMonth}</dd></div>
                <div><dt className="text-xs text-gray-500">Open grievances</dt><dd className="mt-0.5 font-semibold tabular-nums text-amber-800">{hospital.openGrievances}</dd></div>
                <div><dt className="text-xs text-gray-500">Immediate attention</dt><dd className="mt-0.5 font-semibold tabular-nums text-red-700">{hospital.redGrievances}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

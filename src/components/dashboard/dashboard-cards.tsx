import Link from "next/link";
import type { DashboardData } from "@/lib/dashboard";
import type { Role } from "@prisma/client";

function Metric({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="border-t-2 border-blue-800 bg-white px-4 py-4">
      <p className="text-2xl font-semibold tabular-nums text-gray-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function DashboardCards({ role, data }: { role: Role; data: DashboardData }) {
  const { counts, perHospital, userCount } = data;

  if (role === "it_mis_rep") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Metric label="Users" value={userCount ?? 0} />
        <Link href="/dashboard/users" className="border-t-2 border-emerald-700 bg-white px-4 py-4 hover:bg-slate-50">
          <p className="font-semibold text-blue-900">User management</p>
          <p className="mt-1 text-sm text-gray-600">Manage accounts, access roles and password resets.</p>
        </Link>
      </div>
    );
  }

  if (role === "health_desk_officer") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Families registered" value={counts.families} />
        <Metric label="Visits this month" value={counts.visitsThisMonth} />
        <Metric label="Open grievances" value={counts.openGrievances} />
      </div>
    );
  }

  if (role === "medical_superintendent") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Visits this month" value={counts.visitsThisMonth} />
        <Metric label="Open grievances" value={counts.openGrievances} />
        <Metric label="Immediate attention" value={counts.redGrievances} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Families registered" value={counts.families} />
        <Metric label="Visits this month" value={counts.visitsThisMonth} />
        <Metric label="Open grievances" value={counts.openGrievances} />
        <Metric label="Immediate attention" value={counts.redGrievances} />
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

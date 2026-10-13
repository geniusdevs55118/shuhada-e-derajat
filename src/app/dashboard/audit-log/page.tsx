import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";

export const instant = false;

export default async function AuditLogPage({ searchParams }: { searchParams: Promise<{ who?: string; action?: string; entity?: string; from?: string; to?: string; page?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "audit_log", "read")) redirect("/dashboard");

  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.who) where.who = { contains: params.who };
  if (params.action) where.action = { contains: params.action };
  if (params.entity) where.entity = params.entity;
  if (params.from || params.to) where.createdAt = { ...(params.from ? { gte: new Date(params.from) } : {}), ...(params.to ? { lte: new Date(params.to) } : {}) };

const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 25;
  const total = await prisma.auditLog.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (page > totalPages) redirect(`/dashboard/audit-log?${qs(1)}`);
  const logs = await prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize });

  function qs(p: number) {
    const sp = new URLSearchParams();
    for (const key of ["who", "action", "entity", "from", "to"] as const) {
      const value = params[key];
      if (value) sp.set(key, value);
    }
    sp.set("page", String(p));
    return sp.toString();
  }

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Security</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Audit Log
          </h1>
          <p className="text-sm text-slate-300/80 mt-0.5">Complete record of all system actions, changes, and access events.</p>
        </div>
      </div>
      <form method="get" className="flex flex-wrap items-end gap-3">
        <div><label className="text-xs text-gray-600">User / Email</label><input name="who" defaultValue={params.who ?? ""} className="block rounded-md border px-3 py-1.5 text-sm" /></div>
        <div><label className="text-xs text-gray-600">Action</label><input name="action" defaultValue={params.action ?? ""} className="block rounded-md border px-3 py-1.5 text-sm" /></div>
        <div><label className="text-xs text-gray-600">Entity</label><input name="entity" defaultValue={params.entity ?? ""} className="block rounded-md border px-3 py-1.5 text-sm" /></div>
        <div><label className="text-xs text-gray-600">From</label><input type="date" name="from" defaultValue={params.from ?? ""} className="block rounded-md border px-3 py-1.5 text-sm" /></div>
        <div><label className="text-xs text-gray-600">To</label><input type="date" name="to" defaultValue={params.to ?? ""} className="block rounded-md border px-3 py-1.5 text-sm" /></div>
        <button className="rounded-md border px-4 py-1.5 text-sm font-medium" type="submit">Search</button>
      </form>

      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-gray-600">
            <th className="px-4 py-2">When</th><th className="px-4 py-2">Who</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Action</th><th className="px-4 py-2">Entity</th><th className="px-4 py-2">Entity ID</th>
          </tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="px-4 py-2">{l.createdAt.toLocaleString()}</td>
                <td className="px-4 py-2">{l.who}</td>
                <td className="px-4 py-2">{l.role}</td>
                <td className="px-4 py-2">{l.action}</td>
                <td className="px-4 py-2">{l.entity}</td>
                <td className="px-4 py-2">{l.entityId ?? "-"}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No audit records.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {logs.map((l) => (
          <div key={l.id} className="rounded-xl border bg-white p-4 shadow-sm text-sm">
            <p className="font-semibold text-blue-900">{l.action} on {l.entity}</p>
            <p className="text-xs text-gray-500">{l.who} ({l.role}) - {l.createdAt.toLocaleString()}</p>
          </div>
        ))}
      </div>
<div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">Total records: {total}</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link className="rounded border px-3 py-1 text-sm" href={qs(page - 1)}>Previous</Link>
            )}
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link className="rounded border px-3 py-1 text-sm" href={qs(page + 1)}>Next</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

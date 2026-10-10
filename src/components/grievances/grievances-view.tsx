"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";

export type GrievanceRow = {
  id: number;
  grievanceNo: string;
  dateTime: string | Date;
  priority: string;
  isRedAlert: boolean;
  beneficiaryName: string;
  hospitalCode: string | null;
  closureStatus: string | null;
};

const PRIORITY_BADGE: Record<string, string> = {
  IMMEDIATE_PATIENT_SAFETY: "bg-red-600",
  URGENT: "bg-amber-500",
  ROUTINE: "bg-emerald-600",
};

export function GrievancesView({
  rows, total, page, pageSize, search, priority, hospitalId, hospitals, canCreate,
}: {
  rows: GrievanceRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  priority: string;
  hospitalId: string;
  hospitals: { id: number; code: string; name: string }[];
  canCreate: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const go = (p: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(p));
    router.push(`/dashboard/grievances?${sp.toString()}`);
  };
  const setFilter = (key: string, value: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set(key, value);
    router.push(`/dashboard/grievances?${sp.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Annexure-E</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Grievances & Feedback</h1>
            <p className="text-sm text-blue-100/80 mt-0.5">Timely Resolution · Patient Safety First · Red Alert Escalation</p>
          </div>
          {canCreate && <Link href="/dashboard/grievances/new"><Button className="bg-white text-red-900 hover:bg-red-50 font-semibold shadow-sm">Lodge Grievance</Button></Link>}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3"><form className="flex flex-wrap items-end gap-3" method="get">
        <div><label className="text-xs text-gray-600">Search</label><Input name="search" defaultValue={search} className="w-56" /></div>
        <div>
          <label className="text-xs text-gray-600">Priority</label>
          <select name="priority" defaultValue={priority} className="block rounded-md border px-3 py-2 text-sm" onChange={(e) => setFilter("priority", e.target.value)}>
            <option value="all">All</option>
            <option value="IMMEDIATE_PATIENT_SAFETY">Red / Immediate</option>
            <option value="URGENT">Urgent / Amber</option>
            <option value="ROUTINE">Routine / Green</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Hospital</label>
          <select name="hospitalId" defaultValue={hospitalId} className="block rounded-md border px-3 py-2 text-sm" onChange={(e) => setFilter("hospitalId", e.target.value)}>
            <option value="all">All</option>
            {hospitals.map((h) => <option key={h.id} value={String(h.id)}>{h.name}</option>)}
          </select>
        </div>
        <Button type="submit" variant="outline">Apply</Button>
      </form><ExportExcelButton filename="dsfhi-grievances" rows={rows.map((row) => ({ grievanceNo: row.grievanceNo, dateTime: row.dateTime, beneficiary: row.beneficiaryName, hospital: row.hospitalCode, priority: row.priority, redAlert: row.isRedAlert, status: row.closureStatus ?? "Open" }))} /></div>

      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-gray-600">
            <th className="px-4 py-2">No</th><th className="px-4 py-2">Date</th><th className="px-4 py-2">Beneficiary</th><th className="px-4 py-2">Hospital</th><th className="px-4 py-2">Priority</th><th className="px-4 py-2">Status</th>
          </tr></thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2"><Link className="text-blue-700 hover:underline" href={`/dashboard/grievances/${g.id}`}>{g.grievanceNo}</Link></td>
                <td className="px-4 py-2">{new Date(g.dateTime).toLocaleString()}</td>
                <td className="px-4 py-2">{g.beneficiaryName}</td>
                <td className="px-4 py-2">{g.hospitalCode}</td>
                <td className="px-4 py-2"><Badge className={PRIORITY_BADGE[g.priority] ?? ""}>{g.isRedAlert ? "RED ALERT" : g.priority}</Badge></td>
                <td className="px-4 py-2">{g.closureStatus ?? "Open"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <EmptyState src="/images/empty-grievances.jpg" alt="Grievance record illustration" title="No grievances found" description="Adjust filters or lodge a new grievance." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {rows.map((g) => (
          <Link key={g.id} href={`/dashboard/grievances/${g.id}`} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="font-semibold text-blue-900">{g.grievanceNo}</span><Badge className={PRIORITY_BADGE[g.priority] ?? ""}>{g.isRedAlert ? "RED ALERT" : g.priority}</Badge></div>
            <p className="text-sm text-gray-700">{g.beneficiaryName} - {g.hospitalCode}</p>
          </Link>
        ))}
        {rows.length === 0 && <EmptyState src="/images/empty-grievances.jpg" alt="Grievance record illustration" title="No grievances found" />}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page <= 1} onClick={() => go(page - 1)}>Previous</Button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => go(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

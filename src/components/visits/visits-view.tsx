"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";

export type VisitRow = {
  id: number;
  visitNo: string;
  dateTime: string | Date;
  beneficiaryName: string;
  familyRegistrationNo: string;
  healthCardNo: string | null;
  hospitalCode: string | null;
  isEmergency: boolean;
  finalStatus: string | null;
  verification: string;
};

export function VisitsView({
  rows,
  total,
  page,
  pageSize,
  search,
  hospitalId,
  hospitals,
  canCreate,
  emergencyOnly,
}: {
  rows: VisitRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  hospitalId: string;
  hospitals: { id: number; code: string; name: string }[];
  canCreate: boolean;
  emergencyOnly: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const go = (p: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(p));
    router.push(`/dashboard/visits?${sp.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Annexure-B</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Healthcare Facilitation Visits</h1>
            <p className="text-sm text-blue-100/80 mt-0.5">Patient Care First · Emergency Care First · Record Securely</p>
          </div>
          {canCreate && (
            <Link href="/dashboard/visits/new">
              <Button className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold shadow-sm">Record New Visit</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3"><form className="flex flex-wrap items-end gap-3" method="get">
        <div>
          <label className="text-xs text-gray-600">Search</label>
          <Input name="search" defaultValue={search} placeholder="Name, CNIC, Visit No..." className="w-56" />
        </div>
        <div>
          <label className="text-xs text-gray-600">Hospital</label>
          <Select defaultValue={hospitalId} onValueChange={(v) => { const sp = new URLSearchParams(params.toString()); sp.set("hospitalId", v ?? "all"); router.push(`/dashboard/visits?${sp}`); }}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hospitals</SelectItem>
              {hospitals.map((h) => (
                <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Emergency Only</label>
          <Select defaultValue={emergencyOnly} onValueChange={(v) => { const sp = new URLSearchParams(params.toString()); sp.set("emergency", v ?? ""); router.push(`/dashboard/visits?${sp}`); }}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="outline">Apply</Button>
      </form><ExportExcelButton filename="dsfhi-visits" rows={rows.map((row) => ({ visitNo: row.visitNo, dateTime: row.dateTime, beneficiary: row.beneficiaryName, familyRegistrationNo: row.familyRegistrationNo, healthCardNo: row.healthCardNo, hospital: row.hospitalCode, emergency: row.isEmergency, status: row.finalStatus ?? "In progress" }))} /></div>

      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-gray-600">
              <th className="px-4 py-2">Visit No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Beneficiary</th>
              <th className="px-4 py-2">Family Reg</th>
              <th className="px-4 py-2">Hospital</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2"><Link className="text-blue-700 hover:underline" href={`/dashboard/visits/${v.id}`}>{v.visitNo}</Link></td>
                <td className="px-4 py-2">{new Date(v.dateTime).toLocaleString()}</td>
                <td className="px-4 py-2">{v.beneficiaryName}</td>
                <td className="px-4 py-2">{v.familyRegistrationNo}</td>
                <td className="px-4 py-2">{v.hospitalCode}</td>
                <td className="px-4 py-2">{v.isEmergency ? <Badge className="bg-red-600">EMERGENCY</Badge> : <Badge variant="secondary">Routine</Badge>}</td>
                <td className="px-4 py-2">{v.finalStatus ?? "In progress"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <EmptyState src="/images/empty-visits.jpg" alt="Visit record illustration" title="No visits found" description="Adjust filters or record a new visit." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((v) => (
          <Link key={v.id} href={`/dashboard/visits/${v.id}`} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900">{v.visitNo}</span>
              {v.isEmergency ? <Badge className="bg-red-600">EMERGENCY</Badge> : <Badge variant="secondary">Routine</Badge>}
            </div>
            <p className="mt-1 text-sm text-gray-700">{v.beneficiaryName} - {v.hospitalCode}</p>
            <p className="text-xs text-gray-500">{new Date(v.dateTime).toLocaleString()}</p>
          </Link>
        ))}
        {rows.length === 0 && <EmptyState src="/images/empty-visits.jpg" alt="Visit record illustration" title="No visits found" />}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page <= 1} onClick={() => go(page - 1)}>Previous</Button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => go(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

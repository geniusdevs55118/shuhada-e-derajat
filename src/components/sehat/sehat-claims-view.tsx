"use client";

import { useState } from "react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ClaimRow = {
  id: number;
  visitId: number;
  visitNo: string;
  beneficiaryName: string;
  hospitalCode: string | null;
  service: string;
  claimRef: string | null;
  serviceDate: string | Date | null;
  status: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  APPROVED: "Approved",
  UNDER_PROCESS: "Under Process",
  NOT_COVERED: "Not Covered",
  INELIGIBLE: "Ineligible",
};

export function SehatClaimsView({ rows, counts, canEdit, hospital }: { rows: ClaimRow[]; counts: Record<string, number>; canEdit: boolean; hospital: string }) {
  const router = useRouter();
  const [visitId, setVisitId] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("UNDER_PROCESS");
  const [serviceDate, setServiceDate] = useState("");
  const [claimRef, setClaimRef] = useState("");

  const addClaim = async () => {
    const res = await fetch("/api/sehat-claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitId: Number(visitId), service, status, serviceDate: serviceDate || undefined, claimRef: claimRef || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? "Failed"); return; }
    toast.success("Claim registered");
    setVisitId(""); setService(""); setClaimRef("");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Annexure-D</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Sehat Card Plus Facilitation</h1>
          <p className="text-sm text-blue-100/80 mt-0.5">
            {hospital} · No Duplicate Claims · Zero Double Reimbursement
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Financial Control Notice:</strong> No duplicate billing, double reimbursement or overlapping claim shall be admissible for the same healthcare service. Same visit + service and same family + service + date are rejected automatically.
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["APPROVED", "UNDER_PROCESS", "NOT_COVERED", "INELIGIBLE"] as const).map((s) => (
          <div key={s} className="rounded-xl border bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-900">{counts[s] ?? 0}</p>
            <p className="text-xs text-gray-600">{STATUS_LABELS[s]}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end"><ExportExcelButton filename="dsfhi-sehat-claims" rows={rows.map((row) => ({ visitNo: row.visitNo, beneficiary: row.beneficiaryName, hospital: row.hospitalCode, service: row.service, claimReference: row.claimRef, serviceDate: row.serviceDate, status: row.status }))} /></div>

      {canEdit && (
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Register Claim</h2>
          <div className="grid gap-3 sm:grid-cols-5">
            <Input placeholder="Visit ID" value={visitId} onChange={(e) => setVisitId(e.target.value)} />
            <Input placeholder="Service" value={service} onChange={(e) => setService(e.target.value)} />
            <Input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
            <Select value={status} onValueChange={(v) => setStatus(v ?? "UNDER_PROCESS")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="UNDER_PROCESS">Under Process</SelectItem>
                <SelectItem value="NOT_COVERED">Not Covered</SelectItem>
                <SelectItem value="INELIGIBLE">Ineligible</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addClaim} className="bg-blue-600 hover:bg-blue-700">Add</Button>
          </div>
        </section>
      )}

      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-gray-600">
            <th className="px-4 py-2">Visit</th><th className="px-4 py-2">Beneficiary</th><th className="px-4 py-2">Hospital</th><th className="px-4 py-2">Service</th><th className="px-4 py-2">Date</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Ref</th>
          </tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-2">{c.visitNo}</td>
                <td className="px-4 py-2">{c.beneficiaryName}</td>
                <td className="px-4 py-2">{c.hospitalCode}</td>
                <td className="px-4 py-2">{c.service}</td>
                <td className="px-4 py-2">{c.serviceDate ? new Date(c.serviceDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2"><Badge variant="secondary">{STATUS_LABELS[c.status ?? ""] ?? c.status ?? "-"}</Badge></td>
                <td className="px-4 py-2">{c.claimRef ?? "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="px-4 py-4"><EmptyState src="/images/empty-sehat.jpg" alt="Sehat Card Plus claim illustration" title="No claims recorded" description="Claims will appear here when a visit is referred to the Sehat Card Plus desk." /></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {rows.map((c) => (
          <div key={c.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="font-semibold">{c.visitNo}</span><Badge variant="secondary">{STATUS_LABELS[c.status ?? ""] ?? c.status ?? "-"}</Badge></div>
            <p className="text-sm text-gray-700">{c.beneficiaryName} - {c.service}</p>
            <p className="text-xs text-gray-500">{c.hospitalCode} {c.serviceDate ? `- ${new Date(c.serviceDate).toLocaleDateString()}` : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

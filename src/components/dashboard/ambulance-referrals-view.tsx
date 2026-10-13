"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Referral = { id: number; visitNo: string; dateTime: Date | string; beneficiaryName: string; ambulanceFromTo: string | null; ambulanceDateTime: Date | string | null; ambulanceStatus: string | null; referralFacility: string | null; referralReason: string | null; referringConsultant: string | null; verificationPending: boolean; hospitalCode: string };
const statuses = ["REQUESTED", "COORDINATING", "FACILITATED", "REFERRED", "CLOSED"];

export function AmbulanceReferralsView({ rows, canEdit }: { rows: Referral[]; canEdit: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function update(id: number, status: string) {
    setError("");
    const response = await fetch(`/api/visits/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ambulanceStatus: status }) });
    if (!response.ok) { const body = await response.json().catch(() => null); setError(body?.error ?? "Could not update referral status"); return; }
    router.refresh();
  }
  async function clearVerificationPending(id: number) {
    setError("");
    const response = await fetch(`/api/visits/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verificationPending: false }) });
    if (!response.ok) { const body = await response.json().catch(() => null); setError(body?.error ?? "Could not update verification status"); return; }
    router.refresh();
  }
  return <div className="space-y-4"><div className="dashboard-page-heading"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">Annexure-B · Section J</p><h1 className="text-xl font-bold text-white sm:text-2xl">Ambulance &amp; Referral Coordination</h1><p className="mt-1 text-sm text-blue-100/80">Requests, destinations, coordination status and referral details.</p></div>
    <div className="flex justify-end"><Link href="/dashboard/visits/new" className="rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white">Record a visit / request</Link></div>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="grid gap-3">{rows.map((row) => <article key={row.id} className="rounded-xl border bg-white p-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/dashboard/visits/${row.id}`} className="font-semibold text-blue-800 underline">{row.visitNo}</Link><p className="mt-1 text-sm font-medium">{row.beneficiaryName} · {row.hospitalCode}</p><p className="text-xs text-gray-500">{new Date(row.dateTime).toLocaleString()}</p></div>{canEdit ? <label className="text-xs text-gray-600">Status<select value={row.ambulanceStatus ?? "REQUESTED"} onChange={(event) => void update(row.id, event.target.value)} className="ml-2 rounded border px-2 py-1 text-sm">{statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></label> : <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-900">{row.ambulanceStatus ?? "REQUESTED"}</span>}</div><dl className="mt-4 grid gap-3 border-t pt-3 text-sm sm:grid-cols-2"><div><dt className="text-gray-500">From / To</dt><dd>{row.ambulanceFromTo || "Not recorded"}</dd></div><div><dt className="text-gray-500">Referral facility</dt><dd>{row.referralFacility || "Not recorded"}</dd></div><div><dt className="text-gray-500">Reason</dt><dd>{row.referralReason || "—"}</dd></div><div><dt className="text-gray-500">Referring consultant</dt><dd>{row.referringConsultant || "—"}</dd></div>{row.verificationPending && canEdit && <div><dt className="text-gray-500">Verification</dt><dd><button type="button" onClick={() => void clearVerificationPending(row.id)} className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">Mark verification complete</button></dd></div>}</dl></article>)}{rows.length === 0 && <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-600">No ambulance or referral requests are recorded. Record them from a healthcare visit.</div>}</div>
  </div>;
}

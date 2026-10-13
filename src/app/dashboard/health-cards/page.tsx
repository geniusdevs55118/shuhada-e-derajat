"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { maskCnic } from "@/lib/cnic";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";


type CardRow = {
  id: number;
  cardNo: string;
  familyRegistrationNo: string;
  status: string;
  dateOfCardIssue: string | null;
  shaheedName: string | null;
  contactCnic: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  UNDER_VERIFICATION: "Under Verification",
  TEMPORARILY_SUSPENDED: "Temporarily Suspended",
  CLOSED: "Closed",
};

const BADGE: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  UNDER_VERIFICATION: "bg-amber-100 text-amber-800",
  TEMPORARILY_SUSPENDED: "bg-red-100 text-red-800",
  CLOSED: "bg-gray-200 text-gray-700",
};

export default function HealthCardsPage() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/health-cards?${params.toString()}`);
    const data = await res.json();
    setCards(data.data ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Annexure-C</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Shuhada Health Cards</h1>
          <p className="text-sm text-blue-100/80 mt-0.5">Verify Once · Record Securely · Facilitate Consistently</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
<input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search Card No, Reg No, or Shaheed Name"
          className="rounded-md border px-3 py-2 text-sm flex-1 min-w-[240px]"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2 text-sm">
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="UNDER_VERIFICATION">Under Verification</option>
          <option value="TEMPORARILY_SUSPENDED">Temporarily Suspended</option>
          <option value="CLOSED">Closed</option>
        </select>
        </div>
<ExportExcelButton filename="dsfhi-health-cards" rows={cards.map((card) => ({ cardNo: card.cardNo, familyRegistrationNo: card.familyRegistrationNo, shaheedName: card.shaheedName, status: STATUS_LABELS[card.status] ?? card.status, dateOfIssue: card.dateOfCardIssue }))} />
      </div>
      {!loading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button type="button" className="rounded border px-3 py-1 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span className="px-2 py-1">Page {page} of {totalPages}</span>
              <button type="button" className="rounded border px-3 py-1 disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-left text-blue-900">
            <tr>
              <th className="p-3">Card No</th>
              <th className="p-3">Reg No</th>
              <th className="p-3">Shaheed Name</th>
              <th className="p-3">CNIC</th>
              <th className="p-3">Status</th>
              <th className="p-3">Issued</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-gray-400" colSpan={6}>Loading...</td></tr>
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <EmptyState src="/images/empty-health-card.jpg" alt="Health card illustration" title="No health cards found" description="Adjust your filters or issue a new card from a family record." />
                </td>
              </tr>
            ) : (
              cards.map((c) => (
                <tr key={c.id} className="border-t hover:bg-blue-50/40">
                  <td className="p-3 font-medium">
                    <Link href={`/dashboard/health-cards/${c.id}`} className="text-blue-700 underline">{c.cardNo}</Link>
                  </td>
                  <td className="p-3">{c.familyRegistrationNo}</td>
                  <td className="p-3">{c.shaheedName ?? "—"}</td>
                  <td className="p-3">{maskCnic(c.contactCnic)}</td>
                  <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-medium ${BADGE[c.status] ?? "bg-gray-100"}`}>{STATUS_LABELS[c.status] ?? c.status}</span></td>
                  <td className="p-3">{c.dateOfCardIssue ? new Date(c.dateOfCardIssue).toLocaleDateString() : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-4">Loading cards...</p>
        ) : cards.length === 0 ? (
          <EmptyState src="/images/empty-health-card.jpg" alt="Health card illustration" title="No health cards found" />
        ) : (
          cards.map((c) => (
            <Link key={c.id} href={`/dashboard/health-cards/${c.id}`} className="rounded-xl border bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">{c.cardNo}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${BADGE[c.status] ?? "bg-gray-100"}`}>{STATUS_LABELS[c.status] ?? c.status}</span>
              </div>
              <p className="mt-1 text-sm text-gray-800 font-medium">{c.shaheedName ?? "—"}</p>
              <p className="text-xs text-gray-500">Reg: {c.familyRegistrationNo} · CNIC: {maskCnic(c.contactCnic)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

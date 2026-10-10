"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ActionRow = {
  id: number;
  issue: string;
  responsibleOfficerDepartment: string | null;
  targetDate: string | Date | null;
  status: string | null;
  reportNo: string;
};

export function ActionTrackerView({ rows, canManage, reports }: { rows: ActionRow[]; canManage: boolean; reports: { id: number; reportNo: string }[] }) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [issue, setIssue] = useState("");
  const [officer, setOfficer] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [reportId, setReportId] = useState(reports[0]?.id ? String(reports[0].id) : "");

  const filtered = status === "all" ? rows : rows.filter((r) => (r.status ?? "Open") === status);

  const updateStatus = async (id: number, s: string) => {
    const res = await fetch(`/api/action-tracker/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
    if (!res.ok) { toast.error("Failed to update"); return; }
    router.refresh();
  };

  const add = async () => {
    if (!reportId || !issue) { toast.error("Report and issue are required"); return; }
    const res = await fetch("/api/action-tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthlyReportId: Number(reportId), issue, responsibleOfficerDepartment: officer || undefined, targetDate: targetDate || undefined }),
    });
    if (!res.ok) { const d = await res.json(); toast.error(d.error ?? "Failed"); return; }
    toast.success("Action added");
    setIssue(""); setOfficer(""); setTargetDate("");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Follow-Up</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Action Tracker
          </h1>
          <p className="text-sm text-blue-100/80 mt-0.5">Track corrective actions, responsible officers, and completion deadlines.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Filter by status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border px-3 py-1.5 text-sm">
          <option value="all">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {canManage && (
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Add Action Item</h2>
          <div className="grid gap-3 sm:grid-cols-5">
            <select value={reportId} onChange={(e) => setReportId(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
              <option value="">Select report</option>
              {reports.map((r) => <option key={r.id} value={String(r.id)}>{r.reportNo}</option>)}
            </select>
            <Input placeholder="Issue / Action Required" value={issue} onChange={(e) => setIssue(e.target.value)} />
            <Input placeholder="Responsible Officer / Dept" value={officer} onChange={(e) => setOfficer(e.target.value)} />
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            <Button onClick={add} className="bg-blue-600 hover:bg-blue-700">Add</Button>
          </div>
        </section>
      )}

      <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-gray-600">
            <th className="px-4 py-2">Issue</th><th className="px-4 py-2">Responsible Officer / Dept</th><th className="px-4 py-2">Target Date</th><th className="px-4 py-2">Report</th><th className="px-4 py-2">Status</th>
          </tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-2">{r.issue}</td>
                <td className="px-4 py-2">{r.responsibleOfficerDepartment ?? "-"}</td>
                <td className="px-4 py-2">{r.targetDate ? new Date(r.targetDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2">{r.reportNo}</td>
                <td className="px-4 py-2">
                  {canManage ? (
                    <select value={r.status ?? "Open"} onChange={(e) => updateStatus(r.id, e.target.value)} className="rounded-md border px-2 py-1 text-xs">
                      <option>Open</option><option>In Progress</option><option>Completed</option>
                    </select>
                  ) : (
                    r.status ?? "Open"
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No action items.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="font-semibold text-blue-900">{r.issue}</p>
            <p className="text-xs text-gray-500">{r.responsibleOfficerDepartment ?? "-"} - {r.targetDate ? new Date(r.targetDate).toLocaleDateString() : "-"}</p>
            <p className="mt-1 text-xs">Status: {r.status ?? "Open"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

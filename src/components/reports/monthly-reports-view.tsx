/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";

const GAP_OPTIONS = [
  "OPD overcrowding", "Emergency waiting time", "Diagnostics delay", "Radiology backlog",
  "Medicine stock-outs", "Admission delays", "Surgery scheduling", "ICU bed availability",
  "Sehat Card Plus processing", "Ambulance response", "Referral coordination", "Staff shortage",
];

const KPI_INDICATORS = [
  "Card issuance",
  "Emergency care",
  "OPD facilitation",
  "Diagnostics",
  "Pharmacy",
  "Admissions",
  "Surgical procedures",
  "Sehat Card Plus",
  "Ambulance",
  "Referrals",
];

const KPI_STATUSES = ["On Track", "Needs Attention"];

type IndicatorRow = { indicator: string; target: string; achievement: string; status: string; remarks: string };

const emptyIndicators = (): IndicatorRow[] =>
  KPI_INDICATORS.map((indicator) => ({ indicator, target: "", achievement: "", status: "On Track", remarks: "" }));

export function MonthlyReportsView({ hospitals, reports, defaultMonth, defaultYear, canCreate }: { hospitals: { id: number; code: string; name: string }[]; reports: { id: number; reportNo: string; month: number; year: number; isConsolidated: boolean; hospitalName: string | null }[]; defaultMonth: number; defaultYear: number; canCreate: boolean }) {
  const router = useRouter();
  const [hospitalId, setHospitalId] = useState("all");
  const [month, setMonth] = useState(String(defaultMonth));
  const [year, setYear] = useState(String(defaultYear));
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<Record<string, boolean>>({});
  const [rootCause, setRootCause] = useState("");
  const [corrective, setCorrective] = useState("");
  const [exceptional, setExceptional] = useState(false);
  const [exceptionalRef, setExceptionalRef] = useState("");
  const [exceptionalDesc, setExceptionalDesc] = useState("");
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [correctiveMeasures, setCorrectiveMeasures] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [focalPersonSignature, setFocalPersonSignature] = useState("");
  const [hospitalRepresentativeSignature, setHospitalRepresentativeSignature] = useState("");
  const [chairmanComments, setChairmanComments] = useState("");
  const [directorDirectionsSignature, setDirectorDirectionsSignature] = useState("");
  const [indicators, setIndicators] = useState<IndicatorRow[]>(emptyIndicators);
  const [sehatMajorIssues, setSehatMajorIssues] = useState("");
  const [sehatCorrectiveAction, setSehatCorrectiveAction] = useState("");
  const [emergencyDelayReason, setEmergencyDelayReason] = useState("");
  const [emergencyCorrectiveAction, setEmergencyCorrectiveAction] = useState("");
  const [majorOperationalIssues, setMajorOperationalIssues] = useState("");
  const [dignityComplaintsActionTaken, setDignityComplaintsActionTaken] = useState("");
  const [majorGrievanceNature, setMajorGrievanceNature] = useState("");
  const [grievanceCorrectiveAction, setGrievanceCorrectiveAction] = useState("");
  const [exceptionalImmediateAction, setExceptionalImmediateAction] = useState("");
  const [exceptionalFurtherAction, setExceptionalFurtherAction] = useState("");
  const [healthDeskFocalPerson, setHealthDeskFocalPerson] = useState("");
  const [contactNo, setContactNo] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/live-stats?month=${month}&year=${year}&hospitalId=${hospitalId}`);
      if (!res.ok) { toast.error("Failed to compute live stats"); return; }
      const computed = await res.json();
      setStats(computed);
      setIndicators(suggestIndicators(computed));
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: Number(month), year: Number(year),
        hospitalId: hospitalId === "all" ? undefined : Number(hospitalId),
        isConsolidated: hospitalId === "all",
        statsSnapshot: stats,
        healthDeskFocalPerson, contactNo,
        sehatMajorIssues, sehatCorrectiveAction,
        emergencyDelayReason, emergencyCorrectiveAction,
        majorOperationalIssues, dignityComplaintsActionTaken,
        majorGrievanceNature, grievanceCorrectiveAction,
        exceptionalCaseImmediateAction: exceptionalImmediateAction,
        exceptionalCaseFurtherAction: exceptionalFurtherAction,
        indicators,
        serviceGapFlags: gaps,
        rootCauseExplanation: rootCause, correctiveActionRequired: corrective,
        exceptionalCaseReported: exceptional, exceptionalCaseReferenceNo: exceptionalRef, exceptionalCaseDescription: exceptionalDesc,
        achievements, challenges, correctiveMeasures, recommendationsForHospitalDirector: recommendations,
        focalPersonSignature, hospitalRepresentativeSignature, chairmanComments, directorDirectionsSignature,
      }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }
    toast.success(`Report ${data.reportNo} saved`);
    router.refresh();
  };

  const maxService = stats ? Math.max(1, ...Object.values(stats.sectionC?.byService ?? {}) as number[]) : 1;

  return (
    <div className="space-y-6">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Annexure-F</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Monthly Monitoring, Evaluation &amp; Facilitation Report
          </h1>
          <p className="text-sm text-blue-100/80 mt-0.5">Live statistics · Trend analysis · Evidence-based decision making</p>
        </div>
      </div>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <Label>Hospital / Scope</Label>
            <select value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              <option value="all">Consolidated (All 3 Hospitals)</option>
              {hospitals.map((h) => <option key={h.id} value={String(h.id)}>{h.name}</option>)}
            </select>
          </div>
          <div><Label>Month</Label><Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} /></div>
          <div><Label>Year</Label><Input type="number" value={year} onChange={(e) => setYear(e.target.value)} /></div>
          <div className="flex items-end"><Button onClick={generate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">{loading ? "Computing..." : "Generate Live Summary"}</Button></div>
        </div>
      </section>

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi label="Total Families" value={stats.sectionB?.totalFamiliesRegistered} />
            <Kpi label="New Families" value={stats.sectionB?.newFamiliesThisMonth} />
            <Kpi label="Verified Beneficiaries" value={stats.sectionB?.totalVerifiedBeneficiaries} />
            <Kpi label="Cards Issued" value={stats.sectionB?.healthCardsIssuedThisMonth} />
            <Kpi label="Visits This Month" value={stats.sectionC?.totalVisits} />
            <Kpi label="Emergency Cases" value={stats.sectionE?.emergencyCasesReceived} />
            <Kpi label="Sehat Claims Approved" value={stats.sectionD?.claimsApproved} />
            <Kpi label="Grievances" value={stats.sectionI?.totalReceived} />
          </div>

          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">C. Healthcare Utilization by Service</h2>
            <div className="space-y-1">
              {Object.entries(stats.sectionC?.byService ?? {}).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-sm">
                  <span className="w-44 text-gray-600">{k}</span>
                  <div className="h-4 flex-1 rounded bg-slate-100">
                    <div className="h-4 rounded bg-blue-500" style={{ width: `${((v as number) / maxService) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right font-medium">{v as number}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-2">
            <MiniTable title="D. Sehat Card Plus" rows={[["Facilitated", stats.sectionD?.beneficiariesFacilitated], ["Approved", stats.sectionD?.claimsApproved], ["Pending", stats.sectionD?.claimsPending], ["Not Covered", stats.sectionD?.notCovered]]} />
            <MiniTable title="E. Emergency & Priority" rows={[["Emergency Cases", stats.sectionE?.emergencyCasesReceived], ["Treated Before Verification", stats.sectionE?.treatedBeforeVerification]]} />
            <MiniTable title="F. Ambulance & Referral" rows={[["Ambulance", stats.sectionF?.ambulanceCases], ["Referrals", stats.sectionF?.referrals]]} />
            <MiniTable title="G. Health Desk" rows={[["Approached", stats.sectionG?.beneficiariesApproached], ["Resolved", stats.sectionG?.casesResolved], ["Escalated", stats.sectionG?.casesEscalated], ["Pending", stats.sectionG?.casesPending]]} />
            <MiniTable title="I. Grievance Redressal" rows={[["Total", stats.sectionI?.totalReceived], ["Resolved", stats.sectionI?.resolved], ["Pending", stats.sectionI?.pending], ["Urgent", stats.sectionI?.urgentCases], ["Red Alerts", stats.sectionI?.redAlerts]]} />
          </section>
        </>
      )}

      {canCreate && (
        <section className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Narrative Sections (D, E, G, H, I)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>D. Sehat Card Plus - Major Issues</Label><Textarea value={sehatMajorIssues} onChange={(e) => setSehatMajorIssues(e.target.value)} /></div>
            <div><Label>D. Sehat Card Plus - Corrective Action</Label><Textarea value={sehatCorrectiveAction} onChange={(e) => setSehatCorrectiveAction(e.target.value)} /></div>
            <div><Label>E. Emergency - Reason for Delays</Label><Textarea value={emergencyDelayReason} onChange={(e) => setEmergencyDelayReason(e.target.value)} /></div>
            <div><Label>E. Emergency - Corrective Action</Label><Textarea value={emergencyCorrectiveAction} onChange={(e) => setEmergencyCorrectiveAction(e.target.value)} /></div>
            <div><Label>G. Health Desk - Major Operational Issues</Label><Textarea value={majorOperationalIssues} onChange={(e) => setMajorOperationalIssues(e.target.value)} /></div>
            <div><Label>H. Dignity Complaints - Action Taken</Label><Textarea value={dignityComplaintsActionTaken} onChange={(e) => setDignityComplaintsActionTaken(e.target.value)} /></div>
            <div><Label>I. Grievances - Major Nature</Label><Textarea value={majorGrievanceNature} onChange={(e) => setMajorGrievanceNature(e.target.value)} /></div>
            <div><Label>I. Grievances - Corrective Action</Label><Textarea value={grievanceCorrectiveAction} onChange={(e) => setGrievanceCorrectiveAction(e.target.value)} /></div>
          </div>

          <h2 className="font-semibold">Report Header</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Health Desk Focal Person</Label><Input value={healthDeskFocalPerson} onChange={(e) => setHealthDeskFocalPerson(e.target.value)} /></div>
            <div><Label>Contact No</Label><Input value={contactNo} onChange={(e) => setContactNo(e.target.value)} /></div>
          </div>

          <h2 className="font-semibold">O. KPI Table</h2>
          <p className="text-xs text-gray-500">Achievements are filled from the live summary. Adjust the target or flag anything that needs attention.</p>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr><th className="px-2 py-2">Indicator</th><th className="px-2 py-2">Target</th><th className="px-2 py-2">Achievement</th><th className="px-2 py-2">Status</th><th className="px-2 py-2">Remarks</th></tr>
              </thead>
              <tbody>
                {indicators.map((row, index) => (
                  <tr key={row.indicator} className="border-t">
                    <td className="px-2 py-1.5 font-medium">{row.indicator}</td>
                    <td className="px-2 py-1.5">
                      <Input aria-label={`Target for ${row.indicator}`} value={row.target} onChange={(e) => setIndicators(indicators.map((r, i) => (i === index ? { ...r, target: e.target.value } : r)))} className="h-8" />
                    </td>
                    <td className="px-2 py-1.5">
                      <Input aria-label={`Achievement for ${row.indicator}`} value={row.achievement} onChange={(e) => setIndicators(indicators.map((r, i) => (i === index ? { ...r, achievement: e.target.value } : r)))} className="h-8" />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        aria-label={`Status for ${row.indicator}`}
                        value={row.status}
                        onChange={(e) => setIndicators(indicators.map((r, i) => (i === index ? { ...r, status: e.target.value } : r)))}
                        className={`h-8 rounded-md border px-2 text-xs ${row.status === "Needs Attention" ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-900"}`}
                      >
                        {KPI_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <Input aria-label={`Remarks for ${row.indicator}`} value={row.remarks} onChange={(e) => setIndicators(indicators.map((r, i) => (i === index ? { ...r, remarks: e.target.value } : r)))} className="h-8" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-semibold">J. Service Gaps / Bottlenecks</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GAP_OPTIONS.map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <Checkbox checked={gaps[g] === true} onCheckedChange={(c) => setGaps({ ...gaps, [g]: c === true })} />
                {g}
              </label>
            ))}
          </div>
          <div><Label>Root Cause Explanation</Label><Textarea value={rootCause} onChange={(e) => setRootCause(e.target.value)} /></div>
          <div><Label>Corrective Action Required</Label><Textarea value={corrective} onChange={(e) => setCorrective(e.target.value)} /></div>

          <h2 className="font-semibold">K. Serious / Exceptional Case</h2>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={exceptional} onCheckedChange={(c) => setExceptional(c === true)} /> Case reported</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Reference No" value={exceptionalRef} onChange={(e) => setExceptionalRef(e.target.value)} />
            <Input placeholder="Brief Description" value={exceptionalDesc} onChange={(e) => setExceptionalDesc(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Textarea placeholder="Immediate Action Taken" value={exceptionalImmediateAction} onChange={(e) => setExceptionalImmediateAction(e.target.value)} />
            <Textarea placeholder="Further Action Required" value={exceptionalFurtherAction} onChange={(e) => setExceptionalFurtherAction(e.target.value)} />
          </div>

          <h2 className="font-semibold">L. Working Group Review</h2>
          <Textarea placeholder="Achievements" value={achievements} onChange={(e) => setAchievements(e.target.value)} />
          <Textarea placeholder="Challenges" value={challenges} onChange={(e) => setChallenges(e.target.value)} />
          <Textarea placeholder="Corrective Measures" value={correctiveMeasures} onChange={(e) => setCorrectiveMeasures(e.target.value)} />
          <Textarea placeholder="Recommendations for Hospital Director" value={recommendations} onChange={(e) => setRecommendations(e.target.value)} />

          <h2 className="font-semibold">N. Certification & Review</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Health Desk Focal Person Signature" value={focalPersonSignature} onChange={(e) => setFocalPersonSignature(e.target.value)} />
            <Input placeholder="Hospital Representative Signature" value={hospitalRepresentativeSignature} onChange={(e) => setHospitalRepresentativeSignature(e.target.value)} />
            <Input placeholder="Chairman / Convener Comments" value={chairmanComments} onChange={(e) => setChairmanComments(e.target.value)} />
            <Input placeholder="Hospital Director Directions" value={directorDirectionsSignature} onChange={(e) => setDirectorDirectionsSignature(e.target.value)} />
          </div>

          <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700">Save Official Monthly Report</Button>
        </section>
      )}

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Saved Reports</h2><ExportExcelButton filename={`dsfhi-monthly-reports-${month}-${year}`} rows={reports.map((r) => ({ reportNo: r.reportNo, month: r.month, year: r.year, type: r.isConsolidated ? "Consolidated" : "Hospital", hospital: r.hospitalName }))} /></div>
        <div className="space-y-1">
          {reports.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <span>{r.reportNo} - {r.month}/{r.year} {r.isConsolidated ? "(Consolidated)" : `(${r.hospitalName ?? ""})`}</span>
              <Link href={`/api/reports/${r.id}/pdf`} target="_blank" className="text-blue-700 hover:underline">PDF</Link>
            </div>
          ))}
          {reports.length === 0 && <p className="text-sm text-gray-500">No reports saved yet.</p>}
        </div>
      </section>
    </div>
  );
}

/** Prefill each KPI achievement from the figures just computed for this month. */
function suggestIndicators(stats: any): IndicatorRow[] {
  const byService = (stats?.sectionC?.byService ?? {}) as Record<string, number>;
  const num = (key: string) => byService[key] ?? 0;
  const achievements: Record<string, string> = {
    "Card issuance": `${stats?.sectionB?.healthCardsIssuedThisMonth ?? 0} issued this month`,
    "Emergency care": `${stats?.sectionE?.emergencyCasesReceived ?? 0} received, ${stats?.sectionE?.treatedBeforeVerification ?? 0} treated before verification`,
    "OPD facilitation": `${num("OPD")} OPD visits facilitated`,
    Diagnostics: `${num("Laboratory") + num("Radiology")} diagnostic encounters`,
    Pharmacy: `${num("Medicines")} medicine facilitations`,
    Admissions: `${num("Admission")} admissions coordinated`,
    "Surgical procedures": `${num("Operation / Procedure")} procedures`,
    "Sehat Card Plus": `${stats?.sectionD?.claimsApproved ?? 0} approved, ${stats?.sectionD?.claimsPending ?? 0} pending`,
    Ambulance: `${stats?.sectionF?.ambulanceCases ?? 0} ambulance cases`,
    Referrals: `${stats?.sectionF?.referrals ?? 0} referrals`,
  };
  return emptyIndicators().map((row) => ({ ...row, achievement: achievements[row.indicator] ?? "" }));
}

function Kpi({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-blue-900">{value ?? 0}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function MiniTable({ title, rows }: { title: string; rows: [string, number | null | undefined][] }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-gray-800">{title}</h3>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b last:border-0"><td className="py-1 text-gray-600">{k}</td><td className="py-1 text-right font-medium">{v ?? 0}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

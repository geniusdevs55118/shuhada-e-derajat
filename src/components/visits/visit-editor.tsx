"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const PROCEDURE_STATUSES = ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
const INVESTIGATION_STATUSES = ["NOT_REQUIRED", "REQUESTED", "IN_PROGRESS", "COMPLETED", "NOT_AVAILABLE"] as const;
const AMBULANCE_STATUSES = ["REQUESTED", "COORDINATING", "FACILITATED", "REFERRED", "CLOSED"] as const;

const asInputDate = (value: string | Date | null) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

export function VisitEditor({
  id,
  initial,
}: {
  id: number;
  initial: {
    beneficiaryFatherHusbandGuardian: string | null;
    department: string | null;
    consultant: string | null;
    opdMrNo: string | null;
    diagnosis: string | null;
    treatmentPlan: string | null;
    followUpDate: string | Date | null;
    investigationsStatus: string | null;
    ward: string | null;
    admissionDate: string | Date | null;
    procedureName: string | null;
    consultantUnit: string | null;
    procedureDate: string | Date | null;
    procedureStatus: string | null;
    ambulanceFromTo: string | null;
    ambulanceDateTime: string | Date | null;
    ambulanceStatus: string | null;
    referralFacility: string | null;
    referralReason: string | null;
    referringConsultant: string | null;
    feedbackComments: string | null;
    finalStatus: string | null;
    actionTaken: string | null;
    issueEncountered: string | null;
    escalatedTo: string | null;
    verificationPending: boolean;
  };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    beneficiaryFatherHusbandGuardian: initial.beneficiaryFatherHusbandGuardian ?? "",
    department: initial.department ?? "",
    consultant: initial.consultant ?? "",
    opdMrNo: initial.opdMrNo ?? "",
    diagnosis: initial.diagnosis ?? "",
    treatmentPlan: initial.treatmentPlan ?? "",
    followUpDate: asInputDate(initial.followUpDate),
    investigationsStatus: initial.investigationsStatus ?? "",
    ward: initial.ward ?? "",
    admissionDate: asInputDate(initial.admissionDate),
    procedureName: initial.procedureName ?? "",
    consultantUnit: initial.consultantUnit ?? "",
    procedureDate: asInputDate(initial.procedureDate),
    procedureStatus: initial.procedureStatus ?? "",
    ambulanceFromTo: initial.ambulanceFromTo ?? "",
    ambulanceDateTime: initial.ambulanceDateTime ? new Date(initial.ambulanceDateTime).toISOString().slice(0, 16) : "",
    ambulanceStatus: initial.ambulanceStatus ?? "",
    referralFacility: initial.referralFacility ?? "",
    referralReason: initial.referralReason ?? "",
    referringConsultant: initial.referringConsultant ?? "",
    feedbackComments: initial.feedbackComments ?? "",
    finalStatus: initial.finalStatus ?? "",
    actionTaken: initial.actionTaken ?? "",
    issueEncountered: initial.issueEncountered ?? "",
    escalatedTo: initial.escalatedTo ?? "",
    verificationPending: initial.verificationPending,
  });

  const set = (key: keyof typeof form, value: (typeof form)[keyof typeof form]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          investigationsStatus: form.investigationsStatus || undefined,
          procedureStatus: form.procedureStatus || undefined,
          ambulanceStatus: form.ambulanceStatus || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Could not save the visit"); return; }
      toast.success("Visit updated");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-gray-800">Update Visit Record</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-gray-600">Father / Spouse / Guardian</Label>
          <Input className="mt-1" value={form.beneficiaryFatherHusbandGuardian} onChange={(e) => set("beneficiaryFatherHusbandGuardian", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Follow-up Date</Label>
          <Input className="mt-1" type="date" value={form.followUpDate} onChange={(e) => set("followUpDate", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Investigations Status</Label>
          <select className="mt-1 h-9 w-full rounded-md border px-3 text-sm" value={form.investigationsStatus} onChange={(e) => set("investigationsStatus", e.target.value)}>
            <option value="">Not recorded</option>
            {INVESTIGATION_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">OPD / MR No</Label>
          <Input className="mt-1" value={form.opdMrNo} onChange={(e) => set("opdMrNo", e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg border p-3">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">G. Admission / Procedure</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-gray-600">Ward</Label>
            <Input className="mt-1" value={form.ward} onChange={(e) => set("ward", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Admission Date</Label>
            <Input className="mt-1" type="date" value={form.admissionDate} onChange={(e) => set("admissionDate", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Procedure / Operation</Label>
            <Input className="mt-1" value={form.procedureName} onChange={(e) => set("procedureName", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Consultant Unit</Label>
            <Input className="mt-1" value={form.consultantUnit} onChange={(e) => set("consultantUnit", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Procedure Date</Label>
            <Input className="mt-1" type="date" value={form.procedureDate} onChange={(e) => set("procedureDate", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Procedure Status</Label>
            <select className="mt-1 h-9 w-full rounded-md border px-3 text-sm" value={form.procedureStatus} onChange={(e) => set("procedureStatus", e.target.value)}>
              <option value="">Not recorded</option>
              {PROCEDURE_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-3">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">J. Ambulance &amp; Referral</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-gray-600">Ambulance From / To</Label>
            <Input className="mt-1" value={form.ambulanceFromTo} onChange={(e) => set("ambulanceFromTo", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Ambulance Date &amp; Time</Label>
            <Input className="mt-1" type="datetime-local" value={form.ambulanceDateTime} onChange={(e) => set("ambulanceDateTime", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Ambulance Status</Label>
            <select className="mt-1 h-9 w-full rounded-md border px-3 text-sm" value={form.ambulanceStatus} onChange={(e) => set("ambulanceStatus", e.target.value)}>
              <option value="">Not recorded</option>
              {AMBULANCE_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs text-gray-600">Referred To (Facility)</Label>
            <Input className="mt-1" value={form.referralFacility} onChange={(e) => set("referralFacility", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Reason for Referral</Label>
            <Input className="mt-1" value={form.referralReason} onChange={(e) => set("referralReason", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Referring Consultant</Label>
            <Input className="mt-1" value={form.referringConsultant} onChange={(e) => set("referringConsultant", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-gray-600">Issue Encountered</Label>
          <Textarea className="mt-1" rows={2} value={form.issueEncountered} onChange={(e) => set("issueEncountered", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Action Taken</Label>
          <Textarea className="mt-1" rows={2} value={form.actionTaken} onChange={(e) => set("actionTaken", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Escalated To</Label>
          <Input className="mt-1" value={form.escalatedTo} onChange={(e) => set("escalatedTo", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Final Status</Label>
          <Input className="mt-1" value={form.finalStatus} onChange={(e) => set("finalStatus", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs text-gray-600">Feedback Comments</Label>
          <Textarea className="mt-1" rows={2} value={form.feedbackComments} onChange={(e) => set("feedbackComments", e.target.value)} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={form.verificationPending} onCheckedChange={(c) => set("verificationPending", c === true)} />
        Verification still pending (keeps this visit in the Verification Queue)
      </label>

      <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
        {saving ? "Saving..." : "Save Visit"}
      </Button>
    </section>
  );
}
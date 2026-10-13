"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OUTCOMES = [
  { value: "FULLY_RESOLVED", label: "Fully resolved" },
  { value: "PARTIALLY_RESOLVED", label: "Partially resolved" },
  { value: "FURTHER_ACTION_REQUIRED", label: "Further action required" },
  { value: "REFERRED_TO_COMPETENT_AUTHORITY", label: "Referred to competent authority" },
  { value: "CLOSED_AFTER_EXPLANATION_FACILITATION", label: "Closed after explanation / facilitation" },
];

const ACTION_COMPLETED = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
  { value: "IN_PROGRESS", label: "In progress" },
];

const FACILITATION = [
  { value: "YES", label: "Yes" },
  { value: "PARTIALLY", label: "Partially" },
  { value: "NO", label: "No" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-gray-600">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function GrievanceResolution({
  id,
  initial,
}: {
  id: number;
  initial: {
    immediateActionTaken: string | null;
    escalatedTo: string | null;
    escalationDesignation: string | null;
    escalationReason: string | null;
    actionTaken: string | null;
    responsibleDeptOfficer: string | null;
    outcome: string | null;
    remarks: string | null;
    issueExplainedAppropriately: boolean | null;
    facilitationProvided: string | null;
    beneficiaryComments: string | null;
    rootCause: string | null;
    correctiveAction: string | null;
    preventiveActionRequired: string | null;
    responsibleOfficerDept: string | null;
    targetCompletionDate: string | Date | null;
    actionCompleted: string | null;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    immediateActionTaken: initial.immediateActionTaken ?? "",
    escalatedTo: initial.escalatedTo ?? "",
    escalationDesignation: initial.escalationDesignation ?? "",
    escalationReason: initial.escalationReason ?? "",
    actionTaken: initial.actionTaken ?? "",
    responsibleDeptOfficer: initial.responsibleDeptOfficer ?? "",
    outcome: initial.outcome ?? "",
    remarks: initial.remarks ?? "",
    issueExplainedAppropriately: initial.issueExplainedAppropriately === true,
    facilitationProvided: initial.facilitationProvided ?? "",
    beneficiaryComments: initial.beneficiaryComments ?? "",
    rootCause: initial.rootCause ?? "",
    correctiveAction: initial.correctiveAction ?? "",
    preventiveActionRequired: initial.preventiveActionRequired ?? "",
    responsibleOfficerDept: initial.responsibleOfficerDept ?? "",
    targetCompletionDate: initial.targetCompletionDate
      ? new Date(initial.targetCompletionDate).toISOString().slice(0, 10)
      : "",
    actionCompleted: initial.actionCompleted ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        immediateActionTaken: form.immediateActionTaken || undefined,
        escalatedTo: form.escalatedTo || undefined,
        escalationDesignation: form.escalationDesignation || undefined,
        escalationReason: form.escalationReason || undefined,
        actionTaken: form.actionTaken || undefined,
        responsibleDeptOfficer: form.responsibleDeptOfficer || undefined,
        outcome: form.outcome || undefined,
        remarks: form.remarks || undefined,
        issueExplainedAppropriately: form.issueExplainedAppropriately,
        facilitationProvided: form.facilitationProvided || undefined,
        beneficiaryComments: form.beneficiaryComments || undefined,
        rootCause: form.rootCause || undefined,
        correctiveAction: form.correctiveAction || undefined,
        preventiveActionRequired: form.preventiveActionRequired || undefined,
        responsibleOfficerDept: form.responsibleOfficerDept || undefined,
        targetCompletionDate: form.targetCompletionDate || undefined,
        actionCompleted: form.actionCompleted || undefined,
      };
      const res = await fetch(`/api/grievances/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Could not save the resolution"); return; }
      toast.success("Grievance resolution saved");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-gray-800">Record Handling &amp; Resolution</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="F. Immediate Action Taken">
          <Textarea rows={2} value={form.immediateActionTaken} onChange={(e) => set("immediateActionTaken", e.target.value)} placeholder="Action taken on the spot" />
        </Field>
        <Field label="G. Escalated To">
          <Input value={form.escalatedTo} onChange={(e) => set("escalatedTo", e.target.value)} placeholder="Leave blank if not escalated" />
        </Field>
        <Field label="Escalation Designation">
          <Input value={form.escalationDesignation} onChange={(e) => set("escalationDesignation", e.target.value)} />
        </Field>
        <Field label="Escalation Reason">
          <Input value={form.escalationReason} onChange={(e) => set("escalationReason", e.target.value)} />
        </Field>
        <Field label="I. Action Taken">
          <Textarea rows={2} value={form.actionTaken} onChange={(e) => set("actionTaken", e.target.value)} />
        </Field>
        <Field label="Responsible Dept / Officer">
          <Input value={form.responsibleDeptOfficer} onChange={(e) => set("responsibleDeptOfficer", e.target.value)} />
        </Field>
        <Field label="Outcome">
          <Select value={form.outcome} onValueChange={(v) => set("outcome", v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Select outcome" /></SelectTrigger>
            <SelectContent>
              {OUTCOMES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Remarks">
          <Input value={form.remarks} onChange={(e) => set("remarks", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="J. Issue Explained Appropriately">
          <label className="flex h-9 items-center gap-2 text-sm">
            <Checkbox checked={form.issueExplainedAppropriately} onCheckedChange={(c) => set("issueExplainedAppropriately", c === true)} />
            Confirmed with the beneficiary
          </label>
        </Field>
        <Field label="Facilitation Provided">
          <Select value={form.facilitationProvided} onValueChange={(v) => set("facilitationProvided", v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {FACILITATION.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Beneficiary Comments">
          <Textarea rows={2} value={form.beneficiaryComments} onChange={(e) => set("beneficiaryComments", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="K. Root Cause">
          <Textarea rows={2} value={form.rootCause} onChange={(e) => set("rootCause", e.target.value)} />
        </Field>
        <Field label="Corrective Action">
          <Textarea rows={2} value={form.correctiveAction} onChange={(e) => set("correctiveAction", e.target.value)} />
        </Field>
        <Field label="Preventive Action Required">
          <Input value={form.preventiveActionRequired} onChange={(e) => set("preventiveActionRequired", e.target.value)} />
        </Field>
        <Field label="Responsible Officer / Dept">
          <Input value={form.responsibleOfficerDept} onChange={(e) => set("responsibleOfficerDept", e.target.value)} />
        </Field>
        <Field label="Target Completion Date">
          <Input type="date" value={form.targetCompletionDate} onChange={(e) => set("targetCompletionDate", e.target.value)} />
        </Field>
        <Field label="Action Completed">
          <Select value={form.actionCompleted} onValueChange={(v) => set("actionCompleted", v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {ACTION_COMPLETED.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
        {saving ? "Saving..." : "Save Resolution"}
      </Button>
    </section>
  );
}

export function GrievanceWorkingGroupReview({
  id,
  initial,
}: {
  id: number;
  initial: {
    requiresWorkingGroupReview: boolean | null;
    reviewedBy: string | null;
    observations: string | null;
    furtherDirections: string | null;
  };
}) {
  const router = useRouter();
  const [requiresReview, setRequiresReview] = useState(initial.requiresWorkingGroupReview === true);
  const [reviewedBy, setReviewedBy] = useState(initial.reviewedBy ?? "");
  const [observations, setObservations] = useState(initial.observations ?? "");
  const [furtherDirections, setFurtherDirections] = useState(initial.furtherDirections ?? "");
  const [reviewSignatureDate, setReviewSignatureDate] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/grievances/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requiresWorkingGroupReview: requiresReview,
          reviewedBy: reviewedBy || undefined,
          observations: observations || undefined,
          furtherDirections: furtherDirections || undefined,
          reviewSignatureDate: reviewSignatureDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Could not save the review"); return; }
      toast.success("Working group review saved");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-gray-800">L. Working Group Review</h2>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={requiresReview} onCheckedChange={(c) => setRequiresReview(c === true)} />
        Requires working group review
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-gray-600">Reviewed By</Label>
          <Input className="mt-1" value={reviewedBy} onChange={(e) => setReviewedBy(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Review Signature Date</Label>
          <Input className="mt-1" type="date" value={reviewSignatureDate} onChange={(e) => setReviewSignatureDate(e.target.value)} />
        </div>
      </div>
      <div>
        <Label className="text-xs text-gray-600">Observations</Label>
        <Textarea className="mt-1" rows={2} value={observations} onChange={(e) => setObservations(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs text-gray-600">Further Directions</Label>
        <Textarea className="mt-1" rows={2} value={furtherDirections} onChange={(e) => setFurtherDirections(e.target.value)} />
      </div>
      <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
        {saving ? "Saving..." : "Save Review"}
      </Button>
    </section>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {

  GRIEVANCE_NATURE_OPTIONS, RED_FLAG_KEYS, AMBER_FLAG_KEYS, GREEN_FLAG_KEYS, hasAnyTrue,
} from "@/lib/grievance-schemas";

const RED_LABELS: Record<string, string> = {
  emergencyTreatmentDelayed: "Emergency treatment delayed",
  patientSafetyConcern: "Patient safety concern",
  criticalMedicineIssue: "Critical medicine issue",
  urgentAdmissionProblem: "Urgent admission problem",
  ambulanceUrgentTransfer: "Ambulance required for urgent transfer",
  otherImmediateClinicalConcern: "Other immediate clinical concern",
};
const AMBER_LABELS: Record<string, string> = {
  significantAvoidableDelay: "Significant avoidable delay",
  repeatedVerification: "Repeated verification",
  sehatProcessingDifficulty: "Sehat Card Plus processing difficulty",
  diagnosticsMedicineCoordinationIssue: "Diagnostic / medicine coordination issue",
  referralIssue: "Referral issue",
  seriousBeneficiaryConcern: "Serious beneficiary concern",
};
const GREEN_LABELS: Record<string, string> = {
  generalFacilitation: "General facilitation",
  cardCorrection: "Card correction",
  informationGuidance: "Information / guidance",
  nonUrgentAdministrative: "Non-urgent administrative",
  feedback: "Feedback",
};

function Chips({ keys, labels, values, onChange, tone }: { keys: readonly string[]; labels: Record<string, string>; values: Record<string, boolean>; onChange: (v: Record<string, boolean>) => void; tone: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {keys.map((k) => (
        <label key={k} className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${values[k] ? tone : "bg-white"}`}>
          <Checkbox checked={values[k] === true} onCheckedChange={(c) => onChange({ ...values, [k]: c === true })} />
          {labels[k]}
        </label>
      ))}
    </div>
  );
}

export default function NewGrievancePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [familyRegistrationNo, setFamilyRegistrationNo] = useState("");
  const [healthCardNo, setHealthCardNo] = useState("");
  const [cnicBForm, setCnicBForm] = useState("");
  const [shaheedName, setShaheedName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [department, setDepartment] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [nature, setNature] = useState<Record<string, boolean>>({});
  const [red, setRed] = useState<Record<string, boolean>>({});
  const [amber, setAmber] = useState<Record<string, boolean>>({});
  const [green, setGreen] = useState<Record<string, boolean>>({});
  const [immediateHealthcareNeed, setImmediateHealthcareNeed] = useState(false);
  const [delayMayAffectCare, setDelayMayAffectCare] = useState(false);

  const isRed = hasAnyTrue(red);

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiaryName,
          familyRegistrationNo: familyRegistrationNo || undefined,
          healthCardNo: healthCardNo || undefined,
          cnicBForm: cnicBForm || undefined,
          shaheedName: shaheedName || undefined,
          contactNo: contactNo || undefined,
          department: department || undefined,
          issueDescription: issueDescription || undefined,
          natureFlags: nature,
          redFlags: red,
          amberFlags: amber,
          greenFlags: green,
          immediateHealthcareNeed,
          delayMayAffectCare,
          priority: isRed ? "IMMEDIATE_PATIENT_SAFETY" : hasAnyTrue(amber) ? "URGENT" : "ROUTINE",
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to lodge grievance"); return; }
      toast.success(`Grievance ${data.grievanceNo} lodged${data.isRedAlert ? " - RED ALERT" : ""}`);
      router.push(`/dashboard/grievances/${data.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Lodge Grievance (Annexure-E)</h1>

      <section className="grid gap-4 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-2">
        <div><Label>Beneficiary Name *</Label><Input value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} /></div>
        <div><Label>Family Reg No</Label><Input value={familyRegistrationNo} onChange={(e) => setFamilyRegistrationNo(e.target.value)} /></div>
        <div><Label>Health Card No</Label><Input value={healthCardNo} onChange={(e) => setHealthCardNo(e.target.value)} /></div>
        <div><Label>CNIC / B-Form</Label><Input value={cnicBForm} onChange={(e) => setCnicBForm(e.target.value)} /></div>
        <div><Label>Name of Shaheed</Label><Input value={shaheedName} onChange={(e) => setShaheedName(e.target.value)} /></div>
        <div><Label>Contact No</Label><Input value={contactNo} onChange={(e) => setContactNo(e.target.value)} /></div>
        <div><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Brief Description</Label><Textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} /></div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={immediateHealthcareNeed} onCheckedChange={(c) => setImmediateHealthcareNeed(c === true)} /> Immediate healthcare need involved</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={delayMayAffectCare} onCheckedChange={(c) => setDelayMayAffectCare(c === true)} /> Delay may adversely affect patient care</label>
      </section>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">C. Nature of Grievance</h2>
        <Chips keys={GRIEVANCE_NATURE_OPTIONS} labels={Object.fromEntries(GRIEVANCE_NATURE_OPTIONS.map((o) => [o, o]))} values={nature} onChange={setNature} tone="bg-blue-50" />
      </section>

      <section className="rounded-xl border-2 border-red-300 bg-red-50/50 p-4">
        <h2 className="mb-2 font-semibold text-red-800">E. Rapid Escalation - RED (Immediate Attention)</h2>
        <Chips keys={RED_FLAG_KEYS} labels={RED_LABELS} values={red} onChange={setRed} tone="bg-red-100" />
      </section>

      <section className="rounded-xl border-2 border-amber-300 bg-amber-50/50 p-4">
        <h2 className="mb-2 font-semibold text-amber-800">AMBER (Urgent Facilitation)</h2>
        <Chips keys={AMBER_FLAG_KEYS} labels={AMBER_LABELS} values={amber} onChange={setAmber} tone="bg-amber-100" />
      </section>

      <section className="rounded-xl border-2 border-emerald-300 bg-emerald-50/50 p-4">
        <h2 className="mb-2 font-semibold text-emerald-800">GREEN (Routine Resolution)</h2>
        <Chips keys={GREEN_FLAG_KEYS} labels={GREEN_LABELS} values={green} onChange={setGreen} tone="bg-emerald-100" />
      </section>

      <Button onClick={submit} disabled={saving} className={isRed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}>
        {saving ? "Saving..." : isRed ? "Lodge as RED ALERT" : "Lodge Grievance"}
      </Button>
    </div>
  );
}

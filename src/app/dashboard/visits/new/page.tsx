"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NATURE_OPTIONS } from "@/lib/visit-schemas";


const DIAGNOSTICS = ["CBC", "Chemistry", "Urine", "Microbiology", "Histopathology", "X-Ray", "USG", "CT", "MRI", "Echo", "Other"];
const MEDICINES = ["Prescribed", "Institutional Facilitated", "Fully Available", "Partially Available", "Not Available"];
const SEHAT = ["Eligibility Checked", "Service Covered", "Not Covered", "Not Applicable", "Case Approved", "Under Process"];
const FEEDBACK = ["Satisfied with facilitation", "Felt respected / dignified", "Timely service", "Would recommend desk"];
const HEALTH_DESK = ["Registered", "Guided", "Facilitated", "Escalated", "Referred", "Follow-up Scheduled"];
const AMBULANCE = ["Ambulance Requested", "Ambulance Arrived", "Patient Transported", "Transfer Completed"];
const AMBULANCE_STATUS = ["REQUESTED", "COORDINATING", "FACILITATED", "REFERRED", "CLOSED"];

function CheckGroup({ options, values, onChange }: { options: readonly string[]; values: Record<string, boolean>; onChange: (v: Record<string, boolean>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-sm">
          <Checkbox checked={values[o] === true} onCheckedChange={(c) => onChange({ ...values, [o]: c === true })} />
          {o}
        </label>
      ))}
    </div>
  );
}

export default function NewVisitPage() {
  const router = useRouter();
  const [emergency, setEmergency] = useState(false);
  const [lookupQ, setLookupQ] = useState("");
  const [lookupMsg, setLookupMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [familyRegistrationNo, setFamilyRegistrationNo] = useState("");
  const [healthCardNo, setHealthCardNo] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryCnicBForm, setBeneficiaryCnicBForm] = useState("");
  const [beneficiaryRelationship, setBeneficiaryRelationship] = useState("");
  const [beneficiaryMobile, setBeneficiaryMobile] = useState("");
  const [shaheedName, setShaheedName] = useState("");
  const [verification, setVerification] = useState<string>("VERIFIED");
  const [facilitationOfficer, setFacilitationOfficer] = useState("");
  const [nature, setNature] = useState<Record<string, boolean>>({});
  const [diagnostics, setDiagnostics] = useState<Record<string, boolean>>({});
  const [medicines, setMedicines] = useState<Record<string, boolean>>({});
  const [sehat, setSehat] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [healthDesk, setHealthDesk] = useState<Record<string, boolean>>({});
  const [emergencyFlags, setEmergencyFlags] = useState({
    emergencyCase: false, triageCompleted: false, immediateTreatmentInitiated: false,
    adminVerificationCompleted: false, verificationConcurrent: false, verificationSubsequent: false,
  });
  const [department, setDepartment] = useState("");
  const [consultant, setConsultant] = useState("");
  const [opdMrNo, setOpdMrNo] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [finalStatus, setFinalStatus] = useState("");
  const [issueEncountered, setIssueEncountered] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [sehatCaseRef, setSehatCaseRef] = useState("");
  const [ambulanceFlags, setAmbulanceFlags] = useState<Record<string, boolean>>({});
  const [ambulanceFromTo, setAmbulanceFromTo] = useState("");
  const [ambulanceDateTime, setAmbulanceDateTime] = useState("");
  const [ambulanceStatus, setAmbulanceStatus] = useState("");
  const [referralFacility, setReferralFacility] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [referringConsultant, setReferringConsultant] = useState("");

  const hasReferral = referralFacility.trim().length > 0;

  const toggleEmergency = () => {
    const next = !emergency;
    setEmergency(next);
    if (next) {
      setVerification("EMERGENCY_VERIFICATION_IN_PROCESS");
      setEmergencyFlags({ ...emergencyFlags, emergencyCase: true });
      setNature({ ...nature, "Emergency / Trauma": true });
    }
  };

  const lookup = async () => {
    setLookupMsg("");
    const res = await fetch(`/api/visits/lookup?q=${encodeURIComponent(lookupQ)}`);
    if (!res.ok) { setLookupMsg("No matching family/card found."); return; }
    const data = await res.json();
    setFamilyRegistrationNo(data.family.registrationNo);
    setHealthCardNo(data.family.healthCardNo ?? "");
    setShaheedName(data.family.shaheedName);
    if (data.beneficiary) {
      setBeneficiaryName(data.beneficiary.name);
      setBeneficiaryCnicBForm(data.beneficiary.cnicBForm ?? "");
      setBeneficiaryRelationship(data.beneficiary.relationship ?? "");
      setBeneficiaryMobile(data.beneficiary.mobile ?? "");
    }
    setLookupMsg("Beneficiary details loaded.");
  };

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyRegistrationNo,
          healthCardNo: healthCardNo || undefined,
          beneficiaryName,
          beneficiaryCnicBForm: beneficiaryCnicBForm || undefined,
          beneficiaryRelationship: beneficiaryRelationship || undefined,
          beneficiaryMobile: beneficiaryMobile || undefined,
          shaheedName: shaheedName || undefined,
          verification,
          verificationPending: emergency,
          facilitationOfficer: facilitationOfficer || undefined,
          natureOfHealthcare: Object.keys(nature).filter((k) => nature[k]),
          diagnostics,
          medicinesFlags: medicines,
          sehatFlags: sehat,
emergencyFlags,
          ambulanceFlags,
          ambulanceFromTo: ambulanceFromTo || undefined,
          ambulanceDateTime: ambulanceDateTime || undefined,
          ambulanceStatus: (ambulanceStatus || undefined) as never,
          referralFacility: referralFacility || undefined,
          referralReason: referralReason || undefined,
          referringConsultant: referringConsultant || undefined,
          healthDeskActions: healthDesk,
          feedbackFlags: feedback,
          department: department || undefined,
          consultant: consultant || undefined,
          opdMrNo: opdMrNo || undefined,
          diagnosis: diagnosis || undefined,
          treatmentPlan: treatmentPlan || undefined,
          finalStatus: finalStatus || undefined,
          issueEncountered: issueEncountered || undefined,
          actionTaken: actionTaken || undefined,
          feedbackComments: feedbackComments || undefined,
          sehatCaseRef: sehatCaseRef || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to save visit"); return; }
      toast.success(`Visit ${data.visitNo} recorded`);
      router.push(`/dashboard/visits/${data.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">Record Visit (Annexure-B)</h1>
        <button type="button" onClick={toggleEmergency} className={`rounded-lg px-4 py-2 text-sm font-bold text-white ${emergency ? "bg-red-700" : "bg-red-600 hover:bg-red-700"}`}>
          {emergency ? "EMERGENCY VISIT: ON" : "EMERGENCY VISIT"}
        </button>
      </div>
      {emergency && <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">Emergency mode: fast-track recording. Care is never blocked by verification status.</p>}

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-gray-800">Quick Lookup (Card No / Family Reg No / CNIC)</h2>
        <div className="flex gap-2">
          <Input value={lookupQ} onChange={(e) => setLookupQ(e.target.value)} placeholder="Enter card no, reg no or CNIC" />
          <Button type="button" variant="outline" onClick={lookup}>Lookup</Button>
        </div>
        {lookupMsg && <p className="mt-2 text-sm text-gray-600">{lookupMsg}</p>}
      </section>

      <section className="grid gap-4 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-2">
        <div><Label>Family Registration No *</Label><Input value={familyRegistrationNo} onChange={(e) => setFamilyRegistrationNo(e.target.value)} /></div>
        <div><Label>Health Card No</Label><Input value={healthCardNo} onChange={(e) => setHealthCardNo(e.target.value)} /></div>
        <div><Label>Beneficiary Name *</Label><Input value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} /></div>
        <div><Label>CNIC / B-Form</Label><Input value={beneficiaryCnicBForm} onChange={(e) => setBeneficiaryCnicBForm(e.target.value)} /></div>
        <div><Label>Relationship</Label><Input value={beneficiaryRelationship} onChange={(e) => setBeneficiaryRelationship(e.target.value)} /></div>
        <div><Label>Mobile</Label><Input value={beneficiaryMobile} onChange={(e) => setBeneficiaryMobile(e.target.value)} /></div>
        <div><Label>Name of Shaheed</Label><Input value={shaheedName} onChange={(e) => setShaheedName(e.target.value)} /></div>
        <div><Label>Facilitation Officer</Label><Input value={facilitationOfficer} onChange={(e) => setFacilitationOfficer(e.target.value)} /></div>
        <div className="sm:col-span-2">
          <Label>Verification</Label>
          <RadioGroup value={verification} onValueChange={setVerification} className="mt-1 flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="VERIFIED" /> Verified</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="VERIFICATION_CONFIRMED_DIGITALLY" /> Verification Confirmed Digitally</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="EMERGENCY_VERIFICATION_IN_PROCESS" /> Emergency - Verification in Process</label>
          </RadioGroup>
        </div>
      </section>

      <details className="rounded-xl border bg-white p-4 shadow-sm" open>
        <summary className="cursor-pointer font-semibold text-gray-800">C. Nature of Healthcare Required</summary>
        <div className="mt-3"><CheckGroup options={NATURE_OPTIONS} values={nature} onChange={setNature} /></div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">D. Clinical Facilitation</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
          <div><Label>Consultant</Label><Input value={consultant} onChange={(e) => setConsultant(e.target.value)} /></div>
          <div><Label>OPD / MR No</Label><Input value={opdMrNo} onChange={(e) => setOpdMrNo(e.target.value)} /></div>
          <div><Label>Diagnosis</Label><Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Advice / Plan</Label><Textarea value={treatmentPlan} onChange={(e) => setTreatmentPlan(e.target.value)} /></div>
        </div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">E. Diagnostic Facilitation</summary>
        <div className="mt-3"><CheckGroup options={DIAGNOSTICS} values={diagnostics} onChange={setDiagnostics} /></div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">F. Medicines / Pharmacy</summary>
        <div className="mt-3"><CheckGroup options={MEDICINES} values={medicines} onChange={setMedicines} /></div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">H. Sehat Card Plus Facilitation</summary>
        <div className="mt-3"><CheckGroup options={SEHAT} values={sehat} onChange={setSehat} /></div>
        <div className="mt-2"><Label>Case Reference</Label><Input value={sehatCaseRef} onChange={(e) => setSehatCaseRef(e.target.value)} /></div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm" open={emergency}>
        <summary className="cursor-pointer font-semibold text-gray-800">I. Emergency Facilitation</summary>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {([["emergencyCase", "Emergency Case"], ["triageCompleted", "Triage Completed"], ["immediateTreatmentInitiated", "Immediate Treatment Initiated"], ["adminVerificationCompleted", "Admin Verification Completed"], ["verificationConcurrent", "Verification Concurrent"], ["verificationSubsequent", "Verification Subsequent"]] as const).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <Checkbox checked={emergencyFlags[k]} onCheckedChange={(c) => setEmergencyFlags({ ...emergencyFlags, [k]: c === true })} />
              {label}
            </label>
          ))}
        </div>
      </details>

<details className="rounded-xl border bg-white p-4 shadow-sm" open={Object.keys(ambulanceFlags).some((k) => ambulanceFlags[k]) || hasReferral}>
        <summary className="cursor-pointer font-semibold text-gray-800">J. Ambulance & Referral</summary>
        <div className="mt-3 space-y-3">
          <CheckGroup options={AMBULANCE} values={ambulanceFlags} onChange={setAmbulanceFlags} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Ambulance From / To</Label><Input value={ambulanceFromTo} onChange={(e) => setAmbulanceFromTo(e.target.value)} placeholder="e.g. DHQ to MMMTH" /></div>
            <div><Label>Ambulance Date &amp; Time</Label><Input type="datetime-local" value={ambulanceDateTime} onChange={(e) => setAmbulanceDateTime(e.target.value)} /></div>
            <div>
              <Label>Ambulance Status</Label>
              <select value={ambulanceStatus} onChange={(e) => setAmbulanceStatus(e.target.value)} className="mt-1 h-9 w-full rounded-md border px-3 text-sm">
                <option value="">Not recorded</option>
                {AMBULANCE_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><Label>Referred To (Facility)</Label><Input value={referralFacility} onChange={(e) => setReferralFacility(e.target.value)} placeholder="e.g. Mufti Mehmood Memorial Teaching Hospital" /></div>
            <div><Label>Reason for Referral</Label><Input value={referralReason} onChange={(e) => setReferralReason(e.target.value)} /></div>
            <div><Label>Referring Consultant</Label><Input value={referringConsultant} onChange={(e) => setReferringConsultant(e.target.value)} /></div>
          </div>
          <p className="text-xs text-gray-500">Recording a referral facility adds this visit to the Ambulance &amp; Referrals register.</p>
        </div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">K. Health Desk Action &amp; Outcome</summary>
        <div className="mt-3 grid gap-3">
          <CheckGroup options={HEALTH_DESK} values={healthDesk} onChange={setHealthDesk} />
          <div><Label>Issue Encountered</Label><Textarea value={issueEncountered} onChange={(e) => setIssueEncountered(e.target.value)} /></div>
          <div><Label>Action Taken</Label><Textarea value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} /></div>
          <div><Label>Final Status</Label><Input value={finalStatus} onChange={(e) => setFinalStatus(e.target.value)} placeholder="Resolved / Escalated / Pending" /></div>
        </div>
      </details>

      <details className="rounded-xl border bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">L. Beneficiary / Family Feedback</summary>
        <div className="mt-3"><CheckGroup options={FEEDBACK} values={feedback} onChange={setFeedback} /></div>
        <div className="mt-2"><Label>Comments</Label><Textarea value={feedbackComments} onChange={(e) => setFeedbackComments(e.target.value)} /></div>
      </details>

      <Button onClick={submit} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
        {saving ? "Saving..." : "Save Visit"}
      </Button>
    </div>
  );
}

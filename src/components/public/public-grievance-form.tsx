"use client";

import { useState } from "react";

const hospitals = [
  ["DHQ", "District Headquarters Teaching Hospital"],
  ["MMMTH", "Mufti Mehmood Memorial Teaching Hospital"],
  ["WC", "Derajat Women & Children Hospital"],
];
const natures = ["Registration or verification delay", "Emergency facilitation", "OPD or specialist access", "Laboratory or radiology delay", "Medicine or pharmacy issue", "Admission or procedure", "Sehat Card Plus processing", "Ambulance or referral", "Staff behaviour or dignity", "Card or digital record", "Other"];

export function PublicGrievanceForm() {
  const [error, setError] = useState("");
  const [grievanceNo, setGrievanceNo] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true); setError(""); setGrievanceNo("");
    const form = new FormData(event.currentTarget);
    const data = {
      hospitalCode: String(form.get("hospitalCode")),
      beneficiaryName: String(form.get("beneficiaryName")),
      contactNo: String(form.get("contactNo") ?? ""),
      nature: String(form.get("nature")),
      issueDescription: String(form.get("issueDescription")),
      priority: String(form.get("priority")),
      immediateHealthcareNeed: form.get("immediateHealthcareNeed") === "on",
      delayMayAffectCare: form.get("delayMayAffectCare") === "on",
      website: String(form.get("website") ?? ""),
    };
    try {
      const response = await fetch("/api/public/grievances", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await response.json();
      if (!response.ok) { setError(body.error ?? "Could not submit the grievance"); return; }
      setGrievanceNo(body.grievanceNo);
      formElement.reset();
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setSaving(false); }
  }
  return <form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-5 shadow-sm">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">Hospital<select name="hospitalCode" required defaultValue="" className="mt-1 block w-full rounded-md border px-3 py-2"><option value="" disabled>Select a hospital</option>{hospitals.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
      <label className="block text-sm font-medium">Beneficiary name<input name="beneficiaryName" required maxLength={120} autoComplete="name" className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Contact number (optional)<input name="contactNo" maxLength={40} autoComplete="tel" className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Concern type<select name="nature" required defaultValue="" className="mt-1 block w-full rounded-md border px-3 py-2"><option value="" disabled>Select a concern</option>{natures.map((nature) => <option key={nature}>{nature}</option>)}</select></label>
      <label className="block text-sm font-medium sm:col-span-2">Describe the concern<textarea name="issueDescription" required minLength={10} maxLength={3000} rows={5} className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Priority<select name="priority" className="mt-1 block w-full rounded-md border px-3 py-2"><option value="ROUTINE">Routine</option><option value="URGENT">Urgent</option><option value="IMMEDIATE_PATIENT_SAFETY">Immediate patient-safety concern</option></select></label>
    </div>
    <div className="space-y-2"><label className="flex items-start gap-2 text-sm"><input type="checkbox" name="immediateHealthcareNeed" className="mt-1" />Immediate healthcare is needed now</label><label className="flex items-start gap-2 text-sm"><input type="checkbox" name="delayMayAffectCare" className="mt-1" />A delay may affect care or patient safety</label></div>
    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-950">For a medical emergency, go to the nearest Emergency Department immediately. Submitting a grievance does not replace emergency care.</p>
    {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {grievanceNo && <p role="status" className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">Your grievance was recorded. Reference: {grievanceNo}</p>}
    <button disabled={saving} className="rounded-md bg-blue-800 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Submitting…" : "Submit grievance"}</button>
  </form>;
}

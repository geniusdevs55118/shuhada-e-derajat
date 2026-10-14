"use client";

import { useState } from "react";
import {
  MessageSquareWarning,
  AlertCircle,
  CheckCircle2,
  HeartPulse,
  Send,
  ShieldCheck,
  Building2,
  User,
  Phone,
  FileText,
} from "lucide-react";

const HOSPITALS = [
  ["DHQ", "District Headquarters Teaching Hospital (DHQ)"],
  ["MMMTH", "Mufti Mehmood Memorial Teaching Hospital (MMMTH)"],
  ["WC", "Derajat Women & Children Hospital (DWCH)"],
];

const NATURES = [
  "Registration or verification delay",
  "Emergency facilitation concern",
  "OPD or specialist clinic access",
  "Laboratory or radiology delay",
  "Medicine or pharmacy formulary issue",
  "Inpatient admission or surgical procedure",
  "Sehat Card Plus processing difficulty",
  "Ambulance or inter-hospital referral",
  "Staff behaviour, respect or dignity concern",
  "Health card or digital record error",
  "Other administrative difficulty",
];

export function PublicGrievanceForm() {
  const [error, setError] = useState("");
  const [grievanceNo, setGrievanceNo] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setError("");
    setGrievanceNo("");

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
      const response = await fetch("/api/public/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Could not submit the grievance. Please check your entries.");
        return;
      }
      setGrievanceNo(body.grievanceNo);
      formElement.reset();
    } catch {
      setError("Could not reach the server. Please check your internet connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <MessageSquareWarning className="size-4 text-emerald-700" />
          <span>Confidential Grievance Portal</span>
        </div>
        <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900">
          Lodge a Healthcare Concern
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Please describe the difficulty you encountered. Routine administrative concerns are reviewed by
          the Working Group. Immediate patient-safety matters are flagged immediately.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Hospital Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Hospital Campus <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              name="hospitalCode"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
            >
              <option value="" disabled>
                Select hospital campus
              </option>
              {HOSPITALS.map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Beneficiary Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Beneficiary Name <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              name="beneficiaryName"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Full name of beneficiary"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Contact Telephone (Optional)
          </label>
          <div className="relative mt-1.5">
            <input
              name="contactNo"
              maxLength={40}
              autoComplete="tel"
              placeholder="e.g. 0300-1234567"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Nature of Concern */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Nature of Concern <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              name="nature"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
            >
              <option value="" disabled>
                Select type of issue
              </option>
              {NATURES.map((nature) => (
                <option key={nature} value={nature}>
                  {nature}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Selector */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Urgency / Priority Level <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              name="priority"
              defaultValue="ROUTINE"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
            >
              <option value="ROUTINE">Routine Administrative Review</option>
              <option value="URGENT">Urgent Concern (Follow-up within 24h)</option>
              <option value="IMMEDIATE_PATIENT_SAFETY">
                Immediate Patient-Safety Concern (Priority Red Flag)
              </option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Detailed Description of Issue <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-1.5">
            <textarea
              name="issueDescription"
              required
              minLength={10}
              maxLength={3000}
              rows={4}
              placeholder="Explain what occurred, which department or counter was involved, and what assistance is required..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
            />
          </div>
          <p className="mt-1 text-[0.68rem] text-slate-500">
            Please do not enter confidential CNIC numbers or private medical diagnoses in this public form.
          </p>
        </div>
      </div>

      {/* Safety checkboxes */}
      <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-200">
        <label className="flex items-start gap-2.5 text-xs text-slate-800 font-medium cursor-pointer">
          <input
            type="checkbox"
            name="immediateHealthcareNeed"
            className="mt-0.5 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600"
          />
          <span>Patient currently requires active healthcare attention</span>
        </label>
        <label className="flex items-start gap-2.5 text-xs text-slate-800 font-medium cursor-pointer">
          <input
            type="checkbox"
            name="delayMayAffectCare"
            className="mt-0.5 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600"
          />
          <span>A delay may potentially affect patient health or clinical safety</span>
        </label>
      </div>

      {/* Honeypot field for bot protection */}
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Emergency reminder */}
      <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
        <HeartPulse className="size-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Medical Emergency Notice:</strong> For urgent medical needs, proceed to the nearest
          Emergency Department immediately. Submitting an online grievance does not replace clinical
          emergency care.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800" role="alert">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success notification */}
      {grievanceNo && (
        <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-300 text-xs text-emerald-950 space-y-1" role="status">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
            <CheckCircle2 className="size-5 text-emerald-600" />
            <span>Grievance Recorded Successfully</span>
          </div>
          <p className="pl-7">
            Your tracking reference number is:{" "}
            <span className="font-mono font-bold text-emerald-900 text-sm bg-emerald-100 px-2 py-0.5 rounded">
              {grievanceNo}
            </span>
          </p>
          <p className="pl-7 text-emerald-800 text-[0.7rem]">
            The designated hospital coordinator and Working Group have received this concern for review.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
      >
        <Send className="size-3.5" />
        <span>{saving ? "Submitting Concern..." : "Submit Grievance to Health Desk"}</span>
      </button>
    </form>
  );
}

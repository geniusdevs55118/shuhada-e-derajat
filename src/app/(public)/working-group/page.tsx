import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  Users2,
  Award,
  CheckCircle2,
  FileCheck2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

const MEMBERS = [
  { role: "Convener", title: "Additional Hospital Director", dept: "Executive Administration" },
  { role: "Member", title: "Medical Superintendent (DHQ)", dept: "Clinical Hospital Leadership" },
  { role: "Member", title: "Medical Superintendent (MMMTH)", dept: "Clinical Hospital Leadership" },
  { role: "Member", title: "Medical Superintendent (DWCH)", dept: "Maternal & Child Hospital Leadership" },
  { role: "Focal Person", title: "Family Health Desk Incharge", dept: "Beneficiary Care Coordination" },
  { role: "Member", title: "Administration & Finance Representative", dept: "Institutional Accounts" },
  { role: "Member", title: "Sehat Card Plus Institutional Officer", dept: "Government Financing Desk" },
  { role: "Member", title: "Director / Incharge Pharmacy", dept: "Medicines & Formulary" },
  { role: "Member", title: "Diagnostics & Radiology Representative", dept: "Laboratory & Imaging" },
  { role: "Member", title: "Nursing Superintendent / Representative", dept: "Inpatient Patient Care" },
  { role: "Member", title: "MIS & Information Technology Lead", dept: "Digital Records & Portal Security" },
  { role: "Ex-Officio", title: "Other Co-opted Clinical Specialists", dept: "As Required by Case Review" },
];

const TERMS_OF_REFERENCE = [
  "Conduct structured monthly reviews of hospital facilitation performance and beneficiary visits",
  "Monitor verification integrity, card issuance timelines, and dependant entitlement reviews",
  "Review emergency facilitation safeguards to ensure zero delays in urgent clinical triage",
  "Track equitable access to outpatient specialist clinics and senior consultant appointments",
  "Examine diagnostic laboratory and radiological imaging turnaround times and availability",
  "Monitor institutional pharmacy supplies and address formulary medicine availability issues",
  "Review inpatient admission coordination, surgical scheduling, and ICU resource distribution",
  "Monitor Sehat Card Plus claim submissions and enforce controls against duplicate claims",
  "Oversee ambulance transport availability and inter-facility critical transfers",
  "Examine all lodged public grievances and RED alerts with designated ownership and deadlines",
  "Assign corrective operational actions to departmental heads with measurable follow-up",
  "Maintain audited meeting minutes, statistical dashboards, and reports for the Board of Governors",
];

export const metadata = {
  title: "Working Group Governance | Shuhada-e-Derajat Healthcare",
  description:
    "Review the mandate, membership, and terms of reference of the institutional Working Group overseeing the Shuhada-e-Derajat Healthcare Initiative.",
};

export default function WorkingGroupPage() {
  return (
    <main>
      <PublicPageIntro
        section="Institutional Governance"
        title="Institutional Working Group"
        description="A high-level cross-functional oversight committee monitoring healthcare delivery, continuous quality, and grievance redressal."
        breadcrumbs={[{ label: "Working Group" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Membership Roster */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Users2 className="size-4 text-emerald-700" />
              <span>Committee Roster</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              Cross-Functional Institutional Representation
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Working Group convenes monthly to review performance metrics across all three hospitals,
              ensuring clinical standards are maintained and feedback from Shuhada families is promptly
              actioned.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm divide-y divide-slate-100">
              {MEMBERS.map((m) => (
                <div key={m.title} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{m.title}</p>
                    <p className="text-slate-500 mt-0.5">{m.dept}</p>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold uppercase tracking-wider text-[0.68rem] text-emerald-800 shrink-0 border border-emerald-200">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Terms of Reference */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <FileCheck2 className="size-4 text-emerald-700" />
              <span>Mandate & Authority</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              12 Core Terms of Reference (TORs)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The committee exercises institutional governance across 12 vital areas of hospital operations,
              welfare integration, and patient dignity.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {TERMS_OF_REFERENCE.map((tor, idx) => (
                <div
                  key={tor}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-500 transition flex items-start gap-3 text-xs"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[0.68rem] font-bold text-emerald-800">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed text-slate-700">{tor}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="size-4 text-emerald-700" />
                <span>Transparent Staff Reporting</span>
              </div>
              <p className="mt-1 leading-relaxed">
                Working Group members record meeting decisions, action owners, and completion dates directly
                into the Staff Portal to ensure continuous institutional accountability.
              </p>
              <div className="mt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-600"
                >
                  <span>Authorized Staff Portal Access</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

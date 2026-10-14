import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Building2,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  Clock,
  HelpCircle,
  PhoneCall,
  QrCode,
  MapPin,
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Submission of Family Record",
    urdu: "خاندانی دستاویزات کا اندراج",
    desc: "The designated hospital focal desk or authorized committee receives official documentation including service Shahadat record, CNICs, and NADRA Family Registration Certificate (FRC).",
    icon: FileText,
    action: "Family submits documents to Health Desk",
  },
  {
    num: "02",
    title: "Official Verification by Competent Authority",
    urdu: "مجاز اتھارٹی کی جانب سے تصدیق",
    desc: "The competent institutional authority scrutinizes and verifies dependant entitlements strictly in line with institutional criteria. The outcome is recorded digitally.",
    icon: ShieldCheck,
    action: "Eligibility confirmed and recorded in secure database",
  },
  {
    num: "03",
    title: "Issuance of Shuhada Family Health Card",
    urdu: "فیملی ہیلتھ کارڈ کا باوقار اجراء",
    desc: "A personalized, encrypted card with a unique QR code token is provided to the family. The QR code contains an encrypted token only; personal CNICs and details are kept private.",
    icon: CreditCard,
    action: "Physical health card linked to the family record",
  },
  {
    num: "04",
    title: "Hospital Visit & Health Desk Accompaniment",
    urdu: "ہسپتال آمد اور ہیلتھ ڈیسک کی معاونت",
    desc: "Upon arrival at DHQ, MMMTH, or DWCH, staff at the Family Health Desk scan the QR token, generate token slips, and guide the patient directly to the OPD clinic, lab, or admission ward.",
    icon: Building2,
    action: "Single verification across all 3 network hospitals",
  },
  {
    num: "05",
    title: "Continuity of Care & Grievance Resolution",
    urdu: "مستقل طبی نگہداشت اور مسائل کا ازالہ",
    desc: "All visits, prescriptions, investigations, and procedures are linked to the unified record. If any administrative obstacle arises, immediate grievance redressal is initiated.",
    icon: HeartPulse,
    action: "Active monitoring by the institutional Working Group",
  },
];

const WHAT_TO_BRING = [
  {
    title: "For Routine OPD Visits",
    items: [
      "Original Derajat Shuhada Family Health Card",
      "CNIC of the visiting adult family member (or B-Form for child)",
      "Previous hospital discharge summaries or prescription slips",
    ],
  },
  {
    title: "For Inpatient Admissions & Surgery",
    items: [
      "Derajat Shuhada Family Health Card",
      "Valid CNIC for Sehat Card Plus biometric counter registration",
      "Doctor's admission advice slip issued by treating consultant",
    ],
  },
  {
    title: "For Emergencies",
    items: [
      "Go straight to the Emergency Department immediately!",
      "Health card or CNIC can be presented afterwards by an attendant",
      "Immediate clinical care is NEVER delayed for documentation",
    ],
  },
];

export const metadata = {
  title: "How It Works | Derajat Shuhada Healthcare Initiative",
  description:
    "Learn how verified families of Shuhada receive coordinated healthcare facilitation from verification to hospital health desk support.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <PublicPageIntro
        section="A Clear Pathway"
        title="How the Healthcare Pathway Works"
        description="Verify once, record securely, and receive seamless guided healthcare facilitation across all three network hospitals."
        breadcrumbs={[{ label: "How It Works" }]}
      />

      {/* 5-Step Visual Process Timeline */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col md:flex-row gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
              >
                {/* Number & Icon */}
                <div className="flex md:flex-col items-center justify-between md:justify-start gap-4 shrink-0 md:w-36">
                  <span className="font-heading text-4xl font-extrabold text-emerald-800">
                    {step.num}
                  </span>
                  <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                    <Icon className="size-8" />
                  </div>
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 hidden md:block">
                    Stage {idx + 1} of 5
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p dir="rtl" className="mt-1 font-serif text-sm font-semibold text-emerald-800">
                      {step.urdu}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-emerald-900 border border-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{step.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Notice */}
        <div className="mt-12 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4">
          <Clock className="size-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950 text-sm">Emergency Protocol Takes Precedence</h4>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
              If an eligible patient requires urgent or life-saving clinical care, proceed straight to the
              hospital emergency room. Clinical triage and trauma resuscitation will occur immediately, and
              administrative verification will be handled subsequently.
            </p>
          </div>
        </div>

        {/* What to Bring Guide */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Checklist for Beneficiaries
            </span>
            <h3 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              What to Bring When Visiting the Hospital
            </h3>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {WHAT_TO_BRING.map((guide) => (
              <div
                key={guide.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-heading text-lg font-bold text-slate-900">{guide.title}</h4>
                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    {guide.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
          >
            <QrCode className="size-4" />
            <span>Verify a Health Card</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/hospitals"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition"
          >
            <Building2 className="size-4 text-emerald-700" />
            <span>Find a Hospital</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

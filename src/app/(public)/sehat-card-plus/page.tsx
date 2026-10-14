import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  ArrowRight,
  HeartPulse,
  Lock,
} from "lucide-react";

const BENEFIT_PILLARS = [
  {
    title: "Support Under Existing Government Scheme",
    desc: "Where treatments, admissions, or surgical procedures are covered under the Sehat Card Plus program, the hospital Family Health Desk facilitates rapid processing under prevailing rules.",
    icon: CreditCard,
  },
  {
    title: "Zero Duplicate Billing or Overlapping Claims",
    desc: "Strict administrative controls ensure no dual claims or duplicate invoicing occurs. Procedures financed via Sehat Card Plus are reconciled transparently without out-of-pocket costs.",
    icon: Lock,
  },
  {
    title: "Assisted Counter & Biometric Clearance",
    desc: "Health Desk staff accompany families to the hospital Sehat Card Plus counter to resolve biometric hurdles, system verification, and documentation smoothly.",
    icon: ShieldCheck,
  },
  {
    title: "Medical Decisions Guided Solely by Need",
    desc: "Whether a procedure is covered under Sehat Card Plus or institutional support, clinical care, ICU allocation, and surgical triage follow medical urgency without financial discrimination.",
    icon: HeartPulse,
  },
];

const STEPS = [
  {
    num: "01",
    title: "Consultant Admission Advice",
    desc: "The treating consultant at DHQ, MMMTH, or DWCH assesses the patient and prescribes hospital admission or procedure.",
  },
  {
    num: "02",
    title: "Health Desk Assistance",
    desc: "The beneficiary approaches the dedicated hospital Family Health Desk with their admission slip and CNIC.",
  },
  {
    num: "03",
    title: "Sehat Card Counter Verification",
    desc: "The Health Desk coordinator assists in checking package availability, obtaining biometric clearance, and generating the claim token.",
  },
  {
    num: "04",
    title: "Cashless Inpatient Care",
    desc: "The patient receives surgical care, diagnostics, and formulary medications during admission with continuous oversight.",
  },
];

export const metadata = {
  title: "Sehat Card Plus Facilitation | Shuhada-e-Derajat Healthcare",
  description:
    "Comprehensive guidance on accessing Sehat Card Plus hospital coverage, cashless admission facilitation, and zero duplicate claim safeguards.",
};

export default function SehatCardPlusPage() {
  return (
    <main>
      <PublicPageIntro
        section="Coordinated Financing"
        title="Sehat Card Plus Facilitation"
        description="Assisted processing under the provincial Sehat Card Plus healthcare financing program with strict safeguards against duplicate billing."
        breadcrumbs={[{ label: "Sehat Card Plus" }]}
      />

      {/* Main Feature Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CreditCard className="size-4 text-emerald-700" />
              <span>Integrated Healthcare Financing</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Facilitated Coverage Through Authorized Government Systems
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              The Shuhada-e-Derajat Family Healthcare Initiative integrates seamlessly with the existing Sehat
              Card Plus framework. When a verified beneficiary requires inpatient admission, specialized
              surgery, or covered medical management, the Family Health Desk expedites counter processing.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              This single-window approach eliminates administrative confusion and ensures families never have
              to navigate complex hospital financing paperwork alone.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[4/3] lg:col-span-5 overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-950">
            <Image
              src="/images/health-card.jpg"
              alt="Health card financing facilitation"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                Cashless Treatment
              </span>
              <p className="mt-1 font-heading text-lg font-bold">Seamless Welfare Integration</p>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Facilitation */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {BENEFIT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 shrink-0">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">{pillar.title}</h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 4-Step Journey */}
        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Admission Facilitation
            </span>
            <h3 className="mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              How Admission Processing Works
            </h3>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="font-heading text-2xl font-bold text-emerald-800">{s.num}</span>
                <h4 className="mt-2 text-sm font-bold text-slate-900">{s.title}</h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-12 rounded-2xl bg-emerald-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-heading text-xl font-bold text-white">
              Questions Regarding Sehat Card Plus Facilitation?
            </h4>
            <p className="mt-1 text-xs text-emerald-300 max-w-xl">
              Family Health Desk coordinators are available on-site at each hospital admission counter to
              assist you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shrink-0"
          >
            <Building2 className="size-4" />
            <span>Contact Health Desk</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

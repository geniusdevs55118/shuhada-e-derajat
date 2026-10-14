"use client";

import Link from "next/link";
import {
  FileCheck2,
  CreditCard,
  Building2,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Official Verification",
    urdu: "تصدیق و اندراج",
    desc: "Eligibility is confirmed through the competent institutional authority using verified civil and service records.",
    icon: FileCheck2,
  },
  {
    step: "02",
    title: "Family Card Issued",
    urdu: "فیملی ہیلتھ کارڈ کا اجراء",
    desc: "A secure Shuhada-e-Derajat Family Health Card is provided with an encrypted QR token for seamless identification.",
    icon: CreditCard,
  },
  {
    step: "03",
    title: "Dedicated Health Desk",
    urdu: "ہیلتھ ڈیسک معاونت",
    desc: "Staff at any of the 3 hospitals scan the card, generate token slips, and accompany the family to relevant departments.",
    icon: Building2,
  },
  {
    step: "04",
    title: "Care & Follow-through",
    urdu: "مکمل علاج اور نگہداشت",
    desc: "Visits, prescriptions, inpatient care, and referrals are coordinated without repeating administrative checks.",
    icon: HeartPulse,
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-slate-50/50 py-16 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-700" />
              <span>Step-by-Step Healthcare Pathway</span>
            </div>
            <h3 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A Clear, Guided Route Through the Healthcare System
            </h3>
            <p className="mt-3 text-base text-slate-600">
              No family navigates the hospital alone. Every step is structured for prompt assistance,
              dignity, and continuous follow-up.
            </p>
          </div>

          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <span>Read Complete Workflow</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-2xl font-bold text-emerald-800">
                      {step.step}
                    </span>
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
                      <Icon className="size-6" />
                    </div>
                  </div>

                  <h3 className="mt-5 font-heading text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p
                    dir="rtl"
                    className="mt-1 font-serif text-xs font-semibold text-emerald-800"
                  >
                    {step.urdu}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-emerald-700">
                    Stage {idx + 1} of 4
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { MessageSquareWarning, ShieldCheck, ArrowRight, HelpCircle, PhoneCall } from "lucide-react";

export function SupportBanner() {
  return (
    <section className="bg-slate-900 py-14 sm:py-16 text-white border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 rounded-3xl border border-slate-800 bg-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <MessageSquareWarning className="size-4 text-emerald-400" />
              <span>Beneficiary Welfare & Oversight</span>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Grievance and Feedback
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Every family concern is taken with the highest degree of institutional seriousness. If you
              encounter delays, staff friction, or service barriers, submit a grievance or reach our focal
              person. Urgent patient-safety matters are flagged immediately for senior clinical intervention.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/grievance"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition"
            >
              <MessageSquareWarning className="size-4" />
              <span>Submit a Grievance</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition"
            >
              <PhoneCall className="size-4 text-emerald-400" />
              <span>Contact Focal Person</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

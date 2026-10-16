"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  CreditCard,
  MessageSquareWarning,
  FileText,
  PhoneCall,
  ArrowRight,
  Award,
} from "lucide-react";

const ACTIONS = [
  {
    title: "Verify Health Card",
    desc: "Instant QR & Token verification",
    href: "/verify",
    icon: ShieldCheck,
    highlight: true,
  },
  {
    title: "Hospital Network",
    desc: "3 MTI teaching hospitals",
    href: "/hospitals",
    icon: Building2,
  },
  {
    title: "12 Healthcare Services",
    desc: "OPD, trauma, surgery & labs",
    href: "/services",
    icon: Stethoscope,
  },
  {
    title: "Sehat Card Plus",
    desc: "Financing facilitation",
    href: "/sehat-card-plus",
    icon: CreditCard,
  },
  {
    title: "Lodge a Grievance",
    desc: "Feedback & care concerns",
    href: "/grievance",
    icon: MessageSquareWarning,
  },
  {
    title: "Eligibility Guide",
    desc: "Family dependants criteria",
    href: "/eligibility",
    icon: FileText,
  },
];

export function QuickActionStrip() {
  return (
    <section
      aria-label="Quick Access Services"
      className="relative z-20 -mt-7 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 w-full overflow-hidden sm:overflow-visible"
    >
      {/* Official Ghazis Guide & Authority Decision Banner Button */}
      <Link
        href="/ghazis"
        className="mb-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#013817] p-3 sm:px-5 sm:py-3 text-white shadow-lg transition-all hover:border-amber-300 hover:shadow-xl hover:-translate-y-0.5 group w-full"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold shadow-sm">
            <Award className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/30 whitespace-nowrap">
                ★ DPO &amp; Authority Decision
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-emerald-200">
                Official Recognition &amp; Healthcare
              </span>
            </div>
            <p className="mt-0.5 font-heading text-xs sm:text-sm font-bold text-white line-clamp-1">
              Derajat Ghazis Initiative — Healthcare &amp; Recognition Cards for Wounded Heroes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-black text-slate-950 shadow-sm group-hover:bg-amber-300 transition shrink-0 self-end sm:self-auto">
          <span>Read Ghazis Guide</span>
          <ArrowRight className="size-3 sm:size-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-6 w-full">
        {ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex flex-col justify-between rounded-xl border p-3 sm:p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md min-w-0 ${
                item.highlight
                  ? "border-emerald-600/50 bg-emerald-900 text-white hover:bg-emerald-800"
                  : "border-slate-200 bg-white text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-lg p-1.5 sm:p-2 ${
                    item.highlight
                      ? "bg-emerald-800 text-emerald-200"
                      : "bg-slate-100 text-emerald-800 group-hover:bg-emerald-100"
                  }`}
                >
                  <Icon className="size-4 sm:size-5" />
                </div>
                <ArrowRight
                  className={`size-3 sm:size-3.5 transition-transform duration-200 group-hover:translate-x-1 ${
                    item.highlight ? "text-emerald-300" : "text-slate-400 group-hover:text-emerald-700"
                  }`}
                />
              </div>
              <div className="mt-2.5 sm:mt-3 min-w-0">
                <h3
                  className={`text-xs sm:text-sm font-bold leading-tight line-clamp-1 break-words ${
                    item.highlight ? "text-white" : "text-slate-900 group-hover:text-emerald-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-0.5 text-[10px] sm:text-xs line-clamp-1 break-words ${
                    item.highlight ? "text-emerald-200/80" : "text-slate-500"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

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
      className="relative z-20 -mt-7 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                item.highlight
                  ? "border-emerald-600/50 bg-emerald-900 text-white hover:bg-emerald-800"
                  : "border-slate-200 bg-white text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-lg p-2 ${
                    item.highlight
                      ? "bg-emerald-800 text-emerald-200"
                      : "bg-slate-100 text-emerald-800 group-hover:bg-emerald-100"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <ArrowRight
                  className={`size-3.5 transition-transform duration-200 group-hover:translate-x-1 ${
                    item.highlight ? "text-emerald-300" : "text-slate-400 group-hover:text-emerald-700"
                  }`}
                />
              </div>
              <div className="mt-3">
                <h3
                  className={`text-sm font-bold leading-snug ${
                    item.highlight ? "text-white" : "text-slate-900 group-hover:text-emerald-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-0.5 text-xs line-clamp-1 ${
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

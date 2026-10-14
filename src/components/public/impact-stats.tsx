"use client";

import {
  Building2,
  Stethoscope,
  HeartPulse,
  FileCheck2,
} from "lucide-react";

const STATS = [
  {
    value: "3",
    label: "Teaching Hospitals",
    sub: "DHQ, MMMTH & Derajat Women & Children",
    icon: Building2,
  },
  {
    value: "12",
    label: "Healthcare Streams",
    sub: "OPD, trauma, diagnostics, ICU, surgery & rehab",
    icon: Stethoscope,
  },
  {
    value: "24/7",
    label: "Emergency Clinical Care",
    sub: "Immediate triage with zero routine delays",
    icon: HeartPulse,
  },
  {
    value: "1",
    label: "Unified Family Record",
    sub: "Verify once, facilitate seamlessly across all desks",
    icon: FileCheck2,
  },
];

export function ImpactStats() {
  return (
    <section className="bg-emerald-950 py-12 text-white border-y border-emerald-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-900/80 p-2.5 text-emerald-300 border border-emerald-500/30">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {item.value}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-emerald-200">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs text-emerald-300/80 leading-relaxed">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

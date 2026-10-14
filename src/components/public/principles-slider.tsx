"use client";

import {
  Award,
  Heart,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  HeartPulse,
  Building,
  Lock,
  TrendingUp,
} from "lucide-react";

const PRINCIPLES = [
  {
    num: "01",
    title: "Honour the Sacrifice",
    desc: "Acknowledge extraordinary public sacrifice by ensuring our institutions respond with the highest level of care and gratitude.",
    icon: Award,
  },
  {
    num: "02",
    title: "Respect Families",
    desc: "Support surviving widows, parents, and children with active compassion, understanding, and institutional warmth.",
    icon: Heart,
  },
  {
    num: "03",
    title: "Protect Dignity",
    desc: "Healthcare facilitation is an institutional obligation, never treated as administrative charity or intrusive scrutiny.",
    icon: ShieldCheck,
  },
  {
    num: "04",
    title: "Facilitate Do Not Complicate",
    desc: "Simplify paperwork, streamline approvals, and eliminate redundant red tape across hospital departments.",
    icon: CheckCircle2,
  },
  {
    num: "05",
    title: "Verify Once Facilitate Consistently",
    desc: "Once verified by the competent authority, families never need to repeatedly prove entitlement at different counters.",
    icon: FileCheck2,
  },
  {
    num: "06",
    title: "Emergency Care First",
    desc: "Immediate clinical assessment and emergency resuscitation must never be held back for routine card verification.",
    icon: HeartPulse,
  },
  {
    num: "07",
    title: "No Unnecessary Movement Between Offices",
    desc: "Families are guided through dedicated Family Health Desks so they don't have to wander between administrative rooms.",
    icon: Building,
  },
  {
    num: "08",
    title: "Confidentiality and Privacy",
    desc: "Families should not be required to narrate painful circumstances of Shahadat merely to access medical services.",
    icon: Lock,
  },
  {
    num: "09",
    title: "Monitor Evaluate and Improve",
    desc: "Active oversight by the Working Group, continuous review of grievances, and monthly reporting to maintain excellence.",
    icon: TrendingUp,
  },
];

export function PrinciplesSlider() {
  return (
    <section className="bg-slate-900 py-16 sm:py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Award className="size-3.5 text-emerald-400" />
            <span>Foundational Pillars</span>
          </div>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Core Principles
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Every clinical interaction, administrative protocol, and desk guideline is anchored in
            reverence, transparency, and uncompromised dignity.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/80 hover:bg-slate-900 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-emerald-400">
                      {item.num}
                    </span>
                    <div className="rounded-lg bg-emerald-950/80 p-2 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="mt-4 font-heading text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

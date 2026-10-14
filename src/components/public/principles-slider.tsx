"use client";

import Image from "next/image";
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
  FileText,
  ShieldAlert,
} from "lucide-react";

const OFFICIAL_POSTER_PRINCIPLES = [
  {
    tag: "VERIFY ONCE",
    badgeColor: "bg-blue-600 text-white",
    cardBorder: "border-blue-500/40 hover:border-blue-400",
    iconBg: "bg-blue-500/20 text-blue-400",
    icon: FileText,
    desc: "Verified information should be reused wherever practicable, sparing families repeated explanations of their loss.",
  },
  {
    tag: "DATA PROTECTION",
    badgeColor: "bg-sky-600 text-white",
    cardBorder: "border-sky-500/40 hover:border-sky-400",
    iconBg: "bg-sky-500/20 text-sky-400",
    icon: ShieldCheck,
    desc: "Personal, family and medical information will remain protected through authorised institutional channels.",
  },
  {
    tag: "EMERGENCY CARE COMES FIRST",
    badgeColor: "bg-red-600 text-white",
    cardBorder: "border-red-500/40 hover:border-red-400",
    iconBg: "bg-red-500/20 text-red-400",
    icon: HeartPulse,
    desc: "Routine documentation or card verification must not delay medically necessary immediate assessment and treatment.",
  },
  {
    tag: "TRANSPARENT AND ACCOUNTABLE",
    badgeColor: "bg-emerald-600 text-white",
    cardBorder: "border-emerald-500/40 hover:border-emerald-400",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    icon: TrendingUp,
    desc: "Financial arrangements will follow applicable policies. Coordination with Sehat Card Plus and other programmes will promote transparency and prevent duplicate claims.",
  },
];

export function PrinciplesSlider() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20 text-white relative overflow-hidden border-t border-emerald-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-[#01411c]/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Award className="size-3.5 text-amber-300" />
            <span>Official Institutional Framework</span>
          </div>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Core Guiding Principles
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Mandated protocols established by Mufti Mehmood Memorial Medical Teaching Institution to ensure compassionate, dignified healthcare delivery.
          </p>
        </div>

        {/* 4 Official Principles Cards (From Poster Banner) */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICIAL_POSTER_PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.tag}
                className={`flex flex-col justify-between rounded-2xl border ${item.cardBorder} bg-slate-900/90 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <div className={`rounded-lg p-2 ${item.iconBg}`}>
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Golden Bottom Ribbon from Poster */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#013817] p-5 text-center text-white shadow-xl">
          <p dir="rtl" className="font-serif text-lg sm:text-xl font-bold text-amber-300 mb-1">
            ان کی قربانی، ہماری پائیدار ذمہ داری ہے • ان کے خاندان پائیدار اعتراف کے مستحق ہیں
          </p>
          <p className="font-serif italic text-sm sm:text-base font-semibold text-emerald-100">
            &ldquo;Their sacrifice is our enduring responsibility, Their families deserve enduring recognition. Our commitment is to honour both through service and care.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { AlertTriangle, HeartPulse, PhoneCall, ShieldAlert, ArrowRight } from "lucide-react";

export function EmergencyCallout() {
  return (
    <section className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-y border-amber-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-amber-600 p-3 text-white shrink-0 shadow-sm">
            <HeartPulse className="size-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-800 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-white">
                Paramount Priority
              </span>
              <h3 className="font-heading text-lg font-bold text-amber-950 sm:text-xl">
                Emergency Care First • Zero Delay for Paperwork
              </h3>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-amber-900/90 max-w-3xl">
              In a medical crisis, visit the nearest Emergency Department immediately. Urgent assessment,
              trauma triage, and life-saving resuscitation must never be held back solely for routine
              verification, health card presentation, or administrative clearance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/hospitals"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition"
          >
            <ShieldAlert className="size-4" />
            <span>Emergency Desks</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-700/40 bg-white/80 px-4 py-2.5 text-xs font-bold text-amber-950 shadow-sm hover:bg-white transition"
          >
            <PhoneCall className="size-4 text-amber-800" />
            <span>Helpline Numbers</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

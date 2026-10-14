"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Heart, Baby, UserCheck, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export function FamilyEligibilityPreview() {
  return (
    <section className="bg-white py-16 sm:py-20 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-950">
            <Image
              src="/images/family.jpg"
              alt="Family members supported through one coordinated care pathway"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                Family Welfare
              </span>
              <p className="mt-1 font-heading text-lg font-bold">Dignified Entitlements for Dependant Families</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-700" />
              <span>Family Eligibility</span>
            </div>

            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Eligible Family Members
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-700">
              The competent authority verifies eligibility using the prescribed records. Eligible members may
              include a widow or widower, parents, dependent children, unmarried daughters, children with
              disabilities and other approved dependants.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <Heart className="size-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">Widow or Widower</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <Users className="size-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">Dependent Parents</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <Baby className="size-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">Minor Children</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <UserCheck className="size-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">Unmarried Daughters</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <span>Read eligibility information</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

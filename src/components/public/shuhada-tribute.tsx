"use client";

import Link from "next/link";
import Image from "next/image";
import { Award, Heart, Shield, ArrowRight, CheckCircle2, Star, Sparkles } from "lucide-react";

export function ShuhadaTribute() {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Official National Reverence & Poetic Couplet Banner */}
        <div className="mb-14 overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#013817] p-6 sm:p-8 text-white shadow-2xl relative">
          {/* Subtle Crescent & Star Motif Background Watermark */}
          <div className="absolute -right-8 -top-8 size-48 opacity-10 pointer-events-none select-none text-white font-serif text-[180px] leading-none flex items-center justify-center">
            ★
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40 backdrop-blur-md mb-4">
              <Star className="size-3.5 fill-amber-300 text-amber-300" />
              <span>National Reverence & Sacred Trust</span>
              <Star className="size-3.5 fill-amber-300 text-amber-300" />
            </div>

            {/* English Official Quote from Poster */}
            <div className="max-w-3xl mx-auto">
              <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-300 leading-snug drop-shadow-md">
                &ldquo;A Shaheed&apos;s death is the nation&apos;s life;
                <br className="hidden sm:inline" /> A Shaheed&apos;s blood is the nation&apos;s zakat.&rdquo;
              </p>
              <p className="mt-2 text-xs sm:text-sm font-semibold tracking-wide text-emerald-200">
                — Maulana Abdul Majeed Salik —
              </p>
            </div>

            {/* Urdu Couplet from Official Poster */}
            <p
              dir="rtl"
              className="mt-4 font-serif text-lg sm:text-xl font-bold text-amber-200/90 leading-relaxed"
            >
              شہید کی جو موت ہے، وہ قوم کی حیات ہے • لہو جو ہے شہید کا، وہ قوم کی زکوٰۃ ہے
            </p>

            {/* Golden Ribbon Quote */}
            <div className="mt-6 inline-block rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 p-px">
              <div className="rounded-xl bg-[#013817]/90 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-amber-200 border border-amber-400/30">
                &ldquo;Their sacrifice is our enduring responsibility, Their families deserve enduring recognition. Our commitment is to honour both through service and care.&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid with Official Banner Image & Commitment Details */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Visual Card with Official Banner Artwork */}
          <div className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl border-2 border-emerald-900/20 bg-slate-950">
              <Image
                src="/images/derajat-shuhada-banner.jpg"
                alt="Shuhada-e-Derajat Family Healthcare Initiative official tribute banner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#01411c]/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40 backdrop-blur-md">
                  <Shield className="size-3.5 text-amber-300" />
                  Honouring Sacrifice Through Care
                </span>
                <h3 className="mt-2.5 font-heading text-xl sm:text-2xl font-bold leading-tight text-white">
                  &ldquo;Honouring the Shuhada by Caring for Their Families.&rdquo;
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-200">
                  Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 hidden sm:flex items-center gap-3 rounded-2xl border-2 border-amber-400/40 bg-[#01411c] p-4 text-white shadow-xl">
              <div className="rounded-xl bg-amber-400 p-2.5 text-slate-950">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Institutional Mission
                </p>
                <p className="text-sm font-bold text-white">Dignified Care for Every Family</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Text & Values */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Award className="size-4 text-emerald-700" />
              <span>A Sacred Trust</span>
            </div>

            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One Family Record. Three Hospitals. One Coordinated Healthcare Pathway.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-700">
              The sacrifice that sustains a nation creates an enduring responsibility towards the families who carry its human cost. Honouring our Shuhada means ensuring that their parents, spouses, children and eligible dependants continue to experience recognition, dignity and compassionate support when they need healthcare.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              When these noble families enter our hospitals, they should encounter an institution that honors their sacrifice through facilitated clinical pathways, streamlined administration, and zero avoidable bureaucratic distress.
            </p>

            {/* Checklist of commitments from poster */}
            <div className="mt-6 space-y-3">
              {[
                "Verify Once: Reusable verified records sparing families repeated explanation of loss",
                "Dedicated Family Health Desks & Concierge across DHQ, MMMTI & DWCH",
                "Dental, Surgical, Inpatient & Diagnostic priority facilitation",
                "Data Protection: Personal, family & medical information safeguarded via authorised channels",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-emerald-100 p-1 text-emerald-800 shrink-0">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-[#01411c] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition"
              >
                <span>Read Institutional Commitment</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <Heart className="size-4 text-emerald-700" />
                <span>Eligibility Criteria</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

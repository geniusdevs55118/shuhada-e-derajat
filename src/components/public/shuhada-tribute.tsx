"use client";

import Link from "next/link";
import Image from "next/image";
import { Award, Heart, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export function ShuhadaTribute() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Visual Card with Image & Reverence */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border border-slate-200">
              <Image
                src="/images/family.jpg"
                alt="Families of Shuhada receiving coordinated healthcare"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-200 backdrop-blur-md">
                  <Shield className="size-3.5 text-emerald-300" />
                  National Reverence & Respect
                </span>
                <h3 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl text-white">
                  Their Sacrifice, Our Enduring Obligation
                </h3>
                <p dir="rtl" className="mt-1 font-serif text-sm font-semibold text-emerald-200">
                  ان کی قربانی، ہماری ذمہ داری • باوقار طریقہ علاج
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950 p-4 text-white shadow-xl">
              <div className="rounded-xl bg-emerald-600 p-2.5 text-white">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
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
              Those who laid down their lives for Pakistan in Dera Ismail Khan and the Derajat region carried
              the ultimate burden for our peace. Their families continue to carry the lasting consequence of
              that sacrifice every single day.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              When these noble families enter our hospitals, they should encounter an institution that honors
              their sacrifice through facilitated clinical pathways, streamlined administration, and zero
              avoidable bureaucratic distress.
            </p>

            {/* Checklist of commitments */}
            <div className="mt-6 space-y-3">
              {[
                "Respectful, single-window identification via the Shuhada Family Health Card",
                "Dedicated Family Health Desks to guide beneficiaries across departments",
                "Full integration with Sehat Card Plus and institutional medicine formularies",
                "Strict protection of personal privacy without repeated narration of Shahadat",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-emerald-100 p-1 text-emerald-800">
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
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition"
              >
                <span>Read About Our Initiative</span>
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

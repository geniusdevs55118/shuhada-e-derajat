"use client";

import Link from "next/link";
import Image from "next/image";
import { Award, Heart, Shield, ArrowRight, CheckCircle2, Star, Sparkles, Activity } from "lucide-react";

export function GhazisTribute() {
  return (
    <section id="ghazis" className="relative overflow-hidden bg-slate-50/70 py-14 sm:py-20 border-t border-slate-200/80">
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
              <span>Living Valor & Sacred Gratitude • Derajat Ghazis</span>
              <Star className="size-3.5 fill-amber-300 text-amber-300" />
            </div>

            {/* Urdu Couplet for Ghazis */}
            <p
              dir="rtl"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-300 leading-relaxed drop-shadow-md"
            >
              سلام ان غازیوں کو جن کے جذبوں نے وطن سنبھالا
              <br />
              کٹا کے ہاتھ، کھو کے بازو، وفا کا دیپ جلایا
            </p>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-emerald-200">
              — غازیانِ وطن کی بے مثال شجاعت و قربانی کے نام —
            </p>

            {/* English Translation */}
            <p className="mt-3 text-sm sm:text-base md:text-lg italic font-medium text-slate-100 max-w-2xl mx-auto">
              &ldquo;Salute to the valiant Ghazis whose unwavering spirit shielded the homeland; Bearing wounds and disability with dignity, they kept the sacred flame alive.&rdquo;
            </p>

            {/* Golden Ribbon Quote: Decision by Authorities */}
            <div className="mt-6 inline-block rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 p-px">
              <div className="rounded-xl bg-[#013817]/90 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-amber-200 border border-amber-400/30">
                &ldquo;By authority decision of DPO & District Administration: Extending equal dignity, healthcare facilitation, and official &apos;Derajat Ghazis Health Cards&apos; to wounded security heroes.&rdquo;
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
                src="/images/derajat-ghazis-banner.jpg"
                alt="Derajat Ghazis Healthcare & Recognition official tribute artwork"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#01411c]/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40 backdrop-blur-md">
                  <Shield className="size-3.5 text-amber-300" />
                  Police • Army • Levies • FC
                </span>
                <h3 className="mt-2.5 font-heading text-xl sm:text-2xl font-bold leading-tight text-white">
                  &ldquo;Honouring the Living Heroes Who Bore the Scars of Duty.&rdquo;
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-200">
                  Comprehensive Healthcare Pathway across MMMTI, DHQ & DWCH
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
                  Special Welfare Category
                </p>
                <p className="text-sm font-bold text-white">Derajat Ghazis Recognition</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Text & Values */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Activity className="size-4 text-emerald-700" />
              <span>Institutional Honor & Lifetime Care</span>
            </div>

            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Honoring Our Wounded, Disabled & Blast-Surviving Heroes
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Following decisions by the district leadership (including DPO D.I. Khan and hospital authorities), the Shuhada initiative has formally expanded to encompass <strong>Ghazis</strong>—the brave personnel of the <strong>Police, Pakistan Army, Frontier Constabulary (FC), and Levies</strong> who suffered disabling injuries, lost limbs, or survived terrorist blasts in service of the nation.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Under the banner of <strong>&ldquo;Derajat Ghazis&rdquo;</strong>, these honored veterans receive the same prompt, dignified, and specialized healthcare facilitation as Shuhada families across all network teaching hospitals.
            </p>

            {/* Checklist of commitments for Ghazis */}
            <div className="mt-6 space-y-3">
              {[
                "Derajat Ghazi Health Cards: Distinctive recognition cards ensuring instant hospital access",
                "Dedicated Clinical Concierge: Priority OPD, specialized surgical, diagnostic and trauma care",
                "Rehabilitation & Disability Care: Physiotherapy, orthopedic support and prosthetic assistance",
                "Multi-Agency Coverage: Equal entitlement for Police, Army, Levies, and FC personnel",
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
                href="/ghazis"
                className="inline-flex items-center gap-2 rounded-xl bg-[#01411c] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition"
              >
                <span>Read Ghazis Guide & Eligibility</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <Shield className="size-4 text-emerald-700" />
                <span>Verify Ghazi Card</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

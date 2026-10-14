"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function HealthCardShowcase() {
  const [tokenInput, setTokenInput] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      if (typeof window !== "undefined") window.location.href = "/verify";
      return;
    }
    if (typeof window !== "undefined") window.location.href = `/verify/${encodeURIComponent(trimmed)}`;
  };

  return (
    <section className="bg-slate-50/70 py-16 sm:py-24 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Information & Instant Verification Input */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CreditCard className="size-4 text-emerald-700" />
              <span>Identity & Facilitation Instrument</span>
            </div>

            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Derajat Shuhada Family Health Card
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-700">
              The Derajat Shuhada Health Card enables authorized hospital staff to instantly verify the
              family record and connect beneficiaries to services. It serves as an official credential of
              honor and healthcare facilitation across all three network hospitals.
            </p>

            {/* Quick Verification Form */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <QrCode className="size-4 text-emerald-700" />
                <span>Instant Card Verification</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Enter the verification code printed beneath the QR code, or scan via camera.
              </p>

              <form onSubmit={handleVerify} className="mt-3 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="e.g. CARD-XXXXXXXX or verification token"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition shrink-0"
                >
                  <ShieldCheck className="size-4" />
                  <span>Verify Card</span>
                </button>
              </form>
            </div>

            {/* Key Card Features */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Single family record for all dependants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Encrypted verification token</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Accepted across all 3 hospitals</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-emerald-600 shrink-0" />
                <span>Strict privacy & security protocols</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600"
              >
                <span>How the card works in practice</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Card Graphic / Mockup */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-900">
              <Image
                src="/images/health-card.jpg"
                alt="Derajat Shuhada Family Health Card"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <div>
                  <span className="rounded bg-emerald-600/90 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-white">
                    Official Beneficiary ID
                  </span>
                  <p className="mt-1 font-heading text-lg font-bold">Secure Health Card Verification</p>
                </div>
                <Link
                  href="/verify"
                  className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white/30 transition"
                  aria-label="Go to card verification page"
                >
                  <QrCode className="size-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

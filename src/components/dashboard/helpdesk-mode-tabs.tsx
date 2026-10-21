"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  QrCode,
  CalendarClock,
  Users,
  CreditCard,
  Building2,
  Activity,
  ArrowRight,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface HelpdeskModeTabsProps {
  user: {
    name: string;
    role: string;
    designation?: string | null;
    hospitalName: string;
  };
  counts: {
    families: number;
    visitsThisMonth: number;
    openGrievances: number;
  };
}

export function HelpdeskModeTabs({ user, counts }: HelpdeskModeTabsProps) {
  const [mode, setMode] = useState<"shuhada" | "ghazi">("shuhada");

  return (
    <div className="space-y-5">
      {/* 1. Animated Top Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline pl-2">
            Operational Category:
          </span>
          <div className="relative grid grid-cols-2 sm:inline-flex w-full sm:w-auto rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1 sm:gap-0">
            {/* Shuhada Tab */}
            <button
              id="btn-tab-shuhada"
              type="button"
              onClick={() => setMode("shuhada")}
              className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer min-w-0 ${
                mode === "shuhada"
                  ? "bg-[#01411c] text-white shadow-md shadow-[#01411c]/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Shield className={`size-3.5 sm:size-4 shrink-0 ${mode === "shuhada" ? "text-amber-300" : "text-slate-500"}`} />
              <span className="text-center leading-tight">Shuhada <span className="block sm:inline">(شہداء)</span></span>
              {mode === "shuhada" && (
                <span className="shrink-0 rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                  Default
                </span>
              )}
            </button>

            {/* Ghazis Tab */}
            <button
              id="btn-tab-ghazi"
              type="button"
              onClick={() => setMode("ghazi")}
              className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer min-w-0 ${
                mode === "ghazi"
                  ? "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md shadow-amber-700/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Award className={`size-3.5 sm:size-4 shrink-0 ${mode === "ghazi" ? "text-amber-300" : "text-amber-600"}`} />
              <span className="text-center leading-tight">Ghazis <span className="block sm:inline">(غازیانِ وطن)</span></span>
              <span className="shrink-0 rounded-full bg-emerald-700 text-emerald-100 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider">
                New
              </span>
            </button>
          </div>
        </div>

        {/* Current status tag */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pr-1 w-full sm:w-auto">
          <span className="text-[11px] sm:text-xs text-slate-500">Active Desk:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold transition-colors ${
              mode === "shuhada"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-900 border border-amber-300"
            }`}
          >
            <span className="size-1.5 sm:size-2 rounded-full animate-pulse bg-current shrink-0" />
            <span>{mode === "shuhada" ? "Shuhada Families Desk" : "Derajat Ghazis Welfare Desk"}</span>
          </span>
        </div>
      </div>

      {/* 2. Dynamic Portal Header with Smooth Transition */}
      <div
        className={`overflow-hidden rounded-2xl border-2 text-white shadow-xl transition-all duration-500 ${
          mode === "shuhada"
            ? "border-amber-500/40 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#013817]"
            : "border-amber-400 bg-gradient-to-r from-[#013817] via-[#064e29] to-[#0f172a]"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] items-stretch">
          <div className="flex flex-col justify-between p-4 sm:p-6 min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    mode === "shuhada" ? "bg-amber-400 text-slate-950" : "bg-amber-400 text-slate-950"
                  }`}
                >
                  {mode === "shuhada" ? "★ Shuhada Healthcare Portal" : "🎖️ Derajat Ghazis Portal"}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-200 break-words">
                  {mode === "shuhada"
                    ? "Mufti Mehmood Memorial MTI • DHQ • DWCH"
                    : "Police • Pakistan Army • Levies • FC Personnel"}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white transition-all break-words leading-tight">
                {mode === "shuhada" ? `Welcome, ${user.name}` : `Welcome, ${user.name} (Ghazis Desk)`}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5 break-words">
                {user.designation ?? user.role} • {user.hospitalName}
              </p>
            </div>

            {/* Poetic Quotation in Urdu & English */}
            <div className="my-3 sm:my-4 rounded-xl border border-amber-400/30 bg-black/30 p-3 sm:p-3.5 backdrop-blur-sm transition-all duration-300">
              <p dir="rtl" className="font-serif text-xs sm:text-base md:text-lg font-bold text-amber-300 leading-relaxed break-words">
                {mode === "shuhada"
                  ? "شہید کی جو موت ہے، وہ قوم کی حیات ہے • لہو جو ہے شہید کا، وہ قوم کی زکوٰۃ ہے"
                  : "سلام ان غازیوں کو جن کے جذبوں نے وطن سنبھالا • کٹا کے ہاتھ، کھو کے بازو، وفا کا دیپ جلایا"}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-emerald-100 italic leading-normal break-words">
                {mode === "shuhada"
                  ? "“Their sacrifice is our enduring responsibility. Honouring the Shuhada by caring for their families.”"
                  : "“Honouring wounded, disabled and blast-surviving heroes who sacrificed limbs and bore scars in service of the nation.”"}
              </p>
            </div>

            {/* Badges & 4 Hospital Categories */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-700/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                  {user.role}
                </span>
                <span className="rounded-md bg-amber-400 text-slate-950 px-3 py-1 text-xs font-bold shadow-sm">
                  {user.hospitalName}
                </span>
                {mode === "ghazi" && (
                  <span className="rounded-md bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold border border-emerald-400/40">
                    Authority Mandate Active
                  </span>
                )}
              </div>

              {/* 4 Logos Mini Strip */}
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1 border border-white/10">
                <div title="Mufti Mehmood Memorial MTI" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-mmmti.svg" alt="MMMTI" width={24} height={24} className="object-contain" />
                </div>
                <div title="DHQ Teaching Hospital" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-dhq.svg" alt="DHQ" width={24} height={24} className="object-contain" />
                </div>
                <div title="Derajat Women & Children Hospital" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-dwch.svg" alt="DWCH" width={24} height={24} className="object-contain" />
                </div>
                <div title="Central Directorate" className="size-7 rounded-full bg-white p-0.5 shadow-xs">
                  <Image src="/images/logo-dsfhi.svg" alt="DSFHI" width={24} height={24} className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Banner Artwork with Smooth Image Swap */}
          <div className="relative min-h-44 lg:min-h-0 border-t lg:border-t-0 lg:border-l border-amber-500/30 overflow-hidden">
            <Image
              src={mode === "shuhada" ? "/images/derajat-shuhada-banner.jpg" : "/images/derajat-ghazis-banner.jpg"}
              alt={mode === "shuhada" ? "Shuhada Memorial Artwork" : "Derajat Ghazis Artwork"}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover transition-opacity duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#01411c]/60" />
            <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-xs rounded-md px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
              {mode === "shuhada" ? "Shuhada Tribute" : "Ghazis Tribute"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Quick Action Cards (Dynamically adapted to mode) */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-600" />
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                {mode === "shuhada"
                  ? "Shuhada Operations & Health Desk Queue"
                  : "Derajat Ghazis Operations & Facilitation"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === "shuhada"
                ? "Direct access to daily hospital facilitation, Shuhada cards and family registry"
                : "Dedicated pathways for wounded personnel: Army, Police, FC, Levies veterans"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              mode === "shuhada" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {mode === "shuhada" ? "Shuhada Mode" : "Ghazis Mode Active"}
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Scan Card */}
          <Link
            href={`/dashboard/scan?category=${mode}`}
            className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 transition-all hover:border-emerald-600 hover:bg-emerald-50/50 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <QrCode className="size-5" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-700">&rarr;</span>
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                {mode === "shuhada" ? "Scan Shuhada Card" : "Scan Derajat Ghazi Card"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {mode === "shuhada"
                  ? "Instant QR and token verification for martyr families."
                  : "Verify injured veteran credentials and check hospital clearance."}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-emerald-700">Open Scanner &rarr;</span>
          </Link>

          {/* Card 2: Generate / View Cards */}
          <Link
            href={`/dashboard/health-cards?category=${mode}`}
            className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 transition-all hover:border-emerald-600 hover:bg-emerald-50/50 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <CreditCard className="size-5" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-700">&rarr;</span>
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-blue-950">
                {mode === "shuhada" ? "Shuhada Health Cards" : "Issue / View Ghazi Cards"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {mode === "shuhada"
                  ? "Manage, print, and revalidate Shuhada health cards."
                  : "Issue Derajat Ghazi Cards with national honor branding & PDF printing."}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-blue-700">Card Registry &rarr;</span>
          </Link>

          {/* Card 3: Families / Beneficiaries */}
          <Link
            href={`/dashboard/families?category=${mode}`}
            className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 transition-all hover:border-emerald-600 hover:bg-emerald-50/50 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
                  <Users className="size-5" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-purple-700">&rarr;</span>
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-purple-950">
                {mode === "shuhada" ? "Shuhada Families Master" : "Ghazis & Veterans Directory"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {mode === "shuhada"
                  ? "View verified dependants and martyr civil records."
                  : "Directory of wounded/disabled personnel across Police, Army, Levies, & FC."}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-purple-700">Open Directory &rarr;</span>
          </Link>

          {/* Card 4: Visits & Facilitation */}
          <Link
            href={`/dashboard/visits?category=${mode}`}
            className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 transition-all hover:border-emerald-600 hover:bg-emerald-50/50 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <CalendarClock className="size-5" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-amber-700">&rarr;</span>
              </div>
              <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-amber-950">
                {mode === "shuhada" ? "Visits & Appointments" : "Ghazis Healthcare Visits"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {mode === "shuhada"
                  ? "Track and record daily hospital visits for martyr dependants."
                  : "Log & monitor separate visit records and orthopedic/rehab care for Ghazis."}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-bold text-amber-700">Visits Log &rarr;</span>
          </Link>
        </div>

        {/* Extra Ghazi Guide Callout Strip (shown when in Ghazis mode) */}
        {mode === "ghazi" && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500 p-2 text-slate-950">
                <Award className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">
                  Authorized by District Police Officer (DPO) &amp; Hospital Directorate
                </p>
                <p className="text-[11px] text-amber-900/80">
                  Covering disabled &amp; blast-surviving personnel of Police, Army, Levies, and FC.
                </p>
              </div>
            </div>
            <Link
              href="/ghazis"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#01411c] px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
            >
              <span>View Public Ghazis Guide</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

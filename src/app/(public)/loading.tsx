"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function PublicLoading() {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center p-8 bg-slate-50/50"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing Emblem */}
        <div className="relative size-16 rounded-2xl bg-emerald-950 p-2.5 shadow-xl border border-emerald-800 flex items-center justify-center animate-pulse">
          <Image
            src="/images/logo.svg"
            alt="Loading Shuhada-e-Derajat Healthcare"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Circular Spinner Ring */}
        <div className="mt-5 flex items-center gap-2">
          <div className="size-4 animate-spin rounded-full border-2 border-emerald-800 border-t-transparent" />
          <span className="font-heading text-sm font-bold text-slate-800">
            Loading Coordinated Healthcare...
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500 font-medium">
          Shuhada-e-Derajat Family Healthcare Initiative
        </p>
      </div>

      {/* Subtle skeleton cards */}
      <div className="mt-10 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-4 opacity-40">
        <div className="h-28 rounded-xl bg-slate-200 animate-pulse" />
        <div className="h-28 rounded-xl bg-slate-200 animate-pulse hidden sm:block" />
        <div className="h-28 rounded-xl bg-slate-200 animate-pulse hidden sm:block" />
      </div>
    </div>
  );
}

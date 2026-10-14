"use client";

import Link from "next/link";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";

export function PublicPageIntro({
  section,
  title,
  description,
  breadcrumbs,
}: {
  section: string;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 text-white border-b border-emerald-900/60">
      {/* Decorative gradient backdrops */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-950 to-slate-950"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 right-0 size-96 rounded-full bg-emerald-600/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-emerald-300/80">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="size-3 text-emerald-600" />
          {breadcrumbs ? (
            breadcrumbs.map((b, i) => (
              <span key={b.label} className="flex items-center gap-2">
                {b.href ? (
                  <Link href={b.href} className="hover:text-white transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-emerald-100 font-semibold">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="size-3 text-emerald-600" />}
              </span>
            ))
          ) : (
            <span className="text-emerald-100 font-semibold">{title}</span>
          )}
        </nav>

        {/* Kicker badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-900/50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-emerald-300">
          <ShieldCheck className="size-3 text-emerald-400" />
          <span>{section}</span>
        </div>

        {/* Title */}
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-3.5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
          {description}
        </p>
      </div>
    </section>
  );
}

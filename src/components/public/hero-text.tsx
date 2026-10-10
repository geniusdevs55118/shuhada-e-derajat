"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

export function HeroText({ inverse = false }: { inverse?: boolean }) {
  const [lang] = useLang();
  return (
    <div>
      <h1 className={`max-w-3xl font-heading text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem] ${inverse ? "text-white" : "text-blue-950"}`}>
        {t("heroTitle", lang)}
      </h1>
      <p className={`mt-5 max-w-2xl text-lg leading-8 sm:text-xl ${inverse ? "text-white/90" : "text-gray-700"}`}>{t("heroTagline", lang)}</p>
      <p className={`mt-5 border-l-2 border-emerald-500 pl-3 text-sm font-semibold ${inverse ? "text-emerald-100" : "text-emerald-900"}`}>
        {t("heroMotto", lang)}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/verify" className="inline-flex min-h-11 items-center rounded-md bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800">
          {t("verifyCardCta", lang)}
        </Link>
        <Link href="/login" className={`inline-flex min-h-11 items-center rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 ${inverse ? "border-white/60 bg-white/10 text-white hover:bg-white/20" : "border-border bg-white text-blue-900 hover:bg-slate-50"}`}>
          Staff Login
        </Link>
      </div>
    </div>
  );
}

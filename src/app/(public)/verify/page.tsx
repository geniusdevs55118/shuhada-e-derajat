"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  ShieldCheck,
  QrCode,
  Search,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export default function VerifyCardPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setError("Please enter the verification code printed on the card or scanned from the QR code.");
      return;
    }
    setError("");
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main>
      <PublicPageIntro
        section="Beneficiary Verification"
        title="Verify a Shuhada Health Card"
        description="Verify the active status and institutional entitlements of a Shuhada-e-Derajat Family Health Card in real-time."
        breadcrumbs={[{ label: "Verify" }]}
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: Verification Console */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="size-4 text-emerald-700" />
                <span>Official Card Authentication</span>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                Check Health Card Validity
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter the alphanumeric verification token printed beneath the QR code on the back of the
                card, or scan the QR code using any smartphone camera.
              </p>

              <form onSubmit={handleVerify} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="token" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Card Verification Code / Token
                  </label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      id="token"
                      type="text"
                      value={tokenInput}
                      onChange={(e) => {
                        setTokenInput(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="e.g. CARD-XXXXXXXX or paste QR link token"
                      className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Example: Scan the QR code with your phone camera or enter the alphanumeric token.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200" role="alert">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3.5 px-6 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <ShieldCheck className="size-4" />
                  <span>Authenticate Health Card</span>
                </button>
              </form>

              {/* Security notice */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600">
                <Lock className="size-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Privacy Safeguard:</strong> This verification tool confirms card activity, card
                  serial, and participating hospital entitlement. Sensitive medical records or CNIC numbers
                  are never disclosed on public lookups.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Card Preview Graphic */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-950">
              <Image
                src="/images/health-card.jpg"
                alt="Health Card with QR Token"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                  Beneficiary Identification
                </span>
                <p className="mt-1 font-heading text-lg font-bold">Shuhada-e-Derajat Health Card</p>
                <p className="text-xs text-emerald-200 mt-0.5">Accepted at DHQ, MMMTH & DWCH</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm">Need In-Person Verification Help?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Family Health Desks are open across all three hospitals in Dera Ismail Khan to verify cards,
                replace damaged cards, or assist with family dependant additions.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600"
              >
                <span>Find Hospital Health Desk Locations</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
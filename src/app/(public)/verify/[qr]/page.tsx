/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  AlertCircle,
  Building2,
  Users,
  HeartPulse,
  Printer,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
} from "lucide-react";

function VerifyQrInner({ params }: { params: Promise<{ qr: string }> }) {
  const { qr } = use(params);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/verify/${encodeURIComponent(qr)}`)
      .then(async (res) => {
        const d = await res.json();
        if (res.ok) setData(d);
        else setError(d.error || "Card verification failed or code not recognized.");
      })
      .catch(() => setError("Network communication error. Please check connection."))
      .finally(() => setLoading(false));
  }, [qr]);

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Card Verification</span>
        </Link>
      </div>

      {loading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="size-10 animate-spin rounded-full border-3 border-emerald-800 border-t-transparent mx-auto" />
          <h2 className="mt-4 font-heading text-lg font-bold text-slate-800">
            Authenticating Health Card...
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Verifying token with the institutional database
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto size-12 text-red-600" />
          <h2 className="mt-3 font-heading text-xl font-bold text-red-950">
            Verification Unsuccessful
          </h2>
          <p className="mt-2 text-sm text-red-800 max-w-md mx-auto">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/verify"
              className="rounded-xl bg-red-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700"
            >
              Try Another Code
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-red-300 bg-white px-5 py-2.5 text-xs font-bold text-red-900 hover:bg-red-50"
            >
              Contact Health Desk
            </Link>
          </div>
        </div>
      )}

      {data && data.valid === false && !loading && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto size-12 text-amber-600" />
          <h2 className="mt-3 font-heading text-xl font-bold text-amber-950">
            Card Record Inactive
          </h2>
          <p className="mt-2 text-sm text-amber-800 max-w-md mx-auto">
            {data.message || "This card record is currently suspended or expired."}
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="rounded-xl bg-amber-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              Visit Health Desk for Assistance
            </Link>
          </div>
        </div>
      )}

      {data && data.valid && !loading && (
        <div className="space-y-6">
          {/* Official Verification Certificate Card */}
          <div className="overflow-hidden rounded-3xl border border-emerald-600/30 bg-white shadow-lg">
            {/* Top Ribbon */}
            <div className="bg-emerald-950 text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-900 p-1.5 border border-emerald-700 flex items-center justify-center shrink-0">
                  <Image src="/images/logo.svg" alt="" width={32} height={32} />
                </div>
                <div>
                  <h1 className="font-heading text-lg font-bold text-white leading-tight">
                    Derajat Shuhada Family Health Card
                  </h1>
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-300">
                    Mufti Mehmood Memorial MTI • Official Digital Credential
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  {data.status || "ACTIVE"}
                </span>
              </div>
            </div>

            {/* Credential Data Grid */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                    Card Number
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold text-slate-900">
                    {data.cardNo}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                    Family Reg. ID
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold text-emerald-800">
                    {data.familyRegistrationId}
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                    Verification Status
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Duly Verified</span>
                  </p>
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                    Security Protection
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Lock className="size-3.5 text-slate-500" />
                    <span>Encrypted Token</span>
                  </p>
                </div>
              </div>

              {/* Participating Hospitals */}
              <div className="mt-6 rounded-2xl bg-emerald-50/60 p-4 border border-emerald-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  <Building2 className="size-4 text-emerald-700" />
                  <span>Authorized Participating Hospitals</span>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-emerald-900">
                  {data.allowedHospitals?.join(" • ") ||
                    "DHQ Teaching Hospital • Mufti Mehmood Memorial Hospital • Derajat Women & Children Hospital"}
                </p>
              </div>

              {/* Verified Beneficiary Dependants Table */}
              <div className="mt-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  <Users className="size-4 text-emerald-700" />
                  <span>Authorized Family Beneficiaries</span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[0.68rem] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 font-bold">Beneficiary Name</th>
                        <th className="p-3.5 font-bold">Relationship</th>
                        <th className="p-3.5 font-bold">Eligibility Entitlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {data.beneficiaries?.map((b: any, index: number) => (
                        <tr key={`${b.name}-${index}`} className="hover:bg-slate-50/60 transition">
                          <td className="p-3.5 font-bold text-slate-900">{b.name}</td>
                          <td className="p-3.5 text-slate-700 font-medium">{b.relationship}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="size-3 text-emerald-600" />
                              <span>{b.eligibility || "Eligible Dependant"}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Emergency Note */}
              {data.emergencyNote && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-950">
                  <HeartPulse className="size-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{data.emergencyNote}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                >
                  <Printer className="size-4" />
                  <span>Print Credential Slip</span>
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/hospitals"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600"
                  >
                    <span>View Hospital Desks</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <span>Contact Focal Person</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function VerifyQrPage({ params }: { params: Promise<{ qr: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="size-10 animate-spin rounded-full border-3 border-emerald-800 border-t-transparent mx-auto" />
          <p className="mt-3 text-xs text-slate-500 font-medium">Loading verification data...</p>
        </main>
      }
    >
      <VerifyQrInner params={params} />
    </Suspense>
  );
}

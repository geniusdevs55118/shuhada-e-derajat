/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, use, useEffect, useState } from "react";

function VerifyQrInner({ params }: { params: Promise<{ qr: string }> }) {
  const { qr } = use(params);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/verify/${encodeURIComponent(qr)}`)
      .then(async (res) => {
        const d = await res.json();
        if (res.ok) setData(d);
        else setError(d.error || "Verification failed");
      })
      .catch(() => setError("Network error"));
  }, [qr]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-blue-900">Health Card Verification</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
      {!data && !error && <p className="mt-4 text-gray-500">Verifying...</p>}
      {data && data.valid === false && (
        <p className="mt-4 rounded-lg bg-amber-50 p-4 text-amber-800">{data.message}</p>
      )}
      {data && data.valid && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Initiative</p>
            <p className="font-semibold">Derajat Shuhada Family Healthcare Initiative</p>
            <p className="text-sm text-gray-500 mt-2">Hospital</p>
            <p className="font-semibold">Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan</p>
            <p className="text-sm text-gray-500 mt-2">Card Status</p>
            <p><span className={`rounded px-2 py-0.5 text-xs ${data.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{data.status}</span></p>
            <p className="text-sm text-gray-500 mt-2">Card Number</p>
            <p className="font-semibold">{data.cardNo}</p>
            <p className="text-sm text-gray-500 mt-2">Family Registration ID</p>
            <p className="font-semibold">{data.familyRegistrationId}</p>
          </div>

          <div className="rounded-lg border bg-white p-4 text-sm"><p className="font-semibold text-blue-950">Participating hospitals</p><p className="mt-1 text-gray-700">{data.allowedHospitals?.join(", ") || "Check with a Family Health Desk."}</p></div>

          <table className="w-full text-sm rounded-xl border bg-white shadow-sm">
            <thead className="bg-blue-50 text-left text-blue-900">
              <tr><th className="p-3">Name</th><th className="p-3">Relationship</th><th className="p-3">Eligibility</th></tr>
            </thead>
            <tbody>
              {data.beneficiaries.map((b: any) => (
                <tr key={`${b.name}-${b.relationship}`} className="border-t">
                  <td className="p-3">{b.name}</td><td className="p-3">{b.relationship}</td><td className="p-3">{b.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">{data.emergencyNote}</p>
        </div>
      )}
    </main>
  );
}

export default function VerifyQrPage({ params }: { params: Promise<{ qr: string }> }) {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl px-4 py-12"><p className="text-gray-500">Loading...</p></main>}>
      <VerifyQrInner params={params} />
    </Suspense>
  );
}

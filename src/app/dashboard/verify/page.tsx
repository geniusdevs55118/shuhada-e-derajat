/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";


export default function StaffVerifyPage() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  async function search() {
    setSearched(true);
    const [c, f] = await Promise.all([
      fetch(`/api/health-cards?search=${encodeURIComponent(query)}`).then((r) => r.json()),
      fetch(`/api/families?search=${encodeURIComponent(query)}`).then((r) => r.json()),
    ]);
    setCards(c.data ?? []);
    setFamilies(f.data ?? []);
  }

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Verification</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Staff Verification Screen</h1>
          <p className="text-sm text-blue-100/80 mt-0.5">Search by Card No, Family Registration No, Shaheed Name, or CNIC.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="Card No / Reg No / CNIC" aria-label="Search by card number, registration number, or CNIC" className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm" />
        <button onClick={search} className="rounded-md bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Search</button>
      </div>
      {searched && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-white shadow-sm">
            <h2 className="p-3 font-semibold">Health Cards</h2>
            <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50 text-left text-gray-600"><tr><th className="px-3 py-2">Card No</th><th className="px-3 py-2">Registration</th><th className="px-3 py-2">Status</th></tr></thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3"><Link href={`/dashboard/health-cards/${c.id}`} className="text-blue-700 underline">{c.cardNo}</Link></td>
                    <td className="p-3">{c.familyRegistrationNo}</td>
                    <td className="p-3">{c.status}</td>
                  </tr>
                ))}
                {cards.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No matching health cards.</td></tr>}
              </tbody>
            </table>
            </div>
            <div className="divide-y md:hidden">
              {cards.map((c) => (
                <Link key={c.id} href={`/dashboard/health-cards/${c.id}`} className="block p-3 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700">
                  <span className="font-semibold text-blue-800">{c.cardNo}</span>
                  <span className="mt-1 block text-sm text-gray-700">Registration: {c.familyRegistrationNo}</span>
                  <span className="block text-xs text-gray-500">Status: {c.status}</span>
                </Link>
              ))}
              {cards.length === 0 && <p className="p-4 text-center text-sm text-gray-500">No matching health cards.</p>}
            </div>
          </div>
          <div className="rounded-xl border bg-white shadow-sm">
            <h2 className="p-3 font-semibold">Families</h2>
            <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50 text-left text-gray-600"><tr><th className="px-3 py-2">Registration</th><th className="px-3 py-2">Shaheed Name</th><th className="px-3 py-2">Verification</th></tr></thead>
              <tbody>
                {families.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="p-3"><Link href={`/dashboard/families/${f.id}`} className="text-blue-700 underline">{f.registrationNo}</Link></td>
                    <td className="p-3">{f.shaheedName}</td>
                    <td className="p-3">{f.verificationStatus ?? "—"}</td>
                  </tr>
                ))}
                {families.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No matching families.</td></tr>}
              </tbody>
            </table>
            </div>
            <div className="divide-y md:hidden">
              {families.map((f) => (
                <Link key={f.id} href={`/dashboard/families/${f.id}`} className="block p-3 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700">
                  <span className="font-semibold text-blue-800">{f.registrationNo}</span>
                  <span className="mt-1 block text-sm text-gray-700">{f.shaheedName}</span>
                  <span className="block text-xs text-gray-500">Verification: {f.verificationStatus ?? "—"}</span>
                </Link>
              ))}
              {families.length === 0 && <p className="p-4 text-center text-sm text-gray-500">No matching families.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

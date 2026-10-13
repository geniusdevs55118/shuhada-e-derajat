"use client";

import { useEffect, useState } from "react";

type Hospital = { id: number; code: string; name: string; healthDeskLocation: string | null; healthDeskContact: string | null; orientationCompleted: boolean };
type Settings = { institutionAddress: string; publicPhone: string; publicEmail: string };

export function AdminSettings() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [settings, setSettings] = useState<Settings>({ institutionAddress: "", publicPhone: "", publicEmail: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => { void fetch("/api/admin").then(async (res) => { const body = await res.json(); if (!res.ok) { setError(body.error ?? "Could not load settings"); return; } setHospitals(body.hospitals); setSettings((current) => ({ ...current, ...body.settings })); }).catch(() => setError("Could not load settings")); }, []);
  async function save(payload: Record<string, string | number | boolean>) {
    setError(""); setNotice("");
    const response = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) setError(body.error ?? "Could not save settings"); else setNotice("Saved.");
  }
  return <div className="space-y-5"><div className="dashboard-page-heading"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">System administration</p><h1 className="text-xl font-bold text-white sm:text-2xl">Administration &amp; Lookups</h1><p className="mt-1 text-sm text-blue-100/80">Manage hospital Health Desk details and public contact settings.</p></div>{error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    <section className="space-y-3 rounded-xl border bg-white p-4 shadow-sm"><h2 className="font-semibold text-blue-950">Health Desk directory</h2>{hospitals.map((hospital) => <form key={hospital.id} onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void save({ type: "hospital", id: hospital.id, name: String(form.get("name")), healthDeskLocation: String(form.get("location")), healthDeskContact: String(form.get("contact")), orientationCompleted: form.get("orientation") === "on" }); }} className="grid gap-2 border-t pt-3 md:grid-cols-5 md:items-end"><label className="text-xs text-gray-600">{hospital.code} hospital<input name="name" defaultValue={hospital.name} className="mt-1 block w-full rounded border px-2 py-2 text-sm" /></label><label className="text-xs text-gray-600">Health Desk location<input name="location" defaultValue={hospital.healthDeskLocation ?? ""} className="mt-1 block w-full rounded border px-2 py-2 text-sm" /></label><label className="text-xs text-gray-600">Contact details<input name="contact" defaultValue={hospital.healthDeskContact ?? ""} className="mt-1 block w-full rounded border px-2 py-2 text-sm" /></label><label className="flex items-center gap-2 text-sm"><input name="orientation" type="checkbox" defaultChecked={hospital.orientationCompleted} />Orientation completed</label><button className="rounded bg-blue-800 px-3 py-2 text-sm font-semibold text-white">Save hospital</button></form>)}</section>
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-1 font-semibold text-blue-950">Blank printable annexures</h2>
      <p className="mb-3 text-xs text-gray-600">Empty official forms for manual recording on paper.</p>
      <div className="flex flex-wrap gap-2">
        {[
          { form: "a", label: "Annexure-A · Family Registration" },
          { form: "b", label: "Annexure-B · Healthcare Facilitation" },
          { form: "d", label: "Annexure-D · Monthly Report" },
          { form: "e", label: "Annexure-E · Grievance & Escalation" },
        ].map((item) => (
          <a
            key={item.form}
            href={`/api/pdf?form=${item.form}`}
            target="_blank"
            className="rounded-md border border-blue-800 px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50"
          >
            {item.label}
          </a>
        ))}
      </div>
    </section>

    <section className="rounded-xl border bg-white p-4 shadow-sm"><h2 className="mb-3 font-semibold text-blue-950">Public contact details</h2><div className="grid gap-3 sm:grid-cols-3">{(["institutionAddress", "publicPhone", "publicEmail"] as const).map((key) => <form key={key} onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get("value"); void save({ type: "setting", key, value: String(value ?? "") }); }}><label className="text-xs font-medium text-gray-600">{{ institutionAddress: "Institution address", publicPhone: "Public phone", publicEmail: "Public email" }[key]}<input name="value" type={key === "publicEmail" ? "email" : "text"} defaultValue={settings[key]} className="mt-1 block w-full rounded border px-3 py-2 text-sm" /></label><button className="mt-2 rounded border px-3 py-1.5 text-xs font-medium text-blue-800">Save</button></form>)}</div><div className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm"><a href="/dashboard/users" className="text-blue-700 underline">Manage users</a><a href="/dashboard/audit-log" className="text-blue-700 underline">Review audit log</a></div></section>
  </div>;
}

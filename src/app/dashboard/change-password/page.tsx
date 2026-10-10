"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) { setError("The new passwords do not match."); return; }
    setSaving(true);
    try {
      const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const body = await response.json();
      if (!response.ok) { setError(body.error ?? "Could not update password"); return; }
      router.replace("/dashboard");
      router.refresh();
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Account security</p>
    <h1 className="mt-1 text-2xl font-bold text-blue-950">Change password</h1>
    <p className="mt-2 text-sm text-gray-600">Use at least 12 characters, including upper case, lower case, and a number.</p>
    <form onSubmit={submit} className="mt-5 space-y-4">
      <label className="block text-sm font-medium">Current password<input type="password" required autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
      <label className="block text-sm font-medium">New password<input type="password" required minLength={12} autoComplete="new-password" value={newPassword} onChange={(e) => setNext(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Confirm new password<input type="password" required minLength={12} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button disabled={saving} className="rounded-md bg-blue-800 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Update password"}</button>
    </form>
  </div>;
}

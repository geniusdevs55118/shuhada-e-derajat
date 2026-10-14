"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MISUSE_CONTROL_FLAGS, PERIODIC_REVIEW_FLAGS } from "@/lib/card-schemas";
import { extractFamilyCode } from "@/lib/family-code";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function HealthCardDetail({ card, family, role, canProposeStatus, canAuthorizeStatus, canProposeLost, canAuthorizeLost, canEditCard, canFlagMisuse }: any) {
  const [dialog, setDialog] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [statusForm, setStatusForm] = useState({ status: "", reason: "" });
  const [lostForm, setLostForm] = useState({ reason: "", issueReplacement: false });
  const [benForm, setBenForm] = useState({ beneficiaryName: "", previousStatus: "", newStatus: "", reason: "" });
  const [misuseForm, setMisuseForm] = useState({ flagType: "", remarks: "" });
  const [reviewForm, setReviewForm] = useState({ confirmations: [] as string[], nextReviewDate: "", reviewedBy: "", designation: "" });

  const familyCode = extractFamilyCode(family || { registrationNo: card.familyRegistrationNo });

  async function submit(path: string, body: unknown) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/health-cards/${card.id}/${path}`, {
        method: path === "status" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDialog(null);
      window.location.reload();
    } catch (e: any) {
      setError(e.message); setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold",
    UNDER_VERIFICATION: "bg-amber-100 text-amber-800",
    TEMPORARILY_SUSPENDED: "bg-red-100 text-red-800",
    CLOSED: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="space-y-6 protect-data">
      <div className="rounded-xl border border-emerald-800/40 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#065f46] p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber-300 text-sm">★</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Official Shuhada Health Card
              </span>
              <span className="rounded bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 text-xs font-mono tracking-wider shadow-sm">
                Family Code: #{familyCode}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{card.cardNo}</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Shaheed: <strong className="text-white">{family?.shaheedName ?? "Honoured Martyr"}</strong> · Reg: {card.familyRegistrationNo} · Logged in as {role}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm shadow-sm ${statusColors[card.status] ?? "bg-white text-slate-900"}`}>
              {card.status}
            </span>
          </div>
        </div>
      </div>

      {family && (
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-blue-900">A–C. Shaheed, Contact & Beneficiary Master List</h2>
          <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            <div><span className="text-gray-500">Shaheed: </span>{family.shaheedName}</div>
            <div><span className="text-gray-500">Rank: </span>{family.shaheedRank ?? "—"}</div>
            <div><span className="text-gray-500">Contact: </span>{family.contactName} ({family.contactRelationship})</div>
            <div><span className="text-gray-500">Mobile: </span>{family.contactMobile}</div>
          </div>
          <table className="mt-4 w-full text-sm border-t">
            <thead><tr className="text-left text-gray-500"><th className="p-2">Name</th><th className="p-2">Relationship</th><th className="p-2">Beneficiary ID</th><th className="p-2">Card Status</th></tr></thead>
            <tbody>
              {family.members.map((m: any) => (
                <tr key={m.id} className="border-t"><td className="p-2">{m.name}</td><td className="p-2">{m.relationship}</td><td className="p-2">{m.beneficiaryId ?? "—"}</td><td className="p-2">{m.cardStatus ?? "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-blue-900">D–F. Flags & Hospital Access</h2>
        <div className="mt-2 text-sm">
          <p><span className="text-gray-500">Special flags: </span>{(card.specialFlags as string[])?.join(", ") || "—"}</p>
          <p><span className="text-gray-500">Control flags: </span>{(card.controlFlags as string[])?.join(", ") || "—"}</p>
          <p><span className="text-gray-500">Hospital access: </span>{[card.accessDHQ && "DHQ", card.accessMMMTH && "MMMTH", card.accessWC && "WC"].filter(Boolean).join(", ") || "—"}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-blue-900">G–H. Update History & Lost/Damaged</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {card.updateHistory.map((h: any) => <li key={h.id}>{new Date(h.date).toLocaleDateString()} — {h.natureOfUpdate}{h.reason ? ` (${h.reason})` : ""}</li>)}
          {card.updateHistory.length === 0 && <li className="text-gray-400">No history.</li>}
        </ul>
        <ul className="mt-2 space-y-1 text-sm">
          {card.lostDamaged.map((l: any) => <li key={l.id}>Reported {new Date(l.dateReported).toLocaleDateString()}: {l.reasonRemarks}{l.replacementCardNo ? ` → ${l.replacementCardNo}` : ""}</li>)}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-blue-900">I & K. Beneficiary Status Changes & Misuse Flags</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {card.statusChanges.map((s: any) => <li key={s.id}>{s.beneficiaryName}: {s.previousStatus ?? "—"} → {s.newStatus} {s.reason ? `(${s.reason})` : ""}</li>)}
        </ul>
        <ul className="mt-2 space-y-1 text-sm">
          {card.misuseFlags.map((f: any) => <li key={f.id} className="text-red-700">{f.flagType}{f.remarks ? ` — ${f.remarks}` : ""}</li>)}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-blue-900">L & M. Periodic Review & Authorisation</h2>
        <p className="text-sm">Last review: {card.reviewRevalidationDate ? new Date(card.reviewRevalidationDate).toLocaleDateString() : "—"} · Next: {card.nextReviewDate ? new Date(card.nextReviewDate).toLocaleDateString() : "—"} · Reviewed by {card.reviewedBy ?? "—"} ({card.reviewDesignation ?? "—"})</p>
        <p className="text-sm">Authorised officer: {card.authorisedOfficer ?? "—"} ({card.authorisedDesignation ?? "—"})</p>
      </section>

      <div className="flex flex-wrap gap-2">
        <a
          href={`/api/health-cards/${card.id}/pdf`}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-800 px-3 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          Download Card PDF
        </a>
        {(canProposeStatus || canAuthorizeStatus) && <Button variant="outline" onClick={() => setDialog("status")}>Change Status</Button>}
        {(canProposeLost || canAuthorizeLost) && <Button variant="outline" onClick={() => setDialog("lost")}>Report Lost/Damaged</Button>}
        {canEditCard && <Button variant="outline" onClick={() => setDialog("beneficiary")}>Beneficiary Status</Button>}
        {canFlagMisuse && <Button variant="outline" onClick={() => setDialog("misuse")}>Misuse Flag</Button>}
        {canEditCard && <Button variant="outline" onClick={() => setDialog("review")}>Periodic Review</Button>}
      </div>

      <Dialog open={dialog === "status"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Card Status</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Select value={statusForm.status} onValueChange={(v) => setStatusForm({ ...statusForm, status: v ?? "" })}>
              <SelectTrigger><SelectValue placeholder="New status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Verification">Under Verification</SelectItem>
                <SelectItem value="Temporarily Suspended">Temporarily Suspended</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Mandatory reason" value={statusForm.reason} onChange={(e) => setStatusForm({ ...statusForm, reason: e.target.value })} />
            <Button disabled={loading} onClick={() => submit("status", statusForm)}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "lost"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report Lost/Damaged Card</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Textarea placeholder="Reason / remarks" value={lostForm.reason} onChange={(e) => setLostForm({ ...lostForm, reason: e.target.value })} />
            {canAuthorizeLost && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={lostForm.issueReplacement} onCheckedChange={(c) => setLostForm({ ...lostForm, issueReplacement: c === true })} />
                Issue authorized replacement card now
              </label>
            )}
            <Button disabled={loading} onClick={() => submit("lost-damaged", lostForm)}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "beneficiary"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Beneficiary Status Change</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Input placeholder="Beneficiary Name" value={benForm.beneficiaryName} onChange={(e) => setBenForm({ ...benForm, beneficiaryName: e.target.value })} />
            <Input placeholder="Previous Status" value={benForm.previousStatus} onChange={(e) => setBenForm({ ...benForm, previousStatus: e.target.value })} />
            <Input placeholder="New Status" value={benForm.newStatus} onChange={(e) => setBenForm({ ...benForm, newStatus: e.target.value })} />
            <Input placeholder="Reason" value={benForm.reason} onChange={(e) => setBenForm({ ...benForm, reason: e.target.value })} />
            <Button disabled={loading} onClick={() => submit("beneficiary-status", benForm)}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "misuse"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Misuse Flag</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Select value={misuseForm.flagType} onValueChange={(v) => setMisuseForm({ ...misuseForm, flagType: v ?? "" })}>
              <SelectTrigger><SelectValue placeholder="Flag type" /></SelectTrigger>
              <SelectContent>
                {MISUSE_CONTROL_FLAGS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea placeholder="Remarks" value={misuseForm.remarks} onChange={(e) => setMisuseForm({ ...misuseForm, remarks: e.target.value })} />
            <Button disabled={loading} onClick={() => submit("misuse-flags", misuseForm)}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "review"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Periodic Review</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {PERIODIC_REVIEW_FLAGS.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={reviewForm.confirmations.includes(f)}
                  onCheckedChange={(c) => setReviewForm({ ...reviewForm, confirmations: c === true ? [...reviewForm.confirmations, f] : reviewForm.confirmations.filter((x) => x !== f) })}
                />
                {f}
              </label>
            ))}
            <Label>Next Review Date</Label>
            <Input type="date" value={reviewForm.nextReviewDate} onChange={(e) => setReviewForm({ ...reviewForm, nextReviewDate: e.target.value })} />
            <Input placeholder="Reviewed By" value={reviewForm.reviewedBy} onChange={(e) => setReviewForm({ ...reviewForm, reviewedBy: e.target.value })} />
            <Input placeholder="Designation" value={reviewForm.designation} onChange={(e) => setReviewForm({ ...reviewForm, designation: e.target.value })} />
            <Button disabled={loading} onClick={() => submit("periodic-review", reviewForm)}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Member = { id: string; name: string; roleTitle: string; hospital: string };
type Term = { id: number; number: number; title: string; owner: string | null; status: string; createdAt: string };
type Minute = { id: number; meetingDate: string; title: string; attendees: string | null; decisions: string };

function deadlineFrom(start: Date) {
  const result = new Date(start);
  let weekdays = 0;
  while (weekdays < 15) { result.setDate(result.getDate() + 1); if (result.getDay() !== 0 && result.getDay() !== 6) weekdays++; }
  return result;
}

export function WorkingGroupView({ canManage }: { canManage: boolean }) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [error, setError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberHospital, setMemberHospital] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendees, setAttendees] = useState("");
  const [decisions, setDecisions] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { void fetch("/api/working-group").then(async (response) => { const body = await response.json(); if (!response.ok) { setError(body.error ?? "Could not load group data"); return; } setMembers(body.members); setTerms(body.terms); setMinutes(body.minutes); }).catch(() => setError("Could not load group data")); }, []);
  const startDate = terms.length ? new Date(Math.min(...terms.map((term) => new Date(term.createdAt).getTime()))) : new Date();
  const deadline = deadlineFrom(startDate);
  let remaining = 0;
  for (let date = new Date(); date < deadline; date.setDate(date.getDate() + 1)) if (date.getDay() !== 0 && date.getDay() !== 6) remaining++;
  const completed = terms.filter((term) => term.status === "Completed").length;

  async function save(payload: Record<string, string | number>) {
    setSaving(true); setError("");
    try { const response = await fetch("/api/working-group", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const body = await response.json(); if (!response.ok) { setError(body.error ?? "Could not save changes"); return false; } router.refresh(); const refreshed = await fetch("/api/working-group").then((res) => res.json()); setMembers(refreshed.members); setTerms(refreshed.terms); setMinutes(refreshed.minutes); return true; }
    catch { setError("Could not save changes"); return false; } finally { setSaving(false); }
  }

  return <div className="space-y-5"><div className="dashboard-page-heading"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">Governance and oversight</p><h1 className="text-xl font-bold text-white sm:text-2xl">Working Group</h1><p className="mt-1 text-sm text-blue-100/80">Members, terms of reference, meeting minutes and decisions.</p></div>
    {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-white p-4"><p className="text-xs text-gray-500">Terms completed</p><p className="text-2xl font-bold text-blue-950">{completed} / 12</p></div><div className="rounded-xl border bg-white p-4"><p className="text-xs text-gray-500">15 working-day framework</p><p className="text-2xl font-bold text-blue-950">{remaining === 0 ? "Deadline reached" : `${remaining} days left`}</p></div><div className="rounded-xl border bg-white p-4"><p className="text-xs text-gray-500">Framework deadline</p><p className="text-lg font-bold text-blue-950">{deadline.toLocaleDateString()}</p></div></div>
    <section className="rounded-xl border bg-white shadow-sm"><h2 className="border-b p-4 font-semibold">Members</h2><div className="divide-y">{members.map((member) => <div key={member.id} className="flex flex-wrap justify-between gap-2 p-3"><span className="font-medium">{member.name}</span><span className="text-sm text-gray-600">{member.roleTitle} · {member.hospital}</span></div>)}{members.length === 0 && <p className="p-4 text-sm text-gray-500">No members recorded.</p>}</div>{canManage && <form onSubmit={async (event) => { event.preventDefault(); if (await save({ type: "member", name: memberName, roleTitle: memberRole, hospital: memberHospital })) { setMemberName(""); setMemberRole(""); setMemberHospital(""); } }} className="grid gap-2 border-t p-4 sm:grid-cols-4"><input required value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Member name" className="rounded border px-3 py-2 text-sm" /><input required value={memberRole} onChange={(e) => setMemberRole(e.target.value)} placeholder="Role / title" className="rounded border px-3 py-2 text-sm" /><input value={memberHospital} onChange={(e) => setMemberHospital(e.target.value)} placeholder="Hospital (optional)" className="rounded border px-3 py-2 text-sm" /><button disabled={saving} className="rounded bg-blue-800 px-3 py-2 text-sm font-semibold text-white">Add member</button></form>}</section>
    <section className="rounded-xl border bg-white shadow-sm"><h2 className="border-b p-4 font-semibold">12 Terms of Reference</h2><div className="divide-y">{terms.map((term) => <div key={term.id} className="grid gap-2 p-3 sm:grid-cols-[2rem_1fr_12rem_10rem] sm:items-center"><span className="font-bold text-emerald-800">{String(term.number).padStart(2, "0")}</span><span className="text-sm font-medium">{term.title}</span>{canManage ? <><input aria-label={`Owner for ${term.title}`} defaultValue={term.owner ?? ""} placeholder="Owner" className="rounded border px-2 py-1.5 text-sm" /><div className="flex gap-1"><select defaultValue={term.status} aria-label={`Status for ${term.title}`} className="min-w-0 flex-1 rounded border px-2 py-1.5 text-xs" id={`status-${term.number}`}><option>Pending</option><option>In Progress</option><option>Completed</option></select><button type="button" disabled={saving} onClick={(event) => { const root = event.currentTarget.parentElement?.parentElement; const owner = root?.querySelector("input")?.value ?? ""; const status = root?.querySelector("select")?.value ?? "Pending"; void save({ type: "tor", number: term.number, owner, status }); }} className="rounded bg-blue-700 px-2 text-xs text-white">Save</button></div></> : <span className="text-xs text-gray-600">{term.owner ?? "Unassigned"} · {term.status}</span>}</div>)}</div></section>
    <section className="rounded-xl border bg-white shadow-sm"><h2 className="border-b p-4 font-semibold">Meeting minutes and decisions</h2><div className="divide-y">{minutes.map((minute) => <article key={minute.id} className="p-4"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-blue-950">{minute.title}</h3><time className="text-sm text-gray-500">{new Date(minute.meetingDate).toLocaleDateString()}</time></div>{minute.attendees && <p className="mt-1 text-xs text-gray-500">Attendees: {minute.attendees}</p>}<p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{minute.decisions}</p></article>)}{minutes.length === 0 && <p className="p-4 text-sm text-gray-500">No meeting minutes recorded.</p>}</div>{canManage && <form onSubmit={async (event) => { event.preventDefault(); if (await save({ type: "minute", meetingDate, title: meetingTitle, attendees, decisions })) { setMeetingTitle(""); setAttendees(""); setDecisions(""); } }} className="grid gap-3 border-t p-4"><h3 className="font-semibold">Add meeting record</h3><div className="grid gap-2 sm:grid-cols-2"><input type="date" required value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="rounded border px-3 py-2 text-sm" /><input required value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="Meeting title" className="rounded border px-3 py-2 text-sm" /></div><input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="Attendees (optional)" className="rounded border px-3 py-2 text-sm" /><textarea required value={decisions} onChange={(e) => setDecisions(e.target.value)} placeholder="Minutes and decisions" rows={4} className="rounded border px-3 py-2 text-sm" /><button disabled={saving} className="w-fit rounded bg-blue-800 px-3 py-2 text-sm font-semibold text-white">Save meeting record</button></form>}</section>
  </div>;
}

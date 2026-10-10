import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

export const instant = false;

export default async function MisuseQueuePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "card", "read")) redirect("/dashboard");
  const cards = await prisma.healthCard.findMany({ where: { misuseFlags: { some: {} } }, include: { misuseFlags: { orderBy: { createdAt: "desc" } } }, orderBy: { cardNo: "asc" }, take: 200 });
  return <div className="space-y-4"><div className="dashboard-page-heading"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">Card control</p><h1 className="text-xl font-bold text-white sm:text-2xl">Misuse and Duplication Queue</h1><p className="mt-1 text-sm text-blue-100/80">Review flags raised for suspected impersonation, duplicate records or documentation concerns.</p></div>
    <div className="space-y-3">{cards.map((card) => <section key={card.id} className="rounded-xl border bg-white p-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-2"><div><Link href={`/dashboard/health-cards/${card.id}`} className="font-semibold text-blue-800 underline">{card.cardNo}</Link><p className="text-sm text-gray-600">Family {card.familyRegistrationNo} · {card.status}</p></div><span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">{card.misuseFlags.length} flag(s)</span></div><ul className="mt-3 divide-y border-t">{card.misuseFlags.map((flag) => <li key={flag.id} className="py-3"><p className="font-medium text-gray-900">{flag.flagType}</p><p className="text-sm text-gray-600">{flag.remarks || "No remarks"}</p><time className="text-xs text-gray-500">{new Date(flag.createdAt).toLocaleString()}</time></li>)}</ul></section>)}{cards.length === 0 && <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-600">No misuse flags are awaiting review.</div>}</div>
  </div>;
}

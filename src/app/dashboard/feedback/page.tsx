import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";

export const instant = false;

export default async function FeedbackPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "visit", "read")) redirect("/dashboard");
  const visits = await prisma.visit.findMany({ where: { ...hospitalScope(session, "visit"), OR: [{ feedbackComments: { not: null } }, { feedbackFlags: { not: {} } }] }, orderBy: { dateTime: "desc" }, take: 300, select: { id: true, visitNo: true, dateTime: true, beneficiaryName: true, feedbackFlags: true, feedbackComments: true } });
  const metrics = new Map<string, number>();
  for (const visit of visits) for (const [key, value] of Object.entries((visit.feedbackFlags ?? {}) as Record<string, unknown>)) if (value === true) metrics.set(key, (metrics.get(key) ?? 0) + 1);
  const comments = visits.filter((visit) => visit.feedbackComments?.trim());
  return <div className="space-y-4"><div className="dashboard-page-heading"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">Annexure-B · Section L</p><h1 className="text-xl font-bold text-white sm:text-2xl">Beneficiary Feedback</h1><p className="mt-1 text-sm text-blue-100/80">Recent feedback and facilitation indicators from recorded visits.</p></div>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[...[...metrics].sort((a, b) => b[1] - a[1]).slice(0, 8)].map(([key, value]) => <div key={key} className="rounded-xl border bg-white p-4"><p className="text-2xl font-bold text-blue-900">{value}</p><p className="mt-1 text-sm text-gray-600">{key.replace(/([A-Z])/g, " $1").replaceAll("_", " ")}</p></div>)}{metrics.size === 0 && <p className="rounded-xl border bg-white p-5 text-sm text-gray-500">No feedback indicators have been recorded yet.</p>}</section>
    <section className="rounded-xl border bg-white shadow-sm"><h2 className="border-b p-4 font-semibold text-blue-950">Comments ({comments.length})</h2><div className="divide-y">{comments.map((visit) => <article key={visit.id} className="p-4"><div className="flex flex-wrap justify-between gap-2"><a href={`/dashboard/visits/${visit.id}`} className="font-semibold text-blue-800 underline">{visit.visitNo}</a><time className="text-xs text-gray-500">{new Date(visit.dateTime).toLocaleString()}</time></div><p className="mt-1 text-sm text-gray-500">{visit.beneficiaryName}</p><p className="mt-2 text-sm leading-6 text-gray-800">{visit.feedbackComments}</p></article>)}{comments.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No written feedback recorded.</p>}</div></section>
  </div>;
}

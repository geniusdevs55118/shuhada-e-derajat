import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope } from "@/lib/permissions";

export const instant = false;

export default async function VerificationQueuePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "family", "read")) redirect("/dashboard");
  const [families, visits] = await Promise.all([
    prisma.family.findMany({ where: { OR: [{ verificationStatus: null }, { verificationStatus: "PROVISIONALLY_VERIFIED" }, { verificationStatus: "ADDITIONAL_DOCUMENTATION_REQUIRED" }] }, orderBy: { dateOfRegistration: "asc" }, take: 200, select: { id: true, registrationNo: true, shaheedName: true, contactName: true, verificationStatus: true, dateOfRegistration: true } }),
    prisma.visit.findMany({ where: { ...hospitalScope(session, "visit"), verificationPending: true }, orderBy: { dateTime: "asc" }, take: 200, select: { id: true, visitNo: true, beneficiaryName: true, familyRegistrationNo: true, dateTime: true, hospitalId: true } }),
  ]);
  const hospitals = await prisma.hospital.findMany({ where: { id: { in: [...new Set(visits.map((visit) => visit.hospitalId))] } }, select: { id: true, code: true } });
  const hMap = new Map(hospitals.map((hospital) => [hospital.id, hospital.code]));
  return <div className="space-y-5"><div className="dashboard-page-heading"><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">Post-emergency and family review</p><h1 className="text-xl font-bold text-white sm:text-2xl">Verification Queue</h1><p className="mt-1 text-sm text-blue-100/80">Emergency visits remain available for immediate clinical assessment while verification is completed.</p></div>
    <section className="rounded-xl border bg-white shadow-sm"><h2 className="border-b p-4 font-semibold text-emerald-950">Family records needing review ({families.length})</h2><div className="divide-y">{families.map((family) => <Link key={family.id} href={`/dashboard/families/${family.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-emerald-50"><span><strong className="text-[#01411c]">{family.registrationNo}</strong><span className="ml-2 text-gray-600">{family.shaheedName} · {family.contactName}</span></span><span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">{family.verificationStatus ?? "Not reviewed"}</span></Link>)}{families.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No family records are waiting for review.</p>}</div></section>
    <section className="rounded-xl border bg-white shadow-sm"><h2 className="border-b p-4 font-semibold text-blue-950">Emergency visits awaiting verification ({visits.length})</h2><div className="divide-y">{visits.map((visit) => <Link key={visit.id} href={`/dashboard/visits/${visit.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-red-50"><span><strong>{visit.visitNo}</strong><span className="ml-2 text-gray-600">{visit.beneficiaryName} · {visit.familyRegistrationNo} · {hMap.get(visit.hospitalId)}</span></span><span className="text-xs text-gray-500">{new Date(visit.dateTime).toLocaleString()}</span></Link>)}{visits.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No emergency visits await verification.</p>}</div></section>
  </div>;
}

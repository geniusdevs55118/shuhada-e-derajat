import { PublicPageIntro } from "@/components/public/page-intro";
import { PublicGrievanceForm } from "@/components/public/public-grievance-form";
import {
  ShieldAlert,
  Clock,
  Lock,
  HeartPulse,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Lodge a Grievance | Shuhada-e-Derajat Healthcare Initiative",
  description:
    "Confidential grievance and feedback channel for families facing difficulties with healthcare facilitation or hospital desks.",
};

export default function PublicGrievancePage() {
  return (
    <main>
      <PublicPageIntro
        section="Confidential Support"
        title="Lodge a Grievance or Concern"
        description="Share any difficulty encountered with hospital registration, counter facilitation, medicines, or staff interaction."
        breadcrumbs={[{ label: "Grievance" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <PublicGrievanceForm />
          </div>

          {/* Right Sidebar: Timeline & Trust Information */}
          <aside className="lg:col-span-4 space-y-6">
            {/* What Happens Next Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="size-4 text-emerald-700" />
                <span>What Happens Next?</span>
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Your submission is assigned a unique reference code and immediately routed to the
                hospital Health Desk coordinator and Working Group convener.
              </p>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Immediate patient-safety concerns are escalated within hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Routine administrative issues reviewed by hospital superintendents</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Corrective operational actions tracked during monthly review</span>
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="size-4 text-emerald-700" />
                <span>Confidentiality Protected</span>
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Provide only the factual details needed to explain the issue. Grievances are treated with
                strict professional discretion and will never jeopardize future healthcare access.
              </p>
            </div>

            {/* Emergency Notice */}
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
              <h3 className="font-heading text-base font-bold flex items-center gap-2">
                <HeartPulse className="size-4 text-amber-700" />
                <span>Emergency Care Priority</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
                Grievance reviews never hold back clinical care. For life-threatening emergencies, visit the
                nearest hospital emergency room immediately.
              </p>
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 underline hover:text-amber-800"
                >
                  <PhoneCall className="size-3.5" />
                  <span>View Emergency Desk Contacts</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

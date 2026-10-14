import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  HeartPulse,
  Lock,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Award,
  Sparkles,
  PhoneCall,
} from "lucide-react";

const rationale = [
  "Dera Ismail Khan and the wider Derajat region continue to face extraordinary security pressures, and the families of Shuhada carry the continuing consequences of that sacrifice.",
  "These families should not have to face avoidable administrative difficulties when they themselves require healthcare.",
  "Hospitals cannot close, trauma care cannot be postponed and mothers, children and critically ill patients cannot wait for safer circumstances.",
  "An unrestricted financial entitlement outside applicable law and institutional rules is not intended; the Initiative works within existing rules, systems and protocols.",
  "The purpose is facilitation, not a parallel healthcare system: verify once, record securely, facilitate consistently, and never delay emergency care.",
];

const objectives = [
  "Provide duly verified and eligible families of Shuhada with a single-window, dignified, accessible and coordinated healthcare pathway.",
  "Guide families through the healthcare system through dedicated Family Health Desks, without making them navigate it alone.",
  "Ensure emergency assessment and medically necessary immediate treatment are never delayed solely for routine verification.",
  "Integrate Sehat Card Plus processing without duplicate billing, double reimbursement or overlapping claims.",
  "Protect dignity and confidentiality so families are not repeatedly asked to narrate the circumstances of Shahadat.",
  "Monitor, evaluate and continuously improve through monthly reporting, grievance redressal and corrective action.",
];

const principles = [
  "Honour the Sacrifice",
  "Respect Families",
  "Protect Dignity",
  "Facilitate Do Not Complicate",
  "Verify Once Facilitate Consistently",
  "Emergency Care First",
  "No Unnecessary Movement Between Offices",
  "Confidentiality and Privacy",
  "Monitor Evaluate and Improve",
];

const commitment = [
  "To honour their sacrifice.",
  "To respect their families.",
  "To protect their dignity.",
  "To facilitate their healthcare.",
  "To remove avoidable barriers.",
  "To stand beside them when healthcare is needed.",
];

export const metadata = {
  title: "About the Initiative | Derajat Shuhada Healthcare",
  description:
    "Learn about the mission, rationale, institutional commitments, and leadership message behind the Derajat Shuhada Family Healthcare Initiative.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PublicPageIntro
        section="The Initiative"
        title="About the Initiative"
        description="Honouring the Shuhada of Pakistan by caring for their families—with dignity, coordination and respect."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Institutional Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Award className="size-3.5 text-emerald-700" />
              <span>Sacred Institutional Trust</span>
            </div>
            <h3 className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A Dignified, Coordinated Healthcare Pathway for Families
            </h3>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              The Derajat Shuhada Family Healthcare Initiative brings together hospital teams, medical leadership,
              and welfare desks across Mufti Mehmood Memorial MTI, Dera Ismail Khan, into one unified, structured, and compassionate system.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Eligible families only verify their credentials once to receive seamless priority facilitation across DHQ Teaching Hospital,
              Mufti Mehmood Memorial Teaching Hospital, and Derajat Women & Children Hospital.
            </p>
          </div>

          <div className="relative aspect-[4/3] lg:col-span-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl">
            <Image
              src="/images/about-mission.jpg"
              alt="Healthcare team working together to support families"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="size-3" />
                Institutional Dedication
              </span>
              <p className="mt-1 font-heading text-base font-bold sm:text-lg">Dignified Compassionate Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Rationale and Justification */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-700" />
              <span>Foundational Rationale</span>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Rationale and Justification
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The ethical and administrative basis for establishing a dedicated facilitation pathway for Shuhada families.
            </p>
          </div>

          <ol className="mt-8 list-decimal space-y-4 pl-5">
            {rationale.map((r) => (
              <li
                key={r}
                className="text-sm font-medium leading-relaxed text-slate-700 pl-2 marker:text-emerald-700 marker:font-bold"
              >
                {r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 2. Objectives */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Building2 className="size-4 text-emerald-700" />
              <span>Strategic Mandate</span>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Objectives
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Concrete institutional targets to ensure seamless, respectful care across all teaching hospitals.
            </p>
          </div>

          <ol className="mt-8 list-decimal space-y-4 pl-5">
            {objectives.map((o) => (
              <li
                key={o}
                className="text-sm font-medium leading-relaxed text-slate-700 pl-2 marker:text-emerald-700 marker:font-bold"
              >
                {o}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Core Principles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/80 border border-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <HeartPulse className="size-3.5 text-emerald-400" />
              <span>Guiding Pillars</span>
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Core Principles
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Nine uncompromised values that govern every desk, clinic, ward, and facilitation interaction.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <div
                key={p}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/80 p-4 transition hover:border-emerald-500 hover:bg-slate-800"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-slate-100">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Pillars Sections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 4. Verify Once, Record Securely, Facilitate Consistently */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <FileCheck2 className="size-4 text-emerald-700" />
            <span>Process Efficiency</span>
          </div>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Verify Once, Record Securely, Facilitate Consistently
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            Once eligibility has been duly verified and recorded, the beneficiary should, as far as practicable, not be
            required to repeatedly establish the same eligibility at different service points.
          </p>
        </div>

        {/* 5. Priority with Dignity - Clinical Care with Fairness */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <HeartPulse className="size-4 text-emerald-700" />
            <span>Medical Urgency Over Preference</span>
          </div>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Priority with Dignity - Clinical Care with Fairness
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            The Initiative provides priority administrative facilitation, not inappropriate clinical preference. Triage,
            ICU beds, operating theatre access, blood products and other scarce clinical resources shall continue to be
            allocated according to medical urgency, clinical indication, professional judgment and established protocols.
          </p>
        </div>

        {/* 6. Not Privilege, Recognition with Responsibility */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Award className="size-4 text-emerald-700" />
            <span>Ethical Governance</span>
          </div>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Not Privilege, Recognition with Responsibility
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            The Initiative represents structured institutional recognition expressed through dignified healthcare
            facilitation. It acknowledges extraordinary public sacrifice while ensuring the institutional response
            remains clinically responsible, administratively transparent, financially accountable and consistent with
            applicable rules.
          </p>
        </div>

        {/* 7. Dignity, Confidentiality and Respect */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Lock className="size-4 text-emerald-700" />
            <span>Family Privacy</span>
          </div>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dignity, Confidentiality and Respect
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            Families should not ordinarily be required to repeatedly narrate the circumstances of Shahadat merely to
            obtain healthcare facilitation. Personal information, family records and medical information shall be
            handled only through authorised institutional channels. Recognition must never become intrusion.
            Facilitation must never compromise dignity.
          </p>
        </div>
      </section>

      {/* 8. Our Institutional Commitment */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-emerald-950 p-6 sm:p-12 text-white border border-emerald-900 shadow-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Award className="size-3.5 text-emerald-400" />
              <span>Our Sacred Covenant</span>
            </div>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Our Institutional Commitment
            </h2>
            <p className="mt-2 text-sm text-emerald-200">
              Every staff member, desk officer, and clinician carries this covenant forward every single day.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {commitment.map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 rounded-2xl border border-emerald-900 bg-emerald-900/60 p-4 text-sm font-medium text-emerald-100"
              >
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-900/80 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <span>View Healthcare Services</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-900/60 px-5 py-2.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-900 transition"
            >
              <PhoneCall className="size-3.5 text-emerald-400" />
              <span>Contact Hospital Desks</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Our Message */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Sparkles className="size-4 text-emerald-700" />
              <span>Words from Leadership</span>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Our Message
            </h2>
          </div>
          <blockquote className="mt-6 border-l-4 border-emerald-600 pl-4 sm:pl-6 text-sm leading-relaxed text-slate-700 sm:text-base italic">
            &ldquo;Those who stood for Pakistan must never be forgotten. Their sacrifice cannot be repaid, but it can be
            honoured. Their families cannot be relieved of the loss they carry, but they can be supported with dignity,
            compassion and respect. When those families enter our hospitals seeking healthcare, they should encounter
            an institution that recognises their sacrifice through facilitation, responsibility and care.&rdquo;
          </blockquote>
        </div>
      </section>
    </main>
  );
}

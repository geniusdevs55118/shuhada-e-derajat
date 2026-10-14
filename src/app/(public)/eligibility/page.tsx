import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  Users,
  Heart,
  Baby,
  UserCheck,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  HelpCircle,
} from "lucide-react";

const ELIGIBLE_GROUPS = [
  {
    title: "Widow or Widower",
    urdu: "بیوہ یا رنڈوا",
    desc: "Surviving spouse of the Shaheed, subject to verified civil record and official death in line of duty certification.",
    icon: Heart,
    criteria: "CNIC, Marriage Registration Certificate (Nikahnama/Nadra FRC)",
  },
  {
    title: "Dependent Parents",
    urdu: "زیر کفالت والدین",
    desc: "Mother and father of the Shaheed recorded as dependants under institutional service records.",
    icon: Users,
    criteria: "CNIC, Nadra Family Registration Certificate (FRC)",
  },
  {
    title: "Dependent Minor Children",
    urdu: "زیر کفالت کمسن بچے",
    desc: "Sons and daughters within the approved age limits recorded as eligible dependants of the Shaheed.",
    icon: Baby,
    criteria: "Nadra B-Form / Child Registration Certificate (CRC) or CNIC",
  },
  {
    title: "Unmarried Daughters",
    urdu: "غیر شادی شدہ بیٹیاں",
    desc: "Unmarried or widowed daughters whose dependency status is officially recorded by the competent authority.",
    icon: UserCheck,
    criteria: "Nadra FRC showing unmarried/dependent marital status",
  },
  {
    title: "Children with Special Needs",
    urdu: "خصوصی نگہداشت کے حامل بچے",
    desc: "Children with physical or cognitive disabilities requiring continuous medical and functional support.",
    icon: ShieldAlert,
    criteria: "Nadra Special CNIC / Disability Certificate issued by Medical Board",
  },
  {
    title: "Other Approved Dependants",
    urdu: "دیگر منظور شدہ زیر کفالت اہل خانہ",
    desc: "Other immediate family dependants formally considered and approved by the competent institutional authority.",
    icon: ShieldCheck,
    criteria: "Formal authorization and notification from competent authority",
  },
];

const REQUIRED_DOCS = [
  "Attested Copy of Official Shahadat Notification / Service Certificate",
  "NADRA Family Registration Certificate (FRC) by Birth / Marriage",
  "Computerized National Identity Cards (CNIC) of all adult dependants",
  "NADRA B-Forms / Child Registration Certificates for minor dependants",
  "Medical Board Disability Certificate (where applicable for special needs)",
  "Passport-sized recent photographs for health card issuance records",
];

export const metadata = {
  title: "Family Eligibility Guidelines | Derajat Shuhada Healthcare",
  description:
    "Review eligibility categories, required documentation, and verification criteria for families of Shuhada under the healthcare initiative.",
};

export default function EligibilityPage() {
  return (
    <main>
      <PublicPageIntro
        section="Family Support"
        title="Family Member Eligibility"
        description="Clear guidelines on eligible dependant categories, required documentation, and the official verification process."
        breadcrumbs={[{ label: "Eligibility" }]}
      />

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-700" />
              <span>Competent Authority Evaluation</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Who May Be Considered for Facilitation?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Eligibility is assessed directly from the official record and supporting civil documentation
              by the designated competent institutional authority. The portal securely records the formal
              decision; it does not arbitrarily alter entitlements.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              The categories outlined below represent authorized relationships that may be considered for
              inclusion in the Derajat Shuhada Family Health Record.
            </p>
          </div>

          {/* Right Image Card */}
          <div className="relative aspect-[4/3] lg:col-span-5 overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-950">
            <Image
              src="/images/family.jpg"
              alt="Shuhada family members being supported"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="rounded-md bg-emerald-600/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                Family Record
              </span>
              <p className="mt-1 font-heading text-lg font-bold">United in Honour and Care</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mt-16">
          <h3 className="font-heading text-2xl font-bold text-slate-900">
            Eligible Dependant Categories
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ELIGIBLE_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.title}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Eligible Category
                      </span>
                    </div>

                    <h4 className="mt-4 font-heading text-xl font-bold text-slate-900">
                      {group.title}
                    </h4>
                    <p dir="rtl" className="mt-0.5 font-serif text-xs font-semibold text-emerald-800">
                      {group.urdu}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {group.desc}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-3">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                      Required Verification Proof:
                    </span>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">
                      {group.criteria}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <FileCheck2 className="size-4 text-emerald-700" />
              <span>Verification Checklist</span>
            </div>
            <h3 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Required Documentation for Verification
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              To ensure accuracy and transparency, the following documents should be provided to the
              Family Health Desk or competent authority for registration review:
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs text-slate-800">
              {REQUIRED_DOCS.map((doc) => (
                <div
                  key={doc}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                >
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency First Callout */}
        <div className="mt-12 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <HeartPulse className="size-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">Emergency Care Is Never Delayed</h4>
              <p className="text-xs text-amber-900/90 mt-0.5">
                Pending or incomplete documentation review never delays urgent medical assessment or
                resuscitation in any hospital emergency department.
              </p>
            </div>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition shrink-0"
          >
            <span>See How It Works</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

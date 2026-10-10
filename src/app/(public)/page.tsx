import Link from "next/link";
import Image from "next/image";
import { HeroText } from "@/components/public/hero-text";

const services = [
  "Outpatient and specialist care",
  "Emergency and trauma care",
  "Laboratory and radiology",
  "Medicines and pharmacy",
  "Admission and inpatient care",
  "Procedures and surgery",
  "Maternal and child healthcare",
  "Critical care and ICU",
  "Rehabilitation and follow-up",
  "Sehat Card Plus facilitation",
  "Ambulance coordination",
  "Referral coordination",
];

const hospitals = [
  { code: "DHQ", name: "District Headquarters Teaching Hospital" },
  { code: "MMMTH", name: "Mufti Mehmood Memorial Teaching Hospital" },
  { code: "W&C", name: "Derajat Women & Children Hospital" },
];

const steps = [
  { number: "01", title: "Verify once", copy: "Eligibility is checked and recorded through the prescribed process." },
  { number: "02", title: "Coordinate care", copy: "A dedicated Health Desk helps families reach the right service." },
  { number: "03", title: "Follow through", copy: "Visits, referrals and concerns are recorded for continuity." },
];

const principles = [
  "Honour the Sacrifice", "Respect Families", "Protect Dignity", "Facilitate Do Not Complicate",
  "Verify Once Facilitate Consistently", "Emergency Care First", "No Unnecessary Movement Between Offices",
  "Confidentiality and Privacy", "Monitor Evaluate and Improve",
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="relative flex min-h-[34rem] items-center overflow-hidden bg-blue-950">
        <Image src="/images/hero-hospital.jpg" alt="Hospital providing coordinated care in Dera Ismail Khan" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-950/65 to-blue-950/25" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Mufti Mehmood Memorial Medical Teaching Institution</p>
          <div className="max-w-3xl"><HeroText inverse /></div>
          <p className="mt-8 max-w-xl border-t border-white/30 pt-4 text-sm leading-6 text-white/90">One family record. Three hospitals. Care coordinated with dignity.</p>
        </div>
      </section>

      <nav aria-label="Common tasks" className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-8 py-4 text-sm sm:px-10">
          <span className="mr-1 font-semibold text-gray-500">Explore</span>
          <Link className="font-medium text-blue-800 hover:text-blue-600" href="/verify">Verify a health card</Link>
          <Link className="font-medium text-blue-800 hover:text-blue-600" href="/hospitals">Find a hospital</Link>
          <Link className="font-medium text-blue-800 hover:text-blue-600" href="/services">View services</Link>
          <Link className="font-medium text-blue-800 hover:text-blue-600" href="/contact">Contact the initiative</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-8 py-14 sm:px-10 sm:py-18 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Why it exists</p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight text-blue-950 sm:text-4xl">
            One Family Record. Three Hospitals. One Coordinated Healthcare Pathway.
          </h2>
        </div>
        <div className="space-y-4 text-[0.98rem] leading-7 text-gray-700">
          <p>
            The Derajat Shuhada Family Healthcare Initiative supports duly verified and eligible families through a
            single, coordinated pathway across the institution&apos;s hospitals.
          </p>
          <p>
            It works with existing clinical, administrative and financial systems. Families should not have to
            repeatedly establish the same entitlement or navigate different offices alone.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 border-b border-emerald-700 pb-1 font-semibold text-emerald-800 hover:text-emerald-600">
            Read about the initiative <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-8 py-14 sm:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Hospital network</p>
              <h2 className="mt-2 font-heading text-3xl text-blue-950">Three Hospitals, One Institutional Commitment</h2>
            </div>
            <Link href="/hospitals" className="text-sm font-semibold text-blue-800 hover:text-blue-600">Hospital information →</Link>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {hospitals.map((hospital) => (
              <div key={hospital.code} className="grid gap-2 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-6">
                <span className="text-xs font-bold tracking-[0.12em] text-emerald-800">{hospital.code}</span>
                <h3 className="text-base font-semibold text-gray-900">{hospital.name}</h3>
                <span className="text-sm text-gray-500">Dera Ismail Khan</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-14 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Care coordination</p>
          <h2 className="mt-2 font-heading text-3xl text-blue-950">Scope of Healthcare Facilitation</h2>
          <p className="mt-3 leading-7 text-gray-600">
            Facilitation follows clinical need, applicable rules and service availability.
          </p>
        </div>
        <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service} className="flex items-start gap-3 border-t border-border pt-4">
              <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-emerald-800">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium text-gray-800">{["OPD and Specialist Consultation", "Emergency and Trauma Care", "Diagnostics (Lab and Radiology)", "Medicines and Pharmacy", "Inpatient Admission and Medical Treatment", "Surgical Procedures and Operation", "Maternal, Paediatric and Neonatal Care", "ICU and Critical Care", "Rehabilitation and Follow-up", "Sehat Card Plus Facilitation", "Ambulance Coordination", "Referral Facilitation"][index]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-[#d8cbb6] bg-[#f3efe7]">
        <div className="mx-auto grid max-w-7xl gap-4 px-8 py-9 sm:px-10 md:grid-cols-[12rem_1fr] md:items-start md:gap-10">
          <h3 className="font-bold text-amber-950">Emergency care first</h3>
          <p className="max-w-4xl leading-7 text-gray-700">
            Emergency assessment and medically necessary immediate treatment must not be delayed solely because
            routine verification or documentation is incomplete. Clinical triage and established protocols continue
            to guide care.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 sm:px-10 md:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Health card</p><h2 className="mt-2 font-heading text-3xl text-blue-950">Derajat Shuhada Family Health Card</h2><p className="mt-3 leading-7 text-gray-700">The card helps authorised staff verify the family record and connect beneficiaries with services. It is for identification and facilitation, not a financial balance.</p><Link href="/how-it-works" className="mt-5 inline-block font-semibold text-blue-800 underline">How the card works</Link></div>
          <div className="relative aspect-[4/3] overflow-hidden"><Image src="/images/health-card.jpg" alt="Health card supporting family identification and healthcare facilitation" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 sm:px-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden"><Image src="/images/family.jpg" alt="Family members supported through one coordinated care pathway" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Family eligibility</p><h2 className="mt-2 font-heading text-3xl text-blue-950">Eligible Family Members</h2><p className="mt-3 leading-7 text-gray-700">The competent authority verifies eligibility using the prescribed records. Eligible members may include a widow or widower, parents, dependent children, unmarried daughters, children with disabilities and other approved dependants.</p><Link href="/eligibility" className="mt-5 inline-block font-semibold text-blue-800 underline">Read eligibility information</Link></div>
      </section>

      <section className="border-y border-border bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10"><h2 className="font-heading text-3xl text-blue-950">Our Core Principles</h2><ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{principles.map((principle, i) => <li key={principle} className="border-t py-3 text-sm font-medium text-gray-800"><span className="mr-3 text-xs font-bold text-emerald-800">{String(i + 1).padStart(2, "0")}</span>{principle}</li>)}</ul></div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-12 sm:px-10"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Support and follow-up</p><h2 className="mt-2 font-heading text-3xl text-blue-950">Grievance and Feedback</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">Raise a concern about the facilitation pathway. Immediate patient-safety issues are flagged for urgent follow-up.</p></div><Link href="/grievance" className="rounded-md bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white">Submit a grievance</Link></section>

      <section className="mx-auto max-w-7xl px-8 py-14 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">How it works</p>
            <h3 className="mt-2 font-heading text-3xl text-blue-950">A clear route through the system</h3>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className="border-t-2 border-emerald-800 pt-4">
                <span className="text-xs font-bold tracking-[0.12em] text-emerald-800">{step.number}</span>
                <h3 className="mt-2 font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-8 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 border-l-2 border-emerald-700 pl-4">
            <div>
              <h3 className="font-semibold text-blue-950">A record that supports continuity</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                Verification, hospital access and follow-up are documented through authorised institutional channels.
              </p>
            </div>
          </div>
          <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 font-semibold text-blue-800 hover:text-blue-600">
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}

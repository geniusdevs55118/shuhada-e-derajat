import { PublicPageIntro } from "@/components/public/page-intro";
import Image from "next/image";

const services = [
  { label: "OPD and Specialist Consultation", description: "General and specialist consultation, assessment and follow-up." },
  { label: "Emergency and Trauma Care", description: "Timely emergency assessment and medically necessary immediate treatment." },
  { label: "Diagnostics (Lab and Radiology)", description: "Clinically prescribed investigations, radiology and imaging available within the Institution." },
  { label: "Medicines and Pharmacy", description: "Institutionally available medicines in accordance with applicable formulary and pharmacy arrangements." },
  { label: "Inpatient Admission and Medical Treatment", description: "Facilitated admission and hospital treatment where clinically required." },
  { label: "Surgical Procedures and Operation", description: "Clinically indicated medical management, procedures and operations available within the Institution." },
  { label: "Maternal, Paediatric and Neonatal Care", description: "Through Derajat Women & Children Hospital and other relevant institutional services." },
  { label: "ICU and Critical Care", description: "ICU and related services according to clinical need, protocols and availability." },
  { label: "Rehabilitation and Follow-up", description: "Where clinically indicated and available." },
  { label: "Sehat Card Plus Facilitation", description: "Facilitated processing through the existing Sehat Card Plus mechanism, with controls against duplicate or overlapping claims." },
  { label: "Ambulance Coordination", description: "Where medically justified, operationally feasible and available." },
  { label: "Referral Facilitation", description: "Where a clinically required specialised service is not available within the Institution." },
];

export default function ServicesPage() {
  return (
    <main>
      <PublicPageIntro
        section="Care coordination"
        title="Healthcare services"
        description="Facilitation across the three hospitals, guided by clinical need, applicable rules and service availability."
      />

      <section className="relative mx-auto aspect-[16/6] max-h-[28rem] overflow-hidden bg-blue-950">
        <Image src="/images/services.jpg" alt="Hospital service team coordinating patient care" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-950/85 via-blue-950/20 to-transparent p-6 sm:p-10"><h2 className="max-w-2xl text-2xl font-bold text-white sm:text-4xl">Care coordination across the journey</h2></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-heading text-3xl text-blue-950">Scope of healthcare facilitation</h2>
        <ul className="mt-7 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, index) => (
            <li key={s.label} className="flex gap-3 border-t border-border py-5">
              <span className="mt-0.5 w-7 shrink-0 text-xs font-semibold tabular-nums text-emerald-800">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{s.label}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-[#e1d8c9] bg-[#f4f0e8]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <h2 className="font-semibold text-amber-950">Emergency Care First</h2>
          <p className="mt-2 max-w-4xl leading-7 text-gray-700">Emergency assessment and medically necessary immediate care shall not be delayed solely on account of incomplete routine administrative verification or documentation.</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="font-heading text-3xl text-blue-950">Sehat Card Plus: Integration, Not Duplication</h2>
        <p className="mt-4 text-gray-700">
          Where an eligible treatment, admission or procedure is covered under Sehat Card Plus or another applicable
          government-funded healthcare mechanism, the concerned Derajat Shuhada Family Health Desk shall facilitate
          timely processing through that mechanism in accordance with prevailing rules.
        </p>
        <p className="mt-3 text-gray-700">
          There shall be no duplicate billing, double reimbursement or overlapping claim for the same healthcare
          service. Services falling outside such financing mechanisms shall be dealt with strictly in accordance
          with the Institution&apos;s applicable administrative and financial framework.
        </p>
      </section>

      <div className="bg-slate-50 py-6">
        <p className="mx-auto max-w-4xl px-4 text-sm text-gray-600">
          All services are subject to clinical need, applicable rules and the availability of services.
        </p>
      </div>
    </main>
  );
}

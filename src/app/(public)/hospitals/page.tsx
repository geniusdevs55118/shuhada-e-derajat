import Image from "next/image";
import { PublicPageIntro } from "@/components/public/page-intro";

const servicePoints = [
  "OPD and Specialist Clinics",
  "Emergency Departments",
  "Laboratory and Diagnostic Services",
  "Radiology and Imaging",
  "Pharmacy",
  "Admission Services",
  "Medical and Surgical Services",
  "Intensive and Critical Care",
  "Maternal and Child Healthcare",
  "Rehabilitation and Follow-up",
  "Sehat Card Plus Desk",
  "Ambulance Services",
  "Referral Services",
  "Hospital Administration",
];

const hospitals = [
  {
    name: "District Headquarters Teaching Hospital",
    note: "",
    image: "/images/dhq.jpg",
  },
  {
    name: "Mufti Mehmood Memorial Teaching Hospital",
    note: "",
    image: "/images/mmtth.jpg",
  },
  {
    name: "Derajat Women & Children Hospital",
    note: "Maternal, women and child healthcare.",
    image: "/images/dwch.jpg",
  },
];

export default function HospitalsPage() {
  return (
    <main>
      <PublicPageIntro
        section="Hospital network"
        title="Three hospitals"
        description="One coordinated healthcare pathway across Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan."
      />

      <section className="relative mx-auto aspect-[16/6] max-h-[30rem] overflow-hidden bg-blue-950">
        <Image src="/images/hospitals.jpg" alt="Hospital network serving families in Dera Ismail Khan" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-950/85 via-blue-950/20 to-transparent p-6 sm:p-10"><h2 className="max-w-2xl text-2xl font-bold text-white sm:text-4xl">Three hospitals, one coordinated pathway</h2></div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <ol className="grid gap-5 border-y border-border py-5 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h, index) => (
            <li key={h.name} className="min-w-0 border border-border bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={h.image}
                  alt={`${h.name} campus`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold tracking-[0.12em] text-emerald-800">0{index + 1}</span>
                <h2 className="mt-2 text-lg font-semibold text-blue-950">{h.name}</h2>
                {h.note && <p className="mt-1 text-sm leading-6 text-gray-600">{h.note}</p>}
                <p className="mt-3 text-sm text-gray-500">Dera Ismail Khan</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-white py-12">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">A shared process</p>
          <h2 className="mt-2 font-heading text-3xl text-blue-950">One Window, One Verified Record, One Facilitation Pathway</h2>
          <p className="mt-4 text-gray-700">
            Once eligibility has been duly verified and recorded through the prescribed mechanism, the beneficiary
            should, as far as practicable, not be required to repeatedly establish the same eligibility at different
            service points. The Health Desk guides the family through the healthcare system; the family should not be
            required to navigate the system alone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-2xl font-bold text-blue-900">Service Points</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {servicePoints.map((s, index) => (
            <li key={s} className="flex items-center gap-3 border-t border-border py-3 font-medium text-gray-800">
              <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-emerald-800">{String(index + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

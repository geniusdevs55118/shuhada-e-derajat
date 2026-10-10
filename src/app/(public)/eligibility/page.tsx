import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";

const groups = [
  ["Widow or widower", "A surviving spouse, subject to the prescribed verification and eligibility process."],
  ["Parents", "Dependent parents of the Shaheed, where applicable and supported by the required records."],
  ["Dependent children", "Children recorded as eligible dependants under the applicable institutional criteria."],
  ["Unmarried daughters", "Unmarried daughters whose eligibility is confirmed by the competent authority."],
  ["Children with disabilities", "Children with disabilities, with supporting documentation where required."],
  ["Other eligible dependants", "Other dependants may be considered by the competent authority under the prescribed rules."],
];

export default function EligibilityPage() {
  return <main>
    <PublicPageIntro section="Family support" title="Eligibility" description="The Initiative records eligibility decisions made through the prescribed institutional process." />
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2">
      <div><h2 className="text-2xl font-bold text-blue-950">Who may be considered?</h2><p className="mt-3 leading-7 text-gray-700">Eligibility is assessed from the official record and supporting documents by the competent authority. The examples below describe family relationships that may be considered; they do not replace the formal decision.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">{groups.map(([title, text]) => <li key={title} className="border-t border-border py-3"><h3 className="font-semibold text-blue-900">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-600">{text}</p></li>)}</ul>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src="/images/family.jpg" alt="Family members supporting one another" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
    </section>
    <section className="bg-blue-50 px-5 py-10 text-center"><p className="mx-auto max-w-3xl text-gray-700">Routine document review never delays emergency clinical assessment. Questions about an existing decision can be raised with a Family Health Desk.</p><Link href="/how-it-works" className="mt-4 inline-block font-semibold text-blue-800 underline">See how verification works</Link></section>
  </main>;
}

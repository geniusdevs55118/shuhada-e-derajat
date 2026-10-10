import Image from "next/image";
import { PublicPageIntro } from "@/components/public/page-intro";

export default function SehatCardPlusPage() {
  return <main>
    <PublicPageIntro section="Coordinated financing" title="Sehat Card Plus" description="The Health Desk can help families navigate eligible services through the existing Sehat Card Plus process." />
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src="/images/health-card.jpg" alt="Health card used to support coordinated care" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
      <div><h2 className="text-2xl font-bold text-blue-950">Support through the existing programme</h2><p className="mt-4 leading-7 text-gray-700">Where a treatment, admission or procedure is covered under Sehat Card Plus, the Family Health Desk can facilitate processing under the programme’s current rules. Eligibility and coverage are confirmed through the programme’s authorised process.</p><ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700"><li>Coverage and approval are checked for each service.</li><li>Claims are recorded against the relevant visit to avoid duplicates.</li><li>There is no duplicate billing or overlapping claim for the same service.</li><li>Clinical decisions continue to follow medical need and professional protocols.</li></ul></div>
    </section>
  </main>;
}

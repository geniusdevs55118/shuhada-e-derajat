import { PublicPageIntro } from "@/components/public/page-intro";

const members = ["Additional Hospital Director (Convener)", "Medical Superintendents of participating hospitals", "Health Desk focal person", "Administration and Finance representative", "Sehat Card Plus representative", "Pharmacy representative", "Diagnostics and Radiology representative", "Nursing representative", "IT / MIS representative", "Other co-opted members, as needed"];
const terms = ["Review monthly hospital reports", "Monitor verification and card issuance", "Review emergency facilitation safeguards", "Track access to OPD and specialist services", "Review diagnostics and radiology coordination", "Review pharmacy availability concerns", "Monitor admission and procedure coordination", "Review Sehat Card Plus cases and duplicate claim controls", "Review ambulance and referral coordination", "Examine grievances and RED alerts", "Assign corrective actions with owners and due dates", "Record meeting decisions and follow-up"];

export default function WorkingGroupPage() {
  return <main>
    <PublicPageIntro section="Governance" title="Working Group" description="A cross-functional group that reviews service delivery, concerns and improvement actions across the hospital network." />
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2"><div><h2 className="text-xl font-bold text-blue-950">Membership</h2><ul className="mt-4 space-y-2">{members.map((item) => <li key={item} className="border-t py-3 text-sm text-gray-700">{item}</li>)}</ul></div><div><h2 className="text-xl font-bold text-blue-950">Terms of reference</h2><ol className="mt-4 space-y-2">{terms.map((item, i) => <li key={item} className="flex gap-3 border-t py-3 text-sm text-gray-700"><span className="w-6 font-semibold text-emerald-800">{i + 1}.</span>{item}</li>)}</ol></div></section>
    <p className="mx-auto max-w-6xl px-5 pb-12 text-sm text-gray-600 sm:px-8">Meeting records and action tracking are maintained through the staff portal for authorised Working Group members.</p>
  </main>;
}

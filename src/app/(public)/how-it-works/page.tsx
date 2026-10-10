import { PublicPageIntro } from "@/components/public/page-intro";
import Link from "next/link";

const steps = [
  ["01", "Submit the family record", "The Health Desk records family details and the supporting documents required for review."],
  ["02", "Competent authority verifies eligibility", "The authorised institution records the verification outcome and any further documentation needed."],
  ["03", "Receive the health card", "When approved, the family record is linked to its card and beneficiaries. The QR code contains a verification token only."],
  ["04", "Use the Health Desk pathway", "At a participating hospital, staff verify the card and help coordinate the relevant service."],
  ["05", "Raise a concern if needed", "A family can contact the Health Desk or submit a grievance for follow-up and resolution."],
];

export default function HowItWorksPage() {
  return <main>
    <PublicPageIntro section="A clear pathway" title="How it works" description="Verify once, record securely, and coordinate care across the participating hospitals." />
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><ol className="divide-y divide-border border-y">{steps.map(([n, title, text]) => <li key={n} className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr]"><span className="font-heading text-3xl font-semibold text-emerald-700">{n}</span><div><h2 className="text-xl font-semibold text-blue-950">{title}</h2><p className="mt-2 leading-7 text-gray-700">{text}</p></div></li>)}</ol>
      <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-950">Emergency care comes first. Assessment is never delayed for routine verification.</p>
      <div className="mt-6 flex flex-wrap gap-4"><Link href="/eligibility" className="font-semibold text-blue-800 underline">Eligibility information</Link><Link href="/hospitals" className="font-semibold text-blue-800 underline">Participating hospitals</Link><Link href="/grievance" className="font-semibold text-blue-800 underline">Submit a grievance</Link></div>
    </section>
  </main>;
}

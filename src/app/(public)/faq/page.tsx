import { PublicPageIntro } from "@/components/public/page-intro";

const items = [
  ["Who decides whether a family is eligible?", "Eligibility is determined by the competent authority through the prescribed institutional process. The portal records the decision; it does not make the decision."],
  ["Do I need to verify my family at every service point?", "Once eligibility is verified and recorded, the Health Desk helps staff use the same family record across participating hospitals."],
  ["What should I do in a medical emergency?", "Seek immediate clinical care. Emergency assessment is never delayed for routine card checks or paperwork."],
  ["What does the QR code contain?", "The QR code contains a card verification URL and token. It does not contain a CNIC or other personal data."],
  ["Where can the card be used?", "At the participating hospitals listed on the card, subject to applicable institutional rules and clinical protocols."],
  ["How can I raise a concern?", "Contact a Family Health Desk or use the public grievance form. Immediate patient-safety concerns are flagged for urgent follow-up."],
  ["Does the card hold money or a healthcare balance?", "No. The card is for identification and facilitation. It is not a wallet or financial balance."],
  ["How is personal information handled?", "Family records and supporting documents are available only through authorised staff channels. Sensitive documents require an authenticated, time-limited link."],
];

export default function FaqPage() {
  return <main><PublicPageIntro section="Help and guidance" title="Frequently asked questions" description="Answers about verification, cards, hospital access and support." />
    <section className="mx-auto max-w-4xl space-y-3 px-5 py-12 sm:px-8">{items.map(([question, answer]) => <details key={question} className="group rounded-lg border bg-white p-4"><summary className="cursor-pointer list-none pr-7 font-semibold text-blue-950 marker:hidden">{question}<span className="float-right text-emerald-700 group-open:rotate-45">+</span></summary><p className="mt-3 border-t pt-3 text-sm leading-6 text-gray-700">{answer}</p></details>)}</section>
  </main>;
}

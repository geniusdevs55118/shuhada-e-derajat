import { PublicPageIntro } from "@/components/public/page-intro";
import Image from "next/image";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
      <div className="mt-4 text-gray-700">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main>
      <PublicPageIntro
        section="The initiative"
        title="About the Initiative"
        description="Honouring the Shuhada by caring for their families—with dignity, coordination and respect."
      />

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 md:grid-cols-2">
        <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Our mission</p><h3 className="mt-2 text-2xl font-bold text-blue-950">A dignified, coordinated pathway for families</h3><p className="mt-3 leading-7 text-gray-700">The Initiative brings together hospital teams so eligible families can seek care with less avoidable administrative burden.</p></div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg"><Image src="/images/about-mission.jpg" alt="Healthcare team working together to support families" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
      </section>

      <Section title="Rationale and Justification">
        <ol className="list-decimal space-y-2 pl-5">
          {rationale.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </Section>

      <Section title="Objectives">
        <ol className="list-decimal space-y-2 pl-5">
          {objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ol>
      </Section>

      <section className="bg-slate-50 py-10">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-blue-900">Core Principles</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p} className="flex items-center gap-3 border-t border-border py-3 font-medium text-gray-800">
                <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-emerald-800">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section title="Verify Once, Record Securely, Facilitate Consistently">
        <p>
          Once eligibility has been duly verified and recorded, the beneficiary should, as far as practicable, not be
          required to repeatedly establish the same eligibility at different service points.
        </p>
      </Section>

      <Section title="Priority with Dignity - Clinical Care with Fairness">
        <p>
          The Initiative provides priority administrative facilitation, not inappropriate clinical preference. Triage,
          ICU beds, operating theatre access, blood products and other scarce clinical resources shall continue to be
          allocated according to medical urgency, clinical indication, professional judgment and established protocols.
        </p>
      </Section>

      <Section title="Not Privilege, Recognition with Responsibility">
        <p>
          The Initiative represents structured institutional recognition expressed through dignified healthcare
          facilitation. It acknowledges extraordinary public sacrifice while ensuring the institutional response
          remains clinically responsible, administratively transparent, financially accountable and consistent with
          applicable rules.
        </p>
      </Section>

      <Section title="Dignity, Confidentiality and Respect">
        <p>
          Families should not ordinarily be required to repeatedly narrate the circumstances of Shahadat merely to
          obtain healthcare facilitation. Personal information, family records and medical information shall be
          handled only through authorised institutional channels. Recognition must never become intrusion.
          Facilitation must never compromise dignity.
        </p>
      </Section>

      <section className="bg-blue-50 py-10">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-blue-900">Our Institutional Commitment</h2>
          <ul className="mt-4 space-y-2">
            {commitment.map((c) => (
              <li key={c} className="flex items-center gap-3 border-t border-border py-2">
                <span className="h-px w-6 shrink-0 bg-emerald-700" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section title="Our Message">
        <p>
          Those who stood for Pakistan must never be forgotten. Their sacrifice cannot be repaid, but it can be
          honoured. Their families cannot be relieved of the loss they carry, but they can be supported with dignity,
          compassion and respect. When those families enter our hospitals seeking healthcare, they should encounter
          an institution that recognises their sacrifice through facilitation, responsibility and care.
        </p>
      </Section>
    </main>
  );
}

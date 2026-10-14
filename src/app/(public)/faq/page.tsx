"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  HeartPulse,
  PhoneCall,
  ArrowRight,
  MessageSquareWarning,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Who determines whether a family is eligible for facilitation?",
    a: "Eligibility is assessed directly from official service records and NADRA civil documentation by the designated competent institutional authority. The portal records the formal decision; it does not independently grant or revoke entitlements.",
    cat: "Eligibility",
  },
  {
    q: "Do I need to verify my family at every single hospital service point?",
    a: "No. Once your eligibility is verified and recorded into the portal, the Family Health Desk assists staff in using that single unified family record across all three participating hospitals (DHQ, MMMTH, DWCH). You do not need to repeat verification at each counter.",
    cat: "Hospital Access",
  },
  {
    q: "What should my family do in a medical emergency?",
    a: "Proceed immediately to the nearest Emergency Department. Urgent assessment, trauma triage, and life-saving resuscitation are NEVER delayed for health card presentation or administrative paperwork. Identification can be checked later by an attendant.",
    cat: "Emergency",
  },
  {
    q: "What information is encoded within the card QR code?",
    a: "The QR code contains only an encrypted URL and verification token. It does NOT contain personal CNIC numbers, residential addresses, or medical histories, protecting the privacy and security of Shuhada families.",
    cat: "Card & Security",
  },
  {
    q: "Which hospitals can the Derajat Shuhada Health Card be used at?",
    a: "The card is valid at all three teaching hospitals of Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan: DHQ Teaching Hospital, Mufti Mehmood Memorial Hospital, and Derajat Women & Children Hospital.",
    cat: "Hospital Access",
  },
  {
    q: "Does the card hold a cash wallet or financial balance?",
    a: "No. The card is an official credential for identification, administrative priority, and healthcare coordination. It is not an ATM card or cash balance. Covered medical treatments and diagnostics are facilitated under institutional rules and Sehat Card Plus.",
    cat: "Card & Security",
  },
  {
    q: "How can I raise a concern or report an administrative hurdle?",
    a: "You can speak directly with the Family Health Desk focal person at any participating hospital, or submit a confidential grievance using our online public grievance form. Immediate patient-safety concerns are flagged immediately for clinical intervention.",
    cat: "Support & Grievances",
  },
  {
    q: "How are confidential family and medical records protected?",
    a: "Family records, medical details, and uploaded verification documents are accessible strictly through authenticated, role-based staff accounts. Document downloads require time-limited, encrypted access tokens.",
    cat: "Card & Security",
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <PublicPageIntro
        section="Help & Guidance"
        title="Frequently Asked Questions"
        description="Clear answers regarding card verification, hospital access, emergency protocols, and family support."
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. emergency, QR code, eligibility, hospitals)..."
            className="w-full rounded-2xl border border-slate-300 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-2xs"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filtered.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition focus-visible:outline-2 focus-visible:outline-emerald-800"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base font-bold text-slate-900 sm:text-lg">
                    {item.q}
                  </span>
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-emerald-100 text-emerald-800" : ""
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3 animate-in fade-in duration-200">
                    <p className="text-sm leading-relaxed text-slate-700">{item.a}</p>
                    <div className="mt-3">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                        {item.cat}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-800 text-white mx-auto shadow-sm">
            <HelpCircle className="size-6" />
          </div>
          <h3 className="mt-4 font-heading text-xl font-bold text-slate-900">
            Still Have Questions or Need Personal Assistance?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Our Family Health Desk coordinators are available on-site at DHQ, MMMTH, and DWCH to assist
            you in person or over the phone.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <PhoneCall className="size-4" />
              <span>Contact Hospital Desks</span>
            </Link>
            <Link
              href="/grievance"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <MessageSquareWarning className="size-4 text-emerald-700" />
              <span>Submit a Question or Concern</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

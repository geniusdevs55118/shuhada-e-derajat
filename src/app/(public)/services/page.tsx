"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  Stethoscope,
  HeartPulse,
  Microscope,
  Pill,
  Bed,
  Activity,
  Baby,
  ShieldAlert,
  UserCheck,
  CreditCard,
  Ambulance,
  Share2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface ServiceItem {
  id: string;
  category: "all" | "emergency" | "specialty" | "inpatient" | "diagnostics";
  number: string;
  title: string;
  urduTitle: string;
  description: string;
  details: string[];
  hospitals: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "opd",
    category: "specialty",
    number: "01",
    title: "OPD and Specialist Consultation",
    urduTitle: "او پی ڈی اور سپیشلسٹ کنسلٹیشن",
    description: "General outpatient clinics and senior specialist medical consultation.",
    details: [
      "Access to experienced Medical Specialists, Surgeons, Paediatricians, and Gynaecologists",
      "Assisted queue scheduling via the hospital Family Health Desk",
      "Regular follow-up appointments and treatment plan monitoring",
    ],
    hospitals: "DHQ Teaching Hospital, MMMTH, Derajat Women & Children Hospital",
    icon: Stethoscope,
    badge: "Consultation & OPD",
  },
  {
    id: "emergency",
    category: "emergency",
    number: "02",
    title: "Emergency and Trauma Care",
    urduTitle: "ایمرجنسی اور ٹراما کیئر",
    description: "Immediate emergency assessment and medically necessary resuscitation.",
    details: [
      "24/7 dedicated clinical triage guided solely by medical urgency",
      "Zero delays for routine administrative verification or health card presentation",
      "Direct coordination with trauma teams, blood bank, and surgical emergency",
    ],
    hospitals: "All Three Teaching Hospitals (24/7)",
    icon: HeartPulse,
    badge: "24/7 Life Support",
  },
  {
    id: "diagnostics",
    category: "diagnostics",
    number: "03",
    title: "Diagnostics (Laboratory and Radiology)",
    urduTitle: "تشخیصی ٹیسٹ (لیب اور ریڈیالوجی)",
    description: "Clinically prescribed diagnostic investigations, radiology, and imaging.",
    details: [
      "Hematology, Biochemistry, Microbiology, and Histopathology tests",
      "Digital X-Rays, Ultrasound, Doppler, and CT Scan facilities within the MTI",
      "Timely reporting directly linked to the patient's medical file",
    ],
    hospitals: "DHQ Teaching Hospital & Mufti Mehmood Memorial Hospital",
    icon: Microscope,
    badge: "Testing & Imaging",
  },
  {
    id: "pharmacy",
    category: "diagnostics",
    number: "04",
    title: "Medicines and Pharmacy",
    urduTitle: "ادویات اور فارمیسی سہولت",
    description: "Institutionally available medicines in accordance with approved formulary.",
    details: [
      "Dispensing prescribed medications via institutional pharmacy counters",
      "Prioritized counter assistance for verified family cardholders",
      "Regular formulary review by the institutional Pharmacy Committee",
    ],
    hospitals: "All Three Teaching Hospitals",
    icon: Pill,
    badge: "Formulary Dispensary",
  },
  {
    id: "inpatient",
    category: "inpatient",
    number: "05",
    title: "Inpatient Admission and Medical Treatment",
    urduTitle: "ہسپتال میں داخلہ اور علاج",
    description: "Facilitated hospital ward admission and dedicated inpatient care.",
    details: [
      "Smooth admission procedures facilitated by the Family Health Desk",
      "Supervised inpatient medical therapy under senior clinical teams",
      "Discharge coordination and ongoing medication instructions",
    ],
    hospitals: "DHQ Teaching Hospital, MMMTH, DWCH",
    icon: Bed,
    badge: "Inpatient Care",
  },
  {
    id: "surgery",
    category: "inpatient",
    number: "06",
    title: "Surgical Procedures and Operation",
    urduTitle: "سرجری اور آپریشن کی سہولت",
    description: "Clinically indicated medical management, procedures, and surgeries.",
    details: [
      "Pre-operative assessments, anesthesia clearance, and surgical scheduling",
      "Elective and emergency operations in sanitized modern modular theatres",
      "Post-operative recovery monitoring and wound care supervision",
    ],
    hospitals: "DHQ Teaching Hospital, MMMTH, DWCH",
    icon: Activity,
    badge: "Surgical Procedures",
  },
  {
    id: "maternal",
    category: "specialty",
    number: "07",
    title: "Maternal, Paediatric and Neonatal Care",
    urduTitle: "ماں اور بچے کی صحت، این آئی سی یو",
    description: "Specialized women's health, maternity, and infant intensive care.",
    details: [
      "Antenatal checkups, safe delivery facilities, and postnatal maternity wards",
      "Dedicated Neonatal Intensive Care Unit (NICU) with incubators and phototherapy",
      "Paediatric outpatient and inpatient care for children of Shuhada",
    ],
    hospitals: "Derajat Women & Children Hospital",
    icon: Baby,
    badge: "Maternal & Child",
  },
  {
    id: "icu",
    category: "emergency",
    number: "08",
    title: "ICU and Critical Care",
    urduTitle: "آئی سی یو اور انتہائی نگہداشت",
    description: "Intensive care unit support according to clinical indication and need.",
    details: [
      "Multi-parameter vital monitoring and invasive life-support ventilators",
      "Dedicated intensivist and critical care nursing supervision round-the-clock",
      "Strict clinical criteria ensuring fairness and emergency responsiveness",
    ],
    hospitals: "DHQ Teaching Hospital & Mufti Mehmood Memorial Hospital",
    icon: ShieldAlert,
    badge: "Critical Care",
  },
  {
    id: "rehab",
    category: "specialty",
    number: "09",
    title: "Rehabilitation and Follow-up",
    urduTitle: "بحالی اور باقاعدہ فالو اپ",
    description: "Post-illness rehabilitation, physiotherapy, and continuity of care.",
    details: [
      "Physiotherapy exercises for trauma, stroke, and post-surgical recovery",
      "Structured follow-up scheduling with specialist consultants",
      "Chronic condition management counseling for long-term health",
    ],
    hospitals: "DHQ Teaching Hospital & Mufti Mehmood Memorial Hospital",
    icon: UserCheck,
    badge: "Rehabilitation",
  },
  {
    id: "sehat-card",
    category: "inpatient",
    number: "10",
    title: "Sehat Card Plus Facilitation",
    urduTitle: "صحت کارڈ پلس رجسٹریشن و سہولت",
    description: "Coordinated facilitation through prevailing Sehat Card Plus rules.",
    details: [
      "Assistance with CNIC biometric verification at the hospital Sehat desk",
      "Zero duplicate billing or overlapping claims for funded procedures",
      "Guidance for covered surgical packages, implants, and admissions",
    ],
    hospitals: "All Network Hospitals",
    icon: CreditCard,
    badge: "Healthcare Financing",
  },
  {
    id: "ambulance",
    category: "emergency",
    number: "11",
    title: "Ambulance Coordination",
    urduTitle: "ایمبولینس اور مریض کی منتقلی",
    description: "Inter-hospital ambulance transfers where operationally feasible.",
    details: [
      "Coordinated patient transfers between DHQ, MMMTH, and DWCH",
      "Oxygen and emergency resuscitation support during transit",
      "Medically justified and authorized transfers by treating consultants",
    ],
    hospitals: "Coordinated across all three hospitals",
    icon: Ambulance,
    badge: "Medical Transport",
  },
  {
    id: "referral",
    category: "specialty",
    number: "12",
    title: "Referral Facilitation",
    urduTitle: "اعلیٰ سطح پر طبی ریفرل معاونت",
    description: "Structured referral assistance when specialized care is unavailable.",
    details: [
      "Preparation of comprehensive medical case summaries and diagnostic records",
      "Guidance on government tertiary referral channels outside D.I. Khan",
      "Continuity of documentation upon patient return to local facilities",
    ],
    hospitals: "Institutional Administration & Working Group",
    icon: Share2,
    badge: "Tertiary Referral",
  },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = SERVICES.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.urduTitle.includes(searchQuery) ||
      service.hospitals.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      <PublicPageIntro
        section="Care Coordination"
        title="Healthcare Services Directory"
        description="A comprehensive scope of 12 coordinated clinical and administrative facilitation services across Mufti Mehmood Memorial MTI Dera Ismail Khan."
        breadcrumbs={[{ label: "Services" }]}
      />

      {/* Hero Visual Section */}
      <section className="relative aspect-[16/6] max-h-[24rem] overflow-hidden bg-slate-950">
        <Image
          src="/images/services.jpg"
          alt="Clinical healthcare services in Dera Ismail Khan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-10 max-w-7xl mx-auto">
          <div>
            <span className="rounded-md bg-emerald-600/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Institutional Commitment
            </span>
            <h2 className="mt-2 max-w-2xl font-heading text-2xl font-bold text-white sm:text-4xl">
              Dignified Care Guided by Clinical Need
            </h2>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All 12 Services" },
              { id: "emergency", label: "Emergency & ICU" },
              { id: "specialty", label: "Specialist & Maternity" },
              { id: "inpatient", label: "Inpatient & Surgery" },
              { id: "diagnostics", label: "Labs & Pharmacy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, labs, OPD..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Search className="mx-auto size-10 text-slate-400" />
            <p className="mt-3 font-heading text-lg font-bold text-slate-800">
              No services match your search
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search terms or select "All 12 Services".
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-emerald-800">
                        {service.number}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                        {service.badge}
                      </span>
                    </div>

                    <div className="mt-4 inline-flex rounded-xl bg-slate-50 p-3 text-emerald-800">
                      <Icon className="size-6" />
                    </div>

                    <h3 className="mt-3 font-heading text-xl font-bold text-slate-900">
                      {service.title}
                    </h3>
                    <p dir="rtl" className="mt-1 font-serif text-xs font-semibold text-emerald-800">
                      {service.urduTitle}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                      <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">
                        Key Facilitation Features:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {service.details.map((d) => (
                          <li key={d} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-3">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                      Hospital Availability:
                    </span>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">
                      {service.hospitals}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Emergency First Callout */}
      <section className="bg-amber-50 border-y border-amber-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-amber-600 p-2.5 text-white shrink-0">
              <HeartPulse className="size-6" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-950">
                Emergency Care First
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-amber-900/90 leading-relaxed max-w-3xl">
                Emergency assessment and medically necessary immediate care shall never be delayed solely
                on account of incomplete routine administrative verification or missing documents.
              </p>
            </div>
          </div>
          <Link
            href="/hospitals"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition shrink-0"
          >
            <span>Emergency Desks</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Sehat Card Plus Integration Info */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CreditCard className="size-3.5 text-emerald-700" />
              <span>Integrated Financing</span>
            </div>
            <h2 className="mt-3 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              Sehat Card Plus: Integration, Not Duplication
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Where an eligible admission or surgical procedure is covered under Sehat Card Plus, the
              Family Health Desk facilitates processing through that mechanism under prevailing government
              regulations. There is strictly no duplicate billing or overlapping claims. Services outside
              this scope are managed under the MTI&apos;s institutional support framework.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/sehat-card-plus"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <span>Read Sehat Card Guidelines</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Contact Hospital Health Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-6 border-t border-slate-200">
        <p className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
          All services are subject to clinical need, applicable rules and the availability of services.
        </p>
      </div>
    </main>
  );
}

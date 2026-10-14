"use client";

import { useState, useRef } from "react";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ServiceItem {
  id: string;
  category: "all" | "emergency" | "specialty" | "inpatient" | "diagnostics";
  number: string;
  title: string;
  urduTitle: string;
  description: string;
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
    urduTitle: "ماہرین کی او پی ڈی و طبی مشورہ",
    description:
      "Priority assistance for specialist clinics, senior consultant reviews, scheduled follow-ups, and diagnostic booking.",
    hospitals: "DHQ, MMMTH, DWCH",
    icon: Stethoscope,
    badge: "Routine & Specialty",
  },
  {
    id: "emergency",
    category: "emergency",
    number: "02",
    title: "Emergency and Trauma Care",
    urduTitle: "ایمرجنسی و ٹراما کیئر",
    description:
      "Immediate clinical assessment and resuscitation. Routine documentation is never allowed to delay urgent care.",
    hospitals: "DHQ, MMMTH, DWCH (24/7)",
    icon: HeartPulse,
    badge: "24/7 Life Support",
  },
  {
    id: "diagnostics",
    category: "diagnostics",
    number: "03",
    title: "Diagnostics (Lab and Radiology)",
    urduTitle: "لیبارٹری و ریڈیالوجی ٹیسٹ",
    description:
      "Clinically prescribed blood investigations, histopathology, ultrasound, X-rays, and advanced institutional imaging.",
    hospitals: "DHQ, MMMTH",
    icon: Microscope,
    badge: "Essential Testing",
  },
  {
    id: "pharmacy",
    category: "diagnostics",
    number: "04",
    title: "Medicines and Pharmacy",
    urduTitle: "مفت ضروری ادویات و فارمیسی",
    description:
      "Dispensing institutionally available formulary medications through dedicated hospital pharmacy facilitation counters.",
    hospitals: "DHQ, MMMTH, DWCH",
    icon: Pill,
    badge: "Pharmacy Formulary",
  },
  {
    id: "inpatient",
    category: "inpatient",
    number: "05",
    title: "Inpatient Admission and Medical Treatment",
    urduTitle: "ہسپتال میں داخلہ اور نگہداشت",
    description:
      "Facilitated bed allocation, inpatient ward admission, continuous clinical oversight, and nursing care.",
    hospitals: "DHQ, MMMTH, DWCH",
    icon: Bed,
    badge: "Clinical Admission",
  },
  {
    id: "surgery",
    category: "inpatient",
    number: "06",
    title: "Surgical Procedures and Operation",
    urduTitle: "آپریشن و جراحی خدمات",
    description:
      "Elective and emergency surgical procedures performed by qualified consultant surgeons in state-of-the-art theatres.",
    hospitals: "DHQ, MMMTH, DWCH",
    icon: Activity,
    badge: "Surgical Suites",
  },
  {
    id: "maternal",
    category: "specialty",
    number: "07",
    title: "Maternal, Paediatric and Neonatal Care",
    urduTitle: "ماں اور بچے کی نگہداشت و این آئی سی یو",
    description:
      "Comprehensive antenatal, delivery, postnatal, nursery, and specialized paediatric clinical support.",
    hospitals: "Derajat Women & Children Hospital",
    icon: Baby,
    badge: "Maternal Care",
  },
  {
    id: "icu",
    category: "emergency",
    number: "08",
    title: "ICU and Critical Care",
    urduTitle: "انتہائی نگہداشت یونٹ (ICU)",
    description:
      "Intensive monitoring and life-support ventilators for critically unstable patients according to medical urgency.",
    hospitals: "DHQ, MMMTH",
    icon: ShieldAlert,
    badge: "Critical Care",
  },
  {
    id: "rehab",
    category: "specialty",
    number: "09",
    title: "Rehabilitation and Follow-up",
    urduTitle: "بحالی و معائنہ بعد از علاج",
    description:
      "Post-operative follow-up, physiotherapy, functional recovery guidance, and chronic disease management plans.",
    hospitals: "DHQ, MMMTH",
    icon: UserCheck,
    badge: "Rehabilitation",
  },
  {
    id: "sehat-card",
    category: "inpatient",
    number: "10",
    title: "Sehat Card Plus Facilitation",
    urduTitle: "صحت کارڈ پلس رہنمائی",
    description:
      "Cashless facilitation for eligible admissions and surgical packages with strict controls against duplicate billing.",
    hospitals: "Participating Hospital Desks",
    icon: CreditCard,
    badge: "Cashless Coverage",
  },
  {
    id: "ambulance",
    category: "emergency",
    number: "11",
    title: "Ambulance Coordination",
    urduTitle: "ایمبولینس سہولت و رابطہ",
    description:
      "Emergency inter-hospital transport and critically indicated transfers where operationally feasible.",
    hospitals: "All Network Campuses",
    icon: Ambulance,
    badge: "Emergency Transit",
  },
  {
    id: "referral",
    category: "specialty",
    number: "12",
    title: "Referral Facilitation",
    urduTitle: "اعلیٰ سطح پر ریفرل معاونت",
    description:
      "Liaison and structured referral coordination where specialized tertiary treatment is required outside the MTI.",
    hospitals: "Central Working Group Support",
    icon: Share2,
    badge: "Tertiary Referral",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Services (12)" },
  { id: "emergency", label: "Emergency & Critical" },
  { id: "specialty", label: "Specialist Care" },
  { id: "inpatient", label: "Inpatient & Surgery" },
  { id: "diagnostics", label: "Labs & Pharmacy" },
] as const;

export function ServicesSlider() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "emergency" | "specialty" | "inpatient" | "diagnostics"
  >("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filtered =
    selectedCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-700" />
              <span>Scope of Healthcare Facilitation</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Scope of Healthcare Facilitation
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Guided by clinical triage, institutional rules, and service availability across all three
              hospitals of Mufti Mehmood Memorial MTI.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-800 shadow-sm transition"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-800 shadow-sm transition"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Horizontal Slider Track */}
        <div
          ref={scrollContainerRef}
          className="mt-8 flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
        >
          {filtered.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group flex w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-emerald-800">
                      {service.number}
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/60">
                      {service.badge}
                    </span>
                  </div>

                  <div className="mt-5 inline-flex rounded-xl bg-slate-50 p-3 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-4 font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {service.title}
                  </h3>

                  <p
                    dir="rtl"
                    className="mt-1 font-serif text-xs font-semibold text-emerald-800/90"
                  >
                    {service.urduTitle}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider text-slate-500">
                    Available At:
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-slate-800">
                    {service.hospitals}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services Link */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800"
          >
            <span>Explore Comprehensive Services Guide</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const HOSPITALS = [
  {
    code: "MMMTI",
    name: "Mufti Mehmood Memorial Teaching Hospital",
    subtitle: "Premier Medical Teaching & Multi-Specialty Institute",
    categoryLabel: "Apex Medical Institute",
    logo: "/images/logo-mmmti.svg",
    image: "/images/mmtth.jpg",
    city: "Dera Ismail Khan",
    emergency: "24/7 Medical Emergency & Inpatient Services",
    healthDesk: "Central OPD Registration Concourse, Ground Floor",
    facilities: [
      "Multi-Specialty OPD & Dental Surgery",
      "Advanced Pathology & Radiology (CT/MRI)",
      "Inpatient Medical Wards & CCU",
      "Institutional Pharmacy Dispensary",
    ],
    contact: "Family Health Desk Focal: MMMTH Campus",
    link: "/hospitals#mmmth",
  },
  {
    code: "DHQ",
    name: "District Headquarters Teaching Hospital",
    subtitle: "Tertiary Trauma & Specialist Surgical Center",
    categoryLabel: "Trauma & Surgical Center",
    logo: "/images/logo-dhq.svg",
    image: "/images/dhq.jpg",
    city: "Dera Ismail Khan",
    emergency: "24/7 Trauma & Emergency Department",
    healthDesk: "Main Gate #1, Adjacent to Emergency Triage",
    facilities: [
      "Emergency & Resuscitation Center",
      "Specialist Surgery & Orthopaedics",
      "ICU & High Dependency Units",
      "24/7 Diagnostics & Blood Bank",
    ],
    contact: "Family Health Desk Focal: DHQ Campus",
    link: "/hospitals#dhq",
  },
  {
    code: "DWCH",
    name: "Derajat Women & Children Hospital",
    subtitle: "Dedicated Maternal, Neonatal & Paediatric Healthcare",
    categoryLabel: "Mother & Child Category",
    logo: "/images/logo-dwch.svg",
    image: "/images/dwch.jpg",
    city: "Dera Ismail Khan",
    emergency: "24/7 Obstetric & Paediatric Emergency",
    healthDesk: "Reception Lobby, Maternal Care Wing",
    facilities: [
      "Maternal & Antenatal Healthcare",
      "Neonatal Intensive Care Unit (NICU)",
      "Paediatric Specialized Consultations",
      "Maternity Ward & Labour Theatres",
    ],
    contact: "Family Health Desk Focal: DWCH Campus",
    link: "/hospitals#dwch",
  },
  {
    code: "DSFHI",
    name: "Shuhada-e-Derajat Healthcare Directorate",
    subtitle: "Central Shuhada Facilitation & Health Desk Authority",
    categoryLabel: "Central Shuhada Coordination",
    logo: "/images/logo-dsfhi.svg",
    image: "/images/derajat-shuhada-banner.jpg",
    city: "Dera Ismail Khan",
    emergency: "Unified Fast-Track Shuhada Pathway Across All 3 Hospitals",
    healthDesk: "Central Registry & Inter-Hospital Facilitation Cell",
    facilities: [
      "Single Verified Family Health Record",
      "Dedicated Family Health Desks & Concierge",
      "Priority Dental, Medical & Surgical Access",
      "Zero Bureaucratic Delay for Shuhada Dependants",
    ],
    contact: "Central Directorate Helpdesk: 24/7 Dedicated Line",
    link: "/about",
  },
];

export function HospitalsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((current) => (current === 0 ? HOSPITALS.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIndex((current) => (current === HOSPITALS.length - 1 ? 0 : current + 1));
  };

  return (
    <section className="bg-slate-50/70 py-16 sm:py-20 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Building2 className="size-4 text-emerald-700" />
              <span>Participating Hospital Network</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Three Hospitals, One Institutional Commitment
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Eligible families receive coordinated, priority administrative facilitation across all three
              institutions without repeating eligibility verifications.
            </p>
          </div>

          {/* Slider Controls & Directory Link */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-600 hover:text-emerald-800"
            >
              <span>Hospital Directory</span>
              <ArrowRight className="size-4" />
            </Link>

            <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={prev}
                aria-label="Previous hospital"
                className="cursor-pointer rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next hospital"
                className="cursor-pointer rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hospital Cards Grid / Slider */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOSPITALS.map((hospital, index) => {
            const isFeatured = index === activeIndex;

            return (
              <div
                key={hospital.code}
                onClick={() => setActiveIndex(index)}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 cursor-pointer ${
                  isFeatured
                    ? "border-emerald-600 ring-2 ring-emerald-600/20 shadow-lg -translate-y-1"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Hospital Photo */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Hospital Code Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#01411c]/90 px-2.5 py-1 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur-md border border-amber-400/40">
                      <ShieldCheck className="size-3.5 text-amber-300" />
                      {hospital.code}
                    </span>
                  </div>

                  {/* Hospital Dedicated Category Logo */}
                  <div className="absolute top-3 right-3 size-11 rounded-full bg-white p-1 shadow-lg border-2 border-amber-400 flex items-center justify-center">
                    <Image
                      src={hospital.logo}
                      alt={`${hospital.name} logo`}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>

                  {/* Location Pin */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <MapPin className="size-3.5 text-emerald-400" />
                    <span>{hospital.city}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1">
                    <span className="rounded bg-emerald-50 text-[#01411c] border border-emerald-200 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                      {hospital.categoryLabel}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {hospital.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    {hospital.subtitle}
                  </p>

                  {/* Emergency notice */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900 border border-emerald-200/60">
                    <Clock className="size-3.5 shrink-0 text-emerald-700" />
                    <span>{hospital.emergency}</span>
                  </div>

                  {/* Facilities list */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Key Services & Departments
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {hospital.facilities.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Shuhada Health Desk location */}
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs border border-slate-200/80">
                    <span className="font-bold text-slate-900">Family Health Desk:</span>
                    <p className="mt-0.5 text-slate-600">{hospital.healthDesk}</p>
                  </div>

                  {/* Card Footer Link */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link
                      href={hospital.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Explore Hospital Services & Facilities</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

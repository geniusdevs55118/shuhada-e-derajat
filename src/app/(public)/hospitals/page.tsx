import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  Building2,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HeartPulse,
  Award,
} from "lucide-react";

const HOSPITALS = [
  {
    code: "DHQ",
    anchor: "dhq",
    name: "District Headquarters Teaching Hospital",
    urduName: "ڈسٹرکٹ ہیڈ کوارٹرز ٹیچنگ ہسپتال، ڈیرہ اسماعیل خان",
    type: "Major Trauma, ICU & Surgical Teaching Hospital",
    image: "/images/dhq.jpg",
    city: "Dera Ismail Khan",
    emergency: "24/7 Resuscitation & Surgical Emergency Triage",
    healthDesk: "Main Gate #1 Reception, Adjacent to Emergency Ward",
    departments: [
      "Emergency & Trauma Department (24/7)",
      "General Surgery & Specialist Surgical Theatres",
      "Orthopaedics & Trauma Surgery",
      "Medical Intensive Care Unit (MICU) & CCU",
      "Diagnostic Radiology (Digital X-Ray, Ultrasound, CT)",
      "24/7 Central Blood Bank & Clinical Pathology Lab",
      "Institutional Inpatient Medical & Surgical Wards",
    ],
    deskContact: "Health Desk Focal: DHQ Administration Wing",
  },
  {
    code: "MMMTH",
    anchor: "mmmth",
    name: "Mufti Mehmood Memorial Teaching Hospital",
    urduName: "مفتی محمود میموریل ٹیچنگ ہسپتال، ڈیرہ اسماعیل خان",
    type: "Premier Tertiary Teaching & Multi-Specialty Institute",
    image: "/images/mmtth.jpg",
    city: "Dera Ismail Khan",
    emergency: "24/7 Medical Emergency & Inpatient Admissions",
    healthDesk: "Ground Floor Central OPD Concourse (Near Main Counter)",
    departments: [
      "Multi-Specialty OPD (Internal Medicine, Cardiology, Pulmonology, Urology)",
      "Advanced Histopathology, Microbiology & Hematology Labs",
      "High Dependency Unit (HDU) & Dialysis Center",
      "Institutional Pharmacy & Formulary Dispensary",
      "Physiotherapy & Physical Rehabilitation Center",
      "Sehat Card Plus Facilitation Desk",
      "Inpatient Medical Specialties & Endoscopy Suite",
    ],
    deskContact: "Health Desk Focal: Ground Floor Registration Lobby",
  },
  {
    code: "DWCH",
    anchor: "dwch",
    name: "Derajat Women & Children Hospital",
    urduName: "ڈیراجات ویمن اینڈ چلڈرن ہسپتال، ڈیرہ اسماعیل خان",
    type: "Comprehensive Maternal, Gynaecological & Paediatric Center",
    image: "/images/dwch.jpg",
    city: "Dera Ismail Khan",
    emergency: "24/7 Obstetric, Labour & Paediatric Emergency",
    healthDesk: "Main Entrance Lobby, Women & Children Wing",
    departments: [
      "24/7 Maternal Labour Room & Emergency Delivery Theatres",
      "Obstetrics & Gynaecological Specialist Clinics",
      "Neonatal Intensive Care Unit (NICU) with Incubators",
      "Paediatric Medicine & Child Immunization Center",
      "Specialized Paediatric Inpatient Ward",
      "Maternal Ultrasound & Antenatal Diagnostic Services",
      "Maternal & Child Nutritional Counseling",
    ],
    deskContact: "Health Desk Focal: DWCH Entrance Information Desk",
  },
];

const SERVICE_POINTS = [
  "OPD & Specialist Clinics",
  "Emergency & Trauma Departments (24/7)",
  "Laboratory & Diagnostic Services",
  "Radiology & Diagnostic Imaging",
  "Institutional Pharmacy & Formulary",
  "Inpatient Admission Counters",
  "Medical & Surgical Subspecialties",
  "Intensive & Critical Care Units (ICU/CCU)",
  "Maternal, Neonatal & Paediatric Services",
  "Rehabilitation & Physical Therapy",
  "Sehat Card Plus Facilitation Desks",
  "Ambulance Dispatch & Transit",
  "Tertiary Referral Liaison",
  "Hospital Administration & Medical Superintendent Offices",
];

export const metadata = {
  title: "Participating Hospitals Network | Shuhada-e-Derajat Healthcare",
  description:
    "Explore the three participating teaching hospitals of Mufti Mehmood Memorial MTI Dera Ismail Khan providing coordinated healthcare for Shuhada families.",
};

export default function HospitalsPage() {
  return (
    <main>
      <PublicPageIntro
        section="Hospital Network"
        title="Three Hospitals, One Coordinated Pathway"
        description="A unified healthcare delivery network across Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan."
        breadcrumbs={[{ label: "Hospitals" }]}
      />

      {/* Hero Photographic Banner */}
      <section className="relative aspect-[16/6] max-h-[26rem] overflow-hidden bg-slate-950">
        <Image
          src="/images/hospitals.jpg"
          alt="Hospital network serving families in Dera Ismail Khan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-10 max-w-7xl mx-auto">
          <div>
            <span className="rounded-md bg-emerald-600/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Institutional Network
            </span>
            <h2 className="mt-2 max-w-2xl font-heading text-2xl font-bold text-white sm:text-4xl">
              One Institutional Family Record Across Three Campuses
            </h2>
          </div>
        </div>
      </section>

      {/* Hospital Campus Profiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {HOSPITALS.map((hospital, idx) => (
          <div
            key={hospital.code}
            id={hospital.anchor}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="grid lg:grid-cols-12 gap-0">
              {/* Hospital Photo */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 bg-slate-950 min-h-[280px]">
                <Image
                  src={hospital.image}
                  alt={hospital.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    {hospital.code} Campus
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-semibold text-white">
                  <MapPin className="size-4 text-emerald-400" />
                  <span>{hospital.city}</span>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                      Campus 0{idx + 1}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                      Participating Hospital
                    </span>
                  </div>

                  <h3 className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                    {hospital.name}
                  </h3>
                  <p dir="rtl" className="mt-1 font-serif text-sm font-semibold text-emerald-800">
                    {hospital.urduName}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {hospital.code === "DWCH" ? "Maternal, women and child healthcare." : hospital.type}
                  </p>

                  {/* 24/7 Emergency Indicator */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-950 border border-amber-200">
                    <Clock className="size-4 text-amber-700 shrink-0" />
                    <span>{hospital.emergency}</span>
                  </div>

                  {/* Shuhada Health Desk Location */}
                  <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs border border-emerald-200">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <ShieldCheck className="size-4 text-emerald-700" />
                      <span>Dedicated Family Health Desk:</span>
                    </div>
                    <p className="mt-1 text-emerald-900 pl-6">{hospital.healthDesk}</p>
                  </div>

                  {/* Departments Checklist */}
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Key Departments & Service Points:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {hospital.departments.map((dept) => (
                        <div key={dept} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{dept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">{hospital.deskContact}</span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-600 transition"
                  >
                    <span>Contact Health Desk</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Shared Facilitation Philosophy */}
      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Award className="size-3.5 text-emerald-700" />
            <span>Single Institutional Window</span>
          </div>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-900">
            One Window, One Verified Record, One Facilitation Pathway
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Once eligibility has been verified by the competent authority and recorded into the system,
            families are not subjected to repetitive checks across different counters or hospitals. The
            Family Health Desk acts as your advocate and navigator across outpatient clinics, admissions,
            pharmacy counters, and diagnostic laboratories.
          </p>
        </div>
      </section>

      {/* 14 Core Service Points Matrix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Network Capability
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            14 Institutional Service Points Covered by the Health Desk
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Every service point is oriented toward welcoming verified beneficiaries with priority
            facilitation and respect.
          </p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_POINTS.map((point, index) => (
            <li
              key={point}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-500 transition"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-800 border border-emerald-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs font-bold text-slate-800">{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

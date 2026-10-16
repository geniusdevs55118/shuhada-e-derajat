import Image from "next/image";
import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";
import {
  Shield,
  Award,
  HeartPulse,
  Activity,
  CheckCircle2,
  Building2,
  FileText,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Heart,
  UserCheck,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Derajat Ghazis Healthcare & Recognition Guide | DPO D.I. Khan & MTI",
  description:
    "Official healthcare facilitation pathway and recognition card issuance for wounded, disabled, and blast-surviving personnel of Police, Army, FC, and Levies across DHQ Hospital, MMMTI, and DWCH in Dera Ismail Khan.",
};

const BENEFICIARY_FORCES = [
  {
    title: "Khyber Pakhtunkhwa Police",
    urdu: "خیبر پختونخوا پولیس کے غازی",
    desc: "Police officers and jawans who sustained disabling injuries, limb loss, or survived explosive blasts in counter-terror operations, ambush defense, and line-of-duty security in Derajat.",
    badge: "Police Department",
    accent: "border-emerald-600 bg-emerald-50/50",
  },
  {
    title: "Pakistan Army (Armed Forces)",
    urdu: "پاک فوج کے غازیانِ وطن",
    desc: "Valiant soldiers and officers belonging to or serving across the Derajat frontier who suffered battle injuries, amputations, or combat disabilities defending the nation.",
    badge: "Pak Army",
    accent: "border-emerald-700 bg-emerald-50/50",
  },
  {
    title: "Frontier Constabulary (FC)",
    urdu: "فرنٹیئر کانسٹیبلری (ایف سی)",
    desc: "FC personnel injured or permanently disabled during counter-insurgency operations, frontier checkpoint attacks, and emergency tactical response actions.",
    badge: "Frontier Constabulary",
    accent: "border-amber-600 bg-amber-50/50",
  },
  {
    title: "Levies Force",
    urdu: "لیویز فورس کے غازی",
    desc: "Brave Levies personnel of merged districts and border outposts who survived IED blasts or sustained severe combat injuries while securing the homeland.",
    badge: "Levies Force",
    accent: "border-teal-600 bg-teal-50/50",
  },
];

const HEALTHCARE_ENTITLEMENTS = [
  {
    title: "Specialized Derajat Ghazi Health Card",
    desc: "Tamper-evident recognition card with QR verification providing rapid hospital identification and immediate admission clearance without administrative waiting.",
    icon: Award,
  },
  {
    title: "Rehabilitation & Orthopedic Support",
    desc: "Priority access to orthopedic consultants, physiotherapy sessions, prosthetic limb facilitation, and functional assistive care for amputee veterans.",
    icon: Activity,
  },
  {
    title: "Zero-Queue Trauma & OPD Priority",
    desc: "Dedicated Hospital Facilitation Desk Officers at DHQ, MMMTI, and DWCH guide Ghazis directly to clinical consultants without general queue delays.",
    icon: Stethoscope,
  },
  {
    title: "Medicines & Diagnostic Coverage",
    desc: "Comprehensive lab investigations, CT scan / MRI radiology, and post-injury management medicines through hospital counters and Sehat Card Plus.",
    icon: HeartPulse,
  },
];

export default function GhazisGuidePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. Page Header Intro */}
      <PublicPageIntro
        section="Special Welfare & Recognition Initiative"
        title="Derajat Ghazis Healthcare & Recognition Guide"
        description="A specialized healthcare pathway and welfare card initiative established by decision of district authorities (DPO D.I. Khan & Hospital Directorate) honoring wounded, disabled, and blast-surviving personnel."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Official Poetic Couplet & Authority Decision Banner */}
        <div className="overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-[#01411c] via-[#046a38] to-[#013817] p-6 sm:p-8 text-white shadow-xl relative">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40 mb-3">
              <Star className="size-3.5 fill-amber-300 text-amber-300" />
              <span>DPO &amp; Health Directorate Mandate</span>
              <Star className="size-3.5 fill-amber-300 text-amber-300" />
            </div>

            <p dir="rtl" className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-300 leading-relaxed">
              سلام ان غازیوں کو جن کے جذبوں نے وطن سنبھالا
              <br />
              کٹا کے ہاتھ، کھو کے بازو، وفا کا دیپ جلایا
            </p>

            <p className="mt-3 text-sm sm:text-base italic font-medium text-emerald-100 max-w-2xl mx-auto">
              &ldquo;The district authorities have decided that our surviving Ghazis who endured life-altering wounds and disabilities deserve the highest level of institutional honor and streamlined medical support.&rdquo;
            </p>

            <div className="mt-5 inline-block rounded-xl bg-black/30 px-5 py-2 text-xs sm:text-sm font-semibold text-amber-200 border border-amber-400/30">
              Joint Initiative: District Police Office D.I. Khan • MMMTI Medical Teaching Institution • DHQ Hospital • DWCH Hospital
            </div>
          </div>
        </div>

        {/* 3. Visual Story & Background */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-xl border-2 border-emerald-900/20 bg-slate-950">
            <Image
              src="/images/derajat-ghazis-banner.jpg"
              alt="Official Derajat Ghazis Tribute Banner"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="rounded-full bg-[#01411c] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/30">
                Living Valor
              </span>
              <p className="mt-2 text-lg sm:text-xl font-bold leading-tight">
                Derajat Ghazis: Serving the Nation with Indomitable Courage
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Shield className="size-4 text-emerald-700" />
              <span>Policy &amp; Vision</span>
            </div>

            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              A Parallel Welfare System for Living Heroes
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
              While comprehensive portals and welfare registries exist for Shuhada (Martyrs), the authorities recognized that our <strong>Ghazis</strong>—those who lost limbs, suffered disabling blast concussions, or sustained severe gunfire injuries—face continuous, lifelong medical and physical challenges.
            </p>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
              The <strong>&ldquo;Derajat Ghazis&rdquo;</strong> program mirrors the exact respect, poetry, and dignified administrative structure created for Shuhada, ensuring that when an injured officer or soldier visits any MTI teaching hospital, they are recognized immediately and provided first-class medical facilitation.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 rounded-xl bg-[#01411c] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition"
              >
                <ShieldCheck className="size-4 text-amber-300" />
                <span>Verify Ghazi Card Online</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:border-emerald-700 transition"
              >
                <PhoneCall className="size-4 text-emerald-700" />
                <span>Health Desk Contacts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Eligible Security Forces (4 Cards) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Target Beneficiary Security Forces
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Covering personnel from all primary defense and law enforcement agencies serving in the Derajat division.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFICIARY_FORCES.map((force) => (
              <div
                key={force.title}
                className={`flex flex-col justify-between rounded-2xl border-t-4 p-5 bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition ${force.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {force.badge}
                    </span>
                    <Award className="size-4 text-amber-600" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    {force.title}
                  </h3>
                  <p dir="rtl" className="font-serif text-xs font-semibold text-emerald-800 mt-0.5">
                    {force.urdu}
                  </p>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    {force.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Key Healthcare Benefits */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Comprehensive Medical Coverage
            </span>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Ghazis Healthcare Entitlements
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Designed specifically to alleviate physical suffering and ease clinical access across the 3 network hospitals.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {HEALTHCARE_ENTITLEMENTS.map((ben) => {
              const Icon = ben.icon;
              return (
                <div key={ben.title} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{ben.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{ben.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Step-by-Step Card Issuance Pathway */}
        <div className="rounded-3xl border-2 border-emerald-800/30 bg-gradient-to-br from-emerald-950 via-[#01411c] to-emerald-950 p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wider">
              Card Issuance Pathway
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-white">
              How to Obtain the &ldquo;Derajat Ghazi Health Card&rdquo;
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100/90">
              Follow this simple 4-step process coordinated directly through your department and the Hospital Health Desk.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Official Verification",
                desc: "Medical Board / Line-of-Duty Injury certificate issued by Police, Army, FC, or Levies headquarters.",
              },
              {
                step: "02",
                title: "Help Desk Enrolment",
                desc: "Submit CNIC, service number, and disability particulars at any MTI Hospital Health Desk.",
              },
              {
                step: "03",
                title: "Card Printing",
                desc: "Issuance of the official Derajat Ghazi Health Card encoded with QR verification.",
              },
              {
                step: "04",
                title: "Instant Hospital Care",
                desc: "Present your card at DHQ, MMMTI, or DWCH for zero-delay prioritized clinical attention.",
              },
            ].map((st) => (
              <div key={st.step} className="rounded-2xl border border-emerald-700/50 bg-white/10 p-5 backdrop-blur-xs">
                <span className="font-heading text-2xl font-black text-amber-300">{st.step}</span>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-white">{st.title}</h3>
                <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-emerald-800">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-md hover:bg-amber-300 transition"
            >
              <span>Staff Login: Access Ghazi Enrolment &amp; Cards Desk</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

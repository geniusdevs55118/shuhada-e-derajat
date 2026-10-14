"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  PhoneCall,
  Mail,
  MapPin,
  ArrowRight,
  HeartPulse,
  Heart,
  ChevronRight,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const QUICK_LINKS = [
  { label: "About the Initiative", href: "/about" },
  { label: "Eligibility Guidelines", href: "/eligibility" },
  { label: "How the Pathway Works", href: "/how-it-works" },
  { label: "Healthcare Services (12)", href: "/services" },
  { label: "Sehat Card Plus Facilitation", href: "/sehat-card-plus" },
  { label: "Institutional Working Group", href: "/working-group" },
  { label: "Frequently Asked Questions", href: "/faq" },
  { label: "Lodge a Grievance", href: "/grievance" },
  { label: "Verify Health Card", href: "/verify" },
  { label: "Staff Portal Login", href: "/login" },
];

const HOSPITALS = [
  {
    name: "District Headquarters Teaching Hospital (DHQ)",
    location: "Dera Ismail Khan",
    role: "24/7 Trauma, ICU & Surgical Care",
  },
  {
    name: "Mufti Mehmood Memorial Teaching Hospital",
    location: "Dera Ismail Khan",
    role: "Specialist OPDs, Diagnostics & Pharmacy",
  },
  {
    name: "Derajat Women & Children Hospital",
    location: "Dera Ismail Khan",
    role: "Maternal Health, Neonatal ICU & Paediatrics",
  },
];

export function SiteFooter() {
  const currentYear = "2026";

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner Ribbon */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="rounded-xl bg-emerald-800 p-2 text-emerald-200">
              <HeartPulse className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Institutional Pledge
              </p>
              <p className="font-heading text-sm sm:text-base font-bold text-white">
                Their Sacrifice, Our Responsibility • ان کی قربانی، ہماری ذمہ داری
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
            >
              <ShieldCheck className="size-4" />
              <span>Verify Health Card</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-700/60 bg-emerald-900/50 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-900 transition"
            >
              <PhoneCall className="size-4 text-emerald-300" />
              <span>Contact Desks</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Institutional Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-emerald-900/80 border border-emerald-700/60 p-1.5 flex items-center justify-center">
                <Image
                  src="/images/logo.svg"
                  alt="Derajat Shuhada Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-heading text-lg font-bold text-white block leading-tight">
                  Derajat Shuhada
                </span>
                <span className="text-[0.66rem] font-bold uppercase tracking-wider text-emerald-400">
                  Family Healthcare Initiative
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {siteConfig.tagline}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">{siteConfig.institutionName}</p>
              <p>{siteConfig.institutionCity}, Khyber Pakhtunkhwa, Pakistan</p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
              Public Portal
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors"
                  >
                    <ChevronRight className="size-3 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Participating Hospitals */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
              Hospital Network
            </h3>
            <div className="mt-4 space-y-4 text-xs">
              {siteConfig.hospitals.map((h) => (
                <div key={h.name} className="border-l-2 border-emerald-700/80 pl-3">
                  <p className="font-semibold text-slate-200">{h.name}</p>
                  <p className="text-slate-400 text-[0.7rem]">{h.city || siteConfig.institutionCity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Grievance */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
              Health Desk Contact
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Family Health Desk representatives are stationed at main admission reception areas in all
              three hospitals.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mufti Mehmood Memorial MTI, Dera Ismail Khan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="size-4 text-emerald-400 shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-emerald-300 transition">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-emerald-300 transition">
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/grievance"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition"
              >
                <span>Report Care Difficulties</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar without emoji or pseudo icons */}
      <div className="border-t border-slate-900 bg-black/40 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Copyright {currentYear} {siteConfig.institutionName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Dignified healthcare facilitation for families of Shuhada</span>
            <ShieldCheck className="size-3.5 text-emerald-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

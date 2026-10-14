"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import {
  MapPin,
  PhoneCall,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  HeartPulse,
  ExternalLink,
} from "lucide-react";

type Details = {
  institutionAddress?: string;
  publicPhone?: string;
  publicEmail?: string;
  hospitals: {
    code: string;
    name: string;
    healthDeskLocation: string | null;
    healthDeskContact: string | null;
  }[];
};

export function PublicContactDetails() {
  const [data, setData] = useState<Details>({
    institutionAddress: siteConfig.address,
    publicPhone: siteConfig.phone,
    publicEmail: siteConfig.email,
    hospitals: siteConfig.hospitals.map((hospital, index) => ({
      code: ["DHQ", "MMMTH", "WC"][index],
      name: hospital.name,
      healthDeskLocation: null,
      healthDeskContact: hospital.healthDeskContact || null,
    })),
  });

  useEffect(() => {
    void fetch("/api/public/contact")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (body) {
          setData((current) => ({
            ...body.settings,
            hospitals: body.hospitals.length ? body.hospitals : current.hospitals,
          }));
        }
      })
      .catch(() => undefined);
  }, []);

  const DEFAULT_DESKS: Record<string, { location: string; hours: string; emergency: string }> = {
    DHQ: {
      location: "Main Gate #1 Reception, Adjacent to Emergency Trauma Triage",
      hours: "OPD Desk: 8:00 AM - 2:00 PM • Emergency Desk: 24/7",
      emergency: "Trauma & Emergency Line available 24/7",
    },
    MMMTH: {
      location: "Central OPD Registration Concourse, Ground Floor Lobby",
      hours: "OPD Desk: 8:00 AM - 2:00 PM • Inpatient Admissions: 24/7",
      emergency: "Medical Emergency Line available 24/7",
    },
    WC: {
      location: "Reception Lobby, Maternal & Neonatal Care Wing",
      hours: "Maternal Clinics: 8:00 AM - 2:00 PM • Labour Room: 24/7",
      emergency: "Obstetric & Paediatric Emergency 24/7",
    },
  };

  return (
    <div className="space-y-12">
      {/* Central Institutional Info Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Address */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 inline-flex">
              <MapPin className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-slate-900">
              Institutional Address
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {data.institutionAddress || siteConfig.institutionCity}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-800">
            Dera Ismail Khan, KP, Pakistan
          </div>
        </div>

        {/* Phone */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 inline-flex">
              <PhoneCall className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-slate-900">
              Official Telephone
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              For general administrative inquiries and Health Desk assistance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={`tel:${data.publicPhone || siteConfig.phone}`}
              className="text-sm font-bold text-emerald-800 hover:text-emerald-600"
            >
              {data.publicPhone || siteConfig.phone}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 inline-flex">
              <Mail className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-slate-900">
              Email Correspondence
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Official institutional correspondence and public communication.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={`mailto:${data.publicEmail || siteConfig.email}`}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-600 break-all"
            >
              {data.publicEmail || siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Hospital Health Desk Locations Grid */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <Building2 className="size-4 text-emerald-700" />
          <span>Hospital Health Desk Focal Points</span>
        </div>
        <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
          On-Site Family Health Desks at Participating Hospitals
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Trained coordinators are stationed at the main reception areas of each hospital to assist
          beneficiary families upon arrival.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {data.hospitals.map((hospital) => {
            const defaults = DEFAULT_DESKS[hospital.code] || {
              location: "Main Hospital Entrance Lobby",
              hours: "8:00 AM - 2:00 PM • 24/7 Emergency",
              emergency: "Emergency coverage 24/7",
            };

            return (
              <div
                key={hospital.code}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-950 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
                      {hospital.code}
                    </span>
                    <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">
                      Teaching Hospital
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-lg font-bold text-slate-900">
                    {hospital.name}
                  </h3>

                  <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Desk Location:</span>
                        <p className="mt-0.5 text-slate-600">
                          {hospital.healthDeskLocation || defaults.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="size-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Facilitation Timings:</span>
                        <p className="mt-0.5 text-slate-600">{defaults.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-3">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                    Focal Assistance Contact:
                  </span>
                  <p className="mt-1 text-xs font-bold text-emerald-900">
                    {hospital.healthDeskContact || "Contact details will be announced by the institution."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Assistance Notice */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-3.5">
        <HeartPulse className="size-6 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950 text-sm">Medical Emergency Guidance</h4>
          <p className="mt-1 text-xs text-amber-900/90 leading-relaxed">
            In life-threatening trauma or medical emergencies, go immediately to the nearest hospital
            emergency department. Routine documentation is never required prior to critical clinical
            assessment and life-saving care.
          </p>
        </div>
      </div>
    </div>
  );
}

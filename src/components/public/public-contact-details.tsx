"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type Details = { institutionAddress?: string; publicPhone?: string; publicEmail?: string; hospitals: { code: string; name: string; healthDeskLocation: string | null; healthDeskContact: string | null }[] };

export function PublicContactDetails() {
  const [data, setData] = useState<Details>({ institutionAddress: siteConfig.address, publicPhone: siteConfig.phone, publicEmail: siteConfig.email, hospitals: siteConfig.hospitals.map((hospital, index) => ({ code: ["DHQ", "MMMTH", "WC"][index], name: hospital.name, healthDeskLocation: null, healthDeskContact: hospital.healthDeskContact || null })) });
  useEffect(() => { void fetch("/api/public/contact").then((response) => response.ok ? response.json() : null).then((body) => { if (body) setData((current) => ({ ...body.settings, hospitals: body.hospitals.length ? body.hospitals : current.hospitals })); }).catch(() => undefined); }, []);
  const contacts = [data.institutionAddress && ["Address", data.institutionAddress], data.publicPhone && ["Phone", data.publicPhone], data.publicEmail && ["Email", data.publicEmail]].filter((item): item is [string, string] => Boolean(item));
  return <>
    {contacts.length > 0 && <dl className="mt-6 space-y-3 text-gray-700">{contacts.map(([label, value]) => <div key={label} className="border-t border-border pt-3"><dt className="font-semibold">{label}</dt><dd>{label === "Email" ? <a className="text-blue-800 underline" href={`mailto:${value}`}>{value}</a> : label === "Phone" ? <a className="text-blue-800 underline" href={`tel:${value}`}>{value}</a> : value}</dd></div>)}</dl>}
    <h3 className="mt-10 font-heading text-2xl text-blue-950">Health Desk locations</h3>
    <div className="mt-4 grid gap-x-8 md:grid-cols-3">{data.hospitals.map((hospital) => <div key={hospital.code} className="border-t border-border py-5"><h4 className="font-semibold text-gray-900">{hospital.name}</h4><p className="mt-1 text-sm text-gray-500">{hospital.healthDeskLocation || siteConfig.institutionCity}</p><p className="mt-3 text-sm leading-6 text-gray-700">{hospital.healthDeskContact || "Contact details will be announced by the institution."}</p></div>)}</div>
  </>;
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download, Eye, ShieldCheck, Printer } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function HealthCardVisual({
  card,
  family,
}: {
  card: any;
  family: any;
}) {
  const [activeSide, setActiveSide] = useState<"both" | "front" | "back">("both");

  const isGhazi =
    card?.category === "ghazi" ||
    family?.category === "ghazi" ||
    card?.cardNo?.toUpperCase().includes("GZ") ||
    card?.cardNo?.toUpperCase().includes("DG") ||
    family?.registrationNo?.toUpperCase().includes("GZ") ||
    family?.registrationNo?.toUpperCase().includes("DG") ||
    (typeof family?.specialDependencyDisability === "string" &&
      family.specialDependencyDisability.toLowerCase().includes("ghazi"));

  const photoDoc =
    family?.documents?.find(
      (d: any) =>
        d.docType === "photograph" ||
        d.docType === "Beneficiary Photographs" ||
        d.resourceType === "image" ||
        d.originalFilename?.endsWith(".jpg") ||
        d.originalFilename?.endsWith(".jpeg") ||
        d.originalFilename?.endsWith(".png")
    ) || family?.documents?.[0];

  const photoSrc = photoDoc?.secureUrl || "/images/card-photo-placeholder.png";

  const personName = family?.shaheedName || "—";
  const orgName = family?.shaheedDepartment || "Police";
  const rawServiceNo = family?.shaheedServiceNo ? String(family.shaheedServiceNo).replace(/^No\.\s*/i, "") : null;
  const cnicValue = family?.shaheedCnic || rawServiceNo || family?.shaheedBeltNo || "—";
  const districtValue = family?.shaheedPermanentDistrict || "DIKhan";

  const members: any[] = Array.isArray(family?.members) && family.members.length > 0 ? family.members : [];
  const cardMembers = members.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Visual Header / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Official PVC Health Card (Designer Spec)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSide("both")}
              className={`rounded-md px-2.5 py-1 transition ${
                activeSide === "both" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveSide("front")}
              className={`rounded-md px-2.5 py-1 transition ${
                activeSide === "front" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => setActiveSide("back")}
              className={`rounded-md px-2.5 py-1 transition ${
                activeSide === "back" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Back
            </button>
          </div>

          <a
            href={`/api/health-cards/${card.id}/pdf`}
            download
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Download className="size-3.5" />
            <span>Download PDF Card</span>
          </a>
        </div>
      </div>

      {/* Cards Display Grid */}
      <div
        className={`grid gap-6 ${
          activeSide === "both" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"
        }`}
      >
        {/* ========================================================
            CARD FRONT
           ======================================================== */}
        {(activeSide === "both" || activeSide === "front") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>Card Front (Face)</span>
              <span>ISO ID-1 / CR80</span>
            </div>

            <div className="relative aspect-[508/329] w-full rounded-2xl border-[1.5px] border-[#1a365d] shadow-lg overflow-hidden bg-white select-none">
              {/* Background guilloche security image */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('/images/card-official-bg.png')` }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between p-3.5 sm:p-4">
                {/* Header Row: KPK Logo | Center Titles & Red Pill | DHQ Logo */}
                <div className="flex items-start justify-between gap-2">
                  <div className="relative size-11 sm:size-14 shrink-0">
                    <Image
                      src="/images/card-emblem-kpk.png"
                      alt="KP Government"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center -mt-0.5">
                    <p className="font-extrabold text-[0.62rem] sm:text-xs text-[#1a365d] uppercase tracking-wide leading-tight">
                      MUFTI MEHMOOD MEMORIAL
                    </p>
                    <p className="font-extrabold text-[0.62rem] sm:text-xs text-[#1a365d] uppercase tracking-wide leading-tight">
                      MEDICAL TEACHING INSTITUTION
                    </p>
                    <p className="font-black text-[0.68rem] sm:text-sm text-slate-950 uppercase tracking-wider leading-tight">
                      DERA ISMAIL KHAN
                    </p>

                    {/* Red Pill Badge */}
                    <div className="inline-block rounded-full bg-[#c62828] px-3.5 py-0.5 mt-1 shadow-xs">
                      <span className="font-extrabold text-[0.68rem] sm:text-xs tracking-wider text-white uppercase">
                        {isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}
                      </span>
                    </div>

                    <p className="font-black text-[0.72rem] sm:text-xs text-[#1a365d] tracking-wider uppercase mt-1">
                      FAMILY HEALTH CARD
                    </p>
                    <p className="font-serif italic text-[0.55rem] sm:text-[0.65rem] text-[#c62828] font-bold">
                      {isGhazi
                        ? "“Honouring the Ghazis by Caring for Their Families”"
                        : "“Honouring the Shuhada by Caring for Their Families”"}
                    </p>
                  </div>

                  <div className="relative size-11 sm:size-14 shrink-0">
                    <Image
                      src="/images/card-emblem-dhq.png"
                      alt="DHQ Hospital Dera Ismail Khan"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Body: Left Fields | Right Photo & Director Signature */}
                <div className="flex items-end justify-between gap-3 mt-1">
                  <div className="flex-1 space-y-1.5 sm:space-y-2 text-left pb-1">
                    <div className="flex items-baseline">
                      <span className="w-28 sm:w-32 font-bold text-xs sm:text-sm text-[#1a365d] shrink-0">
                        {isGhazi ? "Name of Ghazi:" : "Name of Shaheed:"}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-950 truncate">
                        {personName}
                      </span>
                    </div>

                    <div className="flex items-baseline">
                      <span className="w-28 sm:w-32 font-bold text-xs sm:text-sm text-[#1a365d] shrink-0">
                        Organization:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {orgName}
                      </span>
                    </div>

                    <div className="flex items-baseline">
                      <span className="w-28 sm:w-32 font-bold text-xs sm:text-sm text-[#1a365d] shrink-0">
                        CNIC:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {cnicValue}
                      </span>
                    </div>

                    <div className="flex items-baseline">
                      <span className="w-28 sm:w-32 font-bold text-xs sm:text-sm text-[#1a365d] shrink-0">
                        District:
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {districtValue}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Photo & Signature */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded border border-slate-900 overflow-hidden bg-slate-100 shadow-xs">
                      <Image
                        src={photoSrc}
                        alt={personName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex flex-col items-center mt-1">
                      <div className="relative w-20 h-5 sm:w-24 sm:h-6">
                        <Image
                          src="/images/card-signature.png"
                          alt="Hospital Director Signature"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="w-24 border-b border-slate-950 mt-0.5" />
                      <span className="font-extrabold text-[0.55rem] sm:text-[0.62rem] text-slate-950 uppercase tracking-tight mt-0.5">
                        Hospital Director
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD BACK
           ======================================================== */}
        {(activeSide === "both" || activeSide === "back") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>Card Back (Beneficiaries & Terms)</span>
              <span>ISO ID-1 / CR80</span>
            </div>

            <div className="relative aspect-[508/329] w-full rounded-2xl border-[1.5px] border-[#1a365d] shadow-lg overflow-hidden bg-white select-none">
              {/* Background guilloche security image */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('/images/card-official-bg.png')` }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between p-3.5 sm:p-4">
                {/* Back Header: DHQ Emblem | Center Badges & Titles | Slogan in 4 Lines */}
                <div className="flex items-start justify-between gap-2">
                  <div className="relative size-10 sm:size-12 shrink-0">
                    <Image
                      src="/images/card-emblem-dhq.png"
                      alt="DHQ Hospital"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center -mt-0.5">
                    <div className="inline-block rounded-full bg-[#c62828] px-3 py-0.5 shadow-xs">
                      <span className="font-extrabold text-[0.62rem] sm:text-[0.68rem] tracking-wider text-white uppercase">
                        {isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}
                      </span>
                    </div>
                    <p className="font-black text-[0.68rem] sm:text-xs text-[#1a365d] tracking-wider uppercase mt-0.5">
                      FAMILY HEALTH CARD
                    </p>
                    <p className="font-bold text-[0.5rem] sm:text-[0.58rem] text-slate-600 tracking-wider uppercase">
                      HEALTH | SERVICE | COMPASSION
                    </p>
                    <p className="font-extrabold text-[0.5rem] sm:text-[0.58rem] text-[#1a365d] tracking-wider uppercase">
                      FOR A STRONGER PAKISTAN
                    </p>
                  </div>

                  <div className="text-right shrink-0 leading-tight">
                    <p className="font-black text-[0.58rem] sm:text-[0.7rem] text-[#c62828] uppercase tracking-tight">
                      THEIR
                    </p>
                    <p className="font-black text-[0.58rem] sm:text-[0.7rem] text-[#c62828] uppercase tracking-tight">
                      SACRIFICES
                    </p>
                    <p className="font-black text-[0.58rem] sm:text-[0.7rem] text-[#c62828] uppercase tracking-tight">
                      WILL NOT GO
                    </p>
                    <p className="font-black text-[0.58rem] sm:text-[0.7rem] text-[#c62828] uppercase tracking-tight">
                      IN VAIN
                    </p>
                  </div>
                </div>

                {/* Table: ELIGIBLE FAMILY MEMBERS */}
                <div className="my-1">
                  <div className="rounded-t bg-[#1a365d] py-1 px-2 text-center">
                    <h3 className="font-extrabold text-[0.62rem] sm:text-xs text-white uppercase tracking-wider">
                      ELIGIBLE FAMILY MEMBERS
                    </h3>
                  </div>

                  <div className="border border-[#1a365d] border-t-0 bg-white/95 rounded-b overflow-hidden">
                    <div className="grid grid-cols-12 bg-slate-100 border-b border-[#1a365d] text-[0.55rem] sm:text-[0.68rem] font-bold text-[#1a365d] text-center py-0.5">
                      <div className="col-span-5 border-r border-[#1a365d] px-1">Name</div>
                      <div className="col-span-3 border-r border-[#1a365d] px-1">Relation</div>
                      <div className="col-span-4 px-1">CNIC/B-Form No.</div>
                    </div>

                    {cardMembers.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-12 text-[0.55rem] sm:text-[0.65rem] py-0.5 items-center ${
                          idx !== cardMembers.length - 1 ? "border-b border-slate-300" : ""
                        }`}
                      >
                        <div className="col-span-5 font-bold text-slate-900 border-r border-slate-300 px-2 truncate">
                          {m?.name || "—"}
                        </div>
                        <div className="col-span-3 text-slate-700 text-center border-r border-slate-300 px-1 truncate">
                          {m?.relationship || "—"}
                        </div>
                        <div className="col-span-4 font-mono text-slate-700 text-center px-1 truncate">
                          {m?.cnicBForm || "—"}
                        </div>
                      </div>
                    ))}

                    {cardMembers.length === 0 && (
                      <div className="py-2 text-center text-xs text-slate-500 italic">
                        No additional family members registered
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Important Information & Desk Verification QR */}
                <div className="flex items-center justify-between gap-3 text-left">
                  <div className="flex-1 space-y-0.5">
                    <p className="font-black text-[0.6rem] sm:text-xs text-[#1a365d] uppercase tracking-wide">
                      IMPORTANT INFORMATION
                    </p>
                    <ul className="text-[0.5rem] sm:text-[0.6rem] text-slate-800 space-y-0.5 leading-tight list-disc list-inside">
                      <li>Valid for eligible family members as per institutional policy.</li>
                      <li>Non-transferable.</li>
                      <li>Misuse may lead to cancellation.</li>
                      <li>Report loss immediately.</li>
                    </ul>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="p-1 rounded border border-slate-300 bg-white shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `https://mtidikorg.vercel.app/verify/${card.qrDigitalVerificationId || card.cardNo}`
                        )}`}
                        alt="Scan to Verify"
                        className="size-11 sm:size-14"
                      />
                    </div>
                    <span className="font-bold text-[0.48rem] sm:text-[0.58rem] text-[#1a365d] uppercase tracking-tight mt-0.5">
                      Scan to Verify
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

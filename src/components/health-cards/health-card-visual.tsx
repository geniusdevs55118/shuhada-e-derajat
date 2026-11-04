"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, ShieldCheck } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function HealthCardVisual({
  card,
  family,
}: {
  card: any;
  family: any;
}) {
  const [activeSide, setActiveSide] = useState<"both" | "front" | "back">("both");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

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

  // Generate offline QR code data URL directly in client (fast, reliable, complies with CSP)
  useEffect(() => {
    const qrIdentifier = card?.qrDigitalVerificationId || card?.cardNo || "CARD-VERIFY";
    const siteUrl =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://mtidikorg.vercel.app";
    const verifyUrl = `${siteUrl}/verify/${encodeURIComponent(qrIdentifier)}`;

    QRCode.toDataURL(verifyUrl, { width: 180, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR generation error:", err));
  }, [card?.qrDigitalVerificationId, card?.cardNo]);

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
            CARD FRONT (Super Responsive Container Query Scaling)
           ======================================================== */}
        {(activeSide === "both" || activeSide === "front") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>Card Front (Face)</span>
              <span>ISO ID-1 / CR80</span>
            </div>

            {/* Container Query root wrapper: 100cqw = card width */}
            <div
              className="relative aspect-[508/329] w-full rounded-2xl border-[1.5px] border-[#1a365d] shadow-lg overflow-hidden bg-white select-none"
              style={{ containerType: "inline-size" }}
            >
              {/* Background guilloche security image */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('/images/card-official-bg.png')` }}
              />

              <div
                className="relative z-10 flex h-full flex-col justify-between"
                style={{ padding: "2.2cqw 3cqw" }}
              >
                {/* Header Row: KPK Logo | Center Titles & Red Pill | DHQ Logo */}
                <div className="flex items-start justify-between gap-1">
                  <div
                    className="relative shrink-0"
                    style={{ width: "10.5cqw", height: "10.5cqw" }}
                  >
                    <Image
                      src="/images/card-emblem-kpk.png"
                      alt="KP Government"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center -mt-0.5">
                    <p
                      className="font-extrabold text-[#1a365d] uppercase tracking-wide leading-tight"
                      style={{ fontSize: "2.35cqw" }}
                    >
                      MUFTI MEHMOOD MEMORIAL
                    </p>
                    <p
                      className="font-extrabold text-[#1a365d] uppercase tracking-wide leading-tight"
                      style={{ fontSize: "2.35cqw" }}
                    >
                      MEDICAL TEACHING INSTITUTION
                    </p>
                    <p
                      className="font-black text-slate-950 uppercase tracking-wider leading-tight"
                      style={{ fontSize: "2.65cqw" }}
                    >
                      DERA ISMAIL KHAN
                    </p>

                    {/* Red Pill Badge */}
                    <div
                      className="inline-block rounded-full bg-[#c62828] shadow-xs"
                      style={{
                        padding: "0.3cqw 2.4cqw",
                        marginTop: "0.5cqw",
                      }}
                    >
                      <span
                        className="font-black tracking-wider text-white uppercase block"
                        style={{ fontSize: "2.35cqw" }}
                      >
                        {isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}
                      </span>
                    </div>

                    <p
                      className="font-black text-[#1a365d] tracking-wider uppercase"
                      style={{ fontSize: "2.55cqw", marginTop: "0.4cqw" }}
                    >
                      FAMILY HEALTH CARD
                    </p>
                    <p
                      className="font-serif italic text-[#c62828] font-bold"
                      style={{ fontSize: "1.8cqw", marginTop: "0.2cqw" }}
                    >
                      {isGhazi
                        ? "“Honouring the Ghazis by Caring for Their Families”"
                        : "“Honouring the Shuhada by Caring for Their Families”"}
                    </p>
                  </div>

                  <div
                    className="relative shrink-0"
                    style={{ width: "10.5cqw", height: "10.5cqw" }}
                  >
                    <Image
                      src="/images/card-emblem-dhq.png"
                      alt="DHQ Hospital Dera Ismail Khan"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Body: Left Fields | Right Photo & Director Signature */}
                <div
                  className="flex items-end justify-between"
                  style={{ gap: "2cqw", marginTop: "0.8cqw" }}
                >
                  {/* Left Column: 4 perfectly spaced rows */}
                  <div
                    className="flex-1 flex flex-col justify-between"
                    style={{ gap: "1.2cqw", paddingBottom: "0.4cqw" }}
                  >
                    <div className="flex items-baseline">
                      <span
                        className="font-extrabold text-[#1a365d] shrink-0"
                        style={{ width: "28cqw", fontSize: "2.4cqw" }}
                      >
                        {isGhazi ? "Name of Ghazi:" : "Name of Shaheed:"}
                      </span>
                      <span
                        className="font-bold text-slate-950 truncate"
                        style={{ fontSize: "2.4cqw" }}
                      >
                        {personName}
                      </span>
                    </div>

                    <div className="flex items-baseline">
                      <span
                        className="font-extrabold text-[#1a365d] shrink-0"
                        style={{ width: "28cqw", fontSize: "2.4cqw" }}
                      >
                        Organization:
                      </span>
                      <span
                        className="font-bold text-slate-900 truncate"
                        style={{ fontSize: "2.4cqw" }}
                      >
                        {orgName}
                      </span>
                    </div>

                    <div className="flex items-baseline">
                      <span
                        className="font-extrabold text-[#1a365d] shrink-0"
                        style={{ width: "28cqw", fontSize: "2.4cqw" }}
                      >
                        CNIC:
                      </span>
                      <span
                        className="font-bold text-slate-900 truncate"
                        style={{ fontSize: "2.4cqw" }}
                      >
                        {cnicValue}
                      </span>
                    </div>

                    <div className="flex items-baseline">
                      <span
                        className="font-extrabold text-[#1a365d] shrink-0"
                        style={{ width: "28cqw", fontSize: "2.4cqw" }}
                      >
                        District:
                      </span>
                      <span
                        className="font-bold text-slate-900 truncate"
                        style={{ fontSize: "2.4cqw" }}
                      >
                        {districtValue}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Photo & Signature (Never overflows) */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="relative rounded border border-slate-900 overflow-hidden bg-slate-100 shadow-xs"
                      style={{ width: "15.5cqw", height: "19.5cqw" }}
                    >
                      <Image
                        src={photoSrc}
                        alt={personName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div
                      className="flex flex-col items-center"
                      style={{ marginTop: "0.6cqw" }}
                    >
                      <div
                        className="relative"
                        style={{ width: "16.5cqw", height: "4.2cqw" }}
                      >
                        <Image
                          src="/images/card-signature.png"
                          alt="Hospital Director Signature"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="border-b border-slate-950"
                        style={{ width: "18cqw", marginTop: "0.2cqw" }}
                      />
                      <span
                        className="font-extrabold text-slate-950 uppercase tracking-tight block"
                        style={{ fontSize: "1.6cqw", marginTop: "0.2cqw" }}
                      >
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
            CARD BACK (Super Responsive Container Query Scaling + QR)
           ======================================================== */}
        {(activeSide === "both" || activeSide === "back") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>Card Back (Beneficiaries & Terms)</span>
              <span>ISO ID-1 / CR80</span>
            </div>

            {/* Container Query root wrapper: 100cqw = card width */}
            <div
              className="relative aspect-[508/329] w-full rounded-2xl border-[1.5px] border-[#1a365d] shadow-lg overflow-hidden bg-white select-none"
              style={{ containerType: "inline-size" }}
            >
              {/* Background guilloche security image */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('/images/card-official-bg.png')` }}
              />

              <div
                className="relative z-10 flex h-full flex-col justify-between"
                style={{ padding: "2.2cqw 3cqw" }}
              >
                {/* Back Header: DHQ Emblem | Center Badges & Titles | Slogan in 4 Lines */}
                <div className="flex items-start justify-between gap-1">
                  <div
                    className="relative shrink-0"
                    style={{ width: "9.2cqw", height: "9.2cqw" }}
                  >
                    <Image
                      src="/images/card-emblem-dhq.png"
                      alt="DHQ Hospital"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center -mt-0.5">
                    <div
                      className="inline-block rounded-full bg-[#c62828] shadow-xs"
                      style={{ padding: "0.25cqw 2.2cqw" }}
                    >
                      <span
                        className="font-black tracking-wider text-white uppercase block"
                        style={{ fontSize: "2.1cqw" }}
                      >
                        {isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}
                      </span>
                    </div>
                    <p
                      className="font-black text-[#1a365d] tracking-wider uppercase"
                      style={{ fontSize: "2.35cqw", marginTop: "0.3cqw" }}
                    >
                      FAMILY HEALTH CARD
                    </p>
                    <p
                      className="font-bold text-slate-600 tracking-wider uppercase"
                      style={{ fontSize: "1.6cqw" }}
                    >
                      HEATH | SERVICE | COMPASSION
                    </p>
                    <p
                      className="font-extrabold text-[#1a365d] tracking-wider uppercase"
                      style={{ fontSize: "1.6cqw" }}
                    >
                      FOR A STRONGER PAKISTAN
                    </p>
                  </div>

                  <div className="text-right shrink-0 leading-tight">
                    <p
                      className="font-black text-[#c62828] uppercase tracking-tight"
                      style={{ fontSize: "1.9cqw" }}
                    >
                      THEIR
                    </p>
                    <p
                      className="font-black text-[#c62828] uppercase tracking-tight"
                      style={{ fontSize: "1.9cqw" }}
                    >
                      SACRIFICES
                    </p>
                    <p
                      className="font-black text-[#c62828] uppercase tracking-tight"
                      style={{ fontSize: "1.9cqw" }}
                    >
                      WILL NOT GO
                    </p>
                    <p
                      className="font-black text-[#c62828] uppercase tracking-tight"
                      style={{ fontSize: "1.9cqw" }}
                    >
                      IN VAIN
                    </p>
                  </div>
                </div>

                {/* Table: ELIGIBLE FAMILY MEMBERS */}
                <div style={{ margin: "0.8cqw 0" }}>
                  <div
                    className="rounded-t bg-[#1a365d] text-center"
                    style={{ padding: "0.5cqw 1cqw" }}
                  >
                    <h3
                      className="font-extrabold text-white uppercase tracking-wider"
                      style={{ fontSize: "2.1cqw" }}
                    >
                      ELIGIBLE FAMILY MEMBERS
                    </h3>
                  </div>

                  <div className="border border-[#1a365d] border-t-0 bg-white/95 rounded-b overflow-hidden">
                    <div
                      className="grid grid-cols-12 bg-slate-100 border-b border-[#1a365d] font-bold text-[#1a365d] text-center"
                      style={{ fontSize: "1.85cqw", padding: "0.4cqw 0" }}
                    >
                      <div className="col-span-5 border-r border-[#1a365d] px-1">Name</div>
                      <div className="col-span-3 border-r border-[#1a365d] px-1">Relation</div>
                      <div className="col-span-4 px-1">CNIC/B-Form No.</div>
                    </div>

                    {cardMembers.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-12 items-center ${
                          idx !== cardMembers.length - 1 ? "border-b border-slate-300" : ""
                        }`}
                        style={{ fontSize: "1.8cqw", padding: "0.4cqw 0" }}
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
                      <div
                        className="text-center text-slate-500 italic"
                        style={{ padding: "1.5cqw", fontSize: "1.8cqw" }}
                      >
                        No additional family members registered
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Important Information & Desk Verification QR Code */}
                <div
                  className="flex items-center justify-between"
                  style={{ gap: "2cqw", paddingBottom: "0.2cqw" }}
                >
                  <div className="flex-1 text-left">
                    <p
                      className="font-black text-[#1a365d] uppercase tracking-wide"
                      style={{ fontSize: "2.0cqw" }}
                    >
                      IMPORTANT INFORMATION
                    </p>
                    <ul
                      className="text-slate-800 list-disc list-inside"
                      style={{ fontSize: "1.55cqw", lineHeight: 1.35, marginTop: "0.3cqw" }}
                    >
                      <li>Valid for eligible family members as per institutional policy.</li>
                      <li>Non-transferable.</li>
                      <li>Misuse may lead to cancellation.</li>
                      <li>Report loss immediately.</li>
                    </ul>
                  </div>

                  {/* QR Code Container (Local Base64 URL - Never breaks, Never CSP blocked) */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="p-0.5 rounded border border-slate-300 bg-white shadow-xs flex items-center justify-center"
                      style={{ width: "9.5cqw", height: "9.5cqw" }}
                    >
                      {qrDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={qrDataUrl}
                          alt="Scan to Verify"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
                      )}
                    </div>
                    <span
                      className="font-extrabold text-[#1a365d] uppercase tracking-tight block"
                      style={{ fontSize: "1.35cqw", marginTop: "0.3cqw" }}
                    >
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

"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Printer,
  X,
  CheckCircle2,
  Shield,
  Stethoscope,
  MapPin,
  User,
  Clock,
  CreditCard,
  HeartHandshake,
  QrCode as QrIcon,
} from "lucide-react";
import { extractFamilyCode } from "@/lib/family-code";

export interface TokenSlipData {
  tokenNo: string;
  visitNo: string;
  dateTime: string;
  hospitalName: string;
  familyRegistrationNo: string;
  familyCode?: string;
  healthCardNo?: string;
  shaheedName?: string;
  shaheedFatherName?: string;
  beneficiaryName: string;
  patientName?: string;
  fatherName?: string;
  beneficiaryFatherName?: string;
  beneficiaryRelationship?: string;
  beneficiaryCnic?: string;
  category: "Doctor / OPD" | "Dental Department" | "Pharmacy" | "Laboratory" | "Radiology / Imaging" | string;
  departmentName: string;
  doctorOrIncharge?: string;
  doctorReferred?: string;
  roomOrCounter: string;
  priorityLevel: "NORMAL" | "PRIORITY - SHUHADA FAMILY" | "EMERGENCY" | string;
  notes?: string;
  qrCodeUrl?: string;
}

export function TokenSlipCard({
  data,
  onClose,
  onPrint,
}: {
  data: TokenSlipData | null;
  onClose: () => void;
  onPrint?: () => void;
}) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Generate QR code matching the card
  useEffect(() => {
    if (!data) return;
    const qrPayload =
      data.qrCodeUrl ||
      `SHUHADA-E-DERAJAT|TOKEN:${data.tokenNo}|CARD:${data.healthCardNo || data.familyRegistrationNo}|PATIENT:${data.patientName || data.beneficiaryName}|VISIT:${data.visitNo}`;

    QRCode.toDataURL(qrPayload, {
      width: 160,
      margin: 1,
      color: {
        dark: "#01411c",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("Token QR generation error:", err));
  }, [data]);

  if (!data) return null;

  const displayFamilyCode =
    data.familyCode ||
    extractFamilyCode({
      registrationNo: data.familyRegistrationNo,
      cardNo: data.healthCardNo,
    });

  const displayPatientName = data.patientName || data.beneficiaryName || "—";

  const displayFatherName = (() => {
    if (data.fatherName && data.fatherName !== "—") return data.fatherName;
    if (data.beneficiaryFatherName && data.beneficiaryFatherName !== "—") return data.beneficiaryFatherName;

    const rel = (data.beneficiaryRelationship || "").toLowerCase();
    if (rel.includes("son") || rel.includes("daughter") || rel.includes("child")) {
      return data.shaheedName ? `${data.shaheedName} (Shaheed)` : "—";
    }
    if (rel.includes("spouse") || rel.includes("wife") || rel.includes("widow")) {
      return data.shaheedName ? `${data.shaheedName} (Husband)` : "—";
    }
    if (data.shaheedFatherName) return data.shaheedFatherName;
    if (data.shaheedName) return data.shaheedName;
    return "—";
  })();

  const displayDoctorReferred =
    data.doctorReferred ||
    data.doctorOrIncharge ||
    "On-Duty Medical Officer / Consultant";

  const formattedDateTime = (() => {
    try {
      const d = new Date(data.dateTime);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("en-PK", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch {}
    return data.dateTime || new Date().toLocaleString("en-PK");
  })();

  const isDental =
    data.category?.toLowerCase().includes("dental") ||
    data.departmentName?.toLowerCase().includes("dental");

  const handlePrint = () => {
    const printContent = document.getElementById("printable-parchi");
    if (!printContent) {
      if (onPrint) onPrint();
      else window.print();
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute(
      "style",
      "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0;visibility:hidden;"
    );
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      if (onPrint) onPrint();
      else window.print();
      return;
    }

    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((el) => el.outerHTML)
      .join("\n");

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Shuhada-e-Derajat Facilitation Slip - ${data.tokenNo}</title>
    ${styles}
    <style>
      @page {
        size: 78mm auto;
        margin: 2mm;
      }
      * {
        box-sizing: border-box;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 2px !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .parchi-card {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
        border: 1.5px solid #065f46;
        border-radius: 8px;
        background: #ffffff;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div class="parchi-card">
      ${printContent.innerHTML}
    </div>
  </body>
</html>`);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print failed:", err);
      } finally {
        setTimeout(() => {
          iframe.remove();
        }, 1500);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[320px] rounded-2xl border-2 border-emerald-900 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        id="printable-token-slip-container"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-[#01411c] px-3 py-1.5 text-white flex items-center justify-between border-b border-amber-500/50 print:hidden">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-300 text-xs font-bold">★</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
              Shuhada-e-Derajat Parchi
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              onClick={handlePrint}
              variant="secondary"
              size="xs"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold h-6 px-2 text-[10px] shadow-xs cursor-pointer"
              aria-label="Print Slip"
            >
              <Printer className="w-3 h-3 mr-1" />
              Print Parchi
            </Button>
            <button
              onClick={onClose}
              type="button"
              className="rounded p-1 text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Body (Printable Chit) */}
        <div className="p-3 text-slate-900 bg-white text-[11px]" id="printable-parchi">
          {/* Header Section with Emblems, Red Badge & Slogan */}
          <div className="bg-[#01411c] text-white rounded-xl p-2.5 mb-2.5 border border-amber-500/40 text-center relative overflow-hidden shadow-xs">
            {/* Top emblems row */}
            <div className="flex items-center justify-between mb-1">
              {/* Left Logo / Emblem */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/card-emblem-kpk.png"
                alt="Emblem"
                className="w-7 h-7 object-contain drop-shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />

              <div className="flex-1 px-1">
                <p className="text-[8.5px] font-black uppercase tracking-wider text-white leading-tight">
                  MUFTI MEHMOOD MEMORIAL MTI
                </p>
                <p className="text-[7.5px] font-bold text-emerald-200 leading-tight">
                  DERA ISMAIL KHAN
                </p>
              </div>

              {/* Right Logo / Emblem */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/card-emblem-dhq.png"
                alt="Hospital"
                className="w-7 h-7 object-contain drop-shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            {/* Red Badge - SHUHADA-E-DERAJAT */}
            <div className="inline-block bg-[#d32f2f] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs mt-0.5">
              SHUHADA-E-DERAJAT
            </div>

            {/* Slogan requested by user: Their sacrifices will not go in vain */}
            <p className="text-[8px] font-bold text-amber-200 italic mt-1 tracking-wide leading-tight">
              &quot;Their sacrifices will not go in vain&quot;
            </p>

            <div className="mt-1 pt-1 border-t border-emerald-800/80 flex items-center justify-between text-[7.5px] font-bold text-emerald-300">
              <span className="uppercase tracking-wider">
                {data.hospitalName ? data.hospitalName.replace(/Teaching Hospital|Hospital/gi, "").trim() : "Facilitation Desk"}
              </span>
              <span className="uppercase tracking-wider text-amber-300">
                Official Chit
              </span>
            </div>
          </div>

          {/* Token & Family Code Highlight Bar */}
          <div className="bg-emerald-50 border-2 border-emerald-700/40 rounded-xl p-2 mb-2 flex items-center justify-between">
            <div>
              <span className="text-[8px] font-black text-emerald-800 uppercase tracking-wider block">
                Token No • ٹوکن نمبر
              </span>
              <span className="text-2xl font-black text-emerald-950 font-mono tracking-tight leading-none mt-0.5 block">
                {data.tokenNo}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[8px] font-black text-emerald-800 uppercase tracking-wider block">
                Family Code • فیملی کوڈ
              </span>
              <span className="inline-block bg-[#01411c] text-amber-300 px-2 py-0.5 rounded-md text-[11px] font-black font-mono tracking-wider shadow-xs mt-0.5">
                #{displayFamilyCode}
              </span>
            </div>
          </div>

          {/* Martyr Reverence Banner */}
          <div className="border border-emerald-200 bg-emerald-50/60 rounded-lg px-2 py-1 mb-2 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-900">
              <Shield className="size-3 text-emerald-700 shrink-0" />
              <span className="text-[8.5px] font-black uppercase tracking-wider">
                Honoured Martyr Family • باوقار شہید کا خاندان
              </span>
            </div>
            <p className="text-[10.5px] font-extrabold text-slate-950 mt-0.5">
              Shaheed: <span className="text-emerald-900 underline underline-offset-1">{data.shaheedName || "Honoured Martyr"}</span>
            </p>
          </div>

          {/* Doctor Referred & Department Box (Highlighted Destination) */}
          <div
            className={`rounded-xl p-2.5 mb-2 border-2 ${
              isDental
                ? "bg-amber-50/90 border-amber-400"
                : "bg-blue-50/80 border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[8px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1">
                <Stethoscope className="size-3 text-blue-700" />
                Doctor Referred • معالج ڈاکٹر
              </span>
              <span className="text-[8px] font-bold text-slate-600 uppercase">
                {isDental ? "Dental" : "Consultation"}
              </span>
            </div>

            <p className="text-[12px] font-black text-blue-950 leading-tight">
              {displayDoctorReferred}
            </p>

            <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-blue-200/80 text-[9.5px]">
              <div>
                <span className="text-[7.5px] font-bold uppercase text-slate-500 block">
                  Department
                </span>
                <span className="font-extrabold text-slate-900">
                  {data.departmentName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[7.5px] font-bold uppercase text-slate-500 block">
                  Room / Counter
                </span>
                <span className="font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                  <MapPin className="size-2.5" />
                  {data.roomOrCounter}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Details & Father Name Grid */}
          <div className="border border-slate-300 rounded-xl p-2 mb-2 bg-white space-y-1.5 text-[9.5px]">
            {/* Patient Name */}
            <div className="flex justify-between items-start gap-1 pb-1 border-b border-slate-100">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <User className="size-3 text-slate-600" /> Patient Name:
              </span>
              <span className="font-black text-slate-950 text-right leading-tight">
                {displayPatientName}{" "}
                {data.beneficiaryRelationship ? (
                  <span className="text-emerald-800 font-bold text-[8.5px]">
                    ({data.beneficiaryRelationship})
                  </span>
                ) : null}
              </span>
            </div>

            {/* Father / Husband Name */}
            <div className="flex justify-between items-start gap-1 pb-1 border-b border-slate-100">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <HeartHandshake className="size-3 text-slate-600" /> Father / Husband:
              </span>
              <span className="font-extrabold text-slate-900 text-right leading-tight">
                {displayFatherName}
              </span>
            </div>

            {/* Time Stamp (Date & Time) */}
            <div className="flex justify-between items-center gap-1 pb-1 border-b border-slate-100">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <Clock className="size-3 text-slate-600" /> Time Stamp:
              </span>
              <span className="font-mono font-bold text-slate-800 text-[9px] text-right">
                {formattedDateTime}
              </span>
            </div>

            {/* Health Card / Reg No */}
            <div className="flex justify-between items-center gap-1">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <CreditCard className="size-3 text-slate-600" /> Card / Receipt:
              </span>
              <span className="font-mono font-extrabold text-slate-900 text-[9px]">
                {data.healthCardNo || data.familyRegistrationNo}
              </span>
            </div>
          </div>

          {/* QR Code & Scan to Verify Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 mb-2 flex items-center justify-between gap-2">
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase tracking-wider text-emerald-900 block">
                Scan to Verify • تصدیق
              </span>
              <p className="text-[8px] text-slate-600 leading-tight mt-0.5">
                Scan at hospital counter to verify entitlement and expedite service.
              </p>
              <p className="text-[7.5px] font-mono text-emerald-800 font-bold mt-1">
                Visit: {data.visitNo}
              </p>
            </div>

            <div className="shrink-0 bg-white p-1 rounded-lg border border-slate-300 shadow-2xs">
              {qrCodeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded">
                  <QrIcon className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Footer Reverence & Slogan */}
          <div className="text-center pt-1.5 border-t border-dashed border-emerald-300">
            <p
              dir="rtl"
              className="text-[9.5px] font-serif font-bold text-emerald-950 leading-tight"
            >
              شہید کی جو موت ہے، وہ قوم کی حیات ہے
            </p>
            <p className="text-[8.5px] font-bold text-amber-900 italic mt-0.5">
              Their sacrifices will not go in vain
            </p>
            <div className="mt-1 flex items-center justify-center gap-1 text-[8px] font-extrabold text-emerald-800">
              <CheckCircle2 className="size-2.5 text-emerald-600" />
              <span>Priority Shuhada-e-Derajat Facilitation • Fast-Track Care</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

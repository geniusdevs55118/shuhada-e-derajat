"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

export function cleanPersonName(name?: string | null): string {
  if (!name) return "";
  return name
    .replace(/\bKhan\s+Khan\b/gi, "Khan")
    .replace(/\bBibi\s+Bibi\b/gi, "Bibi")
    .replace(/\s+/g, " ")
    .trim();
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
  const [mounted, setMounted] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!data) return;

    // Completely freeze background website scrolling while popup modal is open
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Freeze any scrollable main or dashboard containers
    const scrollContainers = Array.from(
      document.querySelectorAll<HTMLElement>("main, .overflow-y-auto, .overflow-auto")
    );
    const originalContainerStyles = scrollContainers.map((el) => ({
      el,
      overflow: el.style.overflow,
    }));
    scrollContainers.forEach(({ style }) => {
      style.overflow = "hidden";
    });

    // Intercept wheel & touchmove globally so background page cannot scroll under any circumstances
    const handlePreventScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollableParchi = document.getElementById("printable-parchi");
      // If user is scrolling inside the printable parchi chit itself, allow it if it overflows
      if (scrollableParchi && scrollableParchi.contains(target)) {
        if (scrollableParchi.scrollHeight > scrollableParchi.clientHeight) {
          return;
        }
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", handlePreventScroll, { passive: false });
    window.addEventListener("touchmove", handlePreventScroll, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key)) {
        const target = e.target as HTMLElement | null;
        const isInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
        if (!isInput) {
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      originalContainerStyles.forEach(({ el, overflow }) => {
        el.style.overflow = overflow;
      });

      window.removeEventListener("wheel", handlePreventScroll);
      window.removeEventListener("touchmove", handlePreventScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, onClose]);

  // Generate QR code matching the card
  useEffect(() => {
    if (!data) return;
    const qrPayload =
      data.qrCodeUrl ||
      `SHUHADA-E-DERAJAT|TOKEN:${data.tokenNo}|CARD:${data.healthCardNo || data.familyRegistrationNo}|PATIENT:${data.patientName || data.beneficiaryName}|VISIT:${data.visitNo}`;

    QRCode.toDataURL(qrPayload, {
      width: 140,
      margin: 1,
      color: {
        dark: "#01411c",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("Token QR generation error:", err));
  }, [data]);

  if (!data || !mounted) return null;

  const displayFamilyCode =
    data.familyCode ||
    extractFamilyCode({
      registrationNo: data.familyRegistrationNo,
      cardNo: data.healthCardNo,
    });

  const displayPatientName = cleanPersonName(data.patientName || data.beneficiaryName || "—");

  const displayFatherName = (() => {
    const raw = (() => {
      if (data.fatherName && data.fatherName !== "—") return data.fatherName;
      if (data.beneficiaryFatherName && data.beneficiaryFatherName !== "—") return data.beneficiaryFatherName;

      const rel = (data.beneficiaryRelationship || "").toLowerCase();
      const sName = cleanPersonName(data.shaheedName);
      if (rel.includes("son") || rel.includes("daughter") || rel.includes("child")) {
        return sName ? `${sName} (Shaheed)` : "—";
      }
      if (rel.includes("spouse") || rel.includes("wife") || rel.includes("widow")) {
        return sName ? `${sName} (Husband)` : "—";
      }
      if (data.shaheedFatherName) return cleanPersonName(data.shaheedFatherName);
      if (data.shaheedName) return sName;
      return "—";
    })();
    return cleanPersonName(raw);
  })();

  const displayShaheedName = cleanPersonName(data.shaheedName) || "Honoured Martyr";

  const hospitalHeaderTitle = (() => {
    const raw = (data.hospitalName || "").toLowerCase();
    if (raw.includes("mufti") || raw.includes("mmmth") || raw.includes("mmti")) {
      return "MUFTI MEHMOOD MEMORIAL MTI";
    }
    if (raw.includes("women") || raw.includes("children") || raw.includes("dwch")) {
      return "DERAJAT WOMEN & CHILDREN HOSPITAL";
    }
    if (raw.includes("dhq") || raw.includes("headquarters")) {
      return "DHQ TEACHING HOSPITAL";
    }
    return data.hospitalName ? data.hospitalName.toUpperCase() : "DERAJAT MEDICAL TEACHING INSTITUTION";
  })();

  const hospitalEmblemSrc = (() => {
    const raw = (data.hospitalName || "").toLowerCase();
    if (raw.includes("mufti") || raw.includes("mmmth") || raw.includes("mmti")) {
      return "/images/logo-mmmti.svg";
    }
    if (raw.includes("women") || raw.includes("children") || raw.includes("dwch")) {
      return "/images/logo-dwch.svg";
    }
    if (raw.includes("dhq") || raw.includes("headquarters")) {
      return "/images/logo-dhq.svg";
    }
    return "/images/card-emblem-dhq.png";
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
        size: 75mm auto;
        margin: 2mm;
      }
      * {
        box-sizing: border-box;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .parchi-card {
        width: 100%;
        max-width: 285px;
        margin: 0 auto;
        border: 1.5px solid #065f46;
        border-radius: 6px;
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

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs select-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-[295px] rounded-xl border-2 border-emerald-900 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] select-text"
        id="printable-token-slip-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Always visible at top of modal, hidden on print) */}
        <div className="bg-[#01411c] px-2.5 py-1 text-white flex items-center justify-between border-b border-amber-500/50 shrink-0 print:hidden">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-amber-300 text-xs font-bold shrink-0">★</span>
            <span className="text-[9.5px] font-extrabold tracking-wider text-emerald-100 truncate">
              SHUHADA-<span className="lowercase font-black">e</span>-DERAJAT PARCHI
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              onClick={handlePrint}
              variant="secondary"
              size="xs"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold h-5 px-1.5 text-[9px] shadow-xs cursor-pointer"
              aria-label="Print Slip"
            >
              <Printer className="w-2.5 h-2.5 mr-0.5" />
              Print
            </Button>
            <button
              onClick={onClose}
              type="button"
              className="rounded p-0.5 text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Body (Printable Chit) - Fits cleanly on screen & paper */}
        <div className="p-2 text-slate-900 bg-white text-[10px] overflow-y-auto" id="printable-parchi">
          {/* Header Section with Emblems, Red Badge & Slogan */}
          <div className="bg-[#01411c] text-white rounded-lg p-2 mb-1.5 border border-amber-500/40 text-center relative overflow-hidden shadow-xs">
            {/* Top emblems row */}
            <div className="flex items-center justify-between gap-1.5 px-0.5">
              {/* Left Logo / Emblem: Government of Khyber Pakhtunkhwa */}
              <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-xs border border-emerald-300/80 shrink-0 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/card-emblem-kpk.png"
                  alt="Government of KPK"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div className="flex-1 px-1 min-w-0 text-center">
                <p className="text-[8px] font-black uppercase tracking-wider text-white leading-tight">
                  {hospitalHeaderTitle}
                </p>
                <p className="text-[7px] font-bold text-emerald-200 leading-tight mt-0.5">
                  DERA ISMAIL KHAN
                </p>
              </div>

              {/* Right Logo / Emblem: Hospital / Healthcare Seal */}
              <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-xs border border-emerald-300/80 shrink-0 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hospitalEmblemSrc}
                  alt="Hospital Emblem"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Red Badge - SHUHADA-e-DERAJAT */}
            <div className="inline-block bg-[#d32f2f] text-white px-2.5 py-0.5 rounded-full text-[8.5px] font-black tracking-wider shadow-xs mt-1">
              SHUHADA-<span className="lowercase font-black">e</span>-DERAJAT
            </div>

            {/* Slogan requested by user: Their sacrifices will not go in vain */}
            <p className="text-[7px] font-bold text-amber-200 italic mt-0.5 tracking-wide leading-tight">
              &quot;Their sacrifices will not go in vain&quot;
            </p>

            <div className="mt-1 pt-0.5 border-t border-emerald-800/80 flex items-center justify-between text-[6.5px] font-bold text-emerald-300">
              <span className="uppercase tracking-wider truncate">
                {data.hospitalName ? data.hospitalName.replace(/Teaching Hospital|Hospital/gi, "").trim() : "Facilitation Desk"}
              </span>
              <span className="uppercase tracking-wider text-amber-300 shrink-0">
                Official Chit
              </span>
            </div>
          </div>

          {/* Token & Family Code Highlight Bar */}
          <div className="bg-emerald-50 border border-emerald-700/40 rounded-lg p-1.5 mb-1.5 flex items-center justify-between">
            <div>
              <span className="text-[7px] font-black text-emerald-800 uppercase tracking-wider block leading-none">
                Token • ٹوکن
              </span>
              <span className="text-lg font-black text-emerald-950 font-mono tracking-tight leading-none mt-0.5 block">
                {data.tokenNo}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[7px] font-black text-emerald-800 uppercase tracking-wider block leading-none">
                Family Code • کوڈ
              </span>
              <span className="inline-block bg-[#01411c] text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-black font-mono tracking-wider shadow-xs mt-0.5">
                #{displayFamilyCode}
              </span>
            </div>
          </div>

          {/* Martyr Reverence Line */}
          <div className="border border-emerald-200 bg-emerald-50/60 rounded-md px-1.5 py-0.5 mb-1.5 text-center">
            <p className="text-[8px] text-slate-700 leading-tight">
              <Shield className="size-2.5 text-emerald-700 inline-block mr-0.5 align-middle" />
              <span className="font-bold">Shaheed:</span>{" "}
              <span className="font-extrabold text-emerald-950">{displayShaheedName}</span>
            </p>
          </div>

          {/* Doctor Referred & Department Box */}
          <div
            className={`rounded-lg p-1.5 mb-1.5 border ${
              isDental
                ? "bg-amber-50/90 border-amber-400"
                : "bg-blue-50/80 border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[7px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-0.5">
                <Stethoscope className="size-2.5 text-blue-700" />
                Doctor Referred • معالج ڈاکٹر
              </span>
              <span className="text-[7px] font-bold text-slate-600 uppercase">
                {isDental ? "Dental" : "Consultation"}
              </span>
            </div>

            <p className="text-[10.5px] font-black text-blue-950 leading-tight">
              {displayDoctorReferred}
            </p>

            <div className="flex items-center justify-between pt-1 mt-1 border-t border-blue-200/80 text-[8.5px]">
              <div className="truncate pr-1">
                <span className="text-[6.5px] font-bold uppercase text-slate-500 block leading-none">
                  Department
                </span>
                <span className="font-extrabold text-slate-900 truncate block">
                  {data.departmentName}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[6.5px] font-bold uppercase text-slate-500 block leading-none">
                  Room / Counter
                </span>
                <span className="font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-1 py-0.5 rounded text-[8px] inline-flex items-center gap-0.5">
                  <MapPin className="size-2" />
                  {data.roomOrCounter}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Details & Father Name Grid */}
          <div className="border border-slate-300 rounded-lg p-1.5 mb-1.5 bg-white space-y-1 text-[8.5px]">
            {/* Patient Name */}
            <div className="flex justify-between items-center gap-1 pb-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <User className="size-2.5 text-slate-600" /> Patient:
              </span>
              <span className="font-black text-slate-950 text-right leading-tight truncate">
                {displayPatientName}{" "}
                {data.beneficiaryRelationship ? (
                  <span className="text-emerald-800 font-bold text-[7.5px]">
                    ({data.beneficiaryRelationship})
                  </span>
                ) : null}
              </span>
            </div>

            {/* Father / Husband Name */}
            <div className="flex justify-between items-center gap-1 pb-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <HeartHandshake className="size-2.5 text-slate-600" /> Father / Husband:
              </span>
              <span className="font-extrabold text-slate-900 text-right leading-tight truncate">
                {displayFatherName}
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between items-center gap-1">
              <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <Clock className="size-2.5 text-slate-600" /> Date & Time:
              </span>
              <span className="font-mono font-bold text-slate-800 text-[8px] text-right">
                {formattedDateTime}
              </span>
            </div>
          </div>

          {/* Footer Reverence & Slogan */}
          <div className="text-center pt-1 border-t border-dashed border-emerald-300">
            <p
              dir="rtl"
              className="text-[8.5px] font-serif font-bold text-emerald-950 leading-tight"
            >
              شہید کی جو موت ہے، وہ قوم کی حیات ہے
            </p>
            <p className="text-[7.5px] font-bold text-amber-900 italic mt-0.5">
              Their sacrifices will not go in vain
            </p>
            <div className="mt-0.5 flex items-center justify-center gap-0.5 text-[7px] font-extrabold text-emerald-800">
              <CheckCircle2 className="size-2 text-emerald-600" />
              <span>Priority Facilitation • No Queue Wait</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

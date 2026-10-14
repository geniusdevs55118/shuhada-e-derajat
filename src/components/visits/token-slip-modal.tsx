"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, X, CheckCircle2, Shield, Stethoscope, MapPin, User, FileText } from "lucide-react";
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
  beneficiaryName: string;
  beneficiaryRelationship?: string;
  beneficiaryCnic?: string;
  category: "Doctor / OPD" | "Dental Department" | "Pharmacy" | "Laboratory" | "Radiology / Imaging" | string;
  departmentName: string;
  doctorOrIncharge?: string;
  roomOrCounter: string;
  priorityLevel: "NORMAL" | "PRIORITY - SHUHADA FAMILY" | "EMERGENCY" | string;
  notes?: string;
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  const displayFamilyCode =
    data.familyCode ||
    extractFamilyCode({
      registrationNo: data.familyRegistrationNo,
      cardNo: data.healthCardNo,
    });

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
    <title>Token Slip - ${data.tokenNo}</title>
    ${styles}
    <style>
      @page {
        size: 75mm auto;
        margin: 3mm;
      }
      body {
        background: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 2px !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .parchi-card {
        width: 100%;
        max-width: 290px;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[310px] rounded-xl border-2 border-emerald-800 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        id="printable-token-slip-container"
      >
        {/* Top Header */}
        <div className="bg-[#01411c] px-3.5 py-2 text-white border-b-2 border-amber-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-300 text-sm font-bold">★</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white leading-tight">
                  Shuhada-e-Derajat Facilitation Slip
                </p>
                <p className="text-[8px] text-emerald-200 leading-tight">
                  {data.hospitalName || "MMMTI • DHQ • DWCH Dera Ismail Khan"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 print:hidden">
              <Button
                onClick={handlePrint}
                variant="ghost"
                size="xs"
                className="text-white hover:bg-white/20 h-6 px-1.5 cursor-pointer text-[10px] font-bold"
                aria-label="Print Slip"
              >
                <Printer className="w-3 h-3 mr-0.5" />
                Print
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
        </div>

        {/* Card Body (Printable Content) */}
        <div className="p-3 text-slate-900 bg-white text-[11px]" id="printable-parchi">
          {/* Family Reverence & Receipt Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2 mb-2 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-900">
              <Shield className="size-3 text-emerald-700" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                Honoured Martyr Family • شہید کا باوقار خاندان
              </span>
            </div>
            <p className="text-[11px] font-extrabold text-slate-950 mt-0.5">
              Shaheed: <span className="text-emerald-900 underline underline-offset-1">{data.shaheedName || "Honoured Martyr"}</span>
            </p>
            <p className="text-[8.5px] text-slate-600 mt-0.5 font-mono">
              Receipt / رجسٹریشن نمبر: <span className="font-bold text-slate-900">{data.familyRegistrationNo}</span>
            </p>
          </div>

          {/* Token Number & Family Code Badge */}
          <div className="flex items-center justify-between border-y border-emerald-100 py-1.5 mb-2">
            <div>
              <p className="text-[8.5px] font-bold text-emerald-800 uppercase tracking-wider">Token No</p>
              <p className="text-xl font-black text-emerald-950 font-mono tracking-tight leading-none mt-0.5">{data.tokenNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[8.5px] font-bold text-emerald-800 uppercase tracking-wider">Family Code</p>
              <div className="inline-block bg-[#01411c] text-amber-300 px-2 py-0.5 rounded text-[11px] font-black font-mono tracking-wider shadow-xs mt-0.5">
                #{displayFamilyCode}
              </div>
            </div>
          </div>

          {/* Current Destination / Where They Are Going Right Now */}
          <div
            className={`rounded-lg p-2 mb-2 border ${
              isDental
                ? "bg-amber-50/80 border-amber-300"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <div className="flex-1">
                <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Stethoscope className="size-2.5 text-emerald-700" /> Current Destination
                </span>
                <p className="text-xs font-black text-slate-900 mt-0.5 leading-snug">
                  {isDental ? (
                    <span className="text-amber-800">🦷 {data.departmentName || "Dental Department"}</span>
                  ) : (
                    data.departmentName
                  )}
                </p>
                {data.doctorOrIncharge && (
                  <p className="text-[9.5px] text-slate-700 font-bold mt-0.5">
                    Dr: <span className="text-blue-900">{data.doctorOrIncharge}</span>
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-500 block">
                  Room / Counter
                </span>
                <p className="text-[9.5px] font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded mt-0.5 inline-flex items-center gap-0.5">
                  <MapPin className="size-2.5" /> {data.roomOrCounter}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="border border-slate-200 rounded-lg p-2 mb-2 text-[9.5px] space-y-1 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <User className="size-2.5" /> Patient:
              </span>
              <span className="font-bold text-slate-950">
                {data.beneficiaryName} {data.beneficiaryRelationship ? `(${data.beneficiaryRelationship})` : ""}
              </span>
            </div>
            {data.beneficiaryCnic && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">CNIC / B-Form:</span>
                <span className="font-mono text-slate-800">{data.beneficiaryCnic}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1">
                <FileText className="size-2.5" /> Health Card:
              </span>
              <span className="font-mono text-slate-800 text-[9px] font-bold">
                {data.healthCardNo || data.familyRegistrationNo}
              </span>
            </div>
            <div className="flex justify-between items-center pt-0.5 border-t border-slate-100">
              <span className="text-slate-400 text-[8px]">Visit / Time:</span>
              <span className="font-mono text-slate-600 text-[8.5px]">
                {data.visitNo} • {data.dateTime}
              </span>
            </div>
          </div>

          {/* Footer Tribute & Priority Note */}
          <div className="text-center pt-1 border-t border-dashed border-emerald-200">
            <p
              dir="rtl"
              className="text-[9.5px] font-serif font-bold text-emerald-900 leading-tight"
            >
              شہید کی جو موت ہے، وہ قوم کی حیات ہے
            </p>
            <div className="mt-1 flex items-center justify-center gap-1 text-[8px] font-extrabold text-emerald-800">
              <CheckCircle2 className="size-2.5 text-emerald-600" />
              <span>Priority Shuhada-e-Derajat Facilitation • No Counter Queues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Printer, X, CheckCircle2, Shield, HeartPulse } from "lucide-react";
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
    <title>Shuhada Token Slip - ${data.tokenNo}</title>
    ${styles}
    <style>
      @page {
        size: 80mm auto;
        margin: 4mm;
      }
      body {
        background-color: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 4px !important;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Nastaliq Urdu", sans-serif;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .parchi-slip-card {
        width: 100%;
        max-width: 330px;
        margin: 0 auto;
        border: 2px solid #065f46;
        border-radius: 8px;
        background: #ffffff;
        overflow: hidden;
      }
      .parchi-header {
        background: #01411c !important;
        color: #ffffff !important;
        padding: 8px 12px;
        text-align: center;
        border-bottom: 2px solid #d97706;
      }
    </style>
  </head>
  <body>
    <div class="parchi-slip-card">
      <div class="parchi-header">
        <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
          DERAJAT SHUHADA HEALTHCARE
        </div>
        <div style="font-size: 9px; color: #fef08a; margin-top: 2px;">
          ${data.hospitalName || "Mufti Mehmood Memorial MTI D.I. Khan"}
        </div>
      </div>
      ${printContent.outerHTML}
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
    <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
      <style>{`
        @media print {
          body {
            visibility: hidden !important;
            background: #ffffff !important;
          }
          #printable-token-slip-container,
          #printable-token-slip-container * {
            visibility: visible !important;
          }
          #printable-token-slip-container {
            position: fixed !important;
            left: 50% !important;
            top: 10px !important;
            transform: translateX(-50%) !important;
            width: 330px !important;
            max-width: 100% !important;
            margin: 0 !important;
            border: 2px solid #065f46 !important;
            border-radius: 8px !important;
            background: #ffffff !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .token-slip-actions {
            display: none !important;
          }
        }
      `}</style>
      <div
        id="printable-token-slip-container"
        className="rounded-xl border-2 border-emerald-800 bg-white shadow-2xl overflow-hidden print:shadow-none max-w-sm mx-auto"
      >
        {/* Header - Pakistan Green & Gold */}
        <div className="bg-[#01411c] px-4 py-3 text-white border-b-2 border-amber-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-serif text-lg">★</span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-white">
                  Derajat Shuhada Facilitation Slip
                </p>
                <p className="text-[9px] text-emerald-200">
                  {data.hospitalName || "MMMTI • DHQ • DWCH Dera Ismail Khan"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 token-slip-actions print:hidden">
              <Button
                onClick={handlePrint}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 px-2 cursor-pointer"
                aria-label="Print Slip"
              >
                <Printer className="w-4 h-4 mr-1" />
                <span className="text-xs font-bold">Print</span>
              </Button>
              <button
                onClick={onClose}
                type="button"
                className="rounded p-1 text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-4 text-slate-900 bg-white" id="printable-parchi">
          {/* Shuhada Martyr Reverence Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 mb-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-900">
              <Shield className="size-3.5 text-emerald-700" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Honoured Martyr Family • شہید کا باوقار خاندان
              </span>
            </div>
            <p className="text-xs font-bold text-slate-950 mt-0.5">
              Shaheed: <span className="text-emerald-900 underline underline-offset-2">{data.shaheedName || "Honoured Martyr of Pakistan"}</span>
            </p>
          </div>

          {/* Token & Priority Ribbon */}
          <div className="flex items-center justify-between border-y-2 border-emerald-100 py-2.5 mb-3">
            <div>
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Token No</p>
              <p className="text-2xl font-black text-emerald-950 font-mono tracking-tight">{data.tokenNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Family Code</p>
              <div className="inline-block bg-[#01411c] text-amber-300 px-2.5 py-1 rounded text-xs font-black font-mono tracking-wider shadow-sm">
                #{displayFamilyCode}
              </div>
            </div>
          </div>

          {/* Specific Department Callout - Highlighted if Dental */}
          <div
            className={`rounded-lg p-2.5 mb-3 border ${
              isDental
                ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-400"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target Department
                </span>
                <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  {isDental ? (
                    <span className="text-amber-700 font-bold">🦷 {data.departmentName || "Dental Department"}</span>
                  ) : (
                    <span>{data.departmentName}</span>
                  )}
                </p>
                {isDental && (
                  <p className="text-[10px] font-bold text-emerald-800 mt-0.5">
                    شعبہ دندان سازی • مفت علاج و رہنمائی
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Location / Room
                </span>
                <p className="text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {data.roomOrCounter}
                </p>
              </div>
            </div>
            {data.doctorOrIncharge && (
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-[10.5px]">
                <span className="text-slate-500">Doctor / Incharge: </span>
                <span className="font-semibold text-slate-900">{data.doctorOrIncharge}</span>
              </div>
            )}
          </div>

          {/* Beneficiary Details */}
          <div className="border border-slate-200 rounded-lg p-2.5 mb-3 text-[11px] space-y-1.5 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Beneficiary / Patient:</span>
              <span className="font-bold text-slate-950 text-xs">{data.beneficiaryName}</span>
            </div>
            {data.beneficiaryRelationship && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Relation to Shaheed:</span>
                <span className="font-semibold text-emerald-800">{data.beneficiaryRelationship}</span>
              </div>
            )}
            {data.beneficiaryCnic && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">CNIC / B-Form:</span>
                <span className="font-mono text-slate-800">{data.beneficiaryCnic}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Health Card / Reg:</span>
              <span className="font-mono text-slate-800 text-[10px]">
                {data.healthCardNo || data.familyRegistrationNo}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Visit Ref / Date:</span>
              <span className="font-mono text-slate-600 text-[10px]">
                {data.visitNo} • {data.dateTime}
              </span>
            </div>
          </div>

          {/* Martyr Poetic Tribute in Urdu & English */}
          <div className="text-center pt-1 border-t border-dashed border-emerald-300">
            <p
              dir="rtl"
              className="text-[11px] font-serif font-bold text-emerald-900 leading-tight"
            >
              شہید کی جو موت ہے، وہ قوم کی حیات ہے
            </p>
            <p className="text-[8.5px] italic text-slate-600 mt-0.5">
              &quot;A martyr&apos;s death is the nation&apos;s life.&quot; — Molana Abdul Majeed Salik
            </p>
            <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-800">
              <CheckCircle2 className="size-3 text-emerald-600" />
              <span>Priority Shuhada Desk • No Counter Queues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

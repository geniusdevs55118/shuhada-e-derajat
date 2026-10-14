"use client";

import { Button } from "@/components/ui/button";
import { Printer, X, CheckCircle2 } from "lucide-react";

export interface TokenSlipData {
  tokenNo: string;
  visitNo: string;
  dateTime: string;
  hospitalName: string;
  familyRegistrationNo: string;
  healthCardNo?: string;
  shaheedName?: string;
  beneficiaryName: string;
  beneficiaryRelationship?: string;
  beneficiaryCnic?: string;
  category: "Doctor / OPD" | "Pharmacy" | "Laboratory" | "Radiology / Imaging";
  departmentName: string;
  doctorOrIncharge?: string;
  roomOrCounter: string;
  priorityLevel: "NORMAL" | "PRIORITY - SHUHADA FAMILY" | "EMERGENCY";
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
        size: auto;
        margin: 6mm;
      }
      body {
        background-color: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 8px !important;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .parchi-slip-card {
        width: 100%;
        max-width: 320px;
        margin: 0 auto;
        border: 1px solid #c6d8c9;
        border-radius: 12px;
        background: #ffffff;
        overflow: hidden;
      }
      .parchi-header {
        background-color: #059669;
        color: #ffffff;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .parchi-header span {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    </style>
  </head>
  <body>
    <div class="parchi-slip-card">
      <div class="parchi-header">
        <span>Token Slip</span>
        <span style="font-size: 9px; opacity: 0.85; font-family: monospace;">${data.dateTime || ""}</span>
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
            top: 20px !important;
            transform: translateX(-50%) !important;
            width: 320px !important;
            max-width: 100% !important;
            margin: 0 !important;
            border: 1px solid #c6d8c9 !important;
            border-radius: 12px !important;
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
        className="rounded-xl border border-emerald-200 bg-white shadow-lg overflow-hidden print:shadow-none max-w-xs mx-auto"
      >
        {/* Header */}
        <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between text-white">
          <span className="text-xs font-bold uppercase tracking-wider">Token Slip</span>
          <div className="flex items-center gap-1 token-slip-actions print:hidden">
            <Button
              onClick={handlePrint}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              aria-label="Print Slip"
            >
              <Printer className="w-4 h-4" />
            </Button>
            <button
              onClick={onClose}
              type="button"
              className="rounded p-1 text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-4 text-slate-900" id="printable-parchi">
          {/* Top Row - Token & Priority */}
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-3">
            <div className="text-center">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Token</p>
              <p className="text-2xl font-black text-emerald-900 font-mono">{data.tokenNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Priority</p>
              <span className="inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                {data.priorityLevel.replace("PRIORITY - ", "").replace("SHUHADA FAMILY", "FAMILY")}
              </span>
            </div>
          </div>

          {/* Destination Details - Compact Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div>
              <p className="text-slate-500 font-medium">Service</p>
              <p className="font-bold text-slate-900">{data.category}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Department</p>
              <p className="font-bold text-slate-900">{data.departmentName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Counter / Room</p>
              <p className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{data.roomOrCounter}</p>
            </div>
            {data.doctorOrIncharge && (
              <div>
                <p className="text-slate-500 font-medium">Doctor</p>
                <p className="font-semibold text-slate-900 truncate">{data.doctorOrIncharge}</p>
              </div>
            )}
          </div>

          {/* Beneficiary - Compact */}
          <div className="border-t border-dashed border-emerald-300 pt-3 text-[11px] space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient</span>
              <span className="font-bold text-slate-900">{data.beneficiaryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Card / Reg</span>
              <span className="font-mono text-slate-800">{data.healthCardNo || data.familyRegistrationNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Visit Ref</span>
              <span className="font-mono text-slate-800">{data.visitNo}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 text-center text-[10px] text-slate-500 border-t border-dashed border-emerald-200">
            <p className="font-semibold text-slate-700 inline-flex items-center justify-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-600 inline" />
              <span>Present at department counter</span>
            </p>
            <p className="text-[9px] text-slate-400 mt-0.5">KP Shuhada Healthcare · Free Facilitation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

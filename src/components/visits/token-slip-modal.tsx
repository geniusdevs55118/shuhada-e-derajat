"use client";

import { Button } from "@/components/ui/button";

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
  onPrint: () => void;
}) {
  if (!data) return null;

  return (
    <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="rounded-xl border border-emerald-200 bg-white shadow-lg overflow-hidden print:shadow-none max-w-xs mx-auto">
        {/* Header */}
        <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between text-white">
          <span className="text-xs font-bold uppercase tracking-wider">Token Slip</span>
          <div className="flex items-center gap-1">
            <Button
              onClick={onPrint}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              🖨️
            </Button>
            <button
              onClick={onClose}
              type="button"
              className="rounded p-1 text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              ✕
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
            <p className="font-semibold text-slate-700">★ Present at department counter</p>
            <p className="text-[9px] text-slate-400 mt-0.5">KP Shuhada Healthcare · Free Facilitation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

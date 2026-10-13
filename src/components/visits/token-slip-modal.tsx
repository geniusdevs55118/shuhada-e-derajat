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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-lg overflow-hidden print:shadow-none">
        {/* Header */}
        <div className="border-b border-emerald-200 bg-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Token Generated Successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onPrint}
              variant="outline"
              size="sm"
              className="bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800"
            >
              🖨️ Print
            </Button>
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-5 text-slate-900" id="printable-parchi">
          {/* Header */}
          <div className="border-b-2 border-dashed border-emerald-300 pb-3 text-center mb-4">
            <div className="inline-block rounded bg-blue-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white mb-1">
              Govt. of Khyber Pakhtunkhwa
            </div>
            <h2 className="text-base font-extrabold text-blue-950 uppercase tracking-tight">
              {data.hospitalName || "Derajat Shuhada Facilitation Desk"}
            </h2>
            <p className="text-[11px] font-semibold text-emerald-800">
              Shuhada Family Healthcare Facilitation Slip (Parchi)
            </p>
            <p className="text-[10px] text-slate-500">{data.dateTime}</p>
          </div>

          {/* Token Highlight */}
          <div className="my-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-3 text-center">
            <p className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase">Your Token Number</p>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 tracking-wider py-1 font-mono">
              {data.tokenNo}
            </div>
            <div className="inline-block rounded-full bg-emerald-700 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              {data.priorityLevel}
            </div>
          </div>

          {/* Key Destination Details */}
          <div className="rounded-lg border border-emerald-200 bg-white p-3 mb-3 text-xs space-y-1.5">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-1">
              <span className="text-slate-500 font-medium">Facility / Service:</span>
              <span className="font-bold text-blue-900">{data.category}</span>
            </div>
            <div className="flex justify-between items-center border-b border-emerald-100 pb-1">
              <span className="text-slate-500 font-medium">Department / Clinic:</span>
              <span className="font-bold text-slate-900">{data.departmentName}</span>
            </div>
            {data.doctorOrIncharge && (
              <div className="flex justify-between items-center border-b border-emerald-100 pb-1">
                <span className="text-slate-500 font-medium">Doctor / Consultant:</span>
                <span className="font-semibold text-slate-900">{data.doctorOrIncharge}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-slate-500 font-medium">Counter / Room:</span>
              <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">
                {data.roomOrCounter}
              </span>
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="border-t border-dashed border-emerald-300 pt-3 text-[11px] space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient / Beneficiary:</span>
              <span className="font-bold text-slate-900">{data.beneficiaryName}</span>
            </div>
            {data.beneficiaryRelationship && (
              <div className="flex justify-between">
                <span className="text-slate-500">Relationship:</span>
                <span>{data.beneficiaryRelationship}</span>
              </div>
            )}
            {data.shaheedName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Family of Shaheed:</span>
                <span className="font-semibold text-slate-900">{data.shaheedName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Card / Reg No:</span>
              <span className="font-mono text-slate-800">{data.healthCardNo || data.familyRegistrationNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Visit Reference:</span>
              <span className="font-mono text-slate-800">{data.visitNo}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-3 border-t-2 border-dashed border-emerald-300 pt-2 text-center text-[10px] text-slate-500">
            <p className="font-semibold text-slate-700">★ Please present this slip at the department counter</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Priority Care Under KP Shuhada Healthcare Initiative · Free Facilitation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

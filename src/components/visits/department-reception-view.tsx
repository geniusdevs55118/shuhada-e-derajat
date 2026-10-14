"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenSlipCard, TokenSlipData } from "@/components/visits/token-slip-modal";
import { Building2, Award, CreditCard, Clock, FileText, Printer, Pill, UserCheck, Check, Stethoscope } from "lucide-react";
import { extractFamilyCode } from "@/lib/family-code";

export interface DepartmentQueueItem {
  id: number;
  visitNo: string;
  dateTime: string | Date;
  beneficiaryName: string;
  beneficiaryRelationship: string | null;
  beneficiaryCnic: string | null;
  shaheedName: string | null;
  familyRegistrationNo: string;
  healthCardNo: string | null;
  hospitalName: string;
  department: string | null;
  consultant: string | null;
  treatmentPlan: string | null;
  finalStatus: string | null;
  role?: string;  // Make role optional
}

export function DepartmentReceptionView({
  initialQueue,
  userHospitalName,
  canManage,
  role,
}: {
  initialQueue: DepartmentQueueItem[];
  userHospitalName: string;
  canManage: boolean;
  role: string;
}) {
  const [queue, setQueue] = useState<DepartmentQueueItem[]>(initialQueue);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeSlip, setActiveSlip] = useState<TokenSlipData | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Poll for newly booked tokens every 15 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/visits?page=1");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            const freshItems: DepartmentQueueItem[] = json.data.map((v: any) => ({
              id: v.id,
              visitNo: v.visitNo,
              dateTime: v.dateTime,
              beneficiaryName: v.beneficiaryName,
              beneficiaryRelationship: v.beneficiaryRelationship,
              beneficiaryCnic: v.beneficiaryCnicBForm,
              shaheedName: v.shaheedName,
              familyRegistrationNo: v.familyRegistrationNo,
              healthCardNo: v.healthCardNo,
              hospitalName: v.hospitalName ?? userHospitalName,
              department: v.department,
              consultant: v.consultant,
              treatmentPlan: v.treatmentPlan,
              finalStatus: v.finalStatus,
            }));
            setQueue((prev) => {
              // merge keeping local optimistic status updates
              const updated = [...freshItems];
              return updated;
            });
          }
        }
      } catch {
        // silent background poll failure
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [userHospitalName]);

  // Check if pharmacy or nursing role
  const isPharmacyOrNursing = role === "pharmacy_rep" || role === "nursing_rep";
  
  // Departments present in current queue
  const departmentOptions = Array.from(
    new Set(queue.map((q) => q.department).filter(Boolean) as string[])
  );

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    const matchesDept =
      selectedDeptFilter === "all" ||
      (item.department &&
        item.department.toLowerCase().includes(selectedDeptFilter.toLowerCase()));

    // Pharmacy/nursing only search by token or patient name
    const s = searchFilter.toLowerCase();
    const matchesSearch =
      !s ||
      (isPharmacyOrNursing
        ? item.beneficiaryName.toLowerCase().includes(s) || item.visitNo.toLowerCase().includes(s)
        : item.beneficiaryName.toLowerCase().includes(s) ||
          item.visitNo.toLowerCase().includes(s) ||
          (item.healthCardNo && item.healthCardNo.toLowerCase().includes(s)) ||
          (item.shaheedName && item.shaheedName.toLowerCase().includes(s)));

    return matchesDept && matchesSearch;
  });

  // Mark appointment status (e.g. In Consultation, Completed, Meds Dispensed)
  const handleUpdateStatus = async (
    id: number,
    newStatus: "IN_CONSULTATION" | "COMPLETED" | "REFERRED_PHARMACY" | "MEDS_DISPENSED" | "LAB_COMPLETED"
  ) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          finalStatus: newStatus,
          ...(newStatus === "MEDS_DISPENSED" ? { medicinesRemarks: "Medicines fully facilitated by pharmacy desk" } : {}),
          ...(newStatus === "LAB_COMPLETED" ? { investigationsStatus: "COMPLETED" } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update appointment status");
      }

      setQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, finalStatus: newStatus } : item))
      );

      const statusLabels: Record<string, string> = {
        IN_CONSULTATION: "Patient marked as In Consultation / Attended",
        COMPLETED: "Consultation / Service completed successfully",
        REFERRED_PHARMACY: "Referred to Pharmacy Counter for Free Medicines",
        MEDS_DISPENSED: "Free medicines dispensed to Shuhada family member",
        LAB_COMPLETED: "Laboratory diagnostics marked as completed",
      };

      toast.success(statusLabels[newStatus] || "Updated");
    } catch {
      toast.error("Could not update status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // Reprint chit/slip
  const handleReprintSlip = (item: DepartmentQueueItem) => {
    const isDental = (item.department ?? "").toLowerCase().includes("dental");
    const slip: TokenSlipData = {
      tokenNo: `#TK-${String(item.id).padStart(3, "0")}`,
      visitNo: item.visitNo,
      dateTime: new Date(item.dateTime).toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      hospitalName: item.hospitalName,
      familyRegistrationNo: item.familyRegistrationNo,
      familyCode: extractFamilyCode({
        registrationNo: item.familyRegistrationNo,
        cardNo: item.healthCardNo,
      }),
      healthCardNo: item.healthCardNo ?? undefined,
      shaheedName: item.shaheedName ?? undefined,
      beneficiaryName: item.beneficiaryName,
      beneficiaryRelationship: item.beneficiaryRelationship ?? undefined,
      beneficiaryCnic: item.beneficiaryCnic ?? undefined,
      category: isDental ? "Dental Department" : "Doctor / OPD",
      departmentName: item.department || (isDental ? "Dental Surgery & OPD" : "Consultation Clinic"),
      doctorOrIncharge: item.consultant || undefined,
      roomOrCounter: isDental ? "Dental Wing, Room D-01" : "Assigned OPD Room",
      priorityLevel: "PRIORITY - SHUHADA FAMILY",
      notes: item.treatmentPlan ?? undefined,
    };
    setActiveSlip(slip);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="dashboard-page-heading text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-teal-500/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Department Desk View
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Live OPD / Reception Desk
              </span>
            </div>
            <h1 className="text-xl font-extrabold sm:text-2xl text-white">
              Doctor & Department Reception Queue
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-blue-100/90">
              Live tokens forwarded from the Main Helpdesk · Verify patient chit & mark attended
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white border border-white/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>{userHospitalName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filter Specialty / Dept:
          </span>
          <button
            onClick={() => setSelectedDeptFilter("all")}
            type="button"
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              selectedDeptFilter === "all"
                ? "bg-blue-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Counters ({queue.length})
          </button>
          {departmentOptions.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              type="button"
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                selectedDeptFilter === dept
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search patient, token, or card..."
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Queue List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-slate-50 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Active Beneficiary Queue ({filteredQueue.length})
          </h2>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Real-Time
            Sync
          </span>
        </div>

        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center">
            <Stethoscope className="mx-auto size-10 text-slate-400" />
            <h3 className="mt-2 text-sm font-bold text-slate-800">No Patients in this Queue</h3>
            <p className="mt-1 text-xs text-slate-500">
              When the Main Helpdesk books an appointment or issues a chit, it appears right here instantly.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredQueue.map((item) => {
              const isDone = item.finalStatus === "COMPLETED";
              const inProgress = item.finalStatus === "IN_CONSULTATION";
              const showTreatmentPlan = !isPharmacyOrNursing && item.treatmentPlan;

              return (
                <div
                  key={item.id}
                  className={`p-4 transition hover:bg-slate-50/80 flex flex-wrap items-center justify-between gap-4 ${
                    isDone ? "bg-slate-50/50 opacity-75" : ""
                  }`}
                >
                  {/* Left Column: Beneficiary & Martyr info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        #TK-{String(item.id).padStart(3, "0")}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.beneficiaryName}
                      </h4>
                      {item.beneficiaryRelationship && !isPharmacyOrNursing && (
                        <span className="text-xs text-slate-500 font-medium">
                          ({item.beneficiaryRelationship})
                        </span>
                      )}
                      <Badge
                        className={`text-[10px] uppercase tracking-wide ${
                          isPharmacyOrNursing
                            ? "bg-emerald-700 text-white"
                            : isDone
                            ? "bg-slate-600 text-white"
                            : inProgress
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-700 text-white"
                        }`}
                        >
                        {item.finalStatus || "Waiting in Queue"}
                      </Badge>
                    </div>

                    {!isPharmacyOrNursing && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        {item.shaheedName && (
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            <span>Family of Shaheed: <strong>{item.shaheedName}</strong></span>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                          <span>Card: <strong>{item.healthCardNo || item.familyRegistrationNo}</strong></span>
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(item.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                      </div>
                    )}

                    <div className="text-xs text-slate-700 mt-1">
                      <span className="font-semibold text-blue-950">Target Clinic:</span>{" "}
                      {item.department || "General Consultation"} ·{" "}
                      <span className="italic text-slate-600">
                        {item.consultant || "Assigned Consultant"}
                      </span>
                    </div>

                    {item.treatmentPlan && (!isPharmacyOrNursing ? (
                        <p className="text-[11px] text-slate-600 bg-slate-100/70 p-1.5 rounded mt-1 flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span>{item.treatmentPlan}</span>
                        </p>
                      ) : null)}
                  </div>

                  {/* Right Column: Reception Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReprintSlip(item)}
                      className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Slip</span>
                    </Button>

                    {role === "pharmacy_rep" && (
                      <Button
                        size="sm"
                        disabled={processingId === item.id || isDone}
                        onClick={() => handleUpdateStatus(item.id, "MEDS_DISPENSED")}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>Dispense Medicines</span>
                      </Button>
                    )}

                    {!isPharmacyOrNursing && (
                      <>
                        <Button
                          size="sm"
                          disabled={processingId === item.id || inProgress}
                          onClick={() => handleUpdateStatus(item.id, "IN_CONSULTATION")}
                          className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{inProgress ? "In Consultation" : "Call & Attend"}</span>
                        </Button>
                        <Button
                          size="sm"
                          disabled={processingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, "COMPLETED")}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slip Card */}
      <TokenSlipCard data={activeSlip} onClose={() => setActiveSlip(null)} onPrint={() => window.print()} />
    </div>
  );
}

"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HOSPITAL_FACILITIES, HospitalFacilityItem, FacilityCategory } from "@/lib/hospital-facilities";
import { TokenSlipCard, TokenSlipData } from "@/components/visits/token-slip-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, Stethoscope, Pill, FlaskConical, Scan, User, MapPin, Clock, Ticket, Smile } from "lucide-react";
import { extractFamilyCode } from "@/lib/family-code";

interface BeneficiaryItem {
  name: string;
  relationship: string;
  cnic?: string;
  cnicBForm?: string;
  fatherHusbandGuardian?: string | null;
  fatherName?: string | null;
  beneficiaryId?: string;
  cardStatus?: string;
  eligibility?: string;
}

export function FacilitationBookingView({
  defaultHospitalName,
  defaultHospitalId,
}: {
  defaultHospitalName: string;
  defaultHospitalId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search / Lookup state
  const initialCard = searchParams.get("card") ?? "";
  const [lookupQuery, setLookupQuery] = useState(initialCard);
  const [isSearchingCard, setIsSearchingCard] = useState(false);
  const [cardFound, setCardFound] = useState<boolean>(false);
  const [familyData, setFamilyData] = useState<{
    familyRegistrationNo: string;
    healthCardNo: string;
    shaheedName: string;
    shaheedFatherName?: string;
    beneficiaries: BeneficiaryItem[];
  } | null>(null);

  // Selected beneficiary from the family
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryItem | null>(null);

  // Facility filter tabs: all, doctor, pharmacy, lab, radiology
  const [activeCategory, setActiveCategory] = useState<"all" | FacilityCategory>("all");
  const [facilitySearch, setFacilitySearch] = useState("");

  // Booking / Token state
  const [selectedFacility, setSelectedFacility] = useState<HospitalFacilityItem | null>(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [tokenSlip, setTokenSlip] = useState<TokenSlipData | null>(null);

// Quick lookup function (scans QR or searches card/CNIC)
  const handleLookup = useCallback(async (q?: string) => {
    const term = (q ?? lookupQuery).trim();
    if (!term) {
      toast.error("Please enter a Card No, CNIC, or Family Reg No to search");
      return;
    }

    setIsSearchingCard(true);
    setCardFound(false);
    setFamilyData(null);
    setSelectedBeneficiary(null);

    try {
      const res = await fetch(`/api/visits/lookup?q=${encodeURIComponent(term)}`);
      if (!res.ok) {
        toast.error("No active card or registered martyr family found for this query.");
        return;
      }
      const data = await res.json();
      
      const benList: BeneficiaryItem[] = (data.members ?? []).map((m: any) => ({
        name: m.name,
        relationship: m.relationship ?? "",
        cnic: m.cnicBForm ?? "",
        beneficiaryId: m.beneficiaryId ?? "",
        eligibility: m.cardStatus ?? "Active",
        fatherHusbandGuardian: m.fatherHusbandGuardian ?? null,
      }));

      // If lookup returned a specific beneficiary
      if (benList.length === 0 && data.beneficiary) {
        benList.push({
          name: data.beneficiary.name,
          relationship: data.beneficiary.relationship,
          cnic: data.beneficiary.cnicBForm ?? "",
          eligibility: "Active",
          fatherHusbandGuardian: data.beneficiary.fatherHusbandGuardian ?? null,
        });
      }

      const fam = {
        familyRegistrationNo: data.family.registrationNo,
        healthCardNo: data.family.healthCardNo ?? "",
        shaheedName: data.family.shaheedName ?? "Honored Martyr",
        shaheedFatherName: data.family.shaheedFatherName ?? "",
        beneficiaries: benList,
      };

      setFamilyData(fam);
      setCardFound(true);
      if (benList.length > 0) {
        setSelectedBeneficiary(benList[0]);
      }
      toast.success(`Verified: Family of Shaheed ${fam.shaheedName}`);
    } catch {
      toast.error("Failed to connect to verification service. Please try again.");
    } finally {
      setIsSearchingCard(false);
    }
  }, [lookupQuery]);

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return HOSPITAL_FACILITIES.filter((f) => {
      const matchesCat = activeCategory === "all" || f.category === activeCategory;
      const q = facilitySearch.toLowerCase();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.specialityOrType.toLowerCase().includes(q) ||
        (f.doctorName && f.doctorName.toLowerCase().includes(q)) ||
        f.roomOrCounter.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, facilitySearch]);

  // Book appointment & generate token/parchi
  const handleBookAppointment = async () => {
    if (!familyData || !selectedBeneficiary || !selectedFacility) {
      toast.error("Please select a beneficiary and a facility/doctor to proceed");
      return;
    }

    setIsBooking(true);
    try {
      // Map category to nature of healthcare
      const natureMap: Record<FacilityCategory, string> = {
        dental: "Dental Consultation / Procedure",
        doctor: "Specialist Consultation",
        pharmacy: "Medicines",
        lab: "Laboratory",
        radiology: "Radiology",
      };

      const payload = {
        familyRegistrationNo: familyData.familyRegistrationNo,
        healthCardNo: familyData.healthCardNo,
        hospitalId: defaultHospitalId,
        beneficiaryName: selectedBeneficiary.name,
        beneficiaryRelationship: selectedBeneficiary.relationship,
        beneficiaryCnicBForm: selectedBeneficiary.cnic || null,
        shaheedName: familyData.shaheedName,
        verification: "VERIFIED" as const,
        natureOfHealthcare: [natureMap[selectedFacility.category]],
        department: selectedFacility.specialityOrType,
        consultant: selectedFacility.doctorName || selectedFacility.name,
        treatmentPlan: `Token generated at Helpdesk for: ${selectedFacility.name} (${selectedFacility.roomOrCounter}). Notes: ${bookingNotes || "Direct Helpdesk Booking"}`,
        finalStatus: "TOKEN_ISSUED",
      };

      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to book appointment");
      }

      const resData = await res.json();
      const tokenNumber = `#TK-${String(resData.id ?? Math.floor(100 + Math.random() * 900)).padStart(3, "0")}`;

      const slipCategoryMap: Record<FacilityCategory, TokenSlipData["category"]> = {
        dental: "Dental Department",
        doctor: "Doctor / OPD",
        pharmacy: "Pharmacy",
        lab: "Laboratory",
        radiology: "Radiology / Imaging",
      };

      const fatherCandidate =
        selectedBeneficiary.fatherHusbandGuardian ||
        selectedBeneficiary.fatherName ||
        (selectedBeneficiary.relationship?.toLowerCase().includes("son") ||
        selectedBeneficiary.relationship?.toLowerCase().includes("daughter") ||
        selectedBeneficiary.relationship?.toLowerCase().includes("child")
          ? familyData.shaheedName
          : selectedBeneficiary.relationship?.toLowerCase().includes("spouse") ||
            selectedBeneficiary.relationship?.toLowerCase().includes("wife") ||
            selectedBeneficiary.relationship?.toLowerCase().includes("widow")
          ? `${familyData.shaheedName} (Husband)`
          : familyData.shaheedFatherName || familyData.shaheedName || "—");

      const slip: TokenSlipData = {
        tokenNo: tokenNumber,
        visitNo: resData.visitNo,
        dateTime: new Date().toLocaleString("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        hospitalName: defaultHospitalName,
        familyRegistrationNo: familyData.familyRegistrationNo,
        familyCode: extractFamilyCode({ registrationNo: familyData.familyRegistrationNo }),
        healthCardNo: familyData.healthCardNo,
        shaheedName: familyData.shaheedName,
        shaheedFatherName: familyData.shaheedFatherName,
        beneficiaryName: selectedBeneficiary.name,
        patientName: selectedBeneficiary.name,
        fatherName: fatherCandidate,
        beneficiaryFatherName: fatherCandidate,
        beneficiaryRelationship: selectedBeneficiary.relationship,
        beneficiaryCnic: selectedBeneficiary.cnic,
        category: slipCategoryMap[selectedFacility.category],
        departmentName: selectedFacility.specialityOrType,
        doctorOrIncharge: selectedFacility.doctorName || selectedFacility.name,
        doctorReferred: selectedFacility.doctorName || selectedFacility.name,
        roomOrCounter: selectedFacility.roomOrCounter,
        priorityLevel: "PRIORITY - SHUHADA FAMILY",
        notes: bookingNotes,
      };

      setTokenSlip(slip);
      toast.success(`Token ${tokenNumber} booked successfully!`);
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : "Something went wrong while booking";
      toast.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="dashboard-page-heading text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-emerald-600/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Main Helpdesk
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Hospital Facilitation Counter
              </span>
            </div>
            <h1 className="text-xl font-extrabold sm:text-2xl text-white">
              Shuhada Facilitation & Token Desk
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-blue-100/90">
              Scan Card $\rightarrow$ Select Department (Doctor, Lab, Pharmacy, Radiology) $\rightarrow$ Book Appointment & Print Parchi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/department-reception")}
              className="bg-white/10 text-white hover:bg-white/20 border-white/30 text-xs font-semibold"
            >
              Go to Reception Queue $\rightarrow$
            </Button>
          </div>
        </div>
      </div>

      {/* Step 1: Scan & Verify Beneficiary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
            1
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-950">
            Scan Health Card or Enter Details
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[280px]">
            <Input
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter Health Card No (e.g. HC-DHQ-...), CNIC, or Family Reg No..."
              className="h-10 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLookup();
                }
              }}
            />
          </div>
          <Button
            onClick={() => handleLookup()}
            disabled={isSearchingCard}
            className="h-10 bg-blue-900 hover:bg-blue-950 text-white font-semibold px-5 flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            {isSearchingCard ? "Verifying..." : "Search & Verify"}
          </Button>
        </div>

        {/* Verification Result Card */}
        {cardFound && familyData && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Verified Shuhada Family Record
                </span>
                <h3 className="text-base font-extrabold text-emerald-950">
                  Family of Shaheed {familyData.shaheedName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-700 text-white text-xs">
                  Card: {familyData.healthCardNo || "Digital ID"}
                </Badge>
                <Badge variant="outline" className="border-emerald-600 text-emerald-800 text-xs font-mono">
                  Reg: {familyData.familyRegistrationNo}
                </Badge>
              </div>
            </div>

            {/* Select Which Family Member is Visiting */}
            <div className="mt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                Select Patient / Visiting Family Member:
              </label>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {familyData.beneficiaries.map((b, idx) => {
                  const isSelected = selectedBeneficiary?.name === b.name;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedBeneficiary(b)}
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-white ring-2 ring-emerald-500 shadow-sm"
                          : "border-emerald-200 bg-emerald-50/40 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-bold text-slate-900">{b.name}</span>
                        {isSelected && (
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">Relation: {b.relationship}</p>
                      {b.cnic && <p className="text-[11px] text-slate-500 font-mono">CNIC: {b.cnic}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Select Hospital Facility / Doctor */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wide text-blue-950">
              Select Facilitation Counter / Doctor
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {(
              [
                { id: "all", label: "All Services", icon: null },
                { id: "dental", label: "Dental Department", icon: Smile },
                { id: "doctor", label: "Doctors & OPD", icon: Stethoscope },
                { id: "pharmacy", label: "Pharmacy", icon: Pill },
                { id: "lab", label: "Laboratory", icon: FlaskConical },
                { id: "radiology", label: "Radiology & X-Ray", icon: Scan },
              ] as const
            ).map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as "all" | "dental" | "doctor" | "pharmacy" | "lab" | "radiology")}
                  type="button"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                    activeCategory === tab.id
                      ? "bg-white text-blue-950 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {TabIcon && <TabIcon className="w-3.5 h-3.5" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search inside facilities */}
        <div className="mb-4">
          <Input
            value={facilitySearch}
            onChange={(e) => setFacilitySearch(e.target.value)}
            placeholder="Search doctor name (e.g. Dental Surgeon, Dr. Farhan), room, test, or facility..."
            className="h-9 text-xs"
          />
        </div>

        {/* Facilities Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => {
            const isSelected = selectedFacility?.id === facility.id;
            return (
              <div
                key={facility.id}
                onClick={() => setSelectedFacility(facility)}
                className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
                  isSelected
                    ? "border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-600 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      facility.category === "dental"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : facility.category === "doctor"
                        ? "bg-purple-100 text-purple-800"
                        : facility.category === "pharmacy"
                        ? "bg-emerald-100 text-emerald-800"
                        : facility.category === "lab"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {facility.category === "dental"
                      ? "Dental Department"
                      : facility.category === "doctor"
                      ? "Doctor / Clinic"
                      : facility.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ● {facility.status}
                  </span>
                </div>

                <h4 className="mt-2 text-sm font-bold text-slate-900">{facility.name}</h4>
                <p className="text-xs font-semibold text-blue-900 mt-0.5">
                  {facility.specialityOrType}
                </p>

                {facility.doctorName && (
                  <p className="mt-1 text-xs text-slate-700 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{facility.doctorName}</span>
                  </p>
                )}

                <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <strong className="text-slate-700">{facility.roomOrCounter}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{facility.availableTiming} ({facility.daysAvailable})</span>
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Confirmation & Book Parchi / Chit */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
            3
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-950">
            Confirm & Issue Token Slip (Parchi)
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-start">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Optional Helpdesk Notes / Chief Complaints:
            </label>
            <Input
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              placeholder="e.g. Skin rash, chronic follow up, routine check..."
              className="text-xs"
            />
            <p className="text-[11px] text-slate-500">
              Upon clicking issue, this appointment will instantly appear in the doctor or department reception queue.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Summary for Slip:
            </h4>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p>
                <strong className="text-slate-900">Patient:</strong>{" "}
                {selectedBeneficiary ? (
                  <span className="text-emerald-800 font-bold">
                    {selectedBeneficiary.name} ({selectedBeneficiary.relationship})
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">Please select patient above</span>
                )}
              </p>
              <p>
                <strong className="text-slate-900">Destination:</strong>{" "}
                {selectedFacility ? (
                  <span className="text-blue-900 font-bold">
                    {selectedFacility.name} — {selectedFacility.roomOrCounter}
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">Please select facility above</span>
                )}
              </p>
            </div>

            <Button
              onClick={handleBookAppointment}
              disabled={!familyData || !selectedBeneficiary || !selectedFacility || isBooking}
              className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 shadow-sm flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              {isBooking ? "Generating Slip..." : "Book Appointment & Print Parchi (Chit)"}
            </Button>
          </div>
        </div>
      </div>

      {/* Inline Token Slip Card */}
      <TokenSlipCard data={tokenSlip} onClose={() => setTokenSlip(null)} onPrint={() => window.print()} />
    </div>
  );
}

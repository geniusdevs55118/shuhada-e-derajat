/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, PdfHeader, PdfFooter, Row, SectionTitle, pdfStyles } from "./shared";

export function VisitAnnexureBPdf({ visit }: { visit: Record<string, unknown> }) {
  const v = visit as Record<string, any>;
  const natures = Array.isArray(v.natureOfHealthcare) ? (v.natureOfHealthcare as string[]).join(", ") : "";
  const flags = (v.emergencyFlags ?? {}) as Record<string, unknown>;
  const isEmergency = flags.emergencyCase === true || v.verification === "EMERGENCY_VERIFICATION_IN_PROCESS";
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <PdfHeader title={isEmergency ? "Annexure-B: Healthcare Facilitation / Patient Visit (EMERGENCY)" : "Annexure-B: Healthcare Facilitation / Patient Visit"} />
        <SectionTitle>Header</SectionTitle>
        <Row label="Visit No" value={v.visitNo} />
        <Row label="Date / Time" value={v.dateTime ? new Date(v.dateTime).toLocaleString() : null} />
        <Row label="Family Reg No" value={v.familyRegistrationNo} />
        <Row label="Health Card No" value={v.healthCardNo} />
        <SectionTitle>A. Beneficiary Particulars</SectionTitle>
        <Row label="Name" value={v.beneficiaryName} />
        <Row label="Father / Spouse / Guardian" value={v.beneficiaryFatherHusbandGuardian} />
        <Row label="CNIC / B-Form" value={v.beneficiaryCnicBForm} />
        <Row label="Relationship" value={v.beneficiaryRelationship} />
        <Row label="Mobile" value={v.beneficiaryMobile} />
        <Row label="Name of Shaheed" value={v.shaheedName} />
        <Row label="Verification" value={v.verification} />
        <SectionTitle>B. Hospital / Health Desk</SectionTitle>
        <Row label="Hospital ID" value={String(v.hospitalId ?? "")} />
        <Row label="Facilitation Officer" value={v.facilitationOfficer} />
        <SectionTitle>C. Nature of Healthcare Required</SectionTitle>
        <Text>{natures || "-"}</Text>
        <SectionTitle>D. Clinical Facilitation</SectionTitle>
        <Row label="Department" value={v.department} />
        <Row label="Consultant" value={v.consultant} />
        <Row label="OPD / MR No" value={v.opdMrNo} />
        <Row label="Diagnosis" value={v.diagnosis} />
        <Row label="Advice / Plan" value={v.treatmentPlan} />
        <Row label="Follow-up Date" value={v.followUpDate ? new Date(v.followUpDate).toLocaleDateString() : null} />
        <SectionTitle>{`E. Diagnostic Facilitation (Status: ${v.investigationsStatus ?? "-"})`}</SectionTitle>
        <Text>{Object.keys(v.diagnostics ?? {}).filter((k) => (v.diagnostics as Record<string, boolean>)[k]).join(", ") || "-"}</Text>
        <SectionTitle>F. Medicines / Pharmacy</SectionTitle>
        <Text>{Object.keys(v.medicinesFlags ?? {}).filter((k) => (v.medicinesFlags as Record<string, boolean>)[k]).join(", ") || "-"}</Text>
        {v.medicinesRemarks ? <Row label="Remarks" value={v.medicinesRemarks} /> : null}
        <SectionTitle>G. Admission / Procedure / Surgery</SectionTitle>
        <Row label="Ward" value={v.ward} />
        <Row label="Procedure" value={v.procedureName} />
        <Row label="Status" value={v.procedureStatus} />
        <SectionTitle>H. Sehat Card Plus Facilitation</SectionTitle>
        <Text>{Object.keys(v.sehatFlags ?? {}).filter((k) => (v.sehatFlags as Record<string, boolean>)[k]).join(", ") || "-"}</Text>
        <Row label="Case Reference" value={v.sehatCaseRef} />
        <SectionTitle>I. Emergency Facilitation</SectionTitle>
        <Row label="Emergency Case" value={flags.emergencyCase ? "Yes" : "No"} />
        <Row label="Triage Completed" value={flags.triageCompleted ? "Yes" : "No"} />
        <Row label="Immediate Treatment Initiated" value={flags.immediateTreatmentInitiated ? "Yes" : "No"} />
        <SectionTitle>J. Ambulance / Referral</SectionTitle>
        <Row label="Ambulance From/To" value={v.ambulanceFromTo} />
        <Row label="Referral Facility" value={v.referralFacility} />
        <Row label="Reason" value={v.referralReason} />
        <SectionTitle>K. Health Desk Action & Outcome</SectionTitle>
        <Row label="Issue" value={v.issueEncountered} />
        <Row label="Action Taken" value={v.actionTaken} />
        <Row label="Final Status" value={v.finalStatus} />
        <SectionTitle>L. Feedback</SectionTitle>
        <Row label="Comments" value={v.feedbackComments} />
        <SectionTitle>M. Certification</SectionTitle>
        <Row label="Officer" value={v.certOfficer} />
        <Row label="Designation" value={v.certDesignation} />
        <View style={pdfStyles.sigRow}>
          <Text style={pdfStyles.sig}>Health Desk Focal Person</Text>
          <Text style={pdfStyles.sig}>Beneficiary</Text>
          <Text style={pdfStyles.sig}>Hospital Representative</Text>
        </View>
        <PdfFooter />
      </Page>
    </Document>
  );
}

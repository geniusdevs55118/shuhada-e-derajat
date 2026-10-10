/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, PdfHeader, PdfFooter, Row, SectionTitle, pdfStyles } from "./shared";

export function GrievanceAnnexureEPdf({ grievance }: { grievance: Record<string, unknown> }) {
  const g = grievance as Record<string, any>;
  const picked = (obj: Record<string, boolean> | null | undefined) =>
    Object.keys(obj ?? {}).filter((k) => (obj as Record<string, boolean>)[k]).join(", ") || "-";
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <PdfHeader title={`Annexure-E: Grievance & Rapid Escalation ${g.isRedAlert ? "(RED ALERT)" : ""}`} />
        <SectionTitle>{`Priority: ${g.priority}`}</SectionTitle>
        <SectionTitle>A. Beneficiary Details</SectionTitle>
        <Row label="Name" value={g.beneficiaryName} />
        <Row label="Reg No" value={g.familyRegistrationNo} />
        <Row label="Card No" value={g.healthCardNo} />
        <Row label="CNIC" value={g.cnicBForm} />
        <Row label="Relationship" value={g.relationshipWithShaheed} />
        <Row label="Shaheed" value={g.shaheedName} />
        <Row label="Contact" value={g.contactNo} />
        <SectionTitle>B. Hospital / Service Point</SectionTitle>
        <Row label="Department" value={g.department} />
        <Row label="Health Desk" value={g.healthDesk} />
        <Row label="Date/Time" value={g.incidentDateTime ? new Date(g.incidentDateTime).toLocaleString() : null} />
        <SectionTitle>C. Nature of Grievance</SectionTitle>
        <Text>{picked(g.natureFlags)}</Text>
        <SectionTitle>D. Brief Description</SectionTitle>
        <Text>{g.issueDescription ?? "-"}</Text>
        <Row label="Immediate healthcare need" value={g.immediateHealthcareNeed === true ? "Yes" : g.immediateHealthcareNeed === false ? "No" : null} />
        <Row label="Delay may affect care" value={g.delayMayAffectCare === true ? "Yes" : g.delayMayAffectCare === false ? "No" : null} />
        <SectionTitle>E. Rapid Escalation Screen</SectionTitle>
        <Row label="RED" value={picked(g.redFlags)} />
        <Row label="AMBER" value={picked(g.amberFlags)} />
        <Row label="GREEN" value={picked(g.greenFlags)} />
        <SectionTitle>H. Clinical Safeguard</SectionTitle>
        <Text>Emergency care and immediate clinical assessment shall not be delayed while this grievance is processed.</Text>
        <SectionTitle>I. Action / Resolution</SectionTitle>
        <Row label="Action Taken" value={g.actionTaken} />
        <Row label="Outcome" value={g.outcome} />
        <SectionTitle>J. Beneficiary Confirmation</SectionTitle>
        <Row label="Explained" value={g.issueExplainedAppropriately === true ? "Yes" : g.issueExplainedAppropriately === false ? "No" : null} />
        <Row label="Facilitation Provided" value={g.facilitationProvided} />
        <Row label="Comments" value={g.beneficiaryComments} />
        <SectionTitle>K. Root Cause & Corrective Action</SectionTitle>
        <Row label="Root Cause" value={g.rootCause} />
        <Row label="Corrective Action" value={g.correctiveAction} />
        <Row label="Status" value={g.actionCompleted} />
        <SectionTitle>L. Working Group Review</SectionTitle>
        <Row label="Review Required" value={g.requiresWorkingGroupReview === true ? "Yes" : g.requiresWorkingGroupReview === false ? "No" : null} />
        <Row label="Reviewed By" value={g.reviewedBy} />
        <Row label="Directions" value={g.furtherDirections} />
        <SectionTitle>M. Closure</SectionTitle>
        <Row label="Closure Status" value={g.closureStatus} />
        <Row label="Closed By" value={g.closedBy} />
        <Row label="Date" value={g.closureDate} />
        <View style={pdfStyles.sigRow}>
          <Text style={pdfStyles.sig}>Health Desk Focal Person</Text>
          <Text style={pdfStyles.sig}>Medical Superintendent</Text>
          <Text style={pdfStyles.sig}>Hospital Director</Text>
        </View>
        <PdfFooter />
      </Page>
    </Document>
  );
}

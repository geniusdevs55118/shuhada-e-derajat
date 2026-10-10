/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, PdfHeader, PdfFooter, Row, SectionTitle, pdfStyles } from "./shared";

export function MonthlyReportAnnexureDPdf({ report }: { report: Record<string, unknown> }) {
  const r = report as Record<string, any>;
  const stats = (r.statsSnapshot ?? {}) as Record<string, any>;
  const sb = (stats.sectionB ?? {}) as Record<string, number | null>;
  const sc = (stats.sectionC ?? {}) as { totalVisits?: number; byService?: Record<string, number> };
  const sd = (stats.sectionD ?? {}) as Record<string, number>;
  const se = (stats.sectionE ?? {}) as Record<string, number>;
  const sf = (stats.sectionF ?? {}) as Record<string, number>;
  const sg = (stats.sectionG ?? {}) as Record<string, number>;
  const si = (stats.sectionI ?? {}) as Record<string, number>;
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <PdfHeader title={`Annexure-D: Monthly Monitoring, Evaluation & Facilitation Report - ${r.month}/${r.year}`} />
        <Row label="Report No" value={r.reportNo} />
        <Row label="Hospital" value={r.isConsolidated ? "Consolidated (All Hospitals)" : r.hospitalName ?? String(r.hospitalId ?? "")} />
        <Row label="Health Desk Focal Person" value={r.healthDeskFocalPerson} />
        <SectionTitle>B. Registration / Verification</SectionTitle>
        <Row label="Total Families Registered" value={sb.totalFamiliesRegistered != null ? String(sb.totalFamiliesRegistered) : null} />
        <Row label="New This Month" value={sb.newFamiliesThisMonth != null ? String(sb.newFamiliesThisMonth) : null} />
        <Row label="Verified Beneficiaries" value={sb.totalVerifiedBeneficiaries != null ? String(sb.totalVerifiedBeneficiaries) : null} />
        <Row label="Health Cards Issued" value={sb.healthCardsIssuedThisMonth != null ? String(sb.healthCardsIssuedThisMonth) : null} />
        <Row label="Digital / QR Active" value={sb.digitalQrRecordsActive != null ? String(sb.digitalQrRecordsActive) : null} />
        <Row label="Pending Verification" value={sb.casesPendingVerification != null ? String(sb.casesPendingVerification) : null} />
        <SectionTitle>{`C. Healthcare Utilization (Total visits: ${sc.totalVisits ?? 0})`}</SectionTitle>
        {Object.entries(sc.byService ?? {}).map(([k, v]) => (v as number) > 0 ? <Row key={k} label={k} value={String(v)} /> : null)}
        <SectionTitle>D. Sehat Card Plus Facilitation</SectionTitle>
        <Row label="Beneficiaries Facilitated" value={sd.beneficiariesFacilitated != null ? String(sd.beneficiariesFacilitated) : null} />
        <Row label="Claims Approved" value={sd.claimsApproved != null ? String(sd.claimsApproved) : null} />
        <Row label="Pending" value={sd.claimsPending != null ? String(sd.claimsPending) : null} />
        <Row label="Not Covered" value={sd.notCovered != null ? String(sd.notCovered) : null} />
        <SectionTitle>E. Emergency & Priority</SectionTitle>
        <Row label="Emergency Cases" value={se.emergencyCasesReceived != null ? String(se.emergencyCasesReceived) : null} />
        <Row label="Treated Before Verification" value={se.treatedBeforeVerification != null ? String(se.treatedBeforeVerification) : null} />
        <SectionTitle>F. Ambulance & Referral</SectionTitle>
        <Row label="Ambulance Cases" value={sf.ambulanceCases != null ? String(sf.ambulanceCases) : null} />
        <Row label="Referrals" value={sf.referrals != null ? String(sf.referrals) : null} />
        <SectionTitle>G. Health Desk Performance</SectionTitle>
        <Row label="Approached" value={sg.beneficiariesApproached != null ? String(sg.beneficiariesApproached) : null} />
        <Row label="Resolved" value={sg.casesResolved != null ? String(sg.casesResolved) : null} />
        <Row label="Escalated" value={sg.casesEscalated != null ? String(sg.casesEscalated) : null} />
        <SectionTitle>I. Grievance Redressal</SectionTitle>
        <Row label="Total" value={si.totalReceived != null ? String(si.totalReceived) : null} />
        <Row label="Resolved" value={si.resolved != null ? String(si.resolved) : null} />
        <Row label="Pending" value={si.pending != null ? String(si.pending) : null} />
        <Row label="Urgent" value={si.urgentCases != null ? String(si.urgentCases) : null} />
        <Row label="Red Alerts" value={si.redAlerts != null ? String(si.redAlerts) : null} />
        <SectionTitle>J. Service Gaps & Bottlenecks</SectionTitle>
        <Text>{Object.keys(r.serviceGapFlags ?? {}).filter((k) => (r.serviceGapFlags as any)[k]).join(", ") || "-"}</Text>
        <Row label="Root Cause" value={r.rootCauseExplanation} />
        <Row label="Corrective Action" value={r.correctiveActionRequired} />
        <SectionTitle>K. Serious / Exceptional Case</SectionTitle>
        <Row label="Reported" value={r.exceptionalCaseReported === true ? "Yes" : r.exceptionalCaseReported === false ? "No" : null} />
        <Row label="Reference" value={r.exceptionalCaseReferenceNo} />
        <Row label="Description" value={r.exceptionalCaseDescription} />
        <SectionTitle>L. Working Group Review</SectionTitle>
        <Row label="Achievements" value={r.achievements} />
        <Row label="Challenges" value={r.challenges} />
        <Row label="Corrective Measures" value={r.correctiveMeasures} />
        <Row label="Recommendations" value={r.recommendationsForHospitalDirector} />
        <SectionTitle>N. Certification</SectionTitle>
        <Row label="Focal Person" value={r.focalPersonSignature} />
        <Row label="Hospital Representative" value={r.hospitalRepresentativeSignature} />
        <Row label="Chairman Comments" value={r.chairmanComments} />
        <Row label="Director Directions" value={r.directorDirectionsSignature} />
        <View style={pdfStyles.sigRow}>
          <Text style={pdfStyles.sig}>Health Desk Focal Person</Text>
          <Text style={pdfStyles.sig}>Hospital Representative</Text>
          <Text style={pdfStyles.sig}>Hospital Director</Text>
        </View>
        <PdfFooter />
      </Page>
    </Document>
  );
}

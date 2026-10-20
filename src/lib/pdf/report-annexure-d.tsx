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
        <Row label="Help Desk Representative" value={r.healthDeskFocalPerson} />
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
        <Row label="Major Issues" value={r.sehatMajorIssues} />
        <Row label="Corrective Action" value={r.sehatCorrectiveAction} />
        <SectionTitle>E. Emergency & Priority</SectionTitle>
        <Row label="Emergency Cases" value={se.emergencyCasesReceived != null ? String(se.emergencyCasesReceived) : null} />
        <Row label="Treated Before Verification" value={se.treatedBeforeVerification != null ? String(se.treatedBeforeVerification) : null} />
        <Row label="Delay Cases" value={se.delaysReported != null ? String(se.delaysReported) : null} />
        <Row label="Reason for Delay" value={r.emergencyDelayReason} />
        <Row label="Corrective Action" value={r.emergencyCorrectiveAction} />
        <SectionTitle>F. Ambulance & Referral</SectionTitle>
        <Row label="Ambulance Cases" value={sf.ambulanceCases != null ? String(sf.ambulanceCases) : null} />
        <Row label="Referrals" value={sf.referrals != null ? String(sf.referrals) : null} />
        <SectionTitle>G. Health Desk Performance</SectionTitle>
        <Row label="Approached" value={sg.beneficiariesApproached != null ? String(sg.beneficiariesApproached) : null} />
        <Row label="Resolved" value={sg.casesResolved != null ? String(sg.casesResolved) : null} />
        <Row label="Escalated" value={sg.casesEscalated != null ? String(sg.casesEscalated) : null} />
        <Row label="Major Operational Issues" value={r.majorOperationalIssues} />
        <SectionTitle>H. Beneficiary Experience & Dignity</SectionTitle>
        <Row label="Dignity Complaints - Action Taken" value={r.dignityComplaintsActionTaken} />
        <SectionTitle>I. Grievance Redressal</SectionTitle>
        <Row label="Total" value={si.totalReceived != null ? String(si.totalReceived) : null} />
        <Row label="Resolved" value={si.resolved != null ? String(si.resolved) : null} />
        <Row label="Pending" value={si.pending != null ? String(si.pending) : null} />
        <Row label="Urgent" value={si.urgentCases != null ? String(si.urgentCases) : null} />
        <Row label="Red Alerts" value={si.redAlerts != null ? String(si.redAlerts) : null} />
        <Row label="Major Nature" value={r.majorGrievanceNature} />
        <Row label="Corrective / Preventive Action" value={r.grievanceCorrectiveAction} />
        <SectionTitle>J. Service Gaps & Bottlenecks</SectionTitle>
        <Text>{Object.keys(r.serviceGapFlags ?? {}).filter((k) => (r.serviceGapFlags as any)[k]).join(", ") || "-"}</Text>
        <Row label="Root Cause" value={r.rootCauseExplanation} />
        <Row label="Corrective Action" value={r.correctiveActionRequired} />
        <SectionTitle>K. Serious / Exceptional Case</SectionTitle>
        <Row label="Reported" value={r.exceptionalCaseReported === true ? "Yes" : r.exceptionalCaseReported === false ? "No" : null} />
        <Row label="Reference" value={r.exceptionalCaseReferenceNo} />
        <Row label="Description" value={r.exceptionalCaseDescription} />
        <Row label="Immediate Action" value={r.exceptionalCaseImmediateAction} />
        <Row label="Further Action" value={r.exceptionalCaseFurtherAction} />
        <SectionTitle>L. Working Group Review</SectionTitle>
        <Row label="Achievements" value={r.achievements} />
        <Row label="Challenges" value={r.challenges} />
        <Row label="Corrective Measures" value={r.correctiveMeasures} />
        <Row label="Recommendations" value={r.recommendationsForHospitalDirector} />
        <SectionTitle>O. KPI Table</SectionTitle>
        <KpiTable indicators={(r.indicators ?? []) as { indicator?: string; target?: string | null; achievement?: string | null; status?: string | null; remarks?: string | null }[]} />
        <SectionTitle>N. Certification</SectionTitle>
        <Row label="Focal Person" value={r.focalPersonSignature} />
        <Row label="Hospital Representative" value={r.hospitalRepresentativeSignature} />
        <Row label="Chairman Comments" value={r.chairmanComments} />
        <Row label="Director Directions" value={r.directorDirectionsSignature} />
        <View style={pdfStyles.sigRow}>
          <Text style={pdfStyles.sig}>Help Desk Representative</Text>
          <Text style={pdfStyles.sig}>Hospital Representative</Text>
          <Text style={pdfStyles.sig}>Hospital Director</Text>
        </View>
        <PdfFooter />
      </Page>
    </Document>
  );
}

const KPI_HEADER_STYLE = {
  flexDirection: "row" as const,
  backgroundColor: "#f1f5f9",
  borderBottomWidth: 1,
  borderBottomColor: "#cbd5e1",
  paddingVertical: 4,
};

const KPI_CELL = { fontSize: 7.5, paddingHorizontal: 3 };
const KPI_HEAD = { ...KPI_CELL, fontWeight: "bold" as const };

function KpiTable({
  indicators,
}: {
  indicators: { indicator?: string; target?: string | null; achievement?: string | null; status?: string | null; remarks?: string | null }[];
}) {
  if (indicators.length === 0) return <Text>-</Text>;
  return (
    <View style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4, marginBottom: 8 }}>
      <View style={KPI_HEADER_STYLE}>
        <Text style={{ ...KPI_HEAD, width: "22%" }}>Indicator</Text>
        <Text style={{ ...KPI_HEAD, width: "14%" }}>Target</Text>
        <Text style={{ ...KPI_HEAD, width: "30%" }}>Achievement</Text>
        <Text style={{ ...KPI_HEAD, width: "16%" }}>Status</Text>
        <Text style={{ ...KPI_HEAD, width: "18%" }}>Remarks</Text>
      </View>
      {indicators.map((row, index) => (
        <View
          key={`${row.indicator}-${index}`}
          style={{
            flexDirection: "row",
            paddingVertical: 4,
            borderBottomWidth: index === indicators.length - 1 ? 0 : 1,
            borderBottomColor: "#e2e8f0",
          }}
        >
          <Text style={{ ...KPI_CELL, width: "22%", fontWeight: "bold" }}>{row.indicator ?? "—"}</Text>
          <Text style={{ ...KPI_CELL, width: "14%" }}>{row.target || "—"}</Text>
          <Text style={{ ...KPI_CELL, width: "30%" }}>{row.achievement || "—"}</Text>
          <Text style={{ ...KPI_CELL, width: "16%", color: row.status === "Needs Attention" ? "#b45309" : "#166534" }}>
            {row.status ?? "On Track"}
          </Text>
          <Text style={{ ...KPI_CELL, width: "18%" }}>{row.remarks || "—"}</Text>
        </View>
      ))}
    </View>
  );
}

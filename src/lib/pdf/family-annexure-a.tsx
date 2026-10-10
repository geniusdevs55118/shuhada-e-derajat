/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, pdfStyles, PdfHeader, PdfFooter, Row, SectionTitle } from "@/lib/pdf/shared";
import { maskCnic } from "@/lib/cnic";

export function FamilyRegistrationPdf({ family }: { family: any }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <PdfHeader title="ANNEXURE-A: FAMILY REGISTRATION & VERIFICATION FORM" />
        <SectionTitle>A. Particulars of Shaheed</SectionTitle>
        <Row label="Registration No." value={family.registrationNo} />
        <Row label="Name of Shaheed" value={family.shaheedName} />
        <Row label="Father's Name" value={family.shaheedFatherName} />
        <Row label="CNIC" value={maskCnic(family.shaheedCnic)} />
        <Row label="Service No." value={family.shaheedServiceNo} />
        <Row label="Rank" value={family.shaheedRank} />
        <Row label="Department / Unit" value={`${family.shaheedDepartment ?? ""} ${family.shaheedUnit ?? ""}`.trim() || null} />
        <Row label="Date of Shahadat" value={family.shaheedDateOfShahadat ? new Date(family.shaheedDateOfShahadat).toLocaleDateString() : null} />
        <Row label="Shahadat Certificate No." value={family.shahadatCertificateNo} />

        <SectionTitle>B. Contact Details of Next-of-Kin</SectionTitle>
        <Row label="Name" value={family.contactName} />
        <Row label="Relationship" value={family.contactRelationship} />
        <Row label="CNIC" value={maskCnic(family.contactCnic)} />
        <Row label="Mobile" value={family.contactMobile} />
        <Row label="Address" value={family.contactPresentAddress} />

        <SectionTitle>C. Beneficiary Master List</SectionTitle>
        {(family.members ?? []).map((m: any) => (
          <Row key={m.id} label={`${m.serialNo}. ${m.name}`} value={`${m.relationship} | Beneficiary ID: ${m.beneficiaryId ?? "—"} | ${m.cardStatus ?? "—"}`} />
        ))}

        <SectionTitle>D. Documents Submitted</SectionTitle>
        <Row label="Documents" value={Array.isArray(family.documentsSubmitted) ? family.documentsSubmitted.join(", ") : null} />

        <SectionTitle>E. Verification</SectionTitle>
        <Row label="Status" value={family.verificationStatus} />
        <Row label="Reference No." value={family.verificationRefNo} />
        <Row label="Authority" value={family.verificationAuthority} />
        <Row label="Verified By" value={family.verifiedBy} />
        <Row label="Remarks" value={family.verificationRemarks} />

        <SectionTitle>F. Family Health Card Registration</SectionTitle>
        <Row label="Health Card No." value={family.healthCardNo} />
        <Row label="QR / Digital Verification ID" value={family.cardQrVerificationId} />
        <Row label="Date of Issue" value={family.cardDateOfIssue ? new Date(family.cardDateOfIssue).toLocaleDateString() : null} />
        <Row label="Physical Card Issued" value={family.cardPhysicalIssued ? "Yes" : "No"} />
        <Row label="Beneficiaries Linked" value={family.cardBeneficiariesLinked ? "Yes" : "No"} />

        <SectionTitle>G. Hospital Access</SectionTitle>
        <Row label="DHQ Hospital" value={family.hospitalAccessDHQ ? "Yes" : "No"} />
        <Row label="MMMTH" value={family.hospitalAccessMMMTH ? "Yes" : "No"} />
        <Row label="Women & Children Hospital" value={family.hospitalAccessWC ? "Yes" : "No"} />

        <SectionTitle>H. Declaration by Applicant</SectionTitle>
        <Row label="Applicant" value={family.applicantName} />
        <Row label="Date" value={family.declarationDate ? new Date(family.declarationDate).toLocaleDateString() : null} />

        <SectionTitle>I. Authorization</SectionTitle>
        <Row label="Decision" value={family.authorizationDecision} />
        <Row label="Authorised Officer" value={family.authorizedOfficer} />
        <Row label="Designation" value={family.authorizedDesignation} />
        <Row label="Date" value={family.authorizationDate ? new Date(family.authorizationDate).toLocaleDateString() : null} />

        <View style={pdfStyles.sigRow}>
          <Text style={pdfStyles.sig}>Health Desk Focal Person</Text>
          <Text style={pdfStyles.sig}>Additional Hospital Director</Text>
          <Text style={pdfStyles.sig}>Applicant / Next of Kin</Text>
        </View>
        <PdfFooter />
      </Page>
    </Document>
  );
}

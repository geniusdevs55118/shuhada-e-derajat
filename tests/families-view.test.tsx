import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Role } from "@prisma/client";
import { FamiliesView, type FamilyListRow } from "@/components/families/families-view";
import { FamilyDetail, type FamilyDetailData } from "@/components/families/family-detail";
import { can } from "@/lib/permissions";

const ALL_ROLES: Role[] = [
  "hospital_director",
  "additional_director",
  "medical_superintendent",
  "health_desk_officer",
  "admin_finance_rep",
  "sehat_card_desk",
  "pharmacy_rep",
  "diagnostics_rep",
  "nursing_rep",
  "it_mis_rep",
];

const row: FamilyListRow = {
  id: 1,
  registrationNo: "DSF-2026-000001",
  dateOfRegistration: new Date("2026-01-05"),
  shaheedName: "Demo Shaheed",
  contactName: "Demo Contact",
  contactCnicMasked: "•••••-•••••••5671",
  membersCount: 3,
  verificationStatus: "VERIFIED_ELIGIBLE",
  cardStatus: "ACTIVE",
  healthCardNo: "DSFHC-000001",
};

describe("FamiliesView", () => {
  it("list hides full CNIC (masked only)", () => {
    render(
      <FamiliesView rows={[row]} total={1} page={1} pageSize={10} search="" status="all" canCreate={false} />,
    );
    expect(screen.queryByText(/12345-1234567-1/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/•••••-•••••••5671/).length).toBeGreaterThan(0);
  });

  it("shows empty state", () => {
    render(<FamiliesView rows={[]} total={0} page={1} pageSize={10} search="" status="all" canCreate={false} />);
    expect(screen.getByText("No families found.")).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(
      <FamiliesView rows={[]} total={0} page={1} pageSize={10} search="" status="all" canCreate={false} error="Could not load families. Please try again." />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load");
  });

  it("Register button visibility follows role permission (all 10 roles)", () => {
    for (const role of ALL_ROLES) {
      const canCreate = can({ id: 1, role, hospitalId: null }, "family", "create");
      const { unmount } = render(
        <FamiliesView rows={[row]} total={1} page={1} pageSize={10} search="" status="all" canCreate={canCreate} />,
      );
      const button = screen.queryByRole("link", { name: "Register New Family" });
      if (role === "health_desk_officer") {
        expect(button).toBeInTheDocument();
      } else {
        expect(button).not.toBeInTheDocument();
      }
      unmount();
    }
  });
});

const detailFixture: FamilyDetailData = {
  id: 1,
  registrationNo: "DSF-2026-000001",
  dateOfRegistration: new Date("2026-01-05"),
  healthCardNo: "DSFHC-000001",
  qrDigitalId: "QR-1",
  shaheedName: "Demo Shaheed",
  shaheedFatherName: "Demo Father",
  shaheedCnic: "11111-1111111-1",
  shaheedServiceNo: null,
  shaheedRank: null,
  shaheedDepartment: null,
  shaheedUnit: null,
  shaheedDateOfShahadat: null,
  shaheedPlaceOfShahadat: null,
  shaheedPermanentDistrict: null,
  shaheedPermanentAddress: null,
  shahadatCertificateNo: null,
  shahadatIssuingAuthority: null,
  contactName: "Demo Contact",
  contactRelationship: "Spouse",
  contactCnic: "12345-1234567-1",
  contactMobile: "03000000000",
  contactAltContact: null,
  contactPresentAddress: null,
  contactDistrict: null,
  specialDependencyDisability: null,
  documentsSubmitted: ["Official Shahadat Certificate / Verification"],
  documentsOther: null,
  verificationStatus: "VERIFIED_ELIGIBLE",
  verificationRefNo: null,
  verificationAuthority: null,
  verificationRemarks: null,
  verifiedBy: null,
  verifiedByDesignation: null,
  verifiedSignatureDate: null,
  cardRegistrationId: null,
  cardQrVerificationId: null,
  cardDateOfIssue: null,
  cardPhysicalIssued: false,
  cardDigitalRecordCreated: false,
  cardBeneficiariesLinked: false,
  cardSystemUpdated: false,
  hospitalAccessDHQ: true,
  hospitalAccessMMMTH: false,
  hospitalAccessWC: false,
  applicantName: null,
  applicantRelationship: null,
  applicantCnic: null,
  applicantSignature: null,
  declarationDate: null,
  authorizationDecision: null,
  authorizedOfficer: null,
  authorizedDesignation: null,
  authorizedSignature: null,
  authorizationDate: null,
  authorizationRemarks: null,
  role: "health_desk_officer",
  hospitalId: 1,
  members: [
    { id: 1, serialNo: 1, name: "Member One", relationship: "Child", cnicBForm: "32345-1234567-1", dobAge: null, mobile: null, status: null, specialDependencyDisability: null },
  ],
};

const verifiedFixture: FamilyDetailData = {
  ...detailFixture,
  verificationStatus: "VERIFIED_ELIGIBLE",
};

describe("FamilyDetail", () => {
  it("detail page shows sections in PDF order", () => {
    render(<FamilyDetail family={detailFixture} canEdit={false} canRecordVerification={false} canAuthorize={false} history={[]} />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "A. Particulars of Shaheed",
      "B. Primary Family Contact",
      "C. Eligible Family Members",
      "D. Documents Submitted",
      "E. Official Verification",
      "F. Family Health Card Registration",
      "G. Hospital Access",
      "H. Declaration by Applicant",
      "I. Authorization",
    ]);
  });

  it("shows full CNIC on detail (override of list masking)", () => {
    render(<FamilyDetail family={detailFixture} canEdit={false} canRecordVerification={false} canAuthorize={false} history={[]} />);
    expect(screen.getAllByText("12345-1234567-1").length).toBeGreaterThan(0);
  });

  it("hides Edit button when canEdit is false", () => {
    render(<FamilyDetail family={detailFixture} canEdit={false} canRecordVerification={false} canAuthorize={false} history={[]} />);
    expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("shows Edit button when canEdit is true", () => {
    render(<FamilyDetail family={detailFixture} canEdit={true} canRecordVerification={false} canAuthorize={false} history={[]} />);
    expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument();
  });

  it("shows Authorise for an authorising director even though they cannot edit", () => {
    render(<FamilyDetail family={verifiedFixture} canEdit={false} canRecordVerification={false} canAuthorize={true} history={[]} />);
    expect(screen.getByRole("button", { name: "Authorise" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("hides Authorise when the user lacks the authorize permission", () => {
    render(<FamilyDetail family={verifiedFixture} canEdit={true} canRecordVerification={true} canAuthorize={false} history={[]} />);
    expect(screen.queryByRole("button", { name: "Authorise" })).not.toBeInTheDocument();
  });

  it("renders the real audit trail instead of a fabricated one", () => {
    render(
      <FamilyDetail
        family={verifiedFixture}
        canEdit={false}
        canRecordVerification={false}
        canAuthorize={false}
        history={[
          { id: 11, who: "desk.dhq@demo.dsfhi.local", role: "health_desk_officer", action: "verification_recorded", entity: "family", entityId: "1", hospitalId: 1, createdAt: "2026-01-02T10:00:00.000Z" },
          { id: 10, who: "director@demo.dsfhi.local", role: "hospital_director", action: "authorization_recorded", entity: "family", entityId: "1", hospitalId: 1, createdAt: "2026-01-01T10:00:00.000Z" },
        ]}
      />,
    );
    expect(screen.getByText("desk.dhq@demo.dsfhi.local")).toBeInTheDocument();
    expect(screen.getByText("director@demo.dsfhi.local")).toBeInTheDocument();
    expect(screen.queryByText("System")).not.toBeInTheDocument();
  });
});

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, FormEvent } from "react";

export type FamilyDetailData = {
  id: number;
  registrationNo: string;
  dateOfRegistration: string | Date | null;
  healthCardNo: string | null;
  qrDigitalId: string | null;
  shaheedName: string;
  shaheedFatherName: string | null;
  shaheedCnic: string | null;
  shaheedServiceNo: string | null;
  shaheedRank: string | null;
  shaheedDepartment: string | null;
  shaheedUnit: string | null;
  shaheedDateOfShahadat: string | Date | null;
  shaheedPlaceOfShahadat: string | null;
  shaheedPermanentDistrict: string | null;
  shaheedPermanentAddress: string | null;
  shahadatCertificateNo: string | null;
  shahadatIssuingAuthority: string | null;
  contactName: string;
  contactRelationship: string;
  contactCnic: string;
  contactMobile: string;
  contactAltContact: string | null;
  contactPresentAddress: string | null;
  contactDistrict: string | null;
  specialDependencyDisability: string | null;
  documentsSubmitted: unknown;
  documentsOther: string | null;
  verificationStatus: string | null;
  verificationRefNo: string | null;
  verificationAuthority: string | null;
  verificationRemarks: string | null;
  verifiedBy: string | null;
  verifiedByDesignation: string | null;
  verifiedSignatureDate: string | null;
  cardRegistrationId: string | null;
  cardQrVerificationId: string | null;
  cardDateOfIssue: string | Date | null;
  cardPhysicalIssued: boolean;
  cardDigitalRecordCreated: boolean;
  cardBeneficiariesLinked: boolean;
  cardSystemUpdated: boolean;
  hospitalAccessDHQ: boolean;
  hospitalAccessMMMTH: boolean;
  hospitalAccessWC: boolean;
  applicantName: string | null;
  applicantRelationship: string | null;
  applicantCnic: string | null;
  applicantSignature: string | null;
  declarationDate: string | Date | null;
  authorizationDecision: string | null;
  authorizedOfficer: string | null;
  authorizedDesignation: string | null;
  authorizedSignature: string | null;
  authorizationDate: string | Date | null;
  role: string;
  hospitalId: number | null;
  members: {
    id: number;
    serialNo: number;
    name: string;
    relationship: string;
    cnicBForm: string | null;
    dobAge: string | null;
    mobile: string | null;
    status: string | null;
    specialDependencyDisability: string | null;
  }[];
  documents?: { id: number; docType: string; originalFilename: string; isSensitive: boolean; createdAt: Date | string }[];
};

export type AuditLogEntry = {
  id: number;
  who: string;
  role: string;
  action: string;
  entity: string;
  entityId: string | null;
  hospitalId: number | null;
  createdAt: Date | string;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-blue-900">{title}</h2>
      <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value || "—"}</dd>
    </div>
  );
}

function RowNR({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value || "Not yet recorded"}</dd>
    </div>
  );
}

export function FamilyDetail({ family, canEdit }: { family: FamilyDetailData; canEdit: boolean }) {
  const docs = Array.isArray(family.documentsSubmitted) ? (family.documentsSubmitted as string[]) : [];

  // Permissions
  const canRecordVerification = canEdit && family.role === "health_desk_officer";
  const canAuthorize = canEdit && (family.role === "additional_director" || family.role === "hospital_director");

  // Verification dialog state
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationForm, setVerificationForm] = useState<{
    verificationStatus: string;
    verificationRefNo: string;
    verificationAuthority: string;
    verificationRemarks: string;
  }>({
    verificationStatus: "",
    verificationRefNo: "",
    verificationAuthority: "",
    verificationRemarks: "",
  });

  // Authorization dialog state
  const [authorizationOpen, setAuthorizationOpen] = useState(false);
  const [authorizationForm, setAuthorizationForm] = useState<{
    authorizationDecision: string;
    authorizedOfficer: string;
    authorizedDesignation: string;
    authorizedSignature: boolean;
    authorizationDate: string;
    authorizationRemarks: string;
  }>({
    authorizationDecision: "",
    authorizedOfficer: "",
    authorizedDesignation: "",
    authorizedSignature: false,
    authorizationDate: new Date().toISOString().split("T")[0],
    authorizationRemarks: "",
  });
  const [authorizationLoading, setAuthorizationLoading] = useState(false);
  const [authorizationError, setAuthorizationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const canGenerateCard =
    family.role === "health_desk_officer" &&
    !family.healthCardNo &&
    (family.authorizationDecision === "APPROVED_FOR_HEALTH_CARD" ||
      family.authorizationDecision === "APPROVED_FOR_REGISTRATION" ||
      family.authorizationDecision === "Approved for Derajat Shuhada Family Health Card" ||
      family.authorizationDecision === "Approved for Registration");

  const handleGenerateCard = async () => {
    setCardLoading(true);
    setCardError("");
    try {
      const res = await fetch(`/api/health-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId: family.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate Health Card");
      window.location.reload();
    } catch (err) {
      setCardError(err instanceof Error ? err.message : "Failed to generate Health Card");
      setCardLoading(false);
    }
  };

  // History data (in a real app, this would be fetched from an API)
  // For now, we'll simulate it based on family data
  const history = [
    ...(family.verificationStatus ? [{
      id: 1,
      who: family.verifiedBy || "Unknown",
      role: "health_desk_officer",
      action: "verification_recorded",
      entity: "family",
      entityId: String(family.id),
      hospitalId: family.hospitalId,
      createdAt: family.verifiedSignatureDate || new Date().toISOString(),
    }] : []),
    ...(family.authorizationDecision ? [{
      id: 2,
      who: family.authorizedOfficer || "Unknown",
      role: family.authorizedDesignation?.includes("Director") ? "additional_director" : "hospital_director",
      action: "authorization_recorded",
      entity: "family",
      entityId: String(family.id),
      hospitalId: family.hospitalId,
      createdAt: family.authorizationDate || new Date().toISOString(),
    }] : []),
    ...(family.verificationStatus || family.authorizationDecision ? [{
      id: 3,
      who: "System",
      role: "system",
      action: "edit",
      entity: "family",
      entityId: String(family.id),
      hospitalId: family.hospitalId,
      createdAt: new Date().toISOString(),
    }] : []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openVerificationDialog = () => setVerificationOpen(true);
  const closeVerificationDialog = () => {
    setVerificationOpen(false);
    setVerificationForm({ verificationStatus: "", verificationRefNo: "", verificationAuthority: "", verificationRemarks: "" });
    setVerificationError("");
  };

  const openAuthorizationDialog = () => setAuthorizationOpen(true);
  const closeAuthorizationDialog = () => {
    setAuthorizationOpen(false);
    setAuthorizationForm({ authorizationDecision: "", authorizedOfficer: "", authorizedDesignation: "", authorizedSignature: false, authorizationDate: new Date().toISOString().split("T")[0], authorizationRemarks: "" });
    setAuthorizationError("");
  };

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setVerificationLoading(true);
    setVerificationError("");
    try {
      const res = await fetch(`/api/families/${family.id}/verification`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record verification");
      closeVerificationDialog();
      window.location.reload();
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Failed to record verification");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleAuthorizationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthorizationLoading(true);
    setAuthorizationError("");
    try {
      const res = await fetch(`/api/families/${family.id}/authorization`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorizationForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record authorization");
      closeAuthorizationDialog();
      window.location.reload();
    } catch (err) {
      setAuthorizationError(err instanceof Error ? err.message : "Failed to record authorization");
    } finally {
      setAuthorizationLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">{family.registrationNo}</h1>
            <p className="text-sm text-gray-500">Date of Registration: {family.dateOfRegistration ? new Date(family.dateOfRegistration).toLocaleDateString() : "—"}</p>
            <p className="text-sm text-gray-500">Health Card No.: {family.healthCardNo ?? "—"}</p>
            <p className="text-sm text-gray-500">QR / Digital ID: {family.qrDigitalId ?? "—"}</p>
          </div>
          {canEdit && (
            <Link href={`/dashboard/families/${family.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          )}
        </div>
      </div>

      <Section title="A. Particulars of Shaheed">
        <Row label="Full Name" value={family.shaheedName} />
        <Row label="Father's Name" value={family.shaheedFatherName} />
        <Row label="CNIC No." value={family.shaheedCnic} />
        <Row label="Service / Personal No." value={family.shaheedServiceNo} />
        <Row label="Rank / Designation" value={family.shaheedRank} />
        <Row label="Department / Force / Organization" value={family.shaheedDepartment} />
        <Row label="Unit / Formation / Office" value={family.shaheedUnit} />
        <Row label="Date of Shahadat" value={family.shaheedDateOfShahadat ? new Date(family.shaheedDateOfShahadat).toLocaleDateString() : null} />
        <Row label="Place / District of Shahadat" value={family.shaheedPlaceOfShahadat} />
        <Row label="Permanent District / Domicile" value={family.shaheedPermanentDistrict} />
        <Row label="Permanent Address" value={family.shaheedPermanentAddress} />
        <Row label="Shahadat Certificate / Official Verification No." value={family.shahadatCertificateNo} />
        <Row label="Issuing / Verifying Authority" value={family.shahadatIssuingAuthority} />
      </Section>

      <Section title="B. Primary Family Contact">
        <Row label="Name" value={family.contactName} />
        <Row label="Relationship with Shaheed" value={family.contactRelationship} />
        <Row label="CNIC No." value={family.contactCnic} />
        <Row label="Mobile No." value={family.contactMobile} />
        <Row label="Alternative Contact" value={family.contactAltContact} />
        <Row label="Present Address" value={family.contactPresentAddress} />
        <Row label="District" value={family.contactDistrict} />
      </Section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-blue-900">C. Eligible Family Members</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-2 py-2">S. No.</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Relationship</th>
                <th className="px-2 py-2">CNIC / B-Form</th>
                <th className="px-2 py-2">DOB / Age</th>
                <th className="px-2 py-2">Mobile</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {family.members.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="px-2 py-2">{m.serialNo}</td>
                  <td className="px-2 py-2">{m.name}</td>
                  <td className="px-2 py-2">{m.relationship}</td>
                  <td className="px-2 py-2">{m.cnicBForm}</td>
                  <td className="px-2 py-2">{m.dobAge}</td>
                  <td className="px-2 py-2">{m.mobile}</td>
                  <td className="px-2 py-2">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm"><span className="text-gray-500">Special Dependency / Disability, if applicable:</span> {family.specialDependencyDisability ?? "—"}</p>
      </section>

      <Section title="D. Documents Submitted">
        {docs.length === 0 ? (
          <Row label="Documents" value="Not yet recorded" />
        ) : (
          <ul className="list-disc pl-5 md:col-span-2">
            {docs.map((d) => (
              <li key={d}>{d}</li>
            ))}
            {family.documentsOther && <li>Other: {family.documentsOther}</li>}
          </ul>
        )}
        <div className="mt-3 border-t pt-3 md:col-span-2">
          <h3 className="text-sm font-semibold text-blue-950">Uploaded supporting documents</h3>
          {(family.documents ?? []).length === 0 ? <p className="mt-2 text-sm text-gray-500">No files uploaded</p> : (family.documents ?? []).map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-3 border-b py-2 text-sm last:border-0">
              <div><p className="font-medium text-gray-900">{document.docType}</p><p className="text-xs text-gray-500">{document.originalFilename} · {document.isSensitive ? "Restricted document" : "Supporting image"}</p></div>
              <a className="shrink-0 font-medium text-blue-700 underline" href={`/api/documents/${document.id}`} target="_blank" rel="noreferrer">Open</a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="E. Official Verification">
        <RowNR label="Status" value={family.verificationStatus} />
        <RowNR label="Verification Reference No." value={family.verificationRefNo} />
        <RowNR label="Verified From / Competent Authority" value={family.verificationAuthority} />
        <RowNR label="Remarks" value={family.verificationRemarks} />
        <RowNR label="Verified By" value={family.verifiedBy} />
        <RowNR label="Designation" value={family.verifiedByDesignation} />
        <RowNR label="Signature / Date" value={family.verifiedSignatureDate} />
        {canRecordVerification && (
          <div className="mt-4 md:col-span-2">
            <Button
              onClick={() => openVerificationDialog()}
              className="bg-green-600 hover:bg-green-700"
            >
              Record Verification
            </Button>
          </div>
        )}
      </Section>

      <Section title="F. Family Health Card Registration">
        <RowNR label="Derajat Shuhada Family Health Card No." value={family.healthCardNo} />
        <RowNR label="Family Registration ID" value={family.cardRegistrationId} />
        <RowNR label="QR / Digital Verification ID" value={family.cardQrVerificationId} />
        <RowNR label="Date of Issue" value={family.cardDateOfIssue ? new Date(family.cardDateOfIssue).toLocaleDateString() : null} />
        <Row label="Physical Card Issued" value={family.cardPhysicalIssued ? "Yes" : "No"} />
        <Row label="Digital Record Created" value={family.cardDigitalRecordCreated ? "Yes" : "No"} />
        <Row label="Eligible Beneficiaries Linked" value={family.cardBeneficiariesLinked ? "Yes" : "No"} />
        <Row label="Hospital Information System Updated" value={family.cardSystemUpdated ? "Yes" : "No"} />
        {canGenerateCard && (
          <div className="mt-4 md:col-span-2">
            <Button onClick={handleGenerateCard} disabled={cardLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {cardLoading ? "Generating…" : "Generate Health Card"}
            </Button>
            {cardError && <p className="mt-2 text-sm text-red-600">{cardError}</p>}
          </div>
        )}
      </Section>

      <Section title="G. Hospital Access">
        <Row label="District Headquarters Teaching Hospital, Dera Ismail Khan" value={family.hospitalAccessDHQ ? "Yes" : "No"} />
        <Row label="Mufti Mehmood Memorial Teaching Hospital" value={family.hospitalAccessMMMTH ? "Yes" : "No"} />
        <Row label="Derajat Women & Children Hospital" value={family.hospitalAccessWC ? "Yes" : "No"} />
      </Section>

      <Section title="H. Declaration by Applicant">
        <RowNR label="Applicant Name" value={family.applicantName} />
        <RowNR label="Relationship with Shaheed" value={family.applicantRelationship} />
        <RowNR label="CNIC No." value={family.applicantCnic} />
        <RowNR label="Signature / Thumb Impression" value={family.applicantSignature} />
        <RowNR label="Date" value={family.declarationDate ? new Date(family.declarationDate).toLocaleDateString() : null} />
      </Section>

      <Section title="I. Authorization">
        <RowNR label="Decision" value={family.authorizationDecision} />
        <RowNR label="Authorised Officer" value={family.authorizedOfficer} />
        <RowNR label="Designation" value={family.authorizedDesignation} />
        <RowNR label="Signature / Stamp" value={family.authorizedSignature} />
        <RowNR label="Date" value={family.authorizationDate ? new Date(family.authorizationDate).toLocaleDateString() : null} />
        {canAuthorize && family.verificationStatus && (
          <div className="mt-4 md:col-span-2">
            <Button
              onClick={() => openAuthorizationDialog()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Authorise
            </Button>
          </div>
        )}
      </Section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">History Timeline</h3>
        <div className="mt-4">
          {history.length === 0 ? (
            <p className="text-gray-500">No history recorded yet.</p>
          ) : (
            <dl className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex gap-4 border-l-2 border-blue-200 pl-4">
                  <div className="flex-shrink-0 w-8 h-8 border bg-background flex items-center justify-center text-muted-foreground text-[10px] font-semibold">
                    {entry.action === "verification_recorded" ? "VER" : entry.action === "authorization_recorded" ? "AUTH" : entry.action === "edit" ? "EDIT" : "LOG"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-900">{entry.who}</span>
                      <span className="text-muted-foreground text-xs px-2 py-0.5 bg-muted">{entry.role}</span>
                      <span className="text-gray-500">{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700 capitalize">{entry.action.replace(/_/g, " ")}</div>
                    {entry.action === "verification_recorded" && family.verificationRemarks && (
                      <div className="mt-1 text-sm text-gray-600">Remarks: {family.verificationRemarks}</div>
                    )}
                    {entry.action === "authorization_recorded" && family.authorizationDecision && (
                      <div className="mt-1 text-sm text-gray-600">Decision: {family.authorizationDecision}</div>
                    )}
                  </div>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Verification Dialog */}
      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Official Verification (Section E)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVerificationSubmit} className="space-y-4 mt-4">
            {verificationError && <div className="text-red-600 text-sm">{verificationError}</div>}
            <div className="space-y-2">
              <Label htmlFor="verificationStatus">Status *</Label>
              <Select value={verificationForm.verificationStatus ?? ""} onValueChange={(v) => setVerificationForm({ ...verificationForm, verificationStatus: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verified & Eligible">Verified & Eligible</SelectItem>
                  <SelectItem value="Provisionally Verified">Provisionally Verified</SelectItem>
                  <SelectItem value="Additional Documentation Required">Additional Documentation Required</SelectItem>
                  <SelectItem value="Not Eligible">Not Eligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationRefNo">Verification Reference No. *</Label>
              <Input id="verificationRefNo" value={verificationForm.verificationRefNo} onChange={(e) => setVerificationForm({ ...verificationForm, verificationRefNo: e.target.value })} placeholder="Enter reference number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationAuthority">Verified From / Competent Authority *</Label>
              <Input id="verificationAuthority" value={verificationForm.verificationAuthority} onChange={(e) => setVerificationForm({ ...verificationForm, verificationAuthority: e.target.value })} placeholder="Enter authority" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationRemarks">Remarks</Label>
              <Textarea id="verificationRemarks" value={verificationForm.verificationRemarks} onChange={(e) => setVerificationForm({ ...verificationForm, verificationRemarks: e.target.value })} placeholder="Optional remarks" rows={3} />
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeVerificationDialog}>Cancel</Button>
              <Button type="submit" disabled={verificationLoading}>
                {verificationLoading ? "Saving…" : "Record Verification"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Authorization Dialog */}
      <Dialog open={authorizationOpen} onOpenChange={setAuthorizationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Authorize Family (Section I)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuthorizationSubmit} className="space-y-4 mt-4">
            {authorizationError && <div className="text-red-600 text-sm">{authorizationError}</div>}
            <div className="space-y-2">
              <Label htmlFor="authorizationDecision">Decision *</Label>
              <Select value={authorizationForm.authorizationDecision ?? ""} onValueChange={(v) => setAuthorizationForm({ ...authorizationForm, authorizationDecision: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Select decision" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved for Registration">Approved for Registration</SelectItem>
                  <SelectItem value="Approved for Derajat Shuhada Family Health Card">Approved for Derajat Shuhada Family Health Card</SelectItem>
                  <SelectItem value="Returned for Completion / Further Verification">Returned for Completion / Further Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizedOfficer">Authorised Officer *</Label>
              <Input id="authorizedOfficer" value={authorizationForm.authorizedOfficer} onChange={(e) => setAuthorizationForm({ ...authorizationForm, authorizedOfficer: e.target.value })} placeholder="Enter officer name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizedDesignation">Designation *</Label>
              <Input id="authorizedDesignation" value={authorizationForm.authorizedDesignation} onChange={(e) => setAuthorizationForm({ ...authorizationForm, authorizedDesignation: e.target.value })} placeholder="Enter designation" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizationDate">Date</Label>
              <Input id="authorizationDate" type="date" value={authorizationForm.authorizationDate} onChange={(e) => setAuthorizationForm({ ...authorizationForm, authorizationDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizedSignature">Signed and stamped on paper *</Label>
              <Checkbox id="authorizedSignature" checked={authorizationForm.authorizedSignature} onCheckedChange={(checked) => setAuthorizationForm({ ...authorizationForm, authorizedSignature: checked })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizationRemarks">Remarks (Required if Returned for Completion)</Label>
              <Textarea id="authorizationRemarks" value={authorizationForm.authorizationRemarks} onChange={(e) => setAuthorizationForm({ ...authorizationForm, authorizationRemarks: e.target.value })} placeholder="Required for Returned for Completion / Further Verification" rows={3} />
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeAuthorizationDialog}>Cancel</Button>
              <Button type="submit" disabled={authorizationLoading}>
                {authorizationLoading ? "Saving…" : "Record Authorization"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

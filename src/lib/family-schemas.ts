import { z } from "zod";

export const DOCUMENT_OPTIONS = [
  "Official Shahadat Certificate / Verification",
  "CNIC of Shaheed",
  "CNIC of Applicant",
  "CNIC / B-Form of Family Members",
  "Family Registration Certificate / Proof of Relationship",
  "Dependency Certificate, where applicable",
  "Disability Documentation, where applicable",
  "Domicile / Residence Record, where required",
  "Beneficiary Photographs",
  "Departmental / Service Verification",
] as const;

export const VERIFICATION_STATUS_OPTIONS = [
  "Verified & Eligible",
  "Provisionally Verified",
  "Additional Documentation Required",
  "Not Eligible",
] as const;

export const AUTHORIZATION_DECISION_OPTIONS = [
  "Approved for Registration",
  "Approved for Shuhada-e-Derajat Family Health Card",
  "Approved for Derajat Shuhada Family Health Card",
  "Returned for Completion / Further Verification",
] as const;

export const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

const optionalCnic = z
  .string()
  .optional()
  .refine((v) => !v || cnicRegex.test(v), "Enter CNIC in format 12345-1234567-1");

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  cnicBForm: optionalCnic,
  dobAge: z.string().optional(),
  mobile: z.string().optional(),
  status: z.string().optional(),
});

export const familySchema = z.object({
  // A. Particulars of Shaheed
  shaheedName: z.string().min(1, "Name of Shaheed is required"),
  shaheedFatherName: z.string().optional(),
  shaheedCnic: optionalCnic,
  shaheedServiceNo: z.string().optional(),
  shaheedRank: z.string().optional(),
  shaheedDepartment: z.string().optional(),
  shaheedUnit: z.string().optional(),
  shaheedDateOfShahadat: z.string().optional(),
  shaheedPlaceOfShahadat: z.string().optional(),
  shaheedPermanentDistrict: z.string().optional(),
  shaheedPermanentAddress: z.string().optional(),
  shahadatCertificateNo: z.string().optional(),
  shahadatIssuingAuthority: z.string().optional(),

  // B. Primary Family Contact
  contactName: z.string().min(1, "Name is required"),
  contactRelationship: z.string().min(1, "Relationship is required"),
  contactCnic: z.string().regex(cnicRegex, "Enter CNIC in format 12345-1234567-1"),
  contactMobile: z.string().min(1, "Mobile is required"),
  contactAltContact: z.string().optional(),
  contactPresentAddress: z.string().optional(),
  contactDistrict: z.string().optional(),

  // C. Eligible Family Members
  members: z.array(memberSchema).min(1, "At least one family member is required"),
  specialDependencyDisability: z.string().optional(),

  // D. Documents Submitted
  documentsSubmitted: z.array(z.string()),
  documentsOther: z.string().optional(),
  documentsOtherChecked: z.boolean().optional(),

  // G. Hospital Access
  hospitalAccessDHQ: z.boolean(),
  hospitalAccessMMMTH: z.boolean(),
  hospitalAccessWC: z.boolean(),

  // H. Declaration by Applicant
  applicantName: z.string().optional(),
  applicantRelationship: z.string().optional(),
  applicantCnic: optionalCnic,
  applicantSignature: z.string().optional(),
  declarationDate: z.string().optional(),
}).superRefine((values, ctx) => {
  if (values.documentsSubmitted.length === 0 && !values.documentsOtherChecked) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["documentsSubmitted"], message: "Select at least one document" });
  }
});

export type FamilyFormValues = z.infer<typeof familySchema>;

export const verificationSchema = z.object({
  verificationStatus: z.enum(VERIFICATION_STATUS_OPTIONS),
  verificationRefNo: z.string().min(1, "Verification Reference No. is required"),
  verificationAuthority: z.string().min(1, "Verified From / Competent Authority is required"),
  verificationRemarks: z.string().optional(),
});

export const authorizationSchema = z.object({
  authorizationDecision: z.enum(AUTHORIZATION_DECISION_OPTIONS),
  authorizedOfficer: z.string().min(1, "Authorised Officer is required"),
  authorizedDesignation: z.string().min(1, "Designation is required"),
  authorizedSignature: z.boolean().refine((v) => v === true, "Must confirm signature and stamp"),
  authorizationDate: z.string().optional(),
  authorizationRemarks: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.authorizationDecision === "Returned for Completion / Further Verification" && !v.authorizationRemarks?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["authorizationRemarks"],
      message: "Remarks are required when returning for completion/further verification",
    });
  }
});

export type VerificationInput = z.infer<typeof verificationSchema>;
export type AuthorizationInput = z.infer<typeof authorizationSchema>;

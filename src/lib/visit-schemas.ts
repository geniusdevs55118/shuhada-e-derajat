import { z } from "zod";

export const NATURE_OPTIONS = [
  "OPD", "Specialist Consultation", "Emergency / Trauma", "Laboratory", "Radiology",
  "Medicines", "Admission", "Medical Treatment", "Surgical Consultation", "Operation / Procedure",
  "ICU", "Maternal Health", "Paediatric Care", "Neonatal Care", "Rehabilitation",
  "Follow-up", "Sehat Card Plus Facilitation", "Ambulance", "Referral", "Other",
] as const;

export const visitSchema = z.object({
  dateTime: z.string().optional(),
  familyRegistrationNo: z.string().min(1, "Family Reg No is required"),
  healthCardNo: z.string().optional(),
  hospitalId: z.number().int().optional(),

  beneficiaryName: z.string().min(1, "Beneficiary name is required"),
  beneficiaryFatherHusbandGuardian: z.string().optional(),
  beneficiaryCnicBForm: z.string().optional(),
  beneficiaryRelationship: z.string().optional(),
  beneficiaryMobile: z.string().optional(),
  shaheedName: z.string().optional(),
  verification: z.enum(["VERIFIED", "VERIFICATION_CONFIRMED_DIGITALLY", "EMERGENCY_VERIFICATION_IN_PROCESS"]),
  verificationPending: z.boolean().optional(),

  facilitationOfficer: z.string().optional(),

  natureOfHealthcare: z.array(z.string()).default([]),
  natureOther: z.string().optional(),

  department: z.string().optional(),
  consultant: z.string().optional(),
  opdMrNo: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  followUpDate: z.string().optional(),

  diagnostics: z.record(z.string(), z.boolean()).default({}),
  investigationsStatus: z.enum(["COMPLETED", "PARTIALLY_COMPLETED", "PENDING"]).optional(),

  medicinesFlags: z.record(z.string(), z.boolean()).default({}),
  medicinesRemarks: z.string().optional(),

  ward: z.string().optional(),
  admissionDate: z.string().optional(),
  procedureName: z.string().optional(),
  consultantUnit: z.string().optional(),
  procedureDate: z.string().optional(),
  procedureStatus: z.enum(["PLANNED", "COMPLETED", "DEFERRED", "REFERRED"]).optional(),

  sehatFlags: z.record(z.string(), z.boolean()).default({}),
  sehatCaseRef: z.string().optional(),

  emergencyFlags: z
    .object({
      emergencyCase: z.boolean().optional(),
      triageCompleted: z.boolean().optional(),
      immediateTreatmentInitiated: z.boolean().optional(),
      adminVerificationCompleted: z.boolean().optional(),
      verificationConcurrent: z.boolean().optional(),
      verificationSubsequent: z.boolean().optional(),
    })
    .default({}),

  ambulanceFromTo: z.string().optional(),
  ambulanceDateTime: z.string().optional(),
  ambulanceStatus: z.enum(["REQUESTED", "COORDINATING", "FACILITATED", "REFERRED", "CLOSED"]).optional(),
  referralFacility: z.string().optional(),
  referralReason: z.string().optional(),
  referringConsultant: z.string().optional(),
  ambulanceFlags: z.record(z.string(), z.boolean()).default({}),

  healthDeskActions: z.record(z.string(), z.boolean()).default({}),
  issueEncountered: z.string().optional(),
  actionTaken: z.string().optional(),
  finalStatus: z.string().optional(),

  feedbackFlags: z.record(z.string(), z.boolean()).default({}),
  feedbackComments: z.string().optional(),
  feedbackSignature: z.string().optional(),

  certOfficer: z.string().optional(),
  certDesignation: z.string().optional(),
  certSignatureDate: z.string().optional(),
  escalatedTo: z.string().optional(),
  actionDecision: z.string().optional(),
  authorisedOfficerSignature: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof visitSchema>;

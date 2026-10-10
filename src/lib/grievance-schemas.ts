import { z } from "zod";

export const GRIEVANCE_NATURE_OPTIONS = [
  "Registration Delay", "Repetitive Documentation", "OPD Delay", "Emergency Delay",
  "Diagnostics Delay", "Radiology Delay", "Medicine Availability", "Admission Problem",
  "Surgery Delay", "ICU Issue", "Sehat Card Plus Processing", "Ambulance Issue",
  "Referral Problem", "Health Card Issue", "Staff Behaviour / Dignity", "Privacy Concern",
  "Movement Between Offices", "Financial / Billing", "Other",
] as const;

export const RED_FLAG_KEYS = [
  "emergencyTreatmentDelayed",
  "patientSafetyConcern",
  "criticalMedicineIssue",
  "urgentAdmissionProblem",
  "ambulanceUrgentTransfer",
  "otherImmediateClinicalConcern",
] as const;

export const AMBER_FLAG_KEYS = [
  "significantAvoidableDelay",
  "repeatedVerification",
  "sehatProcessingDifficulty",
  "diagnosticsMedicineCoordinationIssue",
  "referralIssue",
  "seriousBeneficiaryConcern",
] as const;

export const GREEN_FLAG_KEYS = [
  "generalFacilitation",
  "cardCorrection",
  "informationGuidance",
  "nonUrgentAdministrative",
  "feedback",
] as const;

export const grievanceSchema = z.object({
  dateTime: z.string().optional(),
  priority: z.enum(["ROUTINE", "URGENT", "IMMEDIATE_PATIENT_SAFETY"]).default("ROUTINE"),
  hospitalId: z.number().int().optional(),

  beneficiaryName: z.string().min(1, "Beneficiary name is required"),
  familyRegistrationNo: z.string().optional(),
  healthCardNo: z.string().optional(),
  cnicBForm: z.string().optional(),
  relationshipWithShaheed: z.string().optional(),
  shaheedName: z.string().optional(),
  contactNo: z.string().optional(),

  department: z.string().optional(),
  healthDesk: z.string().optional(),
  incidentDateTime: z.string().optional(),

  natureFlags: z.record(z.string(), z.boolean()).default({}),
  natureOther: z.string().optional(),

  issueDescription: z.string().optional(),
  immediateHealthcareNeed: z.boolean().optional(),
  delayMayAffectCare: z.boolean().optional(),

  redFlags: z.record(z.string(), z.boolean()).default({}),
  amberFlags: z.record(z.string(), z.boolean()).default({}),
  greenFlags: z.record(z.string(), z.boolean()).default({}),

  complaintReceivedBy: z.string().optional(),
  receivedByDesignation: z.string().optional(),
  timeReceived: z.string().optional(),
  immediateActionTaken: z.string().optional(),
  resolvedAtHealthDesk: z.string().optional(),

  escalatedTo: z.string().optional(),
  escalationDesignation: z.string().optional(),
  escalatedDateTime: z.string().optional(),
  escalationReason: z.string().optional(),
  escalationModes: z.record(z.string(), z.boolean()).default({}),

  actionTaken: z.string().optional(),
  responsibleDeptOfficer: z.string().optional(),
  resolutionDateTime: z.string().optional(),
  outcome: z.enum(["FULLY_RESOLVED", "PARTIALLY_RESOLVED", "FURTHER_ACTION_REQUIRED", "REFERRED_TO_COMPETENT_AUTHORITY", "CLOSED_AFTER_EXPLANATION_FACILITATION"]).optional(),
  remarks: z.string().optional(),

  issueExplainedAppropriately: z.boolean().optional(),
  facilitationProvided: z.enum(["YES", "PARTIALLY", "NO"]).optional(),
  furtherAssistanceRequired: z.boolean().optional(),
  beneficiaryComments: z.string().optional(),
  beneficiaryNameSignature: z.string().optional(),
  beneficiarySignatureDate: z.string().optional(),

  rootCause: z.string().optional(),
  correctiveAction: z.string().optional(),
  preventiveActionRequired: z.string().optional(),
  responsibleOfficerDept: z.string().optional(),
  targetCompletionDate: z.string().optional(),
  actionCompleted: z.enum(["YES", "NO", "IN_PROGRESS"]).optional(),

  requiresWorkingGroupReview: z.boolean().optional(),
  reviewedBy: z.string().optional(),
  observations: z.string().optional(),
  furtherDirections: z.string().optional(),
  reviewSignatureDate: z.string().optional(),

  closureStatus: z.enum(["RESOLVED_CLOSED", "CLOSED_WITH_CORRECTIVE_ACTION", "REFERRED_FOR_FURTHER_REVIEW", "PENDING_FOLLOW_UP"]).optional(),
  closedBy: z.string().optional(),
  closedByDesignation: z.string().optional(),
  closureSignature: z.string().optional(),
  closureDate: z.string().optional(),
});

export type GrievanceFormValues = z.infer<typeof grievanceSchema>;

export function hasAnyTrue(flags: Record<string, unknown> | null | undefined): boolean {
  if (!flags) return false;
  return Object.values(flags).some((v) => v === true);
}

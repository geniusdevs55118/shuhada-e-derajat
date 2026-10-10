import { z } from "zod";

// Annexure-C D: Special Healthcare / Facilitation Information (7 checkboxes)
export const SPECIAL_FACILITATION_FLAGS = [
  "Elderly Parent / Dependant",
  "Person with Disability",
  "Maternal Healthcare Requirement",
  "Child / Paediatric Requirement",
  "Regular Specialist Follow-up",
  "Mobility Assistance Required",
  "Other",
] as const;

// Annexure-C E: Health Card Control Record (7 checkboxes)
export const HEALTH_CARD_CONTROL_FLAGS = [
  "Family Card",
  "Individual Beneficiary Card",
  "Physical Card Issued",
  "QR / Digital Record Activated",
  "Hospital Information System Linked",
  "Photograph Verified",
  "CNIC / B-Form Linked",
] as const;

// Annexure-C K: Misuse / Duplication Control (6 flags)
export const MISUSE_CONTROL_FLAGS = [
  "Suspected Impersonation",
  "Unauthorised Use of Card",
  "Duplicate Beneficiary Registration",
  "Altered / Fraudulent Documentation",
  "Duplicate Healthcare Claim",
  "Other Suspected Misuse",
] as const;

// Annexure-C L: Periodic Review / Revalidation (6 flags)
export const PERIODIC_REVIEW_FLAGS = [
  "Family Particulars Confirmed",
  "Beneficiary List Confirmed",
  "Contact Information Updated",
  "Card Status Confirmed",
  "Digital Record Confirmed",
  "Further Verification Required",
] as const;

export const CARD_STATUS_OPTIONS = [
  "Active",
  "Under Verification",
  "Temporarily Suspended",
  "Closed",
] as const;

export const generateCardSchema = z.object({
  familyId: z.number().int().positive("Family ID is required"),
  specialFlags: z.array(z.string()).optional(),
  controlFlags: z.array(z.string()).optional(),
});

export type GenerateCardInput = z.infer<typeof generateCardSchema>;

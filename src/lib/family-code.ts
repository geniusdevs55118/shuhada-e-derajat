/**
 * Utility functions for generating and formatting unique Family Codes
 * for Shuhada (Martyrs') families under the Shuhada-e-Derajat Family Healthcare Initiative.
 */

export function extractFamilyCode(family?: {
  id?: number | string | null;
  registrationNo?: string | null;
  familyRegistrationNo?: string | null;
  cardNo?: string | null;
} | null): string {
  if (!family) return "—";

  const regNo = family.registrationNo || family.familyRegistrationNo;

  if (regNo) {
    // Check if registrationNo matches pattern like DSF-2026-000312 or DSF-000312
    const parts = regNo.split("-");
    const lastPart = parts[parts.length - 1];
    if (lastPart && /^\d+$/.test(lastPart)) {
      const num = parseInt(lastPart, 10);
      if (!isNaN(num) && num > 0) {
        return String(num); // e.g. 312
      }
    }
  }

  // Fallback to numeric family id if available
  if (family.id !== undefined && family.id !== null) {
    const num = Number(family.id);
    if (!isNaN(num) && num > 0) {
      return String(num);
    }
  }

  // If cardNo contains numbers
  if (family.cardNo) {
    const digits = family.cardNo.replace(/\D/g, "");
    if (digits) {
      return String(parseInt(digits.slice(-4), 10) || digits);
    }
  }

  return regNo ?? "—";
}

/**
 * Format family code with prefix badge, e.g. "FAMILY CODE: #312" / "کوڈ نمبر: 312"
 */
export function formatFamilyCodeDisplay(family?: {
  id?: number | string | null;
  registrationNo?: string | null;
  familyRegistrationNo?: string | null;
  cardNo?: string | null;
} | null): string {
  const code = extractFamilyCode(family);
  return code === "—" ? "—" : `#${code}`;
}

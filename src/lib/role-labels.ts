import type { Role } from "@prisma/client";

const BASE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  hospital_director: "Hospital Director",
  additional_director: "Additional Hospital Director",
  medical_superintendent: "Medical Director",
  health_desk_officer: "Help Desk Representative",
  sehat_card_desk: "Representative Sehat Card Plus Desk",
  pharmacy_rep: "Representative Pharmacy",
  diagnostics_rep: "Representative Diagnostics / Radiology",
  admin_finance_rep: "Representative Administration / Finance",
  nursing_rep: "Nursing Representative",
  it_mis_rep: "IT/MIS Representative",
  working_group_member: "Working Group Member",
};

export function roleLabel(role: Role, hospitalCode?: string | null): string {
  const base = BASE_LABELS[role] ?? role;
  if (role === "medical_superintendent" && hospitalCode) return `${base} (${hospitalCode})`;
  return base;
}

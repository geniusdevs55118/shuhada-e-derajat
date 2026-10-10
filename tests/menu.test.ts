import { describe, it, expect } from "vitest";
import type { Role } from "@prisma/client";
import { getMenuForRole } from "@/lib/menu";

const ALL_ROLES: Role[] = [
  "super_admin",
  "hospital_director",
  "additional_director",
  "medical_superintendent",
  "health_desk_officer",
  "sehat_card_desk",
  "pharmacy_rep",
  "diagnostics_rep",
  "admin_finance_rep",
  "nursing_rep",
  "it_mis_rep",
  "working_group_member",
];

const READ_ALL = [
  "Families",
  "Health Cards",
  "Visits",
  "Sehat Card+",
  "Grievances",
  "Reports",
];

const COMMON = [
  "Dashboard",
  "Scan Card",
  "Ambulance & Referrals",
  "Verification Queue",
  "Feedback Summary",
  "Misuse Flags",
  "Working Group",
  ...READ_ALL,
];

const WITH_ACTION = [...COMMON, "Action Tracker"];

const EXPECTED: Record<Role, string[]> = {
  super_admin: [...WITH_ACTION, "Users", "Audit Log", "Change Password", "Administration"],
  hospital_director: [...WITH_ACTION, "Audit Log", "Change Password"],
  additional_director: [...WITH_ACTION, "Audit Log", "Change Password"],
  medical_superintendent: [...WITH_ACTION, "Change Password"],
  health_desk_officer: [...COMMON, "Change Password"],
  sehat_card_desk: [...WITH_ACTION, "Change Password"],
  pharmacy_rep: [...WITH_ACTION, "Change Password"],
  diagnostics_rep: [...WITH_ACTION, "Change Password"],
  admin_finance_rep: [...WITH_ACTION, "Change Password"],
  nursing_rep: [...WITH_ACTION, "Change Password"],
  it_mis_rep: [...WITH_ACTION, "Users", "Audit Log", "Change Password", "Administration"],
  working_group_member: [...WITH_ACTION, "Change Password"],
};

describe("menu per role", () => {
  it("each role sees exactly its allowed menu items", () => {
    for (const role of ALL_ROLES) {
      const labels = getMenuForRole(role, null).map((m) => m.label);
      expect(labels, role).toEqual(EXPECTED[role]);
    }
  });
});

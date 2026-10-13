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
  "Working Group",
  "Families",
  "Health Cards",
  "Visits & Appointments",
  "Sehat Card+",
  "Grievances",
  "Reports",
];

const DESK_FACILITATION = [
  "Hospital Facilitation Desk",
  "Department Reception Queue",
  "Ambulance & Referrals",
  "Verification Queue",
  "Feedback Summary",
  "Misuse Flags",
];

const LEADERSHIP_EXTRAS = [
  "Hospital Facilitation Desk",
  "Ambulance & Referrals",
  "Verification Queue",
  "Feedback Summary",
  "Misuse Flags",
];

const CLINICAL_RECEPTION = [
  "Department Reception Queue",
];

const EXPECTED: Record<Role, string[]> = {
  super_admin: [
    "Dashboard",
    "Scan Card",
    ...DESK_FACILITATION,
    ...READ_ALL,
    "Action Tracker",
    "Users",
    "Audit Log",
    "Administration",
    "Change Password",
  ],
  hospital_director: [
    "Dashboard",
    "Scan Card",
    ...LEADERSHIP_EXTRAS,
    ...READ_ALL,
    "Action Tracker",
    "Audit Log",
    "Change Password",
  ],
  additional_director: [
    "Dashboard",
    "Scan Card",
    ...LEADERSHIP_EXTRAS,
    ...READ_ALL,
    "Action Tracker",
    "Audit Log",
    "Change Password",
  ],
  medical_superintendent: [
    "Dashboard",
    "Scan Card",
    ...LEADERSHIP_EXTRAS,
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
  health_desk_officer: [
    "Dashboard",
    "Scan Card",
    ...DESK_FACILITATION,
    ...READ_ALL,
    "Change Password",
  ],
  sehat_card_desk: [
    "Dashboard",
    "Scan Card",
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
  pharmacy_rep: [
    "Dashboard",
    "Scan Card",
    ...CLINICAL_RECEPTION,
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
  diagnostics_rep: [
    "Dashboard",
    "Scan Card",
    ...CLINICAL_RECEPTION,
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
  admin_finance_rep: [
    "Dashboard",
    "Scan Card",
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
  nursing_rep: [
    "Dashboard",
    "Scan Card",
    ...CLINICAL_RECEPTION,
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
  it_mis_rep: [
    "Dashboard",
    "Scan Card",
    ...READ_ALL,
    "Action Tracker",
    "Users",
    "Audit Log",
    "Change Password",
  ],
  working_group_member: [
    "Dashboard",
    "Scan Card",
    ...READ_ALL,
    "Action Tracker",
    "Change Password",
  ],
};

describe("menu per role", () => {
  it("each role sees exactly its allowed menu items", () => {
    for (const role of ALL_ROLES) {
      const labels = getMenuForRole(role, null).map((m) => m.label);
      expect(labels, role).toEqual(EXPECTED[role]);
    }
  });
});

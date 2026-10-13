import type { Role } from "@prisma/client";
import { can, type Resource } from "./permissions";

export type MenuEntry = { href: string; label: string; resource: Resource | null };

const MENU: MenuEntry[] = [
  { href: "/dashboard",                     label: "Dashboard",                resource: null },
  { href: "/dashboard/scan",                 label: "Scan Card",                 resource: "card" },
  { href: "/dashboard/facilitation-booking", label: "Hospital Facilitation Desk", resource: "visit" },
  { href: "/dashboard/department-reception", label: "Department Reception Queue", resource: "visit" },
  { href: "/dashboard/ambulance-referrals",   label: "Ambulance & Referrals",     resource: "visit" },
  { href: "/dashboard/verification-queue",   label: "Verification Queue",       resource: "family" },
  { href: "/dashboard/feedback",             label: "Feedback Summary",          resource: "visit" },
  { href: "/dashboard/misuse",               label: "Misuse Flags",              resource: "card" },
  { href: "/dashboard/working-group",        label: "Working Group",             resource: "working_group" },
  { href: "/dashboard/families",             label: "Families",                 resource: "family" },
  { href: "/dashboard/health-cards",         label: "Health Cards",             resource: "card" },
  { href: "/dashboard/visits",               label: "Visits & Appointments",    resource: "visit" },
  { href: "/dashboard/sehat-card-plus",      label: "Sehat Card+",               resource: "sehat_claim" },
  { href: "/dashboard/grievances",           label: "Grievances",               resource: "grievance" },
  { href: "/dashboard/monthly-reports",      label: "Reports",                   resource: "monthly_report" },
  { href: "/dashboard/action-tracker",       label: "Action Tracker",            resource: "action_tracker" },
  { href: "/dashboard/users",                label: "Users",                    resource: "user" },
  { href: "/dashboard/audit-log",            label: "Audit Log",                resource: "audit_log" },
  { href: "/dashboard/change-password",      label: "Change Password",          resource: null },
  { href: "/dashboard/admin",                label: "Administration",           resource: "user" },
];

export function getMenuForRole(role: Role, hospitalId: number | null): MenuEntry[] {
  const user = { id: 0, role, hospitalId };
  return MENU.filter(
    (m) => m.resource === null || can(user, m.resource, "read") || can(user, m.resource, "create"),
  );
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  hospital_director: "Hospital Director",
  additional_director: "Addl. Hospital Director",
  medical_superintendent: "Medical Superintendent",
  health_desk_officer: "Health Desk Focal",
  sehat_card_desk: "Sehat Card Plus Desk",
  pharmacy_rep: "Pharmacy",
  diagnostics_rep: "Diagnostics / Radiology",
  admin_finance_rep: "Admin / Finance",
  nursing_rep: "Nursing",
  it_mis_rep: "IT / MIS",
  working_group_member: "Working Group Member",
};

import type { Role } from "@prisma/client";
import { can, type Resource } from "./permissions";

export type MenuEntry = {
  href: string;
  label: string;
  resource: Resource | null;
  roles?: Role[];
  section?: "operations" | "oversight" | "admin";
  icon?: string;
};

const MENU: MenuEntry[] = [
  // --- High-Frequency Daily Operations (Top of Sidebar / Nearest to Cursor) ---
  { href: "/dashboard",                     label: "Dashboard",                resource: null,            section: "operations", icon: "LayoutDashboard" },
  { href: "/dashboard/scan",                 label: "Scan Card",                 resource: "card",          section: "operations", icon: "QrCode" },
  { href: "/dashboard/visits",               label: "Visits & Appointments",    resource: "visit",         section: "operations", icon: "CalendarClock" },
  { href: "/dashboard/families",             label: "Families",                 resource: "family",        section: "operations", icon: "Users" },
  { href: "/dashboard/health-cards",         label: "Health Cards",             resource: "card",          section: "operations", icon: "CreditCard" },
  { href: "/dashboard/facilitation-booking", label: "Hospital Facilitation Desk", resource: "visit",      section: "operations", icon: "Building2", roles: ["super_admin", "health_desk_officer", "hospital_director", "additional_director", "medical_superintendent"] },
  { href: "/dashboard/department-reception", label: "Department Reception Queue", resource: "visit",     section: "operations", icon: "ClipboardList", roles: ["super_admin", "health_desk_officer", "pharmacy_rep", "diagnostics_rep", "nursing_rep"] },
  { href: "/dashboard/grievances",           label: "Grievances",               resource: "grievance",     section: "operations", icon: "AlertTriangle" },
  { href: "/dashboard/sehat-card-plus",      label: "Sehat Card+",               resource: "sehat_claim",   section: "operations", icon: "HeartPulse" },
  { href: "/dashboard/ambulance-referrals",   label: "Ambulance & Referrals",     resource: "visit",         section: "operations", icon: "Ambulance", roles: ["super_admin", "health_desk_officer", "hospital_director", "additional_director", "medical_superintendent"] },

  // --- Monitoring, Verification & Coordination ---
  { href: "/dashboard/verification-queue",   label: "Verification Queue",       resource: "family",        section: "oversight",  icon: "UserCheck", roles: ["super_admin", "health_desk_officer", "hospital_director", "additional_director", "medical_superintendent"] },
  { href: "/dashboard/feedback",             label: "Feedback Summary",          resource: "visit",         section: "oversight",  icon: "MessageSquareQuote", roles: ["super_admin", "health_desk_officer", "hospital_director", "additional_director", "medical_superintendent"] },
  { href: "/dashboard/monthly-reports",      label: "Reports",                   resource: "monthly_report", section: "oversight", icon: "BarChart3" },
  { href: "/dashboard/action-tracker",       label: "Action Tracker",            resource: "action_tracker", section: "oversight", icon: "CheckSquare" },
  { href: "/dashboard/misuse",               label: "Misuse Flags",              resource: "card",          section: "oversight",  icon: "ShieldAlert", roles: ["super_admin", "health_desk_officer", "hospital_director", "additional_director", "medical_superintendent"] },
  { href: "/dashboard/working-group",        label: "Working Group",             resource: "working_group", section: "oversight",  icon: "UsersRound" },

  // --- Administration, Audit & System Settings (Bottom) ---
  { href: "/dashboard/users",                label: "Users",                    resource: "user",          section: "admin",      icon: "UserCog", roles: ["super_admin", "it_mis_rep"] },
  { href: "/dashboard/audit-log",            label: "Audit Log",                resource: "audit_log",     section: "admin",      icon: "History" },
  { href: "/dashboard/admin",                label: "Administration",           resource: "user",          section: "admin",      icon: "SlidersHorizontal", roles: ["super_admin"] },
  { href: "/dashboard/change-password",      label: "Change Password",          resource: null,            section: "admin",      icon: "KeyRound" },
];

export function getMenuForRole(role: Role, hospitalId: number | null): MenuEntry[] {
  const user = { id: 0, role, hospitalId };
  return MENU.filter((m) => {
    if (m.roles && !m.roles.includes(role)) return false;
    return m.resource === null || can(user, m.resource, "read") || can(user, m.resource, "create");
  });
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  hospital_director: "Hospital Director",
  additional_director: "Additional Hospital Director",
  medical_superintendent: "Medical Director",
  health_desk_officer: "Help Desk Representative",
  sehat_card_desk: "Sehat Card Plus Desk",
  pharmacy_rep: "Pharmacy",
  diagnostics_rep: "Diagnostics / Radiology",
  admin_finance_rep: "Admin / Finance",
  nursing_rep: "Nursing",
  it_mis_rep: "IT / MIS",
  working_group_member: "Working Group Member",
};

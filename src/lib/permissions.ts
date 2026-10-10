import { prisma } from "@/lib/db";
import { getCurrentUser, getCookieName } from "@/lib/auth";
import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";

export type Resource =
  | "family"
  | "card"
  | "visit"
  | "sehat_claim"
  | "grievance"
  | "monthly_report"
  | "action_tracker"
  | "user"
  | "audit_log"
  | "working_group";

export type Action =
  | "read"
  | "create"
  | "edit"
  | "approve"
  | "propose_status_change"
  | "authorize_status_change"
  | "propose_lost_replacement"
  | "authorize_lost_replacement"
  | "propose_misuse_flag"
  | "authorize_misuse_flag"
  | "edit_sehat_section"
  | "working_group_review"
  | "closure"
  | "comments"
  | "sign"
  | "manage"
  | "record_verification"
  | "authorize";

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

export const WG_ROLES: Role[] = [
  "sehat_card_desk",
  "pharmacy_rep",
  "diagnostics_rep",
  "admin_finance_rep",
  "nursing_rep",
  "it_mis_rep",
  "working_group_member",
];

const DIRECTORS: Role[] = ["hospital_director", "additional_director"];

// visit/grievance/monthly_report READ allowed for everyone, but all-hospital for these roles
const ALL_HOSPITAL_READERS = [...DIRECTORS, ...WG_ROLES];

const HEALTH_DESK: Role[] = ["health_desk_officer"];
const HEALTH_DESK_AND_DIRECTORS: Role[] = [...HEALTH_DESK, ...DIRECTORS];
const CLINICAL_STAFF: Role[] = ["health_desk_officer", "pharmacy_rep", "diagnostics_rep", "nursing_rep", ...DIRECTORS];
const REPORT_ROLES: Role[] = ["health_desk_officer", "medical_superintendent", ...DIRECTORS, ...WG_ROLES];

export const MATRIX: Record<Resource, Partial<Record<Action, Role[]>>> = {
  family: {
    read: HEALTH_DESK_AND_DIRECTORS,
    create: HEALTH_DESK,
    edit: HEALTH_DESK,
    approve: DIRECTORS,
    record_verification: HEALTH_DESK,
    authorize: DIRECTORS,
  },
  card: {
    read: HEALTH_DESK_AND_DIRECTORS,
    create: HEALTH_DESK,
    edit: HEALTH_DESK,
    approve: DIRECTORS,
    propose_status_change: HEALTH_DESK,
    authorize_status_change: DIRECTORS,
    propose_lost_replacement: HEALTH_DESK,
    authorize_lost_replacement: DIRECTORS,
    propose_misuse_flag: HEALTH_DESK,
    authorize_misuse_flag: DIRECTORS,
  },
  visit: {
    read: CLINICAL_STAFF,
    create: HEALTH_DESK,
    edit: HEALTH_DESK,
  },
  sehat_claim: {
    read: ["health_desk_officer", "sehat_card_desk", ...DIRECTORS],
    edit_sehat_section: ["sehat_card_desk", "health_desk_officer"],
  },
  grievance: {
    read: ["health_desk_officer", "medical_superintendent", ...DIRECTORS, "additional_director"],
    create: HEALTH_DESK,
    working_group_review: ["additional_director"],
    closure: ["medical_superintendent", "additional_director"],
  },
  monthly_report: {
    read: REPORT_ROLES,
    create: HEALTH_DESK,
    edit: HEALTH_DESK,
    comments: ["additional_director"],
    sign: ["hospital_director"],
  },
  action_tracker: {
    read: ["super_admin", "hospital_director", "additional_director", "medical_superintendent", ...WG_ROLES],
    create: ["additional_director"],
    edit: ["additional_director"],
  },
  user: {
    read: ["super_admin", "it_mis_rep"],
    create: ["super_admin", "it_mis_rep"],
    edit: ["super_admin", "it_mis_rep"],
    manage: ["super_admin", "it_mis_rep"],
  },
  audit_log: {
    read: ["super_admin", "hospital_director", "additional_director", "it_mis_rep"],
  },
  working_group: {
    read: ["super_admin", "hospital_director", "additional_director", "medical_superintendent", "health_desk_officer", ...WG_ROLES],
  },
};

// Roles that may read a resource across ALL hospitals (no hospital restriction).
const ALL_HOSPITAL_ROLES: Record<Resource, Role[]> = {
  family: ALL_ROLES, // shared across hospitals
  card: ALL_ROLES, // shared across hospitals
  visit: ALL_HOSPITAL_READERS,
  sehat_claim: ALL_HOSPITAL_READERS,
  grievance: ALL_HOSPITAL_READERS,
  monthly_report: ALL_HOSPITAL_READERS,
  action_tracker: ["super_admin", "hospital_director", "additional_director", ...WG_ROLES],
  user: ["super_admin", "it_mis_rep"],
  audit_log: ["super_admin", "hospital_director", "additional_director", "it_mis_rep"],
  working_group: ["super_admin", "hospital_director", "additional_director", "medical_superintendent", "health_desk_officer", ...WG_ROLES],
};

export type SessionUser = {
  id: number;
  role: Role;
  hospitalId: number | null;
  email?: string;
};

export function can(user: SessionUser, resource: Resource, action: Action): boolean {
  const roles = MATRIX[resource]?.[action];
  if (!roles) return false;
  return roles.includes(user.role);
}

export async function requireUser(req?: NextRequest): Promise<SessionUser> {
  const user = await getCurrentUser(req?.cookies.get(getCookieName())?.value);
  if (!user) {
    throw new AuthError(401, "Unauthorized");
  }
  if (user.mustChangePassword) throw new AuthError(403, "Change your password before using the staff portal");
  return { id: user.id, role: user.role, hospitalId: user.hospitalId, email: user.email };
}

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requirePermission(resource: Resource, action: Action, req?: NextRequest): Promise<SessionUser> {
  const user = await requireUser(req);
  if (!can(user, resource, action)) {
    await prisma.auditLog
      .create({ data: { who: user.email ?? String(user.id), role: user.role, action: "forbidden", entity: resource, entityId: null, hospitalId: user.hospitalId } })
      .catch(() => {});
    throw new AuthError(403, "Forbidden");
  }
  return user;
}

const SCOPED_RESOURCES: Resource[] = ["visit", "sehat_claim", "grievance", "monthly_report", "action_tracker", "user", "audit_log"];

export function hospitalScope(user: SessionUser, resource: Resource): Record<string, unknown> {
  if (!SCOPED_RESOURCES.includes(resource)) return {};
  if (ALL_HOSPITAL_ROLES[resource].includes(user.role)) return {};
  if (resource === "action_tracker") {
    return user.hospitalId ? { monthlyReport: { hospitalId: user.hospitalId } } : { id: -1 };
  }
  return user.hospitalId ? { hospitalId: user.hospitalId } : { hospitalId: -1 };
}

// Emergency rule: an emergency visit with pending verification must still be
// savable. Permissions never depend on verification fields, and this helper
// makes the intent explicit for route handlers.
export function canSaveEmergencyVisit(user: SessionUser, opts: { isEmergency: boolean; verificationPending: boolean }): boolean {
  if (opts.isEmergency) return can(user, "visit", "create") || can(user, "visit", "edit");
  return can(user, "visit", "create") || can(user, "visit", "edit");
}

// Audit when a user reads a record from ANOTHER hospital that their role allows.
export async function auditCrossHospitalRead(user: SessionUser, resource: Resource, recordHospitalId: number | null) {
  if (recordHospitalId == null || user.hospitalId === recordHospitalId) return;
  if (!ALL_HOSPITAL_ROLES[resource].includes(user.role)) return;
  await prisma.auditLog
    .create({
      data: {
        who: user.email ?? String(user.id),
        role: user.role,
        action: "cross_hospital_read",
        entity: resource,
        entityId: null,
        hospitalId: recordHospitalId,
      },
    })
    .catch(() => {});
}

export async function logForbidden(user: SessionUser | null, resource: Resource) {
  await prisma.auditLog
    .create({
      data: {
        who: user?.email ?? "anonymous",
        role: user?.role ?? "unknown",
        action: "forbidden",
        entity: resource,
        entityId: null,
        hospitalId: user?.hospitalId ?? null,
      },
    })
    .catch(() => {});
}

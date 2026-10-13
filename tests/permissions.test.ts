import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Role } from "@prisma/client";
import { MATRIX, can, hospitalScope, auditCrossHospitalRead, logForbidden, requirePermission, AuthError, type SessionUser } from "@/lib/permissions";

vi.mock("@/lib/db", () => ({
  prisma: { auditLog: { create: vi.fn().mockResolvedValue({}) } },
}));

const getCurrentUser = vi.fn();
vi.mock("@/lib/auth", () => ({
  getCurrentUser: (...args: unknown[]) => getCurrentUser(...args),
}));

import { prisma } from "@/lib/db";

const ALL_ROLES: Role[] = [
  "hospital_director",
  "additional_director",
  "medical_superintendent",
  "health_desk_officer",
  "admin_finance_rep",
  "sehat_card_desk",
  "pharmacy_rep",
  "diagnostics_rep",
  "nursing_rep",
  "it_mis_rep",
];

type Action = "read" | "create" | "edit" | "approve" | "propose_status_change" | "authorize_status_change" |
  "propose_lost_replacement" | "authorize_lost_replacement" | "propose_misuse_flag" |
  "authorize_misuse_flag" | "edit_sehat_section" | "working_group_review" | "closure" |
  "comments" | "sign" | "manage";

describe("permission matrix (table-driven, every role x resource x action)", () => {
  for (const [resource, actions] of Object.entries(MATRIX)) {
    for (const action of Object.keys(actions)) {
      for (const role of ALL_ROLES) {
        it(`${role} ${action} ${resource}`, () => {
          const allowed = (actions as Record<string, Role[]>)[action]?.includes(role) ?? false;
          const user: SessionUser = { id: 1, role, hospitalId: 1 };
          expect(can(user, resource as keyof typeof MATRIX, action as Action)).toBe(allowed);
        });
      }
    }
  }
});

describe("specific rules", () => {
  const dhqDesk: SessionUser = { id: 2, role: "health_desk_officer", hospitalId: 1 };
  const mmmthMs: SessionUser = { id: 3, role: "medical_superintendent", hospitalId: 2 };
  const wgIt: SessionUser = { id: 4, role: "it_mis_rep", hospitalId: null };

  it("health_desk of DHQ is scoped to DHQ for visit and grievance", () => {
    expect(hospitalScope(dhqDesk, "visit")).toEqual({ hospitalId: 1 });
    expect(hospitalScope(dhqDesk, "grievance")).toEqual({ hospitalId: 1 });
  });

  it("MS of MMMTH is scoped to MMMTH for visits", () => {
    expect(hospitalScope(mmmthMs, "visit")).toEqual({ hospitalId: 2 });
  });

  it("every role can read family and card across hospitals (empty scope)", () => {
    for (const role of ALL_ROLES) {
      const u: SessionUser = { id: 1, role, hospitalId: null };
      expect(hospitalScope(u, "family")).toEqual({});
      expect(hospitalScope(u, "card")).toEqual({});
      expect(can(u, "family", "read")).toBe(true);
      expect(can(u, "card", "read")).toBe(true);
    }
  });

  it("only it_mis_rep can manage users", () => {
    for (const role of ALL_ROLES) {
      const u: SessionUser = { id: 1, role, hospitalId: null };
      expect(can(u, "user", "manage")).toBe(role === "it_mis_rep");
    }
    expect(can(wgIt, "user", "manage")).toBe(true);
  });

  it("only director / additional director / it_mis_rep can read audit logs", () => {
    for (const role of ALL_ROLES) {
      const u: SessionUser = { id: 1, role, hospitalId: null };
      const expected = ["hospital_director", "additional_director", "it_mis_rep"].includes(role);
      expect(can(u, "audit_log", "read")).toBe(expected);
    }
  });

  it("emergency visit with pending verification can still be saved", () => {
    expect(can(dhqDesk, "visit", "create") || can(dhqDesk, "visit", "edit")).toBe(true);
  });

  it("hospitalScope fragments for director/wg are unrestricted", () => {
    const director: SessionUser = { id: 1, role: "hospital_director", hospitalId: null };
    expect(hospitalScope(director, "visit")).toEqual({});
    expect(hospitalScope(director, "grievance")).toEqual({});
    expect(hospitalScope(director, "monthly_report")).toEqual({});
    const wgRoleNames: Role[] = ["sehat_card_desk", "pharmacy_rep", "diagnostics_rep", "admin_finance_rep", "nursing_rep", "it_mis_rep"];
    for (const wg of ALL_ROLES.filter((r) => wgRoleNames.includes(r))) {
      const u: SessionUser = { id: 5, role: wg, hospitalId: null };
      expect(hospitalScope(u, "visit")).toEqual({});
    }
  });
});

describe("403 auditing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requirePermission throws 403 and writes an audit row", async () => {
    getCurrentUser.mockResolvedValue({ id: 9, role: "admin_finance_rep", hospitalId: null, isActive: true, email: "wg.admin@demo.dsfhi.local" });
    await expect(requirePermission("user", "manage")).rejects.toThrow(AuthError);
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ action: "forbidden", entity: "user" }) })
    );
  });

it("logForbidden writes an audit row", async () => {
    await logForbidden({ id: 1, role: "pharmacy_rep", hospitalId: null }, "visit");
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ action: "forbidden", entity: "visit" }) })
    );
  });

  it("cross-hospital read by an allowed role writes an audit row", async () => {
    const wg: SessionUser = { id: 7, role: "it_mis_rep", hospitalId: null, email: "wg.it@demo.dsfhi.local" };
    await auditCrossHospitalRead(wg, "visit", 2);
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ action: "cross_hospital_read", hospitalId: 2 }) })
    );
  });

  it("same-hospital read does NOT write a cross-hospital audit row", async () => {
    const u: SessionUser = { id: 8, role: "nursing_rep", hospitalId: 3, email: "x@y.z" };
    await auditCrossHospitalRead(u, "visit", 3);
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });
});

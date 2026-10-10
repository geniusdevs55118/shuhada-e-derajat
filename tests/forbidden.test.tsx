import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Role } from "@prisma/client";

vi.mock("@/lib/db", () => ({
  prisma: { auditLog: { create: vi.fn().mockResolvedValue({}) } },
}));

const getCurrentUser = vi.fn();
vi.mock("@/lib/auth", () => ({
  getCurrentUser: (...args: unknown[]) => getCurrentUser(...args),
}));

import { ResourceGuard } from "@/components/dashboard/resource-guard";

const roles: { role: Role; expected: "403" | "ok" }[] = [
  { role: "it_mis_rep", expected: "ok" },
  { role: "hospital_director", expected: "403" },
  { role: "additional_director", expected: "403" },
  { role: "medical_superintendent", expected: "403" },
  { role: "health_desk_officer", expected: "403" },
  { role: "admin_finance_rep", expected: "403" },
  { role: "sehat_card_desk", expected: "403" },
  { role: "pharmacy_rep", expected: "403" },
  { role: "diagnostics_rep", expected: "403" },
  { role: "nursing_rep", expected: "403" },
];

describe("ResourceGuard", () => {
  it("a role without permission gets the 403 page; it_mis_rep gets through", async () => {
    for (const { role, expected } of roles) {
      getCurrentUser.mockResolvedValue({ id: 1, role, hospitalId: null, email: "x@y", isActive: true });
      const ui = await ResourceGuard({ resource: "user", title: "Users" });
      const { unmount } = render(ui);
      if (expected === "403") {
        expect(screen.getByText("Access denied"), role).toBeInTheDocument();
        expect(screen.getByText("403")).toBeInTheDocument();
      } else {
        expect(screen.queryByText("403")).not.toBeInTheDocument();
        expect(screen.getAllByText(/Users/).length).toBeGreaterThan(0);
      }
      unmount();
    }
  });
});

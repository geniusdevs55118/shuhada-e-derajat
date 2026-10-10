import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { GrievancesView, type GrievanceRow } from "@/components/grievances/grievances-view";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 22: Grievances UI View", () => {
  it("renders grievances table with RED alerts and action controls", () => {
    const rows: GrievanceRow[] = [
      {
        id: 1,
        grievanceNo: "GRV-2026-000001",
        dateTime: new Date("2026-03-01T10:00:00Z"),
        beneficiaryName: "Ahmad Khan",
        hospitalCode: "DHQ",
        priority: "IMMEDIATE",
        isRedAlert: true,
        closureStatus: null,
      },
    ];

    render(
      <GrievancesView
        rows={rows}
        total={1}
        page={1}
        pageSize={10}
        search=""
        priority="all"
        hospitalId="all"
        hospitals={[{ id: 1, code: "DHQ", name: "DHQ Teaching Hospital" }]}
        canCreate={true}
      />
    );

    expect(screen.getAllByText("GRV-2026-000001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ahmad Khan").length).toBeGreaterThan(0);
    expect(screen.getAllByText("RED ALERT").length).toBeGreaterThan(0);
    expect(screen.getByText("Lodge Grievance")).toBeInTheDocument();
  });
});

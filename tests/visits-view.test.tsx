import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { VisitsView } from "@/components/visits/visits-view";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 19: Visits UI View", () => {
  it("renders visits table with data and emergency indicators", () => {
    const rows = [
      {
        id: 1,
        visitNo: "VIS-2026-000001",
        dateTime: new Date("2026-03-01T10:00:00Z"),
        beneficiaryName: "Fatima Bibi",
        familyRegistrationNo: "FR-000001",
        healthCardNo: "DSHC-000001",
        hospitalCode: "DHQ",
        isEmergency: true,
        finalStatus: "FACILITATED",
        verification: "VERIFIED",
      },
    ];

    render(
      <VisitsView
        rows={rows}
        total={1}
        page={1}
        pageSize={10}
        search=""
        hospitalId="all"
        hospitals={[{ id: 1, code: "DHQ", name: "DHQ Teaching Hospital" }]}
        canCreate={true}
        emergencyOnly=""
      />
    );

    expect(screen.getAllByText("VIS-2026-000001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Fatima Bibi").length).toBeGreaterThan(0);
    expect(screen.getAllByText("EMERGENCY").length).toBeGreaterThan(0);
    expect(screen.getByText("Record New Visit")).toBeInTheDocument();
  });
});

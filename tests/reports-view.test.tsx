import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MonthlyReportsView } from "@/components/reports/monthly-reports-view";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 24: Reports UI View", () => {
  it("renders monthly reports controls and sections", () => {
    const hospitals = [
      { id: 1, code: "DHQ", name: "DHQ Teaching Hospital" },
      { id: 2, code: "MMMTH", name: "MMM Teaching Hospital" },
    ];

    render(
      <MonthlyReportsView
        hospitals={hospitals}
        reports={[]}
        defaultMonth={1}
        defaultYear={2026}
        canCreate={true}
      />
    );

    expect(
      screen.getByText("Monthly Monitoring, Evaluation & Facilitation Report")
    ).toBeInTheDocument();
    expect(screen.getByText("Generate Live Summary")).toBeInTheDocument();
  });
});

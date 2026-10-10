import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/dashboard",
}));

const menu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/families", label: "Families" },
];

const user = { name: "Dr. Khan", role: "medical_superintendent", hospital: "DHQ" };

describe("Dashboard layout", () => {
  it("renders the sidebar from the menu config", () => {
    render(<DashboardShell menu={menu} user={user}>body</DashboardShell>);
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Families").length).toBeGreaterThan(0);
    expect(screen.getByText("Dr. Khan")).toBeInTheDocument();
    expect(screen.getByText("DHQ")).toBeInTheDocument();
  });

  it("opens the mobile drawer", async () => {
    render(<DashboardShell menu={menu} user={user}>body</DashboardShell>);
    await userEvent.click(screen.getByRole("button", { name: "Open sidebar" }));
    expect(await screen.findAllByText("Families")).not.toHaveLength(0);
  });
});

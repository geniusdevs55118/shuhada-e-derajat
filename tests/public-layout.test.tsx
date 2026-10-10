import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublicLayout from "@/app/(public)/layout";

describe("Public layout", () => {
  it("renders navbar links and footer", () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Services").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Three Hospitals").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Verify Card").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About Initiative").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
    expect(screen.getByText(/Honouring the Shuhada/)).toBeInTheDocument();
  });

  it("opens the mobile menu", async () => {
    render(<PublicLayout>content</PublicLayout>);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(await screen.findAllByRole("link", { name: /Staff Login/i })).not.toHaveLength(0);
  });
});

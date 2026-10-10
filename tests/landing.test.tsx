import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "@/app/(public)/page";

describe("Landing page", () => {
  it("renders all sections in order", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "One Family Record. Three Hospitals. One Coordinated Healthcare Pathway.",
      "Three Hospitals, One Institutional Commitment",
      "Scope of Healthcare Facilitation",
      "Derajat Shuhada Family Health Card",
      "Eligible Family Members",
      "Our Core Principles",
      "Grievance and Feedback",
    ]);
  });

  it("shows the 12 services with exact wording", () => {
    render(<Home />);
    const services = [
      "OPD and Specialist Consultation",
      "Emergency and Trauma Care",
      "Diagnostics (Lab and Radiology)",
      "Medicines and Pharmacy",
      "Inpatient Admission and Medical Treatment",
      "Surgical Procedures and Operation",
      "Maternal, Paediatric and Neonatal Care",
      "ICU and Critical Care",
      "Rehabilitation and Follow-up",
      "Sehat Card Plus Facilitation",
      "Ambulance Coordination",
      "Referral Facilitation",
    ];
    for (const s of services) expect(screen.getByText(s)).toBeInTheDocument();
  });

  it("shows the 9 principles with exact wording", () => {
    render(<Home />);
    const principles = [
      "Honour the Sacrifice",
      "Respect Families",
      "Protect Dignity",
      "Facilitate Do Not Complicate",
      "Verify Once Facilitate Consistently",
      "Emergency Care First",
      "No Unnecessary Movement Between Offices",
      "Confidentiality and Privacy",
      "Monitor Evaluate and Improve",
    ];
    for (const p of principles) expect(screen.getAllByText(p).length).toBeGreaterThan(0);
  });

  it("hero buttons link to /verify and /login", () => {
    render(<Home />);
    const hero = screen.getByText("Derajat Shuhada Family Healthcare Initiative").closest("section")!;
    const links = within(hero as HTMLElement).getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/verify");
    expect(hrefs).toContain("/login");
  });

  it("does not show security statistics", () => {
    render(<Home />);
    expect(screen.queryByText(/terrorism/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/casualt/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\b1,588\b|\b8\.574\b|\b1,045\b/)).not.toBeInTheDocument();
  });
});

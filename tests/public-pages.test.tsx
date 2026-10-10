import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/(public)/about/page";
import ServicesPage from "@/app/(public)/services/page";
import HospitalsPage from "@/app/(public)/hospitals/page";
import ContactPage from "@/app/(public)/contact/page";
import { SiteFooter } from "@/components/public/site-footer";
import { siteConfig } from "@/lib/site-config";

describe("About page", () => {
  it("renders sections in order with counts", () => {
    render(<AboutPage />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "Rationale and Justification",
      "Objectives",
      "Core Principles",
      "Verify Once, Record Securely, Facilitate Consistently",
      "Priority with Dignity - Clinical Care with Fairness",
      "Not Privilege, Recognition with Responsibility",
      "Dignity, Confidentiality and Respect",
      "Our Institutional Commitment",
      "Our Message",
    ]);
  });

  it("shows 5 rationale points, 6 objectives and 9 principles", () => {
    const { container } = render(<AboutPage />);
    const lists = container.querySelectorAll("ol");
    expect(lists[0].children).toHaveLength(5);
    expect(lists[1].children).toHaveLength(6);
    const principleItems = screen.getAllByText(/^(Honour the Sacrifice|Respect Families|Protect Dignity|Facilitate Do Not Complicate|Verify Once Facilitate Consistently|Emergency Care First|No Unnecessary Movement Between Offices|Confidentiality and Privacy|Monitor Evaluate and Improve)$/);
    expect(principleItems).toHaveLength(9);
  });

  it("shows 6 institutional commitment lines", () => {
    render(<AboutPage />);
    expect(screen.getAllByText(/^To /)).toHaveLength(6);
  });

  it("no security statistics anywhere", () => {
    render(<AboutPage />);
    expect(screen.queryByText(/terrorism/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\b1,588\b|\b8\.574\b/)).not.toBeInTheDocument();
  });
});

describe("Services page", () => {
  it("shows exactly the 12 services", () => {
    render(<ServicesPage />);
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards).toHaveLength(12);
  });

  it("shows the sehat card plus and emergency sections", () => {
    render(<ServicesPage />);
    expect(screen.getByText("Sehat Card Plus: Integration, Not Duplication")).toBeInTheDocument();
    expect(screen.getByText("Emergency Care First")).toBeInTheDocument();
    expect(screen.getByText(/subject to clinical need, applicable rules and the availability/i)).toBeInTheDocument();
  });

  it("no security statistics", () => {
    render(<ServicesPage />);
    expect(screen.queryByText(/terrorism/i)).not.toBeInTheDocument();
  });
});

describe("Hospitals page", () => {
  it("shows three hospital cards", () => {
    render(<HospitalsPage />);
    expect(screen.getByText("District Headquarters Teaching Hospital")).toBeInTheDocument();
    expect(screen.getByText("Mufti Mehmood Memorial Teaching Hospital")).toBeInTheDocument();
    expect(screen.getByText("Derajat Women & Children Hospital")).toBeInTheDocument();
    expect(screen.getByText("Maternal, women and child healthcare.")).toBeInTheDocument();
  });

  it("shows the one window explanation and 14 service points", () => {
    render(<HospitalsPage />);
    expect(screen.getByText("One Window, One Verified Record, One Facilitation Pathway")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(14);
  });
});

describe("Contact page", () => {
  it("shows fallback message when config is empty", () => {
    render(<ContactPage />);
    expect(screen.getAllByText("Contact details will be announced by the institution.")).toHaveLength(3);
  });
});

describe("Contact page with filled config", () => {
  it("shows the values when config is filled", async () => {
    vi.resetModules();
    vi.doMock("@/lib/site-config", () => ({
      siteConfig: {
        institutionName: "MMMMTI",
        institutionCity: "Dera Ismail Khan",
        shortName: "DSFHI",
        tagline: "tag",
        address: "Main Hospital Road, DI Khan",
        phone: "092-1234567",
        email: "info@example.com",
        hospitals: [
          { name: "DHQ", city: "DI Khan", healthDeskContact: "Desk DHQ: ext 101" },
          { name: "MMMTH", city: "DI Khan", healthDeskContact: "" },
        ],
      },
    }));
    const { default: FilledContact } = await import("@/app/(public)/contact/page");
    render(<FilledContact />);
    expect(screen.getByText("Main Hospital Road, DI Khan")).toBeInTheDocument();
    expect(screen.getByText("092-1234567")).toBeInTheDocument();
    expect(screen.getByText("info@example.com")).toBeInTheDocument();
    expect(screen.getByText("Desk DHQ: ext 101")).toBeInTheDocument();
    expect(screen.getAllByText("Contact details will be announced by the institution.")).toHaveLength(1);
    vi.doUnmock("@/lib/site-config");
  });
});

describe("Footer", () => {
  it("shows config values (institution name, hospital names)", () => {
    render(<SiteFooter />);
    expect(screen.getAllByText(/Mufti Mehmood Memorial Medical Teaching Institution/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(siteConfig.tagline).length).toBeGreaterThan(0);
    for (const h of siteConfig.hospitals) {
      expect(screen.getAllByText(h.name).length).toBeGreaterThan(0);
    }
  });
});

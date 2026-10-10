import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FamilyForm } from "@/components/families/family-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const STEP_LABELS = [
  "A. Particulars of Shaheed",
  "B. Primary Family Contact",
  "C. Eligible Family Members",
  "D. Documents Submitted",
  "G. Hospital Access",
  "H. Declaration by Applicant",
  "Review & Submit",
];

const PDF_DOC_OPTIONS = [
  "Official Shahadat Certificate / Verification",
  "CNIC of Shaheed",
  "CNIC of Applicant",
  "CNIC / B-Form of Family Members",
  "Family Registration Certificate / Proof of Relationship",
  "Dependency Certificate, where applicable",
  "Disability Documentation, where applicable",
  "Domicile / Residence Record, where required",
  "Beneficiary Photographs",
  "Departmental / Service Verification",
  "Other",
];

describe("FamilyForm", () => {
  it("renders all 7 steps in order with exact PDF labels", () => {
    render(<FamilyForm mode="create" />);
    const steps = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(steps).toEqual(STEP_LABELS);
  });

  it("shows all 11 document options on step 4", async () => {
    const user = userEvent.setup();
    render(<FamilyForm mode="create" />);

    await user.type(screen.getByLabelText(/full name/i), "Demo Shaheed");
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.type(screen.getByLabelText(/^name$/i), "Demo Contact");
    await user.type(screen.getByLabelText(/relationship with shaheed/i), "Spouse");
    await user.type(screen.getByLabelText(/cnic no\./i), "12345-1234567-1");
    await user.type(screen.getByLabelText(/mobile no\./i), "03000000000");
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.type(screen.getByLabelText(/member 1 name/i), "Member One");
    await user.type(screen.getByLabelText(/member 1 relationship/i), "Child");
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const label of PDF_DOC_OPTIONS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("members rows add/remove and renumber", async () => {
    const user = userEvent.setup();
    render(<FamilyForm mode="create" />);

    await user.type(screen.getByLabelText(/full name/i), "Demo Shaheed");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.type(screen.getByLabelText(/^name$/i), "Demo Contact");
    await user.type(screen.getByLabelText(/relationship with shaheed/i), "Spouse");
    await user.type(screen.getByLabelText(/cnic no\./i), "12345-1234567-1");
    await user.type(screen.getByLabelText(/mobile no\./i), "03000000000");
    await user.click(screen.getByRole("button", { name: "Next" }));

    const table = screen.getByRole("table");
    let rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(2); // header + 1 row

    await user.click(screen.getByRole("button", { name: /add member/i }));
    rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getByText("1")).toBeInTheDocument();
    expect(within(rows[2]).getByText("2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove member 1/i }));
    rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(2);
    expect(within(rows[1]).getByText("1")).toBeInTheDocument();
  });

  it("shows validation errors when moving next with empty required fields", async () => {
    const user = userEvent.setup();
    render(<FamilyForm mode="create" />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Name of Shaheed is required")).toBeInTheDocument();
  });

  it("CNIC mask formats input", async () => {
    const user = userEvent.setup();
    render(<FamilyForm mode="create" />);

    await user.type(screen.getByLabelText(/full name/i), "Demo Shaheed");
    await user.click(screen.getByRole("button", { name: "Next" }));

    const cnic = screen.getByLabelText(/cnic no\./i);
    await user.type(cnic, "1234512345671");
    expect(cnic).toHaveValue("12345-1234567-1");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/login-form";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}));

describe("LoginForm", () => {
  it("shows validation messages for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("shows generic error on failed login", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => ({ error: "Invalid username or password" }) })));
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/username/i), "desk.dhq");
    await user.type(screen.getByLabelText(/^password$/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("Invalid username or password")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("redirects to /dashboard on successful login", async () => {
    push.mockClear();
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({}) })));
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/username/i), "desk.dhq");
    await user.type(screen.getByLabelText(/^password$/i), "demo-password-123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await screen.findByRole("button", { name: /sign in/i });
    await new Promise((r) => setTimeout(r, 50));
    expect(push).toHaveBeenCalledWith("/dashboard");
    vi.unstubAllGlobals();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const password = screen.getByLabelText(/^password$/i);
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(password).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(password).toHaveAttribute("type", "password");
  });
});

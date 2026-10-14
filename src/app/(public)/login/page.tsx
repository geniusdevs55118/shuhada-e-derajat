import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

const DEMO_ACCOUNTS = [
  { role: "Hospital Director", username: "director123" },
  { role: "Additional Hospital Director", username: "addldirector123" },
  { role: "Medical Superintendent", username: "ms123" },
  { role: "Health Desk Focal Person (DHQ)", username: "helpdesk123" },
  { role: "Health Desk Focal Person (MMMTH)", username: "deskmmmth123" },
  { role: "Health Desk Focal Person (W&C)", username: "deskwc123" },
  { role: "Administration / Finance", username: "admin123" },
  { role: "Sehat Card Plus", username: "sehat123" },
  { role: "Pharmacy", username: "pharmacy123" },
  { role: "Diagnostics / Radiology", username: "diagnostics123" },
  { role: "Nursing", username: "nursing123" },
  { role: "IT / MIS", username: "it123" },
  { role: "Super Administrator", username: "superadmin123" },
];

async function LoginGate() {
  await connection();
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  return (
    <LoginForm
      demoAccounts={process.env.NODE_ENV === "production" ? [] : DEMO_ACCOUNTS}
      demoPassword={process.env.NODE_ENV === "production" ? "" : process.env.SEED_DEMO_PASSWORD ?? ""}
    />
  );
}

export default function LoginPage() {
  return (
    <main className="bg-slate-100">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_25rem] md:gap-16 md:py-16">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Staff access</p>
          <h1 className="mt-3 font-heading text-3xl leading-tight text-blue-950 sm:text-4xl">Institutional portal</h1>
          <p className="mt-4 leading-7 text-gray-600">
            Authorised staff can access family records, coordinate healthcare facilitation and follow institutional
            review processes.
          </p>
          <div className="mt-8 border-y border-border py-5">
            <p className="text-sm font-semibold text-gray-900">Secure access</p>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use the username and password assigned by your administrator. Access is limited according to your role
              and hospital.
            </p>
          </div>
        </div>

        <section className="border border-border bg-white p-6 sm:p-8">
          <div className="mb-6 border-b border-border pb-5">
            <div>
              <h2 className="font-heading text-2xl text-blue-950">Sign in</h2>
              <p className="mt-0.5 text-sm text-gray-500">For authorised staff</p>
            </div>
          </div>
          <Suspense fallback={null}>
            <LoginGate />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

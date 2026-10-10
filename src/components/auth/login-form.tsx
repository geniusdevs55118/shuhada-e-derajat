"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type Values = z.infer<typeof schema>;
type DemoAccount = { role: string; username: string };

export function LoginForm({
  demoAccounts = [],
  demoPassword = "",
}: {
  demoAccounts?: DemoAccount[];
  demoPassword?: string;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDemo, setSelectedDemo] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const body = await res.json();
        router.push(body.user?.mustChangePassword ? "/dashboard/change-password" : "/dashboard");
        router.refresh();
        return;
      }
      const body = await res.json().catch(() => null);
      setServerError(body?.error ?? "Invalid username or password");
    } catch {
      setServerError("Unable to sign in. Check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {demoAccounts.length > 0 && (
        <div className="border-b border-border pb-5">
          <Label htmlFor="demo-account">Development test login</Label>
          <select
            id="demo-account"
            value={selectedDemo}
            onChange={(event) => {
              const account = demoAccounts.find((item) => item.username === event.target.value);
              setSelectedDemo(event.target.value);
              setValue("username", account?.username ?? "", { shouldValidate: true });
              if (account && demoPassword) setValue("password", demoPassword, { shouldValidate: true });
            }}
            className="mt-1.5 h-10 w-full border border-input bg-white px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <option value="">Choose a role account</option>
            {demoAccounts.map((account) => (
              <option key={account.username} value={account.username}>
                {account.role} · {account.username}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-muted-foreground">Select a seeded role to fill its test credentials.</p>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" autoComplete="username" {...register("username")} />
        {errors.username && <p role="alert" className="text-sm text-red-700">{errors.username.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            onClick={() => setShow((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p role="alert" className="text-sm text-red-700">{errors.password.message}</p>}
      </div>
      {serverError && <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-sm text-red-800">{serverError}</p>}
      <Button type="submit" className="w-full cursor-pointer rounded-md bg-blue-800 hover:bg-blue-700" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

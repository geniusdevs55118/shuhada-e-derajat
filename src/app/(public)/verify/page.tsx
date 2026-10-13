"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicPageIntro } from "@/components/public/page-intro";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const lookup = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter the verification code printed on the card, or scan the card QR code.");
      return;
    }
    setError("");
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main>
      <PublicPageIntro
        section="Beneficiary services"
        title="Verify a health card"
        description="Check the status of a Derajat Shuhada Family Health Card."
      />

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <form onSubmit={lookup} className="max-w-xl space-y-4">
          <div>
            <Label htmlFor="qr">Verification code</Label>
            <Input
              id="qr"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Enter the code printed under the QR code"
              className="mt-1.5"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              You can also scan the QR code on the card with any phone camera.
            </p>
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="bg-blue-800 hover:bg-blue-700">Verify card</Button>
        </form>

        <div className="mt-10 border-y border-border py-6">
          <h2 className="font-semibold text-blue-950">What this shows</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Verification confirms whether a card is currently active and which hospitals the family may visit. It does not
            disclose full personal records. For assistance, contact a Family Health Desk at one of the three hospitals.
          </p>
        </div>
      </section>
    </main>
  );
}
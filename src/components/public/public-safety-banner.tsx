"use client";

import { HeartPulse } from "lucide-react";

export function PublicSafetyBanner() {
  return (
    <aside
      className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-1.5 text-center text-[11px] sm:text-xs font-medium text-amber-950 shadow-2xs"
      role="note"
      aria-label="Emergency care policy notice"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <HeartPulse className="size-3.5 shrink-0 text-amber-700" />
        <span className="leading-snug">
          <strong className="font-bold text-amber-900">Emergency Care First:</strong> Immediate clinical triage and urgent life-saving care are never delayed for routine card verification.
        </span>
      </div>
    </aside>
  );
}

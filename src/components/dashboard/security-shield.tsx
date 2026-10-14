"use client";

import { useEffect } from "react";

interface SecurityShieldProps {
  userName: string;
  role: string;
  hospital: string;
}

export function SecurityShield({ userName, role, hospital }: SecurityShieldProps) {
  useEffect(() => {
    // Intercept bulk clipboard copy attempts inside dashboard
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disallow Ctrl+A / Cmd+A across entire dashboard tables to prevent mass-scraping
      if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
        const target = e.target as HTMLElement | null;
        // Allow select all inside editable form fields (inputs, textareas)
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
      }
    };

    // Prevent right-click context menu inspection on confidential dashboard data
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const watermarkText = `CONFIDENTIAL • ${userName} (${role}) • ${hospital} • ${todayStr}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] select-none overflow-hidden opacity-[0.035] dark:opacity-[0.06]"
      style={{
        backgroundImage: `repeating-linear-gradient(-30deg, transparent, transparent 180px, #000 180px, #000 181px)`,
      }}
    >
      <div className="absolute inset-0 flex flex-wrap items-center justify-around gap-24 p-8 text-slate-900 font-mono text-[11px] font-bold tracking-widest uppercase transform rotate-[-25deg] scale-125">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="whitespace-nowrap">
            {watermarkText}
          </span>
        ))}
      </div>
    </div>
  );
}

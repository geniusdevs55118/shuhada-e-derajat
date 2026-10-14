"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { Badge } from "@/components/ui/badge";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { SecurityShield } from "@/components/dashboard/security-shield";
import Image from "next/image";

import {
  LayoutDashboard,
  QrCode,
  CalendarClock,
  Users,
  CreditCard,
  Building2,
  ClipboardList,
  AlertTriangle,
  HeartPulse,
  Ambulance,
  UserCheck,
  MessageSquareQuote,
  BarChart3,
  CheckSquare,
  ShieldAlert,
  UsersRound,
  UserCog,
  History,
  SlidersHorizontal,
  KeyRound,
  CircleDot,
  LogOut,
} from "lucide-react";

export type MenuItem = {
  href: string;
  label: string;
  section?: "operations" | "oversight" | "admin";
  icon?: string;
};

export type DashboardUser = {
  id?: number;
  name: string;
  role: string;
  hospital: string;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  QrCode,
  CalendarClock,
  Users,
  CreditCard,
  Building2,
  ClipboardList,
  AlertTriangle,
  HeartPulse,
  Ambulance,
  UserCheck,
  MessageSquareQuote,
  BarChart3,
  CheckSquare,
  ShieldAlert,
  UsersRound,
  UserCog,
  History,
  SlidersHorizontal,
  KeyRound,
};

const SECTION_LABELS: Record<string, string> = {
  operations: "Daily Operations",
  oversight: "Monitoring & Oversight",
  admin: "Administration & Settings",
};

export function DashboardShell({
  menu,
  user,
  children,
}: {
  menu: MenuItem[];
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // Group menu items into sections while maintaining high-priority items at the top
  const sections: { key: string; label: string; items: MenuItem[] }[] = [];
  const grouped: Record<string, MenuItem[]> = { operations: [], oversight: [], admin: [] };

  for (const item of menu) {
    const sec = item.section || "operations";
    if (!grouped[sec]) grouped[sec] = [];
    grouped[sec].push(item);
  }

  if (grouped.operations.length) {
    sections.push({ key: "operations", label: SECTION_LABELS.operations, items: grouped.operations });
  }
  if (grouped.oversight.length) {
    sections.push({ key: "oversight", label: SECTION_LABELS.oversight, items: grouped.oversight });
  }
  if (grouped.admin.length) {
    sections.push({ key: "admin", label: SECTION_LABELS.admin, items: grouped.admin });
  }

  const sidebar = (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      {/* Fixed brand header at the top of the sidebar */}
      <div className="p-3.5 pb-2.5 shrink-0 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100">
          <Image src="/images/logo.svg" alt="Shuhada-e-Derajat Portal" width={38} height={38} className="shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold leading-tight text-blue-950 truncate">Shuhada-e-Derajat</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-700">Staff Portal</p>
          </div>
        </Link>
      </div>

      {/* Internal scrollable navigation for menus of any role */}
      <nav className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {sections.map((section, idx) => (
          <div key={section.key} className="space-y-1">
            <div className="flex items-center justify-between px-2.5 pb-1 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.label}
              </span>
              {idx === 0 && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                  Priority
                </span>
              )}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const IconComp = (item.icon && ICONS[item.icon]) ? ICONS[item.icon] : CircleDot;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                      active
                        ? "bg-[#01411c] font-semibold text-white shadow-sm shadow-[#01411c]/30 border-l-2 border-amber-400"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-[#01411c]"
                    }`}
                  >
                    <IconComp
                      className={`size-4 shrink-0 transition-colors ${
                        active ? "text-amber-300" : "text-slate-400 group-hover:text-emerald-700"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Quick Info & Logout fixed at bottom of sidebar */}
      <div className="border-t border-slate-200 bg-slate-50/70 p-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
            <p className="truncate text-[10px] text-slate-500">{user.role}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="flex size-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-screen max-h-screen overflow-hidden bg-slate-100">
      {/* Background Security Watermark & Anti-Theft Shield */}
      <SecurityShield userName={user.name} role={user.role} hospital={user.hospital} />

      {/* Desktop Fixed Sidebar - Stays stationary during page scroll */}
      <aside className="relative z-10 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col shrink-0 h-full overflow-hidden select-none">
        {sidebar}
      </aside>

      {/* Main View Area */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Subtle Pakistani National Tribute Top Strip - Fixed at top */}
        <div className="bg-[#01411c] px-3 py-1 text-center text-white border-b border-amber-500/40 flex items-center justify-between text-[11px] shrink-0">
          <span className="text-amber-300 font-serif">★</span>
          <span className="font-semibold tracking-wider uppercase text-[10px] sm:text-[11px] text-emerald-100 truncate">
            Shuhada-e-Derajat Family Healthcare Initiative • Honouring Sacrifice Through Care
          </span>
          <span className="hidden md:inline font-serif text-[11px] text-amber-200" dir="rtl">
            شہید کی جو موت ہے، وہ قوم کی حیات ہے
          </span>
          <span className="text-amber-300 font-serif">★</span>
        </div>

        {/* Top Header - Fixed at top */}
        <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-white px-3 py-2 sm:px-4 sm:py-2.5 shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Sheet open={open} onOpenChange={setOpen}>
              {open ? null : (
                <SheetTrigger
                  type="button"
                  className={`relative inline-flex size-9 cursor-pointer items-center justify-center rounded-[0.375rem] border border-border bg-slate-50 text-blue-950 transition-colors hover:bg-gray-100 md:hidden ${open ? "z-[60]" : "z-0"}`}
                  aria-label={open ? "Close sidebar" : "Open sidebar"}
                  aria-expanded={open}
                >
                  <MenuToggleIcon />
                </SheetTrigger>
              )}
              <SheetContent side="left" showCloseButton={true} className="w-72 p-0 h-full">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                {sidebar}
              </SheetContent>
            </Sheet>
            <span className="text-xs sm:text-sm text-gray-600 truncate">
              Welcome, <strong className="text-gray-900">{user.name}</strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <GlobalSearch />
            <NotificationBell />
            <Badge variant="secondary" className="rounded-sm text-xs px-2 py-0.5">{user.role}</Badge>
            <Badge className="rounded-sm bg-[#01411c] text-white text-xs px-2 py-0.5">{user.hospital}</Badge>
            <Button variant="outline" size="sm" className="h-8 cursor-pointer px-2.5 text-xs" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Scrollable Content Container - Only main content scrolls */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

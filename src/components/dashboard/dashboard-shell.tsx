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
import Image from "next/image";

export type MenuItem = { href: string; label: string };

export type DashboardUser = {
  id?: number;
  name: string;
  role: string;
  hospital: string;
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

  const sidebar = (
    <nav className="flex flex-col gap-1 p-4">
      <Link href="/" className="mb-4 flex items-center gap-2.5 px-2 py-1">
        <Image src="/images/logo.svg" alt="" width={38} height={38} className="shrink-0" />
        <div>
          <p className="font-heading text-base font-semibold leading-tight text-blue-950">Derajat Shuhada</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Staff portal</p>
        </div>
      </Link>
      <div className="my-1 border-t border-gray-100" />
      {menu.map((item) => {
        const active = item.href === "/dashboard"
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`rounded-lg border-l-2 px-3 py-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700 ${active ? "border-blue-700 bg-blue-50 text-blue-900" : "border-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-800"}`}>
          {item.label}
        </Link>;
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 border-r bg-white md:block shrink-0">{sidebar}</aside>
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Sheet open={open} onOpenChange={setOpen}>
              {open ? null : (
                <SheetTrigger
                  type="button"
                  className={`relative inline-flex size-9 cursor-pointer items-center justify-center rounded-[0.375rem] border border-border bg-slate-50 text-blue-950 transition-colors hover:bg-gray-100 md:hidden ${open ? "z-[60]" : "z-0"}`}
                  aria-label={open ? "Close sidebar" : "Open sidebar"}
                  aria-expanded={open}
                >
                  <MenuToggleIcon open={open} />
                </SheetTrigger>
              )}
              <SheetContent side="left" showCloseButton={true} className="w-72 p-0">
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
            <Badge className="rounded-sm bg-emerald-700 text-xs px-2 py-0.5">{user.hospital}</Badge>
            <Button variant="outline" size="sm" className="h-8 cursor-pointer px-2.5 text-xs" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-5 md:p-6 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

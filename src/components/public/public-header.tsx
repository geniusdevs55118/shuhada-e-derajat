"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";
import Image from "next/image";

type NavLinkProps = { href: string; label: string; onClick?: () => void; mobile?: boolean };

function ActivePublicNavLink({ href, label, onClick, mobile = false }: NavLinkProps) {
  const pathname = usePathname() ?? "";
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const base = mobile
    ? "block rounded-md px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    : "border-b-2 px-2 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
  const state = active
    ? mobile ? "bg-blue-50 text-blue-900" : "border-emerald-700 text-blue-950"
    : mobile ? "text-gray-700 hover:bg-blue-50 hover:text-blue-800" : "border-transparent text-gray-600 hover:border-blue-200 hover:text-blue-900";

  return (
    <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={base + " " + state}>
      {label}
    </Link>
  );
}

function PublicNavLink(props: NavLinkProps) {
  const fallbackClass = props.mobile
    ? "rounded-md px-3 py-2.5 text-sm font-medium text-gray-700"
    : "border-b-2 border-transparent px-2 py-3 text-sm font-medium text-gray-600";

  return (
    <Suspense fallback={<Link href={props.href} onClick={props.onClick} className={fallbackClass}>{props.label}</Link>}>
      <ActivePublicNavLink {...props} />
    </Suspense>
  );
}

const NAV_KEYS = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/hospitals", key: "hospitals" },
  { href: "/eligibility", key: "eligibility" },
  { href: "/faq", key: "faq" },
  { href: "/verify", key: "verify" },
  { href: "/about", key: "about" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useLang();
  const navLinks = NAV_KEYS.map((item) => ({ href: item.href, label: t(item.key, lang) }));

  return (
    <header className="relative bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-blue-900 focus:shadow-md">
        Skip to content
      </a>
      <div className="bg-blue-950 text-blue-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2 text-xs sm:px-8">
          <span className="hidden font-medium tracking-wide sm:inline">Derajat Shuhada Family Healthcare Initiative</span>
          <div className="ml-auto flex items-center gap-4">
            <button
              className="font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              aria-label={lang === "en" ? "Switch to Urdu" : "Switch to English"}
            >
              {lang === "en" ? "EN / اردو" : "اردو / EN"}
            </button>
            <Link href="/contact" className="hover:text-white hover:underline">Contact</Link>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image src="/images/logo.svg" alt="Derajat Shuhada Initiative" width={44} height={44} priority className="shrink-0" />
            <span className="min-w-0">
              <span className="block font-heading text-lg font-semibold leading-tight text-blue-950">Derajat Shuhada</span>
              <span className="mt-0.5 block text-[0.66rem] font-semibold uppercase tracking-[0.11em] text-gray-500">Family Healthcare Initiative</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-3 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => <PublicNavLink key={link.href} {...link} />)}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/contact" className="hidden px-2 py-2 text-sm font-medium text-gray-700 hover:text-blue-800 xl:inline-flex">Contact</Link>
            <Link href="/login" className={buttonVariants({ className: "hidden rounded-md bg-blue-800 px-4 text-white hover:bg-blue-700 sm:inline-flex" })}>
              Staff Login
            </Link>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                type="button"
                className={`relative inline-flex size-10 cursor-pointer items-center justify-center rounded-[0.375rem] border border-border bg-slate-50 text-blue-950 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 lg:hidden ${mobileOpen ? "z-[60]" : "z-0"}`}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <MenuToggleIcon />
              </SheetTrigger>
              <SheetContent side="right" showCloseButton={false} className="w-80 max-w-[88vw] p-0">
                <nav className="flex flex-col gap-1 px-4 pb-5 pt-28" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <PublicNavLink key={link.href} {...link} mobile onClick={() => setMobileOpen(false)} />
                  ))}
                  <PublicNavLink href="/how-it-works" label="How it works" mobile onClick={() => setMobileOpen(false)} />
                  <PublicNavLink href="/sehat-card-plus" label="Sehat Card Plus" mobile onClick={() => setMobileOpen(false)} />
                  <PublicNavLink href="/working-group" label="Working Group" mobile onClick={() => setMobileOpen(false)} />
                  <PublicNavLink href="/grievance" label="Lodge a grievance" mobile onClick={() => setMobileOpen(false)} />
                  <PublicNavLink href="/about" label="About" mobile onClick={() => setMobileOpen(false)} />
                  <PublicNavLink href="/contact" label="Contact" mobile onClick={() => setMobileOpen(false)} />
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={buttonVariants({ className: "mt-4 rounded-md bg-blue-800 text-white hover:bg-blue-700" })}
                  >
                    Staff Login
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

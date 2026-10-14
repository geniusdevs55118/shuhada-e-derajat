"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  HeartPulse,
  Award,
  HelpCircle,
  FileText,
  PhoneCall,
  LogIn,
  Globe,
  Menu,
  X,
  CreditCard,
  Users2,
  MessageSquareWarning,
  ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

interface NavLinkItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 7 primary navigation links - clean, concise, no line-wrapping on any desktop screen
const NAV_ITEMS: NavLinkItem[] = [
  { href: "/", labelKey: "home", icon: HeartPulse },
  { href: "/services", labelKey: "services", icon: Stethoscope },
  { href: "/hospitals", labelKey: "hospitals", icon: Building2 },
  { href: "/eligibility", labelKey: "eligibility", icon: FileText },
  { href: "/how-it-works", labelKey: "howItWorks", icon: Award },
  { href: "/about", labelKey: "about", icon: Award },
  { href: "/contact", labelKey: "contact", icon: PhoneCall },
];

function ActivePublicNavLink({
  href,
  label,
  icon: Icon,
  onClick,
  mobile = false,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
          active
            ? "bg-emerald-900 text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-100 hover:text-emerald-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`size-4 shrink-0 ${active ? "text-emerald-300" : "text-slate-500"}`} />
          <span>{label}</span>
        </div>
        <ChevronRight className={`size-4 shrink-0 ${active ? "text-emerald-300" : "text-slate-400"}`} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative inline-flex items-center whitespace-nowrap rounded-lg px-2.5 xl:px-3 py-1.5 text-[13px] xl:text-[14px] font-semibold transition-all duration-150 ${
        active
          ? "bg-emerald-50 text-emerald-900 font-bold"
          : "text-slate-700 hover:bg-slate-100/90 hover:text-emerald-950"
      }`}
    >
      <span>{label}</span>
      {active && (
        <span
          className="absolute inset-x-2 -bottom-2 h-0.5 rounded-full bg-emerald-700 shadow-xs"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

function PublicNavLink(props: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  mobile?: boolean;
}) {
  return (
    <Suspense
      fallback={
        <Link
          href={props.href}
          onClick={props.onClick}
          className="whitespace-nowrap px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700"
        >
          {props.label}
        </Link>
      }
    >
      <ActivePublicNavLink {...props} />
    </Suspense>
  );
}

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useLang();

  const getLabel = (key: string) => {
    return t(key, lang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-emerald-800 focus:px-4 focus:py-2 focus:text-white focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Top Reverence & Emergency Triage Ribbon */}
      <div className="bg-emerald-950 text-emerald-100 text-xs border-b border-emerald-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
          {/* Left badge */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex size-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide text-emerald-200 truncate text-[11px] sm:text-xs">
              <span className="hidden sm:inline">Mufti Mehmood Memorial MTI • </span>
              Derajat Shuhada Healthcare Initiative
            </span>
          </div>

          {/* Right utility items */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs font-medium">
            <div className="hidden md:flex items-center gap-1.5 text-emerald-300">
              <HeartPulse className="size-3.5 text-emerald-400 shrink-0" />
              <span>24/7 Priority Emergency Care</span>
            </div>

            <div className="hidden sm:block h-3 w-px bg-emerald-800/80" />

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              aria-label={lang === "en" ? "Switch language to Urdu" : "Switch language to English"}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/70 border border-emerald-700/60 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-white hover:bg-emerald-800 hover:border-emerald-500 transition focus-visible:outline-2 focus-visible:outline-white"
            >
              <Globe className="size-3 text-emerald-400 shrink-0" />
              <span>{lang === "en" ? "اردو" : "English"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          <div className="relative size-10 sm:size-11 rounded-xl bg-emerald-950 p-1.5 shadow-sm border border-emerald-800 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Derajat Shuhada Healthcare Emblem"
              width={34}
              height={34}
              priority
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <span className="block font-heading text-base sm:text-lg font-bold leading-tight tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
              Derajat Shuhada
            </span>
            <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800 leading-tight mt-0.5 truncate">
              Healthcare Initiative
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (No wrapping, fits cleanly on all desktop displays) */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <PublicNavLink
              key={item.href}
              href={item.href}
              label={getLabel(item.labelKey)}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Verify Card Action (High visibility CTA) */}
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 sm:px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition whitespace-nowrap"
          >
            <ShieldCheck className="size-4 shrink-0 text-emerald-200" />
            <span className="hidden xs:inline sm:inline">{getLabel("verify")}</span>
            <span className="inline xs:hidden sm:hidden">Verify</span>
          </Link>

          {/* Staff Login Button (Desktop) */}
          <Link
            href="/login"
            aria-label="Staff Portal Login"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 hover:text-emerald-900 transition whitespace-nowrap"
          >
            <LogIn className="size-3.5 shrink-0 text-slate-500" />
            <span>{getLabel("staffLogin")}</span>
          </Link>

          {/* Mobile Menu Sheet Drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              type="button"
              className="inline-flex size-9.5 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 lg:hidden focus-visible:outline-2 focus-visible:outline-emerald-800 shrink-0"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" showCloseButton={false} className="w-80 max-w-[85vw] p-0 flex flex-col bg-white">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-5 bg-emerald-950 text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-lg bg-emerald-900/80 border border-emerald-700 flex items-center justify-center p-1 shrink-0">
                    <Image
                      src="/images/logo.svg"
                      alt=""
                      width={28}
                      height={28}
                      className="shrink-0"
                    />
                  </div>
                  <div>
                    <span className="font-heading text-base font-bold text-white block leading-tight">
                      Derajat Shuhada
                    </span>
                    <span className="block text-[0.62rem] font-bold uppercase tracking-wider text-emerald-300 mt-0.5">
                      Healthcare Initiative
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-emerald-300 hover:bg-emerald-900 hover:text-white transition"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Quick Verify Bar in Drawer */}
              <div className="p-3 bg-emerald-50 border-b border-emerald-100 shrink-0">
                <Link
                  href="/verify"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <ShieldCheck className="size-4 shrink-0 text-emerald-200" />
                  <span>Verify Health Card (QR / CNIC)</span>
                </Link>
              </div>

              {/* Navigation Links with SVG Icons */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <p className="px-3 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Main Navigation
                </p>
                {NAV_ITEMS.map((item) => (
                  <PublicNavLink
                    key={item.href}
                    href={item.href}
                    label={getLabel(item.labelKey)}
                    icon={item.icon}
                    mobile
                    onClick={() => setMobileOpen(false)}
                  />
                ))}

                <div className="my-3 border-t border-slate-200 pt-3">
                  <p className="px-3 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Additional Support
                  </p>
                  <PublicNavLink
                    href="/sehat-card-plus"
                    label="Sehat Card Plus"
                    icon={CreditCard}
                    mobile
                    onClick={() => setMobileOpen(false)}
                  />
                  <PublicNavLink
                    href="/working-group"
                    label="Working Group"
                    icon={Users2}
                    mobile
                    onClick={() => setMobileOpen(false)}
                  />
                  <PublicNavLink
                    href="/faq"
                    label="FAQs"
                    icon={HelpCircle}
                    mobile
                    onClick={() => setMobileOpen(false)}
                  />
                  <PublicNavLink
                    href="/grievance"
                    label="Lodge a Grievance"
                    icon={MessageSquareWarning}
                    mobile
                    onClick={() => setMobileOpen(false)}
                  />
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-2 shrink-0">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition shadow-2xs"
                >
                  <LogIn className="size-4 text-emerald-800" />
                  <span>{getLabel("staffLogin")}</span>
                </Link>
                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-500">
                    24/7 Family Health Desk • MMM MTI
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

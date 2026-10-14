"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";
import {
  Search,
  Filter,
  Users,
  CreditCard,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Award,
  X,
} from "lucide-react";

export type FamilyListRow = {
  id: number;
  registrationNo: string;
  dateOfRegistration: string | Date;
  shaheedName: string;
  contactName: string;
  contactCnicMasked: string;
  membersCount: number;
  verificationStatus: string | null;
  cardStatus: string | null;
  healthCardNo: string | null;
};

const VERIFICATION_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  VERIFIED_ELIGIBLE: {
    label: "Verified & Eligible",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100",
    icon: CheckCircle2,
  },
  PROVISIONALLY_VERIFIED: {
    label: "Provisionally Verified",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200/80 hover:bg-sky-100",
    icon: Clock,
  },
  ADDITIONAL_DOCUMENTATION_REQUIRED: {
    label: "Docs Required",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100",
    icon: AlertCircle,
  },
  NOT_ELIGIBLE: {
    label: "Not Eligible",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100",
    icon: XCircle,
  },
};

const CARD_STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  ACTIVE: { label: "Active Card", badgeClass: "bg-emerald-600 text-white font-medium" },
  UNDER_VERIFICATION: { label: "In Review", badgeClass: "bg-amber-500 text-white font-medium" },
  TEMPORARILY_SUSPENDED: { label: "Suspended", badgeClass: "bg-rose-600 text-white font-medium" },
  CLOSED: { label: "Closed", badgeClass: "bg-slate-600 text-white font-medium" },
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function FamiliesView({
  rows,
  total,
  page,
  pageSize,
  search,
  status,
  canCreate,
  error,
}: {
  rows: FamilyListRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  status: string;
  canCreate: boolean;
  error?: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const [jumpPage, setJumpPage] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const fromRecord = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const toRecord = Math.min(page * pageSize, total);

  const makeQueryString = (overrides: { page?: number; pageSize?: number; search?: string; status?: string }) => {
    const p = overrides.page !== undefined ? overrides.page : page;
    const ps = overrides.pageSize !== undefined ? overrides.pageSize : pageSize;
    const s = overrides.search !== undefined ? overrides.search : search;
    const st = overrides.status !== undefined ? overrides.status : status;

    const params = new URLSearchParams();
    if (s.trim()) params.set("search", s.trim());
    if (st && st !== "all") params.set("status", st);
    if (ps !== 10) params.set("pageSize", String(ps));
    if (p > 1) params.set("page", String(p));

    const qs = params.toString();
    return qs ? `?${qs}` : "/dashboard/families";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(makeQueryString({ search: searchInput, page: 1 }));
  };

  const handleStatusChange = (newStatus: string) => {
    router.push(makeQueryString({ status: newStatus, page: 1 }));
  };

  const handlePageSizeChange = (newSize: number) => {
    router.push(makeQueryString({ pageSize: newSize, page: 1 }));
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(jumpPage);
    if (target >= 1 && target <= totalPages) {
      router.push(makeQueryString({ page: target }));
      setJumpPage("");
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/dashboard/families");
  };

  const isFiltered = Boolean(search || (status && status !== "all") || pageSize !== 10);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border-l-4 border-emerald-400 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 border border-emerald-500/30">
                Official Registry · Annexure-A
              </span>
            </div>
            <h1 className="mt-1 font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
              Shuhada Families Database
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100/80 max-w-xl">
              One unified digital family registry connecting Shuhada families across DHQ Hospital, Mufti Mehmood Memorial Hospital, and Women & Children Hospital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {canCreate && (
              <Link href="/dashboard/families/new">
                <Button className="h-9 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-xs">
                  <Plus className="size-4" />
                  Register New Family
                </Button>
              </Link>
            )}
            <ExportExcelButton
              filename="dsfhi-families"
              rows={rows.map((row) => ({
                registrationNo: row.registrationNo,
                shaheedName: row.shaheedName,
                contactName: row.contactName,
                contactCnic: row.contactCnicMasked,
                members: row.membersCount,
                verificationStatus: row.verificationStatus ?? "Not recorded",
                cardStatus: row.cardStatus ?? "Not issued",
                healthCardNo: row.healthCardNo,
                dateOfRegistration: row.dateOfRegistration,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Page Size */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 min-w-[280px] max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by Shaheed name, CNIC, Reg. No., or Card No..."
                className="h-9.5 pl-9 pr-8 text-xs sm:text-sm rounded-xl border-slate-200 focus-visible:ring-blue-600"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" className="h-9.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              Search
            </Button>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status:</span>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                aria-label="Filter by verification status"
                className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:border-blue-500 focus:bg-white"
              >
                <option value="all">All Verification Statuses</option>
                <option value="VERIFIED_ELIGIBLE">Verified & Eligible</option>
                <option value="PROVISIONALLY_VERIFIED">Provisionally Verified</option>
                <option value="ADDITIONAL_DOCUMENTATION_REQUIRED">Additional Docs Required</option>
                <option value="NOT_ELIGIBLE">Not Eligible</option>
              </select>
            </div>

            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                aria-label="Rows per page"
                className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 text-xs font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:border-blue-500 focus:bg-white"
              >
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Indicators & Record Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800">{fromRecord}</strong> to{" "}
              <strong className="text-slate-800">{toRecord}</strong> of{" "}
              <strong className="text-slate-900">{total}</strong> families
            </span>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="size-3" />
                Reset filters
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Page {page} of {totalPages}
          </span>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && rows.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center gap-3 text-center shadow-xs">
          <EmptyState
            src="/images/empty-families.jpg"
            alt="Family registry illustration"
            title="No families found matching your criteria."
            description="Try clearing search filters or add a new family to the registry."
          />
          {isFiltered ? (
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
              Clear Search & Filters
            </Button>
          ) : (
            canCreate && (
              <Link href="/dashboard/families/new">
                <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Register New Family</Button>
              </Link>
            )
          )}
        </div>
      )}

      {/* Main Table (Desktop / Tablet) - Protected against text stretching and overflow */}
      {rows.length > 0 && (
        <>
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-4 py-3.5 w-44">
                      Family Reg. No.
                    </th>
                    <th scope="col" className="px-4 py-3.5 min-w-[190px]">
                      Shaheed Particulars
                    </th>
                    <th scope="col" className="px-4 py-3.5 min-w-[200px]">
                      Primary Contact
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-24 text-center">
                      Members
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-44">
                      Verification Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-36">
                      Card Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-32">
                      Reg. Date
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-24 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rows.map((f) => {
                    const verification =
                      (f.verificationStatus && VERIFICATION_CONFIG[f.verificationStatus]) || null;
                    const cardConfig =
                      (f.cardStatus && CARD_STATUS_CONFIG[f.cardStatus]) || null;
                    const VerIcon = verification ? verification.icon : Clock;

                    return (
                      <tr
                        key={f.id}
                        className="group transition-colors hover:bg-blue-50/40"
                      >
                        {/* Registration No */}
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/dashboard/families/${f.id}`}
                            className="inline-flex items-center gap-1.5 font-bold font-mono text-xs text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            <FileText className="size-3.5 text-blue-500 shrink-0" />
                            <span>{f.registrationNo}</span>
                          </Link>
                        </td>

                        {/* Shaheed Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                              <Award className="size-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate" title={f.shaheedName}>
                                {f.shaheedName}
                              </p>
                              <p className="text-[10px] text-emerald-700 font-medium">Honorable Shaheed</p>
                            </div>
                          </div>
                        </td>

                        {/* Primary Contact */}
                        <td className="px-4 py-3.5">
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate" title={f.contactName}>
                              {f.contactName}
                            </p>
                            <p className="font-mono text-[11px] text-slate-400">
                              CNIC: {f.contactCnicMasked}
                            </p>
                          </div>
                        </td>

                        {/* Members count */}
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                            <Users className="size-3 text-slate-500" />
                            {f.membersCount}
                          </span>
                        </td>

                        {/* Verification Status */}
                        <td className="px-4 py-3.5">
                          {verification ? (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${verification.badgeClass}`}
                            >
                              <VerIcon className="size-3.5 shrink-0" />
                              <span>{verification.label}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                              Pending Review
                            </span>
                          )}
                        </td>

                        {/* Card Status */}
                        <td className="px-4 py-3.5">
                          {cardConfig ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap shadow-2xs ${cardConfig.badgeClass}`}
                            >
                              <CreditCard className="size-3 shrink-0" />
                              <span>{cardConfig.label}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                              No Card
                            </span>
                          )}
                        </td>

                        {/* Registration Date */}
                        <td className="px-4 py-3.5 text-slate-500 font-medium text-xs whitespace-nowrap">
                          {new Date(f.dateOfRegistration).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Action Link */}
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/dashboard/families/${f.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-2xs"
                          >
                            <span>Open</span>
                            <ArrowUpRight className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Grid (md:hidden) */}
          <div className="grid gap-3 md:hidden">
            {rows.map((f) => {
              const verification =
                (f.verificationStatus && VERIFICATION_CONFIG[f.verificationStatus]) || null;
              const cardConfig =
                (f.cardStatus && CARD_STATUS_CONFIG[f.cardStatus]) || null;
              const VerIcon = verification ? verification.icon : Clock;

              return (
                <div
                  key={f.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <Link
                      href={`/dashboard/families/${f.id}`}
                      className="font-mono text-xs font-bold text-blue-700 hover:underline"
                    >
                      {f.registrationNo}
                    </Link>
                    <span className="text-[11px] text-slate-400">
                      {new Date(f.dateOfRegistration).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                        <Award className="size-3" />
                      </span>
                      <p className="font-semibold text-sm text-slate-900 truncate">{f.shaheedName}</p>
                    </div>
                    <p className="text-xs text-slate-600 pl-7">
                      Contact: <strong className="text-slate-800">{f.contactName}</strong> ·{" "}
                      <span className="font-mono text-slate-400">{f.contactCnicMasked}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {verification && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${verification.badgeClass}`}
                      >
                        <VerIcon className="size-3" />
                        {verification.label}
                      </span>
                    )}
                    {cardConfig ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${cardConfig.badgeClass}`}
                      >
                        <CreditCard className="size-3" />
                        {cardConfig.label}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        No Card
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ml-auto">
                      <Users className="size-3" />
                      {f.membersCount}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/families/${f.id}`}
                    className="block w-full text-center rounded-xl bg-slate-50 border border-slate-200 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    View Family Dossier &rarr;
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Full Pagination Controls */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Pagination Info */}
              <div className="text-xs text-slate-500 text-center sm:text-left">
                Showing <strong className="text-slate-800">{fromRecord}</strong> to{" "}
                <strong className="text-slate-800">{toRecord}</strong> of{" "}
                <strong className="text-slate-900">{total}</strong> records
              </div>

              {/* Numbered Page Buttons with First / Previous / Next / Last */}
              <div className="flex flex-wrap items-center justify-center gap-1">
                {/* First Page */}
                <Link
                  href={makeQueryString({ page: 1 })}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                  className={`flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                    page <= 1
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  title="First Page"
                >
                  <ChevronsLeft className="size-4" />
                </Link>

                {/* Previous Page */}
                <Link
                  href={makeQueryString({ page: page - 1 })}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                  className={`flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                    page <= 1
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  title="Previous Page"
                >
                  <ChevronLeft className="size-4" />
                </Link>

                {/* Numbered Buttons */}
                {getPageNumbers(page, totalPages).map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex size-8 items-center justify-center text-xs text-slate-400 select-none"
                      >
                        …
                      </span>
                    );
                  }

                  const isCurrent = p === page;
                  return (
                    <Link
                      key={`page-${p}`}
                      href={makeQueryString({ page: p })}
                      className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {/* Next Page */}
                <Link
                  href={makeQueryString({ page: page + 1 })}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : undefined}
                  className={`flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                    page >= totalPages
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  title="Next Page"
                >
                  <ChevronRight className="size-4" />
                </Link>

                {/* Last Page */}
                <Link
                  href={makeQueryString({ page: totalPages })}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : undefined}
                  className={`flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                    page >= totalPages
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  title="Last Page"
                >
                  <ChevronsRight className="size-4" />
                </Link>
              </div>

              {/* Jump to Page Form */}
              {totalPages > 3 && (
                <form
                  onSubmit={handleJumpSubmit}
                  className="flex items-center justify-center gap-1.5 text-xs text-slate-500"
                >
                  <span>Go to:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    placeholder={String(page)}
                    className="h-8 w-14 rounded-lg border border-slate-200 px-2 text-center text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                  <Button type="submit" variant="outline" size="sm" className="h-8 px-2 text-xs">
                    Go
                  </Button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExportExcelButton } from "@/components/dashboard/export-excel-button";

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

const VERIFICATION_LABELS: Record<string, string> = {
  VERIFIED_ELIGIBLE: "Verified & Eligible",
  PROVISIONALLY_VERIFIED: "Provisionally Verified",
  ADDITIONAL_DOCUMENTATION_REQUIRED: "Additional Documentation Required",
  NOT_ELIGIBLE: "Not Eligible",
};

export function verificationLabel(status: string | null): string {
  if (!status) return "Not yet recorded";
  return VERIFICATION_LABELS[status] ?? status;
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
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const qs = (p: number) => `?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&page=${p}`;

  return (
    <div className="space-y-4">
      {/* Page header with illustration */}
      <div className="dashboard-page-heading flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Annexure-A</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Shuhada Families Registry</h1>
            <p className="text-sm text-blue-100/80 mt-0.5">One Family Record · Three Hospitals · One Coordinated Pathway</p>
          </div>
          {canCreate && (
            <Link href="/dashboard/families/new">
              <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-sm">Register New Family</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3"><form method="get" action="/dashboard/families" className="flex flex-wrap gap-2">
        <Input name="search" defaultValue={search} placeholder="Search by Shaheed name, CNIC, registration no., card no. or mobile" className="max-w-md" />
        <select name="status" defaultValue={status} aria-label="Filter by verification status" className="h-9 rounded-md border px-3 text-sm">
          <option value="all">All statuses</option>
          <option value="VERIFIED_ELIGIBLE">Verified & Eligible</option>
          <option value="PROVISIONALLY_VERIFIED">Provisionally Verified</option>
          <option value="ADDITIONAL_DOCUMENTATION_REQUIRED">Additional Documentation Required</option>
          <option value="NOT_ELIGIBLE">Not Eligible</option>
        </select>
        <Button type="submit" variant="outline">Search</Button>
      </form><ExportExcelButton filename="dsfhi-families" rows={rows.map((row) => ({ registrationNo: row.registrationNo, shaheedName: row.shaheedName, contactName: row.contactName, contactCnic: row.contactCnicMasked, members: row.membersCount, verificationStatus: row.verificationStatus ?? "Not recorded", cardStatus: row.cardStatus ?? "Not issued", healthCardNo: row.healthCardNo, dateOfRegistration: row.dateOfRegistration }))} /></div>

      {error && <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!error && rows.length === 0 && (
          <div className="rounded-md border bg-white px-4 py-10 flex flex-col items-center gap-3 text-center">
          <EmptyState src="/images/empty-families.jpg" alt="Family registry illustration" title="No families found." description="Try adjusting your search or register a new family." />
          {canCreate && (
            <Link href="/dashboard/families/new">
              <Button className="bg-blue-600 hover:bg-blue-700">Register New Family</Button>
            </Link>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3">Family Registration No.</th>
                  <th className="px-4 py-3">Name of Shaheed</th>
                  <th className="px-4 py-3">Primary Contact</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3">Card Status</th>
                  <th className="px-4 py-3">Date of Registration</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/dashboard/families/${f.id}`} className="text-blue-700 hover:underline">{f.registrationNo}</Link>
                    </td>
                    <td className="px-4 py-3">{f.shaheedName}</td>
                    <td className="px-4 py-3">{f.contactName} <span className="text-gray-400">{f.contactCnicMasked}</span></td>
                    <td className="px-4 py-3">{f.membersCount}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{verificationLabel(f.verificationStatus)}</Badge></td>
                    <td className="px-4 py-3"><Badge className="bg-emerald-600">{f.cardStatus ?? "No Card"}</Badge></td>
                    <td className="px-4 py-3">{new Date(f.dateOfRegistration).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {rows.map((f) => (
              <Link key={f.id} href={`/dashboard/families/${f.id}`} className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="font-semibold text-blue-900">{f.registrationNo}</p>
                <p className="text-sm">{f.shaheedName}</p>
                <p className="text-sm text-gray-500">{f.contactName} · {f.contactCnicMasked}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{verificationLabel(f.verificationStatus)}</Badge>
                  <Badge className="bg-emerald-600">{f.cardStatus ?? "No Card"}</Badge>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && <Link className="rounded border px-3 py-1" href={qs(page - 1)}>Previous</Link>}
              {page < totalPages && <Link className="rounded border px-3 py-1" href={qs(page + 1)}>Next</Link>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

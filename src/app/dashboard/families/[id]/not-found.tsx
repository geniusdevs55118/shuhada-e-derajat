import Link from "next/link";

export default function FamilyNotFound() {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h2 className="text-lg font-bold text-gray-900">Family not found</h2>
      <p className="mt-2 text-sm text-gray-600">The requested family record does not exist or was removed.</p>
      <Link href="/dashboard/families" className="mt-4 inline-block rounded-md bg-blue-800 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Back to Families
      </Link>
    </div>
  );
}

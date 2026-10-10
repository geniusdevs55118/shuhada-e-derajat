export function Forbidden() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-blue-900">403</p>
      <h1 className="text-xl font-semibold text-gray-900">Access denied</h1>
      <p className="max-w-md text-sm text-gray-600">
        You do not have permission to view this page. If you believe this is a mistake, contact the IT/MIS representative.
      </p>
      <a href="/dashboard" className="rounded-md bg-blue-800 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Back to Dashboard
      </a>
    </div>
  );
}

"use client";

export default function FamiliesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h2 className="text-lg font-bold text-red-700">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-600">Could not load this page. Please try again.</p>
      <button onClick={reset} className="mt-4 rounded-md bg-blue-800 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Try again
      </button>
    </div>
  );
}

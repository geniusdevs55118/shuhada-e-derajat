export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-white p-10 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-blue-900">{title}</h1>
      <p className="mt-3 text-gray-600">Coming soon. This module is being built in a later phase of the DSFHI rollout.</p>
    </div>
  );
}

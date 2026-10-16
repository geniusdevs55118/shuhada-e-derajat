"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Result = { kind: string; title: string; detail: string; href: string };

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        if (response.ok) { const data = await response.json(); setResults(data.results); setOpen(true); }
      } catch { /* ignore requests cancelled by typing */ }
      finally { setLoading(false); }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);
  return <div className="relative hidden w-56 sm:block lg:w-72">
    <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
    <input value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim().length < 2) setOpen(false); }} onFocus={() => results.length && setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} placeholder="Search name, CNIC, card or reg no." aria-label="Search records" className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-[#01411c] focus:ring-1 focus:ring-[#01411c] focus:bg-white transition-all" />
    {open && query.trim().length >= 2 && <div className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">{loading && <p className="p-3 text-xs text-gray-500">Searching…</p>}{results.map((result) => <Link key={`${result.kind}-${result.href}`} href={result.href} onClick={() => { setOpen(false); setQuery(""); }} className="block border-b p-3 last:border-0 hover:bg-emerald-50/70"><span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-800">{result.kind}</span><span className="block text-sm font-medium text-gray-900">{result.title}</span><span className="block text-xs text-gray-500">{result.detail}</span></Link>)}{!loading && results.length === 0 && <p className="p-3 text-sm text-gray-500">No records found.</p>}</div>}
  </div>;
}

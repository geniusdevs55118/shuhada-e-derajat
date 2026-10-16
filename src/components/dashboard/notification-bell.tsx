"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

type Notice = { id: number; title: string; message: string; href: string | null; createdAt: string; readAt: string | null };

export function NotificationBell() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const unread = items.filter((item) => !item.readAt).length;
  useEffect(() => {
    let live = true;
    const refresh = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) { const body = await res.json(); if (live) setItems(body.notifications); }
      } catch { /* remain quiet while the dashboard shell is offline or being rendered in tests */ }
    };
    void refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => { live = false; window.clearInterval(timer); };
  }, []);

  async function markRead(id: number) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((list) => list.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
  }

  return <div className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open} className="relative inline-flex size-9 items-center justify-center rounded-md border border-slate-300 bg-white text-[#01411c] hover:bg-emerald-50 hover:border-[#01411c] transition-colors"><Bell size={17} />{unread > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-[10px] font-bold leading-4 text-white">{unread}</span>}</button>
    {open && <div className="absolute right-0 z-50 mt-2 w-[min(24rem,90vw)] rounded-lg border bg-white p-2 shadow-xl">
      <div className="flex items-center justify-between px-2 py-1"><h2 className="font-semibold text-[#01411c]">Notifications</h2>{unread > 0 && <button type="button" className="text-xs text-[#01411c] font-semibold underline" onClick={async () => { await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) }); setItems((list) => list.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() }))); }}>Mark all read</button>}</div>
      <div className="max-h-80 overflow-y-auto">{items.map((item) => <div key={item.id} className={`border-t p-2 text-sm ${item.readAt ? "" : "bg-red-50"}`}>
        {item.href ? <Link href={item.href} onClick={() => { void markRead(item.id); setOpen(false); }} className="font-semibold text-[#01411c] hover:underline">{item.title}</Link> : <p className="font-semibold text-slate-900">{item.title}</p>}
        <p className="mt-0.5 text-gray-700">{item.message}</p><time className="mt-1 block text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</time>
      </div>)}{items.length === 0 && <p className="border-t px-2 py-5 text-center text-sm text-gray-500">No notifications</p>}</div>
    </div>}
  </div>;
}

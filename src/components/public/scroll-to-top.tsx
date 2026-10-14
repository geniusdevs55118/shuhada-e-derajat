"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll back to top of page"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 cursor-pointer inline-flex size-11 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-900/90 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-emerald-800 hover:shadow-emerald-950/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 animate-in fade-in slide-in-from-bottom-4"
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

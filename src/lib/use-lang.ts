"use client";

import { useSyncExternalStore } from "react";
import { LANG_KEY, type Lang } from "./i18n";

function subscribe(callback: () => void) {
  window.addEventListener("dsfhi-lang-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("dsfhi-lang-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Lang {
  const v = window.localStorage.getItem(LANG_KEY);
  return v === "ur" ? "ur" : "en";
}

function getServerSnapshot(): Lang {
  return "en";
}

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setLang = (l: Lang) => {
    window.localStorage.setItem(LANG_KEY, l);
    window.dispatchEvent(new Event("dsfhi-lang-change"));
  };
  return [lang, setLang];
}

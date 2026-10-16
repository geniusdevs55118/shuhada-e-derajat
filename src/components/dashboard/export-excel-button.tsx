"use client";

import * as XLSX from "xlsx";

export function ExportExcelButton({ filename, rows }: { filename: string; rows: Record<string, string | number | boolean | null | Date>[] }) {
  return <button type="button" disabled={!rows.length} onClick={() => {
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Records");
    XLSX.writeFile(book, `${filename.replace(/[^a-z0-9_-]/gi, "-")}.xlsx`);
  }} className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-[#01411c] hover:bg-emerald-50 hover:border-[#01411c] transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Export Excel</button>;
}

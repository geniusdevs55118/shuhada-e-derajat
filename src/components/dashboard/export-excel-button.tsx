"use client";

import * as XLSX from "xlsx";

export function ExportExcelButton({ filename, rows }: { filename: string; rows: Record<string, string | number | boolean | null | Date>[] }) {
  return <button type="button" disabled={!rows.length} onClick={() => {
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Records");
    XLSX.writeFile(book, `${filename.replace(/[^a-z0-9_-]/gi, "-")}.xlsx`);
  }} className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Export Excel</button>;
}

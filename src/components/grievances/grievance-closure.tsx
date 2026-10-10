"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GrievanceClosure({ id }: { id: number }) {
  const router = useRouter();
  const [status, setStatus] = useState("RESOLVED_CLOSED");
  const [closedBy, setClosedBy] = useState("");
  const [designation, setDesignation] = useState("");
  const [saving, setSaving] = useState(false);

  const close = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/grievances/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closureStatus: status, closedBy, closedByDesignation: designation, closureDate: new Date().toISOString().slice(0, 10) }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed"); return; }
      toast.success("Grievance closed");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-2 font-semibold text-gray-800">Close Grievance</h2>
      <div className="grid gap-3 sm:grid-cols-4">
        <Select value={status} onValueChange={(v) => setStatus(v ?? "RESOLVED_CLOSED")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="RESOLVED_CLOSED">Resolved & Closed</SelectItem>
            <SelectItem value="CLOSED_WITH_CORRECTIVE_ACTION">Closed with Corrective Action</SelectItem>
            <SelectItem value="REFERRED_FOR_FURTHER_REVIEW">Referred for Further Review</SelectItem>
            <SelectItem value="PENDING_FOLLOW_UP">Pending Follow-up</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Closed By" value={closedBy} onChange={(e) => setClosedBy(e.target.value)} />
        <Input placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
        <Button onClick={close} disabled={saving} className="bg-blue-600 hover:bg-blue-700">{saving ? "Closing..." : "Close Grievance"}</Button>
      </div>
    </section>
  );
}

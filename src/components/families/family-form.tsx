"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familySchema, DOCUMENT_OPTIONS, type FamilyFormValues } from "@/lib/family-schemas";
import { formatCnic } from "@/lib/cnic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STEPS = [
  "A. Particulars of Shaheed",
  "B. Primary Family Contact",
  "C. Eligible Family Members",
  "D. Documents Submitted",
  "G. Hospital Access",
  "H. Declaration by Applicant",
  "Review & Submit",
];

const STEP_FIELDS: (keyof FamilyFormValues)[][] = [
  ["shaheedName"],
  ["contactName", "contactRelationship", "contactCnic", "contactMobile"],
  ["members"],
  ["documentsSubmitted"],
  [],
  [],
  [],
];

const HOSPITAL_ACCESS = [
  { key: "hospitalAccessDHQ", label: "District Headquarters Teaching Hospital, Dera Ismail Khan" },
  { key: "hospitalAccessMMMTH", label: "Mufti Mehmood Memorial Teaching Hospital" },
  { key: "hospitalAccessWC", label: "Derajat Women & Children Hospital" },
] as const;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </label>
  );
}

export function FamilyForm({
  mode,
  initial,
  familyId,
}: {
  mode: "create" | "edit";
  initial?: FamilyFormValues;
  familyId?: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<{ message: string; existingFamilyId?: number; registrationNo?: string } | null>(null);
  const [savedFamilyHref, setSavedFamilyHref] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<Record<string, File>>({});

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: initial ?? {
      members: [{ name: "", relationship: "", cnicBForm: "", dobAge: "", mobile: "", status: "" }],
      documentsSubmitted: [],
      hospitalAccessDHQ: false,
      hospitalAccessMMMTH: false,
      hospitalAccessWC: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const documentsOtherChecked = useWatch({ control, name: "documentsOtherChecked" });
  const selectedDocs = useWatch({ control, name: "documentsSubmitted" }) ?? [];
  const allValues = useWatch({ control });

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const toggleDocument = (label: string, checked: boolean) => {
    const set = new Set(selectedDocs);
    if (checked) set.add(label);
    else set.delete(label);
    setValue("documentsSubmitted", Array.from(set), { shouldValidate: true });
  };

  const onSubmit = async (values: FamilyFormValues) => {
    setServerError(null);
    try {
      const res = await fetch(mode === "create" ? "/api/families" : `/api/families/${familyId}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 409) {
        setServerError({ message: body?.error ?? "Duplicate CNIC", existingFamilyId: body?.existingFamilyId, registrationNo: body?.registrationNo });
        return;
      }
      if (!res.ok) {
        setServerError({ message: body?.error ?? "Could not save the family" });
        return;
      }
      const targetId = body.id ?? familyId;
      const uploadErrors: string[] = [];
      for (const [docType, file] of Object.entries(documentFiles)) {
        if (!selectedDocs.includes(docType) && !(docType === "Other" && documentsOtherChecked)) continue;
        const form = new FormData();
        form.set("familyId", String(targetId));
        form.set("docType", docType);
        form.set("file", file);
        const uploaded = await fetch("/api/uploads", { method: "POST", body: form });
        if (!uploaded.ok) {
          const failure = await uploaded.json().catch(() => null);
          uploadErrors.push(`${docType}: ${failure?.error ?? "upload failed"}`);
        }
      }
      if (uploadErrors.length) {
        setServerError({ message: `The family record was saved, but these documents were not uploaded: ${uploadErrors.join("; ")}` });
        setSavedFamilyHref(`/dashboard/families/${targetId}`);
        return;
      }
      router.push(`/dashboard/families/${targetId}`);
      router.refresh();
    } catch {
      setServerError({ message: "Could not save the family" });
    }
  };

  const cnicRegister = (name: "contactCnic" | "shaheedCnic" | "applicantCnic" | `members.${number}.cnicBForm`) =>
    register(name, { onChange: (e: React.ChangeEvent<HTMLInputElement>) => { e.target.value = formatCnic(e.target.value); } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ol className="flex flex-wrap gap-2 text-xs font-semibold">
        {STEPS.map((s, i) => (
          <li key={s} className={`rounded-sm px-3 py-1 ${i === step ? "bg-blue-600 text-white" : i < step ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}>
            {s}
          </li>
        ))}
      </ol>
      <div className="h-1.5 w-full rounded bg-gray-100">
        <div className="h-full rounded bg-blue-600 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      {serverError && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError.message}
          {serverError.existingFamilyId && (
            <>
              {" "}
              <Link href={`/dashboard/families/${serverError.existingFamilyId}`} className="font-semibold underline">
                View existing family {serverError.registrationNo}
              </Link>
            </>
          )}
        </div>
      )}

      {step === 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" error={errors.shaheedName?.message}><Input {...register("shaheedName")} /></Field>
          <Field label="Father's Name"><Input {...register("shaheedFatherName")} /></Field>
          <Field label="CNIC No." error={errors.shaheedCnic?.message}><Input placeholder="12345-1234567-1" {...cnicRegister("shaheedCnic")} /></Field>
          <Field label="Service / Personal No."><Input {...register("shaheedServiceNo")} /></Field>
          <Field label="Rank / Designation"><Input {...register("shaheedRank")} /></Field>
          <Field label="Department / Force / Organization"><Input {...register("shaheedDepartment")} /></Field>
          <Field label="Unit / Formation / Office"><Input {...register("shaheedUnit")} /></Field>
          <Field label="Date of Shahadat"><Input type="date" {...register("shaheedDateOfShahadat")} /></Field>
          <Field label="Place / District of Shahadat"><Input {...register("shaheedPlaceOfShahadat")} /></Field>
          <Field label="Permanent District / Domicile"><Input {...register("shaheedPermanentDistrict")} /></Field>
          <Field label="Permanent Address"><Input {...register("shaheedPermanentAddress")} /></Field>
          <Field label="Shahadat Certificate / Official Verification No."><Input {...register("shahadatCertificateNo")} /></Field>
          <Field label="Issuing / Verifying Authority"><Input {...register("shahadatIssuingAuthority")} /></Field>
        </section>
      )}

      {step === 1 && (
        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Name" error={errors.contactName?.message}><Input {...register("contactName")} /></Field>
          <Field label="Relationship with Shaheed" error={errors.contactRelationship?.message}><Input {...register("contactRelationship")} /></Field>
          <Field label="CNIC No." error={errors.contactCnic?.message}><Input placeholder="12345-1234567-1" {...cnicRegister("contactCnic")} /></Field>
          <Field label="Mobile No." error={errors.contactMobile?.message}><Input {...register("contactMobile")} /></Field>
          <Field label="Alternative Contact"><Input {...register("contactAltContact")} /></Field>
          <Field label="Present Address"><Input {...register("contactPresentAddress")} /></Field>
          <Field label="District"><Input {...register("contactDistrict")} /></Field>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Family Members</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", relationship: "", cnicBForm: "", dobAge: "", mobile: "", status: "" })}>
              Add Member
            </Button>
          </div>
          {errors.members?.root && <p role="alert" className="text-sm text-red-600">{errors.members.root.message}</p>}
          {errors.members && !Array.isArray(errors.members) && typeof errors.members === "object" && "message" in errors.members && (
            <p role="alert" className="text-sm text-red-600">{(errors.members as { message?: string }).message}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-2 py-2">S. No.</th>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Relationship</th>
                  <th className="px-2 py-2">CNIC / B-Form</th>
                  <th className="px-2 py-2">DOB / Age</th>
                  <th className="px-2 py-2">Mobile</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => (
                  <tr key={f.id} className="border-b">
                    <td className="px-2 py-2">{i + 1}</td>
                    <td className="px-2 py-2"><Input {...register(`members.${i}.name`)} aria-label={`Member ${i + 1} Name`} /></td>
                    <td className="px-2 py-2"><Input {...register(`members.${i}.relationship`)} aria-label={`Member ${i + 1} Relationship`} /></td>
                    <td className="px-2 py-2"><Input placeholder="12345-1234567-1" {...cnicRegister(`members.${i}.cnicBForm`)} aria-label={`Member ${i + 1} CNIC / B-Form`} /></td>
                    <td className="px-2 py-2"><Input {...register(`members.${i}.dobAge`)} aria-label={`Member ${i + 1} DOB / Age`} /></td>
                    <td className="px-2 py-2"><Input {...register(`members.${i}.mobile`)} aria-label={`Member ${i + 1} Mobile`} /></td>
                    <td className="px-2 py-2"><Input {...register(`members.${i}.status`)} aria-label={`Member ${i + 1} Status`} /></td>
                    <td className="px-2 py-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} aria-label={`Remove member ${i + 1}`}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Field label="Special Dependency / Disability, if applicable"><Input {...register("specialDependencyDisability")} /></Field>
          {errors.members && Array.isArray(errors.members) && errors.members.map((m, i) => (
            <div key={i}>
              {m?.name && <p role="alert" className="text-sm text-red-600">Member {i + 1}: {m.name.message}</p>}
              {m?.relationship && <p role="alert" className="text-sm text-red-600">Member {i + 1}: {m.relationship.message}</p>}
            </div>
          ))}
        </section>
      )}

      {step === 3 && (
        <section className="space-y-2">
          {DOCUMENT_OPTIONS.map((label) => (
            <div key={label} className="space-y-1 rounded-md border p-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectedDocs.includes(label)} onChange={(e) => toggleDocument(label, e.target.checked)} />
                {label}
              </label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setDocumentFiles((current) => ({ ...current, [label]: file })); if (!selectedDocs.includes(label)) toggleDocument(label, true); } }} className="block w-full text-xs text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-medium file:text-blue-800" aria-label={`Upload ${label}`} />
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("documentsOtherChecked")} />
            Other
          </label>
          {documentsOtherChecked && <Input placeholder="Please specify" {...register("documentsOther")} />}
          {documentsOtherChecked && <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; setDocumentFiles((current) => file ? { ...current, Other: file } : current); }} className="block w-full text-xs text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-medium file:text-blue-800" aria-label="Upload other supporting document" />}
          {errors.documentsSubmitted && <p role="alert" className="text-sm text-red-600">{errors.documentsSubmitted.message}</p>}
        </section>
      )}

      {step === 4 && (
        <section className="space-y-2">
          {HOSPITAL_ACCESS.map((h) => (
            <label key={h.key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register(h.key)} />
              {h.label}
            </label>
          ))}
        </section>
      )}

      {step === 5 && (
        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Applicant Name"><Input {...register("applicantName")} /></Field>
          <Field label="Relationship with Shaheed"><Input {...register("applicantRelationship")} /></Field>
          <Field label="CNIC No." error={errors.applicantCnic?.message}><Input placeholder="12345-1234567-1" {...cnicRegister("applicantCnic")} /></Field>
          <Field label="Signature / Thumb Impression"><Input {...register("applicantSignature")} /></Field>
          <Field label="Date"><Input type="date" {...register("declarationDate")} /></Field>
        </section>
      )}

      {step === 6 && (
        <section className="space-y-2 text-sm text-gray-700">
          <h3 className="font-semibold">Review</h3>
          <p>Shaheed: {allValues.shaheedName || "—"}</p>
          <p>Contact: {allValues.contactName || "—"} · {allValues.contactCnic || "—"} · {allValues.contactMobile || "—"}</p>
          <p>Members: {(allValues.members ?? []).length}</p>
          <p>Documents: {selectedDocs.length}</p>
          <p>Hospital access: {[allValues.hospitalAccessDHQ && "DHQ", allValues.hospitalAccessMMMTH && "MMMTH", allValues.hospitalAccessWC && "W&C"].filter(Boolean).join(", ") || "—"}</p>
          <p>Applicant: {allValues.applicantName || "—"}</p>
        </section>
      )}

      <div className="flex justify-between">
        {step > 0 ? <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button> : <span />}
        {step < STEPS.length - 1 ? (
          <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={next}>Next</Button>
        ) : (
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Register Family" : "Save Changes"}
          </Button>
        )}
      </div>
      {savedFamilyHref && <Link href={savedFamilyHref} className="text-sm font-semibold text-blue-800 underline">Open the saved family record to retry document uploads</Link>}
    </form>
  );
}

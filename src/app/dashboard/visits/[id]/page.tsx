import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { hospitalScope, logForbidden } from "@/lib/permissions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Forbidden } from "@/components/dashboard/forbidden";

export const instant = false;

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  const { id } = await params;

  const visit = await prisma.visit.findUnique({ where: { id: Number(id) } });
  if (!visit) notFound();

  const scope = hospitalScope(session, "visit");
  if (typeof scope.hospitalId === "number" && visit.hospitalId !== scope.hospitalId) {
    await logForbidden(session, "visit");
    return <Forbidden />;
  }

  const hospital = await prisma.hospital.findUnique({ where: { id: visit.hospitalId } });
  const flags = (visit.emergencyFlags ?? {}) as Record<string, unknown>;
  const isEmergency = flags.emergencyCase === true || visit.verification === "EMERGENCY_VERIFICATION_IN_PROCESS";
  const natures = Array.isArray(visit.natureOfHealthcare) ? (visit.natureOfHealthcare as string[]) : [];
  const picked = (o: unknown) => Object.keys((o ?? {}) as Record<string, boolean>).filter((k) => ((o as Record<string, boolean>) ?? {})[k]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Visit {visit.visitNo}</h1>
          <p className="text-sm text-gray-600">{new Date(visit.dateTime).toLocaleString()} - {hospital?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {isEmergency && <Badge className="bg-red-600">EMERGENCY</Badge>}
          <Link href={`/api/visits/${visit.id}/pdf`} target="_blank"><Button variant="outline">Download PDF</Button></Link>
        </div>
      </div>

      <Section title="A. Beneficiary Particulars">
        <Row k="Name" v={visit.beneficiaryName} />
        <Row k="Father / Spouse / Guardian" v={visit.beneficiaryFatherHusbandGuardian} />
        <Row k="CNIC / B-Form" v={visit.beneficiaryCnicBForm} />
        <Row k="Relationship" v={visit.beneficiaryRelationship} />
        <Row k="Mobile" v={visit.beneficiaryMobile} />
        <Row k="Name of Shaheed" v={visit.shaheedName} />
        <Row k="Verification" v={visit.verification} />
      </Section>
      <Section title="B. Hospital / Health Desk">
        <Row k="Hospital" v={hospital?.name} />
        <Row k="Facilitation Officer" v={visit.facilitationOfficer} />
      </Section>
      <Section title="C. Nature of Healthcare">
        <p className="text-sm text-gray-700">{natures.join(", ") || "-"}</p>
      </Section>
      <Section title="D. Clinical Facilitation">
        <Row k="Department" v={visit.department} />
        <Row k="Consultant" v={visit.consultant} />
        <Row k="OPD / MR No" v={visit.opdMrNo} />
        <Row k="Diagnosis" v={visit.diagnosis} />
        <Row k="Plan" v={visit.treatmentPlan} />
      </Section>
      <Section title="E. Diagnostics">
        <p className="text-sm text-gray-700">{picked(visit.diagnostics).join(", ") || "-"} ({visit.investigationsStatus ?? "-"})</p>
      </Section>
      <Section title="F. Medicines">
        <p className="text-sm text-gray-700">{picked(visit.medicinesFlags).join(", ") || "-"}</p>
      </Section>
      <Section title="G. Admission / Procedure">
        <Row k="Ward" v={visit.ward} />
        <Row k="Procedure" v={visit.procedureName} />
        <Row k="Status" v={visit.procedureStatus} />
      </Section>
      <Section title="H. Sehat Card Plus">
        <p className="text-sm text-gray-700">{picked(visit.sehatFlags).join(", ") || "-"}</p>
        <Row k="Case Ref" v={visit.sehatCaseRef} />
      </Section>
      <Section title="I. Emergency Facilitation">
        <Row k="Emergency Case" v={flags.emergencyCase === true ? "Yes" : "No"} />
        <Row k="Triage Completed" v={flags.triageCompleted === true ? "Yes" : "No"} />
        <Row k="Immediate Treatment" v={flags.immediateTreatmentInitiated === true ? "Yes" : "No"} />
      </Section>
      <Section title="K. Health Desk Action & Outcome">
        <p className="text-sm text-gray-700">{picked(visit.healthDeskActions).join(", ") || "-"}</p>
        <Row k="Issue" v={visit.issueEncountered} />
        <Row k="Action Taken" v={visit.actionTaken} />
        <Row k="Final Status" v={visit.finalStatus} />
      </Section>
      <Section title="L. Feedback">
        <p className="text-sm text-gray-700">{picked(visit.feedbackFlags).join(", ") || "-"}</p>
        <Row k="Comments" v={visit.feedbackComments} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-2 font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <p className="text-sm text-gray-700"><span className="font-medium text-gray-900">{k}:</span> {v ?? "-"}</p>
  );
}

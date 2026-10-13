import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can, hospitalScope, logForbidden } from "@/lib/permissions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Forbidden } from "@/components/dashboard/forbidden";
import { GrievanceClosure } from "@/components/grievances/grievance-closure";
import { GrievanceResolution, GrievanceWorkingGroupReview } from "@/components/grievances/grievance-resolution";

export const instant = false;

const picked = (o: unknown) => Object.keys((o ?? {}) as Record<string, boolean>).filter((k) => ((o as Record<string, boolean>) ?? {})[k]);

export default async function GrievanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  const { id } = await params;

  const grievance = await prisma.grievance.findUnique({ where: { id: Number(id) } });
  if (!grievance) notFound();
  const scope = hospitalScope(session, "grievance");
  if (typeof scope.hospitalId === "number" && grievance.hospitalId !== scope.hospitalId) {
    await logForbidden(session, "grievance");
    return <Forbidden />;
  }

  const hospital = await prisma.hospital.findUnique({ where: { id: grievance.hospitalId } });
  const canClose = can(session, "grievance", "closure");
  const canResolve = can(session, "grievance", "create") && !grievance.closureStatus;
  const canReview = can(session, "grievance", "working_group_review");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Grievance {grievance.grievanceNo}</h1>
          <p className="text-sm text-gray-600">{new Date(grievance.dateTime).toLocaleString()} - {hospital?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={grievance.priority === "IMMEDIATE_PATIENT_SAFETY" ? "bg-red-600" : grievance.priority === "URGENT" ? "bg-amber-500" : "bg-emerald-600"}>
            {grievance.isRedAlert ? "RED ALERT" : grievance.priority}
          </Badge>
          <Link href={`/api/grievances/${grievance.id}/pdf`} target="_blank"><Button variant="outline">Download PDF</Button></Link>
        </div>
      </div>

      <Section title="A. Beneficiary Details">
        <Row k="Name" v={grievance.beneficiaryName} />
        <Row k="Reg No" v={grievance.familyRegistrationNo} />
        <Row k="Card No" v={grievance.healthCardNo} />
        <Row k="CNIC" v={grievance.cnicBForm} />
        <Row k="Shaheed" v={grievance.shaheedName} />
        <Row k="Contact" v={grievance.contactNo} />
      </Section>
      <Section title="B. Hospital / Service Point">
        <Row k="Hospital" v={hospital?.name} />
        <Row k="Department" v={grievance.department} />
        <Row k="Health Desk" v={grievance.healthDesk} />
      </Section>
      <Section title="C. Nature of Grievance">
        <p className="text-sm text-gray-700">{picked(grievance.natureFlags).join(", ") || "-"}</p>
      </Section>
      <Section title="D. Brief Description">
        <p className="text-sm text-gray-700">{grievance.issueDescription ?? "-"}</p>
        <Row k="Immediate healthcare need" v={grievance.immediateHealthcareNeed === true ? "Yes" : grievance.immediateHealthcareNeed === false ? "No" : null} />
        <Row k="Delay may affect care" v={grievance.delayMayAffectCare === true ? "Yes" : grievance.delayMayAffectCare === false ? "No" : null} />
      </Section>
      <Section title="E. Rapid Escalation Screen">
        <Row k="RED" v={picked(grievance.redFlags).join(", ") || "-"} />
        <Row k="AMBER" v={picked(grievance.amberFlags).join(", ") || "-"} />
        <Row k="GREEN" v={picked(grievance.greenFlags).join(", ") || "-"} />
      </Section>
      <Section title="H. Clinical Safeguard">
        <p className="text-sm text-gray-700">Emergency care and immediate clinical assessment shall not be delayed while this grievance is processed.</p>
      </Section>
      <Section title="F. Immediate Action">
        <Row k="Immediate Action Taken" v={grievance.immediateActionTaken} />
        <Row k="Resolved at Health Desk" v={grievance.resolvedAtHealthDesk} />
      </Section>
      <Section title="G. Escalation">
        <Row k="Escalated To" v={grievance.escalatedTo} />
        <Row k="Designation" v={grievance.escalationDesignation} />
        <Row k="Reason" v={grievance.escalationReason} />
      </Section>
      <Section title="I. Action / Resolution">
        <Row k="Action Taken" v={grievance.actionTaken} />
        <Row k="Responsible Dept / Officer" v={grievance.responsibleDeptOfficer} />
        <Row k="Outcome" v={grievance.outcome} />
        <Row k="Remarks" v={grievance.remarks} />
      </Section>
      <Section title="J. Beneficiary Confirmation">
        <Row k="Explained" v={grievance.issueExplainedAppropriately === true ? "Yes" : grievance.issueExplainedAppropriately === false ? "No" : null} />
        <Row k="Facilitation Provided" v={grievance.facilitationProvided} />
        <Row k="Comments" v={grievance.beneficiaryComments} />
      </Section>
      <Section title="K. Root Cause &amp; Corrective Action">
        <Row k="Root Cause" v={grievance.rootCause} />
        <Row k="Corrective Action" v={grievance.correctiveAction} />
        <Row k="Preventive Action" v={grievance.preventiveActionRequired} />
        <Row k="Responsible Officer / Dept" v={grievance.responsibleOfficerDept} />
        <Row k="Target Completion" v={grievance.targetCompletionDate ? new Date(grievance.targetCompletionDate).toLocaleDateString() : null} />
        <Row k="Status" v={grievance.actionCompleted} />
      </Section>
      <Section title="L. Working Group Review">
        <Row k="Review Required" v={grievance.requiresWorkingGroupReview === true ? "Yes" : grievance.requiresWorkingGroupReview === false ? "No" : null} />
        <Row k="Reviewed By" v={grievance.reviewedBy} />
        <Row k="Observations" v={grievance.observations} />
        <Row k="Directions" v={grievance.furtherDirections} />
      </Section>
      <Section title="M. Closure">
        <Row k="Status" v={grievance.closureStatus} />
        <Row k="Closed By" v={grievance.closedBy} />
        <Row k="Date" v={grievance.closureDate} />
      </Section>

      {canResolve && (
        <GrievanceResolution
          id={grievance.id}
          initial={{
            immediateActionTaken: grievance.immediateActionTaken,
            escalatedTo: grievance.escalatedTo,
            escalationDesignation: grievance.escalationDesignation,
            escalationReason: grievance.escalationReason,
            actionTaken: grievance.actionTaken,
            responsibleDeptOfficer: grievance.responsibleDeptOfficer,
            outcome: grievance.outcome,
            remarks: grievance.remarks,
            issueExplainedAppropriately: grievance.issueExplainedAppropriately,
            facilitationProvided: grievance.facilitationProvided,
            beneficiaryComments: grievance.beneficiaryComments,
            rootCause: grievance.rootCause,
            correctiveAction: grievance.correctiveAction,
            preventiveActionRequired: grievance.preventiveActionRequired,
            responsibleOfficerDept: grievance.responsibleOfficerDept,
            targetCompletionDate: grievance.targetCompletionDate
              ? new Date(grievance.targetCompletionDate).toISOString().slice(0, 10)
              : null,
            actionCompleted: grievance.actionCompleted,
          }}
        />
      )}
      {canReview && (
        <GrievanceWorkingGroupReview
          id={grievance.id}
          initial={{
            requiresWorkingGroupReview: grievance.requiresWorkingGroupReview,
            reviewedBy: grievance.reviewedBy,
            observations: grievance.observations,
            furtherDirections: grievance.furtherDirections,
          }}
        />
      )}

      {canClose && !grievance.closureStatus && <GrievanceClosure id={grievance.id} />}
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
  return <p className="text-sm text-gray-700"><span className="font-medium text-gray-900">{k}:</span> {v ?? "-"}</p>;
}

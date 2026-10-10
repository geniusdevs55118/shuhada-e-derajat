import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimitCheck } from "@/lib/rate-limit-ip";
import { notifyRedGrievance } from "@/lib/notifications";

const schema = z.object({
  hospitalCode: z.enum(["DHQ", "MMMTH", "WC"]),
  beneficiaryName: z.string().trim().min(1).max(120),
  contactNo: z.string().trim().max(40).optional(),
  nature: z.string().trim().min(1).max(100),
  issueDescription: z.string().trim().min(10).max(3000),
  priority: z.enum(["ROUTINE", "URGENT", "IMMEDIATE_PATIENT_SAFETY"]),
  immediateHealthcareNeed: z.boolean(),
  delayMayAffectCare: z.boolean(),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitCheck(`public-grievance:${ip}`, 5, 60 * 60 * 1000)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the required fields and try again", issues: parsed.error.issues }, { status: 400 });
  const values = parsed.data;
  const hospital = await prisma.hospital.findUnique({ where: { code: values.hospitalCode }, select: { id: true, code: true } });
  if (!hospital) return NextResponse.json({ error: "Select a valid hospital" }, { status: 400 });
  const red = values.priority === "IMMEDIATE_PATIENT_SAFETY" || (values.immediateHealthcareNeed && values.delayMayAffectCare);
  const grievanceNo = await generatePublicGrievanceNo(hospital.code);
  const grievance = await prisma.grievance.create({ data: {
    grievanceNo,
    dateTime: new Date(),
    priority: red ? "IMMEDIATE_PATIENT_SAFETY" : values.priority,
    isRedAlert: red,
    hospitalId: hospital.id,
    beneficiaryName: values.beneficiaryName,
    contactNo: values.contactNo || null,
    natureFlags: { [values.nature]: true },
    issueDescription: values.issueDescription,
    immediateHealthcareNeed: values.immediateHealthcareNeed,
    delayMayAffectCare: values.delayMayAffectCare,
    redFlags: { emergencyTreatmentDelayed: red },
    amberFlags: {},
    greenFlags: {},
    escalationModes: {},
  } });
  if (red) await notifyRedGrievance({ id: grievance.id, grievanceNo: grievance.grievanceNo, beneficiaryName: grievance.beneficiaryName, hospitalId: grievance.hospitalId });
  await prisma.auditLog.create({ data: { who: "public", role: "public", action: red ? "public_red_grievance" : "public_grievance", entity: "grievance", entityId: String(grievance.id), hospitalId: hospital.id } }).catch(() => {});
  return NextResponse.json({ ok: true, grievanceNo: grievance.grievanceNo, urgent: red }, { status: 201 });
}

async function generatePublicGrievanceNo(code: string) {
  const now = new Date();
  const prefix = `GRV-${code}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-`;
  const last = await prisma.grievance.findFirst({ where: { grievanceNo: { startsWith: prefix } }, orderBy: { grievanceNo: "desc" }, select: { grievanceNo: true } });
  return `${prefix}${String(last ? Number(last.grievanceNo.slice(prefix.length)) + 1 : 1).padStart(4, "0")}`;
}
